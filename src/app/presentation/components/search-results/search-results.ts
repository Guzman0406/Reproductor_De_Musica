import { Component, EventEmitter, Input, Output } from '@angular/core';
//import { Song } from 'src/app/domain/models/song.model';
import { Song} from '../../../domain/models/song.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.scss'],
  standalone: false
})
export class SearchResultsComponent {
  @Input() songs: Song[] = [];
  @Output() songSelected = new EventEmitter<number>(); // Emite el índice

  onSongClick(index: number): void {
    this.songSelected.emit(index);
  }
}
