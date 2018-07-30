import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UiModule } from '../../../ui/ui.module';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { RadioButtonModule } from 'primeng/radiobutton';

import {
    PortfoliosLandingComponent,
    PortfolioDetailsComponent,
    PortfolioHeaderComponent,
    ObjectivesComponent,
    EditPolicyComponent,
    AllocationComponent,
    ProfessionalJudgementComponent,
    PortfolioSuitabilityComponent,
    ExplanationDocumentationComponent,
    InvestorComponent,
    TimeHorizonComponent,
    LinkedGoalsComponent,
    LinkedAccountsComponent,
    AnalyticsComponent,
    EditCurrentComponent,
    AddPortfolioComponent
} from '.';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { AddInvestorComponent } from './portfolio-details/add-investor/add-investor.component';


@NgModule({
    imports: [
        UiModule,
        CoreModule,
        FormsModule,
        CommonModule,
        RouterModule,
        SharedModule,
        DropdownModule,
        CheckboxModule,
        AmChartsModule,
        AccordionModule,
        RadioButtonModule,
        CurrencyMaskModule,
        NgbModule.forRoot()
    ],
    declarations: [
        ObjectivesComponent,
        PortfolioDetailsComponent,
        PortfoliosLandingComponent,
        PortfolioHeaderComponent,
        EditPolicyComponent,
        AllocationComponent,
        ProfessionalJudgementComponent,
        PortfolioSuitabilityComponent,
        ExplanationDocumentationComponent,
        InvestorComponent,
        TimeHorizonComponent,
        LinkedGoalsComponent,
        LinkedAccountsComponent,
        AnalyticsComponent,
        EditCurrentComponent,
        AddInvestorComponent,
        AddPortfolioComponent
    ]
})
export class PortfolioModule { }
