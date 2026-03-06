import { Component, signal, computed, inject, effect, NO_ERRORS_SCHEMA } from '@angular/core';
import { InputService } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-interactive',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'cyan'">
      <Text [bold]="true" [color]="'cyan'">ngink — Phase 5: Keyboard Input</Text>
      <Newline />

      <Box [flexDirection]="'row'" [gap]="1">
        <Text [dimColor]="true">Counter:</Text>
        <Text [bold]="true" [color]="color()">{{ count() }}</Text>
      </Box>

      <Newline />
      <Text [dimColor]="true">↑ / k  increment</Text>
      <Text [dimColor]="true">↓ / j  decrement</Text>
      <Text [dimColor]="true">r      reset</Text>
      <Text [dimColor]="true">q / Ctrl+C  quit</Text>

      @if (lastKey()) {
        <Newline />
        <Text [dimColor]="true">last key: {{ lastKey() }}</Text>
      }
    </Box>
  `,
  schemas: [NO_ERRORS_SCHEMA],
})
export class InteractiveComponent {
  private input = inject(InputService);

  count = signal(0);
  lastKey = signal('');

  color = computed(() => {
    const n = this.count();
    if (n > 0) return 'green';
    if (n < 0) return 'red';
    return 'white';
  });

  constructor() {
    effect(() => {
      const kp = this.input.keypress();
      if (!kp) return;
      const { input, key } = kp;

      if (key.upArrow || input === 'k') {
        this.count.update((v) => v + 1);
        this.lastKey.set('↑');
      } else if (key.downArrow || input === 'j') {
        this.count.update((v) => v - 1);
        this.lastKey.set('↓');
      } else if (input === 'r') {
        this.count.set(0);
        this.lastKey.set('r');
      } else if (input === 'q') {
        process.exit(0);
      } else {
        this.lastKey.set(input || JSON.stringify(key));
      }
    });
  }
}
