import { Component, signal } from '@angular/core';
import { Box, Text, Focusable } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-focus',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'cyan'">
      <Text [bold]="true" [color]="'cyan'">ngink — FocusService demo</Text>
      <Text [dimColor]="true">Tab / Shift+Tab to cycle focus</Text>

      @for (item of items; track item.id) {
        <Focusable [id]="item.id" (focusChange)="onFocus(item.id, $event)">
          <Box [paddingLeft]="2">
            <Text [bold]="isFocused(item.id)" [color]="isFocused(item.id) ? 'green' : 'white'">
              {{ isFocused(item.id) ? '▶ ' : '  ' }}{{ item.label }}
            </Text>
          </Box>
        </Focusable>
      }
    </Box>
  `,
  imports: [Box, Text, Focusable],
})
export class FocusComponent {
  items = [
    { id: 'item-1', label: 'Option A' },
    { id: 'item-2', label: 'Option B' },
    { id: 'item-3', label: 'Option C' },
  ];

  focusedId = signal<string | null>(null);

  isFocused(id: string): boolean {
    return this.focusedId() === id;
  }

  onFocus(id: string, focused: boolean): void {
    if (focused) this.focusedId.set(id);
  }
}
