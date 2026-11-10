# dsh-output-modes

**v0.0.1** — choose how DeepSeek Harness shapes each reply.

`dsh-output-modes` adds two compact dropdowns to the composer:

- **Output type** — what the reply must be: detailed prose, a short answer, structured JSON, a runnable React app, or a type you define.
- **Detail level** — how much depth to add on top: concise, balanced, exhaustive, or levels you define.

A type is a contract, not just a label. It can carry model instructions, a required structure, validation, and a preview/serve step. The selection is snapshotted at the start of the turn, injected into the prompt, validated before the turn is allowed to close, and repaired automatically when validation fails. Successful file/command outputs can be served and previewed inside DSH.

---

## Install

The bundle is a normal DSH profile bundle:

```sh
dsh plugin --profile desktop add /path/to/dsh-output-modes
```

Refresh the DSH page once after installation so the browser picks up the new client bundle. The host half is composition-live; the client half is delivered by the client module system.

Uninstall:

```sh
dsh plugin --profile desktop remove dsh-output-modes
```

The profile keeps the plugin as a `link:` dependency, so edits to this checkout are picked up on the next page load or host recomposition.

## Using it

1. Pick an **output type** and a **detail level** in the composer tool row, next to the model selector.
2. Send a message. The selection applies to that turn.
3. If the type declares validation, the status strip above the composer shows `Validating output`.
4. On failure, the model receives the exact validation errors as a user-role context message and gets a bounded number of repair attempts in the same turn.
5. On success, the strip shows `Validated`, `Preview ready`, or `Preview failed`. Use **Preview** for the embedded preview and **Details** for the run directory, attempts, and validation output.

Choices are saved on the Host per session, so they survive a page reload and apply to later messages in the same session.

### Manage output modes

Open **Manage output modes…** from either dropdown. The editor has three tabs:

- **Output types** — name, description, structure (`text`, `json`, `files`), model instructions, validation, preview/serve, and repair attempts.
- **Levels** — name, description, and the extra model instructions that distinguish the level.
- **Raw JSON** — the complete configuration document. Saving validates every field on the Host.

**Reset defaults** restores the shipped types and levels.

## Shipped defaults

| Type | Structure | Validation | Preview |
|---|---|---|---|
| Detailed answer | chat text | none | none |
| Short answer | chat text | max 120 words | none |
| Structured JSON | one JSON object | schema (`summary`, `items`) | none |
| React app | `index.html` in the run directory | required files and markers | static HTML served by DSH |

| Level | Difference |
|---|---|
| Concise | shortest complete answer; no preamble or optional background |
| Balanced | default depth |
| Exhaustive | reasoning, examples, edge cases, summary |

The default combination is **Detailed answer / Balanced**, which adds no prompt contract and validates nothing, so ordinary replies behave exactly as before.

## Configuration

The Host stores the document at:

```text
$DSH_HOME/output-modes.json
```

The default `$DSH_HOME` is `~/.dsh`. Selections are stored beside it in `output-modes-state.json`. Run artifacts live in the session workspace:

```text
<workspace>/.dsh-output-modes/runs/<session-id>/<turn>/
```

### Document shape

```json
{
  "version": 1,
  "defaults": { "typeId": "short", "modeId": "concise" },
  "types": [
    {
      "id": "short",
      "name": "Short answer",
      "description": "A direct answer capped at 120 words.",
      "output": "text",
      "instructions": "Answer directly. No preamble, no restating the question.",
      "validation": { "kind": "maxWords", "maxWords": 120 },
      "serve": { "kind": "none" },
      "maxRetries": 1
    },
    {
      "id": "brief-file",
      "name": "Brief file",
      "description": "Writes a short brief and validates it.",
      "output": "files",
      "instructions": "Write `brief.md` with a title and five bullets.",
      "validation": {
        "kind": "command",
        "command": "test -s brief.md && grep -q '^# ' brief.md",
        "timeoutMs": 15000
      },
      "serve": { "kind": "none" },
      "maxRetries": 2
    }
  ],
  "modes": [
    { "id": "concise", "name": "Concise", "description": "Shortest complete answer.", "instructions": "Prefer the shortest complete answer." },
    { "id": "balanced", "name": "Balanced", "description": "Default depth.", "instructions": "" },
    { "id": "exhaustive", "name": "Exhaustive", "description": "Thorough.", "instructions": "Explain reasoning and include examples and edge cases." }
  ]
}
```

### Output type fields

| Field | Meaning |
|---|---|
| `id` | Stable key. Slugged from the name when omitted. Must be unique. |
| `name`, `description` | Shown in the picker. |
| `output` | `text`, `json`, or `files`. Selects how the contract frames the delivery. |
| `instructions` | Text appended to the system prompt while this type is selected. Supports `{{runDir}}`, `{{sessionId}}`, `{{turn}}`, and `{{maxWords}}`. |
| `validation` | `none`, `maxWords`, `json`, `files`, or `command`. |
| `serve` | `none`, `static`, or `command`. |
| `maxRetries` | Repair attempts after a failed validation, `0`–`5`. |

