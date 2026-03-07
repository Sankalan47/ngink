import { bootstrapCli } from '../../src/index.js';
import { FocusComponent } from './focus.component.js';

bootstrapCli(FocusComponent).catch(console.error);
