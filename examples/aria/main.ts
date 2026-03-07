import { bootstrapCli } from '../../src/index.js';
import { AriaComponent } from './aria.component.js';

bootstrapCli(AriaComponent).catch(console.error);
