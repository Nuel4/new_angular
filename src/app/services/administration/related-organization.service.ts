import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class RelatedOrganizationService {
    private baseRelOrganizationUrl: string = environment.api.workspace.base_workspaceApi_url + 'RelatedOrganizations';

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getActiveRelatedOrganizations(): Observable<any> {
        return this._httpwrapperservice.get(this.baseRelOrganizationUrl+'/GetActiveRelatedOrganizations').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'RelatedOrganizationService error');
    }
}