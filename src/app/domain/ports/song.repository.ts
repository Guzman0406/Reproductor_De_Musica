import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

export abstract class SongRepository {
  abstract search(query: string): Observable<Song[]>;
  abstract getTrack(id: string): Observable<Song | null>;
}
