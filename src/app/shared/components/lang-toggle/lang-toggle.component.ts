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
      <span class="lang-pill" [class.active]="langService.currentLang() === 'en'">EN</span>
      <span class="lang-sep">·</span>
      <span class="lang-pill" [class.active]="langService.currentLang() === 'ar'">ع</span>
    </button>
  `,
  styles: [`
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius-full);
      padding: 6px 12px;
      cursor: pointer;
      color: var(--text-primary);
      font-size: var(--font-size-xs);
      font-weight: 700;
      letter-spacing: 0.06em;
      transition: all var(--transition-smooth);
      font-family: var(--font-en);
      min-width: 44px;
      min-height: 38px;
    }

    .lang-btn:hover {
      background: rgba(255,255,255,0.07);
      border-color: rgba(180,135,102,0.25);
    }

    .lang-pill {
      color: var(--text-muted);
      transition: all var(--transition-smooth);
      padding: 2px 6px;
      border-radius: var(--radius-full);
      line-height: 1;
    }

    .lang-pill.active {
      background: linear-gradient(135deg, var(--color-accent), var(--color-gold));
      color: #111;
      font-weight: 800;
    }

    .lang-sep {
      color: var(--border-medium);
      font-weight: 300;
      font-size: 10px;
    }
  `]
})
export class LangToggleComponent {
  readonly langService = inject(LanguageService);
}
