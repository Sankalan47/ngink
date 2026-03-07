import { Component } from '@angular/core';
import { Box, Text, Newline } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-border',
  template: `
    <Box [flexDirection]="'column'" [padding]="1">
      <Text [bold]="true" [color]="'cyan'">ngink — Border styles demo</Text>
      <Newline />

      <Box [flexDirection]="'row'" [gap]="2">
        @for (style of row1; track style) {
          <Box [borderStyle]="style" [padding]="1" [width]="16">
            <Text>{{ style }}</Text>
          </Box>
        }
      </Box>

      <Box [flexDirection]="'row'" [gap]="2" [marginTop]="1">
        @for (style of row2; track style) {
          <Box [borderStyle]="style" [padding]="1" [width]="16">
            <Text>{{ style }}</Text>
          </Box>
        }
      </Box>

      <Newline />
      <Text [dimColor]="true">Ctrl+C to quit</Text>
    </Box>
  `,
  imports: [Box, Text, Newline],
})
export class BorderComponent {
  row1 = ['single', 'double', 'round', 'bold'];
  row2 = ['singleDouble', 'doubleSingle', 'classic', 'arrow'];
}
