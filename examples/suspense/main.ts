import { bootstrapCli } from '../../src/index.js';
import { SuspenseComponent } from './suspense.component.js';

bootstrapCli(SuspenseComponent).catch(console.error);
