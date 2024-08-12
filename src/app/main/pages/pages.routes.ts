import { Routes } from "@angular/router";

export const PAGES_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes').then(m => m.HOME_ROUTES)
    },
    {
        path: 'lessons',
        loadChildren: () => import('./lessons/lessons.routes').then(m => m.LESSONS_ROUTES)
    },
    {
        path: 'courses',
        loadChildren: () => import('./courses/courses.routes').then(m => m.COURSES_ROUTES)
    }
];