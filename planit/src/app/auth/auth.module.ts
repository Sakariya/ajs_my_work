import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { UserAuthService } from './user-auth.service';
import { LicenceComponent } from './licence/licence.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule,
        TranslateModule
    ],
    declarations: [
        LoginComponent,
        LicenceComponent
    ],
    exports: [
        LoginComponent
    ],
    providers: [
        UserAuthService
    ]
})
export class AuthModule { }
