import { Observable } from "rxjs";
import { Playlist } from "../models/playlist.model";

export abstract class ISpotifyRepository {

    abstract getPlaylistById(id: string): Observable<Playlist>;
    abstract getFeaturedPlaylists(): Observable<any>;

}