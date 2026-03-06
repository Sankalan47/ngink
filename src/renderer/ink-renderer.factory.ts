import { Injectable, RendererFactory2, Renderer2, RendererType2 } from '@angular/core';
import { InkRenderer } from './ink-renderer.js';

@Injectable()
export class InkRendererFactory implements RendererFactory2 {
  // Single shared instance — rootNode and rerenderFn are module-level singletons in ink-renderer.ts
  private renderer = new InkRenderer();

  createRenderer(_hostElement: any, _type: RendererType2 | null): Renderer2 {
    return this.renderer;
  }
}
