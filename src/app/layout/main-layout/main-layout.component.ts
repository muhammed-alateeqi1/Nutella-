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
      <!-- Header -->
      <header class="site-header glass-card" role="banner">
        <div class="header-inner container">
          <div class="brand">
            <img class="logo-img" src="assets/logo.jpg" alt="Nuttela Café Logo" />
            <div class="brand-text">
              <span class="brand-name-en">Nuttela</span>
              <span class="brand-name-ar">كافيه نوتيلا</span>
            </div>
          </div>

          <div class="header-actions">
            <app-search-bar (searchChange)="onSearch($event)" />
            <app-lang-toggle />
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
        <p>
          @if (langService.currentLang() === 'ar') {
            كافيه نوتيلا · جميع الأسعار بالجنيه المصري
          } @else {
            Nuttela Café · All prices in EGP
          }
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .layout-shell {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      background: var(--surface-0);
    }

    /* ---- Header ---- */
    .site-header {
      position: sticky;
      top: 0;
      z-index: 100;
      border-radius: 0;
      border-top: none;
      border-inline: none;
      border-bottom: 1px solid var(--border-subtle);
      padding-block: var(--space-3);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-4);
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      flex-shrink: 0;
    }

    .logo-img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 1.5px solid var(--color-gold);
      box-shadow: var(--shadow-glow), 0 0 10px rgba(212, 175, 55, 0.15);
      flex-shrink: 0;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .brand-name-en {
      font-family: var(--font-en);
      font-size: var(--font-size-md);
      font-weight: 700;
      color: var(--color-secondary);
      letter-spacing: 0.04em;
    }

    .brand-name-ar {
      font-family: var(--font-ar);
      font-size: var(--font-size-xs);
      color: var(--text-muted);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    /* ---- Main ---- */
    .main-content {
      flex: 1;
    }

    /* ---- Footer ---- */
    .site-footer {
      text-align: center;
      padding-block: var(--space-6);
      color: var(--text-muted);
      font-size: var(--font-size-xs);
      border-top: 1px solid var(--border-subtle);
    }

    [dir="rtl"] .brand-name-en { order: 1; }
    [dir="rtl"] .brand-name-ar { order: 0; color: var(--color-secondary); }
    [dir="rtl"] .brand-name-en { color: var(--text-muted); font-size: var(--font-size-xs); }
  `]
})
export class MainLayoutComponent {
  readonly langService = inject(LanguageService);
  readonly searchQuery = signal('');

  onSearch(query: string): void {
    this.searchQuery.set(query);
  }
}
