  import { Component } from '@angular/core';
  import { RouterOutlet } from '@angular/router';

  @Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // RouterOutlet es necesario
  template: '<router-outlet></router-outlet>' // Solo el router
})
export class AppComponent {
  title = 'reproductor-app';
}
