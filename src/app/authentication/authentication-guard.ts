import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationStore } from './authentication-store';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    jwtHelper: JwtHelperService;
    constructor(private router: Router,
        private authStor: AuthenticationStore) {
        this.jwtHelper = new JwtHelperService();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (this.authStor.LoggedIn) {
            let isAuthenticated: boolean = this.isAuthenticated();
            // console.log("AuthenticationGuard:" + isAuthenticated);
            if (isAuthenticated) {
                return true;
            }
            else {
                this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
                return false;
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    private isAuthenticated(): boolean {
        const token = this.authStor.token;
        // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }
}