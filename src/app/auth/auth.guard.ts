import { CanActivateChild, CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CredentialResponse } from './model/auth/credentialResponse';
import { AuthService } from './auth.service';
import { ROLE, ROLE_MAPPER } from './role';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad{
    constructor(private authService : AuthService,
        private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.isLoggedIn.pipe(
            take(1),
            map((isLoggedIn: boolean) => {
                if(!isLoggedIn){
                    this.redirectToLogin();
                    return false;
                }

                const loggedUser: CredentialResponse = this.authService.LoggedUser;
                if(loggedUser != null && loggedUser.authenticated){
                    for(let role in ROLE) {
                        let checkAuthRole!: boolean;
                        debugger
                        loggedUser.authorities.forEach(el => checkAuthRole = el.authority == role);
                        if(checkAuthRole){
                            debugger
                            let access = AuthService.checkAuthUser(loggedUser, ROLE_MAPPER[role]);

                            if(!access && checkAuthRole){
                                this.redirectToLogin();
                            }

                            return access;
                        }
                    }
                }

                return false;
            })
        );
    }

    private redirectToLogin(){
        this.router.navigate(['login']);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return true;
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return true;
    }
};
