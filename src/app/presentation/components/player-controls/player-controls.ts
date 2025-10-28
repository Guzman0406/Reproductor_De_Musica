import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.html',
  styleUrls: ['./player-controls.scss'],
  standalone: false
})

export class PlayerControlsComponent { // Clase del reproductor
  @Input() isPlaying: boolean = false; // Estado del reproductor
  @Output() previous = new EventEmitter<void>(); // canción anterior
  @Output() next = new EventEmitter<void>(); // siguiente canción
}
