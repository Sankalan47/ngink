import { describe, it, expect } from 'vitest';
import { Component, signal, computed } from '@angular/core';
import { renderCli } from '../testing.js';
import { Box, Text, Newline } from '../components/index.js';

@Component({
  standalone: true,
  selector: 'app-hello',
  template: `<Text>Hello World</Text>`,
  imports: [Text],
})
class HelloComponent {}

@Component({
  standalone: true,
  selector: 'app-counter',
  template: `<Text>Count: {{ count() }}</Text>`,
  imports: [Text],
})
class CounterComponent {
  count = signal(42);
}

@Component({
  standalone: true,
  selector: 'app-layout',
  template: `
    <Box [flexDirection]="'column'">
      <Text [bold]="true">Title</Text>
      <Newline />
      <Text>Body text</Text>
    </Box>
  `,
  imports: [Box, Text, Newline],
})
class LayoutComponent {}

describe('renderCli', () => {
  it('renders plain text', async () => {
    const output = await renderCli(HelloComponent);
    expect(output).toContain('Hello World');
  });

  it('renders signals', async () => {
    const output = await renderCli(CounterComponent);
    expect(output).toContain('Count: 42');
  });

  it('renders layout components', async () => {
    const output = await renderCli(LayoutComponent);
    expect(output).toContain('Title');
    expect(output).toContain('Body text');
  });

  it('respects columns option', async () => {
    const output = await renderCli(HelloComponent, { columns: 40 });
    expect(output).toContain('Hello World');
  });

  it('resets state between calls', async () => {
    const a = await renderCli(HelloComponent);
    const b = await renderCli(CounterComponent);
    expect(a).toContain('Hello World');
    expect(b).toContain('Count: 42');
    expect(b).not.toContain('Hello World');
  });
});
