import { Component, Input } from '@angular/core';
import { InkComponent } from './_base.js';

@Component({
  standalone: true,
  selector: 'Transform',
  template: '<ng-content />',
})
export class Transform extends InkComponent {
  @Input({ required: true }) transform!: (children: string, index: number) => string;
  @Input() accessibilityLabel?: string;
}
