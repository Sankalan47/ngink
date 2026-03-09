# Contributing to ngink

Thank you for your interest in contributing to **ngink** — the Angular rendering library that renders Angular components to the terminal via [Ink](https://github.com/vadimdemedes/ink). Contributions of all kinds are welcome: bug fixes, new features, examples, tests, and documentation improvements.

Please read this guide before opening a PR. It covers setup, workflow, conventions, and the architectural patterns the project relies on.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Adding a New Example](#adding-a-new-example)
- [Coding Conventions](#coding-conventions)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)
- [Architecture Notes](#architecture-notes)

---

## Code of Conduct

Be respectful and constructive. Harassment, discrimination, or dismissive behaviour toward contributors or users is not tolerated. If you experience or witness a problem, open an issue or contact the maintainer directly.

---

## Getting Started

### Prerequisites

| Tool    | Required version |
| ------- | ---------------- |
| Node.js | ≥ 20             |
| Angular | ^21              |
| React   | ^19              |
| Ink     | ^6               |

### Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/ngink.git
cd ngink

# 2. Install dependencies
npm install

# 3. Verify everything works
npm test
```

---

## Development Workflow

ngink supports two development modes:

### JIT mode — fast iteration (recommended for development)

Uses `tsx` to run TypeScript directly without an explicit build step. No compilation needed between changes.

```bash
npm run dev:hello      # run the hello-world example
npm run dev:counter    # run the counter example
npm run dev:interactive
# ... any dev:{example} script
```

### AOT mode — production-accurate

Compiles with Angular's `ngc` compiler first, then runs the compiled output with `node`.

```bash
npm run build:node          # one-shot AOT compile
npm run watch:node          # continuous AOT compile (ngc --watch)
npm run example:hello       # build:node then run hello-world
npm run example:counter     # build:node then run counter
```

Use AOT mode to catch template type errors (`strictTemplates: true`) and to verify the compiled output before submitting.

---

## Project Structure

```
src/
├── renderer/           Angular Renderer2 implementation
│   ├── ink-node.ts         InkNode tree type + createNode()
│   ├── ink-renderer.ts     Renderer2 impl, module-level state, scheduleRerender()
│   └── ink-renderer.factory.ts  RendererFactory2 (@Injectable)
│
├── bridge/             React hooks ↔ Angular service bridges
│   ├── react-bridge.ts     buildReactElement(): InkNode tree → React elements
│   ├── input-bridge.ts     useInput / useStdin → InputService
│   ├── focus-bridge.ts     useFocusManager / useFocus → FocusService + Focusable
│   ├── terminal-bridge.ts  useStdout / useStderr → TerminalService
│   └── cursor-bridge.ts    useCursor → CursorService
│
├── components/         Angular component wrappers for Ink primitives
│   ├── _base.ts            InkComponent abstract base (ngOnChanges → setProperty)
│   ├── box.ts / text.ts / newline.ts / spacer.ts / spinner.ts
│   ├── static.ts / transform.ts / focusable.ts
│   └── index.ts            barrel export
│
├── services/           Angular injectable services
│   ├── input.service.ts    key / isCtrl / isShift signals
│   ├── app.service.ts      exit()
│   ├── focus.service.ts    enableFocus / disableFocus / focusNext / focusPrevious / focus(id)
│   ├── terminal.service.ts write / writeError / columns / rows signals
│   └── cursor.service.ts   showCursor / hideCursor / setCursorPosition
│
├── bootstrap.ts        bootstrapCli() entry point; mounts all bridges
├── index.ts            public API barrel export
└── testing.ts          renderCli() headless testing helper (NOT in index.ts)

examples/
├── hello-world/ counter/ spinner/ todo/ interactive/
├── focus/ terminal/ aria/ border/ chat/ suspense/ table/
```

---

## Testing

Tests use [Vitest](https://vitest.dev/) and the `renderCli()` helper provided by `src/testing.ts`.

```bash
npm test           # run all tests once
```

### Writing tests

Place test files in `src/__tests__/`. Import `renderCli` directly from the testing module:

```typescript
import { renderCli } from '../../src/testing.js';
import { MyComponent } from '../my-component.js';

it('renders expected output', async () => {
  const output = await renderCli(MyComponent);
  expect(output).toContain('Hello');
});
```

`renderCli(Component, options?)` bootstraps the component headlessly (no real terminal), waits for all microtasks and Angular change detection to settle, then returns the rendered string output. It guarantees cleanup after every test.

**What to test:**

- Output string content for components with props / signals
- That signals update correctly (set a signal, call renderCli again)
- Service logic that can be tested without a real terminal

**What not to test:**

- Live keyboard / cursor interaction (requires a real TTY)
- Ink layout specifics (pixel-precise box dimensions) — these are Ink's responsibility

---

## Adding a New Example

1. Create a directory: `examples/{name}/`
2. Add two files:
   - `examples/{name}/{name}.component.ts` — the Angular component
   - `examples/{name}/main.ts` — the bootstrap entry point (see any existing example)
3. Add two scripts to `package.json`:
   ```json
   "dev:{name}": "tsx --tsconfig tsconfig.node.json examples/{name}/main.ts",
   "example:{name}": "npm run build:node && node out-tsc/node/examples/{name}/main.js"
   ```
4. Include the example path in `tsconfig.node.json` (it matches `examples/**/*.ts` already).
5. Verify both `npm run dev:{name}` and `npm run example:{name}` work correctly.

---

## Coding Conventions

### TypeScript

- Strict mode is enabled. No `any` unless unavoidable.
- Use Angular signals (`signal()`, `computed()`, `effect()`) for reactive state — not `BehaviorSubject` or plain variables.
- Inside `effect()`, read writable signals via `untracked()` to avoid unwanted re-runs:
  ```typescript
  const val = untracked(this.mySignal); // read without tracking
  ```

### Formatting

- [Prettier](https://prettier.io/) with `printWidth: 100`, `singleQuote: true`.
- Run the formatter before committing. No custom lint step exists yet; follow the style of surrounding code.

### The Bridge Pattern (required for all new I/O)

All terminal I/O (keyboard, cursor, focus, terminal size) must follow the bridge pattern:

1. **React component** hosts the Ink/React hook and assigns results to **module-level variables**.
2. **Angular service** delegates to those module-level variables (no-ops before first React render).
3. The bridge component is always mounted in `buildRoot()` inside `bootstrap.ts`.

Do not call React hooks from Angular or Node.js code. Do not read terminal state directly from `process.stdout`/`process.stdin` — go through a bridge.

### Adding a New Angular Component Wrapper

- Extend `InkComponent` from `src/components/_base.ts`.
- Define `@Input()` properties matching the Ink component's props.
- `ngOnChanges` from the base class automatically syncs `@Input()` changes to the InkNode via `renderer.setProperty` — call `super.ngOnChanges(changes)` (or replicate the loop if you need to remap prop names).
- Register the new InkNodeType in `src/renderer/ink-node.ts` and handle it in `src/bridge/react-bridge.ts`.
- Components with children use `template: '<ng-content />'`; leaf nodes use `template: ''`.

### Adding a New Service

- Decorate with `@Injectable({ providedIn: 'root' })`.
- Expose reactive state as `signal()` or `computed()` values.
- Delegate mutations to the corresponding bridge module-level function.

### ESM and stdout

- All code is ESM-only (`"type": "module"`). Never use `require()` or CommonJS patterns.
- Ink owns `process.stdout`. Use `console.error` for debug output — `console.log` will corrupt the terminal render.
- Escape literal `@` characters in Angular template text as `&#64;` (Angular 17+ template syntax treats bare `@` as a control flow keyword).

---

## Submitting a Pull Request

### Branch naming

| Prefix      | When to use                                 |
| ----------- | ------------------------------------------- |
| `feat/`     | New feature or component                    |
| `fix/`      | Bug fix                                     |
| `docs/`     | Documentation only                          |
| `test/`     | Tests only                                  |
| `refactor/` | Internal restructuring, no behaviour change |

### PR checklist

- [ ] `npm test` passes with no failures
- [ ] `npm run build:node` succeeds with no TypeScript errors
- [ ] New behaviour has a test in `src/__tests__/`
- [ ] New feature has a corresponding example in `examples/`
- [ ] PR description explains **why** the change is needed, not just what changed
- [ ] No `console.log` calls left in src/ (use `console.error` for debug)

### Keeping history clean

- Rebase onto `main` before opening a PR; avoid merge commits in your branch.
- Squash fixup commits before requesting review if your branch has many WIP commits.

---

## Reporting Issues

### Bug reports

Please include:

- Node.js version (`node --version`)
- Angular / Ink / ngink versions
- Minimal reproduction (a single component + `bootstrapCli` call that shows the problem)
- Expected vs actual terminal output

### Feature requests

Please include:

- The use case you are trying to support
- A proposed API sketch (component name, `@Input()` props, service methods, etc.)
- Whether you are willing to implement it

---

## Architecture Notes

These are the non-obvious design constraints that every contributor should be aware of.

### Rendering pipeline

```
Angular (AOT/JIT)
  → bootstrapApplication (platform-browser)
  → InkRendererFactory     overrides RendererFactory2
  → InkRenderer            builds InkNode tree via Renderer2 calls
  → scheduleRerender()     debounces via queueMicrotask
  → buildReactElement()    InkNode tree → React elements
  → Ink render/rerender    → terminal stdout
```

### scheduleRerender() debounce

`scheduleRerender()` uses `queueMicrotask` to batch multiple Renderer2 mutations from a single Angular change-detection pass into one `rerender()` call. This prevents Ink from re-rendering on every individual DOM-like operation. Do not call `rerender()` directly.

### bootstrapCli() and ɵsetDocument

Angular's platform-browser expects a real DOM. `bootstrapCli()` calls `ɵsetDocument(mockDocument)` with a `Proxy`-based mock **before** calling `bootstrapApplication`. This must happen synchronously, before Angular bootstraps.

### AOT partial compilation — static compiler import

```typescript
import '@angular/compiler'; // MUST be a static top-level import
```

Angular framework packages ship as partial-compilation (linker) artifacts. Even in AOT mode, the compiler package must be imported at the top level of `bootstrap.ts` and `testing.ts`. A dynamic `await import('@angular/compiler')` is too late in the module loading cycle.

### removeChild with null parent (Angular 21)

Angular 21's `nativeRemoveNode` always calls `renderer.removeChild(null, node)`. The InkRenderer handles this by falling back to the node's own `.parent` reference when `parent` is `null`. Any new renderer code that handles child removal must account for this.
