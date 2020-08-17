import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ShippingService } from '../../../../services/inventory/shipping/shipping.service';
import { OrderService } from '../../../../services/inventory/order/order.service';

declare var $: any;
@Component({
    selector: 'app-shipping-detail',
    templateUrl: './shipping-detail.component.html',
    styleUrls: ['./shipping-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})

@Injectable()
export class ShippingDetailComponent implements OnInit {

    @Input() parentId: any = '';
    @Output() childEvent = new EventEmitter();
    OrdersToBeShipped: any = [];
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
    InvNewShippings: any = [];
    InvShippingItems: any = [];
    InvOrderItemsTemp: any = [];
    newShippingToBeAdded: any = [];
    shippingDisabled: false;
    respStore: any = {}
    ShippingItems: any = {}
    ShippingitemData: any = {
        InvItemMasterName: '',
        InvCategory: '',
        InvStore: '',
        ItemCode: '',
        UOM: '',
        ThresholdQuantity: '',
        IsActive: true
    };
    isChecked: true;
    SavedShippingItems: any = {}
    ShippingOrdersSelected: any = [];
    dataFromPostResp: any = {};
    pShippingDetailId: any = ''
    loading = false;
    shippingStatus: any = [];
    shippingItemsWithStatus: any = [];
    itemLocation: any;

    public size: number;
    public square: number;

    constructor(private service: ShippingService, private orderService: OrderService) {
    }

    ngOnInit() {

        this.InvNewShippings = [
            { field: 'InvShippingDetailsId', header: 'Shipping Detail Id' },
            { field: 'InvOrderMasterId', header: 'Order Master Id' },
            { field: 'OrderPartNumber', header: 'Order Part' },
            { field: 'DateCreated', header: 'Date Created' },
            { field: 'DateLastUpdated', header: 'Last Updated' }
        ];
        this.searchCols = [
            { field: 'InvOrderMasterId', header: 'Order Master Id' },
            { field: 'Description', header: 'Description' },
            { field: 'InvStoreId', header: 'Store Id' },
            { field: 'Status', header: 'Status' },
            { field: 'DateCreated', header: 'Created At' }
        ]
        this.InvShippingItems = [
            { field: 'InvItemMasterName', header: 'Item Master Name' },
            { field: 'Status', header: 'Status' },
            { field: 'OrderedQuanity', header: 'Order Quantity' },
            { field: 'OrderPartNumber', header: 'Order Part Number' },
            { field: 'RemainingQuantity', header: 'Remaining Quantity' },

            { field: 'BatchNumber', header: 'Batch Number' },
            { field: 'BatchCode', header: 'Batch Code' },
            { field: 'LotNumber', header: 'Lot Number' },
            { field: 'ManufacturedDate', header: 'Manufactured Date' },
            { field: 'ItemLocationId', header: 'Item Location' }

        ]

        // this.searchResults = [
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '2', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '3', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '4', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '5', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '6', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '7', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '8', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '9', InvStoreId: '2', Status: '2' },
        //     { DateCreated: 'Audi', Description: 'Audi', InvOrderMasterId: '10', InvStoreId: '2', Status: '2' },
        // ]

        this.InvShippingDetailCols = [
            { field: 'InvShippingId', header: 'Shipping Id' },
            { field: 'DateShipped', header: 'Shipping Date' },
            { field: 'DateRecevied', header: 'Date Delivered' },
            { field: 'Status', header: 'Status' }
        ];

        // this.getInvShippings();
        // this.getInvShippings();
        this.getInvStoreData();
        this.orderShippingStatus();
        this.getTaxonomyOrderStatus();
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
        });
    }

    backToHome() {
        this.shippingsDetails = {};
        this.switchTabs = 'home';
        this.shippingDisabled = false;
    }


    // NewShipping() {
    //     this.switchTabs = 'selected';
    //     this.shippingsDetails = {};
    //     this.shippingDisabled = false;
    // }

    // getInvShippings() {
    //     this.service.getInvShippings().subscribe(resp => {
    //         this.shippingData = resp
    //         console.log(this.shippingData)
    //     });
    // }

    orderShippingStatus() {
        const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
        for (let i = 0; i < data.length; i++) {
            if (data[i].InvTaxonomyMasterId === 4) {
                this.orderSippingStatus.push(data[i]);
            }
        }
    }

    getInvStoreData() {
        this.service.getInvStores().subscribe(resp => {
            this.storeData = resp
        });
    }

    StoreChangeChange(event) {
        console.log(event);
        this.loading = true;
        this.orderService.GetOrderToBeShipped(event).subscribe(resp => {
            console.log('resp from storechangechange')
            console.log(resp)
            this.loading = false;
            this.searchResults = resp
            this.childEvent.emit(this.searchResults);
        });
    }

    GetOrderToBeShipped() {
        const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
        this.orderService.GetOrderToBeShipped(UserDetail.InvStoreId).subscribe(resp => {
            // this.storeData = resp
            console.log(resp)
        });
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

    onAddToShip(event) {
        console.log(this.parentId)
        // event.data.InvShippingId = this.parentId;
        console.log('event.data')
        console.log(event)

        event.forEach((key) => {
            key['InvShippingId'] = this.parentId;
        })
        this.ShippingOrdersSelected = event
        console.log('this.ShippingOrdersSelected', this.ShippingOrdersSelected);
        console.log('this.InvOrderItemsTemp', this.InvOrderItemsTemp);
        // if (this.InvOrderItemsTemp.length > 0) {
        //     var arr = this.InvOrderItemsTemp.filter((item) => item.InvOrderMasterId === event.data.InvOrderMasterId)
        //     arr.length > 0 ? null :
        this.postInvShippingDetails(this.ShippingOrdersSelected)
        // }
        // else {
        //     this.postInvShippingDetails(this.ShippingOrdersSelected)
        this.GetShippingOrder(this.parentId)
        // }
    }

    postInvShippingDetails(data) {
        console.log('data', data)
        this.loading = true;
        this.service.postInvShippingDetails(data).subscribe(resp => {
            this.dataFromPostResp = resp;
            console.log('data from post')
            console.log(resp)
        });
        // this.GetShippingOrder(this.parentId)
        this.loading = false;
    }

    GetShippingOrder(id) {
        console.log('onSelect');
        console.log(this.parentId);
        this.service.getInvShippingOdersDetails(this.parentId)
            .subscribe((response: Response) => {
                console.log('response from popup', response)
                this.InvOrderItemsTemp = this.InvOrderItemsTemp.concat(response);
            })
        console.log('The Temp Value json :', this.InvOrderItemsTemp)
        $('#myModal').modal('hide');
    }

    // onSelect() {
    //     console.log('onSelect');
    //     console.log(this.parentId);
    //     this.service.getInvShippingOdersDetails(this.parentId)
    //         .subscribe((response: Response) => {
    //             console.log('The response is ', response);
    //             this.InvOrderItemsTemp = this.InvOrderItemsTemp.concat(response);
    //         })
    //     console.log('The Temp Valeu json :', this.InvOrderItemsTemp)
    // }

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
        this.getInvOrderStatus();
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
            this.InvOrderItemsTemp.InvShippingItems = this.shippingItemsWithStatus;
            console.log('new items with status', this.InvOrderItemsTemp.InvShippingItems)
            console.log('updated status', this.InvOrderItemsTemp)
        });
    }


    updateShippingItem(datas) {
        console.log('datas')
        console.log(datas)
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 20);

        const userDetails = JSON.parse(sessionStorage.getItem('UserDetail'));
        console.log('uer details', userDetails)
        for (let i = 0; i < datas.length; i++) {
            datas[i].DateCreated = userDetails.DateCreated;
            // remove this condition later.. and take valau from var.
            datas[i].ManufacturedDate = date.toString(); // datas[i].ManufacturedDate === ' ' ? : datas[i].ManufacturedDate;
            // datas[i].ExpiryDate =  userDetails.DateCreated;
            datas[i].OrderPartNumber = 1;
            datas[i].LastUpdatedByUserId = userDetails.UserId;
            // datas[i].LotNumber = parseInt( datas[i].LotNumber )
        }
        console.log('data from details', datas)

        this.service.SaveShippingItems(datas).subscribe(resp => {
            this.SavedShippingItems = resp
            console.log('this.SavedShippingItems')
            // console.log(this.SavedShippingItems)
            $('#myModalItems').modal('hide');
        });
    }

    getShippingByParentId() {
        this.service.getShippingByParentId().subscribe(resp => {
            this.storeData = resp
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

    objChanged(event) {
        console.log('new Item Data on select', event)
    }
}
