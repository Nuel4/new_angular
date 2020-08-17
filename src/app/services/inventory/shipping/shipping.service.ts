import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../../core/http-wrapper.service'
import { environment } from '../../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { InvOrders } from 'src/app/pages/inventory/shipping/shipping.component';


@Injectable({
    providedIn: 'root'
})
export class ShippingService {
    private data = {};
    private baseUrl: string = environment.api.inventory.base_inventory_url;
    private shippingBaseUrl = environment.api.inventory.base_inventory_url + 'InvShippings/'
    private shippingDetailsUrl = environment.api.inventory.base_inventory_url + 'InvShippingDetails'
    private shippingItemsUrl = environment.api.inventory.base_inventory_url + 'InvShipingItems/'
    private taxonomyUrl = environment.api.inventory.base_inventory_url + 'InvTaxonomyItems'
    private itemLocation = environment.api.inventory.base_inventory_url + 'InvItemLocations/'
    constructor(private _httpwrapperservice: HttpWrapperService) {
    }


    setOption(option, value) {
        this.data[option] = value;
    }

    getOption() {
        return this.data;
    }

    CreateShipping(data) {
        return this._httpwrapperservice.post(this.shippingBaseUrl, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    postInvShippingDetails(data) {
        return this._httpwrapperservice.post(this.shippingDetailsUrl + '/CreateShippingDetails', data)
            .pipe(
                map((response) => response),
                catchError(this.handleError)
            );
    }
    getInvShippingDetails(id) {
        return this._httpwrapperservice.get(this.shippingDetailsUrl + '/' + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvShippingOdersDetails(id) {
        return this._httpwrapperservice.get(this.shippingDetailsUrl + '/GetShipingsByParentId?pShipingId=' + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetShippingWithDetailandItems(id) {
        return this._httpwrapperservice.get(this.shippingBaseUrl + '/GetShippingWithDetailandItems?pShippingId=' + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getShippingItemsByDetailId(id) {
        return this._httpwrapperservice.get(this.shippingItemsUrl + '/GetShipingItemsByDetailId?pShippingDetailId=' + id).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    SaveShippingItems(data) {
        return this._httpwrapperservice.post(this.shippingItemsUrl + 'Save', data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    updateInvShippingMaster(data: any) {
        return this._httpwrapperservice.post(this.shippingBaseUrl, data).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    getItemLocation(): Observable<any> {
        return this._httpwrapperservice.get(this.itemLocation).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInvShippings(): Observable<any> {
        return this._httpwrapperservice.get(this.shippingBaseUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }


    getInvStores() {
        return this._httpwrapperservice.get(this.baseUrl + 'InvStores').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getShippingStatus() {
        return this._httpwrapperservice.get(this.taxonomyUrl).pipe(
            map((response) => response),
            catchError(this.handleError))
    }
    getShippingByParentId() {
        return this._httpwrapperservice.get(this.shippingBaseUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getLabelLinkForSelectedItems(codeText, height, width) {
        return this._httpwrapperservice.get(this.baseUrl + 'BarCodes?pBarCodeText=' + codeText +
            '&pHeight=' + height + '&pWidth=' + width).pipe(
                map((response) => response),
                catchError(this.handleError));
    }

    putShippingStatusShipped(id, statusCode, data) {
        return this._httpwrapperservice.put(this.shippingBaseUrl + '/UpdateShipingStatus?pShipingId='
            + id + 'ShipingStatusCode=' + statusCode, data).pipe(
                map((response) => response),
                catchError(this.handleError));
    }
    putShippingStatusDelivered(id, data) {
        return this._httpwrapperservice.put(this.shippingBaseUrl + '/UpdateShipingStatus?pShipingId=' + id, data).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    putShippingStatusClosed(id, data) {
        return this._httpwrapperservice.put(this.shippingBaseUrl + '/UpdateShipingStatus?pShipingId=' + id, data).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'ShippingService error');
    }

}
