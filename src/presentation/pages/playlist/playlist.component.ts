import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable,switchMap } from 'rxjs';
import { Playlist } from '../../../app/core/domain/models/playlist.model';
import { ISpotifyRepository } from '../../../app/core/domain/ports/spotify.repositori';
import { IPlayerService } from '../../../app/aplication/player.service';
import { Song } from '../../../app/core/domain/models/song.model';


@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  template: `
    <div *ngIf="playlist$ | async as playlist" class="playlist-container">
      <header class="playlist-header">
        <img [src]="playlist.images[0]?.url" alt="Cover">
        <div>
          <h1>{{ playlist.name }}</h1>
          <p>{{ playlist.description }}</p>
        </div>
      </header>

      <ul class="song-list">
        <li *ngFor="let item of playlist.tracks.items; let i = index" 
            class="song-item"
            (click)="onPlaySong(item.track)">
          <span class="song-index">{{ i + 1 }}</span>
          <img [src]="item.track.album.images[2]?.url || item.track.album.images[0]?.url" alt="album">
          <div class="song-details">
            <span class="song-name">{{ item.track.name }}</span>
            <span class="song-artist">{{ item.track.artists[0]?.name }}</span>
          </div>
          <span class="song-duration">0:30</span>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .playlist-header { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 30px; }
    .playlist-header img { width: 200px; height: 200px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .playlist-header h1 { margin: 0; font-size: 3rem; color: #5d4037; }
    .playlist-header p { margin: 0; font-size: 1rem; color: #8d6e63; }

    .song-list { list-style: none; padding: 0; }
    .song-item { 
      display: flex; 
      align-items: center; 
      gap: 15px; 
      padding: 12px 10px; 
      border-radius: 8px; 
      cursor: pointer;
      color: #5d4037;
    }
    .song-item:hover { background-color: #f5f0e8; }
    .song-index { min-width: 20px; text-align: right; color: #8d6e63; }
    .song-item img { width: 40px; height: 40px; border-radius: 4px; }
    .song-details { display: flex; flex-direction: column; flex-grow: 1; }
    .song-name { font-weight: 500; }
    .song-artist { font-size: 0.9rem; color: #8d6e63; }
    .song-duration { font-size: 0.9rem; color: #8d6e63; }
  `]
})
export class PlaylistComponent implements OnInit {
  public playlist$!: Observable<Playlist>;

  constructor(
    private route: ActivatedRoute,
    @Inject(ISpotifyRepository) private spotifyRepo: ISpotifyRepository,
    @Inject(IPlayerService) private playerService: IPlayerService
  ) {}

  ngOnInit(): void {
    this.playlist$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.spotifyRepo.getPlaylistById(id);
      })
    );
  }

  onPlaySong(song: Song): void {
    this.playerService.playSong(song);
  }
}