import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { reject } from 'q';
import { promise } from 'protractor';

@Injectable({
    providedIn: 'root'
})
export class PhysicianService {
    private basePhysicianUrl: string = environment.api.practice.base_practiceApi_url + 'Physicians';
private baseurl: string = environment.api.practice.base_practiceApi_url;
    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getPhysicians(): Observable<any> {
        return this._httpwrapperservice.get(this.basePhysicianUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    
    getPhysicianWithMinimumDetails(): Observable<any> {
        return this._httpwrapperservice.get(this.basePhysicianUrl + '/GetPhysicianWithMinimumDetails').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getPos(): Observable<any> {
        return this._httpwrapperservice.get(this.baseurl+"PlaceOfService/GetPOSByAllFacility" ).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    // getPos(): Promise<any>{
    //     return this._httpwrapperservice.get(this.baseurl+"PlaceOfService/GetPOSByAllFacility").toPromise().then(res=> res).catch(err => { return this.handleError(err)})
    // }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'PhysicianService error');
    }
}
