/**
 * Output-modes composer controls, editor, and preview surfaces.
 *
 * Two compact triggers live in `conversation.input.left` (the composer tool
 * row), a run-status strip lives in `conversation.input.dock`, and the modals
 * are portaled from the type trigger so they share one mounted seat. The
 * controls intentionally use the same token vocabulary as the surrounding
 * composer so they follow light/dark themes without a second stylesheet.
 */

import {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  cloneConfig, closeConfig, closePreview, modeOf, openConfig, openPreview,
  previewUrl, resetConfig, saveConfig, select, typeOf, useSnapshot, useUiState, watch,
} from './store.js'

/* ------------------------------------------------------------------ icons */

function ChevronIcon({ size = 10 }) {
  return (
    <svg className="dsh-om-chevron" width={size} height={size} viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 3.6 5 6.4 8 3.6" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="m2.4 6.2 2.3 2.3 4.9-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function OutputGlyph({ output }) {
  if (output === 'json') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <path d="M5 2.5c-1.2 0-1.8.6-1.8 1.9v1.2c0 .9-.4 1.4-1.2 1.4.8 0 1.2.5 1.2 1.4v1.2c0 1.3.6 1.9 1.8 1.9M9 2.5c1.2 0 1.8.6 1.8 1.9v1.2c0 .9.4 1.4 1.2 1.4-.8 0-1.2.5-1.2 1.4v1.2c0 1.3-.6 1.9-1.8 1.9" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      </svg>
    )
  }
  if (output === 'files') {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <rect x="2" y="2" width="10" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.15" />
        <path d="M5 5h4M5 7h4M5 9h2.5" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 3.5h8M3 7h8M3 10.5h5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
      <circle cx="7" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 1.6v1.5M7 10.9v1.5M1.6 7h1.5M10.9 7h1.5M3.2 3.2l1 1M9.8 9.8l1 1M10.8 3.2l-1 1M4.2 9.8l-1 1" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/* --------------------------------------------------------------- popover */

/** Position a fixed popover under (or above) its trigger. */
function useAnchoredStyle(anchorRef, open, preferredWidth) {
  const [style, setStyle] = useState({})
  useLayoutEffect(() => {
    if (!open) return undefined
    const place = () => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (rect === undefined) return
      const width = Math.min(preferredWidth, window.innerWidth - 24)
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12)
      const below = window.innerHeight - rect.bottom
      const top = below >= 260
        ? rect.bottom + 6
        : Math.max(12, rect.top - Math.min(420, Math.max(220, rect.top - 12)))
      setStyle({ left, top, width })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [anchorRef, open, preferredWidth])
  return style
}

function Popover({ anchorRef, open, onClose, width = 316, children }) {
  const style = useAnchoredStyle(anchorRef, open, width)
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <>
      <div className="dsh-om dsh-om-scrim" onPointerDown={onClose} />
      <div className="dsh-om dsh-om-menu" style={style} role="dialog" aria-label="Output modes">
        {children}
      </div>
    </>,
    document.body,
  )
}

/* ------------------------------------------------------------ type picker */

function tagsFor(type) {
  const tags = []
  if (type.validation?.kind && type.validation.kind !== 'none') tags.push('validated')
  if (type.serve?.kind && type.serve.kind !== 'none') tags.push('preview')
  return tags
}

export function OutputTypePicker({ sessionId }) {
  const state = useSnapshot(sessionId)
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const type = typeOf(state.config, state.selection.typeId)

  useEffect(() => watch(sessionId), [sessionId])

  const choose = (nextTypeId) => {
    setOpen(false)
    if (nextTypeId === state.selection.typeId) return
    void select(sessionId, nextTypeId, state.selection.modeId)
  }

  return (
    <>
      <div className="dsh-om" style={{ display: 'inline-flex' }}>
        <button
          ref={anchorRef}
          type="button"
          className="dsh-om-trigger"
          data-open={open ? 'true' : undefined}
          data-saving={state.saving ? 'true' : undefined}
          title={`Output type: ${type.name}${type.description ? ` — ${type.description}` : ''}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
        >
          <span className="dsh-om-trigger-glyph"><OutputGlyph output={type.output} /></span>
          <span className="dsh-om-trigger-label">{type.name}</span>
          <ChevronIcon />
        </button>
      </div>
      <Popover anchorRef={anchorRef} open={open} onClose={() => setOpen(false)}>
        <div className="dsh-om-menu-head">
          <span className="dsh-om-menu-title">Output type</span>
          <span className="dsh-om-menu-hint">applies to your next message</span>
        </div>
        {state.status === 'error' && (
          <div className="dsh-om-menu-head">
            <span className="dsh-om-warning">Host bridge unavailable: {state.error}</span>
          </div>
        )}
        {state.config.types.map((candidate) => {
          const active = candidate.id === state.selection.typeId
          const tags = tagsFor(candidate)
          return (
            <button
              key={candidate.id}
              type="button"
              className="dsh-om-item"
              data-active={active ? 'true' : undefined}
              onClick={() => choose(candidate.id)}
            >
              <span className="dsh-om-item-main">
                <span className="dsh-om-item-name">
                  {candidate.name}
                  {tags.length > 0 && (
                    <span className="dsh-om-item-tags">
                      {tags.map(tag => <span key={tag} className="dsh-om-tag">{tag}</span>)}
                    </span>
                  )}
                </span>
                {candidate.description && <span className="dsh-om-item-desc">{candidate.description}</span>}
              </span>
              {active && <span className="dsh-om-check"><CheckIcon /></span>}
            </button>
          )
        })}
        <div className="dsh-om-menu-footer">
          <button type="button" className="dsh-om-footer-btn" onClick={() => { setOpen(false); openConfig(sessionId) }}>
            <GearIcon /> Manage output modes…
          </button>
        </div>
      </Popover>
      <ConfigEditorModal />
      <PreviewModal />
    </>
  )
}

/* ------------------------------------------------------------ mode picker */

export function OutputModePicker({ sessionId }) {
  const state = useSnapshot(sessionId)
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const mode = modeOf(state.config, state.selection.modeId)

  useEffect(() => watch(sessionId), [sessionId])

  const choose = (nextModeId) => {
    setOpen(false)
    if (nextModeId === state.selection.modeId) return
    void select(sessionId, state.selection.typeId, nextModeId)
  }

  return (
    <>
      <div className="dsh-om" style={{ display: 'inline-flex' }}>
        <button
          ref={anchorRef}
          type="button"
          className="dsh-om-trigger"
          data-open={open ? 'true' : undefined}
          data-saving={state.saving ? 'true' : undefined}
          title={`Detail level: ${mode.name}${mode.description ? ` — ${mode.description}` : ''}`}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(value => !value)}
        >
          <span className="dsh-om-trigger-label">{mode.name}</span>
          <ChevronIcon />
        </button>
      </div>
      <Popover anchorRef={anchorRef} open={open} onClose={() => setOpen(false)} width={286}>
        <div className="dsh-om-menu-head">
          <span className="dsh-om-menu-title">Detail level</span>
          <span className="dsh-om-menu-hint">applies to your next message</span>
        </div>
        {state.config.modes.map((candidate) => {
          const active = candidate.id === state.selection.modeId
          return (
            <button
              key={candidate.id}
              type="button"
              className="dsh-om-item"
              data-active={active ? 'true' : undefined}
              onClick={() => choose(candidate.id)}
            >
              <span className="dsh-om-item-main">
                <span className="dsh-om-item-name">{candidate.name}</span>
                {candidate.description && <span className="dsh-om-item-desc">{candidate.description}</span>}
              </span>
              {active && <span className="dsh-om-check"><CheckIcon /></span>}
            </button>
          )
        })}
        <div className="dsh-om-menu-footer">
          <button type="button" className="dsh-om-footer-btn" onClick={() => { setOpen(false); openConfig(sessionId) }}>
            <GearIcon /> Manage levels…
          </button>
        </div>
      </Popover>
    </>
  )
}

/* ------------------------------------------------------------ status strip */

function statusOf(run) {
  switch (run.status) {
    case 'running': return { tone: 'busy', text: 'Generating' }
    case 'validating': return { tone: 'busy', text: 'Validating output' }
    case 'retrying': return { tone: 'busy', text: `Repairing · attempt ${run.attempt}/${run.maxRetries}` }
    case 'passed': return { tone: 'ok', text: 'Validated' }
    case 'serving': return { tone: 'busy', text: 'Starting preview' }
    case 'served': return { tone: 'ok', text: 'Preview ready' }
    case 'failed': return { tone: 'error', text: 'Validation failed' }
    case 'serve-error': return { tone: 'error', text: 'Preview failed' }
    case 'error': return { tone: 'error', text: 'Turn failed' }
    case 'aborted': return { tone: 'warn', text: 'Stopped' }
    case 'max-tokens': return { tone: 'warn', text: 'Output limit reached' }
    case 'superseded': return { tone: 'warn', text: 'Superseded' }
    case 'ended': return { tone: 'warn', text: 'Ended before validation' }
    default: return { tone: 'warn', text: run.status }
  }
}

export function OutputStatus({ sessionId }) {
  const state = useSnapshot(sessionId)
  const [expanded, setExpanded] = useState(false)
  const run = state.run
  useEffect(() => watch(sessionId), [sessionId])
  useEffect(() => { setExpanded(false) }, [run?.turn, run?.status])

  if (state.status === 'loading') return null
  if (state.status === 'error' && run === null) {
    return (
      <div className="dsh-om">
        <div className="dsh-om-strip">
          <span className="dsh-om-strip-main">
            <span className="dsh-om-strip-label">Output modes</span>
            <span className="dsh-om-strip-error">Host bridge unavailable: {state.error}</span>
          </span>
          <span className="dsh-om-strip-actions">
            <button type="button" className="dsh-om-button" onClick={() => openConfig(sessionId)}>Manage</button>
          </span>
        </div>
      </div>
    )
  }
  if (state.configError) {
    return (
      <div className="dsh-om">
        <div className="dsh-om-strip">
          <span className="dsh-om-strip-main">
            <span className="dsh-om-strip-label">Output modes</span>
            <span className="dsh-om-strip-error">Configuration issue: {state.configError}</span>
          </span>
          <span className="dsh-om-strip-actions">
            <button type="button" className="dsh-om-button" onClick={() => openConfig(sessionId)}>Manage</button>
          </span>
        </div>
      </div>
    )
  }
  if (run === null || run.status === 'superseded') return null

  const runType = typeOf(state.config, run.typeId)
  const hasWork = runType.validation?.kind !== 'none' || runType.serve?.kind !== 'none'
  const needsAttention = run.status === 'failed' || run.status === 'serve-error'
    || (Array.isArray(run.errors) && run.errors.length > 0 && run.status !== 'passed')
  if (!hasWork && !needsAttention) return null

  const status = statusOf(run)
  const errors = Array.isArray(run.errors) ? run.errors.filter(Boolean) : []
  const url = previewUrl(run)
  const canExpand = errors.length > 0

  return (
    <div className="dsh-om">
      <div
        className="dsh-om-strip"
        data-expanded={expanded ? 'true' : undefined}
        data-clickable={canExpand ? 'true' : undefined}
        onClick={canExpand ? () => setExpanded(value => !value) : undefined}
      >
        <span className="dsh-om-strip-main">
          <span className="dsh-om-strip-label">{run.typeName ?? 'Output'}</span>
          <span className="dsh-om-strip-sep">·</span>
          <span className="dsh-om-strip-meta">{run.modeName ?? ''}</span>
          <span className="dsh-om-status" data-tone={status.tone}>
            <span className="dsh-om-status-dot" />
            {status.text}
          </span>
          {run.validation?.detail && !canExpand && (
            <span className="dsh-om-strip-meta">{run.validation.detail}</span>
          )}
          {canExpand && !expanded && (
            <span className="dsh-om-strip-error">{errors[0]}</span>
          )}
          {canExpand && expanded && (
            <span className="dsh-om-strip-error">{errors.join('\n')}</span>
          )}
        </span>
        <span className="dsh-om-strip-actions" onClick={event => event.stopPropagation()}>
          {url !== null && (
            <button
              type="button"
              className="dsh-om-button"
              data-primary="true"
              onClick={() => openPreview({ kind: 'preview', url, run })}
            >
              Preview
            </button>
          )}
          <button
            type="button"
            className="dsh-om-button"
            onClick={() => openPreview({ kind: 'details', run })}
            title="Inspect this run"
          >
            Details
          </button>
        </span>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- preview */

function RunDetails({ run }) {
  return (
    <div className="dsh-om" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <dl className="dsh-om-kv">
        <dt>Output type</dt><dd>{run.typeName ?? run.typeId}</dd>
        <dt>Detail level</dt><dd>{run.modeName ?? run.modeId}</dd>
        <dt>Status</dt><dd>{run.status}</dd>
        <dt>Attempts</dt><dd>{run.attempt} of {run.maxRetries}</dd>
        <dt>Run directory</dt><dd><code>{run.runDir ?? '—'}</code></dd>
        {run.validation?.detail && (<><dt>Validation</dt><dd>{run.validation.detail}</dd></>)}
        {run.serveUrl && (<><dt>Serve URL</dt><dd><code>{run.serveUrl}</code></dd></>)}
      </dl>
      <div className="dsh-om-field">
        <span className="dsh-om-field-label">Validation output</span>
        <pre className="dsh-om-details-pre">{(run.errors?.length ? run.errors.join('\n\n') : 'No validation errors recorded.')}</pre>
      </div>
    </div>
  )
}

export function PreviewModal() {
  const ui = useUiState()
  const preview = ui.preview
  useEffect(() => {
    if (preview === null) return undefined
    const onKey = (event) => { if (event.key === 'Escape') closePreview() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])
  if (preview === null) return null
  const run = preview.run
  const title = preview.kind === 'details' ? 'Output run details' : `${run?.typeName ?? 'Output'} preview`
  let crossOrigin = false
  if (preview.kind === 'preview') {
    try { crossOrigin = new URL(preview.url).origin !== window.location.origin } catch { crossOrigin = false }
  }
  return createPortal(
    <div className="dsh-om dsh-om-overlay" onPointerDown={(event) => { if (event.target === event.currentTarget) closePreview() }}>
      <div className="dsh-om-modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="dsh-om-modal-head">
          <div className="dsh-om-modal-titles">
            <h2 className="dsh-om-modal-title">{title}</h2>
            <p className="dsh-om-modal-sub">
              {preview.kind === 'details'
                ? 'The harness validates every output type that declares validation before the turn closes.'
                : 'Rendered inside DeepSeek Harness from the validated run output.'}
            </p>
          </div>
          {preview.kind === 'preview' && crossOrigin && (
            <a className="dsh-om-button" href={preview.url} target="_blank" rel="noreferrer noopener">Open in new tab</a>
          )}
          <button type="button" className="dsh-om-icon-button" aria-label="Close" onClick={closePreview}><CloseIcon /></button>
        </div>
        <div className="dsh-om-modal-body">
          {preview.kind === 'details'
            ? <RunDetails run={run} />
            : (
              <div className="dsh-om-preview">
                <div className="dsh-om-preview-note">
                  {crossOrigin
                    ? 'Sandboxed preview from the configured serve command. Open it in a new tab if the app needs its own origin.'
                    : 'Sandboxed preview. Static output stays in the sandbox and cannot call DSH APIs; use a dev-server serve command for a standalone page.'}
                </div>
                <iframe
                  className="dsh-om-preview-frame"
                  title={title}
                  src={preview.url}
                  sandbox="allow-scripts allow-forms allow-modals allow-popups"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/* --------------------------------------------------------------- editor */

function Field({ label, help, children }) {
  return (
    <label className="dsh-om-field">
      <span className="dsh-om-field-label">
        {label}
        {help && <span className="dsh-om-field-help">{help}</span>}
      </span>
      {children}
    </label>
  )
}

function JsonArea({ value, onChange, rows = 9 }) {
  const [text, setText] = useState(() => JSON.stringify(value ?? {}, null, 2))
  const [error, setError] = useState(null)
  return (
    <>
      <textarea
        className="dsh-om-textarea"
        data-mono="true"
        data-invalid={error !== null ? 'true' : undefined}
        rows={rows}
        value={text}
        onChange={(event) => {
          const next = event.target.value
          setText(next)
          try {
            const parsed = JSON.parse(next)
            setError(null)
            onChange(parsed)
          } catch (parseError) {
            setError(parseError.message)
            // Keep the invalid text visible but make the draft un-savable:
            // the Host rejects a schema that is not an object.
            onChange(undefined)
          }
        }}
      />
      {error !== null && <span className="dsh-om-error">Invalid JSON: {error}</span>}
    </>
  )
}

function FilesEditor({ files, onChange }) {
  const list = Array.isArray(files) ? files : []
  const update = (index, patch) => onChange(list.map((file, position) => position === index ? { ...file, ...patch } : file))
  return (
    <div className="dsh-om-field">
      <span className="dsh-om-field-label">
        Required files
        <span className="dsh-om-field-help">relative to the run directory</span>
      </span>
      {list.map((file, index) => (
        <div className="dsh-om-inline" key={index}>
          <input
            className="dsh-om-input"
            placeholder="index.html"
            value={file.path ?? ''}
            onChange={(event) => update(index, { path: event.target.value })}
          />
          <input
            className="dsh-om-input"
            placeholder="must contain text (optional)"
            value={file.contains ?? ''}
            onChange={(event) => {
              const value = event.target.value
              const next = { ...file }
              if (value === '') delete next.contains
              else next.contains = value
              onChange(list.map((candidate, position) => position === index ? next : candidate))
            }}
          />
          <button type="button" className="dsh-om-remove" onClick={() => onChange(list.filter((_, position) => position !== index))}>Remove</button>
        </div>
      ))}
      <button type="button" className="dsh-om-add" onClick={() => onChange([...list, { path: '' }])}>+ Add file</button>
    </div>
  )
}

function TypeForm({ type, onChange, onDelete }) {
  const validation = type.validation ?? { kind: 'none' }
  const serve = type.serve ?? { kind: 'none' }
  const setValidation = (next) => onChange({ validation: next })
  const setServe = (next) => onChange({ serve: next })
  return (
    <div className="dsh-om-form">
      <div className="dsh-om-row">
        <div className="dsh-om-col">
          <Field label="Name">
            <input className="dsh-om-input" value={type.name ?? ''} onChange={(event) => onChange({ name: event.target.value })} />
          </Field>
        </div>
        <div className="dsh-om-col">
          <Field label="ID" help="stable key">
            <input className="dsh-om-input" value={type.id ?? ''} onChange={(event) => onChange({ id: event.target.value })} />
          </Field>
        </div>
      </div>
      <Field label="Description" help="shown in the picker">
        <input className="dsh-om-input" value={type.description ?? ''} onChange={(event) => onChange({ description: event.target.value })} />
      </Field>
      <div className="dsh-om-row">
        <div className="dsh-om-col">
          <Field label="Structure">
            <select className="dsh-om-select" value={type.output ?? 'text'} onChange={(event) => onChange({ output: event.target.value })}>
              <option value="text">Chat text</option>
              <option value="json">JSON in the final answer</option>
              <option value="files">Files in the run directory</option>
            </select>
          </Field>
        </div>
        <div className="dsh-om-col">
          <Field label="Repair attempts" help="0–5">
            <input
              className="dsh-om-input"
              type="number"
              min="0"
              max="5"
              value={type.maxRetries ?? 2}
              onChange={(event) => onChange({ maxRetries: Number(event.target.value) })}
            />
          </Field>
        </div>
      </div>
      <Field label="Model instructions" help="injected into the system prompt for this output type">
        <textarea
          className="dsh-om-textarea"
          rows={5}
          value={type.instructions ?? ''}
          placeholder="What the model must produce, how it should structure it, and any constraints."
          onChange={(event) => onChange({ instructions: event.target.value })}
        />
      </Field>
      <div className="dsh-om-row">
        <div className="dsh-om-col">
          <Field label="Validation">
            <select
              className="dsh-om-select"
              value={validation.kind ?? 'none'}
              onChange={(event) => {
                const kind = event.target.value
                if (kind === 'maxWords') setValidation({ kind, maxWords: 120 })
                else if (kind === 'json') setValidation({ kind, schema: { type: 'object' } })
                else if (kind === 'files') setValidation({ kind, files: [{ path: 'index.html' }] })
                else if (kind === 'command') setValidation({ kind, command: '', timeoutMs: 60_000 })
                else setValidation({ kind: 'none' })
              }}
            >
              <option value="none">None</option>
              <option value="maxWords">Word limit</option>
              <option value="json">JSON Schema</option>
              <option value="files">Required files</option>
              <option value="command">Shell command</option>
            </select>
          </Field>
        </div>
        <div className="dsh-om-col">
          <Field label="Preview">
            <select
              className="dsh-om-select"
              value={serve.kind ?? 'none'}
              onChange={(event) => {
                const kind = event.target.value
                if (kind === 'static') setServe({ kind, file: 'index.html' })
                else if (kind === 'command') setServe({ kind, command: '', urlTemplate: 'http://127.0.0.1:{port}/', readyTimeoutMs: 20_000 })
                else setServe({ kind: 'none' })
              }}
            >
              <option value="none">None</option>
              <option value="static">Static HTML from the run directory</option>
              <option value="command">Dev-server command</option>
            </select>
          </Field>
        </div>
      </div>
      {validation.kind === 'maxWords' && (
        <Field label="Maximum words">
          <input
            className="dsh-om-input"
            type="number"
            min="1"
            value={validation.maxWords ?? 120}
            onChange={(event) => setValidation({ kind: 'maxWords', maxWords: Number(event.target.value) })}
          />
        </Field>
      )}
      {validation.kind === 'json' && (
        <Field label="JSON Schema" help="the final answer's JSON must validate against this subset">
          <JsonArea value={validation.schema ?? {}} onChange={(schema) => setValidation({ kind: 'json', schema })} />
        </Field>
      )}
      {validation.kind === 'files' && (
        <FilesEditor files={validation.files ?? []} onChange={(files) => setValidation({ kind: 'files', files })} />
      )}
      {validation.kind === 'command' && (
        <>
          <Field label="Validation command" help="runs in the run directory; exit code 0 passes">
            <textarea
              className="dsh-om-textarea"
              data-mono="true"
              rows={3}
              value={validation.command ?? ''}
              placeholder="npm run build"
              onChange={(event) => setValidation({ ...validation, command: event.target.value })}
            />
          </Field>
          <Field label="Timeout (ms)">
            <input
              className="dsh-om-input"
              type="number"
              min="1000"
              max="300000"
              value={validation.timeoutMs ?? 60_000}
              onChange={(event) => setValidation({ ...validation, timeoutMs: Number(event.target.value) })}
            />
          </Field>
        </>
      )}
      {serve.kind === 'static' && (
        <Field label="Entry file" help="served from the run directory; relative assets resolve inside this single file">
          <input className="dsh-om-input" value={serve.file ?? 'index.html'} onChange={(event) => setServe({ kind: 'static', file: event.target.value })} />
        </Field>
      )}
      {serve.kind === 'command' && (
        <>
          <Field label="Serve command" help="runs in the run directory; {port} is replaced with a free port">
            <textarea
              className="dsh-om-textarea"
              data-mono="true"
              rows={3}
              value={serve.command ?? ''}
              placeholder="npm run dev -- --port {port} --host 127.0.0.1"
              onChange={(event) => setServe({ ...serve, command: event.target.value })}
            />
          </Field>
          <Field label="Preview URL template">
            <input
              className="dsh-om-input"
              value={serve.urlTemplate ?? 'http://127.0.0.1:{port}/'}
              onChange={(event) => setServe({ ...serve, urlTemplate: event.target.value })}
            />
          </Field>
          <Field label="Ready timeout (ms)">
            <input
              className="dsh-om-input"
              type="number"
              min="1000"
              max="120000"
              value={serve.readyTimeoutMs ?? 20_000}
              onChange={(event) => setServe({ ...serve, readyTimeoutMs: Number(event.target.value) })}
            />
          </Field>
        </>
      )}
      <div className="dsh-om-actions">
        <span className="dsh-om-help">Changes apply after Save. The next message uses them.</span>
        <button type="button" className="dsh-om-remove" onClick={onDelete}>Delete type</button>
      </div>
    </div>
  )
}

function ModeForm({ mode, onChange, onDelete }) {
  return (
    <div className="dsh-om-form">
      <div className="dsh-om-row">
        <div className="dsh-om-col">
          <Field label="Name">
            <input className="dsh-om-input" value={mode.name ?? ''} onChange={(event) => onChange({ name: event.target.value })} />
          </Field>
        </div>
        <div className="dsh-om-col">
          <Field label="ID" help="stable key">
            <input className="dsh-om-input" value={mode.id ?? ''} onChange={(event) => onChange({ id: event.target.value })} />
          </Field>
        </div>
      </div>
      <Field label="Description" help="shown in the picker">
        <input className="dsh-om-input" value={mode.description ?? ''} onChange={(event) => onChange({ description: event.target.value })} />
      </Field>
      <Field label="Model instructions" help="appended after the output type instructions">
        <textarea
          className="dsh-om-textarea"
          rows={7}
          value={mode.instructions ?? ''}
          placeholder="How this level differs: length, depth, examples, tone."
          onChange={(event) => onChange({ instructions: event.target.value })}
        />
      </Field>
      <div className="dsh-om-actions">
        <span className="dsh-om-help">Levels are global and can combine with any output type.</span>
        <button type="button" className="dsh-om-remove" onClick={onDelete}>Delete level</button>
      </div>
    </div>
  )
}

function newType() {
  return {
    id: 'new-type',
    name: 'New output type',
    description: '',
    output: 'text',
    instructions: '',
    validation: { kind: 'none' },
    serve: { kind: 'none' },
    maxRetries: 2,
  }
}

function newMode() {
  return { id: 'new-level', name: 'New level', description: '', instructions: '' }
}

export function ConfigEditorModal() {
  const ui = useUiState()
  const sessionId = ui.sessionId
  const state = useSnapshot(sessionId ?? '__output-modes-idle__')
  const open = ui.configOpen && sessionId !== null
  const [tab, setTab] = useState('types')
  const [draft, setDraft] = useState(() => cloneConfig(state.config))
  const [selectedType, setSelectedType] = useState(0)
  const [selectedMode, setSelectedMode] = useState(0)
  const [jsonText, setJsonText] = useState('')
  const [jsonError, setJsonError] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formRevision, setFormRevision] = useState(0)
  const seeded = useRef(false)

  useEffect(() => {
    if (!open) {
      seeded.current = false
      return
    }
    if (seeded.current) return
    if (state.status === 'loading') return
    setDraft(cloneConfig(state.config))
    setSelectedType(0)
    setSelectedMode(0)
    setTab('types')
    setJsonText('')
    setJsonError(null)
    setSaveError(null)
    setFormRevision(value => value + 1)
    seeded.current = true
  }, [open, sessionId, state.status])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') closeConfig() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  const updateType = (index, patch) => {
    setDraft((current) => ({
      ...current,
      types: current.types.map((type, position) => position === index ? { ...type, ...patch } : type),
    }))
  }
  const updateMode = (index, patch) => {
    setDraft((current) => ({
      ...current,
      modes: current.modes.map((mode, position) => position === index ? { ...mode, ...patch } : mode),
    }))
  }

  const switchTab = (next) => {
    if (next === tab) return
    if (tab === 'json' && next !== 'json') {
      try {
        setDraft(JSON.parse(jsonText))
        setJsonError(null)
      } catch (error) {
        setJsonError(error.message)
        return
      }
    }
    if (next === 'json') {
      setJsonText(JSON.stringify(draft, null, 2))
      setJsonError(null)
    }
    setTab(next)
  }

  const save = async () => {
    setSaveError(null)
    let candidate = draft
    if (tab === 'json') {
      try {
        candidate = JSON.parse(jsonText)
      } catch (error) {
        setJsonError(error.message)
        return
      }
    }
    if (!Array.isArray(candidate.types) || candidate.types.length === 0) {
      setSaveError('At least one output type is required.')
      return
    }
    if (!Array.isArray(candidate.modes) || candidate.modes.length === 0) {
      setSaveError('At least one level is required.')
      return
    }
    setSaving(true)
    const result = await saveConfig(sessionId, candidate)
    setSaving(false)
    if (result.ok) {
      closeConfig()
      return
    }
    setSaveError(result.error)
  }

  const reset = async () => {
    if (!window.confirm('Replace the current output types and levels with the shipped defaults?')) return
    setSaveError(null)
    const result = await resetConfig(sessionId)
    if (result.ok) {
      setDraft(cloneConfig(result.config))
      setFormRevision(value => value + 1)
      setTab('types')
      setSelectedType(0)
      setSelectedMode(0)
      setJsonText('')
      setJsonError(null)
    } else {
      setSaveError(result.error)
    }
  }

  const currentType = draft.types?.[selectedType]
  const currentMode = draft.modes?.[selectedMode]

  return createPortal(
    <div className="dsh-om dsh-om-overlay" onPointerDown={(event) => { if (event.target === event.currentTarget) closeConfig() }}>
      <div className="dsh-om-modal" role="dialog" aria-modal="true" aria-label="Output modes">
        <div className="dsh-om-modal-head">
          <div className="dsh-om-modal-titles">
            <h2 className="dsh-om-modal-title">Output modes</h2>
            <p className="dsh-om-modal-sub">
              Output types define the required structure, validation, and preview command. Levels add a length/depth
              instruction on top. Both are saved on the Host and apply to your next message.
            </p>
          </div>
          <button type="button" className="dsh-om-icon-button" aria-label="Close" onClick={closeConfig}><CloseIcon /></button>
        </div>
        <div className="dsh-om-modal-body">
          <div className="dsh-om-tabs" style={{ marginBottom: 14 }}>
            <button type="button" className="dsh-om-tab" data-active={tab === 'types' ? 'true' : undefined} onClick={() => switchTab('types')}>Output types</button>
            <button type="button" className="dsh-om-tab" data-active={tab === 'levels' ? 'true' : undefined} onClick={() => switchTab('levels')}>Levels</button>
            <button type="button" className="dsh-om-tab" data-active={tab === 'json' ? 'true' : undefined} onClick={() => switchTab('json')}>Raw JSON</button>
          </div>

          {tab === 'types' && (
            <div className="dsh-om-editor">
              <div className="dsh-om-editor-list">
                {(draft.types ?? []).map((type, index) => (
                  <button
                    key={index}
                    type="button"
                    className="dsh-om-list-item"
                    data-active={index === selectedType ? 'true' : undefined}
                    onClick={() => setSelectedType(index)}
                  >
                    <span className="dsh-om-list-name">{type.name || type.id || `Type ${index + 1}`}</span>
                    <span className="dsh-om-list-desc">{type.description || type.output || 'text'}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="dsh-om-add"
                  onClick={() => {
                    const next = newType()
                    setDraft((current) => ({ ...current, types: [...current.types, next] }))
                    setSelectedType((draft.types ?? []).length)
                  }}
                >
                  + New output type
                </button>
              </div>
              <div className="dsh-om-editor-form">
                {currentType === undefined
                  ? <div className="dsh-om-list-empty">Add an output type to get started.</div>
                  : (
                    <TypeForm
                      key={`${selectedType}-${formRevision}`}
                      type={currentType}
                      onChange={(patch) => updateType(selectedType, patch)}
                      onDelete={() => {
                        if (!window.confirm(`Delete output type "${currentType.name}"?`)) return
                        setDraft((current) => ({ ...current, types: current.types.filter((_, position) => position !== selectedType) }))
                        setSelectedType((value) => Math.max(0, value - 1))
                      }}
                    />
                  )}
              </div>
            </div>
          )}

          {tab === 'levels' && (
            <div className="dsh-om-editor">
              <div className="dsh-om-editor-list">
                {(draft.modes ?? []).map((mode, index) => (
                  <button
                    key={index}
                    type="button"
                    className="dsh-om-list-item"
                    data-active={index === selectedMode ? 'true' : undefined}
                    onClick={() => setSelectedMode(index)}
                  >
                    <span className="dsh-om-list-name">{mode.name || mode.id || `Level ${index + 1}`}</span>
                    <span className="dsh-om-list-desc">{mode.description || 'No description'}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="dsh-om-add"
                  onClick={() => {
                    const next = newMode()
                    setDraft((current) => ({ ...current, modes: [...current.modes, next] }))
                    setSelectedMode((draft.modes ?? []).length)
                  }}
                >
                  + New level
                </button>
              </div>
              <div className="dsh-om-editor-form">
                {currentMode === undefined
                  ? <div className="dsh-om-list-empty">Add a level to get started.</div>
                  : (
                    <ModeForm
                      key={`${selectedMode}-${formRevision}`}
                      mode={currentMode}
                      onChange={(patch) => updateMode(selectedMode, patch)}
                      onDelete={() => {
                        if (!window.confirm(`Delete level "${currentMode.name}"?`)) return
                        setDraft((current) => ({ ...current, modes: current.modes.filter((_, position) => position !== selectedMode) }))
                        setSelectedMode((value) => Math.max(0, value - 1))
                      }}
                    />
                  )}
              </div>
            </div>
          )}

          {tab === 'json' && (
            <div className="dsh-om-form">
              <div className="dsh-om-help">
                The whole configuration document. Saving validates every field on the Host and applies it immediately.
              </div>
              <textarea
                className="dsh-om-json"
                value={jsonText}
                spellCheck={false}
                onChange={(event) => { setJsonText(event.target.value); setJsonError(null) }}
              />
              {jsonError !== null && <div className="dsh-om-error">Invalid JSON: {jsonError}</div>}
            </div>
          )}
        </div>
        <div className="dsh-om-modal-foot">
          <button type="button" className="dsh-om-button" onClick={reset} disabled={saving}>Reset defaults</button>
          <span className="dsh-om-spacer" />
          {saveError !== null && <span className="dsh-om-error" style={{ maxWidth: 420 }}>{saveError}</span>}
          <button type="button" className="dsh-om-button" onClick={closeConfig} disabled={saving}>Cancel</button>
          <button type="button" className="dsh-om-button" data-primary="true" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
