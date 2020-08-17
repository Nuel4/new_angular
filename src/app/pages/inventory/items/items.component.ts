import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { ItemService } from '../../../services/inventory/items/items.service';
import { Router } from '@angular/router';
import { OrderService, } from '../../../services/inventory/order/order.service';
import { Observable, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
declare var $: any;


@Component({
    selector: 'app-items',
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ItemsComponent implements OnInit {
    @ViewChild('myModal') private _poup: ElementRef;
    @ViewChild('searchModal') private _poup2: ElementRef;
    display: boolean;
    isChecked: boolean;
    selectedItems = [];
    storeData: any = [];
    categoryData: any = [];
    searchItem: any = [];
    itemData: any = {
        InvItemMasterName: '',
        InvCategory: '',
        InvStore: '',
        ItemCode: '',
        UOM: '',
        ThresholdQuantity: '',
        IsActive: true
    };
    checkedIsActive: boolean

    invItemDatas: any = [];
    searchResults: any = [];
    cols: any[];
    searchCols: any[];
    pStoreId: {};
    slectedSearchItems = [];
    invItemDatasWithCategory: any = [];
    invItemDatasWithStore: any = [];
    itemParam: any = {};
    itemPagedOffset = 0;
    TotalRecords: number;
    results: any = [];
    Code: string;
    ItemName: string;
    CategoryId: number;
    checked: boolean;
    isLoader: boolean ;
    loading: boolean;
    showDialog() {
        this.display = true;
    }

    constructor(private toastr: ToastrService, private itemService: ItemService,
        private router: Router, private orderService: OrderService) {
        this.isChecked = true;
        this.display = false;
        this.isLoader = true;
        this.checkedIsActive = true
    }

    ngOnInit() {
        this.isChecked = true;
        this.cols = [
            { field: 'InvItemMasterName', header: 'Name' },
            { field: 'InvCategoryName', header: 'Category Name' },
            { field: 'ItemCode', header: 'Code' },
            { field: 'StoreName', header: 'Store Name' },
            { field: 'Uom', header: 'UOM' },
            { field: 'CurrentQuantity', header: 'Current Quantity' },
            { field: 'ThresholdQuantity', header: 'Threshold Quantity' },
            { field: 'IsActive', header: 'IsActive' }
        ];
        this.searchCols = [
            { field: 'InvItemMasterName', header: 'Name' },
            { field: 'InvCategory', header: 'Category' },
            { field: 'ItemCode', header: 'Code' },
            { field: 'IsActive', header: 'IsActive' }
        ]
        this.getInvItemMasterData(this.itemPagedOffset, {});
        // this.getInvStoreData();
        // this.getCategoryMatsersData();
    }

    showSuccess(msg) {
        this.toastr.success(msg, 'Success Message');
    }

    showError(msg) {
        this.toastr.success(msg, 'Error Message');
    }

    onChange(event) {
        this.isChecked = event.currentTarget.checked;
        console.log(this.isChecked)
    }

    addbatch(data) {
        console.log(data)
        // this.router.navigate(['/pages/batches'], { queryParams: { id: data.InvItemMasterId } });
    }

    addNewItem(datas, checked) {
        this.invItemDatas = [];
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const userDetails = JSON.parse(sessionStorage.getItem('UserDetail'));
        const data: any = {
            InvItemMasterName: datas.InvItemMasterName,
            InvCategoryId: +datas.InvCategoryId,
            InvStoreId: +datas.InvStoreId,
            ItemCode: datas.ItemCode,
            Uom: datas.Uom,
            CurrentQuantity: 0,
            DefaultOrderQuantity: +datas.DefaultOrderQuantity,
            ThresholdQuantity: +datas.ThresholdQuantity,
            IsActive: checked,
            DateCreated: date,
            CreatedByUserId: userDetails.UserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId
        }

        this.itemService.addNewInvItem(data).subscribe(res => {
            console.log(res);
            console.log('sucess');
            this.getInvItemMasterData(this.itemPagedOffset, {});
            $('#myModal').modal('hide');
            this.showSuccess('Item Successfully Added.')
        })
    }

    clearData() {
        this.itemData = [];
    }

    filterItemDatasCall(e) {
        e.preventDefault();
        this.filterItemDatas(this.Code, this.ItemName, this.CategoryId, this.checked)
    }

    filterItemDatas(code, item, id, active) {
        console.log('code', code)
        console.log('item', item)
        console.log('id', id)
        console.log('active', active)
        const data = {
            'pcode': code,
            'pIsActive': active,
            'pCategoryId': id
        }
        this.getInvItemMasterData(this.itemPagedOffset, data)
    }
    getInvItemMasterData(index, data) {
        this.loading = true;
        console.log('datata', data)
        const today = new Date();
        const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
        console.log('userDetails', UserDetail)
        // const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        this.itemService.getInvItemMastersDataByOffset(index, data).subscribe(resp => {
            console.log('total records', resp)
            console.log('resp from items', resp.Results)
            this.results = resp.Results;
            this.TotalRecords = resp.TotalItems;
            this.invItemDatas = resp.Results;
            // for (let i = 0; i < resp.Results.length; i++) {
            //     if (resp.Results[i].InvStoreId === 1) {
            //         this.invItemDatas.push(resp.Results[i]);
            //     }
            // }
            // this.invItemDatas = resp.Results;
            console.log('new Items', this.invItemDatas);
            // this.getInvStoreData();
            // this.getCategoryMatsersData();
            this.getItemsDetail();
        });
    }

    getItemsDetail() {
        forkJoin([
            this.itemService.getInvStores(),
            this.itemService.getCategoryMasters()
        ]).subscribe(resp => {
            this.storeData = resp[0]
            for (let i = 0; i < this.invItemDatas.length; i++) {
                console.log('this.invItemDatas', this.invItemDatas[i].InvStoreId);
                for (let j = 0; j < this.storeData.length; j++) {
                    if (this.storeData[j].InvStoreId === this.invItemDatas[i].InvStoreId) {
                        this.invItemDatas[i].StoreName = this.storeData[j].StoreName;
                    }
                }
            }
            this.invItemDatasWithStore = this.invItemDatas;
            console.log('updated', this.invItemDatasWithStore);

            ////////////////////

            // this.categoryData = resp[1];
            this.categoryData = [{ InvCategoryName: 'Select Category', InvCategoryId: 0 }]
            for (let i = 0; i < resp[1].length; i++) {
                this.categoryData.push(resp[1][i]);
            }
            console.log('final category', this.categoryData)
            for (let i = 0; i < this.invItemDatasWithStore.length; i++) {
                console.log('this.invItemDatas', this.invItemDatasWithStore[i].InvCategoryId);
                for (let j = 0; j < this.categoryData.length; j++) {
                    if (this.categoryData[j].InvCategoryId === this.invItemDatasWithStore[i].InvCategoryId) {
                        this.invItemDatasWithStore[i].InvCategoryName = this.categoryData[j].InvCategoryName;
                    }
                }
            }
            this.invItemDatasWithCategory = this.invItemDatasWithStore;
            console.log('updated', this.invItemDatasWithCategory)
            this.loading = false;
            this.isLoader = false;
        })
    }

    // getInvStoreData() {
    //     this.itemService.getInvStores().subscribe(resp => {
    //         console.log(resp)
    //         this.storeData = resp
    //         for (let i = 0; i < this.invItemDatas.length; i++) {
    //             console.log('this.invItemDatas', this.invItemDatas[i].InvStoreId);
    //             for (let j = 0; j < this.storeData.length; j++) {
    //                 if (this.storeData[j].InvStoreId === this.invItemDatas[i].InvStoreId) {
    //                     this.invItemDatas[i].StoreName = this.storeData[j].StoreName;
    //                 }
    //             }
    //         }
    //         this.invItemDatasWithStore = this.invItemDatas;
    //         console.log('updated', this.invItemDatasWithStore)

    //     });
    // }

    // getCategoryMatsersData() {
    //     this.itemService.getCategoryMasters().subscribe(resp => {
    //         console.log(resp)
    //         this.categoryData = resp
    //         for (let i = 0; i < this.invItemDatasWithStore.length; i++) {
    //             console.log('this.invItemDatas', this.invItemDatasWithStore[i].InvCategoryId);
    //             for (let j = 0; j < this.categoryData.length; j++) {
    //                 if (this.categoryData[j].InvCategoryId === this.invItemDatasWithStore[i].InvCategoryId) {
    //                     this.invItemDatasWithStore[i].InvCategoryName = this.categoryData[j].InvCategoryName;
    //                 }
    //             }
    //         }
    //         this.invItemDatasWithCategory = this.invItemDatasWithStore;
    //         console.log('updated', this.invItemDatasWithCategory)

    //     });

    // }

    // Change Active / In-Active status
    changeStatus(id, status) {
        this.itemService.changeStatus(id, status).subscribe(resp => {
            this.getInvItemMasterData(this.itemPagedOffset, {});
        });
    }

    editItem(id) {
        console.log(id)
        this.itemService.getInvItemMastersDataById(id).subscribe(resp => {
            this.itemData = resp
            this.itemData.IsActive = this.checkedIsActive;
            this.isChecked = this.itemData.IsActive;
            $('#myModal').modal('show');
        });
    }

    updateItem(datas, checkedIsActive) {
        // console.log(datas)
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        const userDetails = JSON.parse(sessionStorage.getItem('UserDetail'));
        const data: any = {
            InvItemMasterId: this.itemData.InvItemMasterId,
            InvItemMasterName: datas.InvItemMasterName,
            InvCategoryId: +datas.InvCategoryId,
            InvStoreId: +datas.InvStoreId,
            ItemCode: datas.ItemCode,
            Uom: datas.Uom,
            CurrentQuantity: +datas.CurrentQuantity,
            DefaultOrderQuantity: +datas.DefaultOrderQuantity,
            ThresholdQuantity: +datas.ThresholdQuantity,
            IsActive: checkedIsActive,
            DateCreated: this.itemData.DateCreated,
            CreatedByUserId: this.itemData.CreatedByUserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId
        }

        this.itemService.updateInvItemMaster(data).subscribe(res => {
            this.invItemDatas = [];
            this.getInvItemMasterData(this.itemPagedOffset, {});
            $('#myModal').modal('hide');
            this.showSuccess('Item Successfully Updated.')
        })
    }

    onRowSelect(event) {
        this.itemData = event.data
        $('#searchModal').modal('hide');
    }

    findItems(item) {
        console.log(item)
        this.itemService.searchItems(item).subscribe(resp => {
            console.log(resp)
            this.searchResults = resp
        });
    }
    addToOrder(data) {
        console.log(data)
        this.selectedItems = data;
        this.pStoreId = this.selectedItems[0].InvStoreId
        console.log('pstoreID', this.pStoreId)
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        const userDetails = JSON.parse(sessionStorage.getItem('UserDetail'));

        this.orderService.AddToOrder(this.pStoreId, this.selectedItems).subscribe(resp => {
            this.showSuccess('Order Successfully Added.')
        });
    }

    paginate(event) {
        console.log('page', event)
        const index = (event.first / event.rows);
        this.itemPagedOffset = index
        console.log('Item Paged Index is ', this.itemPagedOffset);
        this.getInvItemMasterData(this.itemPagedOffset, {});
    }

    // Check Quantity is less than threshold qnty
    checkLessQuantity(data) {
        const CurrentQuantity = data.CurrentQuantity,
            ThresholdQuantity = data.ThresholdQuantity;
        if (CurrentQuantity < ThresholdQuantity) {
            return true;
        } else {
            return false;
        }
    }
    // showSuccess() {
    //     this.alerts({severity:'success', summary: 'Success Message', detail:'Order submitted'});
    // }
}
