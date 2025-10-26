import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { map, Observable } from 'rxjs';
import { Playlist } from '../../app/core/domain/models/playlist.model';
import { ISpotifyRepository } from '../../app/core/domain/ports/spotify.repository';

@Injectable({
  providedIn: 'root'
})
export class SpotifyApiService extends ISpotifyRepository {
  private baseUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {
    super();
  }

  override getPlaylistById(id: string): Observable<Playlist> {
    
    return this.http.get<Playlist>(`${this.baseUrl}/playlists/${id}`).pipe(
      map(playlist => ({
        ...playlist,
        tracks: {
          ...playlist.tracks,
          items: playlist.tracks.items.filter(item => item.track && item.track.preview_url) 
        }
      }))
    );
  }

  override getFeaturedPlaylists(): Observable<any> {
    // Endpoint para descubrir playlists
    return this.http.get<{ playlists: { items: Playlist[] } }>(`${this.baseUrl}/browse/featured-playlists?country=MX&limit=10`).pipe(
      map(response => response.playlists.items)
    );
  }
}