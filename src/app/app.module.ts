import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app';

import { SongRepository } from './domain/ports/song.repository';
import { SpotifyAdapter } from './infrastructure/spotify/spotify.adapter';
import { AuthInterceptor } from './infrastructure/spotify/auth.interceptor';


import { HomePageComponent } from './presentation/pages/home-page/home-page';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    HomePageComponent,
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
