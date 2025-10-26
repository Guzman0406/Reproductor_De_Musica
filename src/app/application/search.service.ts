import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from '../domain/models/song.model';
import { SongRepository } from '../domain/ports/song.repository';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private songRepository: SongRepository) {}

  // Caso de uso: Buscar canciones
  public searchSongs(query: string): Observable<Song[]> {
    return this.songRepository.search(query);
  }
}
