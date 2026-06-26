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
      <!-- Image / Fallback -->
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
            <div class="fallback-glow"></div>
            <span class="item-initial" aria-hidden="true">
              {{ langService.currentLang() === 'ar'
                  ? item().titleAr.charAt(0)
                  : item().titleEn.charAt(0) }}
            </span>
          </div>
        }

        <!-- Cover gradient overlay -->
        <div class="thumb-gradient"></div>

        <!-- Sold out overlay -->
        @if (!item().isAvailable) {
          <div class="sold-out-overlay">
            <span class="sold-out-label">
              {{ langService.currentLang() === 'ar' ? 'نفذ' : 'Sold Out' }}
            </span>
          </div>
        }

        <!-- Popular badge -->
        @if (item().isPopular) {
          <span class="popular-badge item-popular">
            ✦ {{ langService.currentLang() === 'ar' ? 'الأكثر طلباً' : 'Popular' }}
          </span>
        }

        <!-- Floating price chip -->
        <div class="price-chip">
          @if (item().variants && item().variants!.length > 0) {
            <span class="price-from">{{ langService.currentLang() === 'ar' ? 'من' : 'from' }}</span>
          }
          <span class="price-value">{{ startingPrice() }}</span>
          <span class="price-currency">{{ currency() }}</span>
        </div>
      </div>

      <!-- Card body -->
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

        @if (item().variants && item().variants!.length > 0) {
          <div class="item-variants-hint">
            <span class="dot"></span>
            {{ item().variants!.length }} {{ langService.currentLang() === 'ar' ? 'أحجام متاحة' : 'sizes available' }}
          </div>
        }
      </div>

      <!-- Card border shine -->
      <div class="card-shine"></div>
    </button>
  `,
  styles: [`
    .item-card {
      display: flex;
      flex-direction: column;
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition:
        transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 300ms ease,
        border-color 300ms ease;
      text-align: start;
      color: inherit;
      font-family: inherit;
      width: 100%;
      padding: 0;
      position: relative;
    }

    .item-card:hover:not(.unavailable) {
      transform: translateY(-6px) scale(1.02);
      box-shadow: var(--shadow-hover);
      border-color: var(--border-glow);
    }

    .item-card:active:not(.unavailable) {
      transform: scale(0.97);
      transition-duration: 100ms;
    }

    .item-card.unavailable {
      opacity: 0.55;
      cursor: not-allowed;
      filter: saturate(0.4);
    }

    /* ─── Thumbnail ─── */
    .item-thumb {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
    }

    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 600ms ease;
    }

    .item-card:hover .thumb-img {
      transform: scale(1.08);
    }

    /* Fallback tile */
    .thumb-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        #1c1208 0%,
        #2a1e10 40%,
        rgba(180,135,102,0.25) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .fallback-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 60% 40%, rgba(207,161,93,0.22) 0%, transparent 60%);
    }

    .item-initial {
      font-size: 40px;
      font-weight: 800;
      color: rgba(180,135,102,0.4);
      position: relative;
      z-index: 1;
      font-family: var(--font-ar);
      line-height: 1;
    }

    /* Gradient overlay at bottom of thumb */
    .thumb-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(to top, rgba(18,18,18,0.85) 0%, transparent 100%);
      pointer-events: none;
    }

    /* Popular badge */
    .item-popular {
      position: absolute;
      top: var(--space-3);
      inset-inline-start: var(--space-3);
      z-index: 3;
    }

    /* Floating price chip */
    .price-chip {
      position: absolute;
      bottom: var(--space-3);
      inset-inline-end: var(--space-3);
      display: flex;
      align-items: baseline;
      gap: 3px;
      background: rgba(9,9,9,0.80);
      border: 1px solid rgba(180,135,102,0.25);
      border-radius: var(--radius-full);
      padding: 4px 10px;
      backdrop-filter: blur(12px);
      z-index: 3;
    }

    .price-from {
      font-size: 9px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .price-value {
      font-size: var(--font-size-sm);
      font-weight: 800;
      color: var(--color-gold);
      line-height: 1;
    }

    .price-currency {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.04em;
    }

    /* ─── Card Body ─── */
    .item-body {
      padding: var(--space-4) var(--space-4) var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      flex: 1;
    }

    .item-titles {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .item-title-primary {
      font-size: var(--font-size-base);
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .item-title-secondary {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin: 0;
      font-weight: 400;
    }

    .item-variants-hint {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.04em;
    }

    .dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: var(--color-accent);
      opacity: 0.6;
    }

    /* Card shine */
    .card-shine {
      position: absolute;
      inset: 0;
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%);
      pointer-events: none;
      z-index: 4;
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
