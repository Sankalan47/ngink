import '@angular/compiler'; // JIT mode — MUST be first import
import { bootstrapCli } from '../../src/index.js';
import { HelloWorldComponent } from './app.component.js';

bootstrapCli(HelloWorldComponent).catch(console.error);
