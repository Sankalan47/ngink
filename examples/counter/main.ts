import '@angular/compiler'; // JIT mode — MUST be first import
import { bootstrapCli } from '../../src/index.js';
import { CounterComponent } from './counter.component.js';

bootstrapCli(CounterComponent).catch(console.error);
