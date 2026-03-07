import { bootstrapCli } from '../../src/index.js';
import { TableComponent } from './table.component.js';

bootstrapCli(TableComponent).catch(console.error);
