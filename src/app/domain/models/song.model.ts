export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  imageUrl: string;
  previewUrl: string | null; // URL para previsualizar 30s
}

export interface PlayerState {
  playlist: Song[];
  currentSong: Song | null;
  currentIndex: number;
}
