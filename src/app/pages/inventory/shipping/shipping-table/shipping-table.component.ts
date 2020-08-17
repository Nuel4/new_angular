import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ShippingService } from '../../../../services/inventory/shipping/shipping.service';
import { OrderService } from '../../../../services/inventory/order/order.service';


@Component({
    selector: 'app-shipping-table',
    templateUrl: './shipping-table.component.html',
    styleUrls: ['./shipping-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShippingTableComponent implements OnInit {

    shippingData: any = [];
    shippingsDetails: any = {};
    InvShippingDetailCols: any;
    orderStatus: any = [];
    shippingStatus: any = [];
    shippingDataWithName: any = [];
    InvOrderItems: any = [];
    isLoader: boolean;
    ShippingItems: any = []
    shippingItemsWithStatus: any = [];
    switchTabsShipping = 'activeShipping';
    selectedShippingColumns: any[];
    selectedShippingDetails: any = [];
    pShippingDetailId: any;
    shippingId: any;
    shippingDetails: any [];
    itemLocation: any [];

    constructor(private service: ShippingService, private orderService: OrderService) {

    }

    ngOnInit() {
        this.isLoader = true;
        this.InvShippingDetailCols = [
            { field: 'InvShippingId', header: 'Shipping Id' },
            { field: 'DateShipped', header: 'Shipping Date' },
            { field: 'DateRecevied', header: 'Date Delivered' },
            { field: 'Name', header: 'Status Name' }
        ];
        this.selectedShippingColumns = [
            { field: 'InvShippingDetailsId', header: 'Shipping Detail Id' },
            { field: 'InvOrderMasterId', header: 'Order Master Id' },
            { field: 'OrderPartNumber', header: 'Order Part' },
            { field: 'DateCreated', header: 'Date Created' },
            { field: 'DateLastUpdated', header: 'Last Updated' }
        ]
        this.getInvShippings();
        this.getItemLocation();

    }

    getItemLocation() {
        this.service.getItemLocation().subscribe(resp => {
            this.itemLocation = resp
            console.log(' item loctaion', this.itemLocation)
        });
    }

    getInvShippings() {
        this.service.getInvShippings().subscribe(resp => {
            console.log('resp');
            console.log(resp);
            this.shippingData = resp
            console.log('this.shippingData');
            console.log(this.shippingData)
            this.getInvShippingStatus();
        });
    }

    getInvShippingStatus() {
        this.service.getShippingStatus().subscribe(resp => {
            this.shippingStatus = resp
            console.log(this.shippingStatus)
            for (let i = 0; i < this.shippingData.length; i++) {
                console.log('this.invItemDatas', this.shippingData[i].Status);
                for (let j = 0; j < this.shippingStatus.length; j++) {
                    if (this.shippingStatus[j].InvTaxonomyItemId === this.shippingData[i].Status) {
                        this.shippingData[i].Name = this.shippingStatus[j].Name;
                    }
                }
            }
            this.shippingDataWithName = this.shippingData.reverse()
            console.log('updated status', this.shippingDataWithName)
            this.isLoader = false;
        });
    }

    viewShipping(data) {
        console.log(data)
        this.shippingsDetails = {
            DateShipped: this.parseDate(data.DateShipped),
            DateRecevied: this.parseDate(data.DateRecevied),
            Status: data.Status,
            DateLastUpdated: data.DateLastUpdated,
            LastUpdatedByUserId: data.LastUpdatedByUserId,
            DateCreated: this.parseDate(data.DateCreated),
            CreatedByUserId: data.CreatedByUserId,
            InvShippingId: data.InvShippingId
        };
        this.InvOrderItems = data.InvShippingDetails;
        this.shippingId = data.InvShippingId
        console.log('shipping id', this.shippingId)
        this.switchTabsShipping = 'selectedShipping'
        this.service.getInvShippingDetails(this.shippingId).subscribe(resp => {
            this.shippingDetails = resp
            console.log('shipping details', this.shippingDetails)
        });
        this.service.GetShippingWithDetailandItems(this.shippingId).subscribe(resp => {
            this.selectedShippingDetails = resp.InvShippingDetails
            console.log('selected shipping details', this.selectedShippingDetails)
        });
    }
    onExpand(event) {
        console.log('success')
        console.log(event)
        this.pShippingDetailId = event.InvShippingDetailsId;
        console.log('pShippingDetailId')
        console.log(this.pShippingDetailId)

        this.service.getShippingItemsByDetailId(this.pShippingDetailId)
            .subscribe(resp => {
                console.log('The Item response')
                console.log(resp)
                this.ShippingItems = resp;
            })
        // this.getInvOrderStatus();
    }

    backToShip() {
        this.switchTabsShipping = 'activeShipping'
    }
    getInvOrderStatus() {
        this.orderService.getOrderStatus().subscribe(resp => {
            this.shippingStatus = resp
            console.log(this.shippingStatus)
            if (this.ShippingItems) {
                for (let i = 0; i < this.ShippingItems.length; i++) {
                    console.log('this.invItemDatas', this.ShippingItems[i].Status);
                    for (let j = 0; j < this.shippingStatus.length; j++) {
                        if (this.shippingStatus[j].InvTaxonomyItemId === this.ShippingItems[i].Status) {
                            this.ShippingItems[i].Name = this.shippingStatus[j].Name;
                        }
                    }
                }
            }
            this.shippingItemsWithStatus = this.ShippingItems
            console.log('final shipping', this.shippingItemsWithStatus)
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
    updateShippingItem(datas , location) {
        console.log('datas')
        console.log(datas)
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 20);

        const userDetails = JSON.parse(sessionStorage.getItem('UserDetail'));
        console.log('uer details', userDetails)
        for (let i = 0; i < datas.length; i++) {
            datas[i].DateCreated = userDetails.DateCreated;
            // remove this condition later.. and take valau from var.
            datas[i].ManufacturedDate = userDetails.DateCreated; // date.toString();
            // datas[i].ManufacturedDate === ' ' ? : datas[i].ManufacturedDate;
            // datas[i].ExpiryDate =  userDetails.DateCreated;
            datas[i].OrderPartNumber = 1;
            datas[i].LastUpdatedByUserId = userDetails.UserId;
            // datas[i].LotNumber = parseInt( datas[i].LotNumber )
        }
        console.log('data from details', datas)

        this.service.SaveShippingItems(datas).subscribe(resp => {
            // this.SavedShippingItems = resp
            console.log('this.SavedShippingItems')
            // console.log(this.SavedShippingItems)
            // $('#myModalItems').modal('hide');
        });
    }
}
