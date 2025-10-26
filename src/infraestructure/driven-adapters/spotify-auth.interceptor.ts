import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { SpotifyAuthService } from './spotify-auth.service';

@Injectable()
export class SpotifyAuthInterceptor implements HttpInterceptor {

  constructor(private authService: SpotifyAuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo intercepta las peticiones a la API de Spotify
    if (req.url.startsWith('https://api.spotify.com')) {
      return this.authService.getAccessToken().pipe(
        switchMap((token) => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(authReq);
        })
      );
    }
    // Deja pasar otras peticiones
    return next.handle(req);
  }
}