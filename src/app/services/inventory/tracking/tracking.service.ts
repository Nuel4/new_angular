import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';


@Injectable({
    providedIn: 'root'
})
export class TrackingService {
    private BaseUrl:string = environment.api.inventory.base_inventory_url;
    private baseTrackingMasters: string = environment.api.inventory.base_inventory_url + 'InvInventoryTrackings/';
    private transactiontype: string = environment.api.inventory.base_inventory_url + environment.api.inventory.taxonomyItems;
    private getPatient:string = environment.api.inventory.base_inventory_url + 'Patients/';
    private getUser:string = environment.api.inventory.base_inventory_url + 'Users/';

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getAllInvTracking(): Observable<any> {
        return this._httpwrapperservice.get(this.baseTrackingMasters).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvTrackingById(id: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseTrackingMasters + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addNewInvTracking(data: any): Observable<any> {
        console.log(data);
        return this._httpwrapperservice.post(this.baseTrackingMasters, data).pipe(
          map((response) => response),
          catchError(this.handleError));
    }

    deleteInvTracking(data:any){
        return this._httpwrapperservice.deleteWithBody(this.baseTrackingMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    gettransactionType(){
        return this._httpwrapperservice.get(this.transactiontype).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getUserDetails(id){
        return this._httpwrapperservice.get(this.getUser + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getPatientDetails(id){
        return this._httpwrapperservice.get(this.getPatient + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    scanAndGetItem(code){
        return this._httpwrapperservice.get(this.BaseUrl + 'InvBatchMasters/GetAllInvBatchByItemCode?itemCode=' + code).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    // getInvStores(){
    //     return this._httpwrapperservice.get(this.storeUrl).pipe(
    //         map((response) => response),
    //         catchError(this.handleError));
    // }

    // getCategoryMasters(){
    //     return this._httpwrapperservice.get(this.categoryUrl).pipe(
    //         map((response) => response),
    //         catchError(this.handleError));
    // }

    // changeStatus(id, status){
    //     return this._httpwrapperservice.putWithQueryParam(this.baseInvItemMasters + 'SetIsActivate?pItemMasterId='+id+'&pIsActivate='+status).pipe(
    //         map((response) => response),
    //         catchError(this.handleError)
    //     );
    // }

    // searchItems(data){
    //     let name = data.InvItemMasterName,
    //         code = data.ItemCode,
    //         category = data.InvCategory,
    //         status = (data.IsActive == "true");
    //     return this._httpwrapperservice.get(this.baseInvItemMasters+'Search?pDescription='+name+'&pCode='+code+'&pIsActive='+status+'&pCategoryId='+category).pipe(
    //         map((response) => response),
    //         catchError(this.handleError)
    //     );
    // }

    private handleError(error) {
        // console.error(error);
        return Observable.throw(error || 'TrackingService error');
    }
}
