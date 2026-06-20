import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '', 
        redirectTo: 'heroes', 
        pathMatch: 'full'
    },
    {
        path: 'heroes',
        loadComponent: () => 
            import('./features/heroes/pages/hero-list/hero-list.component').then(m => m.HeroListComponent)
    }

];
