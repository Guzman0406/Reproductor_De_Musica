import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { PlayerService } from '../../../application/player.service';
import { SearchService } from '../../../application/search.service';
import { Album } from '../../../domain/models/album.model';
import { Artist } from '../../../domain/models/artist.model';
import { PlayerState, Song } from '../../../domain/models/song.model';
import { AlbumHeaderComponent } from '../../components/album-header/album-header';
import { PlayerControlsComponent } from '../../components/player-controls/player-controls';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { SearchResultsComponent } from '../../components/search-results/search-results';
import { SongDisplayComponent } from '../../components/song-display/song-display';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    SearchResultsComponent,
    SongDisplayComponent,
    PlayerControlsComponent,
    AlbumHeaderComponent,
  ],
})
export class HomePageComponent implements OnDestroy {
  // Subjects para mantener el estado
  private songs = new BehaviorSubject<Song[]>([]);
  private artists = new BehaviorSubject<Artist[]>([]);
  private albums = new BehaviorSubject<Album[]>([]);
  private selectedAlbum = new BehaviorSubject<Album | null>(null);

  // Observables públicos para la plantilla
  public songs$: Observable<Song[]> = this.songs.asObservable();
  public artists$: Observable<Artist[]> = this.artists.asObservable();
  public albums$: Observable<Album[]> = this.albums.asObservable();
  public selectedAlbum$: Observable<Album | null> = this.selectedAlbum.asObservable();

  public playerState?: PlayerState;
  private stateSubscription: Subscription;

  constructor(
    private searchService: SearchService,
    private playerService: PlayerService
  ) {
    this.stateSubscription = this.playerService
      .getState()
      .subscribe(state => (this.playerState = state));
  }

  // Maneja la búsqueda y actualiza los resultados
  handleSearch(query: string): void {
    this.selectedAlbum.next(null); // Limpia el header del álbum al buscar
    if (!query) {
      this.songs.next([]);
      this.artists.next([]);
      this.albums.next([]);
      return;
    }

    this.searchService.search(query).subscribe(results => {
      this.songs.next(results.songs);
      this.artists.next(results.artists);
      this.albums.next(results.albums);
    });
  }

  // Al seleccionar un álbum, busca sus canciones y lo establece como seleccionado
  handleAlbumSelected(albumId: string): void {
    // Busca el álbum completo en la lista actual para obtener sus detalles
    const selected = this.albums.getValue().find(a => a.id === albumId);
    this.selectedAlbum.next(selected || null);

    // Carga las canciones del álbum
    this.searchService.getAlbumTracks(albumId).subscribe(tracks => {
      this.songs.next(tracks);
      // Ya no se limpian los artistas y álbumes
    });
  }

  // Al seleccionar un artista, busca sus canciones más populares
  handleArtistSelected(artistId: string): void {
    // Limpia el álbum seleccionado cuando se selecciona un artista
    this.selectedAlbum.next(null);

    // Carga las canciones más populares del artista
    this.searchService.getArtistTopTracks(artistId).subscribe(tracks => {
      this.songs.next(tracks);
      window.scrollTo(0, 0);
    });
  }

  // Carga más recomendaciones de artistas
  handleLoadMore(): void {
    this.artists$
      .pipe(
        take(1),
        switchMap(currentArtists => {
          const seedArtistIds = currentArtists.slice(0, 5).map(a => a.id);
          if (seedArtistIds.length === 0) {
            return [];
          }
          return this.searchService.getRecommendations(seedArtistIds);
        }),
        tap(newArtists => {
          const currentArtists = this.artists.getValue();
          this.artists.next([...currentArtists, ...newArtists]);
        })
      )
      .subscribe();
  }

  // Carga la canción seleccionada en el reproductor
  handleSongSelected(song: Song): void {
    this.songs$
      .pipe(take(1))
      .subscribe(songs => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        if (songIndex !== -1) {
          this.playerService.loadPlaylist(songs, songIndex);
        }
      });
  }

  handleNext(): void {
    this.playerService.next();
  }

  handlePrevious(): void {
    this.playerService.previous();
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
  }
}
