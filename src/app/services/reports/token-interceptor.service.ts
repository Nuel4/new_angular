import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import {  AuthenticationStore } from '../../authentication/authentication-store';
import {catchError} from "rxjs/internal/operators";
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  token: string;

  constructor(public authStore:AuthenticationStore) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if(this.authStore.AuthenticateAsync)
        {
            this.token = this.authStore.AuthenticateAsync
        }
        if (sessionStorage.getItem("AuthenticateAsync")) {
            let token = `Bearer ${this.authStore.AuthenticateAsync}`;
            req = req.clone({
              setHeaders: {
                Authorization: token
              }
            });
            console.log('qwertyy',token)
          }
                
         
        return next.handle(req).pipe(catchError((error, caught) => {
            console.log(error);
            this.handleAuthError(error);
            return of(error);
          }) as any);
    }
    private handleAuthError(err: HttpErrorResponse): Observable<any> {
      //handle your auth error or rethrow
      if (err.status === 401) {
        //navigate /delete cookies or whatever
        console.log('handled error ' + err.status);
      //   this.router.navigate([`/login`]);
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
        return of(err.message);
      }
      throw err;
    }
}
