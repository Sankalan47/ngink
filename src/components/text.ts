import { Component, Input, SimpleChanges } from '@angular/core';
import { InkComponent } from './_base.js';

const ARIA_REMAP: Record<string, string> = {
  ariaHidden: 'aria-hidden',
  ariaLabel: 'aria-label',
};

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
  // Aria
  @Input() ariaHidden?: boolean;
  @Input() ariaLabel?: string;

  override ngOnChanges(changes: SimpleChanges): void {
    const el = this._el.nativeElement;
    for (const key of Object.keys(changes)) {
      const inkKey = ARIA_REMAP[key] ?? key;
      this._renderer.setProperty(el, inkKey, changes[key].currentValue);
    }
  }
}
