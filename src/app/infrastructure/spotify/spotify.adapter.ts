import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, map } from 'rxjs';
import { Album } from '../../domain/models/album.model';
import { Artist } from '../../domain/models/artist.model';
import { SearchResult } from '../../domain/models/search-result.model';
import { Song } from '../../domain/models/song.model';
import { SongRepository } from '../../domain/ports/song.repository';

// Tipos para la respuesta de la API de Spotify
interface SpotifySearchResponse {
  tracks: { items: SpotifyTrack[] };
  artists: { items: SpotifyArtist[] };
  albums: { items: SpotifyAlbum[] };
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album?: { // Album is optional, not present in all track objects
    id: string;
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
}

interface SpotifyRecommendationsResponse {
  tracks: SpotifyTrack[];
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyAdapter extends SongRepository {
  private apiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {
    super();
  }

  // Búsqueda unificada de canciones, artistas y álbumes
  override search(query: string): Observable<SearchResult> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track,artist,album')
      .set('limit', '10');

    return this.http.get<SpotifySearchResponse>(`${this.apiUrl}/search`, { params }).pipe(
      map(response => ({
        songs: this.mapToSongs(response.tracks.items),
        artists: this.mapToArtists(response.artists.items),
        albums: this.mapToAlbums(response.albums.items),
      }))
    );
  }

  // Obtener las canciones de un álbum específico
  override getAlbumTracks(albumId: string): Observable<Song[]> {
    const albumDetails$ = this.http.get<SpotifyAlbum>(`${this.apiUrl}/albums/${albumId}`);
    const albumTracks$ = this.http.get<{ items: SpotifyTrack[] }>(`${this.apiUrl}/albums/${albumId}/tracks`);

    return forkJoin([albumDetails$, albumTracks$]).pipe(
      map(([albumDetails, tracksResponse]) => {
        // Combina los detalles del álbum con cada pista
        return tracksResponse.items.map(track => ({
          id: track.id,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: albumDetails.name, // Usa el nombre del álbum de la primera llamada
          imageUrl: albumDetails.images[0]?.url || '', // Usa la imagen del álbum
          previewUrl: track.preview_url,
        }));
      })
    );
  }

  // Obtener recomendaciones basadas en artistas semilla
  override getRecommendations(artistIds: string[]): Observable<Artist[]> {
    const params = new HttpParams().set('seed_artists', artistIds.join(',')).set('limit', '20');

    return this.http
      .get<SpotifyRecommendationsResponse>(`${this.apiUrl}/recommendations`, { params })
      .pipe(
        map(response => {
          // Extraer artistas únicos de las pistas recomendadas
          const artists: Artist[] = [];
          const artistIds = new Set<string>();
          response.tracks.forEach(track => {
            track.artists.forEach(artist => {
              if (!artistIds.has(artist.id)) {
                artistIds.add(artist.id);
                artists.push({
                  id: artist.id,
                  name: artist.name,
                  imageUrl: track.album?.images[0]?.url || '', // Usar imagen del álbum como fallback
                });
              }
            });
          });
          return artists;
        })
      );
  }

  override getTrack(id: string): Observable<Song | null> {
    return this.http.get<SpotifyTrack>(`${this.apiUrl}/tracks/${id}`).pipe(
      map(track => {
        if (!track) return null;
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map(a => a.name).join(', '),
          album: track.album?.name || '',
          imageUrl: track.album?.images[0]?.url || '',
          previewUrl: track.preview_url,
        };
      })
    );
  }

  override getArtistTopTracks(artistId: string): Observable<Song[]> {
    // El mercado es requerido, puedes ajustarlo según tu necesidad
    const params = new HttpParams().set('market', 'ES');

    return this.http
      .get<{ tracks: SpotifyTrack[] }>(`${this.apiUrl}/artists/${artistId}/top-tracks`, { params })
      .pipe(
        map(response => this.mapToSongs(response.tracks))
      );
  }

  private mapToSongs(items: SpotifyTrack[]): Song[] {
    return items.map(item => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map(a => a.name).join(', '),
      album: item.album?.name || '',
      imageUrl: item.album?.images[0]?.url || '',
      previewUrl: item.preview_url,
    }));
  }

  private mapToArtists(items: SpotifyArtist[]): Artist[] {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      imageUrl: item.images[0]?.url || '',
    }));
  }

  private mapToAlbums(items: SpotifyAlbum[]): Album[] {
    return items.map(item => ({
      id: item.id,
      name: item.name,
      artist: item.artists.map(a => a.name).join(', '),
      imageUrl: item.images[0]?.url || '',
    }));
  }
}
