import { Component, OnInit, ViewEncapsulation, Injectable, ViewChild, ElementRef } from '@angular/core';
import { OrderService } from '../../../services/inventory/order/order.service';
declare var $: any;
import { ToastModule } from 'primeng/toast';
import { ItemService } from '../../../services/inventory/items/items.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class OrderComponent implements OnInit {
  @ViewChild('myModal') private _poup: ElementRef;
  activeOrdersCols: any[];
  itemHeader: any[];
  orderData: any;
  storeData: any = [];
  DateCreated;
  InvOrderMastersData: any = [];
  searchOrder: any = {};
  searchResults: any = [];
  switchTabs = 'activeOrders';
  orderStatus: any = [];
  orderItemStatus: any = [];
  searchCols: any = [];
  orderId: any = {};
  statusCode: any = {};
  shippingStatus: any = [];
  shippingDisabled: boolean;
  InvOrderMastersDatawithStatus: any[];
  InvOrderMastersDatawithStore: any[];
  orderItemDatas: any[];
  itemMasterData: any[];
  selectedItems: any[];
  pStoreId: any;
  isLoader: boolean ;

  constructor(private toastr: ToastrService, private service: OrderService, private itemService: ItemService) { }

  ngOnInit() {
    this.itemHeader = [
      { field: 'InvItemMasterName', header: 'Name' },
      { field: 'InvCategoryId', header: 'Category' },
      { field: 'ItemCode', header: 'Code' },
      { field: 'InvStoreId', header: 'Store' },
      { field: 'Uom', header: 'UOM' },
      { field: 'CurrentQuantity', header: 'Current Quantity' },
      { field: 'ThresholdQuantity', header: 'Threshold Quantity' },
      { field: 'IsActive', header: 'IsActive' }
    ];
    this.activeOrdersCols = [
      { field: 'InvItemMasterName', header: 'Item Name' },
      { field: 'BatchNumber', header: 'Batch No' },
      { field: 'LotNumber', header: 'Lot No' },
      { field: 'OrderedQuantity', header: 'Ordered Quantity' },
      { field: 'ReceivedQuantity', header: 'Received Quantity' },
      { field: 'Status', header: 'Status' },
      { field: 'Comments', header: 'Comments' }
    ];
    this.searchCols = [
      { field: 'InvOrderMasterId', header: 'Order Master Id' },
      { field: 'Description', header: 'Description' },
      { field: 'InvStoreId', header: 'Store Id' },
      { field: 'Status', header: 'Status' },
    ]
    this.getInvOrderMastersData();
    this.getInvStoreData();
    this.getTaxonomyOrderStatus();
    this.getTaxonomyOrderItemStatus();
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success Message');
  }

  showError(msg) {
    this.toastr.success(msg, 'Error Message');
  }

  getInvOrderMastersData() {
    this.isLoader = true
    this.service.getInvOrderMastersData().subscribe(resp => {
      this.InvOrderMastersData = resp;
      console.log('resp', this.InvOrderMastersData)
      this.getInvStoreData();
      this.getInvOrderStatus();
    });
  }

  getInvStoreData() {
    this.service.getInvStores().subscribe(resp => {
      this.storeData = resp
      console.log(this.storeData)
      for (let i = 0; i < this.InvOrderMastersData.length; i++) {
        console.log('this.invItemDatas', this.InvOrderMastersData[i].InvStoreId);
        for (let j = 0; j < this.storeData.length; j++) {
          if (this.storeData[j].InvStoreId === this.InvOrderMastersData[i].InvStoreId) {
            this.InvOrderMastersData[i].StoreName = this.storeData[j].StoreName;
          }
        }
      }
      this.InvOrderMastersDatawithStore = this.InvOrderMastersData
      console.log('updated orders', this.InvOrderMastersData)
    });
  }

  getInvOrderStatus() {
    this.service.getOrderStatus().subscribe(resp => {
      this.shippingStatus = resp
      console.log(this.shippingStatus)
      if (this.InvOrderMastersDatawithStore) {
        for (let i = 0; i < this.InvOrderMastersDatawithStore.length; i++) {
          console.log('this.invItemDatas', this.InvOrderMastersDatawithStore[i].Status);
          for (let j = 0; j < this.shippingStatus.length; j++) {
            if (this.shippingStatus[j].InvTaxonomyItemId === this.InvOrderMastersDatawithStore[i].Status) {
              this.InvOrderMastersDatawithStore[i].Name = this.shippingStatus[j].Name;
            }
          }
        }
      }
      this.InvOrderMastersDatawithStatus = this.InvOrderMastersDatawithStore.reverse()
      console.log('updated status', this.InvOrderMastersDatawithStatus)
      this.isLoader = false
    });
  }

  getTaxonomyOrderStatus() {
    const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
    for (let i = 0; i < data.length; i++) {
      if (data[i].InvTaxonomyMasterId === 1) {
        this.orderStatus.push(data[i]);
      }
    }
    console.log('this.orderStatus')
    console.log(this.orderStatus)
  }

  getTaxonomyOrderItemStatus() {
    const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
    for (let i = 0; i < data.length; i++) {
      if (data[i].InvTaxonomyMasterId === 5) {
        this.orderItemStatus.push(data[i]);
      }
    }
    console.log(this.orderItemStatus)
  }

  findOrders(datas) {
    // console.log(datas)
    this.searchResults = [];
    const data = {
      InvOrderMasterId: +datas.InvOrderMasterId,
      DateOfOrder: this.parseDate(datas.DateOfOrder),
      Status: +datas.Status
    }
    this.service.searchOrders(data).subscribe(resp => {
      this.searchResults = resp;
      console.log(this.searchResults)
      // $('#myModal').modal('hide');
    });
  }

  selectOrder(id) {
    this.isLoader = true;
    console.log(id)
    this.service.getOrderItemsByOrderMasterId(id).subscribe(res => {
      this.orderData = res[0];
      console.log('orders', this.orderData)
      this.orderData.Name = this.getStatus(this.orderData.Status)
      this.DateCreated = this.parseDate(res[0].DateCreated)
      this.switchTabs = 'selectedOrders';
      this.getInvItemStatus()
      this.getOrderStoreData()
      this.isLoader = false;
    })
  }

  getInvItemStatus() {
    // this.service.getOrderStatus().subscribe(resp => {
    //   this.shippingStatus = resp
    //   console.log(this.shippingStatus)
    for (let i = 0; i < this.orderData.InvOrderItems.length; i++) {
      console.log('this.invItemDatas', this.orderData.InvOrderItems[i].Status);
      for (let j = 0; j < this.shippingStatus.length; j++) {
        if (this.shippingStatus[j].InvTaxonomyItemId === this.orderData.InvOrderItems[i].Status) {
          this.orderData.InvOrderItems[i].Name = this.shippingStatus[j].Name;
        }
      }
    }
    // });
  }

  getOrderStoreData() {
    // this.service.getInvStores().subscribe(resp => {
    //   this.storeData = resp
    //   console.log(this.storeData)
    console.log('this.invItemDatas', this.orderData.InvStoreId);
    for (let j = 0; j < this.storeData.length; j++) {
      if (this.storeData[j].InvStoreId === this.orderData.InvStoreId) {
        this.orderData.StoreName = this.storeData[j].StoreName;
      }
    }
    this.orderItemDatas = this.orderData
    console.log('finalorders', this.orderItemDatas)
    // });
  }



  updateOrder(data) {
    console.log('to update order', data)
    const today = new Date();
    const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    data.DateLastUpdated = date;
    data.LastUpdatedByUserId = UserDetail.UserId;
    for (let i = 0; i < data.InvOrderItems.length; i++) {
      data.InvOrderItems[i].LastUpdatedByUserId = UserDetail.UserId;
      data.InvOrderItems[i].DateLastUpdated = date;
    }
    console.log('updateorder', data)
    this.service.updateInvOrderMaster(data).subscribe(resp => {
      console.log('Success', resp)
      this.showSuccess('Order Successfully Updated.')
    });
  }

  onAddNewItem() {
    this.isLoader = true
    this.itemService.getInvItemMastersData().subscribe(response => {
      console.log('data from itemMasters', response)
      this.itemMasterData = response;
      this.isLoader = false
    })
  }
  AddItemToOrder(data) {
    console.log(data)
    this.selectedItems = data;
    this.pStoreId = this.selectedItems[0].InvStoreId
    console.log('pstoreID', this.pStoreId)
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    const userDetails = JSON.parse(sessionStorage.getItem('UserDetail'));

    this.service.AddToOrder(this.pStoreId, this.selectedItems).subscribe(resp => {
      console.log(resp)
      this.showSuccess('New Record Successfully Added.')
    });
    this.getOrderStoreData();
  $('#addItem').modal('hide')
  }


  submitOrder(data) {
    console.log('data from submit', data)
    this.orderId = data.InvOrderMasterId
    this.statusCode = 'SUBMT'
    this.service.submitOrders(this.orderId, this.statusCode, {}).subscribe(response => {
      this.showSuccess('Order Submited Successfully.')
      console.log('data from submitpost', response)
    })
    this.shippingDisabled = true;
    this.getInvOrderMastersData();
    this.backToHome();

  }

  onRowSelect(event) {
    this.orderData = event.data;
    this.DateCreated = event.data.DateCreated.substring(0, 10);
    $('#myModal').modal('hide');
  }
  backToHome() {
    this.orderData = {}
    this.switchTabs = 'activeOrders';
  }
  parseDate(date) {
    const d = new Date(Date.parse(date));
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  getStatus(id) {
    const status = this.orderStatus.find(data => data.InvTaxonomyItemId === id);
    // console.log(status)
    return status.Name;
  }
}
