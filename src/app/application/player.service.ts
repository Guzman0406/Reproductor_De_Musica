import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerState, Song } from '../domain/models/song.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private state: PlayerState = {
    playlist: [],
    currentSong: null,
    currentIndex: -1,
  };

  private state$ = new BehaviorSubject<PlayerState>(this.state);

// Caso de uso: Obtener el estado del reproductor
  public getState(): Observable<PlayerState> {
    return this.state$.asObservable();
  }

  // Caso de uso: Cargar una lista de canciones
  public loadPlaylist(songs: Song[], startIndex: number = 0): void {
    this.state.playlist = songs;
    this.playSongAtIndex(startIndex);
  }

  // Caso de uso: Reproducir la siguiente canción
  public next(): void {
    const nextIndex = (this.state.currentIndex + 1) % this.state.playlist.length;
    if (!isNaN(nextIndex)) {
      this.playSongAtIndex(nextIndex);
    }
  }

  // Caso de uso: Reproducir la canción anterior
  public previous(): void {
    let prevIndex = this.state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.state.playlist.length - 1; // Vuelve al final
    }
    this.playSongAtIndex(prevIndex);
  }

  // Caso de uso: Reproducir la canción por indice (indice: numero de la cancion)
  private playSongAtIndex(index: number): void {
    if (this.state.playlist[index]) {
      this.state.currentIndex = index;
      this.state.currentSong = this.state.playlist[index];
      this.updateState();
    }
  }

  // Caso de uso: Actualizar el estado del reproductor
  private updateState(): void {
    this.state$.next({ ...this.state });
  }
}
