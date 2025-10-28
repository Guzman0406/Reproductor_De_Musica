import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

// Puerta estandar donde se piden canciones
export abstract class SongRepository {
  abstract search(query: string): Observable<Song[]>; //Buscar canciones por nombres
  abstract getTrack(id: string): Observable<Song | null>; // Pedir una canción por su numero
}
