import {Song } from './song.model';

export interface Playlist {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks:{
        total: number;
        items : { track: Song }[];
    };
}