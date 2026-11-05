import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EQUIPMENT_LABEL, MUSCLE_LABEL, TYPE_LABEL } from '../data/labels';
import { Equipment } from '../models';
import { exById } from '../services/coach.service';
import { StoreService } from '../services/store.service';
import { ExerciseDemo } from '../ui/exercise-demo';
import { PixelIcon } from '../ui/pixel-icon';

@Component({
  selector: 'px-exercise',
  imports: [ExerciseDemo, PixelIcon, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="btn ghost small" (click)="back()"><px-icon name="back" [size]="12" /> Retour</button>
    @if (ex(); as e) {
      <section class="box">
        <h1>{{ e.nom }}</h1>
        <px-demo [exId]="e.id" />
        <p class="muted small hint">Touche l'image pour mettre en pause.</p>
        <div>
          <span class="tag">{{ typeLabel[e.type] }}</span>
          <span class="tag">{{ levels[e.niveau - 1] }}</span>
          @for (m of e.materiel; track m) {
            <span class="tag">{{ eqLabel(m) }}</span>
          }
        </div>
        <h2>► MUSCLES</h2>
        <div>
          @for (m of e.muscles; track m) {
            <span class="tag green">{{ muscleLabel[m] }}</span>
          }
          @for (m of e.secondaires; track m) {
            <span class="tag">{{ muscleLabel[m] }}</span>
          }
        </div>
        <h2>► COMMENT FAIRE</h2>
        <ol>
          @for (c of e.consignes; track $index) {
            <li>{{ c }}</li>
          }
        </ol>
      </section>

      <section class="box dark">
        <h2>► MES RECORDS</h2>
        @if (stats(); as st) {
          <p>Fait {{ st.times }} fois. Meilleure série : <b>{{ st.best }}</b>.</p>
        } @else {
          <p class="muted">Pas encore fait. À toi de jouer !</p>
        }
      </section>
    } @else {
      <p>Exercice introuvable. <a routerLink="/exos">Retour à la bibliothèque</a></p>
    }
  `,
  styles: `
    h1 {
      color: var(--lime);
      font-size: 13px;
    }
    .hint {
      margin: 6px 0 10px;
    }
    ol {
      padding-left: 24px;
      margin: 0;
    }
    li {
      margin-bottom: 6px;
    }
    b {
      color: var(--yellow);
      font-weight: normal;
    }
  `,
})
export class ExercisePage {
  readonly id = input.required<string>();
  private readonly store = inject(StoreService);
  private readonly location = inject(Location);
  protected readonly ex = computed(() => exById(this.id()));
  protected readonly muscleLabel = MUSCLE_LABEL;
  protected readonly typeLabel = TYPE_LABEL;
  protected readonly levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  protected readonly stats = computed(() => {
    const id = this.id();
    let times = 0;
    let best = 0;
    let bestW = 0;
    for (const w of this.store.history()) {
      const it = w.items.find((x) => x.exId === id);
      if (!it) continue;
      times++;
      for (const s of it.sets.filter((x) => x.done)) {
        const score = (s.weight ?? 0) * 1000 + s.value;
        if (score > bestW * 1000 + best) {
          best = s.value;
          bestW = s.weight ?? 0;
        }
      }
    }
    if (!times) return null;
    const unit = this.ex()?.mode === 'temps' ? ' s' : ' reps';
    return { times, best: best + unit + (bestW ? ` à ${bestW} kg` : '') };
  });

  protected eqLabel(m: string): string {
    return m
      .split('|')
      .map((x) => EQUIPMENT_LABEL[x as Equipment] ?? x)
      .join(' ou ');
  }

  back() {
    this.location.back();
  }
}
