# ngink

> Build interactive terminal applications with Angular.

ngink is a rendering library that connects Angular's component model to [Ink](https://github.com/vadimdemedes/ink) — a React-based terminal UI framework. Write Angular components with real templates, signals, and dependency injection; ngink renders them to the terminal via a custom `Renderer2` implementation.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Reference](#api-reference)
  - [bootstrapCli](#bootstrapcli)
  - [Components](#components)
  - [Services](#services)
- [Examples](#examples)
- [Testing](#testing)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)

---

## Requirements

| Dependency | Version |
|---|---|
| Node.js | >= 18 |
| Angular | ^21.0.0 |
| React | ^19.0.0 |
| Ink | ^6.0.0 |

---

## Installation

```bash
npm install ngink
```

**Peer dependencies** must be installed separately:

```bash
npm install @angular/core @angular/compiler @angular/platform-browser ink react
```

---

## Quick Start

**1. Create an Angular component:**

```typescript
// hello.component.ts
import { Component } from '@angular/core';
import { Text } from 'ngink';

@Component({
  standalone: true,
  selector: 'app-hello',
  imports: [Text],
  template: `<Text>Hello from ngink!</Text>`,
})
export class HelloComponent {}
```

**2. Bootstrap it in your entry point:**

```typescript
// main.ts
import { bootstrapCli } from 'ngink';
import { HelloComponent } from './hello.component.js';

bootstrapCli(HelloComponent);
```

**3. Run with [tsx](https://github.com/privatenumber/tsx) (no build step required):**

```bash
npx tsx --tsconfig tsconfig.node.json main.ts
```

Or compile with AOT and run:

```bash
npx ngc -p tsconfig.node.json
node out-tsc/node/main.js
```

---

## Architecture

```
Angular Component (AOT or JIT)
  └─ bootstrapCli()
       └─ bootstrapApplication (platform-browser)
            └─ InkRendererFactory  (overrides RendererFactory2)
                 └─ InkRenderer    (builds an InkNode tree from Renderer2 calls)
                      └─ scheduleRerender()  (queueMicrotask debounce)
                           └─ buildReactElement()  (InkNode → React elements)
                                └─ Ink render() / rerender() → stdout
```

**Bridge pattern** — React hooks cannot be called from Angular. Each feature area mounts a React component inside the root that runs the hook and writes results to module-level variables that Angular services delegate to:

| Bridge | Hook(s) | Angular Service |
|---|---|---|
| `InputBridge` | `useInput`, `useStdin` | `InputService` |
| `FocusBridge` / `FocusableReact` | `useFocusManager`, `useFocus` | `FocusService` + `Focusable` |
| `TerminalBridge` | `useStdout`, `useStderr` | `TerminalService` |
| `CursorBridge` | `useCursor` | `CursorService` |

---

## API Reference

### bootstrapCli

Bootstraps a standalone Angular component as a terminal application.

```typescript
import { bootstrapCli } from 'ngink';

bootstrapCli(AppComponent);
```

Internally calls `bootstrapApplication` with `provideZonelessChangeDetection()` and registers all bridges (input, focus, terminal, cursor).

---

### Components

All components are Angular wrappers around their Ink counterparts. Use them inside Angular templates with standard property binding.

#### `Box`

Flexbox container. Accepts all [Ink `Box` props](https://github.com/vadimdemedes/ink#box) as `@Input()` bindings.

```html
<Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'">
  <!-- children -->
</Box>
```

Selected inputs: `flexDirection`, `padding`, `margin`, `borderStyle`, `borderColor`, `gap`, `width`, `height`, `alignItems`, `justifyContent`, `ariaRole`, `ariaLabel`, `ariaHidden`, `ariaState`.

#### `Text`

Renders a line of styled text.

```html
<Text [bold]="true" [color]="'green'">Hello!</Text>
<Text [dimColor]="true">Press q to quit</Text>
```

Selected inputs: `color`, `backgroundColor`, `bold`, `italic`, `underline`, `strikethrough`, `dimColor`, `wrap`, `ariaLabel`, `ariaHidden`.

#### `Newline`

Renders one or more blank lines.

```html
<Newline [count]="2" />
```

#### `Spacer`

Fills available space in a flex container (equivalent to `flex: 1`).

```html
<Box [flexDirection]="'row'">
  <Text>Left</Text>
  <Spacer />
  <Text>Right</Text>
</Box>
```

#### `Spinner`

Animated spinner with a configurable style.

```html
<Spinner [type]="'dots'" />
```

#### `Static`

Renders content outside Ink's managed area (content is never cleared on rerender).

```html
<Static>
  <Text>Permanent log line</Text>
</Static>
```

#### `Transform`

Applies a transformation function to the rendered string output of its children.

```html
<Transform [transform]="toUpperCase">
  <Text>hello</Text>
</Transform>
```

Where `toUpperCase = (s: string) => s.toUpperCase()`.

#### `Focusable`

Makes a section of the UI focusable via `FocusService`.

```typescript
@Component({
  template: `
    <Focusable id="menu" (focusChange)="onFocus($event)">
      <Box [borderStyle]="isFocused ? 'round' : undefined">
        <Text>Menu item</Text>
      </Box>
    </Focusable>
  `,
  imports: [Focusable, Box, Text],
})
export class MenuComponent {
  isFocused = false;
  onFocus(focused: boolean) { this.isFocused = focused; }
}
```

Inputs: `id` (string), `isActive` (boolean), `autoFocus` (boolean).
Output: `focusChange` emits `boolean` whenever focus changes.

---

### Services

All services are `@Injectable()` and available via Angular DI once `bootstrapCli` has mounted the bridges.

#### `InputService`

Reactive keyboard input.

```typescript
import { InputService } from 'ngink';

@Component({ ... })
export class MyComponent {
  private input = inject(InputService);

  constructor() {
    effect(() => {
      const kp = this.input.keypress();   // Signal<KeyPress | null>
      if (!kp) return;
      const { input, key } = kp;

      if (key.upArrow)   { /* ... */ }
      if (key.return)    { /* ... */ }
      if (input === 'q') { /* quit */ }
    });
  }
}
```

| Signal | Type | Description |
|---|---|---|
| `keypress` | `Signal<KeyPress \| null>` | Latest key event; `null` before first keystroke |
| `key` | `Signal<Key \| null>` | The modifier/special-key part of the event |
| `isCtrl` | `Signal<boolean>` | Whether Ctrl was held |
| `isShift` | `Signal<boolean>` | Whether Shift was held |

#### `AppService`

Controls application lifecycle.

```typescript
import { AppService } from 'ngink';

const app = inject(AppService);
app.exit();     // Exit gracefully (wraps Ink's useApp().exit())
```

#### `FocusService`

Programmatic focus management (wraps Ink's `useFocusManager`).

```typescript
import { FocusService } from 'ngink';

const focus = inject(FocusService);
focus.enableFocus();
focus.focusNext();
focus.focusPrevious();
focus.focus('my-id');
focus.disableFocus();
```

#### `TerminalService`

Terminal dimensions and output streams.

```typescript
import { TerminalService } from 'ngink';

const terminal = inject(TerminalService);

terminal.columns()           // Signal<number> — reactive terminal width
terminal.rows()              // Signal<number> — reactive terminal height

terminal.write('hello\n');        // write to stdout
terminal.writeError('oops\n');    // write to stderr
```

#### `CursorService`

Low-level cursor position control.

```typescript
import { CursorService } from 'ngink';

const cursor = inject(CursorService);

cursor.showCursor(5, 10);       // show cursor at column 5, row 10
cursor.hideCursor();
cursor.setCursorPosition(0, 0);
```

---

## Examples

All examples live under [`examples/`](examples/). Each can be run in two modes:

| Mode | Command | Description |
|---|---|---|
| JIT (fast) | `npm run dev:<name>` | Runs via `tsx`, no build step |
| AOT | `npm run example:<name>` | Compiles with `ngc` then runs |

| Example | Command | Demonstrates |
|---|---|---|
| Hello World | `npm run dev:hello` | Minimal component |
| Counter | `npm run dev:counter` | Signals, `computed`, `effect`, auto-rerender |
| Spinner | `npm run dev:spinner` | `<Spinner>`, `<Newline>`, `<Spacer>` |
| Todo | `npm run dev:todo` | `@if` / `@for` structural directives |
| Interactive | `npm run dev:interactive` | Keyboard input via `InputService` |
| Focus | `npm run dev:focus` | `FocusService` + `<Focusable>` |
| Terminal | `npm run dev:terminal` | `TerminalService` dimensions + output |
| Aria | `npm run dev:aria` | `ariaRole`, `ariaLabel`, `ariaState` props |
| Border | `npm run dev:border` | Box border styles |
| Chat | `npm run dev:chat` | Multi-input chat-style UI |
| Suspense | `npm run dev:suspense` | `@defer` as Angular's Suspense equivalent |
| Table | `npm run dev:table` | Tabular layout with Box |

---

## Testing

ngink provides a `renderCli` helper for headless unit testing with [Vitest](https://vitest.dev/).

> Import from `ngink/testing` (or `src/testing.ts` when working inside this repo).

```typescript
import { renderCli } from 'ngink/testing';
import { HelloComponent } from './hello.component.js';

it('renders greeting', async () => {
  const output = await renderCli(HelloComponent);
  expect(output).toContain('Hello from ngink!');
});

it('respects column width', async () => {
  const output = await renderCli(HelloComponent, { columns: 40 });
  expect(output.length).toBeGreaterThan(0);
});
```

`renderCli` boots the component in a headless environment (no real terminal), drains Angular's change detection, then calls Ink's `renderToString` and returns a plain string.

**Run tests:**

```bash
npm test
```

---

## Development Workflow

```bash
# Watch mode — recompiles on every file change (AOT)
npm run watch:node

# Run a specific example after editing source
npm run example:counter

# Run all tests
npm test
```

`tsconfig.node.json` is the TypeScript config for Node.js targets. It sets `"module": "NodeNext"` to satisfy ESM requirements (yoga-layout uses top-level await).

### Project structure

```
src/
  bootstrap.ts              — bootstrapCli(); mounts all bridges
  index.ts                  — public API barrel export
  testing.ts                — renderCli() headless testing helper
  renderer/
    ink-node.ts             — InkNode type + createNode()
    ink-renderer.ts         — Renderer2 implementation
    ink-renderer.factory.ts — RendererFactory2 implementation
  bridge/
    react-bridge.ts         — buildReactElement() (InkNode → React)
    input-bridge.ts         — InputBridge + setKeyHandler() + exitApp()
    focus-bridge.ts         — FocusBridge + FocusableReact
    terminal-bridge.ts      — TerminalBridge
    cursor-bridge.ts        — CursorBridge
  services/
    input.service.ts
    app.service.ts
    focus.service.ts
    terminal.service.ts
    cursor.service.ts
  components/
    _base.ts                — InkComponent abstract base
    box.ts / text.ts / newline.ts / spacer.ts
    spinner.ts / static.ts / transform.ts / focusable.ts
    index.ts                — barrel export
examples/
  hello-world/ counter/ spinner/ todo/ interactive/
  focus/ terminal/ aria/ border/ chat/ suspense/ table/
```

---

## Contributing

1. Fork the repository and create a feature branch.
2. Make changes and add tests under `src/__tests__/`.
3. Run `npm test` to verify all tests pass.
4. Open a pull request with a clear description of the change.

---

## License

MIT
