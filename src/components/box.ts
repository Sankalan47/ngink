import { Component, Input, SimpleChanges } from '@angular/core';
import { InkComponent } from './_base.js';

const ARIA_REMAP: Record<string, string> = {
  ariaRole: 'aria-role',
  ariaState: 'aria-state',
  ariaHidden: 'aria-hidden',
  ariaLabel: 'aria-label',
};

@Component({
  standalone: true,
  selector: 'Box',
  template: '<ng-content />',
})
export class Box extends InkComponent {
  // Layout
  @Input() flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  @Input() flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  @Input() flexGrow?: number;
  @Input() flexShrink?: number;
  @Input() flexBasis?: number | string;
  @Input() alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  @Input() alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'auto';
  @Input() justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  @Input() gap?: number;
  @Input() rowGap?: number;
  @Input() columnGap?: number;
  // Dimensions
  @Input() width?: number | string;
  @Input() height?: number | string;
  @Input() minWidth?: number | string;
  @Input() minHeight?: number | string;
  // Spacing
  @Input() margin?: number;
  @Input() marginX?: number;
  @Input() marginY?: number;
  @Input() marginTop?: number;
  @Input() marginBottom?: number;
  @Input() marginLeft?: number;
  @Input() marginRight?: number;
  @Input() padding?: number;
  @Input() paddingX?: number;
  @Input() paddingY?: number;
  @Input() paddingTop?: number;
  @Input() paddingBottom?: number;
  @Input() paddingLeft?: number;
  @Input() paddingRight?: number;
  // Border
  @Input() borderStyle?: string;
  @Input() borderColor?: string;
  @Input() borderTopColor?: string;
  @Input() borderBottomColor?: string;
  @Input() borderLeftColor?: string;
  @Input() borderRightColor?: string;
  @Input() borderTop?: boolean;
  @Input() borderBottom?: boolean;
  @Input() borderLeft?: boolean;
  @Input() borderRight?: boolean;
  @Input() borderDimColor?: boolean;
  @Input() borderTopDimColor?: boolean;
  @Input() borderBottomDimColor?: boolean;
  @Input() borderLeftDimColor?: boolean;
  @Input() borderRightDimColor?: boolean;
  // Misc
  @Input() display?: 'flex' | 'none';
  @Input() overflow?: 'visible' | 'hidden';
  @Input() overflowX?: 'visible' | 'hidden';
  @Input() overflowY?: 'visible' | 'hidden';
  @Input() position?: 'absolute' | 'relative';
  @Input() backgroundColor?: string;
  // Aria (camelCase Angular inputs → hyphenated Ink props via ngOnChanges)
  @Input() ariaRole?: 'button' | 'checkbox' | 'combobox' | 'list' | 'listbox' | 'listitem' | 'menu' | 'menuitem' | 'option' | 'progressbar' | 'radio' | 'radiogroup' | 'tab' | 'tablist' | 'table' | 'textbox' | 'timer' | 'toolbar';
  @Input() ariaState?: { busy?: boolean; checked?: boolean; disabled?: boolean; expanded?: boolean; multiline?: boolean; multiselectable?: boolean; readonly?: boolean; required?: boolean; selected?: boolean };
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
