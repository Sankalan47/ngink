import { bootstrapCli } from '../../src/index.js';
import { InteractiveComponent } from './interactive.component.js';

bootstrapCli(InteractiveComponent).catch(console.error);
