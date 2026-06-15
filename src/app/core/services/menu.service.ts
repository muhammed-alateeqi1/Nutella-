import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, catchError, EMPTY } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuData, MenuCategory, MenuItem, getStartingPrice } from '../models/menu.model';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly http = inject(HttpClient);

  private readonly menuData$ = this.http
    .get<MenuData>('/assets/data/menu.json')
    .pipe(shareReplay(1), catchError(() => EMPTY));

  readonly menuData = toSignal(this.menuData$, { initialValue: null });

  readonly categories = computed((): MenuCategory[] => this.menuData()?.categories ?? []);
  readonly restaurantName = computed(() => this.menuData()?.restaurantName ?? 'Nuttela Café');
  readonly currency = computed(() => this.menuData()?.currency ?? 'EGP');

  getCategoryById(id: number): MenuCategory | undefined {
    return this.categories().find(c => c.id === id);
  }

  searchItems(query: string): { category: MenuCategory; item: MenuItem }[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: { category: MenuCategory; item: MenuItem }[] = [];
    for (const category of this.categories()) {
      for (const item of category.items) {
        if (
          item.titleEn.toLowerCase().includes(q) ||
          item.titleAr.includes(query)
        ) {
          results.push({ category, item });
        }
      }
    }
    return results;
  }
}
