import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ISpotifyRepository } from '../../../app/core/domain/ports/spotify.repositori';
import { Observable } from 'rxjs';
import { Playlist } from '../../../app/core/domain/models/playlist.model';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, RouterModule],
  template: `
    <h2>Playlists Destacadas</h2>
    <nav class="playlist-nav">
      <a *ngFor="let playlist of (playlists$ | async)"
         [routerLink]="['/playlist', playlist.id]"
         routerLinkActive="active-link"
         class="playlist-item">
        {{ playlist.name }}
      </a>
    </nav>
  `,
  styles: [`
    .playlist-nav { display: flex; flex-direction: column; gap: 8px; }
    .playlist-item {
      color: #5d4037;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: 500;
    }
    .playlist-item:hover { background-color: #dcd3c9; }
    .active-link { background-color: #dcd3c9; font-weight: 700; }
  `]
})
export class SidebarComponent implements OnInit {
  public playlists$!: Observable<Playlist[]>;

  constructor(@Inject(ISpotifyRepository) private spotifyRepo: ISpotifyRepository) {}

  ngOnInit(): void {
    this.playlists$ = this.spotifyRepo.getFeaturedPlaylists();
  }
}