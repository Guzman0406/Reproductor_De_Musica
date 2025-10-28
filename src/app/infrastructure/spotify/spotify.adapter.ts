import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
//import { Song } from 'src/app/domain/models/song.model';
import  { Song} from '../../domain/models/song.model';
//import { SongRepository } from 'src/app/domain/ports/song.repository';
import {  SongRepository} from '../../domain/ports/song.repository';

// Tipos para la respuesta de la API de Spotify
interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyAdapter extends SongRepository {
  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {
    super();
  }

  // Implementación del método de búsqueda
  override search(query: string): Observable<Song[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', '20');

    // Realizar la solicitud a la API de Spotify
    return this.http
      .get<SpotifySearchResponse>(`${this.apiUrl}/search`, { params })
      .pipe(map(response => this.mapToSongs(response.tracks.items)));
  }


  // Implementación del método para obtener una canción por su ID
  override getTrack(id: string): Observable<Song | null> {
    return this.http.get<SpotifyTrack>(`${this.apiUrl}/tracks/${id}`).pipe(
      map(track => {
        if (!track) return null;
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album.name,
          imageUrl: track.album.images[0]?.url || '',
          previewUrl: track.preview_url,
        };
      })
    );
  }

  // Limpia y organiza los datos devueltos para un formato sencillo de canciones
  private mapToSongs(items: SpotifyTrack[]): Song[] {
    return items.map(item => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map(a => a.name).join(', '),
      album: item.album.name,
      imageUrl: item.album.images[0]?.url || '',
      previewUrl: item.preview_url,
    }));
  }
}
