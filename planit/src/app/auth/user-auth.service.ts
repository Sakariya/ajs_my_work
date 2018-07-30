// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Angulartics2 } from 'angulartics2';
import { Login } from '../shared/app.actions';
import { AppState } from '../shared/app.reducer';
import { HttpClient } from '@angular/common/http';
import { TokenStorage } from '../shared/token.storage';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserAuthService {

    constructor(
        private http: HttpClient,
        private token: TokenStorage,
        private store: Store<AppState>,
        private angulartics2: Angulartics2
    ) { }

    public login(username: string, password: string): Observable<any> {
        return Observable.forkJoin(
            this.doLogin(username, password, true),
            this.doLogin('user', 'password', false)
        );
    }

    public doLogin(username: string, password: string, isLive: boolean): Observable<any> {
        const httpOptions = {};
        let url = '/login';
        if (isLive) {
            httpOptions['headers'] = new HttpHeaders({
                'isLive': 'true'
            });
            url = '/v20/login';
        }
        return this.http.post(url, { username: username, password: password }, httpOptions).do((response) => {
            const TOKEN_KEY = (isLive) ? 'AuthToken' : 'MockAuthToken';
            this.token.saveToken(response['token'], false, TOKEN_KEY);
            this.store.dispatch(new Login());
            this.angulartics2.eventTrack.next({ action: 'login' });
        }).catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        return Observable.throw(error || 'Server error');
    }
}
