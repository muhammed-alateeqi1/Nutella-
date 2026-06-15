import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-lang-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="lang-btn"
      id="lang-toggle-btn"
      [attr.aria-label]="langService.currentLang() === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
      (click)="langService.toggleLanguage()"
    >
      <span class="lang-active">{{ langService.currentLang() === 'en' ? 'EN' : 'ع' }}</span>
      <span class="lang-separator">|</span>
      <span class="lang-inactive">{{ langService.currentLang() === 'en' ? 'ع' : 'EN' }}</span>
    </button>
  `,
  styles: [`
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--surface-glass);
      border: 1px solid var(--border-glow);
      border-radius: var(--radius-full);
      padding: 6px 14px;
      cursor: pointer;
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: 600;
      letter-spacing: 0.04em;
      transition: all var(--transition-base);
      font-family: var(--font-en);
      min-width: 44px;
      min-height: 44px;
    }

    .lang-btn:hover {
      background: var(--color-accent);
      border-color: var(--color-accent);
      box-shadow: var(--shadow-glow);
      transform: scale(1.04);
    }

    .lang-active {
      color: var(--color-secondary);
      font-weight: 700;
    }

    .lang-separator {
      color: var(--text-muted);
      font-weight: 300;
    }

    .lang-inactive {
      color: var(--text-muted);
    }
  `]
})
export class LangToggleComponent {
  readonly langService = inject(LanguageService);
}
