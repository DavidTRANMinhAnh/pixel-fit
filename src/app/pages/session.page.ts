import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MUSCLE_LABEL } from '../data/labels';
import { SessionItem, WorkoutLog } from '../models';
import { exById } from '../services/coach.service';
import { StoreService } from '../services/store.service';
import { beep } from '../ui/beep';
import { ExerciseDemo } from '../ui/exercise-demo';
import { PixelIcon } from '../ui/pixel-icon';

@Component({
  selector: 'px-session',
  imports: [RouterLink, ExerciseDemo, PixelIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (finished(); as f) {
      <section class="box accent center">
        <h1 class="win">STAGE CLEAR !</h1>
        <p class="pixel big">+{{ f.xp }} XP</p>
        <p>{{ f.sets }} séries validées en {{ f.durationMin }} min.</p>
        <label>Comment tu te sens ?</label>
        <div class="chips" style="justify-content:center">
          @for (n of [1, 2, 3, 4, 5]; track n) {
            <button class="chip" [class.on]="feeling() === n" (click)="setFeeling(n)">{{ moods[n - 1] }}</button>
          }
        </div>
        <a class="btn block" routerLink="/journal">Voir mon journal</a>
        <a class="btn block ghost" routerLink="/">Accueil</a>
      </section>
    } @else if (!s()) {
      <section class="box center">
        <h1>AUCUNE SÉANCE</h1>
        <p>Génère une séance depuis l'accueil, elle apparaîtra ici.</p>
        <a class="btn block" routerLink="/">★ Générer une séance</a>
      </section>
    } @else {
      <div class="head">
        <span class="pixel">{{ s()!.title.toUpperCase() }}</span>
        <span class="muted">{{ doneSets() }}/{{ totalSets() }} séries · {{ elapsed() }}</span>
      </div>
      <div class="bar"><i [style.width.%]="(100 * doneSets()) / totalSets()"></i></div>

      <div class="dots">
        @for (it of s()!.items; track $index; let i = $index) {
          <button
            class="dot"
            [class.cur]="i === s()!.current"
            [class.done]="isDone(it)"
            (click)="go(i)"
            [attr.aria-label]="'Exercice ' + (i + 1)"
          ></button>
        }
      </div>

      @if (item(); as it) {
        <section class="box">
          <div class="muted small">{{ blockLabel[it.block] }} · exo {{ s()!.current + 1 }}/{{ s()!.items.length }}</div>
          <h2 class="exname">{{ ex()?.nom }}</h2>
          <px-demo [exId]="it.exId" />
          <div class="tags">
            @for (m of ex()?.muscles; track m) {
              <span class="tag green">{{ muscleLabel[m] }}</span>
            }
          </div>

          <details class="howto">
            <summary>Comment faire le geste ?</summary>
            <ol>
              @for (c of ex()?.consignes; track $index) {
                <li>{{ c }}</li>
              }
            </ol>
          </details>

          <div class="sets">
            @for (set of it.log; track $index; let j = $index) {
              <div class="set" [class.ok]="set.done">
                <span class="pixel n">{{ j + 1 }}</span>
                <div class="field">
                  <button class="pm" (click)="adjust(j, 'value', ex()?.mode === 'temps' ? -5 : -1)">−</button>
                  <input
                    type="number"
                    inputmode="numeric"
                    [value]="set.value"
                    (change)="setField(j, 'value', $any($event.target).value)"
                  />
                  <button class="pm" (click)="adjust(j, 'value', ex()?.mode === 'temps' ? 5 : 1)">+</button>
                  <span class="unit">{{ ex()?.mode === 'temps' ? 's' : 'reps' }}</span>
                </div>
                @if (loaded()) {
                  <div class="field kg">
                    <input
                      type="number"
                      inputmode="decimal"
                      placeholder="kg"
                      [value]="set.weight ?? ''"
                      (change)="setField(j, 'weight', $any($event.target).value)"
                    />
                    <span class="unit">kg</span>
                  </div>
                }
                @if (ex()?.mode === 'temps' && !set.done) {
                  <button class="btn small blue" (click)="startWork(j, set.value)" aria-label="Lancer le chrono">
                    <px-icon name="clock" [size]="14" />
                  </button>
                }
                <button class="btn small" [class.ghost]="!set.done" (click)="toggleSet(j)" aria-label="Valider la série">
                  <px-icon name="check" [size]="14" />
                </button>
              </div>
            }
          </div>
          <p class="muted small">{{ it.reason }}</p>
          @if (last(); as l) {
            <p class="small">📜 La dernière fois : {{ l }}</p>
          }
        </section>

        <div class="nav">
          <button class="btn ghost" (click)="go(s()!.current - 1)" [disabled]="s()!.current === 0">◄ Préc.</button>
          @if (s()!.current < s()!.items.length - 1) {
            <button class="btn grow" (click)="go(s()!.current + 1)">Suivant ►</button>
          } @else {
            <button class="btn grow yellow" (click)="finish()">★ Terminer</button>
          }
        </div>
        <button class="btn block red small" (click)="abandon()">Abandonner la séance</button>
      }
    }

    @if (timer(); as t) {
      <div class="overlay" (click)="skipTimer()">
        <div class="box timer center">
          <div class="pixel label">{{ t.kind === 'rest' ? 'REPOS' : 'EFFORT' }}</div>
          <div class="pixel count" [class.hot]="t.left <= 3">{{ t.left }}</div>
          <div class="bar"><i [style.width.%]="(100 * t.left) / t.total"></i></div>
          @if (t.kind === 'rest' && nextName()) {
            <p class="muted">Ensuite : {{ nextName() }}</p>
          }
          <div class="row" style="justify-content:center">
            <button class="btn ghost small" (click)="addTime($event, 15)">+15 s</button>
            <button class="btn small" (click)="skipTimer()">Passer ►</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
    }
    .head .pixel {
      font-size: 11px;
      color: var(--yellow);
    }
    .dots {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 12px 4px 16px;
    }
    .dot {
      width: 16px;
      height: 16px;
      border: 3px solid var(--black);
      background: var(--panel);
      padding: 0;
    }
    .dot.done {
      background: var(--green);
    }
    .dot.cur {
      background: var(--yellow);
    }
    .exname {
      color: var(--ink);
      font-size: 12px;
      margin-top: 4px;
    }
    .tags {
      margin-top: 8px;
    }
    .howto summary {
      cursor: pointer;
      color: var(--cyan);
      margin: 6px 0;
    }
    .howto ol {
      margin: 4px 0 8px;
      padding-left: 22px;
    }
    .sets {
      margin: 12px 0;
    }
    .set {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px;
      margin-bottom: 6px;
      background: var(--panel2);
    }
    .set.ok {
      background: var(--teal);
    }
    .n {
      font-size: 10px;
      width: 18px;
    }
    .field {
      display: flex;
      align-items: center;
      gap: 3px;
      flex: 1;
      min-width: 0;
    }
    .field input {
      width: 100%;
      min-width: 36px;
      text-align: center;
      padding: 4px 2px;
    }
    .field.kg {
      flex: 0.8;
    }
    .pm {
      background: var(--black);
      color: var(--ink);
      border: none;
      width: 26px;
      height: 34px;
      font-size: 20px;
      flex: none;
    }
    .unit {
      color: var(--muted);
      font-size: 16px;
    }
    .nav {
      display: flex;
      gap: 8px;
    }
    .overlay {
      position: fixed;
      inset: 0;
      z-index: 20;
      background: rgba(13, 14, 23, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .timer {
      width: 100%;
      max-width: 360px;
    }
    .label {
      font-size: 12px;
      color: var(--cyan);
    }
    .count {
      font-size: 64px;
      margin: 16px 0;
      color: var(--lime);
    }
    .count.hot {
      color: var(--orange);
    }
    .win {
      color: var(--yellow);
      font-size: 18px;
    }
    .big {
      font-size: 20px;
      color: var(--lime);
    }
  `,
})
export class SessionPage {
  protected readonly store = inject(StoreService);
  private readonly router = inject(Router);

  protected readonly s = this.store.active;
  protected readonly item = computed(() => this.s()?.items[this.s()!.current]);
  protected readonly ex = computed(() => (this.item() ? exById(this.item()!.exId) : undefined));
  protected readonly loaded = computed(() => (this.ex()?.materiel ?? []).some((m) => !['corps', 'chaise'].includes(m)));
  protected readonly muscleLabel = MUSCLE_LABEL;
  protected readonly blockLabel: Record<string, string> = {
    echauffement: 'Échauffement',
    principal: 'Corps de séance',
    finisher: 'Finisher',
    retour: 'Retour au calme',
  };
  protected readonly moods = ['😵', '😓', '😐', '🙂', '😎'];

  protected readonly totalSets = computed(() => this.s()?.items.reduce((a, i) => a + i.log.length, 0) ?? 1);
  protected readonly doneSets = computed(
    () => this.s()?.items.reduce((a, i) => a + i.log.filter((l) => l.done).length, 0) ?? 0,
  );

  protected readonly now = signal(Date.now());
  protected readonly elapsed = computed(() => {
    const s = this.s();
    if (!s) return '';
    const sec = Math.max(0, Math.floor((this.now() - new Date(s.startedAt).getTime()) / 1000));
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  });

  protected readonly timer = signal<{ kind: 'rest' | 'work'; left: number; total: number; set?: number } | null>(null);
  protected readonly finished = signal<(WorkoutLog & { sets: number }) | null>(null);
  protected readonly feeling = signal(0);

  protected readonly nextName = computed(() => {
    const s = this.s();
    const it = this.item();
    if (!s || !it) return '';
    const remaining = it.log.some((l) => !l.done);
    if (remaining) return it ? `${exById(it.exId)?.nom} (série suivante)` : '';
    const nxt = s.items[s.current + 1];
    return nxt ? exById(nxt.exId)?.nom ?? '' : '';
  });

  /** Dernière performance enregistrée sur cet exercice. */
  protected readonly last = computed(() => {
    const id = this.item()?.exId;
    if (!id) return '';
    for (const w of this.store.history()) {
      const it = w.items.find((x) => x.exId === id);
      if (it) {
        const sets = it.sets.filter((x) => x.done);
        if (!sets.length) continue;
        const unit = exById(id)?.mode === 'temps' ? 's' : '';
        return sets.map((x) => `${x.value}${unit}${x.weight ? ' @' + x.weight + 'kg' : ''}`).join(' · ');
      }
    }
    return '';
  });

  constructor() {
    const t = setInterval(() => {
      this.now.set(Date.now());
      const tm = this.timer();
      if (!tm) return;
      const left = tm.left - 1;
      if (left <= 3 && left > 0) beep(660, 0.08);
      if (left <= 0) {
        beep(990, 0.25);
        navigator.vibrate?.(200);
        if (tm.kind === 'work' && tm.set !== undefined) this.markDone(tm.set, true);
        this.timer.set(null);
      } else {
        this.timer.set({ ...tm, left });
      }
    }, 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
  }

  protected isDone(it: SessionItem) {
    return it.log.every((l) => l.done);
  }

  private patchItem(fn: (it: SessionItem) => SessionItem) {
    const s = this.s();
    if (!s) return;
    const items = [...s.items];
    items[s.current] = fn(items[s.current]);
    this.store.active.set({ ...s, items });
  }

  setField(j: number, field: 'value' | 'weight', raw: string) {
    const v = raw === '' ? undefined : Math.max(0, Number(raw));
    this.patchItem((it) => ({
      ...it,
      log: it.log.map((l, k) => (k === j ? { ...l, [field]: field === 'value' ? (v ?? 0) : v } : l)),
    }));
  }

  adjust(j: number, field: 'value', delta: number) {
    this.patchItem((it) => ({
      ...it,
      log: it.log.map((l, k) => (k === j ? { ...l, value: Math.max(0, l.value + delta) } : l)),
    }));
  }

  private markDone(j: number, done: boolean) {
    this.patchItem((it) => ({
      ...it,
      log: it.log.map((l, k) => {
        if (k !== j) return l;
        // reporter la charge de la série précédente si rien n'est saisi
        const prevW = k > 0 ? it.log[k - 1].weight : undefined;
        return { ...l, done, weight: l.weight ?? (done ? prevW : undefined) };
      }),
    }));
  }

  toggleSet(j: number) {
    const it = this.item();
    if (!it) return;
    const done = !it.log[j].done;
    this.markDone(j, done);
    if (done) {
      beep(520, 0.06);
      const after = this.item()!;
      const allDone = after.log.every((l) => l.done);
      const s = this.s()!;
      const hasNext = s.current < s.items.length - 1;
      if (after.rest > 0 && (!allDone || hasNext) && after.block === 'principal') {
        this.timer.set({ kind: 'rest', left: after.rest, total: after.rest });
      } else if (allDone && hasNext) {
        this.go(s.current + 1);
      }
    }
  }

  startWork(j: number, seconds: number) {
    beep(880, 0.1);
    this.timer.set({ kind: 'work', left: seconds, total: seconds, set: j });
  }

  addTime(ev: Event, sec: number) {
    ev.stopPropagation();
    const t = this.timer();
    if (t) this.timer.set({ ...t, left: t.left + sec, total: t.total + sec });
  }

  skipTimer() {
    const t = this.timer();
    if (t?.kind === 'work' && t.set !== undefined) this.markDone(t.set, true);
    this.timer.set(null);
    // si toutes les séries sont faites, passer à l'exo suivant
    const it = this.item();
    const s = this.s();
    if (it && s && it.log.every((l) => l.done) && s.current < s.items.length - 1) this.go(s.current + 1);
  }

  go(i: number) {
    const s = this.s();
    if (!s || i < 0 || i >= s.items.length) return;
    this.store.active.set({ ...s, current: i });
    window.scrollTo({ top: 0 });
  }

  finish() {
    const s = this.s();
    if (!s) return;
    const sets = this.doneSets();
    if (sets === 0 && !window.confirm("Aucune série validée. Terminer quand même ?")) return;
    const durationMin = Math.max(1, Math.round((Date.now() - new Date(s.startedAt).getTime()) / 60000));
    const xp = sets * 10 + (sets > 0 ? 50 : 0);
    const log: WorkoutLog = {
      id: s.id,
      date: new Date().toISOString(),
      durationMin,
      title: s.title,
      focus: s.focus,
      items: s.items.map((i) => ({ exId: i.exId, sets: i.log })),
      xp,
    };
    if (sets > 0) this.store.addWorkout(log);
    this.store.active.set(null);
    this.timer.set(null);
    if (sets > 0) {
      beep(523, 0.12);
      setTimeout(() => beep(659, 0.12), 130);
      setTimeout(() => beep(784, 0.25), 260);
      this.finished.set({ ...log, sets });
    } else {
      this.router.navigateByUrl('/');
    }
  }

  setFeeling(n: number) {
    this.feeling.set(n);
    const f = this.finished();
    if (!f) return;
    this.store.history.update((h) => h.map((w) => (w.id === f.id ? { ...w, feeling: n } : w)));
  }

  abandon() {
    if (window.confirm('Abandonner la séance ? Rien ne sera enregistré.')) {
      this.store.active.set(null);
      this.timer.set(null);
    }
  }
}
