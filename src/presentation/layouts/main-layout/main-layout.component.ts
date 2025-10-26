import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerBarComponent } from '../../components/player-bar/player-bar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component'; 

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, PlayerBarComponent, SidebarComponent], // Importa el PlayerBar
  template: `
    <div class="main-layout">
      <aside class="sidebar">
        <h2>Playlists</h2>
        <nav>
          </nav>
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>

      <app-player-bar class="player-bar"></app-player-bar>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; background-color: #fdfaf6; }
    .main-layout {
      display: grid;
      grid-template-areas:
        "sidebar content"
        "player-bar player-bar";
      grid-template-rows: 1fr auto;
      grid-template-columns: 250px 1fr;
      height: 100%;
    }
    .sidebar {
      grid-area: sidebar;
      background-color: #f5f0e8;
      padding: 20px;
    }
    .content {
      grid-area: content;
      overflow-y: auto;
      padding: 20px;
    }
    .player-bar {
      grid-area: player-bar;
    }
  `]
})
export class MainLayoutComponent {}
