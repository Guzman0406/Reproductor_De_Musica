import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { App } from './app';


import { SongRepository } from './domain/ports/song.repository';
import { SpotifyAdapter } from './infrastructure/spotify/spotify.adapter';
import { AuthInterceptor } from './infrastructure/spotify/auth.interceptor';

@NgModule({
  imports: [BrowserModule, App],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
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
})
export class AppModule {}
