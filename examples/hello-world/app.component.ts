import { Component } from '@angular/core';
import { Text } from '../../src/components/index.js';

@Component({
  standalone: true,
  selector: 'app-hello-world',
  imports: [Text],
  template: `<Text>Hello from ngink!</Text>`,
})
export class HelloWorldComponent {}
