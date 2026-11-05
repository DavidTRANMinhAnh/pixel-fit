import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EQUIPMENT_LABEL, GOAL_LABEL } from '../data/labels';
import { Equipment, Goal, Profile } from '../models';
import { StoreService } from '../services/store.service';

const DEFAULT: Profile = { pseudo: '', goal: 'muscle', level: 1, equipment: ['chaise'], daysPerWeek: 3 };

@Component({
  selector: 'px-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>{{ isNew ? 'CRÉE TON PERSO' : 'PROFIL' }}</h1>

    <section class="box">
      <label for="pseudo">Pseudo</label>
      <input id="pseudo" maxlength="16" [value]="p().pseudo" (input)="patch({ pseudo: $any($event.target).value })" />

      <label>Objectif principal</label>
      <div class="chips">
        @for (g of goals; track g) {
          <button class="chip" [class.on]="p().goal === g" (click)="patch({ goal: g })">{{ goalLabel[g] }}</button>
        }
      </div>

      <label>Niveau</label>
      <div class="chips">
        @for (l of [1, 2, 3]; track l) {
          <button class="chip" [class.on]="p().level === l" (click)="patch({ level: $any(l) })">{{ levels[l - 1] }}</button>
        }
      </div>
      <p class="muted small">{{ levelHelp[p().level - 1] }}</p>

      <label>Séances par semaine visées</label>
      <div class="chips">
        @for (d of [2, 3, 4, 5, 6]; track d) {
          <button class="chip" [class.on]="p().daysPerWeek === d" (click)="patch({ daysPerWeek: d })">{{ d }}</button>
        }
      </div>
    </section>

    <section class="box">
      <h2>► MON MATÉRIEL</h2>
      <p class="muted small">Le poids du corps est toujours inclus. Coche ce que tu as sous la main.</p>
      @for (e of equipments; track e) {
        <label class="check">
          <input type="checkbox" [checked]="p().equipment.includes(e)" (change)="toggleEq(e)" />
          {{ eqLabel[e] }}
        </label>
      }
    </section>

    <button class="btn block" (click)="save()">{{ isNew ? '▶ Commencer l’aventure' : '✔ Enregistrer' }}</button>
    @if (saved()) {
      <p class="center ok">Profil enregistré !</p>
    }

    @if (!isNew) {
      <section class="box dark">
        <h2>► SAUVEGARDE</h2>
        <p class="small muted">
          Tes données restent sur ce téléphone. Exporte-les de temps en temps pour ne rien perdre (changement de
          téléphone, cache vidé…).
        </p>
        <div class="row">
          <button class="btn small blue grow" (click)="exportData()">Exporter</button>
          <label class="btn small ghost grow imp">
            Importer
            <input type="file" accept="application/json,.json" (change)="importData($event)" hidden />
          </label>
        </div>
        <button class="btn block red small" (click)="reset()">Tout effacer</button>
      </section>
    }

    <section class="box dark credits small muted">
      <p>
        Images des exercices : <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener">Free Exercise DB</a>
        (domaine public). Polices : Press Start 2P et VT323 (SIL Open Font License).
      </p>
      <p>Cette appli ne remplace pas l'avis d'un médecin. En cas de douleur, arrête l'exercice.</p>
    </section>
  `,
  styles: `
    .check {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--ink);
      margin: 8px 0;
    }
    .check input {
      width: 24px;
      height: 24px;
      flex: none;
      accent-color: var(--green);
    }
    .ok {
      color: var(--lime);
    }
    .imp {
      margin: var(--px);
    }
    .credits a {
      color: var(--cyan);
    }
  `,
})
export class ProfilePage {
  private readonly store = inject(StoreService);
  private readonly router = inject(Router);

  protected readonly isNew = !this.store.profile();
  protected readonly p = signal<Profile>({ ...DEFAULT, ...this.store.profile() });
  protected readonly saved = signal(false);

  protected readonly goals: Goal[] = ['muscle', 'forme', 'force', 'mobilite'];
  protected readonly goalLabel = GOAL_LABEL;
  protected readonly levels = ['Débutant', 'Intermédiaire', 'Avancé'];
  protected readonly levelHelp = [
    "Tu reprends ou tu débutes : séances plus légères, exos simples.",
    "Tu t'entraînes régulièrement depuis quelques mois.",
    "Tu t'entraînes depuis plus d'un an et tu maîtrises les mouvements de base.",
  ];
  protected readonly equipments = (Object.keys(EQUIPMENT_LABEL) as Equipment[]).filter((e) => e !== 'corps');
  protected readonly eqLabel = EQUIPMENT_LABEL;

  patch(x: Partial<Profile>) {
    this.p.update((p) => ({ ...p, ...x }));
    this.saved.set(false);
  }

  toggleEq(e: Equipment) {
    const eq = this.p().equipment;
    this.patch({ equipment: eq.includes(e) ? eq.filter((x) => x !== e) : [...eq, e] });
  }

  save() {
    this.store.profile.set({ ...this.p(), pseudo: this.p().pseudo.trim() });
    this.saved.set(true);
    if (this.isNew) this.router.navigateByUrl('/');
  }

  exportData() {
    const blob = new Blob([this.store.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pixel-fit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  async importData(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      this.store.importJson(await file.text());
      this.p.set({ ...DEFAULT, ...this.store.profile() });
      window.alert('Données importées !');
    } catch {
      window.alert("Ce fichier n'est pas une sauvegarde Pixel Fit.");
    }
  }

  reset() {
    if (window.confirm('Effacer toutes tes données (profil, séances, XP) ? Impossible à annuler.')) {
      this.store.resetAll();
      this.router.navigateByUrl('/');
    }
  }
}
