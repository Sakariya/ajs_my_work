import { BrowserModule } from '@angular/platform-browser';
import { NgModule, TRANSLATIONS, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AmChartsModule, AmChartsService } from '@amcharts/amcharts3-angular';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { NgxPermissionsModule } from 'ngx-permissions';
import { APIService } from './api.service';
import { CoreModule } from './core/core.module';

// Import the service
import { I18n } from '@ngx-translate/i18n-polyfill';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbdModalBasic } from './modal-basic';
import { registerLocaleData } from '@angular/common';

import { appRoutes } from './app.route';

declare const require; // Use the require method provided by webpack
export const translations = require(`raw-loader!../locale/source.xlf`);
import localeFr from '@angular/common/locales/hi';
import localeFrExtra from '@angular/common/locales/extra/hi';
registerLocaleData(localeFr, 'hi', localeFrExtra);

// All modules
import { AuthModule } from './auth/auth.module';
import { LayoutModule } from './layout/layout.module';
import { ClientModule } from './client/client.module';
import { SharedModule } from './shared/shared.module';
import { AdvisorModule } from './advisor/advisor.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { UiModule } from './ui/ui.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { TaskNotificationModule } from './task-notification/task-notification.module';


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json?v=1.5');
}

@NgModule({
    declarations: [
        AppComponent,
        NgbdModalBasic
    ],
    imports: [
        UiModule,
        CoreModule,
        AuthModule,
        FormsModule,
        LayoutModule,
        ClientModule,
        SharedModule,
        BrowserModule,
        AmChartsModule,
        HttpClientModule,
        NgxPermissionsModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
        BrowserAnimationsModule,
        CalendarModule, ReactiveFormsModule, AdvisorModule, TaskNotificationModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        APIService,
        AmChartsService,
        { provide: TRANSLATIONS, useValue: translations },
        I18n
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
