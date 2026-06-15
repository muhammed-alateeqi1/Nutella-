import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/home/home.component').then(m => m.HomeComponent),
        title: 'Nuttela Café — كافيه نوتيلا'
      },
      {
        path: 'category/:id',
        loadComponent: () =>
          import('./features/category/category.component').then(m => m.CategoryComponent),
      },
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Not Found — Nuttela Café'
  }
];
