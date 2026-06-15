import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="nf-page">
      <div class="nf-card glass-card animate-fade-up">
        <div class="nf-emoji" aria-hidden="true">☕</div>
        <h1 class="nf-title">
          {{ lang.currentLang() === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found' }}
        </h1>
        <p class="nf-text">
          {{ lang.currentLang() === 'ar'
              ? 'يبدو أن هذه الصفحة غير موجودة. ارجع للقائمة لتستكشف أصنافنا.'
              : "Looks like this page doesn't exist. Head back to our menu." }}
        </p>
        <a class="nf-btn" routerLink="/" id="nf-home-link">
          {{ lang.currentLang() === 'ar' ? 'العودة للقائمة' : 'Back to Menu' }}
        </a>
      </div>
    </div>
  `,
  styles: [`
    .nf-page {
      min-height: 80dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }

    .nf-card {
      max-width: 420px;
      width: 100%;
      padding: var(--space-10) var(--space-8);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }

    .nf-emoji {
      font-size: 64px;
    }

    .nf-title {
      font-size: var(--font-size-xl);
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }

    .nf-text {
      color: var(--text-muted);
      font-size: var(--font-size-base);
      line-height: 1.7;
      margin: 0;
    }

    .nf-btn {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
      color: var(--color-secondary);
      font-weight: 700;
      padding: var(--space-3) var(--space-8);
      border-radius: var(--radius-full);
      font-size: var(--font-size-base);
      transition: transform var(--transition-fast), opacity var(--transition-fast);
      text-decoration: none;
      margin-top: var(--space-2);
    }

    .nf-btn:hover {
      transform: translateY(-2px);
      opacity: 0.9;
    }
  `]
})
export class NotFoundComponent {
  readonly lang = inject(LanguageService);
}
