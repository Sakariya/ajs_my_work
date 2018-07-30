import { Routes } from '@angular/router';
import { LoginComponent, LicenceComponent } from './auth';
import { HeaderComponent, AuthHeaderComponent } from './layout/';
import { ClientComponent, CLIENT_ROUTES } from './client';
import { AuthenticationGuard } from './shared/authentication.guard';
import { AdvisorComponent } from './advisor/advisor/advisor.component';
import { ADVISOR_ROUTES } from './advisor/advisor.route';
import { TASK_NOTIFICATION_ROUTES } from './task-notification/task-notification.route';

export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '', children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'licence-agreement',
                component: LicenceComponent
            },
            {
                path: '',
                component: AuthHeaderComponent,
                outlet: 'header'
            }
        ]
    },
    {
        path: '', children: [
            {
                path: 'client/:clientId',
                component: ClientComponent,
                children: CLIENT_ROUTES,
                canActivate: [AuthenticationGuard]
            },
            {
                path: 'advisor',
                component: AdvisorComponent,
                children: ADVISOR_ROUTES,
                canActivate: [AuthenticationGuard]
            },
            {
                path: '',
                component: HeaderComponent,
                outlet: 'header'
            },
        ]
    },
    {
        path: '',
        children: TASK_NOTIFICATION_ROUTES,
        canActivate: [AuthenticationGuard]
    },
    { path: '**', redirectTo: '/login' }
];
