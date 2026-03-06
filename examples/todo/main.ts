import '@angular/compiler'; // JIT mode — MUST be first import
import { bootstrapCli } from '../../src/index.js';
import { TodoComponent } from './todo.component.js';

bootstrapCli(TodoComponent).catch(console.error);
