import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loader-wrap" role="status" aria-label="Loading">
      <div class="loader-ring">
        <div class="ring-segment"></div>
        <div class="brand-letter">N</div>
      </div>
    </div>
  `,
  styles: [`
    .loader-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 40dvh;
    }

    .loader-ring {
      position: relative;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ring-segment {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: var(--color-gold);
      border-right-color: var(--color-accent);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .brand-letter {
      font-family: var(--font-en);
      font-size: 22px;
      font-weight: 800;
      color: var(--color-secondary);
    }
  `]
})
export class LoaderComponent {}
