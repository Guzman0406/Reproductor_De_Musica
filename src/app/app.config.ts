import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; 
import { SpotifyAuthInterceptor } from '../infraestructure/driven-adapters/spotify-auth.interceptor';
import { ISpotifyRepository } from './core/domain/ports/spotify.repository';
import { SpotifyApiService } from '../infraestructure/driven-adapters/spotify-api.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // Habilita HttpClient
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpotifyAuthInterceptor,
      multi: true
    },
    { provide: ISpotifyRepository, useClass: SpotifyApiService}
  ]
};
