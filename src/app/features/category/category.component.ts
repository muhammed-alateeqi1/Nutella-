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

      <!-- ── Sticky sub-header ── -->
      <div class="cat-header-wrap">
        <div class="cat-header-pill container">
          <a
            class="back-btn"
            routerLink="/"
            id="back-to-home"
            [attr.aria-label]="langService.currentLang() === 'ar' ? 'العودة للرئيسية' : 'Back to home'"
          >
            <svg class="back-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 13L5 8L10 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="back-label">
              {{ langService.currentLang() === 'ar' ? 'الرئيسية' : 'Home' }}
            </span>
          </a>

          @if (category()) {
            <div class="breadcrumb-sep" aria-hidden="true">/</div>
            <div class="cat-title-wrap">
              <span class="cat-icon" aria-hidden="true">{{ category()!.icon }}</span>
              <div class="cat-names">
                @if (langService.currentLang() === 'ar') {
                  <span class="cat-title" lang="ar">{{ category()!.nameAr }}</span>
                } @else {
                  <span class="cat-title" lang="en">{{ category()!.nameEn }}</span>
                }
              </div>
            </div>
            <span class="item-count-chip" aria-hidden="true">
              {{ category()!.items.length }}
              {{ langService.currentLang() === 'ar' ? 'صنف' : 'items' }}
            </span>
          }
        </div>
      </div>

      <!-- ── Category hero ── -->
      @if (category()) {
        <div class="cat-hero container">
          <div class="cat-hero-icon-wrap">
            <span class="cat-hero-icon" aria-hidden="true">{{ category()!.icon }}</span>
            <div class="cat-hero-glow"></div>
          </div>
          <div class="cat-hero-text">
            <h1 class="cat-hero-title animate-fade-up">
              @if (langService.currentLang() === 'ar') {
                <span lang="ar">{{ category()!.nameAr }}</span>
              } @else {
                <span lang="en">{{ category()!.nameEn }}</span>
              }
            </h1>
            <p class="cat-hero-sub animate-fade-up">
              @if (langService.currentLang() === 'ar') {
                <span lang="en">{{ category()!.nameEn }}</span>
              } @else {
                <span lang="ar">{{ category()!.nameAr }}</span>
              }
              <span class="cat-hero-count">
                · {{ category()!.items.length }} {{ langService.currentLang() === 'ar' ? 'صنف' : 'items' }}
              </span>
            </p>
          </div>
        </div>
      }

      <!-- ── Items grid ── -->
      <div class="items-section container">
        @if (!category()) {
          @if (menuService.categories().length === 0) {
            <app-loader />
          } @else {
            <div class="not-found-state">
              <div class="not-found-icon">∅</div>
              <p class="not-found-title">{{ langService.currentLang() === 'ar' ? 'القسم غير موجود' : 'Category not found' }}</p>
              <a class="go-home-btn" routerLink="/">
                {{ langService.currentLang() === 'ar' ? 'العودة للرئيسية' : 'Back to Home' }}
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
      padding-bottom: var(--space-20);
    }

    /* ─────────────────── Sub-header ─────────────────── */
    .cat-header-wrap {
      position: sticky;
      top: 72px; /* below floating navbar */
      z-index: 90;
      padding-block: var(--space-3);
      /* Soft top blur that blends with page */
      background: linear-gradient(to bottom, rgba(9,9,9,0.92) 60%, transparent 100%);
      backdrop-filter: blur(12px);
    }

    .cat-header-pill {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    /* Back button */
    .back-btn {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-muted);
      font-size: var(--font-size-sm);
      font-weight: 600;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
      background: rgba(255,255,255,0.03);
      transition: all var(--transition-smooth);
      text-decoration: none;
      flex-shrink: 0;
      min-height: 36px;
    }

    .back-btn:hover {
      color: var(--text-primary);
      border-color: var(--border-glow);
      background: rgba(180,135,102,0.08);
    }

    .back-icon {
      transition: transform var(--transition-smooth);
    }

    .back-btn:hover .back-icon {
      transform: translateX(-3px);
    }

    [dir="rtl"] .back-icon {
      transform: scaleX(-1);
    }
    [dir="rtl"] .back-btn:hover .back-icon {
      transform: scaleX(-1) translateX(-3px);
    }

    .breadcrumb-sep {
      color: var(--border-medium);
      font-size: var(--font-size-sm);
      font-weight: 300;
    }

    /* Category in breadcrumb */
    .cat-title-wrap {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex: 1;
      min-width: 0;
    }

    .cat-icon {
      font-size: 18px;
      flex-shrink: 0;
    }

    .cat-title {
      font-size: var(--font-size-base);
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Item count chip */
    .item-count-chip {
      font-size: var(--font-size-xs);
      font-weight: 700;
      color: var(--color-accent);
      background: rgba(180,135,102,0.10);
      border: 1px solid rgba(180,135,102,0.18);
      padding: 3px 10px;
      border-radius: var(--radius-full);
      flex-shrink: 0;
      white-space: nowrap;
    }

    /* ─────────────────── Hero ─────────────────── */
    .cat-hero {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      padding-block: var(--space-10) var(--space-8);
    }

    .cat-hero-icon-wrap {
      position: relative;
      flex-shrink: 0;
    }

    .cat-hero-icon {
      font-size: 72px;
      display: block;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
    }

    .cat-hero-glow {
      position: absolute;
      inset: -20px;
      background: radial-gradient(circle, rgba(180,135,102,0.15) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .cat-hero-text {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      min-width: 0;
    }

    .cat-hero-title {
      font-size: clamp(var(--font-size-2xl), 5vw, var(--font-size-4xl));
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
      line-height: 1.1;
      animation-delay: 0ms;
    }

    .cat-hero-sub {
      font-size: var(--font-size-base);
      color: var(--text-muted);
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      animation-delay: 60ms;
      flex-wrap: wrap;
    }

    .cat-hero-count {
      color: var(--color-accent);
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .cat-hero { flex-direction: column; align-items: flex-start; gap: var(--space-4); padding-block: var(--space-6) var(--space-4); }
      .cat-hero-icon { font-size: 48px; }
    }

    /* ─────────────────── Items Grid ─────────────────── */
    .items-section {
      padding-top: var(--space-2);
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-5);
    }

    @media (min-width: 640px) {
      .items-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (min-width: 900px) {
      .items-grid { grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }
    }

    /* Not found state */
    .not-found-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-4);
      padding: var(--space-24);
      color: var(--text-muted);
    }

    .not-found-icon {
      font-size: 40px;
      opacity: 0.4;
    }

    .not-found-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-secondary);
    }

    .go-home-btn {
      display: inline-flex;
      align-items: center;
      background: rgba(180,135,102,0.12);
      border: 1px solid rgba(180,135,102,0.25);
      color: var(--color-accent);
      font-weight: 700;
      padding: var(--space-3) var(--space-6);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      transition: all var(--transition-smooth);
      text-decoration: none;
    }

    .go-home-btn:hover {
      background: rgba(180,135,102,0.20);
      border-color: rgba(180,135,102,0.40);
    }
  `]
})
export class CategoryComponent implements OnInit {
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
