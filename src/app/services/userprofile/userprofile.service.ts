import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class UserProfileService {
    private baseUserProfileUrl: string = environment.api.userprofile.base_userprofileApi_url + 'users';

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getUserByApplicationUserId(appUserId: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseUserProfileUrl + '/GetUserByApplicationUserId?Id=' + appUserId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetAppUserInfo(appUserId: any): Observable<any> {
        return this._httpwrapperservice.get(environment.api.userprofile.base_userprofileApi_url + 'CoreDomain/GetAppUserInfo?appuserId=' + appUserId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    GetApplicationUserById(userId): Observable<any> {
        return this._httpwrapperservice.get(environment.api.userprofile.base_userprofileApi_url + 'CoreDomain/GetApplicationUserById?appuserId=' + userId).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    UpdateAppUserInfo(userInfo): Observable<any> {
        return this._httpwrapperservice.put(environment.api.userprofile.base_userprofileApi_url + 'CoreDomain/UpdateAppUserInfo', userInfo).pipe(
            map((response) => response),
            catchError(this.handleError)
        )
    }
    updateForgetPassword(data):Observable<any>{
        return this._httpwrapperservice.post(environment.api.userprofile.base_userprofileApi_url +'CoreDomain/ForgotPassword',data).pipe(
            map((response) => response),
            catchError(this.handleError)
        )
    }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'UserProfileService error');
    }
}
