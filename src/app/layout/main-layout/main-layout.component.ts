import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { MenuService } from '../../core/services/menu.service';
import { LangToggleComponent } from '../../shared/components/lang-toggle/lang-toggle.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { SearchResultsOverlayComponent } from '../../shared/components/search-bar/search-results-overlay.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, LangToggleComponent, SearchBarComponent, SearchResultsOverlayComponent],
  template: `
    <div class="layout-shell">
      <!-- Floating Header -->
      <header class="site-header" role="banner">
        <div class="header-inner container">
          <!-- Brand -->
          <div class="brand">
            <div class="logo-ring">
              <img class="logo-img" src="assets/logo.jpg" alt="Nuttela Café Logo" />
            </div>
            <div class="brand-text">
              <span class="brand-name-en">Nuttela</span>
              <span class="brand-name-ar">كافيه نوتيلا</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="header-actions">
            <app-search-bar (searchChange)="onSearch($event)" />
            <div class="lang-wrap">
              <app-lang-toggle />
            </div>
          </div>
        </div>
      </header>

      <!-- Search overlay -->
      @if (searchQuery()) {
        <app-search-results-overlay
          [query]="searchQuery()"
          (close)="onSearch('')"
        />
      }

      <!-- Page content -->
      <main class="main-content" id="main-content">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="site-footer">
        <div class="footer-inner">
          <div class="footer-divider"></div>
          <div class="footer-content">
            <span class="footer-logo-text">Nuttela Café | <span class="footer-author"><a target="_blank" title="Visit my Portfolio" href="https://ateeqi.vercel.app/">Muhammed Al-Ateeqi</a></span> </span>
            <p class="footer-tagline">
              @if (langService.currentLang() === 'ar') {
                كافيه نوتيلا · جميع الأسعار بالجنيه المصري
              } @else {
                All prices in EGP · A luxury café experience
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .layout-shell {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    }

    /* ─────────────────────────── Header ─────────────────────────── */
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding-top: env(safe-area-inset-top);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
      background: rgba(12, 12, 12, 0.82);
      backdrop-filter: blur(28px) saturate(200%);
      -webkit-backdrop-filter: blur(28px) saturate(200%);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-3) var(--space-5);
      box-shadow:
        0 8px 32px rgba(0,0,0,0.5),
        0 1px 0 rgba(255,255,255,0.05) inset,
        0 0 0 1px rgba(180,135,102,0.06);
      margin-top: var(--space-4);
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex-shrink: 0;
    }

    .logo-ring {
      position: relative;
      width: 42px;
      height: 42px;
      flex-shrink: 0;
    }

    .logo-ring::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-accent), var(--color-gold));
      opacity: 0.7;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      z-index: 1;
      border: 2px solid var(--bg-primary);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .brand-name-en {
      font-family: var(--font-en);
      font-size: 16px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .brand-name-ar {
      font-family: var(--font-ar);
      font-size: var(--font-size-xs);
      color: var(--color-accent);
      letter-spacing: 0;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .lang-wrap {
      flex-shrink: 0;
    }

    /* ─────────────────────────── Main ─────────────────────────── */
    .main-content {
      flex: 1;
      padding-top: 90px; /* clear fixed header */
    }

    /* ─────────────────────────── Footer ─────────────────────────── */
    .site-footer {
      padding-block: var(--space-10);
      padding-inline: var(--space-6);
    }

    .footer-inner {
      max-width: 1280px;
      margin-inline: auto;
    }

    .footer-divider {
      height: 1px;
      background: linear-gradient(90deg,
        transparent 0%,
        var(--border-medium) 30%,
        rgba(180,135,102,0.2) 50%,
        var(--border-medium) 70%,
        transparent 100%
      );
      margin-bottom: var(--space-8);
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
    }
.footer-author{
 text-decoration: underline;
 cursor: pointer;
 font-family: var(--font-en);
 text-transform: capitalize;
}
    .footer-logo-text {
      font-family: var(--font-en);
      font-size: var(--font-size-sm);
      font-weight: 700;
      color: var(--color-accent);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .footer-tagline {
      font-size: var(--font-size-xs);
      color: var(--text-muted);
      letter-spacing: 0.04em;
    }

    /* RTL adjustments */
    [dir="rtl"] .brand-name-en { order: 1; color: var(--text-muted); font-size: var(--font-size-xs); letter-spacing: 0.02em; }
    [dir="rtl"] .brand-name-ar { order: 0; color: var(--text-primary); font-size: 16px; font-weight: 700; }
  `]
})
export class MainLayoutComponent {
  readonly langService = inject(LanguageService);
  readonly searchQuery = signal('');

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
