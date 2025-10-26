import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, switchMap, take, filter } from 'rxjs';
import { SpotifyAuthService } from './spotify-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: SpotifyAuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!request.url.includes('api.spotify.com')) {
      return next.handle(request);
    }

    // Obtiene el token
    return this.authService.getAccessToken().pipe(
      filter(token => token !== null), // Espera hasta que el token no sea nulo
      take(1), // Toma el primer valor no nulo
      switchMap((token) => {
        // Clona la petición y añade el header de autorización
        const authReq = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(authReq);
      })
    );
  }
}
