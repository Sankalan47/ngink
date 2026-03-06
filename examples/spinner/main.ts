import { bootstrapCli } from '../../src/index.js';
import { SpinnerComponent } from './spinner.component.js';

bootstrapCli(SpinnerComponent).catch(console.error);
