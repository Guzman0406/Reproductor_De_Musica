export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  previewUrl: string | null;
}

export interface PlayerState {
  playlist: Song[];
  currentSong: Song | null;
  currentIndex: number;
}
