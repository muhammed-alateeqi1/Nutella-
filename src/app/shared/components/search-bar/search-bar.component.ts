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
    <div class="search-wrapper" [class.focused]="isFocused()">
      <label class="sr-only" for="search-input">
        {{ langService.currentLang() === 'ar' ? 'البحث في القائمة' : 'Search the menu' }}
      </label>

      <!-- SVG Search Icon -->
      <span class="search-icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      </span>

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
        <button class="clear-btn" (click)="clear()" aria-label="Clear search">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </button>
      }
    </div>
  `,
  styles: [`
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius-full);
      transition: all var(--transition-smooth);
      width: 168px;
    }

    .search-wrapper.focused {
      width: 220px;
      background: rgba(255,255,255,0.06);
      border-color: rgba(180,135,102,0.30);
      box-shadow:
        0 0 0 3px rgba(180,135,102,0.10),
        0 4px 16px rgba(0,0,0,0.3);
    }

    .search-icon {
      position: absolute;
      inset-inline-start: 12px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      pointer-events: none;
      transition: color var(--transition-base);
    }

    .search-wrapper.focused .search-icon {
      color: var(--color-accent);
    }

    .search-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      padding: 9px 32px 9px 36px;
      font-family: inherit;
      min-height: 38px;
      letter-spacing: 0.01em;
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-input::-webkit-search-cancel-button {
      display: none;
    }

    .clear-btn {
      position: absolute;
      inset-inline-end: 10px;
      background: rgba(255,255,255,0.06);
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
    }

    .clear-btn:hover {
      color: var(--text-primary);
      background: rgba(255,255,255,0.10);
    }

    @media (max-width: 480px) {
      .search-wrapper { width: 130px; }
      .search-wrapper.focused { width: 170px; }
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
