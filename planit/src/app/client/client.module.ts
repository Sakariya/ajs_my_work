import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { LayoutModule } from '../layout/layout.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileModule } from './profile/profile.module';
import { PlanningModule } from './planning/planning.module';
import { CalendarModule } from 'primeng/calendar';
import { ClientProfileService } from './service';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { OverviewComponent } from '.';
import { MessageModule } from 'primeng/message';
import { UiModule } from '../ui/ui.module';
import { DocumentsModule } from './documents/documents.module';

import {
    ClientComponent,
    ComingSoonComponent
} from '.';

import {
    ColaborationTileComponent,
    InvestmentsTileComponent,
    AllocationTileComponent,
    PortfolioTileComponent,
    NetWorthTileComponent,
    DocumentTileComponent,
    FamilyTileComponent,
    RiskTileComponent,
    TaskTileComponent,
    GoalTileComponent
} from './overview';

@NgModule({
    imports: [
        UiModule,
        NgbModule,
        CoreModule,
        FormsModule,
        CommonModule,
        RouterModule,
        LayoutModule,
        ProfileModule,
        PlanningModule,
        CalendarModule,
        TranslateModule,
        DocumentsModule,
        SharedModule,
        MessageModule
    ],
    declarations: [
        ClientComponent,
        OverviewComponent,
        ComingSoonComponent,
        ColaborationTileComponent,
        InvestmentsTileComponent,
        AllocationTileComponent,
        PortfolioTileComponent,
        NetWorthTileComponent,
        DocumentTileComponent,
        FamilyTileComponent,
        RiskTileComponent,
        TaskTileComponent,
        GoalTileComponent
    ],
    exports: [
        ClientComponent,
        OverviewComponent,
        ComingSoonComponent,
        ColaborationTileComponent,
        InvestmentsTileComponent,
        AllocationTileComponent,
        PortfolioTileComponent,
        NetWorthTileComponent,
        DocumentTileComponent,
        FamilyTileComponent,
        RiskTileComponent,
        TaskTileComponent,
        GoalTileComponent
    ],
    providers: [
        ClientProfileService
    ]
})
export class ClientModule { }
