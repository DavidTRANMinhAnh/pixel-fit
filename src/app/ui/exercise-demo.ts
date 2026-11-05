import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { exById } from '../services/coach.service';

/**
 * Démo animée d'un exercice : alterne les images "début" et "fin" du mouvement,
 * comme un GIF. Toucher l'image met en pause.
 */
@Component({
  selector: 'px-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ex(); as e) {
      <button class="frame" type="button" (click)="toggle()" [attr.aria-label]="'Démo : ' + e.nom">
        @for (src of e.images; track src; let i = $index) {
          <img [src]="src" [alt]="e.nom + (i === 0 ? ' : position de départ' : ' : position finale')" [class.on]="frame() === i" loading="lazy" />
        }
        <span class="badge pixel">{{ paused() ? '❚❚ PAUSE' : (frame() === 0 ? 'DÉPART' : 'ARRIVÉE') }}</span>
      </button>
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
      background: #fff;
      aspect-ratio: 3 / 2;
      overflow: hidden;
      cursor: pointer;
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
  `,
})
export class ExerciseDemo {
  readonly exId = input.required<string>();
  protected readonly ex = computed(() => exById(this.exId()));
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
}
