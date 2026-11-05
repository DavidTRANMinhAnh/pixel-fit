import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MUSCLE_LABEL } from '../data/labels';
import { WorkoutLog } from '../models';
import { exById } from '../services/coach.service';
import { StoreService, weekIndex } from '../services/store.service';

const TITLES = ['Novice', 'Apprenti', 'Écuyer', 'Guerrier', 'Chevalier', 'Champion', 'Héros', 'Légende'];

@Component({
  selector: 'px-journal',
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>JOURNAL</h1>

    <section class="box accent">
      <div class="row">
        <div class="lvl pixel">{{ store.level() }}</div>
        <div class="grow">
          <div class="pixel title">{{ title() }}</div>
          <div class="bar"><i [style.width.%]="(100 * store.levelProgress().current) / store.levelProgress().needed"></i></div>
          <div class="muted small">
            {{ store.levelProgress().current }} / {{ store.levelProgress().needed }} XP avant le niveau {{ store.level() + 1 }}
          </div>
        </div>
      </div>
    </section>

    <section class="box">
      <h2>► 8 DERNIÈRES SEMAINES</h2>
      <div class="chart">
        @for (w of weeks(); track w.label) {
          <div class="col">
            <div class="stack">
              @for (n of range(w.count); track n) {
                <i></i>
              }
            </div>
            <span>{{ w.label }}</span>
          </div>
        }
      </div>
      <p class="muted small">Un bloc = une séance. Objectif : {{ store.profile()?.daysPerWeek ?? 3 }} par semaine.</p>
    </section>

    <section class="box dark">
      <h2>► MUSCLES TRAVAILLÉS (30 J)</h2>
      @for (m of topMuscles(); track m.id) {
        <div class="mrow">
          <span>{{ m.label }}</span>
          <div class="bar grow"><i [style.width.%]="m.pct"></i></div>
          <span class="muted">{{ m.sets }}</span>
        </div>
      } @empty {
        <p class="muted">Rien pour l'instant.</p>
      }
      @if (neglected().length) {
        <p class="small">⚠ Peu travaillés : {{ neglected().join(', ') }}.</p>
      }
    </section>

    <h2>► HISTORIQUE</h2>
    @for (w of store.history(); track w.id) {
      <details class="box dark log">
        <summary>
          <span class="pixel d">{{ w.date | date: 'dd/MM' }}</span>
          <span class="grow">{{ w.title }} · {{ w.durationMin }} min</span>
          <span class="xp">+{{ w.xp }}</span>
        </summary>
        <ul>
          @for (it of w.items; track $index) {
            @if (doneSets(it.sets).length) {
              <li>
                {{ name(it.exId) }} :
                <span class="muted">{{ summary(it.exId, it.sets) }}</span>
              </li>
            }
          }
        </ul>
        @if (w.feeling) {
          <p class="small">Ressenti : {{ moods[w.feeling - 1] }}</p>
        }
        <button class="btn red small" (click)="remove(w)">Supprimer</button>
      </details>
    } @empty {
      <p class="muted">Aucune séance enregistrée. Ta première quête t'attend !</p>
    }
  `,
  styles: `
    .lvl {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--black);
      color: var(--yellow);
      font-size: 22px;
      flex: none;
    }
    .title {
      font-size: 11px;
      color: var(--cyan);
      margin-bottom: 8px;
    }
    .chart {
      display: flex;
      gap: 6px;
      align-items: flex-end;
      height: 130px;
    }
    .col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      height: 100%;
      justify-content: flex-end;
    }
    .col span {
      font-size: 15px;
      color: var(--muted);
    }
    .stack {
      display: flex;
      flex-direction: column-reverse;
      gap: 3px;
      width: 100%;
    }
    .stack i {
      display: block;
      height: 14px;
      background: var(--green);
      border: 2px solid var(--black);
    }
    .mrow {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 5px 0;
    }
    .mrow span:first-child {
      width: 100px;
    }
    .log summary {
      display: flex;
      gap: 10px;
      align-items: center;
      cursor: pointer;
      list-style: none;
    }
    .d {
      font-size: 9px;
      color: var(--yellow);
    }
    .xp {
      color: var(--cyan);
    }
    ul {
      padding-left: 20px;
    }
  `,
})
export class JournalPage {
  protected readonly store = inject(StoreService);
  protected readonly moods = ['😵', '😓', '😐', '🙂', '😎'];

  protected readonly title = computed(() => TITLES[Math.min(TITLES.length - 1, this.store.level() - 1)]);

  protected readonly weeks = computed(() => {
    const now = weekIndex(new Date());
    const counts = new Map<number, number>();
    for (const w of this.store.history()) {
      const k = weekIndex(new Date(w.date));
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    return Array.from({ length: 8 }, (_, i) => {
      const k = now - 7 + i;
      // weekIndex compte les lundis depuis 1970 : le lundi de la semaine k est le jour 7k - 3
      const monday = new Date((7 * k - 3) * 86400000 + 12 * 3600000);
      return {
        label: i === 7 ? 'auj.' : `${monday.getDate()}/${monday.getMonth() + 1}`,
        count: Math.min(7, counts.get(k) ?? 0),
      };
    });
  });

  private readonly muscleSets = computed(() => {
    const since = Date.now() - 30 * 86400000;
    const out: Record<string, number> = {};
    for (const w of this.store.history()) {
      if (new Date(w.date).getTime() < since) continue;
      for (const it of w.items) {
        const e = exById(it.exId);
        if (!e || e.type === 'mobilite') continue;
        const n = it.sets.filter((s) => s.done).length;
        if (!n) continue;
        for (const m of e.muscles) out[m] = (out[m] ?? 0) + n;
      }
    }
    return out;
  });

  protected readonly topMuscles = computed(() => {
    const ms = this.muscleSets();
    const max = Math.max(1, ...Object.values(ms));
    return Object.entries(ms)
      .sort((a, b) => b[1] - a[1])
      .map(([id, sets]) => ({ id, sets, label: MUSCLE_LABEL[id] ?? id, pct: (100 * sets) / max }));
  });

  protected readonly neglected = computed(() => {
    if (this.store.history().length < 3) return [];
    const ms = this.muscleSets();
    return ['pectoraux', 'dorsaux', 'epaules', 'quadriceps', 'ischios', 'fessiers', 'abdos']
      .filter((m) => (ms[m] ?? 0) < 3)
      .map((m) => MUSCLE_LABEL[m]);
  });

  protected range(n: number) {
    return Array.from({ length: n }, (_, i) => i);
  }

  protected name(id: string) {
    return exById(id)?.nom ?? id;
  }

  protected doneSets(sets: WorkoutLog['items'][number]['sets']) {
    return sets.filter((s) => s.done);
  }

  protected summary(id: string, sets: WorkoutLog['items'][number]['sets']) {
    const unit = exById(id)?.mode === 'temps' ? 's' : '';
    return this.doneSets(sets)
      .map((s) => `${s.value}${unit}${s.weight ? '@' + s.weight + 'kg' : ''}`)
      .join(' · ');
  }

  remove(w: WorkoutLog) {
    if (window.confirm('Supprimer cette séance du journal ?')) this.store.deleteWorkout(w.id);
  }
}
