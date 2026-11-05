import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ASK, BY_GOAL, CONTROL } from '../data/tips';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'px-fuel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>CARBURANT</h1>
    <p class="muted">
      Tu ne choisis pas les menus ? Pas de souci. Pas de régime ni de calories ici : seulement ce qui reste sous ton
      contrôle.
    </p>

    <section class="box accent">
      <h2>► EAU DU JOUR</h2>
      <div class="glasses">
        @for (g of glasses; track g) {
          <button class="glass" [class.full]="g < water()" (click)="setWater(g)" [attr.aria-label]="'Verre ' + (g + 1)">
            <i></i>
          </button>
        }
      </div>
      <p class="center">
        {{ water() }} / 8 verres · ~{{ (water() * 0.25).toFixed(2).replace('.', ',') }} L
        @if (water() >= 8) {
          <span class="ok">· QUÊTE RÉUSSIE ★</span>
        }
      </p>

      <label>Sommeil la nuit dernière</label>
      <div class="chips">
        @for (h of [5, 6, 7, 8, 9]; track h) {
          <button class="chip" [class.on]="sleep() === h" (click)="setSleep(h)">{{ h === 5 ? '≤5' : h === 9 ? '9+' : h }} h</button>
        }
      </div>
      @if (sleep() && sleep()! < 7) {
        <p class="small warn">Nuit courte : si tu t'entraînes aujourd'hui, choisis l'énergie « Crevé » ou une séance plus courte.</p>
      }
    </section>

    @if (goalTip(); as t) {
      <section class="box">
        <h3 class="pixel">{{ t.icon }} {{ t.title }}</h3>
        <p>{{ t.text }}</p>
      </section>
    }

    <h2>► CE QUE TU CONTRÔLES</h2>
    @for (c of control; track c.title) {
      <section class="box dark">
        <h3 class="pixel">{{ c.icon }} {{ c.title }}</h3>
        <p>{{ c.text }}</p>
      </section>
    }

    <h2>► BONUS</h2>
    <section class="box dark">
      <ul>
        @for (a of ask; track $index) {
          <li>{{ a }}</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .glasses {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 6px;
    }
    .glass {
      height: 44px;
      background: var(--black);
      border: 3px solid var(--muted);
      border-top: none;
      padding: 3px;
      display: flex;
      align-items: flex-end;
    }
    .glass i {
      display: block;
      width: 100%;
      height: 0;
    }
    .glass.full i {
      height: 100%;
      background: repeating-linear-gradient(0deg, var(--sky) 0 6px, var(--cyan) 6px 8px);
    }
    h3 {
      color: var(--yellow);
    }
    .ok {
      color: var(--lime);
    }
    .warn {
      color: var(--orange);
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 8px;
    }
  `,
})
export class FuelPage {
  private readonly store = inject(StoreService);
  protected readonly glasses = [0, 1, 2, 3, 4, 5, 6, 7];
  protected readonly control = CONTROL;
  protected readonly ask = ASK;
  protected readonly water = computed(() => this.store.today().water);
  protected readonly sleep = computed(() => this.store.today().sleep);
  protected readonly goalTip = computed(() => BY_GOAL[this.store.profile()?.goal ?? 'forme']);

  setWater(i: number) {
    // toucher le dernier verre plein le vide, sinon remplit jusqu'à ce verre
    this.store.setToday({ water: i + 1 === this.water() ? i : i + 1 });
  }

  setSleep(h: number) {
    this.store.setToday({ sleep: h });
  }
}
