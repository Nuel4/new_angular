import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class UploadService {
    private baseUrl: string = environment.api.inventory.base_inventory_url;

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    uploadItems(data:any): Observable<any> {
        return this._httpwrapperservice.post(this.baseUrl + 'InvItemMasters/Upload', data).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    uploadBatch(data:any): Observable<any> {
        return this._httpwrapperservice.post(this.baseUrl + 'InvBatchMasters/Upload', data).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'UploadService error');
    }
}
