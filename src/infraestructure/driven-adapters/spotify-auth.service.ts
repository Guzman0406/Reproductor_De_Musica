import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment.development';

interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

@Injectable({
    providedIn: 'root'
})
export class SpotifyAuthService {

    private tokenUrl = 'https://accounts.spotify.com/api/token';
    private accessToken$: Observable<string>;

    constructor(private http: HttpClient) {
        this.accessToken$ = this.requestAccessToken();
    }

    public getAccessToken(): Observable<string> {
        return this.accessToken$;
    }

    private requestAccessToken(): Observable<string> {
        const { clienteId, clientSecret } = environment.spotify;
        const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + btoa(`${clienteId}:${clientSecret}`) });
        const body = new HttpParams().set('grant_type', 'client_credentials');

        return this.http.post<SpotifyTokenResponse>(this.tokenUrl, body.toString(), { headers }).pipe(map(response => response.access_token), shareReplay(1));
    }
}