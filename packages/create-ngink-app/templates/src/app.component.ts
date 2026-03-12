import { Component, signal, inject, effect, untracked, OnDestroy } from '@angular/core';
import { InputService, AppService, Box, Text, Newline, Spinner } from 'ng-ink';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const CANNED_RESPONSES = [
  'I understand. How can I help you further?',
  "That's an interesting question. Let me think about that — in Angular, signals provide reactive state that automatically triggers re-renders when updated.",
  "Great point! ng-ink bridges Angular's component model with Ink's terminal rendering, giving you the full Angular DX in CLI apps.",
  "Sure! You can use Box for layout (it's flexbox), Text for styled output, and Spinner for async indicators.",
  "I'm a simulated assistant running inside a terminal rendered by ng-ink. No actual LLM here — just canned responses!",
  'You can press `q` on an empty input to exit, or use Ctrl+C at any time.',
];

// Pixel font: 5 rows, fixed-width per letter
const FONT: Record<string, string[]> = {
  n: ['█  █', '██ █', '█ ██', '█  █', '█  █'],
  g: [' ██ ', '█   ', '█ ██', '█  █', ' ███'],
  '-': ['    ', '    ', '████', '    ', '    '],
  i: ['███', ' █ ', ' █ ', ' █ ', '███'],
  k: ['█  █', '█ █ ', '██  ', '█ █ ', '█  █'],
};

// Build "ng-ink" art: 5 rows, letters joined with 1-space gaps
const HEADER_CHARS: string[][] = Array.from({ length: 5 }, (_, row) =>
  ['n', 'g', '-', 'i', 'n', 'k']
    .map((ch) => FONT[ch][row])
    .join(' ')
    .split(''),
);

function gradientColor(col: number, total: number): string {
  const t = total <= 1 ? 0 : col / (total - 1);
  // blue [91,139,245] → purple [155,114,232] → pink [200,107,142]
  const stops = [
    [91, 139, 245],
    [155, 114, 232],
    [200, 107, 142],
  ];
  const seg = t < 0.5 ? 0 : 1;
  const s = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const [r1, g1, b1] = stops[seg];
  const [r2, g2, b2] = stops[seg + 1];
  const r = Math.round(r1 + s * (r2 - r1));
  const g = Math.round(g1 + s * (g2 - g1));
  const b = Math.round(b1 + s * (b2 - b1));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'#9B59B6'">
      <!-- Pixel-art gradient header -->
      <Box [flexDirection]="'column'" [marginBottom]="1">
        @for (row of headerChars; track $index) {
          <Box [flexDirection]="'row'">
            @for (char of row; track $index) {
              <Text [bold]="true" [color]="color($index, row.length)">{{ char }}</Text>
            }
          </Box>
        }
        <Text [dimColor]="true">model: mock-1.0</Text>
      </Box>

      <!-- Message history -->
      @if (messages().length === 0) {
        <Text [dimColor]="true">Start a conversation below.</Text>
        <Newline />
      } @else {
        @for (msg of messages(); track msg.id) {
          @if (msg.role === 'user') {
            <Box [flexDirection]="'row'" [gap]="1">
              <Text [color]="'#2ECC71'" [bold]="true">></Text>
              <Text>{{ msg.text }}</Text>
            </Box>
          } @else {
            <Box [flexDirection]="'row'" [gap]="1">
              <Text [color]="'#9B59B6'" [bold]="true">◆</Text>
              <Text [wrap]="'wrap'">{{ msg.text }}</Text>
            </Box>
          }
          <Newline />
        }
      }

      <!-- Thinking spinner -->
      @if (isThinking()) {
        <Box [flexDirection]="'row'" [gap]="1">
          <Spinner [type]="'dots'" />
          <Text [dimColor]="true">Thinking…</Text>
        </Box>
        <Newline />
      }

      <!-- Input box -->
      <Box
        [flexDirection]="'row'"
        [gap]="1"
        [borderStyle]="'single'"
        [borderColor]="isThinking() ? 'gray' : 'green'"
        [paddingX]="1"
      >
        <Text [color]="isThinking() ? 'gray' : 'green'">›</Text>
        <Text>{{ currentInput() }}</Text>
      </Box>

      <!-- Help -->
      <Newline />
      <Text [dimColor]="true">Enter send · Backspace delete · q (empty) quit</Text>
    </Box>
  `,
  imports: [Box, Text, Newline, Spinner],
})
export class AppComponent implements OnDestroy {
  private input = inject(InputService);
  private app = inject(AppService);

  readonly headerChars = HEADER_CHARS;
  readonly color = gradientColor;

  messages = signal<Message[]>([]);
  currentInput = signal('');
  isThinking = signal(false);
  private nextId = 1;
  private responseIndex = 0;

  constructor() {
    effect(() => {
      const kp = this.input.keypress();
      if (!kp) return;
      const { input, key } = kp;

      if (key.ctrl && input === 'c') {
        this.app.exit();
        return;
      }

      if (untracked(this.isThinking)) return;

      const curInput = untracked(this.currentInput);
      if (key.return) {
        const text = curInput.trim();
        if (text.length > 0) {
          this.messages.update((msgs) => [...msgs, { id: this.nextId++, role: 'user', text }]);
          this.currentInput.set('');
          this.isThinking.set(true);
          const reply = CANNED_RESPONSES[this.responseIndex % CANNED_RESPONSES.length];
          this.responseIndex++;
          setTimeout(() => {
            this.messages.update((msgs) => [
              ...msgs,
              { id: this.nextId++, role: 'assistant', text: reply },
            ]);
            this.isThinking.set(false);
          }, 1000);
        }
      } else if (key.backspace || key.delete) {
        this.currentInput.update((s) => s.slice(0, -1));
      } else if (input === 'q' && curInput.length === 0) {
        this.app.exit();
      } else if (input && !key.ctrl && !key.meta) {
        this.currentInput.update((s) => s + input);
      }
    });
  }

  ngOnDestroy(): void {}
}
