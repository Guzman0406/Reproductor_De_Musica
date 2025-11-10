import { Component, Input } from '@angular/core';
import { Song } from '../../../domain/models/song.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-song-display',
  templateUrl: './song-display.html',
  styleUrls: ['./song-display.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SongDisplayComponent {
  @Input() currentSong: Song | null = null;
}
