import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ANIMS } from './poses';
import { G, H, OY, W, frames, render } from './rig';

export function hasSprite(exId: string): boolean {
  return exId in ANIMS;
}

const cache = new Map<string, ReturnType<typeof frames>>();
function framesOf(id: string) {
  let f = cache.get(id);
  if (!f) {
    f = frames(ANIMS[id]);
    cache.set(id, f);
  }
  return f;
}

const SKY_TOP = [0x29, 0x36, 0x6f];
const SKY_BOTTOM = [0x33, 0x3c, 0x57];
const FLOOR = [0x56, 0x6c, 0x86];
const FLOOR_DARK = [0x26, 0x2b, 0x44];

/** Personnage pixel art animé qui montre le geste, dessiné en direct dans un canvas. */
@Component({
  selector: 'px-sprite',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #cv [width]="w" [height]="h" role="img" [attr.aria-label]="label()"></canvas>`,
  styles: `
    :host {
      display: block;
    }
    canvas {
      display: block;
      width: 100%;
      height: auto;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
  `,
})
export class PixelSprite {
  readonly exId = input.required<string>();
  readonly label = input('Animation du mouvement');
  readonly paused = input(false);
  protected readonly w = W;
  protected readonly h = H;
  private readonly cv = viewChild.required<ElementRef<HTMLCanvasElement>>('cv');
  private readonly tick = signal(0);

  constructor() {
    let t: ReturnType<typeof setInterval> | undefined;
    afterNextRender(() => {
      t = setInterval(() => {
        if (!this.paused()) this.tick.update((n) => n + 1);
      }, 110);
    });
    inject(DestroyRef).onDestroy(() => clearInterval(t));

    effect(() => {
      const anim = ANIMS[this.exId()];
      const n = this.tick();
      const ctx = this.cv().nativeElement.getContext('2d');
      if (!anim || !ctx) return;
      const list = framesOf(this.exId());
      const img = ctx.createImageData(W, H);
      render(anim, list[n % list.length], img);
      paintBackground(img.data);
      ctx.putImageData(img, 0, 0);
    });
  }
}

function paintBackground(d: Uint8ClampedArray) {
  const ground = G + OY + 1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (d[i + 3]) continue;
      let c: number[];
      if (y === ground) c = FLOOR;
      else if (y > ground) c = (x + y) % 4 === 0 ? FLOOR : FLOOR_DARK;
      else {
        const t = y / ground;
        // dégradé en bandes (dithering simple) pour un rendu rétro
        const band = t + ((x + y) % 2) * 0.06 > 0.55;
        c = band ? SKY_BOTTOM : SKY_TOP;
      }
      d[i] = c[0];
      d[i + 1] = c[1];
      d[i + 2] = c[2];
      d[i + 3] = 255;
    }
  }
}
