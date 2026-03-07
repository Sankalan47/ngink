import { Component, signal, OnDestroy } from '@angular/core';
import { bootstrapCli, Box, Text } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-if-test',
  imports: [Box, Text],
  template: `
    <Box [flexDirection]="'column'" [padding]="1">
      <Text>Count: {{ count() }}</Text>
      @if (count() % 2 === 0) {
        <Text [color]="'green'">EVEN</Text>
      } @else {
        <Text [color]="'red'">ODD</Text>
      }
    </Box>
  `,
})
class IfTestComponent implements OnDestroy {
  count = signal(0);
  private t = setInterval(() => this.count.update((v) => v + 1), 800);
  ngOnDestroy() {
    clearInterval(this.t);
  }
}

bootstrapCli(IfTestComponent).catch(console.error);
