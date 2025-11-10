import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Album } from '../../../domain/models/album.model';
import { Artist } from '../../../domain/models/artist.model';
import { Song } from '../../../domain/models/song.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SearchResultsComponent {
  @Input() songs: Song[] = [];
  @Input() artists: Artist[] = [];
  @Input() albums: Album[] = [];

  @Output() songSelected = new EventEmitter<Song>();
  @Output() albumSelected = new EventEmitter<string>();
  @Output() artistSelected = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter<void>();

  // Emite la canción seleccionada
  onSongClick(song: Song): void {
    this.songSelected.emit(song);
  }

  // Emite el ID del álbum seleccionado
  onAlbumClick(album: Album): void {
    this.albumSelected.emit(album.id);
    window.scrollTo(0, 0);
  }

  // Emite el ID del artista seleccionado
  onArtistClick(artist: Artist): void {
    this.artistSelected.emit(artist.id);
  }

  // Detecta el scroll para el "infinite scroll"
  @HostListener('window:scroll')
  onScroll(): void {
    // Si el usuario llega casi al final de la página, emite el evento para cargar más
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      this.loadMore.emit();
    }
  }
}
