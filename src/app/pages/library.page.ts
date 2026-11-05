import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EXERCISES } from '../data/exercises';
import { MUSCLE_GROUPS, MUSCLE_LABEL, TYPE_LABEL } from '../data/labels';
import { CoachService } from '../services/coach.service';
import { StoreService } from '../services/store.service';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

@Component({
  selector: 'px-library',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>BIBLIOTHÈQUE <span class="muted">({{ list().length }})</span></h1>
    <input type="search" placeholder="Rechercher un exo…" [value]="q()" (input)="q.set($any($event.target).value)" />

    <div class="chips">
      <button class="chip" [class.on]="group() === ''" (click)="group.set('')">Tous</button>
      @for (g of groups; track g.id) {
        <button class="chip" [class.on]="group() === g.id" (click)="group.set(g.id)">{{ g.label }}</button>
      }
      <button class="chip" [class.on]="group() === 'cardio'" (click)="group.set('cardio')">Cardio</button>
      <button class="chip" [class.on]="group() === 'mobilite'" (click)="group.set('mobilite')">Mobilité</button>
    </div>
    <label class="mine">
      <input type="checkbox" [checked]="mine()" (change)="mine.set($any($event.target).checked)" />
      Seulement ce que je peux faire avec mon matériel
    </label>

    <div class="grid">
      @for (e of list(); track e.id) {
        <a class="card" [routerLink]="['/exos', e.id]">
          <img [src]="e.images[1] ?? e.images[0]" [alt]="e.nom" loading="lazy" />
          <span class="nm">{{ e.nom }}</span>
          <span class="meta">{{ typeLabel[e.type] }} · {{ muscleLabel[e.muscles[0]] }}</span>
        </a>
      } @empty {
        <p class="muted">Aucun exercice ne correspond.</p>
      }
    </div>
  `,
  styles: `
    .mine {
      display: flex;
      gap: 8px;
      align-items: center;
      color: var(--ink);
      margin-bottom: 12px;
    }
    .mine input {
      width: 22px;
      height: 22px;
      accent-color: var(--green);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .card {
      display: flex;
      flex-direction: column;
      background: var(--panel);
      border: 4px solid var(--black);
      color: var(--ink);
      text-decoration: none;
    }
    .card img {
      width: 100%;
      aspect-ratio: 3 / 2;
      object-fit: cover;
      background: #fff;
      border-bottom: 4px solid var(--black);
    }
    .nm {
      padding: 6px 8px 0;
      font-size: 19px;
      line-height: 1;
    }
    .meta {
      padding: 4px 8px 8px;
      font-size: 16px;
      color: var(--muted);
    }
  `,
})
export class LibraryPage {
  private readonly store = inject(StoreService);
  private readonly coach = inject(CoachService);
  protected readonly q = signal('');
  protected readonly group = signal('');
  protected readonly mine = signal(!!this.store.profile());
  protected readonly groups = MUSCLE_GROUPS;
  protected readonly muscleLabel = MUSCLE_LABEL;
  protected readonly typeLabel = TYPE_LABEL;

  protected readonly list = computed(() => {
    const q = norm(this.q().trim());
    const g = this.group();
    const base = this.mine() ? this.coach.available(this.store.profile()) : EXERCISES;
    const grp = MUSCLE_GROUPS.find((x) => x.id === g);
    return base.filter((e) => {
      if (q && !norm(e.nom + ' ' + e.muscles.map((m) => MUSCLE_LABEL[m]).join(' ')).includes(q)) return false;
      if (g === 'cardio' || g === 'mobilite') return e.type === g;
      if (grp) return e.type !== 'mobilite' && e.muscles.some((m) => grp.muscles.includes(m));
      return true;
    });
  });
}
