import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';


@Injectable({
    providedIn: 'root'
})
export class BatchesService {
    private baseInvBatchMasters: string = environment.api.inventory.base_inventory_url + 'InvBatchMasters/';

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getInvBatchMastersData(): Observable<any> {
        return this._httpwrapperservice.get(this.baseInvBatchMasters).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvBatchMastersDataById(categoryId: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseInvBatchMasters + categoryId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getAllInvBatchByItemCode(code) {
        return this._httpwrapperservice.get(this.baseInvBatchMasters + 'GetAllInvBatchByItemCode?itemCode=' + code).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addNewInvBatch(data: any): Observable<any> {
        console.log(data);
        return this._httpwrapperservice.post(this.baseInvBatchMasters, data).pipe(
          map((response) => response),
          catchError(this.handleError));
    }



    updateInvBatchMaster(data: any) {
        return this._httpwrapperservice.put(this.baseInvBatchMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    deleteInvBatchMaster(data: any) {
        return this._httpwrapperservice.deleteWithBody(this.baseInvBatchMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }


    private handleError(error) {
        // console.error(error);
        return Observable.throw(error || 'BatchesService error');
    }
}
