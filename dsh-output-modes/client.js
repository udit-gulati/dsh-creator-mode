window.__ModuleLoader__.load({
  id: "dsh-output-modes",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.jsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/styles.js
var STYLE_ID = "dsh-output-modes/styles";
var CSS = `
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
`;

// src/client/components.jsx
var import_react2 = require("react");
var import_react_dom = require("react-dom");

// src/client/store.js
var import_react = require("react");
var FALLBACK_CONFIG = {
  version: 1,
  defaults: { typeId: "detailed", modeId: "balanced" },
  types: [
    { id: "detailed", name: "Detailed answer", description: "Full, thorough response.", output: "text", instructions: "", validation: { kind: "none" }, serve: { kind: "none" }, maxRetries: 0 },
    { id: "short", name: "Short answer", description: "A direct answer capped at 120 words.", output: "text", instructions: "", validation: { kind: "maxWords", maxWords: 120 }, serve: { kind: "none" }, maxRetries: 1 },
    { id: "json", name: "Structured JSON", description: "One JSON object checked against a schema.", output: "json", instructions: "", validation: { kind: "json", schema: { type: "object" } }, serve: { kind: "none" }, maxRetries: 2 },
    { id: "react-app", name: "React app", description: "A runnable single-file React app.", output: "files", instructions: "", validation: { kind: "files", files: [{ path: "index.html" }] }, serve: { kind: "static", file: "index.html" }, maxRetries: 2 }
  ],
  modes: [
    { id: "concise", name: "Concise", description: "Shortest complete answer.", instructions: "" },
    { id: "balanced", name: "Balanced", description: "Default level of detail.", instructions: "" },
    { id: "exhaustive", name: "Exhaustive", description: "Thorough treatment.", instructions: "" }
  ]
};
var states = /* @__PURE__ */ new Map();
var listeners = /* @__PURE__ */ new Set();
var watchers = /* @__PURE__ */ new Map();
function initialState() {
  return {
    status: "loading",
    config: FALLBACK_CONFIG,
    configError: null,
    selection: { typeId: "detailed", modeId: "balanced" },
    run: null,
    host: null,
    error: null,
    saving: false,
    configSaving: false
  };
}
function snapshot(sessionId) {
  let state = states.get(sessionId);
  if (state === void 0) {
    state = initialState();
    states.set(sessionId, state);
  }
  return state;
}
function update(sessionId, patch) {
  states.set(sessionId, { ...snapshot(sessionId), ...patch });
  for (const listener of listeners) listener();
}
function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function useSnapshot(sessionId) {
  return (0, import_react.useSyncExternalStore)(
    subscribe,
    () => snapshot(sessionId),
    () => snapshot(sessionId)
  );
}
function apiUrl(path) {
  return new URL(`api/output-modes/${path}`, document.baseURI).href;
}
async function api(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    method: options.method ?? "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers: options.body === void 0 ? void 0 : { "content-type": "application/json" },
    body: options.body === void 0 ? void 0 : JSON.stringify(options.body)
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
  }
  if (!response.ok || data === null || data.ok !== true) {
    throw new Error(data?.error ?? `Host route answered HTTP ${response.status}`);
  }
  return data;
}
async function load(sessionId) {
  const watcher = watchers.get(sessionId);
  if (watcher !== void 0) {
    if (watcher.inflight) return;
    watcher.inflight = true;
  }
  try {
    const data = await api(`bootstrap?sessionId=${encodeURIComponent(sessionId)}`);
    update(sessionId, {
      status: "ready",
      config: data.config,
      configError: data.configError ?? null,
      selection: data.selection,
      run: data.run ?? null,
      host: data.host ?? null,
      error: null
    });
  } catch (error) {
    const current = snapshot(sessionId);
    update(sessionId, {
      status: current.status === "ready" ? "ready" : "error",
      error: error.message
    });
  } finally {
    if (watcher !== void 0) watcher.inflight = false;
  }
}
function watch(sessionId) {
  let watcher = watchers.get(sessionId);
  if (watcher === void 0) {
    watcher = { count: 0, timer: null, inflight: false };
    watchers.set(sessionId, watcher);
    void load(sessionId);
    watcher.timer = setInterval(() => {
      void load(sessionId);
    }, 1800);
  }
  watcher.count += 1;
  return () => {
    watcher.count -= 1;
    if (watcher.count <= 0) {
      clearInterval(watcher.timer);
      watchers.delete(sessionId);
    }
  };
}
async function select(sessionId, typeId, modeId) {
  const before = snapshot(sessionId).selection;
  update(sessionId, { selection: { typeId, modeId }, saving: true });
  try {
    const data = await api("select", { method: "POST", body: { sessionId, typeId, modeId } });
    update(sessionId, { selection: data.selection, saving: false, error: null });
    return true;
  } catch (error) {
    update(sessionId, { selection: before, saving: false, error: error.message });
    return false;
  }
}
async function saveConfig(sessionId, config) {
  update(sessionId, { configSaving: true });
  try {
    const data = await api("config", { method: "POST", body: { config } });
    update(sessionId, { config: data.config, configError: null, configSaving: false, error: null });
    return { ok: true, config: data.config };
  } catch (error) {
    update(sessionId, { configSaving: false });
    return { ok: false, error: error.message };
  }
}
async function resetConfig(sessionId) {
  update(sessionId, { configSaving: true });
  try {
    const data = await api("reset", { method: "POST", body: {} });
    update(sessionId, { config: data.config, configError: null, configSaving: false, error: null });
    return { ok: true, config: data.config };
  } catch (error) {
    update(sessionId, { configSaving: false });
    return { ok: false, error: error.message };
  }
}
function previewUrl(run) {
  if (run === null || run === void 0) return null;
  if (typeof run.previewPath === "string" && run.previewPath !== "") {
    return new URL(run.previewPath, document.baseURI).href;
  }
  if (typeof run.serveUrl === "string" && run.serveUrl !== "") return run.serveUrl;
  return null;
}
function typeOf(config, typeId) {
  return config.types.find((type) => type.id === typeId) ?? config.types[0];
}
function modeOf(config, modeId) {
  return config.modes.find((mode) => mode.id === modeId) ?? config.modes[0];
}
function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}
var uiState = { configOpen: false, preview: null, sessionId: null };
var uiListeners = /* @__PURE__ */ new Set();
function emitUi() {
  for (const listener of uiListeners) listener();
}
function useUiState() {
  return (0, import_react.useSyncExternalStore)(
    (listener) => {
      uiListeners.add(listener);
      return () => {
        uiListeners.delete(listener);
      };
    },
    () => uiState,
    () => uiState
  );
}
function openConfig(sessionId) {
  uiState = { ...uiState, configOpen: true, sessionId };
  emitUi();
}
function closeConfig() {
  uiState = { ...uiState, configOpen: false };
  emitUi();
}
function openPreview(preview) {
  uiState = { ...uiState, preview };
  emitUi();
}
function closePreview() {
  uiState = { ...uiState, preview: null };
  emitUi();
}

