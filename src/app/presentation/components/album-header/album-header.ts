import { Component, Input } from '@angular/core';
import { Album } from '../../../domain/models/album.model';

@Component({
  selector: 'app-album-header',
  templateUrl: './album-header.html',
  styleUrls: ['./album-header.scss'],
  standalone: false,
})
export class AlbumHeaderComponent {
  @Input() album!: Album;
}
