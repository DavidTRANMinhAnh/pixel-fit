import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StoreService } from './services/store.service';
import { PixelIcon } from './ui/pixel-icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PixelIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="top">
      <a routerLink="/" class="logo pixel">PIXEL<span>FIT</span></a>
      <a routerLink="/journal" class="lvl pixel" aria-label="Niveau et XP">
        <span>NIV {{ store.level() }}</span>
        <span class="xp"><i [style.width.%]="(100 * store.levelProgress().current) / store.levelProgress().needed"></i></span>
      </a>
    </header>

    <main>
      <router-outlet />
    </main>

    <nav class="tabs">
      <a routerLink="/" routerLinkActive="on" [routerLinkActiveOptions]="{ exact: true }">
        <px-icon name="home" /><span>Accueil</span>
      </a>
      <a routerLink="/seance" routerLinkActive="on" [class.live]="store.active()">
        <px-icon name="play" /><span>Séance</span>
      </a>
      <a routerLink="/exos" routerLinkActive="on"><px-icon name="book" /><span>Exos</span></a>
      <a routerLink="/journal" routerLinkActive="on"><px-icon name="chart" /><span>Journal</span></a>
      <a routerLink="/carburant" routerLinkActive="on"><px-icon name="drop" /><span>Carbu</span></a>
      <a routerLink="/profil" routerLinkActive="on"><px-icon name="user" /><span>Profil</span></a>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      max-width: 560px;
      margin: 0 auto;
      min-height: 100dvh;
    }
    .top {
      position: sticky;
      top: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px 10px;
      padding-top: calc(12px + env(safe-area-inset-top));
      background: var(--bg);
      border-bottom: 4px solid var(--black);
    }
    .logo {
      font-size: 14px;
      color: var(--lime);
      text-decoration: none;
      text-shadow: 3px 3px 0 var(--black);
    }
    .logo span {
      color: var(--yellow);
    }
    .lvl {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      font-size: 8px;
      color: var(--cyan);
      text-decoration: none;
    }
    .xp {
      width: 80px;
      height: 8px;
      background: var(--black);
      border: 2px solid var(--black);
    }
    .xp i {
      display: block;
      height: 100%;
      background: var(--cyan);
    }
    main {
      padding: 16px 12px calc(96px + env(safe-area-inset-bottom));
    }
    .tabs {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      display: flex;
      justify-content: center;
      background: var(--panel2);
      border-top: 4px solid var(--black);
      padding-bottom: env(safe-area-inset-bottom);
    }
    .tabs a {
      flex: 1;
      max-width: 94px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 9px 0 8px;
      color: var(--dim);
      text-decoration: none;
      font-size: 17px;
    }
    .tabs a.on {
      color: var(--lime);
      background: var(--panel);
    }
    .tabs a.live {
      color: var(--orange);
    }
    .tabs a.live px-icon {
      animation: blink 1s steps(2) infinite;
    }
  `,
})
export class App {
  protected readonly store = inject(StoreService);
}
