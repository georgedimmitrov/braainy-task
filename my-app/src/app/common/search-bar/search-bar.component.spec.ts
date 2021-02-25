import { ChangeDetectionStrategy } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBarComponent],
    })
      .overrideComponent(SearchBarComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('performSearch should emit event search phrase and display matches', () => {
    const testSearchPhrase = 'some search phrase';
    spyOn(component.onSearchPhraseChange, 'emit');
    component.performSearch(testSearchPhrase);
    fixture.detectChanges();

    expect(component.onSearchPhraseChange.emit).toHaveBeenCalledWith(
      testSearchPhrase
    );
    expect(component.shouldDisplayMatches).toEqual(true);
  });

  it('clearSearch should clear searchPhrase', () => {
    const testSearchPhrase = 'some search phrase';
    component.searchPhrase = testSearchPhrase;
    component.clearSearch();
    expect(component.searchPhrase).toEqual('');
  });

  describe('search bar is rendered correctly', () => {
    beforeEach(() => {
      component.searchPhrase = 'test';
      component.shouldDisplayMatches = true;
      component.numberOfRecordsFound = 2;
      component.placeholder = 'test placeholder';
      fixture.detectChanges();
    });

    it('search bar renders placeholder', () => {
      const inputEl = element.querySelector('.searchbar-input');
      expect((inputEl as any).placeholder).toEqual('test placeholder');
    });

    it('search bar renders matches correctly', () => {
      const spanEl = element.querySelector('span');
      expect((spanEl as any).innerText).toEqual('2 Matches');
    });

    it('search bar renders as disabled when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();
      const inputEl = element.querySelector('.searchbar-input');
      expect((inputEl as any).disabled).toEqual(true);
    });
  });
});