### Validation kinds

| Kind | Behavior |
|---|---|
| `none` | The turn closes without validation. |
| `maxWords` | Counts words in the final Assistant text. Empty answers and over-limit answers fail. |
| `json` | Extracts a fenced (or bare) JSON value, parses it, and validates it against the supplied JSON Schema subset. |
| `files` | Checks each `files[]` entry exists relative to the run directory and, when `contains` is set, contains that text. |
| `command` | Runs a shell command in the run directory. Exit code `0` passes. Output is returned to the model on failure. |

The JSON Schema subset supports `type` (including arrays), `enum`, `const`, `required`, `properties`, `additionalProperties`, `items`, `minItems`, `maxItems`, `minLength`, `maxLength`, `minimum`, `maximum`, `pattern`, `allOf`, `anyOf`, and `oneOf`.

### Serve kinds

| Kind | Behavior |
|---|---|
| `none` | No preview. |
| `static` | Serves `serve.file` (default `index.html`) from the run directory at an authenticated DSH URL and opens it in a sandboxed iframe. |
| `command` | Allocates a free loopback port, runs the command in the run directory with `{port}` replaced and `PORT` set, waits for the URL template to answer, and shows it. Use this for Vite, Next, etc. |

Static previews serve a **single file**. Inline CSS and JSX (Babel standalone) work; relative multi-file assets do not. Use a command serve for multi-asset apps.

### Command environment

Both validation and serve commands run in the run directory with:

```text
DSH_OUTPUT_DIR
DSH_OUTPUT_TEXT_FILE
DSH_OUTPUT_TURN
DSH_SESSION_ID
DSH_OUTPUT_TYPE
DSH_OUTPUT_MODE
PORT            # serve commands only
```

The final Assistant text is also written to `answer.md` before validation. JSON answers are written to `answer.json`.

## How the contract reaches the model

The plugin registers an agent-scoped system-prompt section (order `9500`). On every assembly it reads the selection snapshotted for the open turn and renders:

- the type and level names and descriptions;
- the type instructions and level instructions;
- the exact run directory for file outputs;
- the JSON Schema for JSON outputs;
- a statement that validation happens before the turn closes and that failures must be repaired in the same turn;
- the configured serve behavior.

The section adds nothing when the type and level have no instructions, validation, or serve step.

## How retry works

`agent/turn-stopping` is the validation point: it runs before the turn is allowed to close. If validation fails and attempts remain, the plugin calls `agent.steer()` with a context message containing the errors. The loop runs another step in the same turn. When attempts are exhausted, the turn closes and the strip shows `Validation failed`; the Assistant reply is still visible.

The repair message uses a custom source (`output-modes`) with a `notice` form, so Chat renders it as a context row rather than impersonating the user.

## HTTP routes

Registered on the Host connection when the Web carrier is present:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/output-modes/bootstrap?sessionId=…` | Config, selection, latest run, Host facts. |
| `POST` | `/api/output-modes/select` | Persist `{ sessionId, typeId, modeId }`. |
| `POST` | `/api/output-modes/config` | Validate and persist `{ config }`. |
| `POST` | `/api/output-modes/reset` | Restore shipped defaults. |
| `GET` | `/api/output-modes/preview?sessionId=…&turn=…` | Serve a static `index.html` for a validated run. |

All routes use the normal DSH browser-session authentication and same-origin policy.

## Safety

- **Validation and serve commands run with your user permissions, outside the agent sandbox.** Only configure commands you trust.
- Preview iframes are sandboxed with `allow-scripts` but without `allow-same-origin`, so a generated app cannot read DSH cookies or call DSH APIs from the preview origin. Use **Open in new tab** for apps that need their own same-origin APIs.
- The static preview route serves exactly the configured entry file from a known run directory; path traversal is rejected.
- The plugin never sends the config to the model. Only the rendered contract for the selected type/level is model-visible.

## Limitations (0.0.1)

- Composer controls require the Web UI (the current DSH Web surface). The host half still validates and serves on other surfaces.
- Runs and preview state are process-local; configuration and per-session selections persist.
- Static previews are single-file only.
- The React template expects network access for React UMD and Babel standalone from a CDN.
- Repair retries are counted per turn; a new turn gets a fresh budget.
- No live streaming preview; the preview appears after validation.

## Development

The host half is plain ESM Node code (`index.js`) with no runtime dependencies. The browser half is built from `src/client` into the lazy-CJS factory format the client module system expects:

```sh
npm install --no-save --omit=peer esbuild@0.25.0
node scripts/build-client.mjs
```

`client.js` is committed so a `link:` install works without a build step.

## License

MIT
