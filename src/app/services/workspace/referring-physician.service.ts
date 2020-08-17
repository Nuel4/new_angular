import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class ReferringPhysicianService {
    private baseRefPhysicianUrl: string = environment.api.workspace.base_workspaceApi_url + 'ReferringPhysicians';

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getAllReferringPhysicians(): Observable<any> {
        return this._httpwrapperservice.get(this.baseRefPhysicianUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getAllReferringPhysiciansPaged(filter: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseRefPhysicianUrl + '/GetAllReferringPhysiciansPaged?offset=' + filter.offset + '&limit=' + filter.limit + '&orderByDesc=' + filter.orderbydesc).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getAllReferringPhysiciansPagedWithFilters(filter: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseRefPhysicianUrl + '/GetReferringPhysicianPagedwithFilters?pOffset=' + filter.offset + '&pLimit=' + filter.limit + '&pLastname=' + filter.lastname + '&pFirstname=' + filter.firstname + '&pOrgId=' + filter.relorgid).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getReferringPhysicianPagedwithNameFilter(filter: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseRefPhysicianUrl + '/GetReferringPhysicianPagedwithNameFilter?pOfset=' + filter.offset + '&pLimit=' + filter.limit + '&pName=' + filter.name + '&pOrgId=' + filter.relorgid).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getReferringPhysiciansById(referringPhysicianId: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseRefPhysicianUrl + '/' + referringPhysicianId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addReferringPhysician(form: any): Observable<any> {
        return this._httpwrapperservice.post(this.baseRefPhysicianUrl, form).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    updateReferringPhysician(form: any): Observable<any> {
        return this._httpwrapperservice.put(this.baseRefPhysicianUrl, form).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    deleteReferringPhysician(form: any) {
        return this._httpwrapperservice.deleteWithBody(this.baseRefPhysicianUrl, form).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'ReferringPhysicianService error');
    }
}
