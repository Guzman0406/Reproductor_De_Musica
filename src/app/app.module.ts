import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app';

import { SongRepository } from './domain/ports/song.repository';
import { SpotifyAdapter } from './infrastructure/spotify/spotify.adapter';
import { AuthInterceptor } from './infrastructure/spotify/auth.interceptor';


import { HomePageComponent } from './presentation/pages/home-page/home-page';
import { SearchBarComponent } from './presentation/components/search-bar/search-bar';
import { SongDisplayComponent } from './presentation/components/song-display/song-display';
import { PlayerControlsComponent } from './presentation/components/player-controls/player-controls';
import { SearchResultsComponent } from './presentation/components/search-results/search-results';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SearchBarComponent,
    SongDisplayComponent,
    PlayerControlsComponent,
    SearchResultsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    {
      provide: SongRepository,
      useClass: SpotifyAdapter,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
