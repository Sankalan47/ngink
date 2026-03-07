import { Component, Input } from '@angular/core';
import { InkComponent } from './_base.js';

@Component({
  standalone: true,
  selector: 'Static',
  template: '<ng-content />',
})
export class Static extends InkComponent {
  // items + children render fn is the React pattern; in Angular use @for inside Static instead
  @Input() items?: unknown[];
  @Input() style?: Record<string, unknown>;
}