// src/client/components.jsx
var import_jsx_runtime = require("react/jsx-runtime");
function ChevronIcon({ size = 10 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "dsh-om-chevron", width: size, height: size, viewBox: "0 0 10 10", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 3.6 5 6.4 8 3.6", fill: "none", stroke: "currentColor", strokeWidth: "1.35", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function CheckIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "12", height: "12", viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m2.4 6.2 2.3 2.3 4.9-5", fill: "none", stroke: "currentColor", strokeWidth: "1.6", strokeLinecap: "round", strokeLinejoin: "round" }) });
}
function CloseIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "13", height: "13", viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2.5 2.5 9.5 9.5M9.5 2.5 2.5 9.5", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }) });
}
function OutputGlyph({ output }) {
  if (output === "json") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 2.5c-1.2 0-1.8.6-1.8 1.9v1.2c0 .9-.4 1.4-1.2 1.4.8 0 1.2.5 1.2 1.4v1.2c0 1.3.6 1.9 1.8 1.9M9 2.5c1.2 0 1.8.6 1.8 1.9v1.2c0 .9.4 1.4 1.2 1.4-.8 0-1.2.5-1.2 1.4v1.2c0 1.3-.6 1.9-1.8 1.9", fill: "none", stroke: "currentColor", strokeWidth: "1.15", strokeLinecap: "round" }) });
  }
  if (output === "files") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "2", width: "10", height: "10", rx: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.15" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 5h4M5 7h4M5 9h2.5", fill: "none", stroke: "currentColor", strokeWidth: "1.15", strokeLinecap: "round" })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: "14", height: "14", viewBox: "0 0 14 14", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 3.5h8M3 7h8M3 10.5h5", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round" }) });
}
function GearIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { width: "13", height: "13", viewBox: "0 0 14 14", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "7", cy: "7", r: "2", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 1.6v1.5M7 10.9v1.5M1.6 7h1.5M10.9 7h1.5M3.2 3.2l1 1M9.8 9.8l1 1M10.8 3.2l-1 1M4.2 9.8l-1 1", fill: "none", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })
  ] });
}
function useAnchoredStyle(anchorRef, open, preferredWidth) {
  const [style, setStyle] = (0, import_react2.useState)({});
  (0, import_react2.useLayoutEffect)(() => {
    if (!open) return void 0;
    const place = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (rect === void 0) return;
      const width = Math.min(preferredWidth, window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
      const below = window.innerHeight - rect.bottom;
      const top = below >= 260 ? rect.bottom + 6 : Math.max(12, rect.top - Math.min(420, Math.max(220, rect.top - 12)));
      setStyle({ left, top, width });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [anchorRef, open, preferredWidth]);
  return style;
}
function Popover({ anchorRef, open, onClose, width = 316, children }) {
  const style = useAnchoredStyle(anchorRef, open, width);
  (0, import_react2.useEffect)(() => {
    if (!open) return void 0;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om dsh-om-scrim", onPointerDown: onClose }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om dsh-om-menu", style, role: "dialog", "aria-label": "Output modes", children })
    ] }),
    document.body
  );
}
function tagsFor(type) {
  const tags = [];
  if (type.validation?.kind && type.validation.kind !== "none") tags.push("validated");
  if (type.serve?.kind && type.serve.kind !== "none") tags.push("preview");
  return tags;
}
function OutputTypePicker({ sessionId }) {
  const state = useSnapshot(sessionId);
  const [open, setOpen] = (0, import_react2.useState)(false);
  const anchorRef = (0, import_react2.useRef)(null);
  const type = typeOf(state.config, state.selection.typeId);
  (0, import_react2.useEffect)(() => watch(sessionId), [sessionId]);
  const choose = (nextTypeId) => {
    setOpen(false);
    if (nextTypeId === state.selection.typeId) return;
    void select(sessionId, nextTypeId, state.selection.modeId);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om", style: { display: "inline-flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        ref: anchorRef,
        type: "button",
        className: "dsh-om-trigger",
        "data-open": open ? "true" : void 0,
        "data-saving": state.saving ? "true" : void 0,
        title: `Output type: ${type.name}${type.description ? ` \u2014 ${type.description}` : ""}`,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: () => setOpen((value) => !value),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-trigger-glyph", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutputGlyph, { output: type.output }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-trigger-label", children: type.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronIcon, {})
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { anchorRef, open, onClose: () => setOpen(false), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-menu-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-menu-title", children: "Output type" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-menu-hint", children: "applies to your next message" })
      ] }),
      state.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-menu-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-warning", children: [
        "Host bridge unavailable: ",
        state.error
      ] }) }),
      state.config.types.map((candidate) => {
        const active = candidate.id === state.selection.typeId;
        const tags = tagsFor(candidate);
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: "dsh-om-item",
            "data-active": active ? "true" : void 0,
            onClick: () => choose(candidate.id),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-item-main", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-item-name", children: [
                  candidate.name,
                  tags.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-item-tags", children: tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-tag", children: tag }, tag)) })
                ] }),
                candidate.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-item-desc", children: candidate.description })
              ] }),
              active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-check", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, {}) })
            ]
          },
          candidate.id
        );
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-menu-footer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dsh-om-footer-btn", onClick: () => {
        setOpen(false);
        openConfig(sessionId);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearIcon, {}),
        " Manage output modes\u2026"
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfigEditorModal, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewModal, {})
  ] });
}
function OutputModePicker({ sessionId }) {
  const state = useSnapshot(sessionId);
  const [open, setOpen] = (0, import_react2.useState)(false);
  const anchorRef = (0, import_react2.useRef)(null);
  const mode = modeOf(state.config, state.selection.modeId);
  (0, import_react2.useEffect)(() => watch(sessionId), [sessionId]);
  const choose = (nextModeId) => {
    setOpen(false);
    if (nextModeId === state.selection.modeId) return;
    void select(sessionId, state.selection.typeId, nextModeId);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om", style: { display: "inline-flex" }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "button",
      {
        ref: anchorRef,
        type: "button",
        className: "dsh-om-trigger",
        "data-open": open ? "true" : void 0,
        "data-saving": state.saving ? "true" : void 0,
        title: `Detail level: ${mode.name}${mode.description ? ` \u2014 ${mode.description}` : ""}`,
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        onClick: () => setOpen((value) => !value),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-trigger-label", children: mode.name }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronIcon, {})
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { anchorRef, open, onClose: () => setOpen(false), width: 286, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-menu-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-menu-title", children: "Detail level" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-menu-hint", children: "applies to your next message" })
      ] }),
      state.config.modes.map((candidate) => {
        const active = candidate.id === state.selection.modeId;
        return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: "dsh-om-item",
            "data-active": active ? "true" : void 0,
            onClick: () => choose(candidate.id),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-item-main", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-item-name", children: candidate.name }),
                candidate.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-item-desc", children: candidate.description })
              ] }),
              active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-check", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckIcon, {}) })
            ]
          },
          candidate.id
        );
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-menu-footer", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dsh-om-footer-btn", onClick: () => {
        setOpen(false);
        openConfig(sessionId);
      }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearIcon, {}),
        " Manage levels\u2026"
      ] }) })
    ] })
  ] });
}
function statusOf(run) {
  switch (run.status) {
    case "running":
      return { tone: "busy", text: "Generating" };
    case "validating":
      return { tone: "busy", text: "Validating output" };
    case "retrying":
      return { tone: "busy", text: `Repairing \xB7 attempt ${run.attempt}/${run.maxRetries}` };
    case "passed":
      return { tone: "ok", text: "Validated" };
    case "serving":
      return { tone: "busy", text: "Starting preview" };
    case "served":
      return { tone: "ok", text: "Preview ready" };
    case "failed":
      return { tone: "error", text: "Validation failed" };
    case "serve-error":
      return { tone: "error", text: "Preview failed" };
    case "error":
      return { tone: "error", text: "Turn failed" };
    case "aborted":
      return { tone: "warn", text: "Stopped" };
    case "max-tokens":
      return { tone: "warn", text: "Output limit reached" };
    case "superseded":
      return { tone: "warn", text: "Superseded" };
    case "ended":
      return { tone: "warn", text: "Ended before validation" };
    default:
      return { tone: "warn", text: run.status };
  }
}
function OutputStatus({ sessionId }) {
  const state = useSnapshot(sessionId);
  const [expanded, setExpanded] = (0, import_react2.useState)(false);
  const run = state.run;
  (0, import_react2.useEffect)(() => watch(sessionId), [sessionId]);
  (0, import_react2.useEffect)(() => {
    setExpanded(false);
  }, [run?.turn, run?.status]);
  if (state.status === "loading") return null;
  if (state.status === "error" && run === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-strip", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-strip-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-label", children: "Output modes" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-strip-error", children: [
          "Host bridge unavailable: ",
          state.error
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-actions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-button", onClick: () => openConfig(sessionId), children: "Manage" }) })
    ] }) });
  }
  if (state.configError) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-strip", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-strip-main", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-label", children: "Output modes" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-strip-error", children: [
          "Configuration issue: ",
          state.configError
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-actions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-button", onClick: () => openConfig(sessionId), children: "Manage" }) })
    ] }) });
  }
  if (run === null || run.status === "superseded") return null;
  const runType = typeOf(state.config, run.typeId);
  const hasWork = runType.validation?.kind !== "none" || runType.serve?.kind !== "none";
  const needsAttention = run.status === "failed" || run.status === "serve-error" || Array.isArray(run.errors) && run.errors.length > 0 && run.status !== "passed";
  if (!hasWork && !needsAttention) return null;
  const status = statusOf(run);
  const errors = Array.isArray(run.errors) ? run.errors.filter(Boolean) : [];
  const url = previewUrl(run);
  const canExpand = errors.length > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: "dsh-om-strip",
      "data-expanded": expanded ? "true" : void 0,
      "data-clickable": canExpand ? "true" : void 0,
      onClick: canExpand ? () => setExpanded((value) => !value) : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-strip-main", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-label", children: run.typeName ?? "Output" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-sep", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-meta", children: run.modeName ?? "" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-status", "data-tone": status.tone, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-status-dot" }),
            status.text
          ] }),
          run.validation?.detail && !canExpand && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-meta", children: run.validation.detail }),
          canExpand && !expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-error", children: errors[0] }),
          canExpand && expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-strip-error", children: errors.join("\n") })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-strip-actions", onClick: (event) => event.stopPropagation(), children: [
          url !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-om-button",
              "data-primary": "true",
              onClick: () => openPreview({ kind: "preview", url, run }),
              children: "Preview"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "button",
            {
              type: "button",
              className: "dsh-om-button",
              onClick: () => openPreview({ kind: "details", run }),
              title: "Inspect this run",
              children: "Details"
            }
          )
        ] })
      ]
    }
  ) });
}
function RunDetails({ run }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om", style: { display: "flex", flexDirection: "column", gap: 12 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { className: "dsh-om-kv", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Output type" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: run.typeName ?? run.typeId }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Detail level" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: run.modeName ?? run.modeId }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Status" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: run.status }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Attempts" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
        run.attempt,
        " of ",
        run.maxRetries
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Run directory" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: run.runDir ?? "\u2014" }) }),
      run.validation?.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Validation" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: run.validation.detail })
      ] }),
      run.serveUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Serve URL" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: run.serveUrl }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-field", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-field-label", children: "Validation output" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { className: "dsh-om-details-pre", children: run.errors?.length ? run.errors.join("\n\n") : "No validation errors recorded." })
    ] })
  ] });
}
function PreviewModal() {
  const ui = useUiState();
  const preview = ui.preview;
  (0, import_react2.useEffect)(() => {
    if (preview === null) return void 0;
    const onKey = (event) => {
      if (event.key === "Escape") closePreview();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);
  if (preview === null) return null;
  const run = preview.run;
  const title = preview.kind === "details" ? "Output run details" : `${run?.typeName ?? "Output"} preview`;
  let crossOrigin = false;
  if (preview.kind === "preview") {
    try {
      crossOrigin = new URL(preview.url).origin !== window.location.origin;
    } catch {
      crossOrigin = false;
    }
  }
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om dsh-om-overlay", onPointerDown: (event) => {
      if (event.target === event.currentTarget) closePreview();
    }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal", role: "dialog", "aria-modal": "true", "aria-label": title, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal-titles", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "dsh-om-modal-title", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-om-modal-sub", children: preview.kind === "details" ? "The harness validates every output type that declares validation before the turn closes." : "Rendered inside DeepSeek Harness from the validated run output." })
        ] }),
        preview.kind === "preview" && crossOrigin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "dsh-om-button", href: preview.url, target: "_blank", rel: "noreferrer noopener", children: "Open in new tab" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-icon-button", "aria-label": "Close", onClick: closePreview, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseIcon, {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-modal-body", children: preview.kind === "details" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunDetails, { run }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-preview", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-preview-note", children: crossOrigin ? "Sandboxed preview from the configured serve command. Open it in a new tab if the app needs its own origin." : "Sandboxed preview. Static output stays in the sandbox and cannot call DSH APIs; use a dev-server serve command for a standalone page." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "iframe",
          {
            className: "dsh-om-preview-frame",
            title,
            src: preview.url,
            sandbox: "allow-scripts allow-forms allow-modals allow-popups",
            referrerPolicy: "no-referrer"
          }
        )
      ] }) })
    ] }) }),
    document.body
  );
}
function Field({ label, help, children }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dsh-om-field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-field-label", children: [
      label,
      help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-field-help", children: help })
    ] }),
    children
  ] });
}
function JsonArea({ value, onChange, rows = 9 }) {
  const [text, setText] = (0, import_react2.useState)(() => JSON.stringify(value ?? {}, null, 2));
  const [error, setError] = (0, import_react2.useState)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "textarea",
      {
        className: "dsh-om-textarea",
        "data-mono": "true",
        "data-invalid": error !== null ? "true" : void 0,
        rows,
        value: text,
        onChange: (event) => {
          const next = event.target.value;
          setText(next);
          try {
            const parsed = JSON.parse(next);
            setError(null);
            onChange(parsed);
          } catch (parseError) {
            setError(parseError.message);
            onChange(void 0);
          }
        }
      }
    ),
    error !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-error", children: [
      "Invalid JSON: ",
      error
    ] })
  ] });
}
function FilesEditor({ files, onChange }) {
  const list = Array.isArray(files) ? files : [];
  const update2 = (index, patch) => onChange(list.map((file, position) => position === index ? { ...file, ...patch } : file));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh-om-field-label", children: [
      "Required files",
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-field-help", children: "relative to the run directory" })
    ] }),
    list.map((file, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-inline", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "dsh-om-input",
          placeholder: "index.html",
          value: file.path ?? "",
          onChange: (event) => update2(index, { path: event.target.value })
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "dsh-om-input",
          placeholder: "must contain text (optional)",
          value: file.contains ?? "",
          onChange: (event) => {
            const value = event.target.value;
            const next = { ...file };
            if (value === "") delete next.contains;
            else next.contains = value;
            onChange(list.map((candidate, position) => position === index ? next : candidate));
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-remove", onClick: () => onChange(list.filter((_, position) => position !== index)), children: "Remove" })
    ] }, index)),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-add", onClick: () => onChange([...list, { path: "" }]), children: "+ Add file" })
  ] });
}
function TypeForm({ type, onChange, onDelete }) {
  const validation = type.validation ?? { kind: "none" };
  const serve = type.serve ?? { kind: "none" };
  const setValidation = (next) => onChange({ validation: next });
  const setServe = (next) => onChange({ serve: next });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-form", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: type.name ?? "", onChange: (event) => onChange({ name: event.target.value }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "ID", help: "stable key", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: type.id ?? "", onChange: (event) => onChange({ id: event.target.value }) }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Description", help: "shown in the picker", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: type.description ?? "", onChange: (event) => onChange({ description: event.target.value }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Structure", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", { className: "dsh-om-select", value: type.output ?? "text", onChange: (event) => onChange({ output: event.target.value }), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "text", children: "Chat text" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "json", children: "JSON in the final answer" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "files", children: "Files in the run directory" })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Repair attempts", help: "0\u20135", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "dsh-om-input",
          type: "number",
          min: "0",
          max: "5",
          value: type.maxRetries ?? 2,
          onChange: (event) => onChange({ maxRetries: Number(event.target.value) })
        }
      ) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Model instructions", help: "injected into the system prompt for this output type", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "textarea",
      {
        className: "dsh-om-textarea",
        rows: 5,
        value: type.instructions ?? "",
        placeholder: "What the model must produce, how it should structure it, and any constraints.",
        onChange: (event) => onChange({ instructions: event.target.value })
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Validation", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "select",
        {
          className: "dsh-om-select",
          value: validation.kind ?? "none",
          onChange: (event) => {
            const kind = event.target.value;
            if (kind === "maxWords") setValidation({ kind, maxWords: 120 });
            else if (kind === "json") setValidation({ kind, schema: { type: "object" } });
            else if (kind === "files") setValidation({ kind, files: [{ path: "index.html" }] });
            else if (kind === "command") setValidation({ kind, command: "", timeoutMs: 6e4 });
            else setValidation({ kind: "none" });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "none", children: "None" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "maxWords", children: "Word limit" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "json", children: "JSON Schema" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "files", children: "Required files" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "command", children: "Shell command" })
          ]
        }
      ) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Preview", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "select",
        {
          className: "dsh-om-select",
          value: serve.kind ?? "none",
          onChange: (event) => {
            const kind = event.target.value;
            if (kind === "static") setServe({ kind, file: "index.html" });
            else if (kind === "command") setServe({ kind, command: "", urlTemplate: "http://127.0.0.1:{port}/", readyTimeoutMs: 2e4 });
            else setServe({ kind: "none" });
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "none", children: "None" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "static", children: "Static HTML from the run directory" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "command", children: "Dev-server command" })
          ]
        }
      ) }) })
    ] }),
    validation.kind === "maxWords" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Maximum words", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "input",
      {
        className: "dsh-om-input",
        type: "number",
        min: "1",
        value: validation.maxWords ?? 120,
        onChange: (event) => setValidation({ kind: "maxWords", maxWords: Number(event.target.value) })
      }
    ) }),
    validation.kind === "json" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "JSON Schema", help: "the final answer's JSON must validate against this subset", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonArea, { value: validation.schema ?? {}, onChange: (schema) => setValidation({ kind: "json", schema }) }) }),
    validation.kind === "files" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilesEditor, { files: validation.files ?? [], onChange: (files) => setValidation({ kind: "files", files }) }),
    validation.kind === "command" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Validation command", help: "runs in the run directory; exit code 0 passes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          className: "dsh-om-textarea",
          "data-mono": "true",
          rows: 3,
          value: validation.command ?? "",
          placeholder: "npm run build",
          onChange: (event) => setValidation({ ...validation, command: event.target.value })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Timeout (ms)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "dsh-om-input",
          type: "number",
          min: "1000",
          max: "300000",
          value: validation.timeoutMs ?? 6e4,
          onChange: (event) => setValidation({ ...validation, timeoutMs: Number(event.target.value) })
        }
      ) })
    ] }),
    serve.kind === "static" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Entry file", help: "served from the run directory; relative assets resolve inside this single file", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: serve.file ?? "index.html", onChange: (event) => setServe({ kind: "static", file: event.target.value }) }) }),
    serve.kind === "command" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Serve command", help: "runs in the run directory; {port} is replaced with a free port", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "textarea",
        {
          className: "dsh-om-textarea",
          "data-mono": "true",
          rows: 3,
          value: serve.command ?? "",
          placeholder: "npm run dev -- --port {port} --host 127.0.0.1",
          onChange: (event) => setServe({ ...serve, command: event.target.value })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Preview URL template", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "dsh-om-input",
          value: serve.urlTemplate ?? "http://127.0.0.1:{port}/",
          onChange: (event) => setServe({ ...serve, urlTemplate: event.target.value })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Ready timeout (ms)", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "input",
        {
          className: "dsh-om-input",
          type: "number",
          min: "1000",
          max: "120000",
          value: serve.readyTimeoutMs ?? 2e4,
          onChange: (event) => setServe({ ...serve, readyTimeoutMs: Number(event.target.value) })
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-help", children: "Changes apply after Save. The next message uses them." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-remove", onClick: onDelete, children: "Delete type" })
    ] })
  ] });
}
function ModeForm({ mode, onChange, onDelete }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-form", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Name", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: mode.name ?? "", onChange: (event) => onChange({ name: event.target.value }) }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-col", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "ID", help: "stable key", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: mode.id ?? "", onChange: (event) => onChange({ id: event.target.value }) }) }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Description", help: "shown in the picker", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { className: "dsh-om-input", value: mode.description ?? "", onChange: (event) => onChange({ description: event.target.value }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, { label: "Model instructions", help: "appended after the output type instructions", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "textarea",
      {
        className: "dsh-om-textarea",
        rows: 7,
        value: mode.instructions ?? "",
        placeholder: "How this level differs: length, depth, examples, tone.",
        onChange: (event) => onChange({ instructions: event.target.value })
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-actions", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-help", children: "Levels are global and can combine with any output type." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-remove", onClick: onDelete, children: "Delete level" })
    ] })
  ] });
}
function newType() {
  return {
    id: "new-type",
    name: "New output type",
    description: "",
    output: "text",
    instructions: "",
    validation: { kind: "none" },
    serve: { kind: "none" },
    maxRetries: 2
  };
}
function newMode() {
  return { id: "new-level", name: "New level", description: "", instructions: "" };
}
function ConfigEditorModal() {
  const ui = useUiState();
  const sessionId = ui.sessionId;
  const state = useSnapshot(sessionId ?? "__output-modes-idle__");
  const open = ui.configOpen && sessionId !== null;
  const [tab, setTab] = (0, import_react2.useState)("types");
  const [draft, setDraft] = (0, import_react2.useState)(() => cloneConfig(state.config));
  const [selectedType, setSelectedType] = (0, import_react2.useState)(0);
  const [selectedMode, setSelectedMode] = (0, import_react2.useState)(0);
  const [jsonText, setJsonText] = (0, import_react2.useState)("");
  const [jsonError, setJsonError] = (0, import_react2.useState)(null);
  const [saveError, setSaveError] = (0, import_react2.useState)(null);
  const [saving, setSaving] = (0, import_react2.useState)(false);
  const [formRevision, setFormRevision] = (0, import_react2.useState)(0);
  const seeded = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    if (!open) {
      seeded.current = false;
      return;
    }
    if (seeded.current) return;
    if (state.status === "loading") return;
    setDraft(cloneConfig(state.config));
    setSelectedType(0);
    setSelectedMode(0);
    setTab("types");
    setJsonText("");
    setJsonError(null);
    setSaveError(null);
    setFormRevision((value) => value + 1);
    seeded.current = true;
  }, [open, sessionId, state.status]);
  (0, import_react2.useEffect)(() => {
    if (!open) return void 0;
    const onKey = (event) => {
      if (event.key === "Escape") closeConfig();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  if (!open) return null;
  const updateType = (index, patch) => {
    setDraft((current) => ({
      ...current,
      types: current.types.map((type, position) => position === index ? { ...type, ...patch } : type)
    }));
  };
  const updateMode = (index, patch) => {
    setDraft((current) => ({
      ...current,
      modes: current.modes.map((mode, position) => position === index ? { ...mode, ...patch } : mode)
    }));
  };
  const switchTab = (next) => {
    if (next === tab) return;
    if (tab === "json" && next !== "json") {
      try {
        setDraft(JSON.parse(jsonText));
        setJsonError(null);
      } catch (error) {
        setJsonError(error.message);
        return;
      }
    }
    if (next === "json") {
      setJsonText(JSON.stringify(draft, null, 2));
      setJsonError(null);
    }
    setTab(next);
  };
  const save = async () => {
    setSaveError(null);
    let candidate = draft;
    if (tab === "json") {
      try {
        candidate = JSON.parse(jsonText);
      } catch (error) {
        setJsonError(error.message);
        return;
      }
    }
    if (!Array.isArray(candidate.types) || candidate.types.length === 0) {
      setSaveError("At least one output type is required.");
      return;
    }
    if (!Array.isArray(candidate.modes) || candidate.modes.length === 0) {
      setSaveError("At least one level is required.");
      return;
    }
    setSaving(true);
    const result = await saveConfig(sessionId, candidate);
    setSaving(false);
    if (result.ok) {
      closeConfig();
      return;
    }
    setSaveError(result.error);
  };
  const reset = async () => {
    if (!window.confirm("Replace the current output types and levels with the shipped defaults?")) return;
    setSaveError(null);
    const result = await resetConfig(sessionId);
    if (result.ok) {
      setDraft(cloneConfig(result.config));
      setFormRevision((value) => value + 1);
      setTab("types");
      setSelectedType(0);
      setSelectedMode(0);
      setJsonText("");
      setJsonError(null);
    } else {
      setSaveError(result.error);
    }
  };
  const currentType = draft.types?.[selectedType];
  const currentMode = draft.modes?.[selectedMode];
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om dsh-om-overlay", onPointerDown: (event) => {
      if (event.target === event.currentTarget) closeConfig();
    }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal", role: "dialog", "aria-modal": "true", "aria-label": "Output modes", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal-titles", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "dsh-om-modal-title", children: "Output modes" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "dsh-om-modal-sub", children: "Output types define the required structure, validation, and preview command. Levels add a length/depth instruction on top. Both are saved on the Host and apply to your next message." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-icon-button", "aria-label": "Close", onClick: closeConfig, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseIcon, {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal-body", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-tabs", style: { marginBottom: 14 }, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-tab", "data-active": tab === "types" ? "true" : void 0, onClick: () => switchTab("types"), children: "Output types" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-tab", "data-active": tab === "levels" ? "true" : void 0, onClick: () => switchTab("levels"), children: "Levels" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-tab", "data-active": tab === "json" ? "true" : void 0, onClick: () => switchTab("json"), children: "Raw JSON" })
        ] }),
        tab === "types" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-editor", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-editor-list", children: [
            (draft.types ?? []).map((type, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                type: "button",
                className: "dsh-om-list-item",
                "data-active": index === selectedType ? "true" : void 0,
                onClick: () => setSelectedType(index),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-list-name", children: type.name || type.id || `Type ${index + 1}` }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-list-desc", children: type.description || type.output || "text" })
                ]
              },
              index
            )),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "dsh-om-add",
                onClick: () => {
                  const next = newType();
                  setDraft((current) => ({ ...current, types: [...current.types, next] }));
                  setSelectedType((draft.types ?? []).length);
                },
                children: "+ New output type"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-editor-form", children: currentType === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-list-empty", children: "Add an output type to get started." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            TypeForm,
            {
              type: currentType,
              onChange: (patch) => updateType(selectedType, patch),
              onDelete: () => {
                if (!window.confirm(`Delete output type "${currentType.name}"?`)) return;
                setDraft((current) => ({ ...current, types: current.types.filter((_, position) => position !== selectedType) }));
                setSelectedType((value) => Math.max(0, value - 1));
              }
            },
            `${selectedType}-${formRevision}`
          ) })
        ] }),
        tab === "levels" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-editor", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-editor-list", children: [
            (draft.modes ?? []).map((mode, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "button",
              {
                type: "button",
                className: "dsh-om-list-item",
                "data-active": index === selectedMode ? "true" : void 0,
                onClick: () => setSelectedMode(index),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-list-name", children: mode.name || mode.id || `Level ${index + 1}` }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-list-desc", children: mode.description || "No description" })
                ]
              },
              index
            )),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "button",
              {
                type: "button",
                className: "dsh-om-add",
                onClick: () => {
                  const next = newMode();
                  setDraft((current) => ({ ...current, modes: [...current.modes, next] }));
                  setSelectedMode((draft.modes ?? []).length);
                },
                children: "+ New level"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-editor-form", children: currentMode === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-list-empty", children: "Add a level to get started." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ModeForm,
            {
              mode: currentMode,
              onChange: (patch) => updateMode(selectedMode, patch),
              onDelete: () => {
                if (!window.confirm(`Delete level "${currentMode.name}"?`)) return;
                setDraft((current) => ({ ...current, modes: current.modes.filter((_, position) => position !== selectedMode) }));
                setSelectedMode((value) => Math.max(0, value - 1));
              }
            },
            `${selectedMode}-${formRevision}`
          ) })
        ] }),
        tab === "json" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-form", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-om-help", children: "The whole configuration document. Saving validates every field on the Host and applies it immediately." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "textarea",
            {
              className: "dsh-om-json",
              value: jsonText,
              spellCheck: false,
              onChange: (event) => {
                setJsonText(event.target.value);
                setJsonError(null);
              }
            }
          ),
          jsonError !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-error", children: [
            "Invalid JSON: ",
            jsonError
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-om-modal-foot", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-button", onClick: reset, disabled: saving, children: "Reset defaults" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-spacer" }),
        saveError !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-om-error", style: { maxWidth: 420 }, children: saveError }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-button", onClick: closeConfig, disabled: saving, children: "Cancel" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dsh-om-button", "data-primary": "true", onClick: save, disabled: saving, children: saving ? "Saving\u2026" : "Save" })
      ] })
    ] }) }),
    document.body
  );
}

// src/client/index.jsx
var inject = ["slots"];
function installStyles(ctx) {
  if (typeof document === "undefined") return;
  ctx.effect(() => {
    document.getElementById(STYLE_ID)?.remove();
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.dataset.plugin = "dsh-output-modes";
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, "output-modes: styles");
}
function apply(ctx) {
  installStyles(ctx);
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
    name: "conversation.input.left",
    id: "output-type",
    order: 30
  }, OutputTypePicker));
  ctx.slots.inject("conversation.input.left", () => ctx.slots.register({
    name: "conversation.input.left",
    id: "output-level",
    order: 31
  }, OutputModePicker));
  ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
    name: "conversation.input.dock",
    id: "output-modes",
    order: 40
  }, OutputStatus));
}

    return module.exports;
  },
});
