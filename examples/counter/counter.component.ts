import { Component, signal, computed, effect, OnDestroy } from '@angular/core';
import { Box, Text } from '../../src/components/index.js';

@Component({
  standalone: true,
  selector: 'app-counter',
  imports: [Box, Text],
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'">
      <Text [bold]="true" [color]="'cyan'">ngink Counter — Phase 2: Signal Reactivity</Text>
      <Text> </Text>
      <Text>Count: <Text [color]="countColor()">{{ count() }}</Text></Text>
      <Text [dimColor]="true">Updates every second. Ctrl+C to exit.</Text>
    </Box>
  `,
})
export class CounterComponent implements OnDestroy {
  count = signal(0);

  // computed() — derived from signal, automatically updates
  countColor = computed(() => {
    const n = this.count();
    if (n < 5) return 'green';
    if (n < 10) return 'yellow';
    return 'red';
  });

  private timer: ReturnType<typeof setInterval>;

  constructor() {
    // effect() — runs whenever count() changes, logs to stderr (Ink owns stdout)
    effect(() => {
      console.error(`[effect] count changed to ${this.count()}`);
    });

    this.timer = setInterval(() => {
      this.count.update((c) => c + 1);
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
