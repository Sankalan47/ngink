import { Component, inject } from '@angular/core';
import { TerminalService, AppService, Box, Text, Newline } from '../../src/index.js';

@Component({
  standalone: true,
  selector: 'app-terminal',
  template: `
    <Box [flexDirection]="'column'" [padding]="1" [borderStyle]="'round'" [borderColor]="'yellow'">
      <Text [bold]="true" [color]="'yellow'">ngink — TerminalService demo</Text>
      <Newline />
      <Box [flexDirection]="'row'" [gap]="1">
        <Text [dimColor]="true">Columns:</Text>
        <Text [bold]="true">{{ terminal.columns() }}</Text>
      </Box>
      <Box [flexDirection]="'row'" [gap]="1">
        <Text [dimColor]="true">Rows:</Text>
        <Text [bold]="true">{{ terminal.rows() }}</Text>
      </Box>
      <Newline />
      <Text [dimColor]="true">Resize the terminal to see dimensions update.</Text>
      <Text [dimColor]="true">Ctrl+C to quit.</Text>
    </Box>
  `,
  imports: [Box, Text, Newline],
})
export class TerminalComponent {
  terminal = inject(TerminalService);
  private app = inject(AppService);
}
