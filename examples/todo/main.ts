import { bootstrapCli } from '../../src/index.js';
import { TodoComponent } from './todo.component.js';

bootstrapCli(TodoComponent).catch(console.error);
