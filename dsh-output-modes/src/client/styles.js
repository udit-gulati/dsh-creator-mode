/** Injected stylesheet for the output-modes composer controls, editor, and preview. */

export const STYLE_ID = 'dsh-output-modes/styles'

export const CSS = `
.dsh-om { --om-radius: 8px; --om-text: var(--dsw-alias-label-primary, #181818); --om-secondary: var(--dsw-alias-label-secondary, #555); --om-tertiary: var(--dsw-alias-label-tertiary, #777); --om-border: var(--dsw-alias-border-l1, rgba(127,127,127,.24)); --om-border-strong: var(--dsw-alias-border-l2, rgba(127,127,127,.38)); --om-surface: var(--dsw-alias-bg-layer-3, #fff); --om-surface-soft: var(--dsw-alias-bg-layer-1, rgba(127,127,127,.05)); --om-hover: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.12)); --om-accent: var(--dsw-alias-state-business-primary, #4d6bfe); --om-accent-soft: var(--dsw-alias-state-business-tertiary, rgba(77,107,254,.14)); --om-success: var(--dsw-alias-state-success-primary, #1a9c62); --om-warn: var(--dsw-alias-state-warn-primary, #b7791f); --om-error: var(--dsw-alias-state-error-primary, #d64545); font: inherit; }
.dsh-om * { box-sizing: border-box; }
.dsh-om button, .dsh-om input, .dsh-om textarea, .dsh-om select { font: inherit; }

.dsh-om-trigger { display: inline-flex; align-items: center; gap: 6px; height: 26px; max-width: 170px; padding: 0 8px; border: 1px solid transparent; border-radius: 7px; background: transparent; color: var(--om-secondary); cursor: pointer; font-size: 12px; line-height: 1; white-space: nowrap; transition: background .12s ease, color .12s ease, border-color .12s ease; }
.dsh-om-trigger:hover { background: var(--om-hover); color: var(--om-text); }
.dsh-om-trigger[data-open="true"] { border-color: var(--om-border); background: var(--om-surface-soft); color: var(--om-text); }
.dsh-om-trigger:focus-visible { outline: 2px solid var(--om-accent); outline-offset: 1px; }
.dsh-om-trigger[data-saving="true"] { opacity: .62; }
.dsh-om-trigger-glyph { display: inline-grid; place-items: center; width: 14px; height: 14px; color: var(--om-accent); flex: none; }
.dsh-om-trigger-label { overflow: hidden; text-overflow: ellipsis; }
.dsh-om-chevron { flex: none; opacity: .55; }

.dsh-om-scrim { position: fixed; inset: 0; z-index: 9998; background: transparent; }
.dsh-om-menu { position: fixed; z-index: 9999; max-height: min(440px, calc(100vh - 24px)); overflow: auto; padding: 6px; border: 1px solid var(--om-border-strong); border-radius: 12px; background: var(--om-surface); color: var(--om-text); box-shadow: 0 14px 40px rgba(0,0,0,.22); font-size: 12px; }
.dsh-om-menu-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 6px 8px 8px; }
.dsh-om-menu-title { font-weight: 650; font-size: 12px; }
.dsh-om-menu-hint { color: var(--om-tertiary); font-size: 10.5px; white-space: nowrap; }
.dsh-om-item { display: flex; gap: 9px; width: 100%; padding: 8px 9px; border: 0; border-radius: 8px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.dsh-om-item:hover { background: var(--om-hover); }
.dsh-om-item[data-active="true"] { background: var(--om-accent-soft); }
.dsh-om-item-main { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.dsh-om-item-name { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 620; }
.dsh-om-item-desc { color: var(--om-tertiary); font-size: 11px; line-height: 1.35; }
.dsh-om-item-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.dsh-om-tag { display: inline-flex; align-items: center; height: 15px; padding: 0 5px; border-radius: 999px; background: var(--om-surface-soft); color: var(--om-tertiary); border: 1px solid var(--om-border); font-size: 9.5px; letter-spacing: .02em; text-transform: uppercase; }
.dsh-om-check { margin-left: auto; color: var(--om-accent); flex: none; display: inline-grid; place-items: center; }
.dsh-om-menu-footer { display: flex; gap: 4px; margin-top: 4px; padding: 5px 2px 1px; border-top: 1px solid var(--om-border); }
.dsh-om-footer-btn { display: inline-flex; align-items: center; gap: 6px; flex: 1; padding: 7px 8px; border: 0; border-radius: 7px; background: transparent; color: var(--om-secondary); cursor: pointer; font-size: 11.5px; text-align: left; }
.dsh-om-footer-btn:hover { background: var(--om-hover); color: var(--om-text); }

.dsh-om-strip { display: flex; align-items: center; gap: 9px; width: 100%; padding: 6px 9px; border: 1px solid var(--om-border); border-radius: 10px; background: var(--om-surface-soft); color: var(--om-secondary); font-size: 11.5px; }
.dsh-om-strip-main { display: flex; align-items: center; gap: 7px; min-width: 0; flex: 1; flex-wrap: wrap; }
.dsh-om-strip-label { color: var(--om-text); font-weight: 600; white-space: nowrap; }
.dsh-om-strip-sep { color: var(--om-tertiary); opacity: .6; }
.dsh-om-strip-meta { color: var(--om-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 320px; }
.dsh-om-status { display: inline-flex; align-items: center; gap: 6px; padding: 2px 7px 2px 6px; border-radius: 999px; border: 1px solid var(--om-border); background: var(--om-surface); color: var(--om-secondary); white-space: nowrap; font-size: 10.5px; }
.dsh-om-status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--om-tertiary); flex: none; }
.dsh-om-status[data-tone="busy"] .dsh-om-status-dot { background: var(--om-accent); animation: dsh-om-pulse 1.2s ease-in-out infinite; }
.dsh-om-status[data-tone="busy"] { color: var(--om-accent); border-color: color-mix(in srgb, var(--om-accent) 35%, transparent); }
.dsh-om-status[data-tone="ok"] .dsh-om-status-dot { background: var(--om-success); }
.dsh-om-status[data-tone="ok"] { color: var(--om-success); border-color: color-mix(in srgb, var(--om-success) 35%, transparent); }
.dsh-om-status[data-tone="warn"] .dsh-om-status-dot { background: var(--om-warn); }
.dsh-om-status[data-tone="warn"] { color: var(--om-warn); border-color: color-mix(in srgb, var(--om-warn) 35%, transparent); }
.dsh-om-status[data-tone="error"] .dsh-om-status-dot { background: var(--om-error); }
.dsh-om-status[data-tone="error"] { color: var(--om-error); border-color: color-mix(in srgb, var(--om-error) 35%, transparent); }
@keyframes dsh-om-pulse { 0%,100% { opacity: .4; transform: scale(.85); } 50% { opacity: 1; transform: scale(1); } }
.dsh-om-strip-actions { display: flex; align-items: center; gap: 4px; flex: none; }
.dsh-om-button { display: inline-flex; align-items: center; justify-content: center; gap: 5px; height: 24px; padding: 0 8px; border: 1px solid var(--om-border-strong); border-radius: 7px; background: var(--om-surface); color: var(--om-text); cursor: pointer; font-size: 11px; white-space: nowrap; }
.dsh-om-button:hover { background: var(--om-hover); }
.dsh-om-button[data-primary="true"] { border-color: transparent; background: var(--om-accent); color: #fff; }
.dsh-om-button[data-primary="true"]:hover { filter: brightness(.94); }
.dsh-om-button:disabled { opacity: .45; cursor: default; }
.dsh-om-strip-error { flex-basis: 100%; margin: 2px 0 0; color: var(--om-error); font-size: 10.5px; line-height: 1.35; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-om-strip[data-expanded="true"] { align-items: flex-start; }
.dsh-om-strip[data-expanded="true"] .dsh-om-strip-error { white-space: pre-wrap; overflow: visible; }
.dsh-om-strip[data-clickable="true"] { cursor: pointer; }

.dsh-om-overlay { position: fixed; inset: 0; z-index: 10010; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(0,0,0,.42); backdrop-filter: blur(2px); }
.dsh-om-modal { display: flex; flex-direction: column; width: min(980px, 100%); max-height: min(88vh, 940px); overflow: hidden; border: 1px solid var(--om-border-strong); border-radius: 16px; background: var(--om-surface); color: var(--om-text); box-shadow: 0 26px 90px rgba(0,0,0,.36); font-size: 12.5px; }
.dsh-om-modal-head { display: flex; align-items: flex-start; gap: 12px; padding: 16px 18px 12px; border-bottom: 1px solid var(--om-border); }
.dsh-om-modal-titles { min-width: 0; flex: 1; }
.dsh-om-modal-title { margin: 0; font-size: 16px; font-weight: 680; letter-spacing: -.01em; }
.dsh-om-modal-sub { margin: 3px 0 0; color: var(--om-tertiary); font-size: 11.5px; line-height: 1.45; }
.dsh-om-icon-button { display: inline-grid; place-items: center; width: 28px; height: 28px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--om-secondary); cursor: pointer; font-size: 15px; line-height: 1; }
.dsh-om-icon-button:hover { background: var(--om-hover); color: var(--om-text); }
.dsh-om-modal-body { flex: 1; min-height: 0; overflow: auto; padding: 14px 18px; }
.dsh-om-modal-foot { display: flex; align-items: center; gap: 8px; padding: 11px 18px 14px; border-top: 1px solid var(--om-border); }
.dsh-om-modal-foot .dsh-om-spacer { flex: 1; }

.dsh-om-tabs { display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--om-border); border-radius: 9px; background: var(--om-surface-soft); }
.dsh-om-tab { height: 25px; padding: 0 10px; border: 0; border-radius: 7px; background: transparent; color: var(--om-secondary); cursor: pointer; font-size: 11.5px; }
.dsh-om-tab:hover { color: var(--om-text); }
.dsh-om-tab[data-active="true"] { background: var(--om-surface); color: var(--om-text); box-shadow: 0 1px 3px rgba(0,0,0,.12); }
.dsh-om-editor { display: flex; gap: 14px; min-height: 380px; }
.dsh-om-editor-list { width: 230px; flex: none; display: flex; flex-direction: column; gap: 4px; padding-right: 12px; border-right: 1px solid var(--om-border); overflow: auto; max-height: 58vh; }
.dsh-om-editor-form { flex: 1; min-width: 0; }
.dsh-om-list-item { display: flex; flex-direction: column; gap: 2px; width: 100%; padding: 8px 9px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.dsh-om-list-item:hover { background: var(--om-hover); }
.dsh-om-list-item[data-active="true"] { border-color: var(--om-border-strong); background: var(--om-surface-soft); }
.dsh-om-list-name { font-size: 12px; font-weight: 620; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-om-list-desc { color: var(--om-tertiary); font-size: 10.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsh-om-list-empty { padding: 12px 6px; color: var(--om-tertiary); font-size: 11.5px; }

.dsh-om-form { display: flex; flex-direction: column; gap: 12px; }
.dsh-om-row { display: flex; gap: 10px; min-width: 0; }
.dsh-om-col { flex: 1; min-width: 0; }
.dsh-om-field { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.dsh-om-field-label { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; color: var(--om-secondary); font-size: 11px; font-weight: 600; }
.dsh-om-field-help { color: var(--om-tertiary); font-size: 10.5px; font-weight: 400; }
.dsh-om-input, .dsh-om-select, .dsh-om-textarea { width: 100%; border: 1px solid var(--om-border-strong); border-radius: 7px; background: var(--om-surface); color: var(--om-text); outline: none; }
.dsh-om-input, .dsh-om-select { height: 30px; padding: 0 8px; font-size: 12px; }
.dsh-om-textarea { min-height: 74px; padding: 7px 8px; font-size: 12px; line-height: 1.45; resize: vertical; font-family: inherit; }
.dsh-om-textarea[data-mono="true"] { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; line-height: 1.5; }
.dsh-om-input:focus, .dsh-om-select:focus, .dsh-om-textarea:focus { border-color: var(--om-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--om-accent) 18%, transparent); }
.dsh-om-input[data-invalid="true"], .dsh-om-textarea[data-invalid="true"] { border-color: var(--om-error); }
.dsh-om-help { color: var(--om-tertiary); font-size: 10.5px; line-height: 1.4; }
.dsh-om-error { color: var(--om-error); font-size: 11px; line-height: 1.4; white-space: pre-wrap; }
.dsh-om-warning { color: var(--om-warn); font-size: 11px; line-height: 1.4; white-space: pre-wrap; }
.dsh-om-actions { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.dsh-om-inline { display: flex; align-items: center; gap: 6px; min-width: 0; }
.dsh-om-inline .dsh-om-input { flex: 1; }
.dsh-om-remove { height: 26px; padding: 0 7px; border: 1px solid var(--om-border); border-radius: 7px; background: transparent; color: var(--om-tertiary); cursor: pointer; font-size: 11px; }
.dsh-om-remove:hover { color: var(--om-error); border-color: color-mix(in srgb, var(--om-error) 40%, transparent); }
.dsh-om-add { align-self: flex-start; height: 26px; padding: 0 8px; border: 1px dashed var(--om-border-strong); border-radius: 7px; background: transparent; color: var(--om-secondary); cursor: pointer; font-size: 11px; }
.dsh-om-add:hover { background: var(--om-hover); color: var(--om-text); }
.dsh-om-json { width: 100%; min-height: 56vh; padding: 10px 12px; border: 1px solid var(--om-border-strong); border-radius: 9px; background: var(--om-surface-soft); color: var(--om-text); outline: none; resize: vertical; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; line-height: 1.55; }
.dsh-om-json:focus { border-color: var(--om-accent); }

.dsh-om-preview { display: flex; flex-direction: column; gap: 10px; }
.dsh-om-preview-note { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid var(--om-border); border-radius: 8px; background: var(--om-surface-soft); color: var(--om-secondary); font-size: 11.5px; }
.dsh-om-preview-frame { width: 100%; height: min(64vh, 620px); border: 1px solid var(--om-border-strong); border-radius: 10px; background: #fff; }
.dsh-om-preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 220px; padding: 24px; border: 1px dashed var(--om-border-strong); border-radius: 10px; color: var(--om-tertiary); text-align: center; font-size: 12px; }
.dsh-om-details-pre { margin: 0; padding: 10px 12px; max-height: 46vh; overflow: auto; border: 1px solid var(--om-border); border-radius: 9px; background: var(--om-surface-soft); color: var(--om-secondary); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
.dsh-om-kv { display: grid; grid-template-columns: 120px 1fr; gap: 6px 12px; font-size: 11.5px; color: var(--om-secondary); }
.dsh-om-kv dt { color: var(--om-tertiary); }
.dsh-om-kv dd { margin: 0; color: var(--om-text); word-break: break-word; }

@media (max-width: 640px) {
  .dsh-om-trigger-label { max-width: 74px; }
  .dsh-om-editor { flex-direction: column; }
  .dsh-om-editor-list { width: auto; max-height: 160px; padding-right: 0; padding-bottom: 8px; border-right: 0; border-bottom: 1px solid var(--om-border); flex-direction: row; overflow-x: auto; }
  .dsh-om-list-item { min-width: 150px; }
  .dsh-om-row { flex-direction: column; }
  .dsh-om-overlay { padding: 8px; }
  .dsh-om-modal { max-height: 94vh; }
}
`
