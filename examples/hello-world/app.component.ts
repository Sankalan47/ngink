import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-hello-world',
  template: `<Text>Hello from ngink!</Text>`,
  schemas: [NO_ERRORS_SCHEMA], // Phase 1 workaround — Phase 3 will use real component imports
})
export class HelloWorldComponent {}
