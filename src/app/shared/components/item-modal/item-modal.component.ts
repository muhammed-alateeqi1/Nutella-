import {
  Component, inject, input, output,
  ChangeDetectionStrategy, OnInit, OnDestroy, ElementRef, signal
} from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { MenuItem, MenuCategory, getStartingPrice, hasVariants } from '../../../core/models/menu.model';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Backdrop -->
    <div
      class="modal-backdrop animate-fade-in"
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="item() ? (langService.currentLang() === 'ar' ? item()!.titleAr : item()!.titleEn) : ''"
      (click)="onBackdropClick($event)"
      (keydown.escape)="close.emit()"
    >
      <!-- Panel -->
      <div
        class="modal-panel"
        [class.slide-up]="true"
        #modalPanel
        tabindex="-1"
        role="document"
      >
        <!-- Drag handle (mobile) -->
        <div class="drag-handle" aria-hidden="true"></div>

        <!-- Close button -->
        <button
          class="modal-close"
          id="modal-close-btn"
          (click)="close.emit()"
          aria-label="Close"
        >✕</button>

        @if (item()) {
          <!-- Image / Fallback -->
          <div class="modal-image-wrap">
            @if (item()!.image) {
              <img
                [src]="item()!.image"
                [alt]="item()!.titleEn"
                class="modal-image"
              />
            } @else {
              <div class="modal-image-fallback">
                <div class="fallback-glow"></div>
                <span class="modal-initial" aria-hidden="true">
                  {{ langService.currentLang() === 'ar'
                      ? item()!.titleAr.charAt(0)
                      : item()!.titleEn.charAt(0) }}
                </span>
              </div>
            }

            @if (item()!.isPopular) {
              <span class="popular-badge modal-popular">
                ⭐ {{ langService.currentLang() === 'ar' ? 'الأكثر طلباً' : 'Most Popular' }}
              </span>
            }
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Title -->
            <div class="modal-titles">
              @if (langService.currentLang() === 'ar') {
                <h2 class="modal-title-primary" lang="ar">{{ item()!.titleAr }}</h2>
                <p class="modal-title-secondary" lang="en">{{ item()!.titleEn }}</p>
              } @else {
                <h2 class="modal-title-primary" lang="en">{{ item()!.titleEn }}</h2>
                <p class="modal-title-secondary" lang="ar">{{ item()!.titleAr }}</p>
              }
            </div>

            <!-- Description (optional) -->
            @if (item()!.description) {
              <p class="modal-description">{{ item()!.description }}</p>
            }

            <!-- Unavailable banner -->
            @if (!item()!.isAvailable) {
              <div class="unavailable-banner">
                {{ langService.currentLang() === 'ar' ? '❌ غير متوفر حالياً' : '❌ Currently unavailable' }}
              </div>
            }

            <!-- Pricing section -->
            <div class="modal-pricing">
              @if (hasVariants(item()!)) {
                <!-- Multi-price: variants list -->
                <p class="pricing-label">
                  {{ langService.currentLang() === 'ar' ? 'الأحجام والأسعار' : 'Sizes & Prices' }}
                </p>
                <ul class="variants-list" role="list">
                  @for (variant of item()!.variants!; track variant.label) {
                    <li class="variant-row">
                      <span class="variant-label">
                        {{ langService.currentLang() === 'ar' && variant.labelAr
                            ? variant.labelAr
                            : variant.label }}
                      </span>
                      <span class="variant-dots"></span>
                      <span class="variant-price price-badge">
                        {{ variant.price }} {{ currency() }}
                      </span>
                    </li>
                  }
                </ul>
              } @else {
                <!-- Single price -->
                <div class="single-price-wrap">
                  <span class="single-price-label">
                    {{ langService.currentLang() === 'ar' ? 'السعر' : 'Price' }}
                  </span>
                  <span class="single-price price-badge single-price-large">
                    {{ item()!.price }} {{ currency() }}
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ---- Backdrop ---- */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(0,0,0,0.72);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      backdrop-filter: blur(4px);
    }

    @media (min-width: 640px) {
      .modal-backdrop {
        align-items: center;
      }
    }

    /* ---- Panel ---- */
    .modal-panel {
      width: 100%;
      max-width: 540px;
      max-height: 92dvh;
      overflow-y: auto;
      background: var(--surface-modal);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      box-shadow: var(--shadow-modal);
      border: 1px solid var(--border-glow);
      border-bottom: none;
      position: relative;
      animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      outline: none;
    }

    @media (min-width: 640px) {
      .modal-panel {
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-glow);
        animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        max-height: 85dvh;
      }
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.92); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }

    /* Drag handle */
    .drag-handle {
      width: 40px;
      height: 4px;
      background: var(--border-glow);
      border-radius: var(--radius-full);
      margin: var(--space-3) auto var(--space-2);
    }

    @media (min-width: 640px) {
      .drag-handle { display: none; }
    }

    /* Close button */
    .modal-close {
      position: absolute;
      top: var(--space-4);
      inset-inline-end: var(--space-4);
      background: var(--surface-2);
      border: 1px solid var(--border-subtle);
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 14px;
      transition: all var(--transition-fast);
      z-index: 1;
      min-width: 44px;
      min-height: 44px;
    }
    .modal-close:hover {
      color: var(--text-accent);
      background: var(--surface-glass);
      border-color: var(--border-glow);
    }

    /* ---- Image wrap ---- */
    .modal-image-wrap {
      position: relative;
      aspect-ratio: 16/9;
      overflow: hidden;
    }

    .modal-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .modal-image-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        var(--surface-2) 40%,
        var(--color-accent) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .fallback-glow {
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(192,119,44,0.3) 0%, transparent 70%);
      border-radius: 50%;
    }

    .modal-initial {
      font-size: 72px;
      font-weight: 800;
      color: rgba(235,170,157,0.45);
      position: relative;
      z-index: 1;
      font-family: var(--font-ar);
      line-height: 1;
    }

    .modal-popular {
      position: absolute;
      bottom: var(--space-3);
      inset-inline-start: var(--space-3);
    }

    /* ---- Content ---- */
    .modal-content {
      padding: var(--space-5) var(--space-5) var(--space-8);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    /* Titles */
    .modal-titles {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .modal-title-primary {
      font-size: var(--font-size-xl);
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.2;
      margin: 0;
    }

    .modal-title-secondary {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin: 0;
    }

    /* Description */
    .modal-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.7;
      background: var(--surface-glass);
      padding: var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
    }

    /* Unavailable */
    .unavailable-banner {
      background: rgba(167,47,51,0.15);
      border: 1px solid rgba(167,47,51,0.3);
      color: var(--text-accent);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    /* ---- Pricing ---- */
    .modal-pricing {
      background: var(--surface-glass);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }

    .pricing-label {
      font-size: var(--font-size-xs);
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 var(--space-3);
    }

    /* Variants list */
    .variants-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .variant-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding-block: var(--space-2);
      border-bottom: 1px solid var(--border-subtle);
    }

    .variant-row:last-child {
      border-bottom: none;
    }

    .variant-label {
      font-size: var(--font-size-base);
      color: var(--text-primary);
      font-weight: 500;
      min-width: 80px;
    }

    .variant-dots {
      flex: 1;
      height: 1px;
      background: repeating-linear-gradient(
        to right,
        var(--border-subtle) 0px,
        var(--border-subtle) 4px,
        transparent 4px,
        transparent 8px
      );
    }

    .variant-price {
      flex-shrink: 0;
    }

    /* Single price */
    .single-price-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .single-price-label {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      font-weight: 500;
    }

    .single-price-large {
      font-size: var(--font-size-md) !important;
      padding: 6px 16px !important;
    }
  `]
})
export class ItemModalComponent implements OnInit, OnDestroy {
  readonly item = input<MenuItem | null>(null);
  readonly currency = input('EGP');
  readonly close = output<void>();

  readonly langService = inject(LanguageService);
  private readonly el = inject(ElementRef);

  readonly hasVariants = hasVariants;

  private readonly previousFocus = document.activeElement as HTMLElement | null;

  ngOnInit(): void {
    // Focus the panel for keyboard/screen-reader access
    setTimeout(() => {
      const panel = this.el.nativeElement.querySelector('.modal-panel') as HTMLElement;
      panel?.focus();
    }, 50);
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.previousFocus?.focus();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
