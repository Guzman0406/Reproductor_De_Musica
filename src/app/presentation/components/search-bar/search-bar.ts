import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Componente de la barra de busqueda
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})

// Clase de la barra de busqueda
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  @Output() querySuggestion = new EventEmitter<string>();

  public query: string = '';
  private querySubject = new Subject<string>();

  constructor() {
    this.querySubject
      .pipe(
        debounceTime(300), // espera 300 ms para agrupar tecleo y evitar llamadas innecesarias
        distinctUntilChanged()
      )
      .subscribe((query) => {
        if (query.trim().length >= 2) {
          this.querySuggestion.emit(query);
        }
      });
  }

  onSearch(): void {
    if (this.query.trim()) {
      this.search.emit(this.query);
    }
  }

  onQueryChange(): void {
    this.querySubject.next(this.query);
  }
}
