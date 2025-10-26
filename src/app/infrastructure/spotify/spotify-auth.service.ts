import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
//import { environment } from 'src/environments/environment';
import { environment} from '../../../environments/environments';

interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  private authTokenUrl = 'https://accounts.spotify.com/api/token';
  private token$ = new BehaviorSubject<string | null>(null);

  private tokenRequest$: Observable<AuthToken> | null = null;

  constructor(private http: HttpClient) {}

  public getAccessToken(): Observable<string | null> {
    if (this.token$.value) {
      return this.token$.asObservable();
    }

    if (!this.tokenRequest$) {
      this.tokenRequest$ = this.requestNewToken().pipe(
        tap((token) => {
          this.token$.next(token.access_token);
          // Reinicia la solicitud cacheada cuando expire
          setTimeout(() => (this.tokenRequest$ = null), token.expires_in * 1000);
        }),
        shareReplay(1)
      );
    }

    this.tokenRequest$.subscribe(); // Inicia la solicitud
    return this.token$.asObservable();
  }

  private requestNewToken(): Observable<AuthToken> {
    const { clientId, clientSecret } = environment.spotify;
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    });

    const body = new HttpParams().set('grant_type', 'client_credentials');

    return this.http.post<AuthToken>(this.authTokenUrl, body.toString(), {
      headers,
    });
  }
}
