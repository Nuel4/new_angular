import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../core/http-wrapper.service'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private baseAuthenticationUrl: string = environment.api.authentication.base_authenticationApi_url + 'TokenAuthentication';
    private physicianUrl: string = environment.api.authentication.base_authenticationApi_url + 'Physicians';
    constructor(private _httpwrapperservice: HttpWrapperService,private _http: HttpClient) {
    }
    getToken(credentials: any): Observable<any> {
        // console.log('this.baseAuthenticationUrl')
        // console.log(this.baseAuthenticationUrl)
        return this._httpwrapperservice.post(this.baseAuthenticationUrl, credentials).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getOptionsList(): Observable<any> {
        return this._httpwrapperservice.get(environment.api.authentication.base_authenticationApi_url + 'Options').pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getPhysiciansById(data): Observable<any> {
        return this._http.get(this.physicianUrl + `/${data}`).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getPhysicianbyUserId(param): Observable<any> {
        return this._http.get(this.physicianUrl + '/GetPhysicianIDByUserId', { params: param }).pipe(map((response: Response) => response),
            catchError(this.handleError)
        )
    }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'AuthenticationService error');
    }
}
