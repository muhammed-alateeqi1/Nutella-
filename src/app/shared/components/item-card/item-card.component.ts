import { Component, inject, input, output, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { MenuItem, MenuCategory, getStartingPrice } from '../../../core/models/menu.model';

@Component({
  selector: 'app-item-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="item-card"
      [class.unavailable]="!item().isAvailable"
      [id]="'item-card-' + item().id"
      [attr.aria-label]="
        (langService.currentLang() === 'ar' ? item().titleAr : item().titleEn)
        + ', ' + startingPrice() + ' ' + currency()
      "
      [disabled]="!item().isAvailable"
      (click)="cardClick.emit(item())"
    >
      <!-- Image / Fallback tile -->
      <div class="item-thumb">
        @if (item().image) {
          <img
            [src]="item().image"
            [alt]="item().titleEn"
            loading="lazy"
            class="thumb-img"
          />
        } @else {
          <div class="thumb-fallback">
            <span class="item-initial" aria-hidden="true">
              {{ langService.currentLang() === 'ar'
                  ? item().titleAr.charAt(0)
                  : item().titleEn.charAt(0) }}
            </span>
          </div>
        }

        @if (!item().isAvailable) {
          <div class="sold-out-overlay">
            <span class="sold-out-label">
              {{ langService.currentLang() === 'ar' ? 'نفذ' : 'Sold Out' }}
            </span>
          </div>
        }

        @if (item().isPopular) {
          <span class="popular-badge item-popular">
            ⭐ {{ langService.currentLang() === 'ar' ? 'شائع' : 'Popular' }}
          </span>
        }
      </div>

      <!-- Card content -->
      <div class="item-body">
        <div class="item-titles">
          @if (langService.currentLang() === 'ar') {
            <p class="item-title-primary" lang="ar">{{ item().titleAr }}</p>
            <p class="item-title-secondary" lang="en">{{ item().titleEn }}</p>
          } @else {
            <p class="item-title-primary" lang="en">{{ item().titleEn }}</p>
            <p class="item-title-secondary" lang="ar">{{ item().titleAr }}</p>
          }
        </div>

        <div class="item-footer">
          <span class="price-badge">
            @if (item().variants && item().variants!.length > 0) {
              {{ langService.currentLang() === 'ar' ? 'من ' : 'From ' }}{{ startingPrice() }}
            } @else {
              {{ startingPrice() }}
            }
            {{ currency() }}
          </span>
          @if (item().variants && item().variants!.length > 0) {
            <span class="variants-hint">
              {{ item().variants!.length }} {{ langService.currentLang() === 'ar' ? 'أحجام' : 'sizes' }}
            </span>
          }
        </div>
      </div>
    </button>
  `,
  styles: [`
    .item-card {
      display: flex;
      flex-direction: column;
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
      transition: transform var(--transition-base), box-shadow var(--transition-base), border-color var(--transition-base);
      text-align: start;
      color: inherit;
      font-family: inherit;
      width: 100%;
      padding: 0;
      position: relative;
    }

    .item-card:hover:not(.unavailable) {
      transform: translateY(-3px);
      box-shadow: var(--shadow-card), 0 0 20px rgba(192,119,44,0.15);
      border-color: var(--border-glow);
    }

    .item-card:active:not(.unavailable) {
      transform: scale(0.97);
    }

    .item-card.unavailable {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ---- Thumbnail ---- */
    .item-thumb {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
    }

    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .item-card:hover .thumb-img {
      transform: scale(1.06);
    }

    .thumb-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        var(--surface-2) 50%,
        rgba(212, 175, 55, 0.3) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .thumb-fallback::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.18) 0%, transparent 60%);
    }

    .item-initial {
      font-size: 36px;
      font-weight: 800;
      color: rgba(235,170,157,0.5);
      position: relative;
      z-index: 1;
      font-family: var(--font-ar);
      line-height: 1;
    }

    [lang="en"] .item-initial {
      font-family: var(--font-en);
    }

    .item-popular {
      position: absolute;
      top: var(--space-2);
      inset-inline-start: var(--space-2);
    }

    /* ---- Body ---- */
    .item-body {
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
    }

    .item-titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .item-title-primary {
      font-size: var(--font-size-base);
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
      margin: 0;
    }

    .item-title-secondary {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin: 0;
    }

    .item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .variants-hint {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      background: var(--surface-2);
      padding: 2px 6px;
      border-radius: var(--radius-full);
    }
  `]
})
export class ItemCardComponent {
  readonly item = input.required<MenuItem>();
  readonly currency = input('EGP');
  readonly cardClick = output<MenuItem>();

  readonly langService = inject(LanguageService);

  startingPrice() {
    return getStartingPrice(this.item());
  }
}
