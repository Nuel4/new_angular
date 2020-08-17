import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ShippingService } from '../../../../services/inventory/shipping/shipping.service';
import { OrderService } from '../../../../services/inventory/order/order.service';

@Component({
    selector: 'app-shipping-order',
    templateUrl: './shipping-order.component.html',
    styleUrls: ['./shipping-order.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShippingOrderComponent implements OnInit {

    @ViewChild('myModal') private _poup: ElementRef;
    storeData: any = [];
    shippingData: any = [];
    selectedShippingData = {};
    shippingsDetails: any = {};
    searchOrder: any = {};
    searchResults: any = [];
    orderSippingStatus: any = [];
    orderStatus: any = [];
    searchCols: any = [];
    InvShippingDetailCols: any;
    switchTabs = 'home';
    DateCreated;
    tmpSelectedShippingOrders: any = [];
    InvOrderItems: any = [];
    InvOrderItemsTemp: any = [];
    shippedResponse: any
    shippingDisabled: boolean;
    PostShipped: boolean;
    CloseShipped: boolean;
    DeliverShipped: boolean;
    parentId: any = '';
    loading = false;
    isLoader = true;

    constructor(private service: ShippingService, private orderService: OrderService) {
        this.PostShipped = false;
        this.CloseShipped = true;
        this.DeliverShipped = true;
    }

    ngOnInit() {
    }

    // NewShipping() {
    //     this.switchTabs = 'selected';
    //     this.shippingsDetails = {};
    //     this.shippingDisabled = false;
    // }

    orderShippingStatus() {
        const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
        for (let i = 0; i < data.length; i++) {
            if (data[i].InvTaxonomyMasterId === 4) {
                this.orderSippingStatus.push(data[i]);
            }
        }
    }

    getTaxonomyOrderStatus() {
        const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
        for (let i = 0; i < data.length; i++) {
            if (data[i].InvTaxonomyMasterId === 1) {
                this.orderStatus.push(data[i]);
            }
        }
    }

    // findOrders(datas) {
    //     this.searchResults = [];
    //     let data = {
    //         InvOrderMasterId: +datas.InvOrderMasterId,
    //         DateOfOrder: this.parseDate(datas.DateOfOrder),
    //         Status: +datas.Status
    //     }
    //     this.orderService.searchOrders(data).subscribe(resp => {
    //         this.searchResults = resp;
    //     });
    // }

    createShip(datas) {
        this.shippingsDetails = datas;
        console.log('shippingDetail')
        console.log(this.shippingsDetails)
        const today = new Date();
        const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const data = {
            DateShipped: this.parseDate(datas.DateShipped),
            DateRecevied: null,
            Status: 100,
            DateCreated: date,
            CreatedByUserId: UserDetail.UserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: UserDetail.UserId
        }
        console.log(data)
        this.loading = true;
        this.service.updateInvShippingMaster(data).subscribe(resp => {
            console.log('resp from post')
            console.log(resp.InvShippingId)
            this.parentId = resp.InvShippingId;
            console.log(this.parentId)
            this.shippingDisabled = true;
            this.CloseShipped = true;
            this.DeliverShipped = true;
            this.loading = false;
        });
    }


    parseDate(date) {
        if (date) {
            const d = new Date(Date.parse(date));
            return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        } else {
            return null;
        }
    }

    getShippingStatus(id) {
        const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
        const status = data.find(data.InvTaxonomyItemId === id);
        return status.Name;
    }

    putShippingStatusShipped(id, data) {
        this.DeliverShipped = false;
        this.PostShipped = true;
        this.service.putShippingStatusShipped(id, { StatusCode: 'INTRNST' }, data).subscribe(resp => {
            this.shippedResponse = resp
            console.log('this.shippedResponse')
            console.log(this.shippedResponse)
        });

    }
    putShippingStatusDelivered(id) {
        this.CloseShipped = false;
        this.DeliverShipped = true;
        this.service.putShippingStatusDelivered(id, { StatusCode: 'DLVERD' }).subscribe(resp => {
            this.shippedResponse = resp
        });
    }
    putShippingStatusClosed(id) {
        this.CloseShipped = true;
        this.service.putShippingStatusClosed(id, { StatusCode: 'CLOSD' }).subscribe(resp => {
            this.shippedResponse = resp
        });
    }

    displayArray(data) {
        console.log('component Array', data);
    }
}
