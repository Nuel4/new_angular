import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';


@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private baseInvItemMasters: string = environment.api.inventory.base_inventory_url + 'InvItemMasters/';
    private storeUrl: string = environment.api.inventory.base_inventory_url + environment.api.inventory.getStores;
    private categoryUrl: string = environment.api.inventory.base_inventory_url + environment.api.inventory.getCategories;
    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getInvItemMastersData(): Observable<any> {
        return this._httpwrapperservice.get(this.baseInvItemMasters).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvItemMastersDataByOffset(offset , data): Observable<any> {
        let url: any = '';

        data.pcode && data.pIsActive && data.pCategoryId ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pcode=' + data.pcode + '&pIsActive=' + data.pIsActive + '&pCategoryId=' + data.pCategoryId :

        data.pCategoryId && data.pcode ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pCategoryId=' + data.pCategoryId + '&pcode=' + data.pcode :

        data.pCategoryId && data.pIsActive ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pCategoryId=' + data.pCategoryId + '&pIsActive=' + data.pIsActive :

        data.pcode && data.pIsActive ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pcode=' + data.pcode + '&pIsActive=' + data.pIsActive :

        data.pcode ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pcode=' + data.pcode :

        data.pIsActive ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pIsActive=' + data.pIsActive :

        data.pCategoryId ? url = this.baseInvItemMasters + 'SearchWithPage?pOffset='
        + offset + '&pLimit=10' + '&pCategoryId=' + data.pCategoryId :

        url = this.baseInvItemMasters + 'SearchWithPage?pOffset=' + offset + '&pLimit=10'

        
        return this._httpwrapperservice.get(url).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvItemMastersDataById(categoryId: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseInvItemMasters + categoryId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addNewInvItem(data: any): Observable<any> {
        console.log(data);
        return this._httpwrapperservice.post(this.baseInvItemMasters, data).pipe(
          map((response) => response),
          catchError(this.handleError));
    }

    updateInvItemMaster(data: any) {
        return this._httpwrapperservice.put(this.baseInvItemMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    deleteInvItemMaster(data: any) {
        return this._httpwrapperservice.deleteWithBody(this.baseInvItemMasters, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    getInvStores() {
        return this._httpwrapperservice.get(this.storeUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getCategoryMasters() {
        return this._httpwrapperservice.get(this.categoryUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    changeStatus(id, status) {
        return this._httpwrapperservice.putWithQueryParam(this.baseInvItemMasters +
            'SetIsActivate?pItemMasterId=' + id + '&pIsActivate=' + status).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    searchItems(data) {
        const name = data.InvItemMasterName,
            code = data.ItemCode,
            category = data.InvCategory,
            status = (data.IsActive === 'true');
        return this._httpwrapperservice.get(this.baseInvItemMasters +
            'Search?pDescription=' + name + '&pCode=' + code + '&pIsActive=' + status + '&pCategoryId=' + category).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    private handleError(error) {
        // console.error(error);
        return Observable.throw(error || 'InvItemMastersService error');
    }
}
