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

      <!-- ── Immersive Hero ── -->
      <div class="hero-section">
        <div class="hero-ambient-bg">
          <div class="ambient-orb orb-1"></div>
          <div class="ambient-orb orb-2"></div>
          <div class="ambient-orb orb-3"></div>
          <div class="hero-noise"></div>
        </div>

        <div class="hero-inner container">
          <div class="hero-eyebrow animate-fade-up">
            <span class="eyebrow-dot"></span>
            <span>{{ langService.currentLang() === 'ar' ? 'القائمة الرقمية' : 'Digital Menu' }}</span>
            <span class="eyebrow-dot"></span>
          </div>

          <h1 class="hero-title">
            @if (langService.currentLang() === 'ar') {
              <span class="title-welcome animate-fade-up" lang="ar">أهلاً بك في</span>
              <span class="title-brand animate-fade-up" lang="ar">كافيه نوتيلا</span>
            } @else {
              <span class="title-welcome animate-fade-up">Welcome to</span>
              <span class="title-brand animate-fade-up">Nuttela Café</span>
            }
          </h1>

          <p class="hero-subtitle animate-fade-up">
            {{ langService.currentLang() === 'ar'
                ? 'اكتشف قائمتنا الفاخرة من المشروبات والحلويات'
                : 'Explore our curated collection of premium beverages & desserts' }}
          </p>

          <!-- Stats pills -->
          <div class="hero-stats animate-fade-up">
            <div class="stat-pill">
              <span class="stat-number">{{ menuService.categories().length }}</span>
              <span class="stat-label">{{ langService.currentLang() === 'ar' ? 'قسم' : 'Categories' }}</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-pill">
              <span class="stat-number">{{ totalItems() }}</span>
              <span class="stat-label">{{ langService.currentLang() === 'ar' ? 'صنف' : 'Menu Items' }}</span>
            </div>
          </div>
        </div>

        <!-- Hero bottom fade -->
        <div class="hero-fade-bottom"></div>
      </div>

      <!-- ── Category Grid ── -->
      <div class="categories-section container">
        <div class="section-header">
          <div class="section-line"></div>
          <h2 class="section-title">
            {{ langService.currentLang() === 'ar' ? 'قائمتنا' : 'Our Menu' }}
          </h2>
          <div class="section-line"></div>
        </div>

        @if (menuService.categories().length === 0) {
          <app-loader />
        } @else {
          <div class="categories-grid stagger" role="list" aria-label="Menu categories">
            @for (cat of menuService.categories(); track cat.id; let i = $index) {
              <div
                role="listitem"
                class="grid-item"
              >
                <app-category-card [category]="cat" [index]="i" />
              </div>
            }
          </div>
        }
      </div>

    </section>
  `,
  styles: [`
    .home-page {
      padding-bottom: var(--space-20);
    }

    /* ─────────────────────── Hero ─────────────────────── */
    .hero-section {
      position: relative;
      padding-top: var(--space-20);
      padding-bottom: var(--space-16);
      overflow: hidden;
    }

    /* Ambient orbs */
    .hero-ambient-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.55;
      animation: float 8s ease-in-out infinite;
    }

    .orb-1 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(180,135,102,0.18) 0%, transparent 70%);
      top: -10%;
      left: -10%;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(207,161,93,0.14) 0%, transparent 70%);
      top: 20%;
      right: -5%;
      animation-delay: -3s;
    }

    .orb-3 {
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(216,177,91,0.10) 0%, transparent 70%);
      bottom: 0%;
      left: 40%;
      animation-delay: -6s;
    }

    .hero-noise {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      opacity: 0.6;
    }

    .hero-inner {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-6);
    }

    /* Eyebrow */
    .hero-eyebrow {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-size: var(--font-size-xs);
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--color-accent);
      animation-delay: 0ms;
    }

    .eyebrow-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--color-accent);
      opacity: 0.7;
    }

    /* Headline */
    .hero-title {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      margin: 0;
    }

    .title-welcome {
      font-size: clamp(var(--font-size-xl), 4vw, var(--font-size-3xl));
      font-weight: 300;
      color: var(--text-secondary);
      letter-spacing: -0.01em;
      line-height: 1.1;
      animation-delay: 80ms;
      font-style: italic;
    }

    .title-brand {
      font-size: clamp(var(--font-size-3xl), 7vw, var(--font-size-5xl));
      font-weight: 800;
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-gold) 45%, var(--color-amber) 70%, var(--color-secondary) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: fadeSlideUp 0.5s ease both, shimmer 4s linear 1s infinite;
      letter-spacing: -0.02em;
      line-height: 1;
    }

    .hero-subtitle {
      font-size: var(--font-size-md);
      color: var(--text-muted);
      max-width: 480px;
      line-height: 1.7;
      font-weight: 400;
      animation-delay: 160ms;
    }

    /* Stats */
    .hero-stats {
      display: flex;
      align-items: center;
      gap: var(--space-5);
      background: rgba(24,24,24,0.7);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: var(--space-3) var(--space-6);
      backdrop-filter: blur(16px);
      box-shadow: var(--shadow-card);
      animation-delay: 240ms;
    }

    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .stat-number {
      font-size: var(--font-size-xl);
      font-weight: 800;
      color: var(--color-gold);
      line-height: 1;
    }

    .stat-label {
      font-size: 10px;
      color: var(--text-muted);
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--border-subtle);
    }

    /* Hero fade bottom */
    .hero-fade-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 120px;
      background: linear-gradient(to bottom, transparent, var(--bg-primary));
      pointer-events: none;
    }

    /* ─────────────────────── Section ─────────────────────── */
    .categories-section {
      padding-top: var(--space-4);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: var(--space-5);
      margin-bottom: var(--space-8);
    }

    .section-title {
      font-size: var(--font-size-sm);
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--text-muted);
      white-space: nowrap;
      margin: 0;
    }

    .section-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border-medium));
    }

    .section-header .section-line:first-child {
      background: linear-gradient(270deg, transparent, var(--border-medium));
    }

    /* ─────────────────────── Grid ─────────────────────── */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-5);
    }

    .grid-item--featured {
      grid-column: span 2;
    }

    @media (min-width: 640px) {
      .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-6);
      }
    }

    @media (min-width: 900px) {
      .categories-grid {
        grid-template-columns: repeat(3, 1fr);
      }
      .grid-item--featured {
        grid-column: span 2;
      }
    }

    @media (min-width: 1200px) {
      .categories-grid {
        grid-template-columns: repeat(4, 1fr);
      }
      .grid-item--featured {
        grid-column: span 2;
      }
    }

    @media (max-width: 480px) {
      .categories-grid {
        grid-template-columns: 1fr;
        gap: var(--space-4);
      }
      .grid-item--featured {
        grid-column: span 1;
      }
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
