import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'pages'
    },
    {
        path: 'pages',
        loadChildren: () => import('./main/pages/pages.routes').then(m => m.PAGES_ROUTES)
    }
];
