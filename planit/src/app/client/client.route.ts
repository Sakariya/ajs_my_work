import { Routes, RouterModule } from '@angular/router';
import { ComingSoonComponent } from './coming-soon/coming-soon.component';
import { OverviewComponent } from './overview/overview.component';

import {
    SummaryComponent,
    PersonalInfoComponent,
    RiskToleranceComponent,
    AddFamilymemberComponent,
    SendInviteComponent,
    SendReminderComponent,
    EditClientComponent,
    EngagementComponent,
    ProfileSummaryComponent,
    RiskToleranceResultsComponent,
    RiskToleranceKycComponent
} from './profile';

import {
    DocumentCentreComponent,
    UploadDocumentComponent,
    GenerateDocumentComponent,
    RenameDocumentComponent
} from './documents';

import {
    PlanningSummaryRouterComponent,
    PlanningSummaryComponent,
    PortfoliosLandingComponent,
    PortfolioDetailsComponent,
    ObjectivesComponent,
    AssetsSummaryComponent,
    HoldingAccountComponent,
    AddAccountComponent,
    EditAccountComponent,
    AddSavingsComponent,
    SavingsComponent,
    ProductSearchComponent,
    EditSavingsComponent,
    SavingsSpecifiedAccountComponent,
    RebalancingSummaryComponent,
    DetailedRecommendationComponent,
    ProductRecommendationComponent,
    InvestmentProductsComponent,
    ApplyModelComponent,
    AddFromFavouritesComponent,
    EditPolicyComponent,
    AnalyticsComponent,
    EditCurrentComponent,
    AddPortfolioComponent,
    AddInvestorComponent
} from './planning';
import { TaskNotificationComponent } from '../task-notification/task-notification/task-notification.component';
import { AddTaskComponent } from '../task-notification/add-task/add-task.component';
import { RenameItemComponent } from '../ui/rename-item/rename-item.component';
export const CLIENT_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
    },
    {
        path: 'overview',
        component: OverviewComponent,
        children: [
            {
                path: ':personalId/send-invitation',
                component: SendInviteComponent
            },
            {
                path: ':personalId/send-reminder',
                component: SendReminderComponent
            },
        ]
    },
    {
        path: 'task-notification',
        component: TaskNotificationComponent,
        children: [
            {
                path: 'add-task',
                component: AddTaskComponent
            }
        ]
    },
    {
        path: 'coming-soon',
        component: ComingSoonComponent
    },
    {
        path: 'profile',
        component: SummaryComponent
    },
    {
        path: 'profile',
        component: ProfileSummaryComponent,
        children: [
            {
                path: 'risk-tolerance',
                component: RiskToleranceComponent,
                children: [
                    {
                        path: ':personalId/send-invitation',
                        component: SendInviteComponent
                    },
                    {
                        path: ':personalId/send-reminder',
                        component: SendReminderComponent
                    }
                ]
            },
            {
                path: 'personal-info',
                component: PersonalInfoComponent,
                children: [
                    {
                        path: 'add',
                        component: AddFamilymemberComponent
                    }
                ]
            },
            {
                path: 'personal-info/:personalId/edit',
                component: EditClientComponent
            },
            {
                path: 'engagement',
                component: EngagementComponent,
            },
            {
                path: 'risk-tolerance/:personalId/results',
                component: RiskToleranceResultsComponent,
            },
            {
                path: 'risk-tolerance/:personalId/know-your-client',
                component: RiskToleranceKycComponent,
            }
        ]
    },
    {
        path: 'document-centre',
        component: DocumentCentreComponent,
        children: [
            {
                path: 'upload',
                component: UploadDocumentComponent
            },
            {
                path: 'generate',
                component: GenerateDocumentComponent
            },
            {
                path: ':docTypeId/rename/:docId',
                component: RenameDocumentComponent
            },
            {
                path: ':personalId/send-reminder',
                component: SendReminderComponent
            },
            {
                path: ':docTypeId/:docId/rename',
                component: RenameItemComponent
            }
        ]
    },
    {
        path: 'planning',
        component: PlanningSummaryComponent,
    },
    {
        path: 'planning',
        component: PlanningSummaryRouterComponent,
        children: [
            {
                path: 'portfolios',
                component: PortfoliosLandingComponent,
                children: [
                    {
                        path: 'add-portfolio',
                        component: AddPortfolioComponent
                    },
                    {
                        path: ':portfolioId/rename',
                        component: RenameItemComponent
                    },
                    {
                        path: ':portfolioId/analytics/:chartType',
                        component: AnalyticsComponent,
                    }
                ]
            },
            {
                path: 'portfolios/:portfolioId/details',
                component: PortfolioDetailsComponent,
                children: [
                    {
                        path: 'edit-current',
                        component: EditCurrentComponent
                    },
                    {
                        path: 'edit-policy',
                        component: EditPolicyComponent,
                    },
                    {
                        path: 'analytics/:chartType',
                        component: AnalyticsComponent,
                    },
                    {
                        path: 'add-investor',
                        component: AddInvestorComponent,
                    },
                    {
                        path: 'add-portfolio',
                        component: AddPortfolioComponent
                    },
                    {
                        path: 'rename',
                        component: RenameItemComponent
                    }
                ]
            },
            {
                path: 'portfolios/:portfolioId/details/edit',
                component: PortfolioDetailsComponent,
                children: [
                    {
                        path: 'edit-current',
                        component: EditCurrentComponent
                    },
                    {
                        path: 'edit-policy',
                        component: EditPolicyComponent,
                    },
                    {
                        path: 'analytics/:chartType',
                        component: AnalyticsComponent,
                    },
                    {
                        path: 'add-investor',
                        component: AddInvestorComponent,
                    },
                    {
                        path: 'add-portfolio',
                        component: AddPortfolioComponent
                    },
                    {
                        path: 'rename',
                        component: RenameItemComponent
                    }
                ]
            },
            {
                path: 'portfolios/:portfolioId/objectives',
                component: ObjectivesComponent
            },
            {
                path: 'assets-liabilities',
                component: AssetsSummaryComponent,
                children: [
                    {
                        path: ':accountId/add-savings',
                        component: AddSavingsComponent
                    },
                    {
                        path: 'add-account',
                        component: AddAccountComponent
                    }
                ]
            },
            {
                path: 'assets-liabilities-savings',
                component: SavingsComponent,
                children: [
                    {
                        path: 'add-savings',
                        component: AddSavingsComponent
                    },
                    {
                        path: ':accountId/add-savings',
                        component: AddSavingsComponent
                    }
                ]
            },
            {
                path: 'assets-liabilities/:accountId/holding-account',
                component: HoldingAccountComponent,
                children: [
                    {
                        path: 'product-search/:assetId',
                        component: ProductSearchComponent
                    },
                    {
                        path: 'product-search',
                        component: ProductSearchComponent
                    }
                ]
            },
            {
                path: 'assets-liabilities/:accountId/edit-account',
                component: EditAccountComponent
            },
            {
                path: 'assets-liabilities-savings/:savingsId/edit-savings',
                component: EditSavingsComponent
            },
            {
                path: 'assets-liabilities/:accountId/savings',
                component: SavingsSpecifiedAccountComponent,
                children: [
                    {
                        path: 'add-savings',
                        component: AddSavingsComponent
                    }
                ]
            },
            {
                path: 'product-recommendation',
                component: ProductRecommendationComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'investment-products',
                        pathMatch: 'full'
                    },
                    {
                        path: 'investment-products',
                        component: InvestmentProductsComponent,
                        children: [
                            {
                                path: 'add-account',
                                component: AddAccountComponent
                            },
                            {
                                path: ':accountId/apply-model',
                                component: ApplyModelComponent
                            },
                            {
                                path: ':accountId/add-favourites',
                                component: AddFromFavouritesComponent
                            },
                            {
                                path: ':accountId/add-product',
                                component: ProductSearchComponent
                            }
                        ]
                    },
                    {
                        path: 'rebalancing-summary',
                        component: RebalancingSummaryComponent
                    },
                    {
                        path: 'detailed-recommendation',
                        component: DetailedRecommendationComponent
                    }
                ]
            }
        ]
    }
];
