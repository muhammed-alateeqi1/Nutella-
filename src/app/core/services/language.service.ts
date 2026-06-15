import { Injectable, signal, effect } from '@angular/core';

export type Language = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'nuttela_lang';

  readonly currentLang = signal<Language>(this.loadSavedLang());

  readonly isRtl = () => this.currentLang() === 'ar';

  constructor() {
    // Reactively apply dir + lang to <html> on every change
    effect(() => {
      const lang = this.currentLang();
      const html = document.documentElement;
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      localStorage.setItem(this.STORAGE_KEY, lang);
    });
  }

  toggleLanguage(): void {
    this.currentLang.update(l => (l === 'en' ? 'ar' : 'en'));
  }

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
  }

  private loadSavedLang(): Language {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved === 'ar' ? 'ar' : 'en';
  }
}
