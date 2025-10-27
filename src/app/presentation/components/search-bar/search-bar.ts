import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBarComponent {
  @Output() search = new EventEmitter<string>();
  public query: string = '';

  onSearch(): void {
    if (this.query.trim()) {
      this.search.emit(this.query);
    }
  }
}
