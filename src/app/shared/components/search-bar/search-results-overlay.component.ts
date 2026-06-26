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
    <div
      class="overlay-backdrop animate-fade-in"
      (click)="close.emit()"
      role="dialog"
      aria-modal="true"
      aria-label="Search results"
    >
      <div class="overlay-panel" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="overlay-header">
          <div class="overlay-header-left">
            <span class="results-count-num">{{ results().length }}</span>
            <span class="results-count-text">
              {{ langService.currentLang() === 'ar' ? 'نتيجة لـ' : 'results for' }}
              "{{ query() }}"
            </span>
          </div>
          <button class="close-btn" (click)="close.emit()" aria-label="Close search">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        @if (results().length === 0) {
          <div class="no-results">
            <div class="no-results-icon">∅</div>
            <p class="no-results-text">{{ langService.currentLang() === 'ar' ? 'لا توجد نتائج' : 'No items found' }}</p>
            <p class="no-results-hint">{{ langService.currentLang() === 'ar' ? 'حاول البحث بكلمة أخرى' : 'Try a different keyword' }}</p>
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
                  <div class="result-price">
                    <span class="result-price-val">{{ getStartingPrice(result.item) }}</span>
                    <span class="result-price-cur">{{ menuService.currency() }}</span>
                  </div>
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
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 90px;
      padding-inline: var(--space-4);
      backdrop-filter: blur(4px);
    }

    .overlay-panel {
      width: 100%;
      max-width: 560px;
      max-height: 72dvh;
      overflow-y: auto;
      background: rgba(16,16,16,0.95);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-float);
      padding: var(--space-4);
      animation: fadeSlideDown 0.25s ease both;
    }

    .overlay-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--border-subtle);
    }

    .overlay-header-left {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
    }

    .results-count-num {
      font-size: var(--font-size-lg);
      font-weight: 800;
      color: var(--color-gold);
      line-height: 1;
    }

    .results-count-text {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    .close-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      min-width: 44px;
      min-height: 44px;
    }

    .close-btn:hover {
      color: var(--text-primary);
      background: rgba(255,255,255,0.09);
    }

    /* No results */
    .no-results {
      text-align: center;
      padding: var(--space-10) var(--space-8);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }

    .no-results-icon {
      font-size: 32px;
      color: var(--text-muted);
      opacity: 0.5;
      margin-bottom: var(--space-2);
    }

    .no-results-text {
      font-size: var(--font-size-md);
      font-weight: 600;
      color: var(--text-secondary);
    }

    .no-results-hint {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }

    /* Results list */
    .results-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .result-link {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-3);
      border-radius: var(--radius-lg);
      border: 1px solid transparent;
      transition: all var(--transition-fast);
      cursor: pointer;
    }

    .result-link:hover {
      background: rgba(255,255,255,0.04);
      border-color: var(--border-subtle);
    }

    .result-icon {
      font-size: 22px;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }

    .result-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
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
      display: flex;
      align-items: baseline;
      gap: 2px;
      flex-shrink: 0;
    }

    .result-price-val {
      font-size: var(--font-size-md);
      font-weight: 800;
      color: var(--color-gold);
    }

    .result-price-cur {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      font-weight: 500;
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
