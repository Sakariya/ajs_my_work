import { AppState, getIsLoggedIn } from './app.reducer';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const observable = this.store.select(getIsLoggedIn);

        observable.subscribe(authenticated => {
            if (!authenticated) {
                this.router.navigate(['./']);
            }
        });

        return observable;
    }
}
