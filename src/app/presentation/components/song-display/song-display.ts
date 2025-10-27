import { Component, Input } from '@angular/core';
//import { Song } from 'src/app/domain/models/song.model';
import { Song} from '../../../domain/models/song.model';

@Component({
  selector: 'app-song-display',
  templateUrl: './song-display.html',
  styleUrls: ['./song-display.scss'],
})
export class SongDisplayComponent {
  @Input() currentSong: Song | null = null;
}
