import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  @Input()
  numberOfRecordsFound: string | number;

  @Input()
  placeholder: string;

  @Input()
  isLoading?: boolean;

  @Output()
  onSearchPhraseChange: EventEmitter<string> = new EventEmitter<string>();

  searchPhrase: string = '';

  shouldDisplayMatches: boolean = false;

  clearSearch(): void {
    if (this.searchPhrase !== '') {
      this.searchPhrase = '';
      this.performSearch(this.searchPhrase);
    }
  }

  performSearch(searchPhrase: string): void {
    this.onSearchPhraseChange.emit(searchPhrase);
    this.shouldDisplayMatches = searchPhrase !== '';
  }

  shouldDisableInput(): boolean {
    return this.isLoading ? this.isLoading : false;
  }

  setSearchPhrase(newSearchPhrase: string): void {
    this.searchPhrase = newSearchPhrase || '';
  }
}
