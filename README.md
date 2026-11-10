# dsh-creator-mode

Plugins that shape **what** DeepSeek Harness creates and **how** the result is delivered.

## Plugins

### `dsh-output-modes` — v0.0.1

Choose an output type and detail level when sending a message. A type defines the
required structure, validation, and optional preview/serve step; a level defines
how much depth to add. The selection is injected into the prompt, validated
before the turn closes, repaired automatically when validation fails, and served
back into the DSH interface when the output is a runnable app.

Shipped types: **Detailed answer**, **Short answer**, **Structured JSON**, **React app**.
Shipped levels: **Concise**, **Balanced**, **Exhaustive**.

- [Plugin README](./dsh-output-modes/README.md)
- [Bundle manifest](./dsh-output-modes/package.json)

#### Install

```sh
dsh plugin --profile desktop add ./dsh-output-modes
```

Refresh the DSH page once so the browser loads the composer controls.

#### Configure

`~/.dsh/output-modes.json` holds the output types and levels. The composer's
**Manage output modes…** dialog edits the same document. Per-session selections
live in `~/.dsh/output-modes-state.json`; run artifacts live under
`<workspace>/.dsh-output-modes/runs/`.

## Development

Each plugin directory is a self-contained DSH bundle. For `dsh-output-modes`:

```sh
cd dsh-output-modes
npm install --no-save --omit=peer esbuild@0.25.0
node scripts/build-client.mjs
```

`client.js` is committed, so a `link:` install works without a build step.
