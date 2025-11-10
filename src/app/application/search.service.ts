import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artist } from '../domain/models/artist.model';
import { SearchResult } from '../domain/models/search-result.model';
import { Song } from '../domain/models/song.model';
import { SongRepository } from '../domain/ports/song.repository';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private songRepository: SongRepository) {}

  // Caso de uso: Buscar canciones, artistas y álbumes
  public search(query: string): Observable<SearchResult> {
    return this.songRepository.search(query);
  }

  // Caso de uso: Obtener las canciones de un álbum
  public getAlbumTracks(albumId: string): Observable<Song[]> {
    return this.songRepository.getAlbumTracks(albumId);
  }

  // Caso de uso: Obtener recomendaciones de artistas
  public getRecommendations(artistIds: string[]): Observable<Artist[]> {
    return this.songRepository.getRecommendations(artistIds);
  }
}
