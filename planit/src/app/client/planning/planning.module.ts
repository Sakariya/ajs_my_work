import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UiModule } from '../../ui/ui.module';
import { PlanningService } from '../service';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import {
    PlanningSummaryComponent,
    PlanningSummaryRouterComponent,
    AssetsLiabilitiesModule,
    ProductRecommendationComponent,
    InvestmentProductsComponent,
    RebalancingSummaryComponent,
    DetailedRecommendationComponent,
    ApplyModelComponent,
    AddFromFavouritesComponent
} from '.';

@NgModule({
    imports: [
        UiModule,
        CoreModule,
        FormsModule,
        CommonModule,
        RouterModule,
        SharedModule,
        CheckboxModule,
        DropdownModule,
        PortfolioModule,
        CurrencyMaskModule,
        NgbModule.forRoot(),
        AssetsLiabilitiesModule,
    ],
    declarations: [
        PlanningSummaryComponent,
        PlanningSummaryRouterComponent,
        ProductRecommendationComponent,
        InvestmentProductsComponent,
        RebalancingSummaryComponent,
        DetailedRecommendationComponent,
        ApplyModelComponent,
        AddFromFavouritesComponent
    ],
    exports: [
        PlanningSummaryComponent,
        PlanningSummaryRouterComponent,
        ApplyModelComponent,
        AddFromFavouritesComponent
    ],
    providers: [
        PlanningService
    ]
})
export class PlanningModule { }
