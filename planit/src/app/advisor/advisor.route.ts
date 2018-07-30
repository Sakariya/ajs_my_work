import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddClientComponent } from './dashboard';
import { AddFamilymemberComponent } from '../client/profile';

export const ADVISOR_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            {
                path: 'add-client',
                component: AddClientComponent
            },
            {
                path: ':id/add-family-member',
                component: AddFamilymemberComponent
            }
        ]
    },
];
