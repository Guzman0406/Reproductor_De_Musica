import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from '../domain/models/album.model';
import { Artist } from '../domain/models/artist.model';
import { SearchResult } from '../domain/models/search-result.model';
import { Song } from '../domain/models/song.model';
import { SongRepository } from '../domain/ports/song.repository';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private songRepository: SongRepository) {}

  public search(query: string): Observable<SearchResult> {
    return this.songRepository.search(query);
  }

  public getAlbumTracks(albumId: string): Observable<Song[]> {
    return this.songRepository.getAlbumTracks(albumId);
  }

  public getRecommendations(artistIds: string[]): Observable<Artist[]> {
    return this.songRepository.getRecommendations(artistIds);
  }

  public getArtistTopTracks(artistId: string): Observable<Song[]> {
    return this.songRepository.getArtistTopTracks(artistId);
  }

  public getArtistAlbums(artistId: string): Observable<Album[]> {
    return this.songRepository.getArtistAlbums(artistId);
  }
}
