import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'Focusable',
  template: '<ng-content />',
})
export class Focusable implements OnChanges, OnInit {
  private _el = inject(ElementRef);
  private _renderer = inject(Renderer2);

  @Input() id?: string;
  @Input() isActive?: boolean;
  @Input() autoFocus?: boolean;
  @Output() focusChange = new EventEmitter<boolean>();

  ngOnChanges(changes: SimpleChanges): void {
    for (const key of Object.keys(changes)) {
      this._renderer.setProperty(this._el.nativeElement, key, changes[key].currentValue);
    }
  }

  ngOnInit(): void {
    // Register the onFocusChange callback on the InkNode so FocusableReact can invoke it.
    // This runs after the first ngOnChanges, so all @Input() props are already synced.
    // scheduleRerender() debounces via queueMicrotask, so the callback is present before
    // the first React render reads the final node state.
    this._renderer.setProperty(
      this._el.nativeElement,
      'onFocusChange',
      (isFocused: boolean) => this.focusChange.emit(isFocused),
    );
  }
}
