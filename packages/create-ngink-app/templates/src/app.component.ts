import { Component, signal, inject, effect } from '@angular/core';
import { InputService, AppService, Box, Text, Newline } from 'ng-ink';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'cyan'">

      <Text [bold]="true" [color]="'cyan'">Welcome to ng-ink!</Text>
      <Newline />

      <Text>Type something and press Enter:</Text>
      <Newline />

      @if (lastMessage()) {
        <Box [flexDirection]="'row'" [gap]="1">
          <Text [color]="'green'" [bold]="true">›</Text>
          <Text>{{ lastMessage() }}</Text>
        </Box>
        <Newline />
      }

      <Box [flexDirection]="'row'" [gap]="1" [borderStyle]="'single'" [borderColor]="'green'" [paddingX]="1">
        <Text [color]="'green'">›</Text>
        <Text>{{ currentInput() }}</Text>
      </Box>

      <Newline />
      <Text [dimColor]="true">Enter send · Backspace delete · q (empty) quit</Text>

    </Box>
  `,
  imports: [Box, Text, Newline],
})
export class AppComponent {
  private input = inject(InputService);
  private app = inject(AppService);

  currentInput = signal('');
  lastMessage = signal('');

  constructor() {
    effect(() => {
      const kp = this.input.keypress();
      if (!kp) return;
      const { input, key } = kp;

      if (key.ctrl && input === 'c') {
        this.app.exit();
        return;
      }

      const cur = this.currentInput();

      if (key.return) {
        const text = cur.trim();
        if (text.length > 0) {
          this.lastMessage.set(text);
          this.currentInput.set('');
        }
      } else if (key.backspace || key.delete) {
        this.currentInput.update(s => s.slice(0, -1));
      } else if (input === 'q' && cur.length === 0) {
        this.app.exit();
      } else if (input && !key.ctrl && !key.meta) {
        this.currentInput.update(s => s + input);
      }
    });
  }
}
