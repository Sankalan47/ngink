import { Component, signal, inject, effect, untracked, OnDestroy } from '@angular/core';
import { InputService, AppService, Box, Text, Newline } from '../../src/index.js';

interface Message {
  id: number;
  text: string;
}

@Component({
  standalone: true,
  selector: 'app-chat',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'green'">
      <Text [bold]="true" [color]="'green'">ngink — Chat demo</Text>
      <Newline />

      @if (messages().length === 0) {
        <Text [dimColor]="true">No messages yet. Type and press Enter.</Text>
      } @else {
        @for (msg of messages(); track msg.id) {
          <Box [flexDirection]="'row'" [gap]="1">
            <Text [color]="'cyan'">you</Text>
            <Text>{{ msg.text }}</Text>
          </Box>
        }
      }

      <Box [marginTop]="1" [flexDirection]="'row'" [gap]="1" [borderStyle]="'single'" [borderColor]="'gray'" [paddingX]="1">
        <Text [color]="'gray'">›</Text>
        <Text>{{ currentInput() }}</Text>
      </Box>

      <Newline />
      <Text [dimColor]="true">Enter submit · Backspace delete · q (empty input) / Ctrl+C quit</Text>
    </Box>
  `,
  imports: [Box, Text, Newline],
})
export class ChatComponent implements OnDestroy {
  private input = inject(InputService);
  private app = inject(AppService);

  messages = signal<Message[]>([]);
  currentInput = signal('');
  private nextId = 1;

  constructor() {
    effect(() => {
      const kp = this.input.keypress();
      if (!kp) return;
      const { input, key } = kp;

      const curInput = untracked(this.currentInput);
      if (key.return) {
        const text = curInput.trim();
        if (text.length > 0) {
          this.messages.update((msgs) => [...msgs, { id: this.nextId++, text }]);
          this.currentInput.set('');
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
