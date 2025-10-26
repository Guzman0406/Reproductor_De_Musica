import { Observable } from "rxjs";
import { Song } from "../models/song.model";

export interface PlayerState {
    currentSong: Song | null;
    isPlaying: boolean;
    progress: number; // De 0 a 100
    duration: number; // En segundos
    currentTime: number; // En segundos
}

export abstract class IPlayerService {

    abstract getPlayerState(): Observable<PlayerState>;
    abstract playSong(song: Song): void;
    abstract tooglePlayPause(): void;
    abstract seek (progress: number): void; // progreso de 0 a 100

}

    