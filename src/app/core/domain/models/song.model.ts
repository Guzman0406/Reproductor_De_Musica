export interface Artist {
  id: string;
  name: string;
}

export interface Album {
    id: string;
    title: string;
    images: { url: string; height: number; width: number }[];
}

export interface Song {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  preview_url: string; 
}