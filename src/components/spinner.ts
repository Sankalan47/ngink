import { Component, Input } from '@angular/core';
import { InkComponent } from './_base.js';

@Component({
  standalone: true,
  selector: 'Spinner',
  template: '',
})
export class Spinner extends InkComponent {
  // cli-spinners names — typed as string for simplicity, avoiding cli-spinners dep in user code
  @Input() type?: string;
}
