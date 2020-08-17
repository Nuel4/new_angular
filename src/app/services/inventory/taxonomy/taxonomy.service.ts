import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class TaxonomyService {
    private baseUrl: string = environment.api.inventory.base_inventory_url;

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getTaxonomyItemDetails(): Observable<any> {
        // console.log('response');
        return this._httpwrapperservice.get(this.baseUrl + 'InvTaxonomyItems').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'TaxonomyService error');
    }
}
