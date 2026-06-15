import { Component, inject, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="search-wrapper" [class.expanded]="isFocused()">
      <label class="sr-only" for="search-input">
        {{ langService.currentLang() === 'ar' ? 'البحث في القائمة' : 'Search the menu' }}
      </label>
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input
        id="search-input"
        class="search-input"
        type="search"
        [placeholder]="langService.currentLang() === 'ar' ? 'ابحث في القائمة...' : 'Search menu...'"
        [value]="inputValue()"
        (input)="onInput($event)"
        (focus)="isFocused.set(true)"
        (blur)="isFocused.set(false)"
        autocomplete="off"
      />
      @if (inputValue()) {
        <button class="clear-btn" (click)="clear()" aria-label="Clear search">✕</button>
      }
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: var(--surface-2);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      transition: all var(--transition-base);
      width: 160px;
    }

    .search-wrapper.expanded {
      width: 200px;
      border-color: var(--border-glow);
      box-shadow: 0 0 0 3px rgba(167,47,51,0.12);
    }

    .search-icon {
      position: absolute;
      inset-inline-start: 10px;
      font-size: 13px;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      padding: 8px 32px 8px 32px;
      font-family: inherit;
      min-height: 36px;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-input::-webkit-search-cancel-button {
      display: none;
    }

    .clear-btn {
      position: absolute;
      inset-inline-end: 8px;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 11px;
      padding: 4px;
      border-radius: 50%;
      transition: color var(--transition-fast);
    }

    .clear-btn:hover { color: var(--text-accent); }

    @media (max-width: 480px) {
      .search-wrapper { width: 130px; }
      .search-wrapper.expanded { width: 160px; }
    }
  `]
})
export class SearchBarComponent {
  readonly langService = inject(LanguageService);
  readonly searchChange = output<string>();

  readonly inputValue = signal('');
  readonly isFocused = signal(false);

  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => this.searchChange.emit(query));
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.inputValue.set(value);
    this.searchSubject.next(value);
  }

  clear(): void {
    this.inputValue.set('');
    this.searchSubject.next('');
  }
}
