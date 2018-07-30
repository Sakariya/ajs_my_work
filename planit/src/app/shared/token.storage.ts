import { Injectable } from '@angular/core';
import { overrideProvider } from '../../../node_modules/@angular/core/src/view';
const TOKEN_KEY = 'AuthToken';

@Injectable()
export class TokenStorage {

    public signOut() {
        window.sessionStorage.removeItem(TOKEN_KEY);
        window.sessionStorage.clear();
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.clear();
    }

    /*
    public saveToken(token: string, is_save: boolean) {
        if (is_save) {
            window.localStorage.removeItem(TOKEN_KEY);
            window.localStorage.setItem(TOKEN_KEY, token);
        } else {
            window.sessionStorage.removeItem(TOKEN_KEY);
            window.sessionStorage.setItem(TOKEN_KEY, token);
        }
    }

    static get token(): string {
        return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    }

    static get exists(): boolean {
        return !!TokenStorage.token;
    }
    */

    public saveToken(token: string, is_save: boolean, token_key: string) {
        if (is_save) {
            window.localStorage.removeItem(token_key);
            window.localStorage.setItem(token_key, token);
        } else {
            window.sessionStorage.removeItem(token_key);
            window.sessionStorage.setItem(token_key, token);
        }
    }

    public getToken(token_key) {
        return localStorage.getItem(token_key) || sessionStorage.getItem(token_key);
    }
    public tokenExists(token_key): boolean {
        return !!this.getToken(token_key);
    }
}
