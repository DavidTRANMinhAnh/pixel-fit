import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FOCUS_LABEL, MUSCLE_GROUPS } from '../data/labels';
import { TIPS } from '../data/tips';
import { Focus, PlannedItem } from '../models';
import { CoachService, Plan, estimateMin, exById } from '../services/coach.service';
import { StoreService, weekIndex } from '../services/store.service';
import { PixelIcon } from '../ui/pixel-icon';

@Component({
  selector: 'px-home',
  imports: [RouterLink, PixelIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!store.profile()) {
      <section class="box accent center">
        <h1>BIENVENUE, JOUEUR 1</h1>
        <p>Crée ton perso : objectif, niveau et matériel dispo. L'appli choisira tes exos en fonction.</p>
        <a class="btn block" routerLink="/profil">▶ Créer mon perso</a>
      </section>
    } @else {
      <section class="hello">
        <h1>SALUT {{ store.profile()!.pseudo.toUpperCase() || 'CHAMPION' }} !</h1>
        <div class="stats">
          <div class="box dark stat">
            <px-icon name="dumbbell" />
            <b class="pixel">{{ weekCount() }}/{{ store.profile()!.daysPerWeek }}</b><span>cette semaine</span>
          </div>
          <div class="box dark stat">
            <px-icon name="flame" />
            <b class="pixel">{{ store.streakWeeks() }}</b><span>sem. d'affilée</span>
          </div>
          <div class="box dark stat">
            <px-icon name="star" />
            <b class="pixel">{{ store.totalXp() }}</b><span>XP total</span>
          </div>
        </div>
      </section>
    }

    @if (store.active()) {
      <a class="box resume" routerLink="/seance">
        <span class="pixel blink">▶</span>
        <span class="grow">Séance « {{ store.active()!.title }} » en cours. Touche pour reprendre.</span>
      </a>
    }

    <section class="box">
      <h2>► QUE FAIRE AUJOURD'HUI ?</h2>

      <label>Temps dispo</label>
      <div class="chips">
        @for (m of [15, 30, 45, 60]; track m) {
          <button class="chip" [class.on]="minutes() === m" (click)="minutes.set(m)">{{ m }} min</button>
        }
      </div>

      <label>Énergie</label>
      <div class="chips">
        <button class="chip" [class.on]="energy() === 1" (click)="energy.set(1)">😴 Crevé</button>
        <button class="chip" [class.on]="energy() === 2" (click)="energy.set(2)">🙂 Normal</button>
        <button class="chip" [class.on]="energy() === 3" (click)="energy.set(3)">🔥 En feu</button>
      </div>

      <label>Thème</label>
      <div class="chips">
        @for (f of focuses; track f) {
          <button class="chip" [class.on]="focus() === f" (click)="focus.set(f)">{{ focusLabel[f] }}</button>
        }
      </div>

      <button class="btn block yellow" (click)="generate()">★ Générer ma séance</button>
    </section>

    @if (plan(); as p) {
      <section class="box accent">
        <h2>► {{ p.title.toUpperCase() }} · ~{{ totalMin() }} MIN</h2>
        <p class="muted small">{{ p.why }}</p>
        @for (it of p.items; track it.exId + $index; let i = $index) {
          @if (i === 0 || p.items[i - 1].block !== it.block) {
            <h3 class="block-title">{{ blockLabel[it.block] }}</h3>
          }
          <div class="item">
            <a class="thumb" [routerLink]="['/exos', it.exId]">
              <img [src]="ex(it.exId)?.images?.[1]" [alt]="ex(it.exId)?.nom" loading="lazy" />
            </a>
            <div class="grow">
              <a class="name" [routerLink]="['/exos', it.exId]">{{ ex(it.exId)?.nom }}</a>
              <div class="dose">{{ doseText(it) }}</div>
              <div class="muted small">{{ it.reason }}</div>
            </div>
            <button class="btn ghost small" (click)="swap(i)" aria-label="Changer d'exercice">
              <px-icon name="swap" [size]="14" />
            </button>
          </div>
        }
        @if (p.items.length < 4) {
          <p class="small">Peu d'exercices possibles avec ton matériel. Ajoute du matériel dans ton profil pour plus de choix.</p>
        }
        <button class="btn block" (click)="start()">▶ Lancer la séance</button>
      </section>
    }

    <section class="box dark">
      <h2>► RÉCUP DES MUSCLES</h2>
      @for (g of groups; track g.id) {
        <div class="rec">
          <span>{{ g.label }}</span>
          <div class="bar grow" [class.warn]="groupRec(g.muscles) < 75" [class.bad]="groupRec(g.muscles) < 45">
            <i [style.width.%]="groupRec(g.muscles)"></i>
          </div>
          <span class="pct">{{ groupRec(g.muscles) }}%</span>
        </div>
      }
      <p class="muted small">Calculé à partir de tes séances des 4 derniers jours.</p>
    </section>

    <section class="box dark tip">
      <h3 class="pixel">💡 ASTUCE DU JOUR</h3>
      <p>{{ tip }}</p>
    </section>
  `,
  styles: `
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px 4px;
      color: var(--yellow);
      margin: 4px;
    }
    .stat b {
      font-size: 13px;
      color: var(--ink);
    }
    .stat span {
      font-size: 16px;
      color: var(--muted);
      text-align: center;
    }
    .resume {
      display: flex;
      gap: 12px;
      align-items: center;
      background: var(--orange);
      color: var(--black);
      text-decoration: none;
    }
    .block-title {
      color: var(--cyan);
      margin-top: 14px;
    }
    .item {
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 8px 0;
      border-bottom: 2px dashed var(--panel);
    }
    .thumb img {
      width: 72px;
      height: 48px;
      object-fit: cover;
      background: #fff;
      border: 3px solid var(--black);
      display: block;
    }
    .name {
      color: var(--ink);
      text-decoration: none;
      font-size: 21px;
    }
    .dose {
      color: var(--lime);
    }
    .rec {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 6px 0;
    }
    .rec span:first-child {
      width: 70px;
    }
    .pct {
      width: 46px;
      text-align: right;
      color: var(--muted);
    }
    .tip h3 {
      color: var(--yellow);
    }
  `,
})
export class HomePage {
  protected readonly store = inject(StoreService);
  private readonly coach = inject(CoachService);
  private readonly router = inject(Router);

  protected readonly minutes = signal(30);
  protected readonly energy = signal<1 | 2 | 3>(2);
  protected readonly focus = signal<Focus>('auto');
  protected readonly plan = signal<Plan | null>(null);

  protected readonly focuses: Focus[] = ['auto', 'full', 'haut', 'bas', 'gainage', 'cardio', 'mobilite'];
  protected readonly focusLabel = FOCUS_LABEL;
  protected readonly groups = MUSCLE_GROUPS;
  protected readonly blockLabel: Record<string, string> = {
    echauffement: '1. ÉCHAUFFEMENT',
    principal: '2. CORPS DE SÉANCE',
    finisher: '3. FINISHER',
    retour: '4. RETOUR AU CALME',
  };
  protected readonly tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];

  protected readonly weekCount = computed(() => {
    const w = weekIndex(new Date());
    return this.store.history().filter((h) => weekIndex(new Date(h.date)) === w).length;
  });

  protected readonly totalMin = computed(() => {
    const p = this.plan();
    if (!p) return 0;
    return Math.round(p.items.reduce((s, it) => s + estimateMin(it, exById(it.exId)!), 0));
  });

  protected ex = exById;

  protected groupRec(muscles: string[]): number {
    const r = this.coach.recovery();
    return Math.round(Math.min(...muscles.map((m) => r[m] ?? 100)));
  }

  protected doseText(it: PlannedItem): string {
    const e = exById(it.exId);
    const unit = e?.mode === 'temps' ? ' s' : ' reps';
    return `${it.sets} × ${it.target}${unit}` + (it.block === 'principal' ? ` · repos ${it.rest} s` : '');
  }

  generate() {
    this.plan.set(this.coach.generate({ minutes: this.minutes(), energy: this.energy(), focus: this.focus() }));
  }

  swap(i: number) {
    const p = this.plan();
    if (!p) return;
    const next = this.coach.swap(
      p.items[i],
      p.items.map((x) => x.exId),
    );
    if (!next) return;
    const items = [...p.items];
    items[i] = next;
    this.plan.set({ ...p, items });
  }

  start() {
    const p = this.plan();
    if (!p) return;
    if (this.store.active() && !confirmReplace()) return;
    this.store.active.set({
      id: crypto.randomUUID?.() ?? String(Date.now()),
      startedAt: new Date().toISOString(),
      focus: p.focus,
      minutes: this.minutes(),
      energy: this.energy(),
      title: p.title,
      current: 0,
      items: p.items.map((it) => ({
        ...it,
        log: Array.from({ length: it.sets }, () => ({ value: it.target, done: false })),
      })),
    });
    this.plan.set(null);
    this.router.navigateByUrl('/seance');
  }
}

function confirmReplace(): boolean {
  return window.confirm('Une séance est déjà en cours. La remplacer ?');
}
