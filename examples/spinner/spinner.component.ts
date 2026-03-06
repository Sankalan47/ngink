import { Component, signal, NO_ERRORS_SCHEMA, OnDestroy } from '@angular/core';

// Phase 3: Box, Text, Spinner, Newline, Spacer — all with full prop support
// Note: @if/@else is Phase 4. This example uses only static structure + signal-driven prop changes.
@Component({
  standalone: true,
  selector: 'app-spinner',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'cyan'">
      <Text [bold]="true" [color]="'cyan'">ngink — Phase 3: Layout Components</Text>
      <Newline />

      <Box>
        <Spinner [type]="spinnerType()" />
        <Text> Spinner type: <Text [bold]="true">{{ spinnerType() }}</Text> ({{ elapsed() }}s)</Text>
      </Box>

      <Newline />

      <Box [flexDirection]="'row'" [gap]="2">
        <Text [backgroundColor]="'blue'" [color]="'white'" [bold]="true"> bold </Text>
        <Text [italic]="true"> italic </Text>
        <Text [underline]="true"> underline </Text>
        <Text [strikethrough]="true"> strike </Text>
        <Text [dimColor]="true"> dimmed </Text>
        <Text [inverse]="true"> inverse </Text>
      </Box>

      <Newline />

      <Box [borderStyle]="'single'" [borderColor]="'gray'" [padding]="1" [flexDirection]="'column'">
        <Text [bold]="true">Box flexbox props</Text>
        <Box [flexDirection]="'row'" [justifyContent]="'space-between'" [marginTop]="1">
          <Text [color]="'green'">left</Text>
          <Spacer />
          <Text [color]="'yellow'">center</Text>
          <Spacer />
          <Text [color]="'red'">right</Text>
        </Box>
      </Box>

      <Newline />
      <Text [dimColor]="true">Box · Text · Spinner · Newline · Spacer  |  Ctrl+C to exit</Text>
    </Box>
  `,
  schemas: [NO_ERRORS_SCHEMA],
})
export class SpinnerComponent implements OnDestroy {
  elapsed = signal(0);

  // Cycle through spinner types every 2s to demonstrate prop reactivity
  readonly spinnerTypes = ['dots', 'line', 'arc', 'bouncingBall', 'star'];
  spinnerType = signal(this.spinnerTypes[0]);

  private timer = setInterval(() => {
    this.elapsed.update((v) => v + 1);
    this.spinnerType.set(this.spinnerTypes[this.elapsed() % this.spinnerTypes.length]);
  }, 2000);

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
