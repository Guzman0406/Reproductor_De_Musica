import { Component, Input } from '@angular/core';
import { Album } from '../../../domain/models/album.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-header',
  templateUrl: './album-header.html',
  styleUrls: ['./album-header.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AlbumHeaderComponent {
  @Input() album!: Album;
}
