import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { HeaderComponent, FooterComponent, AuthHeaderComponent } from './';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        NgbModule.forRoot(),
        TranslateModule,
        CommonModule,
        RouterModule,
        CoreModule
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        AuthHeaderComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        AuthHeaderComponent
    ]
})
export class LayoutModule { }
