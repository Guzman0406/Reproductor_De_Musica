import { Album } from './album.model';
import { Artist } from './artist.model';
import { Song } from './song.model';

export interface SearchResult {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
}
