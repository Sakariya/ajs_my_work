import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-auth-header',
    templateUrl: './auth-header.component.html',
    styleUrls: ['./auth-header.component.css', '../header/header.component.css']
})
export class AuthHeaderComponent implements OnInit {

    constructor(
        public translate: TranslateService
    ) {
        translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    }

    ngOnInit() {
    }

}
