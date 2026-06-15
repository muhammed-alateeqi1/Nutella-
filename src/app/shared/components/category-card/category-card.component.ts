import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { MenuCategory } from '../../../core/models/menu.model';

// Category accent colors for variety in fallback tiles
const CATEGORY_ACCENTS = [
  '#580b0d', '#d4af37', '#80080c', '#c59b27',
  '#3a0204', '#8c7853', '#6b0d10', '#a27f2f',
  '#1e0406', '#aa8239', '#580b0d', '#d4af37'
];

@Component({
  selector: 'app-category-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a
      class="cat-card"
      [routerLink]="['/category', category().id]"
      [id]="'cat-card-' + category().id"
      [attr.aria-label]="
        (langService.currentLang() === 'ar' ? category().nameAr : category().nameEn)
        + ' — ' + category().items.length + ' items'
      "
    >
      <!-- Image or branded fallback tile -->
      <div class="cat-cover" [style.--accent]="accent()">
        @if (category().coverImage) {
          <img
            [src]="category().coverImage"
            [alt]="category().nameEn + ' cover'"
            loading="lazy"
            class="cover-img"
          />
        } @else {
          <div class="cover-fallback" [style.--accent]="accent()">
            <div class="fallback-noise"></div>
            <span class="cat-emoji" aria-hidden="true">{{ category().icon }}</span>
          </div>
        }

        <!-- Item count chip -->
        <span class="item-count">{{ category().items.length }}</span>
      </div>

      <!-- Card body -->
      <div class="cat-body">
        <div class="cat-names">
          @if (langService.currentLang() === 'ar') {
            <h2 class="cat-primary" lang="ar">{{ category().nameAr }}</h2>
            <p class="cat-secondary" lang="en">{{ category().nameEn }}</p>
          } @else {
            <h2 class="cat-primary" lang="en">{{ category().nameEn }}</h2>
            <p class="cat-secondary" lang="ar">{{ category().nameAr }}</p>
          }
        </div>
        <span class="cat-arrow" aria-hidden="true">→</span>
      </div>
    </a>
  `,
  styles: [`
    .cat-card {
      display: flex;
      flex-direction: column;
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
      text-decoration: none;
      color: inherit;
      position: relative;
    }

    .cat-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: var(--shadow-card), 0 0 32px rgba(167,47,51,0.2);
      border-color: var(--border-glow);
    }

    .cat-card:active {
      transform: scale(0.97);
    }

    /* ---- Cover ---- */
    .cat-cover {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
    }

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .cat-card:hover .cover-img {
      transform: scale(1.05);
    }

    .cover-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        var(--surface-1) 40%,
        var(--accent, var(--color-accent)) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    /* Subtle noise texture */
    .fallback-noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
      opacity: 0.3;
    }

    .cat-emoji {
      font-size: 48px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 2px 12px rgba(0,0,0,0.5));
      transition: transform var(--transition-slow);
    }

    .cat-card:hover .cat-emoji {
      transform: scale(1.15) rotate(-5deg);
    }

    /* Item count chip */
    .item-count {
      position: absolute;
      bottom: var(--space-2);
      inset-inline-end: var(--space-2);
      background: rgba(0,0,0,0.55);
      color: var(--color-secondary);
      font-size: var(--font-size-xs);
      font-weight: 700;
      padding: 2px 8px;
      border-radius: var(--radius-full);
      backdrop-filter: blur(4px);
    }

    /* ---- Body ---- */
    .cat-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4);
      gap: var(--space-3);
    }

    .cat-names {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .cat-primary {
      font-size: var(--font-size-md);
      font-weight: 700;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
    }

    .cat-secondary {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin: 0;
    }

    .cat-arrow {
      font-size: var(--font-size-lg);
      color: var(--color-gold);
      transition: transform var(--transition-base);
      flex-shrink: 0;
    }

    .cat-card:hover .cat-arrow {
      transform: translateX(4px);
    }

    [dir="rtl"] .cat-arrow {
      transform: scaleX(-1);
    }
    [dir="rtl"] .cat-card:hover .cat-arrow {
      transform: scaleX(-1) translateX(4px);
    }
  `]
})
export class CategoryCardComponent {
  readonly category = input.required<MenuCategory>();
  readonly index = input(0);

  readonly langService = inject(LanguageService);

  accent() {
    return CATEGORY_ACCENTS[this.category().id % CATEGORY_ACCENTS.length];
  }
}
