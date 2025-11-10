import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
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
  private songs = new BehaviorSubject<Song[]>([]);
  private artists = new BehaviorSubject<Artist[]>([]);
  private albums = new BehaviorSubject<Album[]>([]);
  private selectedAlbum = new BehaviorSubject<Album | null>(null);

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

  handleSearch(query: string): void {
    this.selectedAlbum.next(null);
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

  handleAlbumSelected(albumId: string): void {
    const selected = this.albums.getValue().find(a => a.id === albumId);
    this.selectedAlbum.next(selected || null);

    this.searchService.getAlbumTracks(albumId).subscribe(tracks => {
      this.songs.next(tracks);
    });
  }

  handleArtistSelected(artistId: string): void {
    this.selectedAlbum.next(null);

    forkJoin({
      tracks: this.searchService.getArtistTopTracks(artistId),
      albums: this.searchService.getArtistAlbums(artistId)
    }).subscribe(({ tracks, albums }) => {
      this.songs.next(tracks);
      this.albums.next(albums);
      window.scrollTo(0, 0);
    });
  }

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
