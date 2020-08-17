import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';


@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private baseInvCategoryMasters: string = environment.api.inventory.base_inventory_url + 'InvCategoryMasters/';
    private storeUrl: string = environment.api.inventory.base_inventory_url + environment.api.inventory.getStores;
    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getInvCategoryMastersData(): Observable<any> {
        return this._httpwrapperservice.get(this.baseInvCategoryMasters).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvCategoryMastersDataById(categoryId: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseInvCategoryMasters + categoryId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addNewInvCategory(data: any): Observable<any> {
        console.log(data);
        return this._httpwrapperservice.post(this.baseInvCategoryMasters, data).pipe(
          map((response) => response),
          catchError(this.handleError));
    }

    updateInvCategoryMaster(data: any) {
        return this._httpwrapperservice.put(this.baseInvCategoryMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    deleteInvCategoryMaster(data: any) {
        return this._httpwrapperservice.deleteWithBody(this.baseInvCategoryMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    getInvStores() {
        return this._httpwrapperservice.get(this.storeUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }


    private handleError(error) {
        // console.error(error);
        return Observable.throw(error || 'InvCategoryMastersService error');
    }
}
