import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Song } from "../core/domain/models/song.model";

export type PlayerState = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
};

export abstract class IPlayerService {
  abstract getPlayerState(): Observable<PlayerState>;
  abstract playSong(song: Song): void;
  abstract togglePlayPause(): void;
  abstract seek(progress: number): void;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends IPlayerService {
  private audio = new Audio();

  private initialState: PlayerState = {
    currentSong: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
  };

  private state$ = new BehaviorSubject<PlayerState>(this.initialState);

  constructor() {
    super();
    this.addAudioListeners();
  }

  private addAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.stop());
    this.audio.addEventListener('loadedmetadata', () => {
      this.updateState({ 
        duration: this.audio.duration,
        currentTime: 0,
        progress: 0
      });
    });
  }

  private updateState(newState: Partial<PlayerState>): void {
    this.state$.next({ ...this.state$.value, ...newState });
  }

  private updateProgress(): void {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.updateState({
      progress: isNaN(progress) ? 0 : progress,
      currentTime: this.audio.currentTime
    });
  }

  private stop(): void {
    this.audio.pause();
    this.updateState({ isPlaying: false, progress: 0, currentTime: 0 });
  }

  override getPlayerState(): Observable<PlayerState> {
    return this.state$.asObservable();
  }

  override playSong(song: Song): void {
    // Si es la misma canción, solo hacemos play/pause
    if (this.state$.value.currentSong?.id === song.id) {
      this.togglePlayPause();
      return;
    }

    // Es una canción nueva
    this.audio.src = song.preview_url;
    this.audio.load();
    this.audio.play();
    this.updateState({ currentSong: song, isPlaying: true });
  }

  override togglePlayPause(): void {
    if (!this.state$.value.currentSong) return;

    if (this.state$.value.isPlaying) {
      this.audio.pause();
      this.updateState({ isPlaying: false });
    } else {
      this.audio.play();
      this.updateState({ isPlaying: true });
    }
  }

  override seek(progress: number): void {
    if (!this.state$.value.currentSong) return;

    const newTime = (progress / 100) * this.audio.duration;
    if (!isNaN(newTime)) {
      this.audio.currentTime = newTime;
    }
  }
}