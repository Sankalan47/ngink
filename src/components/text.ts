import { Component, Input } from '@angular/core';
import { InkComponent } from './_base.js';

@Component({
  standalone: true,
  selector: 'Text',
  template: '<ng-content />',
})
export class Text extends InkComponent {
  @Input() color?: string;
  @Input() backgroundColor?: string;
  @Input() dimColor?: boolean;
  @Input() bold?: boolean;
  @Input() italic?: boolean;
  @Input() underline?: boolean;
  @Input() strikethrough?: boolean;
  @Input() inverse?: boolean;
  @Input() wrap?: 'wrap' | 'end' | 'middle' | 'truncate' | 'truncate-end' | 'truncate-middle' | 'truncate-start';
}
