import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { take } from 'rxjs/operators';

//import { PlayerService } from 'src/app/application/player.service';
import { PlayerService} from '../../../application/player.service';

//import { SearchService } from 'src/app/application/search.service';
import { SearchService} from '../../../application/search.service';

//import { PlayerState, Song } from 'src/app/domain/models/song.model';
import { PlayerState, Song} from '../../../domain/models/song.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html', // Corregido
  styleUrls: ['./home-page.scss'], // Corregido
})
export class HomePageComponent implements OnDestroy {
  public searchResults$: Observable<Song[]>;
  public playerState: PlayerState | undefined;
  private stateSubscription: Subscription;

  constructor(
    private searchService: SearchService,
    private playerService: PlayerService
  ) {
    this.stateSubscription = this.playerService
      .getState()
      .subscribe(state => (this.playerState = state));

    this.searchResults$ = of([]); // Usamos of([]) para un valor inicial
  }


  handleSearch(query: string): void {
    this.searchResults$ = this.searchService.searchSongs(query);
  }

  handleSongSelected(index: number): void {
    this.searchResults$.pipe(take(1)).subscribe(songs => {
      if (songs && songs.length > index) {
        this.playerService.loadPlaylist(songs, index);
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
