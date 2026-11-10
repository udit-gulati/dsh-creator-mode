/**
 * dsh-output-modes — host half.
 *
 * Adds per-session "output type" and "level" selections that travel with the
 * user's next message. The selected contract is injected as an agent-scoped
 * system-prompt section, the finished answer is validated before the turn is
 * allowed to close, and failures steer the model into a bounded repair step.
 * Successful file/command outputs can be served back through the DSH web
 * origin (or a local dev server) for preview.
 *
 * The host half deliberately has no runtime dependency on DSH packages: the
 * bundle patch mounts it inside the DSH host, where Cordis injects the
 * `agents` service, and plain Node built-ins do the rest.
 */

import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import {
  mkdirSync, readFileSync, renameSync, statSync, writeFileSync,
} from 'node:fs'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { createServer as createNetServer } from 'node:net'
import { homedir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'

export const name = 'output-modes'
export const inject = ['agents']

const PLUGIN_VERSION = '0.0.1'
const CONFIG_VERSION = 1
const SECTION_NAME = 'output-modes:contract'
const SECTION_ORDER = 9500
const DEFAULT_MAX_RETRIES = 2
const MAX_RETRIES_LIMIT = 5
const MAX_CONFIG_BYTES = 1_500_000
const MAX_COMMAND_OUTPUT = 12_000
const RUNS_DIR = '.dsh-output-modes'

/** Output types shipped on first run; a user config file replaces them wholesale. */
function defaultConfig() {
  return {
    version: CONFIG_VERSION,
    defaults: { typeId: 'detailed', modeId: 'balanced' },
    types: [
      {
        id: 'detailed',
        name: 'Detailed answer',
        description: 'The model writes naturally: full paragraphs, examples, and explanation.',
        output: 'text',
        instructions: '',
        validation: { kind: 'none' },
        serve: { kind: 'none' },
        maxRetries: 0,
      },
      {
        id: 'short',
        name: 'Short answer',
        description: 'A direct answer capped at 120 words, with no preamble.',
        output: 'text',
        instructions: 'Answer the question directly. Do not restate the question, do not add a preamble, and do not add optional background. Prefer one short paragraph or a compact list.',
        validation: { kind: 'maxWords', maxWords: 120 },
        serve: { kind: 'none' },
        maxRetries: 1,
      },
      {
        id: 'json',
        name: 'Structured JSON',
        description: 'A single JSON object validated against a small schema.',
        output: 'json',
        instructions: 'Return exactly one JSON object. Do not wrap it in prose. Put the complete object in a fenced ```json code block so it is easy to extract.',
        validation: {
          kind: 'json',
          schema: {
            type: 'object',
            additionalProperties: true,
            required: ['summary', 'items'],
            properties: {
              summary: { type: 'string', minLength: 1 },
              items: {
                type: 'array',
                minItems: 1,
                items: {
                  type: 'object',
                  required: ['title'],
                  additionalProperties: true,
                  properties: { title: { type: 'string', minLength: 1 } },
                },
              },
            },
          },
        },
        serve: { kind: 'none' },
        maxRetries: 2,
      },
      {
        id: 'react-app',
        name: 'React app',
        description: 'A runnable single-file React app, served inside DSH after validation.',
        output: 'files',
        instructions: [
          'Build a small, complete React single-page app that demonstrates the requested result.',
          'Deliver exactly one file, `index.html`, inside the run directory named below. The app must be self-contained apart from CDN script tags.',
          'Load React 18 UMD (production) and Babel standalone from unpkg or jsDelivr, mount the app into an element with id="root", and put all JSX in a `<script type="text/babel">` block.',
          'Do not use a build step, npm install, or a dev server. Add styling in a `<style>` block. The app must render without console errors and fit a 900x640 viewport.',
          'Keep the final chat reply short: name the app and say it is ready to preview.',
        ].join('\n'),
        validation: {
          kind: 'files',
          files: [
            { path: 'index.html', contains: 'id="root"' },
            { path: 'index.html', contains: 'react' },
            { path: 'index.html', contains: 'text/babel' },
          ],
        },
        serve: { kind: 'static', file: 'index.html' },
        maxRetries: 2,
      },
    ],
    modes: [
      {
        id: 'concise',
        name: 'Concise',
        description: 'Shortest complete answer; skip preamble, repetition, and optional background.',
        instructions: 'Prefer the shortest complete answer. Omit preamble, repetition, and optional background. Keep examples minimal.',
      },
      {
        id: 'balanced',
        name: 'Balanced',
        description: 'The default amount of detail for the chosen output type.',
        instructions: '',
      },
      {
        id: 'exhaustive',
        name: 'Exhaustive',
        description: 'Thorough treatment with reasoning, examples, edge cases, and a summary.',
        instructions: 'Be thorough: explain the reasoning, include concrete examples and edge cases, and finish with a short summary. Use headings and lists where they help.',
      },
    ],
  }
}

const CONFIG_PATH = join(dshHome(), 'output-modes.json')
const SELECTION_PATH = join(dshHome(), 'output-modes-state.json')
const FALLBACK_HOME = dshHome()

/** Resolve the DSH home the same way the launcher does. */
function dshHome() {
  const home = process.env.DSH_HOME
  return home && home.trim() !== '' ? resolve(home) : join(homedir(), '.dsh')
}

/** Structured clone for plain JSON values (keeps the module dependency-free). */
function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function truncate(value, max) {
  const text = String(value ?? '')
  return text.length <= max ? text : `${text.slice(0, max)}…`
}

function slugify(value, fallback = 'type') {
  const slug = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return slug === '' ? fallback : slug
}

function uniqueId(base, taken) {
  let candidate = base
  let index = 2
  while (taken.has(candidate)) {
    candidate = `${base}-${index}`
    index += 1
  }
  taken.add(candidate)
  return candidate
}

function atomicWriteSync(file, text) {
  mkdirSync(dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.${Date.now()}.tmp`
  writeFileSync(temporary, text, 'utf8')
  renameSync(temporary, file)
}

async function atomicWrite(file, text) {
  await mkdir(dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.${Date.now()}.tmp`
  await writeFile(temporary, text, 'utf8')
  await rename(temporary, file)
}

/**
 * Normalize one output type, collecting human-readable errors.
 * @param {unknown} value raw candidate
 * @param {number} index position in the types array
 * @param {Set<string>} ids ids already used
 * @param {string[]} errors collector
 */
function normalizeType(value, index, ids, errors) {
  const where = `types[${index}]`
  if (!isRecord(value)) {
    errors.push(`${where} must be an object`)
    return null
  }
  const name = asString(value.name).trim() || `Output type ${index + 1}`
  const requestedId = slugify(value.id ?? name, `type-${index + 1}`)
  if (ids.has(requestedId)) errors.push(`${where}.id "${requestedId}" is duplicated`)
  const id = uniqueId(requestedId, ids)
  const output = ['text', 'json', 'files'].includes(value.output) ? value.output : 'text'
  let validation = { kind: 'none' }
  if (isRecord(value.validation)) {
    const kind = value.validation.kind
    if (kind === 'maxWords') {
      const maxWords = Number(value.validation.maxWords)
      if (!Number.isInteger(maxWords) || maxWords < 1 || maxWords > 100_000) {
        errors.push(`${where}.validation.maxWords must be an integer between 1 and 100000`)
      } else {
        validation = { kind: 'maxWords', maxWords }
      }
    } else if (kind === 'json') {
      if (!isRecord(value.validation.schema)) {
        errors.push(`${where}.validation.schema must be a JSON object`)
      } else {
        validation = { kind: 'json', schema: clone(value.validation.schema) }
      }
    } else if (kind === 'files') {
      const files = Array.isArray(value.validation.files) ? value.validation.files : []
      const normalized = []
      for (const [fileIndex, file] of files.entries()) {
        if (!isRecord(file) || asString(file.path).trim() === '') {
          errors.push(`${where}.validation.files[${fileIndex}] needs a non-empty path`)
          continue
        }
        normalized.push({
          path: asString(file.path).trim(),
          ...(asString(file.contains) !== '' ? { contains: asString(file.contains) } : {}),
        })
      }
      if (normalized.length === 0) errors.push(`${where}.validation.files must list at least one file`)
      validation = { kind: 'files', files: normalized }
    } else if (kind === 'command') {
      const command = asString(value.validation.command).trim()
      if (command === '') errors.push(`${where}.validation.command is required`)
      const timeoutMs = Number(value.validation.timeoutMs ?? 60_000)
      if (!Number.isFinite(timeoutMs) || timeoutMs < 1_000 || timeoutMs > 300_000) {
        errors.push(`${where}.validation.timeoutMs must be between 1000 and 300000`)
      }
      validation = { kind: 'command', command, timeoutMs: Math.min(300_000, Math.max(1_000, Math.round(timeoutMs))) }
    } else if (kind !== 'none' && kind !== undefined) {
      errors.push(`${where}.validation.kind must be one of none, maxWords, json, files, command`)
    }
  }
  let serve = { kind: 'none' }
  if (isRecord(value.serve)) {
    const kind = value.serve.kind
    if (kind === 'static') {
      serve = { kind: 'static', file: asString(value.serve.file, 'index.html').trim() || 'index.html' }
    } else if (kind === 'command') {
      const command = asString(value.serve.command).trim()
      if (command === '') errors.push(`${where}.serve.command is required`)
      const readyTimeoutMs = Number(value.serve.readyTimeoutMs ?? 20_000)
      serve = {
        kind: 'command',
        command,
        urlTemplate: asString(value.serve.urlTemplate, 'http://127.0.0.1:{port}/') || 'http://127.0.0.1:{port}/',
        readyTimeoutMs: Math.min(120_000, Math.max(1_000, Number.isFinite(readyTimeoutMs) ? Math.round(readyTimeoutMs) : 20_000)),
      }
    } else if (kind !== 'none' && kind !== undefined) {
      errors.push(`${where}.serve.kind must be one of none, static, command`)
    }
  }
  const maxRetries = Number(value.maxRetries ?? DEFAULT_MAX_RETRIES)
  return {
    id,
    name,
    description: asString(value.description),
    output,
    instructions: asString(value.instructions),
    validation,
    serve,
    maxRetries: Math.min(MAX_RETRIES_LIMIT, Math.max(0, Number.isFinite(maxRetries) ? Math.round(maxRetries) : DEFAULT_MAX_RETRIES)),
  }
}

/**
 * Normalize one level (mode), collecting errors.
 * @param {unknown} value raw candidate
 * @param {number} index position in the modes array
 * @param {Set<string>} ids ids already used
 * @param {string[]} errors collector
 */
function normalizeMode(value, index, ids, errors) {
  const where = `modes[${index}]`
  if (!isRecord(value)) {
    errors.push(`${where} must be an object`)
    return null
  }
  const name = asString(value.name).trim() || `Level ${index + 1}`
  const requestedId = slugify(value.id ?? name, `mode-${index + 1}`)
  if (ids.has(requestedId)) errors.push(`${where}.id "${requestedId}" is duplicated`)
  const id = uniqueId(requestedId, ids)
  return {
    id,
    name,
    description: asString(value.description),
    instructions: asString(value.instructions),
  }
}

/**
 * Validate a whole config document against the plugin's schema.
 * @param {unknown} raw candidate config
 * @returns {{ config: any, errors: string[] }}
 */
function normalizeConfig(raw) {
  const errors = []
  const fallback = defaultConfig()
  if (!isRecord(raw)) {
    return { config: fallback, errors: ['Configuration must be a JSON object'] }
  }
  const types = Array.isArray(raw.types) ? raw.types : []
  const modes = Array.isArray(raw.modes) ? raw.modes : []
  if (types.length === 0) errors.push('types must contain at least one output type')
  if (modes.length === 0) errors.push('modes must contain at least one level')
  const typeIds = new Set()
  const modeIds = new Set()
  const normalizedTypes = types.map((value, index) => normalizeType(value, index, typeIds, errors)).filter(Boolean)
  const normalizedModes = modes.map((value, index) => normalizeMode(value, index, modeIds, errors)).filter(Boolean)
  const requestedDefaults = isRecord(raw.defaults) ? raw.defaults : {}
  const typeId = normalizedTypes.some(type => type.id === requestedDefaults.typeId)
    ? requestedDefaults.typeId
    : normalizedTypes[0]?.id ?? 'detailed'
  const modeId = normalizedModes.some(mode => mode.id === requestedDefaults.modeId)
    ? requestedDefaults.modeId
    : normalizedModes[0]?.id ?? 'balanced'
  if (errors.length > 0) {
    return { config: fallback, errors }
  }
  return {
    config: {
      version: CONFIG_VERSION,
      defaults: { typeId, modeId },
      types: normalizedTypes,
      modes: normalizedModes,
    },
    errors,
  }
}

/** Read the config file, seeding defaults when it does not exist. */
function loadConfig() {
  try {
    const text = readFileSync(CONFIG_PATH, 'utf8')
    if (text.length > MAX_CONFIG_BYTES) {
      return { config: defaultConfig(), error: `Configuration file is larger than ${MAX_CONFIG_BYTES} bytes` }
    }
    const parsed = JSON.parse(text)
    const { config, errors } = normalizeConfig(parsed)
    return { config, error: errors.length > 0 ? errors.join('; ') : null }
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      const config = defaultConfig()
      try {
        atomicWriteSync(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`)
        return { config, error: null }
      } catch (writeError) {
        return { config, error: `Could not create ${CONFIG_PATH}: ${writeError.message}` }
      }
    }
    return { config: defaultConfig(), error: `Could not read ${CONFIG_PATH}: ${error.message}` }
  }
}

/** Read persisted per-session selections. */
function loadSelections() {
  try {
    const parsed = JSON.parse(readFileSync(SELECTION_PATH, 'utf8'))
    if (!isRecord(parsed) || !isRecord(parsed.selections)) return {}
    const selections = {}
    for (const [sessionId, value] of Object.entries(parsed.selections)) {
      if (typeof sessionId === 'string' && isRecord(value)) {
        selections[sessionId] = {
          typeId: asString(value.typeId),
          modeId: asString(value.modeId),
          updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : undefined,
        }
      }
    }
    return selections
  } catch {
    return {}
  }
}

/** Persist per-session selections. */
function saveSelections(selections) {
  atomicWriteSync(SELECTION_PATH, `${JSON.stringify({ selections }, null, 2)}\n`)
}

/** The absolute run directory for one session turn. */
function runDirFor(session, turn) {
  const cwd = session.header.cwd || process.cwd()
  const sessionPart = slugify(session.id, 'session')
  return join(resolve(cwd), RUNS_DIR, 'runs', sessionPart, String(turn))
}

/** Build a URL-safe preview path relative to the app base. */
function previewPath(sessionId, turn) {
  const query = new URLSearchParams({ sessionId, turn: String(turn) })
  return `api/output-modes/preview?${query.toString()}`
}

/** Extract the final assistant text for a turn from the durable log. */
function assistantText(session, turn) {
  let text = ''
  for (const event of session.snapshotEvents()) {
    if (event.type !== 'assistant/message' || event.data.turn !== turn) continue
    const blocks = event.data.message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
    if (blocks.length > 0) text = blocks.join('\n\n')
  }
  return text.trim()
}

/** Pull a JSON value out of a fenced or bare final answer. */
function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const candidate = (fenced ? fenced[1] : text).trim()
  return JSON.parse(candidate)
}

/** Count words in a plain-text answer. */
function wordCount(text) {
  const words = text.trim().match(/\S+/g)
  return words ? words.length : 0
}

/**
 * Validate one value against the JSON-Schema subset the editor offers.
 * @param {unknown} value parsed JSON value
 * @param {any} schema schema object
 * @param {string} path JSON path for messages
 * @param {string[]} errors collector
 */
function validateSchema(value, schema, path, errors) {
  if (!isRecord(schema)) return
  if (schema.const !== undefined && JSON.stringify(value) !== JSON.stringify(schema.const)) {
    errors.push(`${path || 'value'} must equal ${JSON.stringify(schema.const)}`)
    return
  }
  if (Array.isArray(schema.enum) && !schema.enum.some(entry => JSON.stringify(entry) === JSON.stringify(value))) {
    errors.push(`${path || 'value'} must be one of ${schema.enum.map(entry => JSON.stringify(entry)).join(', ')}`)
    return
  }
  if (Array.isArray(schema.allOf)) {
    for (const subschema of schema.allOf) validateSchema(value, subschema, path, errors)
  }
  if (Array.isArray(schema.anyOf)) {
    const candidates = schema.anyOf.map((subschema) => {
      const branchErrors = []
      validateSchema(value, subschema, path, branchErrors)
      return branchErrors
    })
    if (!candidates.some(branch => branch.length === 0)) {
      errors.push(`${path || 'value'} does not match any allowed schema (${candidates[0]?.[0] ?? 'no branches'})`)
    }
  }
  if (Array.isArray(schema.oneOf)) {
    const matches = schema.oneOf.filter((subschema) => {
      const branchErrors = []
      validateSchema(value, subschema, path, branchErrors)
      return branchErrors.length === 0
    })
    if (matches.length !== 1) errors.push(`${path || 'value'} must match exactly one allowed schema`)
  }
  const types = Array.isArray(schema.type) ? schema.type : schema.type === undefined ? [] : [schema.type]
  if (types.length > 0) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value === 'number' && Number.isInteger(value) ? 'integer' : typeof value
    if (!types.includes(actual) && !(actual === 'integer' && types.includes('number'))) {
      errors.push(`${path || 'value'} must be ${types.join(' or ')} (got ${actual})`)
      return
    }
  }
  if (typeof value === 'string') {
    if (typeof schema.minLength === 'number' && value.length < schema.minLength) errors.push(`${path || 'value'} must have at least ${schema.minLength} characters`)
    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) errors.push(`${path || 'value'} must have at most ${schema.maxLength} characters`)
    if (typeof schema.pattern === 'string') {
      try {
        if (!new RegExp(schema.pattern, 'u').test(value)) errors.push(`${path || 'value'} must match ${schema.pattern}`)
      } catch {
        errors.push(`${path || 'value'} has an invalid pattern in the schema`)
      }
    }
  }
  if (typeof value === 'number') {
    if (typeof schema.minimum === 'number' && value < schema.minimum) errors.push(`${path || 'value'} must be >= ${schema.minimum}`)
    if (typeof schema.maximum === 'number' && value > schema.maximum) errors.push(`${path || 'value'} must be <= ${schema.maximum}`)
  }
  if (Array.isArray(value)) {
    if (typeof schema.minItems === 'number' && value.length < schema.minItems) errors.push(`${path || 'value'} must have at least ${schema.minItems} items`)
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) errors.push(`${path || 'value'} must have at most ${schema.maxItems} items`)
    if (schema.items !== undefined) {
      value.forEach((entry, index) => validateSchema(entry, schema.items, `${path}[${index}]`, errors))
    }
  }
  if (isRecord(value)) {
    const properties = isRecord(schema.properties) ? schema.properties : {}
    if (Array.isArray(schema.required)) {
      for (const key of schema.required) {
        if (!(key in value)) errors.push(`${path || 'value'}.${key} is required`)
      }
    }
    for (const [key, entry] of Object.entries(value)) {
      if (properties[key] !== undefined) {
        validateSchema(entry, properties[key], path === '' ? key : `${path}.${key}`, errors)
      } else if (schema.additionalProperties === false) {
        errors.push(`${path || 'value'}.${key} is not allowed`)
      }
    }
  }
}

/** Spawn a shell command with a timeout and optional abort signal. */
function runCommand(command, { cwd, env, timeoutMs, signal }) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      env: { ...process.env, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: process.platform !== 'win32',
    })
    let output = ''
    let settled = false
    const append = (chunk) => {
      output += chunk.toString()
      if (output.length > MAX_COMMAND_OUTPUT * 2) output = output.slice(-MAX_COMMAND_OUTPUT * 2)
    }
    const finish = (result) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      resolvePromise({ ...result, output: truncate(output.trim(), MAX_COMMAND_OUTPUT) })
    }
    const kill = (signalName) => {
      if (child.pid === undefined) return
      try {
        if (process.platform !== 'win32') process.kill(-child.pid, signalName)
        else child.kill(signalName)
      } catch {
        try { child.kill(signalName) } catch { /* already gone */ }
      }
    }
    const onAbort = () => {
      kill('SIGKILL')
      finish({ code: null, timedOut: false, aborted: true })
    }
    const timer = setTimeout(() => {
      kill('SIGKILL')
      finish({ code: null, timedOut: true, aborted: false })
    }, timeoutMs)
    child.stdout?.on('data', append)
    child.stderr?.on('data', append)
    child.on('error', (error) => finish({ code: null, timedOut: false, aborted: false, spawnError: error.message }))
    child.on('close', (code) => finish({ code, timedOut: false, aborted: false }))
    if (signal) {
      if (signal.aborted) onAbort()
      else signal.addEventListener('abort', onAbort, { once: true })
    }
  })
}

/** Validate one run, returning errors rather than throwing. */
async function validateRun(run, type, session) {
  const text = assistantText(session, run.turn)
  await mkdir(run.runDir, { recursive: true })
  await writeFile(join(run.runDir, 'answer.md'), text.length > 0 ? `${text}\n` : '', 'utf8')
  const validation = type.validation ?? { kind: 'none' }
  try {
    if (validation.kind === 'none') {
      return { ok: true, detail: 'No validation configured.', errors: [] }
    }
    if (validation.kind === 'maxWords') {
      const count = wordCount(text)
      if (count === 0) return { ok: false, detail: `No final answer text was recorded.`, errors: ['The final answer was empty.'] }
      if (count > validation.maxWords) {
        return { ok: false, detail: `${count} words (limit ${validation.maxWords}).`, errors: [`The answer is ${count} words; the limit is ${validation.maxWords} words. Shorten it.`] }
      }
      return { ok: true, detail: `${count} ${count === 1 ? 'word' : 'words'} (limit ${validation.maxWords}).`, errors: [] }
    }
    if (validation.kind === 'json') {
      let parsed
      try {
        parsed = extractJson(text)
      } catch (error) {
        return { ok: false, detail: 'No valid JSON found.', errors: [`The final answer does not contain parseable JSON: ${error.message}`] }
      }
      await writeFile(join(run.runDir, 'answer.json'), `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')
      const errors = []
      validateSchema(parsed, validation.schema, '', errors)
      return { ok: errors.length === 0, detail: errors.length === 0 ? 'JSON matches the schema.' : 'JSON schema check failed.', errors }
    }
    if (validation.kind === 'files') {
      const errors = []
      for (const file of validation.files) {
        const target = resolve(run.runDir, file.path)
        if (relative(run.runDir, target).startsWith('..') || relative(run.runDir, target) === '') {
          errors.push(`Required file "${file.path}" is outside the run directory.`)
          continue
        }
        let contents
        try {
          contents = await readFile(target, 'utf8')
        } catch {
          errors.push(`Required file "${file.path}" is missing from ${run.runDir}.`)
          continue
        }
        if (file.contains && !contents.includes(file.contains)) {
          errors.push(`Required file "${file.path}" must contain ${JSON.stringify(file.contains)}.`)
        }
      }
      return { ok: errors.length === 0, detail: errors.length === 0 ? 'All required files are present.' : 'Required files failed.', errors }
    }
    if (validation.kind === 'command') {
      const result = await runCommand(validation.command, {
        cwd: run.runDir,
        timeoutMs: validation.timeoutMs,
        signal: run.signal,
        env: {
          DSH_OUTPUT_DIR: run.runDir,
          DSH_OUTPUT_TEXT_FILE: join(run.runDir, 'answer.md'),
          DSH_OUTPUT_TURN: String(run.turn),
          DSH_SESSION_ID: run.sessionId,
          DSH_OUTPUT_TYPE: type.id,
          DSH_OUTPUT_MODE: run.modeId,
        },
      })
      if (result.aborted) return { ok: false, detail: 'Validation was cancelled.', errors: ['Validation was cancelled.'], aborted: true }
      if (result.timedOut) return { ok: false, detail: `Validation command timed out.`, errors: [`The validation command exceeded ${validation.timeoutMs}ms.`] }
      if (result.spawnError) return { ok: false, detail: 'Validation command could not start.', errors: [result.spawnError] }
      if (result.code !== 0) {
        return {
          ok: false,
          detail: `Validation command exited with ${result.code}.`,
          errors: [`The validation command exited with code ${result.code}.`, result.output || 'No output was produced.'],
        }
      }
      return { ok: true, detail: 'Validation command passed.', errors: [] }
    }
    return { ok: true, detail: 'Unknown validation kind skipped.', errors: [] }
  } catch (error) {
    return { ok: false, detail: 'Validation crashed.', errors: [`Validation crashed: ${error.message}`] }
  }
}

/** Ask the OS for a free loopback port. */
function freePort() {
  return new Promise((resolvePromise, reject) => {
    const server = createNetServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address !== null ? address.port : 0
      server.close(() => resolvePromise(port))
    })
  })
}

/** Poll a URL until it answers; the child is checked for early exit. */
async function waitForHttp(url, timeoutMs, child, getOutput) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Serve command exited with ${child.exitCode}. ${truncate(getOutput(), 2_000)}`)
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1_000), redirect: 'manual' })
      await response.body?.cancel()
      return
    } catch {
      await new Promise(resolvePromise => setTimeout(resolvePromise, 300))
    }
  }
  throw new Error(`Serve command did not answer at ${url} within ${timeoutMs}ms. ${truncate(getOutput(), 2_000)}`)
}

/** Kill a detached process tree. */
function killTree(child, signal = 'SIGTERM') {
  if (!child || child.pid === undefined) return
  try {
    if (process.platform !== 'win32') process.kill(-child.pid, signal)
    else child.kill(signal)
  } catch {
    try { child.kill(signal) } catch { /* already gone */ }
  }
}

/** Register all host routes and lifecycle hooks. */
export function apply(ctx) {
  const loaded = loadConfig()
  let config = loaded.config
  let configError = loaded.error
  let configMtime = 0
  try { configMtime = statSync(CONFIG_PATH).mtimeMs } catch { /* seeded below */ }
  let selections = loadSelections()
  let selectionMtime = 0
  try { selectionMtime = statSync(SELECTION_PATH).mtimeMs } catch { /* no selections yet */ }

  /** Latest run per session id. */
  const latest = new Map()
  /** sessionId -> { turn, typeId, modeId } selection snapshotted at turn start. */
  const turnSnapshots = new Map()
  /** `${sessionId}:${turn}` -> run. */
  const turns = new Map()
  /** sessionId -> serve process entry. */
  const serves = new Map()
  /** sessionId -> section disposer. */
  const sections = new Map()

  const log = (message) => {
    try { ctx.logger.info(`[output-modes] ${message}`) } catch { /* logging is optional */ }
  }
  const warn = (message) => {
    try { ctx.logger.warn(`[output-modes] ${message}`) } catch { /* logging is optional */ }
  }

  const defaultType = () => config.types.find(type => type.id === config.defaults.typeId) ?? config.types[0]
  const defaultMode = () => config.modes.find(mode => mode.id === config.defaults.modeId) ?? config.modes[0]

  /** Pick up external selection-file edits (another window, a manual edit). */
  function refreshSelectionsFromDisk() {
    try {
      const stat = statSync(SELECTION_PATH)
      if (stat.mtimeMs === selectionMtime) return
      selections = loadSelections()
      selectionMtime = stat.mtimeMs
    } catch {
      /* keep the in-memory selections when the file is absent or mid-write */
    }
  }

  /** Resolve the session selection against the current config, falling back safely. */
  function selectionFor(sessionId) {
    refreshSelectionsFromDisk()
    const saved = selections[sessionId]
    const type = config.types.find(candidate => candidate.id === saved?.typeId) ?? defaultType()
    const mode = config.modes.find(candidate => candidate.id === saved?.modeId) ?? defaultMode()
    return { typeId: type.id, modeId: mode.id }
  }

  function refreshConfigFromDisk() {
    try {
      const stat = statSync(CONFIG_PATH)
      if (stat.mtimeMs === configMtime) return
      const next = loadConfig()
      config = next.config
      configError = next.error
      configMtime = stat.mtimeMs
    } catch {
      /* keep the live config when the file disappears mid-edit */
    }
  }

  /** Render the prompt contract for one agent, or '' when it adds nothing. */
  function contractFor(agent) {
    const session = agent.session
    let turn = 0
    try { turn = ctx.agents.turnBoundaryOf(session).lastTurn } catch { /* no turn yet */ }
    const snapshot = turnSnapshots.get(session.id)
    const selection = snapshot !== undefined && snapshot.turn === turn ? snapshot : selectionFor(session.id)
    const type = config.types.find(candidate => candidate.id === selection.typeId) ?? defaultType()
    const mode = config.modes.find(candidate => candidate.id === selection.modeId) ?? defaultMode()
    const hasTypeInstructions = type.instructions.trim() !== ''
    const hasModeInstructions = mode.instructions.trim() !== ''
    const hasValidation = type.validation.kind !== 'none'
    const hasServe = type.serve.kind !== 'none'
    if (!hasTypeInstructions && !hasModeInstructions && !hasValidation && !hasServe) return ''
    const runDir = runDirFor(session, turn)
    const interpolate = (text) => text
      .replaceAll('{{runDir}}', runDir)
      .replaceAll('{{sessionId}}', session.id)
      .replaceAll('{{turn}}', String(turn))
      .replaceAll('{{maxWords}}', String(type.validation.maxWords ?? ''))
    const lines = [
      '# Output contract',
      `Output type: **${type.name}**${type.description ? ` — ${type.description}` : ''}`,
      `Detail level: **${mode.name}**${mode.description ? ` — ${mode.description}` : ''}`,
    ]
    if (hasTypeInstructions) lines.push('', interpolate(type.instructions))
    if (hasModeInstructions) lines.push('', interpolate(mode.instructions))
    if (type.output === 'files') {
      lines.push(
        '',
        'Deliver this response as files in exactly this run directory:',
        `\`${runDir}\``,
        'Create the directory if it does not exist. Do not place the app anywhere else.',
      )
    }
    if (type.output === 'json' && type.validation.kind === 'json') {
      lines.push('', 'The final answer must satisfy this JSON Schema:', '```json', JSON.stringify(type.validation.schema, null, 2), '```')
    }
    if (hasValidation) {
      lines.push('', 'The harness validates the final answer automatically before the turn closes. If validation fails, you will receive the exact errors as another user-role message in this same turn; repair the answer or files and reply again. Do not give up after one attempt.')
    }
    if (hasServe) {
      lines.push('', 'After validation passes, the harness serves the result and shows a preview to the user. Do not start a server yourself unless the serve command below is configured to do so.')
      if (type.serve.kind === 'command') {
        lines.push(`Serve command the harness will run in the run directory: \`${type.serve.command}\``)
      } else if (type.serve.kind === 'static') {
        lines.push(`The harness serves \`${type.serve.file}\` from the run directory as the preview.`)
      }
    }
    return lines.join('\n')
  }

  /** Attach the dynamic contract section to one live agent. */
  function attachSection(agent) {
    const sessionId = agent.session.id
    if (sections.has(sessionId)) return
    try {
      const dispose = agent.ctx.systemPrompt.section({
        name: SECTION_NAME,
        order: SECTION_ORDER,
        text: () => contractFor(agent),
        interpolate: false,
      })
      sections.set(sessionId, dispose)
    } catch (error) {
      warn(`could not attach prompt section to ${sessionId}: ${error.message}`)
    }
  }

  /** Stop a running serve process for one session. */
  function stopServe(sessionId) {
    const entry = serves.get(sessionId)
    if (entry === undefined) return
    serves.delete(sessionId)
    entry.stopped = true
    killTree(entry.child)
  }

  /** Start the configured serve action for a passed run. */
  function startServe(run, type) {
    stopServe(run.sessionId)
    if (type.serve.kind === 'none') {
      run.status = 'passed'
      return
    }
    if (type.serve.kind === 'static') {
      run.status = 'served'
      run.previewPath = previewPath(run.sessionId, run.turn)
      run.finishedAt = Date.now()
      return
    }
    run.status = 'serving'
    run.startedServingAt = Date.now()
    void (async () => {
      let child
      let output = ''
      try {
        const port = await freePort()
        const command = type.serve.command.replaceAll('{port}', String(port))
        const url = type.serve.urlTemplate.replaceAll('{port}', String(port))
        child = spawn(command, {
          cwd: run.runDir,
          shell: true,
          env: {
            ...process.env,
            PORT: String(port),
            DSH_OUTPUT_DIR: run.runDir,
            DSH_OUTPUT_TEXT_FILE: join(run.runDir, 'answer.md'),
            DSH_OUTPUT_TURN: String(run.turn),
            DSH_SESSION_ID: run.sessionId,
            DSH_OUTPUT_TYPE: type.id,
            DSH_OUTPUT_MODE: run.modeId,
          },
          stdio: ['ignore', 'pipe', 'pipe'],
          detached: process.platform !== 'win32',
        })
        const append = (chunk) => {
          output += chunk.toString()
          if (output.length > MAX_COMMAND_OUTPUT * 2) output = output.slice(-MAX_COMMAND_OUTPUT * 2)
        }
        child.stdout?.on('data', append)
        child.stderr?.on('data', append)
        serves.set(run.sessionId, { child, port, url, stopped: false, output: () => output })
        await waitForHttp(url, type.serve.readyTimeoutMs, child, () => output)
        if (run.status !== 'serving' || serves.get(run.sessionId)?.child !== child) {
          killTree(child)
          return
        }
        run.status = 'served'
        run.serveUrl = url
        run.finishedAt = Date.now()
      } catch (error) {
        killTree(child)
        if (serves.get(run.sessionId)?.child === child) serves.delete(run.sessionId)
        if (run.status === 'serving') {
          run.status = 'serve-error'
          run.finishedAt = Date.now()
          run.errors = [...(run.errors ?? []), `Serve failed: ${error.message}`]
        }
      }
    })()
  }

  /** Validate a run inside turn-stopping and steer a bounded repair when needed. */
  async function checkTurn(run, agent, signal) {
    const type = config.types.find(candidate => candidate.id === run.typeId) ?? defaultType()
    const mode = config.modes.find(candidate => candidate.id === run.modeId) ?? defaultMode()
    run.typeName = type.name
    run.modeName = mode.name
    run.validationKind = type.validation.kind
    run.status = 'validating'
    run.signal = signal
    const result = await validateRun(run, type, agent.session)
    run.signal = undefined
    if (signal.aborted) {
      run.status = 'aborted'
      run.finishedAt = Date.now()
      return
    }
    if (result.ok) {
      run.status = 'passed'
      run.validation = { ok: true, detail: result.detail }
      run.errors = []
      run.passedAt = Date.now()
      startServe(run, type)
      return
    }
    run.validation = { ok: false, detail: result.detail }
    run.errors = result.errors
    const maxRetries = Number.isInteger(run.maxRetries) ? run.maxRetries : DEFAULT_MAX_RETRIES
    if (run.attempt < maxRetries) {
      run.attempt += 1
      run.status = 'retrying'
      run.retriedAt = Date.now()
      const notice = {
        id: randomUUID(),
        role: 'user',
        content: [{
          type: 'text',
          text: [
            `Output validation failed for "${type.name}" (repair ${run.attempt} of ${maxRetries}).`,
            `Run directory: ${run.runDir}`,
            '',
            'Validation errors:',
            ...result.errors.map(error => `- ${error}`),
            '',
            'Fix the delivery and answer again. The harness will re-validate in this same turn.',
          ].join('\n'),
        }],
        source: {
          kind: 'output-modes',
          form: 'notice',
          summary: `Output validation failed for ${type.name}`,
        },
      }
      agent.steer(notice)
      return
    }
    run.status = 'failed'
    run.finishedAt = Date.now()
  }

  /** Record the start of a turn and snapshot the selection that travels with it. */
  function startTurn(session, turn) {
    const selection = selectionFor(session.id)
    const type = config.types.find(candidate => candidate.id === selection.typeId) ?? defaultType()
    const mode = config.modes.find(candidate => candidate.id === selection.modeId) ?? defaultMode()
    turnSnapshots.set(session.id, { turn, typeId: type.id, modeId: mode.id })
    stopServe(session.id)
    const previous = latest.get(session.id)
    if (previous !== undefined && (previous.status === 'validating' || previous.status === 'retrying' || previous.status === 'serving')) {
      previous.status = 'superseded'
      previous.finishedAt = Date.now()
    }
    // A pass-through type validates and serves nothing; it must not leave a
    // trail of run directories or a status strip on every ordinary reply.
    if (type.validation.kind === 'none' && type.serve.kind === 'none') return
    const runDir = runDirFor(session, turn)
    try { mkdirSync(runDir, { recursive: true }) } catch (error) { warn(`could not create ${runDir}: ${error.message}`) }
    const run = {
      sessionId: session.id,
      turn,
      typeId: type.id,
      modeId: mode.id,
      typeName: type.name,
      modeName: mode.name,
      runDir,
      output: type.output,
      maxRetries: type.maxRetries,
      attempt: 0,
      status: 'running',
      errors: [],
      startedAt: Date.now(),
    }
    turns.set(`${session.id}:${turn}`, run)
    latest.set(session.id, run)
  }

  // ---- lifecycle ---------------------------------------------------------

  ctx.on('session/event', (session, event) => {
    if (event.type === 'turn/start') {
      startTurn(session, event.data.turn)
      return
    }
    if (event.type === 'turn/end') {
      const run = turns.get(`${session.id}:${event.data.turn}`)
      if (run === undefined) return
      run.endedAt = Date.now()
      if (run.status === 'running' || run.status === 'validating' || run.status === 'retrying') {
        const kind = event.data.reason.kind
        run.status = kind === 'completed' ? 'ended' : kind
        run.finishedAt = Date.now()
        if (kind !== 'completed' && run.errors.length === 0) {
          run.errors = [`Turn ended as "${kind}" before validation completed.`]
        }
      }
    }
  })

  ctx.on('agent/turn-stopping', async ({ agent, turn, signal }) => {
    const run = turns.get(`${agent.session.id}:${turn}`)
    if (run === undefined) return
    if (run.status === 'passed' || run.status === 'served' || run.status === 'failed' || run.status === 'aborted' || run.status === 'superseded') return
    await checkTurn(run, agent, signal)
  })

  ctx.on('agent/created', ({ agent }) => attachSection(agent))
  ctx.on('agent/disposed', ({ agent }) => {
    const dispose = sections.get(agent.session.id)
    if (dispose !== undefined) {
      sections.delete(agent.session.id)
      try { dispose() } catch { /* scope may already be unwound */ }
    }
    stopServe(agent.session.id)
  })

  ctx.effect(() => {
    for (const agent of ctx.agents.list()) attachSection(agent)
    return () => {
      for (const dispose of sections.values()) {
        try { dispose() } catch { /* scope may already be unwound */ }
      }
      sections.clear()
      for (const entry of serves.values()) killTree(entry.child)
      serves.clear()
    }
  }, 'output-modes: sections and serve processes')

  // ---- HTTP routes -------------------------------------------------------

  const json = (status, body) => new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
  const ok = body => json(200, { ok: true, ...body })
  const fail = (status, message) => json(status, { ok: false, error: message })

  async function readBody(request) {
    const text = await request.text()
    if (text.length > MAX_CONFIG_BYTES) throw new Error(`Request body is larger than ${MAX_CONFIG_BYTES} bytes`)
    if (text.trim() === '') return {}
    try { return JSON.parse(text) } catch (error) { throw new Error(`Invalid JSON body: ${error.message}`) }
  }

  function bootstrapResponse(sessionId) {
    const selection = selectionFor(sessionId)
    const run = latest.get(sessionId) ?? null
    return {
      config,
      configError,
      configPath: CONFIG_PATH,
      selection,
      run: run === null ? null : {
        sessionId: run.sessionId,
        turn: run.turn,
        typeId: run.typeId,
        typeName: run.typeName,
        modeId: run.modeId,
        modeName: run.modeName,
        output: run.output,
        status: run.status,
        attempt: run.attempt,
        maxRetries: run.maxRetries,
        errors: run.errors ?? [],
        validation: run.validation ?? null,
        runDir: run.runDir,
        previewPath: run.previewPath ?? null,
        serveUrl: run.serveUrl ?? null,
        startedAt: run.startedAt,
        finishedAt: run.finishedAt ?? null,
      },
      host: { version: PLUGIN_VERSION, home: FALLBACK_HOME, configPath: CONFIG_PATH },
    }
  }

  ctx.inject(['connection'], (scope) => {
    const register = (path, methods, fetch) => {
      scope.effect(() => scope.connection.fetch.register({
        path,
        methods,
        requestBody: 'buffered',
        fetch,
      }), `output-modes: ${path}`)
    }

    register('/api/output-modes/bootstrap', ['GET'], (request) => {
      refreshConfigFromDisk()
      const sessionId = new URL(request.url).searchParams.get('sessionId') ?? ''
      if (sessionId === '') return fail(400, 'sessionId is required')
      return ok(bootstrapResponse(sessionId))
    })

    register('/api/output-modes/select', ['POST'], async (request) => {
      try {
        const body = await readBody(request)
        const sessionId = asString(body.sessionId)
        const typeId = asString(body.typeId)
        const modeId = asString(body.modeId)
        if (sessionId === '') return fail(400, 'sessionId is required')
        if (!config.types.some(type => type.id === typeId)) return fail(400, `Unknown output type "${typeId}"`)
        if (!config.modes.some(mode => mode.id === modeId)) return fail(400, `Unknown level "${modeId}"`)
        selections = {
          ...selections,
          [sessionId]: { typeId, modeId, updatedAt: Date.now() },
        }
        try {
          saveSelections(selections)
          selectionMtime = statSync(SELECTION_PATH).mtimeMs
        } catch (error) {
          warn(`could not persist selection: ${error.message}`)
        }
        return ok({ selection: { typeId, modeId } })
      } catch (error) {
        return fail(400, error.message)
      }
    })

    register('/api/output-modes/config', ['POST'], async (request) => {
      try {
        const body = await readBody(request)
        const { config: next, errors } = normalizeConfig(body.config)
        if (errors.length > 0) return json(400, { ok: false, error: errors.join('\n'), errors })
        config = next
        configError = null
        await atomicWrite(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`)
        try { configMtime = statSync(CONFIG_PATH).mtimeMs } catch { /* best effort */ }
        return ok({ config })
      } catch (error) {
        return fail(400, error.message)
      }
    })

    register('/api/output-modes/reset', ['POST'], async () => {
      const next = defaultConfig()
      const { config: normalized, errors } = normalizeConfig(next)
      if (errors.length > 0) return fail(500, errors.join('; '))
      config = normalized
      configError = null
      await atomicWrite(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`)
      try { configMtime = statSync(CONFIG_PATH).mtimeMs } catch { /* best effort */ }
      return ok({ config })
    })

    register('/api/output-modes/preview', ['GET'], async (request) => {
      const params = new URL(request.url).searchParams
      const sessionId = params.get('sessionId') ?? ''
      const turn = Number(params.get('turn'))
      if (sessionId === '' || !Number.isInteger(turn) || turn < 1) return new Response('not found', { status: 404 })
      const run = turns.get(`${sessionId}:${turn}`)
      if (run === undefined) return new Response('not found', { status: 404 })
      const type = config.types.find(candidate => candidate.id === run.typeId)
      if (type?.serve.kind !== 'static') return new Response('not found', { status: 404 })
      const target = resolve(run.runDir, type.serve.file || 'index.html')
      if (relative(run.runDir, target).startsWith('..') || relative(run.runDir, target) === '') {
        return new Response('not found', { status: 404 })
      }
      try {
        const html = await readFile(target, 'utf8')
        return new Response(html, {
          headers: {
            'content-type': 'text/html; charset=utf-8',
            'cache-control': 'no-store',
            'x-content-type-options': 'nosniff',
          },
        })
      } catch {
        return new Response('not found', { status: 404 })
      }
    })
  })

  log(`v${PLUGIN_VERSION} loaded; config at ${CONFIG_PATH}; ${config.types.length} types, ${config.modes.length} levels`)
}
