import { Injectable } from '@angular/core'
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import {  AuthenticationStore } from './authentication-store';
import {Router} from "@angular/router";
import {catchError} from "rxjs/internal/operators";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    token: string;
    constructor(private authStore:AuthenticationStore, private router: Router)
    { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        if(this.authStore.token)
        {
            //console.log("AuthenticationInterceptor:" + this.authStore.token);
            this.token = this.authStore.token
        }
        
        // const token =  `Bearer ` +  sessionStorage.getItem("token");
        // console.log(token)
        // const cloneRequest = req.clone({
        //     headers: req.headers.append('Authorization', token)
        //   });
        if (sessionStorage.getItem("token")) {
            let token = `Bearer ${this.authStore.token}`;
            // console.log(token)
            req = req.clone({
              setHeaders: {
                // Authorization: 'Bearer ' + sessionStorage.getItem("token");
                Authorization: token
              }
            });
          }
                
          //  else if(sessionStorage.getItem("AuthenticateAsync")){
          //   debugger;
          //   // this.authStore.token = null; 
          //   // console.log(this.authStore.token)
          //   let AuthenticateAsync = `Bearer ${this.authStore.AuthenticateAsync}`;
          //   req = req.clone({
          //     setHeaders: {
          //       Authorization: AuthenticateAsync
          //     }
          //   })
          // }
        // return next.handle(cloneRequest);
        return next.handle(req).pipe(catchError((error, caught) => {
            //intercept the respons error and displace it to the console
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