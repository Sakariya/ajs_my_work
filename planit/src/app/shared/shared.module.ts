import { StackedBarChartService } from './chart/stacked-bar-chart.service';
import { NoOverflowTooltipDirective } from './tooltip.directive';
import { AuthenticationGuard } from './authentication.guard';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TokenStorage } from './token.storage';
import { PagerService } from './pager.service';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { reducers } from './app.reducer';
import { CustomMinValidatorDirective } from './custom-min-validator.directive';
import { CustomMaxValidatorDirective } from './custom-max-validator.directive';

@NgModule({
    imports: [
        CommonModule,
        StoreModule.forRoot(reducers)
    ],
    declarations: [
        NoOverflowTooltipDirective,
        CustomMinValidatorDirective,
        CustomMaxValidatorDirective,
    ],
    exports: [
        TranslateModule,
        NoOverflowTooltipDirective,
        CustomMinValidatorDirective,
        CustomMaxValidatorDirective,
    ],
    providers: [
        StackedBarChartService,
        AuthenticationGuard,
        TokenStorage,
        PagerService
    ]
})
export class SharedModule { }
