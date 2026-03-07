import { bootstrapCli } from '../../src/index.js';
import { ChatComponent } from './chat.component.js';

bootstrapCli(ChatComponent).catch(console.error);
