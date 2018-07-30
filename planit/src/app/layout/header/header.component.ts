import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Logout } from '../../shared/app.actions';
import { TokenStorage } from '../../shared/token.storage';
import { AppState } from '../../shared/app.reducer';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    constructor(
        private router: Router,
        private token: TokenStorage,
        private store: Store<AppState>,
        public translate: TranslateService
    ) {
        translate.addLangs(['en', 'fr']);
        translate.setDefaultLang('en');
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
     }
    ngOnInit() {
    }

    onLogout() {
        this.token.signOut();
        this.router.navigate(['/']);
    }
}
