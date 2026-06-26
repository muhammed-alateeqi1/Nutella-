import {
  Component, inject, input, output,
  ChangeDetectionStrategy, ElementRef, HostListener
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { MenuCategory } from '../../../core/models/menu.model';

// Warm luxury accent gradients for fallback tiles
const CATEGORY_GRADIENTS = [
  ['#2a1a10', '#B48766'],
  ['#1e1608', '#CFA15D'],
  ['#1a1210', '#D8B15B'],
  ['#0e1a10', '#7AA874'],
  ['#161610', '#D8B15B'],
  ['#1e100a', '#B48766'],
  ['#12180e', '#7AA874'],
  ['#1c1408', '#CFA15D'],
  ['#1a1010', '#D8B15B'],
  ['#10160e', '#B48766'],
  ['#1c1208', '#CFA15D'],
  ['#141a10', '#7AA874'],
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
      <!-- Radial ambient glow (always rendered behind image) -->
      <div class="card-glow" [style.background]="glowColor()"></div>

      <!-- Cover image / fallback -->
      <div class="cat-cover">
        @if (category().coverImage) {
          <img
            [src]="category().coverImage"
            [alt]="category().nameEn + ' cover'"
            loading="lazy"
            class="cover-img"
          />
        } @else {
          <div class="cover-fallback" [style.--grad-dark]="gradDark()" [style.--grad-accent]="gradAccent()">
            <div class="fallback-noise"></div>
            <div class="fallback-radial"></div>
            <span class="cat-emoji" aria-hidden="true">{{ category().icon }}</span>
          </div>
        }

        <!-- Glass overlay at bottom of cover -->
        <div class="cover-glass-overlay"></div>

        <!-- Item count chip -->
        <span class="item-count" aria-hidden="true">
          {{ category().items.length }}
          <span class="item-count-label">{{ langService.currentLang() === 'ar' ? 'صنف' : 'items' }}</span>
        </span>
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

        <!-- Premium eye icon -->
        <div class="cat-arrow-wrap">
          <svg class="cat-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
      </div>

      <!-- Glass border shine -->
      <div class="card-shine"></div>
    </a>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .cat-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition:
        transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 300ms ease,
        border-color 300ms ease;
      text-decoration: none;
      color: inherit;
      position: relative;
      will-change: transform;
    }

    .cat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: var(--shadow-hover);
      border-color: var(--border-glow);
    }

    .cat-card:active {
      transform: scale(0.97);
      transition-duration: 100ms;
    }

    /* Ambient glow behind card */
    .card-glow {
      position: absolute;
      inset: -40px;
      border-radius: 50%;
      opacity: 0;
      filter: blur(40px);
      transition: opacity 400ms ease;
      pointer-events: none;
      z-index: 0;
    }

    .cat-card:hover .card-glow {
      opacity: 0.12;
    }

    .cat-cover {
      position: relative;
      height: 150px;
      overflow: hidden;
      flex-shrink: 0;
    }

    @media (min-width: 640px) {
      .cat-cover {
        height: 200px;
      }
    }

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 600ms ease;
    }

    .cat-card:hover .cover-img {
      transform: scale(1.07);
    }

    /* Fallback tile */
    .cover-fallback {
      width: 100%;
      height: 100%;
      background: radial-gradient(
        ellipse at 50% 60%,
        var(--grad-accent, #B48766) 0%,
        var(--grad-dark, #1a1010) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .fallback-noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
      opacity: 0.5;
    }

    .fallback-radial {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 40%, rgba(255,255,255,0.07) 0%, transparent 65%);
    }

    .cat-emoji {
      font-size: 52px;
      position: relative;
      z-index: 1;
      filter: drop-shadow(0 4px 16px rgba(0,0,0,0.5));
      transition: transform var(--transition-spring);
    }

    .cat-card:hover .cat-emoji {
      transform: scale(1.18) translateY(-4px);
    }

    /* Glass overlay at bottom of cover */
    .cover-glass-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to top, rgba(18,18,18,0.7) 0%, transparent 100%);
      pointer-events: none;
    }

    /* Item count chip */
    .item-count {
      position: absolute;
      bottom: var(--space-3);
      inset-inline-end: var(--space-3);
      background: rgba(0,0,0,0.65);
      border: 1px solid var(--border-subtle);
      color: var(--color-gold);
      font-size: var(--font-size-xs);
      font-weight: 700;
      padding: 3px 10px;
      border-radius: var(--radius-full);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 4px;
      line-height: 1.4;
    }

    .item-count-label {
      color: var(--text-muted);
      font-weight: 500;
    }

    /* ─── Card Body ─── */
    .cat-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-5);
      gap: var(--space-3);
      position: relative;
      z-index: 1;
      flex: 1;
    }

    .cat-names {
      display: flex;
      flex-direction: column;
      gap: 3px;
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
      letter-spacing: -0.01em;
    }

    .cat-secondary {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      margin: 0;
      font-weight: 400;
    }

    /* Premium arrow */
    .cat-arrow-wrap {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border-subtle);
      background: rgba(255,255,255,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition:
        background 300ms ease,
        border-color 300ms ease,
        transform 300ms var(--transition-spring);
      color: var(--color-accent);
    }

    .cat-card:hover .cat-arrow-wrap {
      background: linear-gradient(135deg, rgba(180,135,102,0.2), rgba(207,161,93,0.1));
      border-color: var(--border-glow);
      transform: scale(1.12);
    }

    .cat-arrow {
      flex-shrink: 0;
    }

    /* Glass border shine */
    .card-shine {
      position: absolute;
      inset: 0;
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%);
      pointer-events: none;
      z-index: 2;
    }
  `]
})
export class CategoryCardComponent {
  readonly category = input.required<MenuCategory>();
  readonly index = input(0);

  readonly langService = inject(LanguageService);
  private readonly el = inject(ElementRef);

  gradDark(): string {
    const [dark] = CATEGORY_GRADIENTS[this.category().id % CATEGORY_GRADIENTS.length];
    return dark;
  }

  gradAccent(): string {
    const [, accent] = CATEGORY_GRADIENTS[this.category().id % CATEGORY_GRADIENTS.length];
    return accent;
  }

  glowColor(): string {
    const [, accent] = CATEGORY_GRADIENTS[this.category().id % CATEGORY_GRADIENTS.length];
    return `radial-gradient(circle, ${accent}40 0%, transparent 70%)`;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const card = this.el.nativeElement.querySelector('.cat-card') as HTMLElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;
    const rotateY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-8px) scale(1.02) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const card = this.el.nativeElement.querySelector('.cat-card') as HTMLElement;
    if (!card) return;
    card.style.transform = '';
  }
}
