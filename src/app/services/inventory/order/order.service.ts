import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';
import { HttpParams, HttpClient } from '@angular/common/http'


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private baseurl: string = environment.api.appointment.base_appointmentApi_url;
    private baseOrderUrl: string = environment.api.inventory.base_inventory_url + 'InvOrderMasters';
    private taxonomyUrl = environment.api.inventory.base_inventory_url + 'InvTaxonomyItems'
    private storeUrl: string = environment.api.inventory.base_inventory_url + environment.api.inventory.getStores;
    private categoryUrl: string = environment.api.inventory.base_inventory_url + environment.api.inventory.getCategories;

    constructor(private _httpwrapperservice: HttpWrapperService,
        private http: HttpClient) {
    }

    getInvOrderMastersData(): Observable<any> {
        return this._httpwrapperservice.get(this.baseOrderUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvOrderMastersDataById(categoryId: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseOrderUrl + '/GetItemMasterById?pItemMasterId=' + categoryId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getOrderItemsByOrderMasterId(id) {
        return this._httpwrapperservice.get(this.baseOrderUrl + '/GetAllOrdersWithFilters?orderNo=' + id + '&withOderItems=true').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getOrderStatus() {
        return this._httpwrapperservice.get(this.taxonomyUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    updateInvOrderMaster(data: any) {
        return this._httpwrapperservice.put(this.baseOrderUrl, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    submitOrders(id, code, data): Observable<any> {
        console.log('id', id);
        console.log('code', code);
        const params = new HttpParams();
        params.set('pOrderId', id);
        params.set('pOrderStatusCode', code);
        return this.http.put(this.baseOrderUrl + '/UpdateOrderStatus?pOrderId=' + id + '&pOrderStatusCode=' + code, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
    GetOrderToBeShipped(storeId) {
        return this._httpwrapperservice.get(this.baseOrderUrl + '/GetOrderTobeShipped?pStoreId=' + storeId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    searchOrders(data) {
        const orderNo = isNaN(data.InvOrderMasterId) ? '' : data.InvOrderMasterId,
            orderDate = isNaN(data.DateOfOrder) ? '' : data.DateOfOrder,
            status = isNaN(data.Status) ? '' : data.Status;

        return this._httpwrapperservice.get(environment.api.inventory.base_inventory_url
            + 'InvOrderMasters/GetAllOrdersWithFilters?orderNo=' + orderNo + '&dateOfOrder=' + orderDate + '&status=' + status).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    createOrder(data) {
        return this._httpwrapperservice.post(environment.api.inventory.base_inventory_url + 'InvOrderMasters', data).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    AddToOrder(id, data) {
        return this._httpwrapperservice.post(environment.api.inventory.base_inventory_url +
            'InvOrderItems/AddToOrder?pUserId=' + 12 + '&pStoreId=' + id, data).pipe(
            map((response) => response),
            catchError(this.handleError));
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

    getLabOrderStatus() {
        return this.http.get(this.baseurl + 'Orders/Status').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getNewOrder(value):Observable<any>{
        return this.http.post(this.baseurl + 'Orders/NewOrder',value).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getOrderSearches() {
        return this.http.get(this.baseurl + 'Orders/ReportsDetailedSearch').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getOrderInbox() {
        return this.http.get(this.baseurl + 'Orders/ReportsInbox').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getTestCode() {
        return this.http.get(this.baseurl + 'Orders/TestCodePreference').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getICD9Code() {
        return this.http.get(this.baseurl + 'Orders/ICD9CodePreference').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getMainPortalOrder(params) {
        return this.http.get(this.baseurl + 'Orders/MainPortal',{params: params}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        // console.error(error);
        return Observable.throw(error || 'OrderService error');
    }
}
