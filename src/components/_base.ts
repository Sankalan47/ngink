import { Directive, ElementRef, inject, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

/**
 * Base class for all ngink component stubs.
 *
 * Angular input bindings on real components bypass renderer.setProperty — Angular sets
 * the @Input() property directly on the component instance without going through the
 * renderer. This base class re-syncs every changed input back to the host element (InkNode)
 * via Renderer2.setProperty so our InkRenderer can pick them up and pass them to Ink.
 */
@Directive()
export abstract class InkComponent implements OnChanges {
  private _el = inject(ElementRef);
  private _renderer = inject(Renderer2);

  ngOnChanges(changes: SimpleChanges): void {
    for (const key of Object.keys(changes)) {
      this._renderer.setProperty(this._el.nativeElement, key, changes[key].currentValue);
    }
  }
}
