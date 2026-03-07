import { bootstrapCli } from '../../src/index.js';
import { BorderComponent } from './border.component.js';

bootstrapCli(BorderComponent).catch(console.error);
