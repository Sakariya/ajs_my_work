import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';

import { TokenStorage } from '../../shared/token.storage';
import { environment } from '../../../environments/environment';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* Single Token

        const headersObj: any = { Accept: 'application/json' };
        if (TokenStorage.exists) {
            headersObj.Authorization = `Bearer ${TokenStorage.token}`;
        }
        url = req.url[0] === '/' ? environment.mockApiUrl + req.url : req.url;

        */

        // Sending headers
        const tokenStorage = new TokenStorage();
        const headersObj: any = { Accept: 'application/json' };
        let TOKEN_KEY = 'MockAuthToken';
        let apiUrl = environment.mockApiUrl;
        if (req.headers.get('isLive') === 'true') {
            TOKEN_KEY = 'AuthToken';
            apiUrl = environment.apiUrl;
        }
        if (tokenStorage.getToken(TOKEN_KEY)) {
            headersObj.Authorization = 'Bearer ' + tokenStorage.getToken(TOKEN_KEY);
        }
        const url = req.url[0] === '/' ? apiUrl + req.url : req.url;
        return next.handle(req.clone({
            url,
            headers: new HttpHeaders(headersObj)
        }));
    }
}
