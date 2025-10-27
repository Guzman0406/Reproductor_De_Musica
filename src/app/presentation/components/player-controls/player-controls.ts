import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.html',
  styleUrls: ['./player-controls.scss'],
  standalone: false
})
export class PlayerControlsComponent {
  @Input() isPlaying: boolean = false;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}
