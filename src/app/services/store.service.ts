import { Injectable, computed, effect, signal } from '@angular/core';
import { ActiveSession, DayLog, Profile, WorkoutLog } from '../models';

const KEY = 'pixelfit.v1';

interface SaveData {
  profile: Profile | null;
  history: WorkoutLog[];
  days: Record<string, DayLog>;
  active: ActiveSession | null;
}

function load(): SaveData {
  const empty: SaveData = { profile: null, history: [], days: {}, active: null };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function todayKey(d = new Date()): string {
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

/** Toutes les données de l'appli, gardées dans le navigateur (localStorage). */
@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly initial = load();

  readonly profile = signal<Profile | null>(this.initial.profile);
  readonly history = signal<WorkoutLog[]>(this.initial.history);
  readonly days = signal<Record<string, DayLog>>(this.initial.days);
  readonly active = signal<ActiveSession | null>(this.initial.active);

  readonly totalXp = computed(() => this.history().reduce((s, w) => s + w.xp, 0));
  readonly level = computed(() => Math.floor(Math.sqrt(this.totalXp() / 120)) + 1);
  readonly levelProgress = computed(() => {
    const l = this.level();
    const lo = 120 * (l - 1) ** 2;
    const hi = 120 * l ** 2;
    return { current: this.totalXp() - lo, needed: hi - lo };
  });

  readonly streakWeeks = computed(() => {
    // nombre de semaines consécutives (jusqu'à cette semaine) avec au moins une séance
    const weeks = new Set(this.history().map((w) => weekIndex(new Date(w.date))));
    let n = 0;
    let cur = weekIndex(new Date());
    if (!weeks.has(cur)) cur--;
    while (weeks.has(cur)) {
      n++;
      cur--;
    }
    return n;
  });

  readonly today = computed<DayLog>(() => this.days()[todayKey()] ?? { water: 0 });

  constructor() {
    effect(() => {
      const data: SaveData = {
        profile: this.profile(),
        history: this.history(),
        days: this.days(),
        active: this.active(),
      };
      try {
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch {
        /* stockage plein ou bloqué : on continue sans sauvegarder */
      }
    });
  }

  setToday(patch: Partial<DayLog>) {
    const k = todayKey();
    this.days.update((d) => ({ ...d, [k]: { ...(d[k] ?? { water: 0 }), ...patch } }));
  }

  addWorkout(w: WorkoutLog) {
    this.history.update((h) => [w, ...h]);
  }

  deleteWorkout(id: string) {
    this.history.update((h) => h.filter((w) => w.id !== id));
  }

  exportJson(): string {
    return JSON.stringify(
      { app: 'pixel-fit', version: 1, profile: this.profile(), history: this.history(), days: this.days() },
      null,
      1,
    );
  }

  importJson(text: string) {
    const d = JSON.parse(text);
    if (d.app !== 'pixel-fit') throw new Error('Fichier non reconnu');
    this.profile.set(d.profile ?? null);
    this.history.set(Array.isArray(d.history) ? d.history : []);
    this.days.set(d.days ?? {});
  }

  resetAll() {
    this.profile.set(null);
    this.history.set([]);
    this.days.set({});
    this.active.set(null);
  }
}

export function weekIndex(d: Date): number {
  // semaines qui commencent le lundi
  const day = (d.getDay() + 6) % 7;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - day);
  return Math.round(monday.getTime() / (7 * 86400000));
}
