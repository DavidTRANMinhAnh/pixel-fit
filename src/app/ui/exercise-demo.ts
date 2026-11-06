import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { PixelSprite, hasSprite } from '../anim/pixel-sprite';
import { exById } from '../services/coach.service';

const MODE_KEY = 'pixelfit.demo';

function savedMode(): 'pixel' | 'photo' {
  try {
    return localStorage.getItem(MODE_KEY) === 'photo' ? 'photo' : 'pixel';
  } catch {
    return 'pixel';
  }
}

/**
 * Démo animée d'un exercice.
 * - Mode PIXEL : personnage 8-bit qui fait le geste (si l'exercice a une animation).
 * - Mode PHOTO : alterne les photos "début" et "fin" du mouvement, comme un GIF.
 * Toucher l'image met en pause.
 */
@Component({
  selector: 'px-demo',
  imports: [PixelSprite],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ex(); as e) {
      <button class="frame" type="button" (click)="toggle()" [attr.aria-label]="'Démo : ' + e.nom">
        @if (showSprite()) {
          <px-sprite [exId]="e.id" [paused]="paused()" [label]="'Animation : ' + e.nom" />
        } @else {
          <span class="photos">
            @for (src of e.images; track src; let i = $index) {
              <img
                [src]="src"
                [alt]="e.nom + (i === 0 ? ' : position de départ' : ' : position finale')"
                [class.on]="frame() === i"
                loading="lazy"
              />
            }
          </span>
        }
        <span class="badge pixel">{{ paused() ? '❚❚ PAUSE' : showSprite() ? '▶ LIVE' : frame() === 0 ? 'DÉPART' : 'ARRIVÉE' }}</span>
      </button>
      @if (sprite()) {
        <div class="switch">
          <button type="button" class="pixel" [class.on]="mode() === 'pixel'" (click)="setMode('pixel')">PIXEL</button>
          <button type="button" class="pixel" [class.on]="mode() === 'photo'" (click)="setMode('photo')">PHOTO</button>
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .frame {
      position: relative;
      display: block;
      width: 100%;
      padding: 0;
      border: 4px solid var(--black);
      background: var(--panel2);
      overflow: hidden;
      cursor: pointer;
    }
    .photos {
      position: relative;
      display: block;
      aspect-ratio: 3 / 2;
      background: #fff;
    }
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      opacity: 0;
    }
    img.on {
      opacity: 1;
    }
    .badge {
      position: absolute;
      left: 6px;
      bottom: 6px;
      font-size: 8px;
      background: var(--black);
      color: var(--lime);
      padding: 4px 6px;
    }
    .switch {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 6px;
    }
    .switch button {
      font-size: 8px;
      padding: 6px 8px;
      border: 2px solid var(--black);
      background: var(--panel2);
      color: var(--muted);
      cursor: pointer;
    }
    .switch button.on {
      background: var(--lime);
      color: var(--black);
    }
  `,
})
export class ExerciseDemo {
  readonly exId = input.required<string>();
  protected readonly ex = computed(() => exById(this.exId()));
  protected readonly sprite = computed(() => hasSprite(this.exId()));
  protected readonly mode = signal<'pixel' | 'photo'>(savedMode());
  protected readonly showSprite = computed(() => this.sprite() && this.mode() === 'pixel');
  protected readonly frame = signal(0);
  protected readonly paused = signal(false);

  constructor() {
    const t = setInterval(() => {
      if (!this.paused()) this.frame.update((f) => (f + 1) % Math.max(1, this.ex()?.images.length ?? 1));
    }, 900);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
  }

  toggle() {
    this.paused.update((p) => !p);
  }

  setMode(m: 'pixel' | 'photo') {
    this.mode.set(m);
    try {
      localStorage.setItem(MODE_KEY, m);
    } catch {
      /* stockage indisponible */
    }
  }
}
