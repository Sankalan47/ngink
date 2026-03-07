import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Box, Text, Spinner } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-suspense',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'blue'">
      <Text [bold]="true" [color]="'blue'">ngink — Suspense-like async loading (&#64;defer)</Text>

      @defer (when loaded()) {
        <Box [marginTop]="1" [flexDirection]="'column'">
          <Text [color]="'green'">Hello World</Text>
          <Text [dimColor]="true">— loaded after 1.5s</Text>
        </Box>
      } @placeholder {
        <Box [marginTop]="1" [flexDirection]="'row'" [gap]="1">
          <Spinner />
          <Text [dimColor]="true">Loading...</Text>
        </Box>
      }

      <Box [marginTop]="1">
        <Text [dimColor]="true">Ctrl+C to quit</Text>
      </Box>
    </Box>
  `,
  imports: [Box, Text, Spinner],
})
export class SuspenseComponent implements OnInit, OnDestroy {
  loaded = signal(false);
  private loadTimer!: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.loadTimer = setTimeout(() => this.loaded.set(true), 1500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadTimer);
  }
}
