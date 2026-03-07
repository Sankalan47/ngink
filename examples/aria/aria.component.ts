import { Component, signal, inject, effect } from '@angular/core';
import { InputService, AppService, Box, Text } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-aria',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'magenta'">
      <Text [bold]="true" [color]="'magenta'">ngink — Accessibility (aria) demo</Text>
      <Text [dimColor]="true">Best experienced with a screen reader.</Text>

      <Box
        [marginTop]="1"
        [ariaRole]="'checkbox'"
        [ariaState]="{ checked: checked() }"
        [ariaLabel]="'Dark mode toggle'"
      >
        <Text>{{ checked() ? '[x]' : '[ ]' }} Dark mode</Text>
        <Text [ariaHidden]="true" [color]="'gray'">  (screen-reader hidden)</Text>
      </Box>

      <Box [marginTop]="1" [flexDirection]="'column'">
        <Text [dimColor]="true">Space  toggle checkbox</Text>
        <Text [dimColor]="true">q / Ctrl+C  quit</Text>
      </Box>
    </Box>
  `,
  imports: [Box, Text],
})
export class AriaComponent {
  private input = inject(InputService);
  private app = inject(AppService);

  checked = signal(false);

  constructor() {
    effect(() => {
      const kp = this.input.keypress();
      if (!kp) return;
      const { input, key } = kp;
      if (input === ' ') {
        this.checked.update((v) => !v);
      } else if (input === 'q' || key.escape) {
        this.app.exit();
      }
    });
  }
}
