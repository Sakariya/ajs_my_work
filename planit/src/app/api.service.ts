
import { HttpClient, HttpResponse } from '@angular/common/http';
import { TokenStorage } from './shared/token.storage';
import { FamilyPayload } from './api.service';
import { Store, select } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import {
    AppState,
    getIsClientLoaded,
} from './shared/app.reducer';

import {
    Login,
    SetClient
} from './shared/app.actions';

@Injectable()
export class APIService {
    private loginToken: String;

    constructor(
        private token: TokenStorage,
        private http: HttpClient,
        private router: Router,
        private store: Store<AppState>,
        private angulartics2: Angulartics2
    ) { }

    getFamilyPayload(clientId: string) {
        /*
        this.store
            .select(getIsClientLoaded)
            .pipe(take(1))
            .subscribe(loaded => {
                if (!loaded) {
                    this.http
                        .get('/client/' + clientId, {})
                        .map((response: { familyData: FamilyPayload }) => {
                            return response.familyData;
                        })
                        .subscribe(data => {
                            for (const p of data.person) {
                                this.getRiskPayload(p.externalKey).subscribe(
                                    data2 => (p.riskPayload = data2)
                                );
                            }
                            this.store.dispatch(new SetClient(data));
                        });
                }
            });
            */
    }

    doLogin(username: string, password: string, route: any) {
        return this.http
            .post(
                '/login',
                {
                    username: username,
                    password: password
                },
                {}
            )
            .subscribe((response: any) => {
                this.token.saveToken(response.token, false, 'MockAuthToken');
                this.store.dispatch(new Login());
                this.getFamilyPayload('CLIENT');
                this.angulartics2.eventTrack.next({ action: 'login' });
                this.router.navigate(['./client', 'CLIENT']);
            });
    }

    getRiskPayload(clientId: string) {
        return this.http.get('/risk/' + clientId + '/get', {});
    }

}

export interface FamilyPayload {
    address: Object;
    person: {
        firstName: string;
        lastName: string;
        externalKey: string;
        icon: string;
        riskPayload: any;
    }[];
}
