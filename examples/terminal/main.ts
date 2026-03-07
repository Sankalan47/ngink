import { bootstrapCli } from '../../src/index.js';
import { TerminalComponent } from './terminal.component.js';

bootstrapCli(TerminalComponent).catch(console.error);
