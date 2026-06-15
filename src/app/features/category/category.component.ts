import {
  Component, inject, input, OnInit,
  ChangeDetectionStrategy, signal, computed
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MenuService } from '../../core/services/menu.service';
import { LanguageService } from '../../core/services/language.service';
import { MenuItem } from '../../core/models/menu.model';
import { ItemCardComponent } from '../../shared/components/item-card/item-card.component';
import { ItemModalComponent } from '../../shared/components/item-modal/item-modal.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-category',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ItemCardComponent, ItemModalComponent, LoaderComponent, RouterLink],
  template: `
    <section class="category-page">
      <!-- Sticky sub-header -->
      <div class="cat-header glass-card">
        <div class="cat-header-inner container">
          <a
            class="back-btn"
            routerLink="/"
            id="back-to-home"
            [attr.aria-label]="langService.currentLang() === 'ar' ? 'العودة للرئيسية' : 'Back to home'"
          >
            <span class="back-arrow" aria-hidden="true">←</span>
            <span class="back-label">
              {{ langService.currentLang() === 'ar' ? 'الرئيسية' : 'Home' }}
            </span>
          </a>

          @if (category()) {
            <div class="cat-title-wrap">
              <span class="cat-icon" aria-hidden="true">{{ category()!.icon }}</span>
              <div class="cat-names">
                @if (langService.currentLang() === 'ar') {
                  <h1 class="cat-title" lang="ar">{{ category()!.nameAr }}</h1>
                } @else {
                  <h1 class="cat-title" lang="en">{{ category()!.nameEn }}</h1>
                }
              </div>
            </div>
            <span class="item-count-chip">
              {{ category()!.items.length }}
              {{ langService.currentLang() === 'ar' ? 'صنف' : 'items' }}
            </span>
          }
        </div>
      </div>

      <!-- Items grid -->
      <div class="items-section container">
        @if (!category()) {
          @if (menuService.categories().length === 0) {
            <app-loader />
          } @else {
            <!-- Not found in data -->
            <div class="not-found-state">
              <span>🔍</span>
              <p>{{ langService.currentLang() === 'ar' ? 'القسم غير موجود' : 'Category not found' }}</p>
              <a class="go-home-btn" routerLink="/">
                {{ langService.currentLang() === 'ar' ? 'العودة للرئيسية' : 'Go to Home' }}
              </a>
            </div>
          }
        } @else {
          <div class="items-grid stagger" role="list">
            @for (item of availableItems(); track item.id) {
              <div role="listitem">
                <app-item-card
                  [item]="item"
                  [currency]="menuService.currency()"
                  (cardClick)="openModal($event)"
                />
              </div>
            }
            @for (item of unavailableItems(); track item.id) {
              <div role="listitem">
                <app-item-card
                  [item]="item"
                  [currency]="menuService.currency()"
                  (cardClick)="openModal($event)"
                />
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- Item modal -->
    @if (selectedItem()) {
      <app-item-modal
        [item]="selectedItem()"
        [currency]="menuService.currency()"
        (close)="closeModal()"
      />
    }
  `,
  styles: [`
    .category-page {
      padding-bottom: var(--space-12);
    }

    /* ---- Sub-header ---- */
    .cat-header {
      position: sticky;
      top: 61px; /* height of main header */
      z-index: 90;
      border-radius: 0;
      border-inline: none;
      border-top: none;
      border-bottom: 1px solid var(--border-subtle);
      padding-block: var(--space-3);
    }

    .cat-header-inner {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    /* Back button */
    .back-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-muted);
      font-size: var(--font-size-sm);
      font-weight: 500;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
      transition: all var(--transition-fast);
      text-decoration: none;
      flex-shrink: 0;
      min-height: 44px;
    }

    .back-btn:hover {
      color: var(--text-primary);
      border-color: var(--border-glow);
      background: var(--surface-glass);
    }

    .back-arrow {
      font-size: var(--font-size-md);
      transition: transform var(--transition-fast);
    }

    .back-btn:hover .back-arrow {
      transform: translateX(-3px);
    }

    [dir="rtl"] .back-arrow {
      display: inline-block;
      transform: scaleX(-1);
    }
    [dir="rtl"] .back-btn:hover .back-arrow {
      transform: scaleX(-1) translateX(-3px);
    }

    /* Category title */
    .cat-title-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex: 1;
      min-width: 0;
    }

    .cat-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .cat-names { min-width: 0; }

    .cat-title {
      font-size: var(--font-size-lg);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Item count chip */
    .item-count-chip {
      font-size: var(--font-size-xs);
      font-weight: 600;
      color: var(--text-muted);
      background: var(--surface-2);
      padding: 4px 10px;
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    /* ---- Items grid ---- */
    .items-section {
      padding-top: var(--space-6);
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-4);
    }

    @media (min-width: 640px) {
      .items-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (min-width: 900px) {
      .items-grid { grid-template-columns: repeat(4, 1fr); }
    }

    /* Not found state */
    .not-found-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      padding: var(--space-16);
      color: var(--text-muted);
    }

    .not-found-state span { font-size: 48px; }
    .not-found-state p { font-size: var(--font-size-lg); }

    .go-home-btn {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
      color: var(--color-secondary);
      font-weight: 700;
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-full);
      font-size: var(--font-size-base);
      transition: opacity var(--transition-fast);
      text-decoration: none;
    }
    .go-home-btn:hover { opacity: 0.85; }
  `]
})
export class CategoryComponent implements OnInit {
  // Route param via input binding (requiresWithComponentInputBinding)
  readonly id = input<string>('');

  readonly menuService = inject(MenuService);
  readonly langService = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  readonly selectedItem = signal<MenuItem | null>(null);

  readonly category = computed(() => {
    const numId = parseInt(this.id(), 10);
    if (isNaN(numId)) return undefined;
    return this.menuService.getCategoryById(numId);
  });

  readonly availableItems = computed(() =>
    (this.category()?.items ?? []).filter(i => i.isAvailable)
  );

  readonly unavailableItems = computed(() =>
    (this.category()?.items ?? []).filter(i => !i.isAvailable)
  );

  ngOnInit(): void {
    // Set page title once data is available
    const cat = this.category();
    if (cat) {
      const lang = this.langService.currentLang();
      const name = lang === 'ar' ? cat.nameAr : cat.nameEn;
      this.titleService.setTitle(`${name} — Nuttela Café`);
    }
  }

  openModal(item: MenuItem): void {
    if (!item.isAvailable) return;
    this.selectedItem.set(item);
  }

  closeModal(): void {
    this.selectedItem.set(null);
  }
}
