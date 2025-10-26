import { Component, Directive, Inject } from '@angular/core';
import { CommonModule, AsyncPipe, DecimalPipe } from '@angular/common';
import { IPlayerService } from '../../app/aplication/player.service';
import { Observable } from 'rxjs';
import { PlayerState } from '../../app/aplication/player.service';


@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DecimalPipe],
  template: `
    <div class="player-container" *ngIf="state$ | async as state">
      <div class="song-info" *ngIf="state.currentSong">
        <img [src]="state.currentSong.album.images[0]?.url" alt="Album Art">
        <div>
          <p class="song-title">{{ state.currentSong.name }}</p>
          <p class="song-artist">{{ state.currentSong.artists[0]?.name }}</p>
        </div>
      </div>
      <div *ngIf="!state.currentSong" class="song-info">
         <p>Selecciona una canción</p>
      </div>

      <div class="controls-container">
        <div class="controls">
          <button class="control-btn skip">⏪</button>
          <button class="control-btn play" (click)="togglePlayPause()">
            {{ state.isPlaying ? '⏸️' : '▶️' }}
          </button>
          <button class="control-btn skip">⏩</button>
        </div>

        <div class="progress-bar-container">
           <span>{{ state.currentTime | number:'1.0-0' }}s</span>
           <input
              type="range"
              min="0"
              max="100"
              [value]="state.progress"
              (input)="onSeek($event)"
              class="progress-bar">
           <span>{{ state.duration | number:'1.0-0' }}s</span>
        </div>
      </div>

      <div class="volume-controls">
        <span>🔊</span>
      </div>
    </div>
  `,
  styles: [`

    .player-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 25px;
      background-color: #efeae4; /* Color café claro */
      border-top: 1px solid #dcd3c9;
      color: #5d4037; /* Color café oscuro */
    }

    /* Info de la canción */
    .song-info { display: flex; align-items: center; min-width: 200px; }
    .song-info img { width: 50px; height: 50px; border-radius: 8px; margin-right: 15px; }
    .song-info p { margin: 0; }
    .song-title { font-weight: 600; }
    .song-artist { font-size: 0.85rem; }

    /* Controles */
    .controls-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-grow: 1;
    }
    .controls { display: flex; align-items: center; margin-bottom: 5px; }
    .control-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      margin: 0 10px;
      color: #8d6e63;
    }
    .control-btn.play {
      font-size: 1.8rem;
      color: #5d4037;
    }

    /* Barra de progreso */
    .progress-bar-container { display: flex; align-items: center; width: 100%; max-width: 400px; }
    .progress-bar-container span { font-size: 0.8rem; min-width: 30px; text-align: center;}
    .progress-bar {
      flex-grow: 1;
      margin: 0 10px;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      background: #dcd3c9;
      border-radius: 5px;
      outline: none;
    }
    .progress-bar::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #5d4037;
      cursor: pointer;
    }

    .volume-controls { min-width: 100px; text-align: right; }
  `]
})
export class PlayerBarComponent {
  public state$: Observable<PlayerState>;

  constructor(@Inject(IPlayerService) private playerService: IPlayerService) {
    this.state$ = this.playerService.getPlayerState();
  }

  togglePlayPause(): void {
    this.playerService.togglePlayPause();
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.playerService.seek(Number(input.value));
  }
}
