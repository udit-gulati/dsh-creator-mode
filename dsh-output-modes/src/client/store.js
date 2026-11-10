/**
 * Client state for dsh-output-modes.
 *
 * The Host is the source of truth for configuration, per-session selection,
 * and run status. This module keeps one snapshot per Session, polls the
 * bootstrap route while a composer is mounted, and exposes the three mutation
 * verbs the UI needs. The fallback config exists only so the composer still
 * renders if the Host route is not available (for example an older Host or a
 * non-Web surface); mutations are rejected and rolled back in that case.
 */

import { useSyncExternalStore } from 'react'

const FALLBACK_CONFIG = {
  version: 1,
  defaults: { typeId: 'detailed', modeId: 'balanced' },
  types: [
    { id: 'detailed', name: 'Detailed answer', description: 'Full, thorough response.', output: 'text', instructions: '', validation: { kind: 'none' }, serve: { kind: 'none' }, maxRetries: 0 },
    { id: 'short', name: 'Short answer', description: 'A direct answer capped at 120 words.', output: 'text', instructions: '', validation: { kind: 'maxWords', maxWords: 120 }, serve: { kind: 'none' }, maxRetries: 1 },
    { id: 'json', name: 'Structured JSON', description: 'One JSON object checked against a schema.', output: 'json', instructions: '', validation: { kind: 'json', schema: { type: 'object' } }, serve: { kind: 'none' }, maxRetries: 2 },
    { id: 'react-app', name: 'React app', description: 'A runnable single-file React app.', output: 'files', instructions: '', validation: { kind: 'files', files: [{ path: 'index.html' }] }, serve: { kind: 'static', file: 'index.html' }, maxRetries: 2 },
  ],
  modes: [
    { id: 'concise', name: 'Concise', description: 'Shortest complete answer.', instructions: '' },
    { id: 'balanced', name: 'Balanced', description: 'Default level of detail.', instructions: '' },
    { id: 'exhaustive', name: 'Exhaustive', description: 'Thorough treatment.', instructions: '' },
  ],
}

const states = new Map()
const listeners = new Set()
const watchers = new Map()

function initialState() {
  return {
    status: 'loading',
    config: FALLBACK_CONFIG,
    configError: null,
    selection: { typeId: 'detailed', modeId: 'balanced' },
    run: null,
    host: null,
    error: null,
    saving: false,
    configSaving: false,
  }
}

/** Stable per-session snapshot for useSyncExternalStore. */
export function snapshot(sessionId) {
  let state = states.get(sessionId)
  if (state === undefined) {
    state = initialState()
    states.set(sessionId, state)
  }
  return state
}

function update(sessionId, patch) {
  states.set(sessionId, { ...snapshot(sessionId), ...patch })
  for (const listener of listeners) listener()
}

function subscribe(listener) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** Subscribe one component to a Session snapshot. */
export function useSnapshot(sessionId) {
  return useSyncExternalStore(
    subscribe,
    () => snapshot(sessionId),
    () => snapshot(sessionId),
  )
}

function apiUrl(path) {
  return new URL(`api/output-modes/${path}`, document.baseURI).href
}

