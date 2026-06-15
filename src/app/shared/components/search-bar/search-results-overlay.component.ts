import { Component, inject, input, output, ChangeDetectionStrategy, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { LanguageService } from '../../../core/services/language.service';
import { getStartingPrice } from '../../../core/models/menu.model';

@Component({
  selector: 'app-search-results-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="overlay-backdrop animate-fade-in" (click)="close.emit()" role="dialog" aria-modal="true" aria-label="Search results">
      <div class="overlay-panel glass-card" (click)="$event.stopPropagation()">
        <div class="overlay-header">
          <span class="results-count">
            {{ results().length }}
            {{ langService.currentLang() === 'ar' ? 'نتيجة لـ' : 'results for' }}
            "{{ query() }}"
          </span>
          <button class="close-btn" (click)="close.emit()" aria-label="Close search">✕</button>
        </div>

        @if (results().length === 0) {
          <div class="no-results">
            <span>😶</span>
            <p>{{ langService.currentLang() === 'ar' ? 'لا توجد نتائج' : 'No items found' }}</p>
          </div>
        } @else {
          <ul class="results-list" role="list">
            @for (result of results(); track result.item.id) {
              <li class="result-item">
                <a
                  class="result-link"
                  [routerLink]="['/category', result.category.id]"
                  (click)="close.emit()"
                >
                  <div class="result-icon">{{ result.category.icon }}</div>
                  <div class="result-info">
                    <span class="result-name">
                      {{ langService.currentLang() === 'ar' ? result.item.titleAr : result.item.titleEn }}
                    </span>
                    <span class="result-cat">
                      {{ langService.currentLang() === 'ar' ? result.category.nameAr : result.category.nameEn }}
                    </span>
                  </div>
                  <span class="result-price price-badge">
                    {{ getStartingPrice(result.item) }} {{ menuService.currency() }}
                  </span>
                </a>
              </li>
            }
          </ul>
        }
      </div>
    </div>
  `,
  styles: [`
    .overlay-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 80px;
      padding-inline: var(--space-4);
    }

    .overlay-panel {
      width: 100%;
      max-width: 560px;
      max-height: 70dvh;
      overflow-y: auto;
      padding: var(--space-4);
    }

    .overlay-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }

    .results-count {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .close-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: var(--font-size-md);
      padding: 4px 8px;
      border-radius: 50%;
      transition: color var(--transition-fast);
      min-width: 44px;
      min-height: 44px;
    }
    .close-btn:hover { color: var(--text-accent); }

    .no-results {
      text-align: center;
      padding: var(--space-8);
      color: var(--text-muted);
    }
    .no-results span { font-size: 32px; display: block; margin-bottom: var(--space-2); }

    .results-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .result-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    .result-link:hover {
      background: var(--surface-glass);
      border-color: var(--border-subtle);
    }

    .result-icon {
      font-size: 24px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-2);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }

    .result-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .result-name {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-cat {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .result-price {
      flex-shrink: 0;
    }
  `]
})
export class SearchResultsOverlayComponent {
  readonly query = input.required<string>();
  readonly close = output<void>();

  readonly menuService = inject(MenuService);
  readonly langService = inject(LanguageService);

  readonly results = computed(() => this.menuService.searchItems(this.query()));

  readonly getStartingPrice = getStartingPrice;
}
