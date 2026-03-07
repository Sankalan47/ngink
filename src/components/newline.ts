import { Component, Input } from '@angular/core';
import { InkComponent } from './_base.js';

@Component({
  standalone: true,
  selector: 'Newline',
  template: '',
})
export class Newline extends InkComponent {
  @Input() count?: number;
}
