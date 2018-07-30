import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { UiModule } from '../../ui/ui.module';

import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { AccordionModule } from 'primeng/accordion';
import {
    SummaryComponent,
    EditClientComponent,
    PersonalInfoComponent,
    RiskToleranceComponent,
    RiskToleranceResultsComponent,
    RiskToleranceKycComponent,
    AddFamilymemberComponent,
    SendInviteComponent,
    SendReminderComponent,
    EngagementComponent,
    ProfileSummaryComponent
} from '.';

import { SharedModule } from '../../shared/shared.module';


@NgModule({
    imports: [
        UiModule,
        CoreModule,
        FormsModule,
        RouterModule,
        CommonModule,
        CalendarModule,
        RadioButtonModule,
        NgbModule.forRoot(),
        CheckboxModule,
        DropdownModule,
        InputMaskModule,
        AccordionModule,
        SharedModule
    ],
    declarations: [
        SummaryComponent,
        PersonalInfoComponent,
        RiskToleranceComponent,
        AddFamilymemberComponent,
        EditClientComponent,
        SendInviteComponent,
        SendReminderComponent,
        EngagementComponent,
        ProfileSummaryComponent,
        RiskToleranceResultsComponent,
        RiskToleranceKycComponent
    ],
    exports: [
        PersonalInfoComponent,
        RiskToleranceComponent,
        AddFamilymemberComponent,
        EditClientComponent,
        SendInviteComponent,
        SendReminderComponent,
        EngagementComponent,
        ProfileSummaryComponent,
        RiskToleranceResultsComponent,
        RiskToleranceKycComponent
    ]
})
export class ProfileModule { }
