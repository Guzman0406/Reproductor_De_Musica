import { Observable } from 'rxjs';
import { Album } from '../models/album.model';
import { Artist } from '../models/artist.model';
import { SearchResult } from '../models/search-result.model';
import { Song } from '../models/song.model';

export abstract class SongRepository {
  abstract search(query: string): Observable<SearchResult>;
  abstract getTrack(id: string): Observable<Song | null>;
  abstract getAlbumTracks(albumId: string): Observable<Song[]>;
  abstract getRecommendations(artistIds: string[]): Observable<Artist[]>;
  abstract getArtistTopTracks(artistId: string): Observable<Song[]>;
}