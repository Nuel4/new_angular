import { Component, OnInit, ViewEncapsulation, Injectable, ViewChild, ElementRef } from '@angular/core';
import { TrackingService } from '../../../services/inventory/tracking/tracking.service';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class TrackingComponent implements OnInit {
  @ViewChild('searchUserModal') private _poup: ElementRef;
  cars: any = [
    { 'brand': 'VW', 'year': 2012, 'color': 'Orange', 'vin': 'dsad231ff' },
    { 'brand': 'Audi', 'year': 2011, 'color': 'Black', 'vin': 'gwregre345' },
    { 'brand': 'Renault', 'year': 2005, 'color': 'Gray', 'vin': 'h354htr' },
    { 'brand': 'BMW', 'year': 2003, 'color': 'Blue', 'vin': 'j6w54qgh' },
    { 'brand': 'Mercedes', 'year': 1995, 'color': 'Orange', 'vin': 'hrtwy34' },
    { 'brand': 'Volvo', 'year': 2005, 'color': 'Black', 'vin': 'jejtyj' }
  ];

  cols: any[];
  receiverData: any = {
    TransactionType: 'CONSUM'
  };
  orderData: any = {
    TransactionType: 10,
    FlowDirection: 0
  };

  searchItem: any = {};
  selectedReceiver: any = [];
  addItemToTrack: any = [];
  searchResults: any = [];
  InvTrackingMastersData: any = [];
  transactionType: any = [];
  DateCreated;
  switchTabs = 'trackingList';
  receiverUserCol: any;
  receiverPatientCol: any;
  scannedItemsActiveBatchList: any = [];
  scannedItemsActiveBatchListCol: any = [];
  scannedItemsList: any = [];
  userType = 'user';
  isLoader: Boolean;
  loading: boolean;

  constructor(private toastr: ToastrService, private serviceProider: TrackingService) {
  this.isLoader = true;
  this.loading = false;
  }
  ngOnInit() {
    // this.carService.getCarsSmall().then(cars => this.cars = cars);
    this.cols = [
      { field: 'InvInventoryTrackingId', header: 'Tracking ID' },
      { field: 'InvItemMasterName', header: 'Item Name' },
      { field: 'ItemCode', header: 'Item Code' },
      { field: 'BatchNumber', header: 'Batch No.' },
      { field: 'LotNumber', header: 'Lot No.' },
      { field: 'BatchCode', header: 'Batch Code' },
      { field: 'Quantity', header: 'Quantity' }
    ];
    this.receiverUserCol = [
      { field: 'UserId', header: 'User ID' },
      { field: 'FirstName', header: 'First Name' },
      { field: 'LastName', header: 'Last Name' },
      { field: 'MobilePhone', header: 'Mobile' },
      { field: 'Email1', header: 'Email' }
    ];

    this.receiverPatientCol = [
      { field: 'PatientId', header: 'Patiend ID' },
      { field: 'FirstName', header: 'First Name' },
      { field: 'LastName', header: 'Last Name' },
      { field: 'MobilePhone', header: 'Mobile' },
      { field: 'Email1', header: 'Email' }
    ];

    this.scannedItemsActiveBatchListCol = [
      { field: 'BatchNumber', header: 'batch No' },
      { field: 'LotNumber', header: 'Lot No' },
      { field: 'CurrentQuantity', header: 'Current Quantity' },
      { field: 'ExpiryDate', header: 'Expiry Date' },
      { field: 'ItemLocation', header: 'Item Location' },
    ]
    this.getAllInvTracking();
    this.gettransactionType();
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success Message');
  }

  showError(msg) {
    this.toastr.success(msg, 'Error Message');
  }

  showWarring(msg) {
    this.toastr.warning(msg, 'Warring Message');
  }

  getUserDetails() {
    const data = JSON.parse(sessionStorage.getItem('UserDetail'));
    // console.log(data)
    this.receiverData = {
      ReceiverId: data.UserId,
      FirstName: data.FirstName,
      LastName: data.LastName,
      Ssn: data.Ssn,
      MobilePhone: data.MobilePhone,
      Email1: data.Email1,
      PrimaryAddressLine1: data.PrimaryAddressLine1,
      PrimaryAddressLine2: data.PrimaryAddressLine2,
      PrimaryCity: data.PrimaryCity,
      PrimaryStateCode: data.PrimaryStateCode,
      PrimaryZipCode: data.PrimaryZipCode
    }
  }

  getAllInvTracking() {
    this.serviceProider.getAllInvTracking().subscribe(res => {
      console.log(res);
      const temp_var1 = [];
      const temp_var2 = [];

      for (let i = 0; i < res.length; i++) {
        const findVal = res[i].CreatedByUserId + ' ' + this.parseDate(res[i].DateCreated);
        if (!temp_var1.includes(findVal)) {
          temp_var1.push(findVal);
          const obj = {
            CreatedByUserId: res[i].CreatedByUserId,
            DateCreated: this.parseDate(res[i].DateCreated),
            ReceiverName: res[i].ReceiverName,
            TransactionType: res[i].TransactionType,
            Comments: res[i].Comments,
            PatientId: res[i].PatientId,
            TrackingItems: [res[i]]
          }
          temp_var2.push(obj);
        } else {
          const index = temp_var1.indexOf(findVal);
          const tmp = temp_var2[index];
          tmp.TrackingItems.push(res[i]);
        }
      }
      this.InvTrackingMastersData = temp_var2;
      console.log('tracking', this.InvTrackingMastersData);
      this.isLoader = false
    });
  }

  gettransactionType() {
    const data = JSON.parse(sessionStorage.getItem('TaxonomyItemDetail'));
    // this.serviceProider.gettransactionType().subscribe(res => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].InvTaxonomyMasterId === 3) {
        this.transactionType.push(data[i]);
      }
    }
    console.log(this.transactionType)
    // });
  }

  scanItem(data) {
    if (data.ScanOrId.length >= 5) {
      console.log('value scan', data);
      this.serviceProider.scanAndGetItem(data.ScanOrId).subscribe(res => {
        this.scannedItemsActiveBatchList = res;
        console.log('scaning' + JSON.stringify(this.scannedItemsActiveBatchList))
        if (this.scannedItemsActiveBatchList.length <= 0) {
          this.showWarring('No Record Found.')
        }
        this.orderData.ScanOrId = null;
      })
    }
  }

  selectOrder(datas) {
    // console.log(datas)
    const data = datas.TrackingItems;
    this.DateCreated = this.parseDate(datas.DateCreated);
    this.scannedItemsList = [];
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i])
      this.scannedItemsList.push(data[i]);
    }
    console.log('selected order', this.scannedItemsList)
    this.getUserDetails();
    this.switchTabs = 'newRequest';
  }

  findUsers(data) {
    console.log('Scaned User ID ', data)
    this.loading = true;
    setTimeout(() => {
      this.userType = data.userType;
      console.log(this.userType)
      this.searchResults = []
      if (this.userType === 'user') {
        this.isLoader = true;
        this.serviceProider.getUserDetails(data.ScanOrId).subscribe(res => {
          this.searchResults = []
          if (res) {
            console.log(res)
            this.searchResults.push(res);
            this.isLoader = false
            this.searchItem.ScanOrId = null;
          } else {
            this.searchResults = []
            this.showWarring('NO User Record Found')
            this.isLoader = false
          }
          this.loading = false
          this.searchItem.ScanOrId = null;
        })
      } else {
        this.isLoader = true;
        this.serviceProider.getPatientDetails(data.ScanOrId).subscribe(res => {
          this.searchResults = []
          if (res) {
            console.log(res)
            this.searchResults.push(res);
            this.isLoader = false
            this.searchItem.ScanOrId = null;
          } else {
            this.searchResults = []
            this.showWarring('NO Patient Record Found')
            this.isLoader = false
            
          }
          this.loading = false;
          this.searchItem.ScanOrId = null;
        })
      }
    }, 0);
  }

  selectOnereceiver(event) {
    const data = event.data;
    this.receiverData = {
      ReceiverId: data.UserId ? data.UserId : data.PatientId,
      FirstName: data.FirstName,
      LastName: data.LastName,
      Ssn: data.Ssn,
      MobilePhone: data.MobilePhone,
      Email1: data.Email1,
      PrimaryAddressLine1: data.PrimaryAddressLine1,
      PrimaryAddressLine2: data.PrimaryAddressLine2,
      PrimaryCity: data.PrimaryCity,
      PrimaryStateCode: data.PrimaryStateCode,
      PrimaryZipCode: data.PrimaryZipCode
    }
    $('#searchUserModal').modal('hide');
  }

  saveTracking(orderData, scannedItemsList, receiverData) {
    // console.log(orderData)
    // console.log(scannedItemsList)
    // console.log(receiverData)
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
    for (let i = 0; i < scannedItemsList.length; i++) {
      const data = {
        BatchCode: scannedItemsList[i].BatchCode,
        BatchDescription: scannedItemsList[i].Description,
        BatchNumber: scannedItemsList[i].BatchNumber,
        Comments: scannedItemsList[i].Comments,
        CreatedByUserId: UserDetail.UserId,
        DateCreated: date,
        DateLastUpdated: date,
        FlowDirection: +orderData.FlowDirection,
        InvBatchMasterId: scannedItemsList[i].InvBatchMasterId,
        InvItemMasterId: scannedItemsList[i].InvItemMasterId,
        InvItemMasterName: scannedItemsList[i].InvItemMasterName,
        ItemCode: scannedItemsList[i].ItemCode,
        ItemUniqueNumber: scannedItemsList[i].ItemUniqueNumber,
        LastUpdatedByUserId: UserDetail.UserId,
        LotNumber: scannedItemsList[i].LotNumber,
        PatientId: null,
        Quantity: scannedItemsList[i].Quantity,
        ReceiverName: receiverData.FirstName + ' ' + receiverData.LastName,
        ReceiverUserId: receiverData.ReceiverId,
        TransactionType: +orderData.TransactionType
      }
      console.log(data);
      this.serviceProider.addNewInvTracking(data).subscribe(res => {
        console.log(res)
        console.log('success')
        this.showSuccess('All the data successfully saved.')
        this.backToHome();
      })
    }
  }

  addItemToTracking(event) {
    console.log(event.data)
    const findObj = this.scannedItemsList.find(val => val.ItemCode === event.data.ItemCode && val.BatchCode === event.data.BatchCode);
    if (findObj !== undefined) {
      // console.log('finded')
      for (const i in this.scannedItemsList) {
        if (this.scannedItemsList[i].ItemCode === event.data.ItemCode && this.scannedItemsList[i].BatchCode === event.data.BatchCode) {
          const init_qnty = (isNaN(this.scannedItemsList[i].Quantity) ? 1 : this.scannedItemsList[i].Quantity);
          this.scannedItemsList[i].Quantity = init_qnty + 1;
        }
      }
    } else {
      event.data['Quantity'] = 1;
      this.scannedItemsList.push(event.data);
    }
    this.scannedItemsActiveBatchList = []
  }

  TransactionTypeChange(id) {
    if (id !== 12) {
      this.orderData.FlowDirection = 0
    } else {
      this.orderData.FlowDirection = 1
    }
  }
  clearData() {
    this.scannedItemsList = [];
    this.getUserDetails();
    // this.orderData = [];
    this.switchTabs = 'newRequest';
  }
  backToHome() {
    this.scannedItemsList = [];
    this.switchTabs = 'trackingList';
    this.getAllInvTracking();
    this.gettransactionType();
  }

  findExpiryDate(date) {
    // console.log(date)
    const CurrentDate = new Date();
    const GivenDate = new Date(this.parseDate(date));
    if (GivenDate > CurrentDate) {
      return true;
    } else {
      return false;
    }
  }
  parseDate(date) {
    if (date) {
      const d = new Date(Date.parse(date));
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    } else {
      return '-';
    }

  }

}
