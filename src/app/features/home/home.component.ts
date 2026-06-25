import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { MenuService } from '../../core/services/menu.service';
import { LanguageService } from '../../core/services/language.service';
import { CategoryCardComponent } from '../../shared/components/category-card/category-card.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryCardComponent, LoaderComponent],
  template: `
    <section class="home-page">
      <!-- Hero banner -->
      <div class="home-hero container">
        <div class="hero-text">
          <h1 class="hero-title animate-fade-up">
            @if (langService.currentLang() === 'ar') {
              <span lang="ar">أهلاً بك في</span>
              <span class="hero-brand" lang="ar">كافيه نوتيلا</span>
            } @else {
              <span>Welcome to</span>
              <span class="hero-brand">Nuttela Café</span>
            }
          </h1>
          <p class="hero-subtitle animate-fade-up">
            {{ langService.currentLang() === 'ar'
                ? 'اختر من قائمتنا الفاخرة'
                : 'Explore our luxury menu' }}
          </p>
        </div>
        <div class="hero-stats animate-fade-up">
          <div class="stat">
            <span class="stat-number">{{ menuService.categories().length }}</span>
            <span class="stat-label">{{ langService.currentLang() === 'ar' ? 'قسم' : 'Categories' }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">{{ totalItems() }}</span>
            <span class="stat-label">{{ langService.currentLang() === 'ar' ? 'صنف' : 'Items' }}</span>
          </div>
        </div>
      </div>

      <!-- Category grid -->
      @if (menuService.categories().length === 0) {
        <div class="container">
          <app-loader />
        </div>
      } @else {
        <div class="categories-grid container stagger" role="list" aria-label="Menu categories">
          @for (cat of menuService.categories(); track cat.id; let i = $index) {
            <div role="listitem">
              <app-category-card [category]="cat" [index]="i" />
            </div>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .home-page {
      padding-bottom: var(--space-12);
    }

    /* ---- Hero ---- */
    .home-hero {
      padding-block: var(--space-8) var(--space-6);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--space-6);
      flex-wrap: wrap;
    }

    .hero-text {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .hero-title {
      display: flex;
      flex-direction: column;
      font-size: var(--font-size-2xl);
      font-weight: 300;
      color: var(--text-secondary);
      line-height: 1.1;
      margin: 0;
      gap: var(--space-1);
    }

    .hero-brand {
      font-size: var(--font-size-3xl);
      font-weight: 800;
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-gold) 60%, var(--color-orange) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
    }

    .hero-subtitle {
      color: var(--text-muted);
      font-size: var(--font-size-base);
      margin: 0;
      animation-delay: 100ms;
    }

    /* Stats */
    .hero-stats {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-4) var(--space-6);
      animation-delay: 200ms;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .stat-number {
      font-size: var(--font-size-2xl);
      font-weight: 800;
      color: var(--color-gold);
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: var(--border-subtle);
    }

    /* ---- Grid ---- */
    .categories-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 480px) {
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (min-width: 900px)   {
      .categories-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (min-width: 1200px) {
      .categories-grid { grid-template-columns: repeat(4, 1fr); }
    }
  `]
})
export class HomeComponent {
  readonly menuService = inject(MenuService);
  readonly langService = inject(LanguageService);

  readonly totalItems = computed(() =>
    this.menuService.categories().reduce((sum, c) => sum + c.items.length, 0)
  );
}