async function api(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    method: options.method ?? 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: options.body === undefined ? undefined : { 'content-type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  let data = null
  try { data = await response.json() } catch { /* non-JSON failure */ }
  if (!response.ok || data === null || data.ok !== true) {
    throw new Error(data?.error ?? `Host route answered HTTP ${response.status}`)
  }
  return data
}

/** Load or refresh one Session's bootstrap state. */
export async function load(sessionId) {
  const watcher = watchers.get(sessionId)
  if (watcher !== undefined) {
    if (watcher.inflight) return
    watcher.inflight = true
  }
  try {
    const data = await api(`bootstrap?sessionId=${encodeURIComponent(sessionId)}`)
    update(sessionId, {
      status: 'ready',
      config: data.config,
      configError: data.configError ?? null,
      selection: data.selection,
      run: data.run ?? null,
      host: data.host ?? null,
      error: null,
    })
  } catch (error) {
    const current = snapshot(sessionId)
    update(sessionId, {
      status: current.status === 'ready' ? 'ready' : 'error',
      error: error.message,
    })
  } finally {
    if (watcher !== undefined) watcher.inflight = false
  }
}

/** Start (or join) the shared poller for one Session. Returns an unwatch function. */
export function watch(sessionId) {
  let watcher = watchers.get(sessionId)
  if (watcher === undefined) {
    watcher = { count: 0, timer: null, inflight: false }
    watchers.set(sessionId, watcher)
    void load(sessionId)
    watcher.timer = setInterval(() => { void load(sessionId) }, 1_800)
  }
  watcher.count += 1
  return () => {
    watcher.count -= 1
    if (watcher.count <= 0) {
      clearInterval(watcher.timer)
      watchers.delete(sessionId)
    }
  }
}

/** Persist a type/level choice; optimistic with a rollback on Host refusal. */
export async function select(sessionId, typeId, modeId) {
  const before = snapshot(sessionId).selection
  update(sessionId, { selection: { typeId, modeId }, saving: true })
  try {
    const data = await api('select', { method: 'POST', body: { sessionId, typeId, modeId } })
    update(sessionId, { selection: data.selection, saving: false, error: null })
    return true
  } catch (error) {
    update(sessionId, { selection: before, saving: false, error: error.message })
    return false
  }
}

/** Save the whole configuration document. */
export async function saveConfig(sessionId, config) {
  update(sessionId, { configSaving: true })
  try {
    const data = await api('config', { method: 'POST', body: { config } })
    update(sessionId, { config: data.config, configError: null, configSaving: false, error: null })
    return { ok: true, config: data.config }
  } catch (error) {
    update(sessionId, { configSaving: false })
    return { ok: false, error: error.message }
  }
}

/** Restore the shipped defaults on the Host. */
export async function resetConfig(sessionId) {
  update(sessionId, { configSaving: true })
  try {
    const data = await api('reset', { method: 'POST', body: {} })
    update(sessionId, { config: data.config, configError: null, configSaving: false, error: null })
    return { ok: true, config: data.config }
  } catch (error) {
    update(sessionId, { configSaving: false })
    return { ok: false, error: error.message }
  }
}

/** Resolve the preview URL for a run, if it has one. */
export function previewUrl(run) {
  if (run === null || run === undefined) return null
  if (typeof run.previewPath === 'string' && run.previewPath !== '') {
    return new URL(run.previewPath, document.baseURI).href
  }
  if (typeof run.serveUrl === 'string' && run.serveUrl !== '') return run.serveUrl
  return null
}

/** Find an output type by id with a safe fallback. */
export function typeOf(config, typeId) {
  return config.types.find(type => type.id === typeId) ?? config.types[0]
}

/** Find a level by id with a safe fallback. */
export function modeOf(config, modeId) {
  return config.modes.find(mode => mode.id === modeId) ?? config.modes[0]
}

/** Deep clone a JSON-shaped config (structuredClone is not guaranteed in every surface). */
export function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config))
}

// ---- shared modal state ----------------------------------------------------

let uiState = { configOpen: false, preview: null, sessionId: null }
const uiListeners = new Set()

function emitUi() {
  for (const listener of uiListeners) listener()
}

export function useUiState() {
  return useSyncExternalStore(
    (listener) => {
      uiListeners.add(listener)
      return () => { uiListeners.delete(listener) }
    },
    () => uiState,
    () => uiState,
  )
}

export function openConfig(sessionId) {
  uiState = { ...uiState, configOpen: true, sessionId }
  emitUi()
}

export function closeConfig() {
  uiState = { ...uiState, configOpen: false }
  emitUi()
}

export function openPreview(preview) {
  uiState = { ...uiState, preview }
  emitUi()
}

export function closePreview() {
  uiState = { ...uiState, preview: null }
  emitUi()
}
