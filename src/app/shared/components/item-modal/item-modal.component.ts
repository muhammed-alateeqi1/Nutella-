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
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>

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
                <div class="fallback-ambient-1"></div>
                <div class="fallback-ambient-2"></div>
                <span class="modal-initial" aria-hidden="true">
                  {{ langService.currentLang() === 'ar'
                      ? item()!.titleAr.charAt(0)
                      : item()!.titleEn.charAt(0) }}
                </span>
              </div>
            }

            <!-- Image gradient overlay -->
            <div class="image-gradient"></div>

            @if (item()!.isPopular) {
              <span class="popular-badge modal-popular">
                ✦ {{ langService.currentLang() === 'ar' ? 'الأكثر طلباً' : 'Most Popular' }}
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

            <!-- Description -->
            @if (item()!.description) {
              <p class="modal-description">{{ item()!.description }}</p>
            }

            <!-- Unavailable banner -->
            @if (!item()!.isAvailable) {
              <div class="unavailable-banner">
                <span class="unavailable-dot"></span>
                {{ langService.currentLang() === 'ar' ? 'غير متوفر حالياً' : 'Currently unavailable' }}
              </div>
            }

            <!-- Pricing section -->
            <div class="modal-pricing">
              @if (hasVariants(item()!)) {
                <!-- Multi-price variants -->
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
                      <span class="variant-price">
                        <span class="price-val">{{ variant.price }}</span>
                        <span class="price-cur">{{ currency() }}</span>
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
                  <div class="single-price-display">
                    <span class="single-price-val">{{ item()!.price }}</span>
                    <span class="single-price-cur">{{ currency() }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    /* ─── Backdrop ─── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(0,0,0,0.78);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }

    @media (min-width: 640px) {
      .modal-backdrop {
        align-items: center;
      }
    }

    /* ─── Panel ─── */
    .modal-panel {
      width: 100%;
      max-width: 520px;
      max-height: 93dvh;
      overflow-y: auto;
      background: #0e0e0e;
      border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
      box-shadow:
        0 -2px 60px rgba(0,0,0,0.8),
        0 0 0 1px rgba(255,255,255,0.06),
        0 0 40px rgba(180,135,102,0.08);
      border: 1px solid var(--border-subtle);
      border-bottom: none;
      position: relative;
      animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      outline: none;
    }

    @media (min-width: 640px) {
      .modal-panel {
        border-radius: var(--radius-xl);
        border: 1px solid var(--border-subtle);
        animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        max-height: 88dvh;
      }
    }

    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.92) translateY(16px); opacity: 0; }
      to   { transform: scale(1) translateY(0);       opacity: 1; }
    }

    /* Drag handle */
    .drag-handle {
      width: 36px;
      height: 3px;
      background: rgba(255,255,255,0.12);
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
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
      z-index: 10;
      min-width: 44px;
      min-height: 44px;
    }

    .modal-close:hover {
      color: var(--text-primary);
      background: rgba(255,255,255,0.09);
      border-color: var(--border-medium);
    }

    /* ─── Image ─── */
    .modal-image-wrap {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
    }

    .modal-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: fadeIn 0.4s ease both;
    }

    /* Fallback */
    .modal-image-fallback {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a120a 0%, #2e1e10 50%, rgba(180,135,102,0.3) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .fallback-ambient-1 {
      position: absolute;
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, rgba(207,161,93,0.28) 0%, transparent 65%);
      border-radius: 50%;
      top: -40px;
      right: -40px;
    }

    .fallback-ambient-2 {
      position: absolute;
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(180,135,102,0.20) 0%, transparent 65%);
      border-radius: 50%;
      bottom: -20px;
      left: 10px;
    }

    .modal-initial {
      font-size: 80px;
      font-weight: 800;
      color: rgba(180,135,102,0.30);
      position: relative;
      z-index: 1;
      font-family: var(--font-ar);
      line-height: 1;
    }

    /* Image gradient overlay */
    .image-gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, #0e0e0e 0%, transparent 100%);
      pointer-events: none;
    }

    .modal-popular {
      position: absolute;
      bottom: var(--space-4);
      inset-inline-start: var(--space-4);
      z-index: 2;
    }

    /* ─── Content ─── */
    .modal-content {
      padding: var(--space-5) var(--space-6) var(--space-8);
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    /* Title */
    .modal-titles {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .modal-title-primary {
      font-size: var(--font-size-2xl);
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.15;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .modal-title-secondary {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin: 0;
      font-weight: 400;
    }

    /* Description */
    .modal-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.75;
      background: rgba(255,255,255,0.025);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-subtle);
    }

    /* Unavailable */
    .unavailable-banner {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      background: rgba(30,30,30,0.8);
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--text-muted);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    .unavailable-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(180,100,100,0.8);
      flex-shrink: 0;
    }

    /* ─── Pricing ─── */
    .modal-pricing {
      background: rgba(24,24,24,0.7);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
    }

    .pricing-label {
      font-size: var(--font-size-xs);
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0 0 var(--space-4);
    }

    /* Variants list */
    .variants-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .variant-row {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding-block: var(--space-3);
      border-bottom: 1px solid var(--border-subtle);
      transition: background var(--transition-fast);
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
        var(--border-subtle) 3px,
        transparent 3px,
        transparent 8px
      );
    }

    .variant-price {
      display: flex;
      align-items: baseline;
      gap: 3px;
      flex-shrink: 0;
    }

    .price-val {
      font-size: var(--font-size-md);
      font-weight: 800;
      color: var(--color-gold);
    }

    .price-cur {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      font-weight: 500;
    }

    /* Single price */
    .single-price-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
    }

    .single-price-label {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      font-weight: 500;
    }

    .single-price-display {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .single-price-val {
      font-size: var(--font-size-2xl);
      font-weight: 800;
      color: var(--color-gold);
      line-height: 1;
    }

    .single-price-cur {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      font-weight: 600;
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
