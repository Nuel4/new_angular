import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { ItemService } from '../../../services/inventory/items/items.service';
import { BatchesService } from '../../../services/inventory/batches/batches.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
    selector: 'app-batches',
    templateUrl: './batches.component.html',
    styleUrls: ['./batches.component.scss'],
    providers: [MessageService],
    encapsulation: ViewEncapsulation.None
})
export class BatchesComponent implements OnInit {
    @ViewChild('myModal') private _poup: ElementRef;
    @ViewChild('editBatch') private _poup2: ElementRef;
    display: boolean = false;
    showDialog() {
        this.display = true;
    }
    addBatchData: boolean = false;
    editBatch: boolean = false;
    BatchData: any = [];
    BatchItemData: any = [];
    searchItem: any = [];
    searchResults: any = [];
    selectedBatch: any = [];
    searchResultMsg: string = 'No Data Found';
    invItemDatas: any = [];
    invBatchesDatas: any = [];
    isChecked;
    ManufacturedDate: Date;
    ExpiryDate: Date;
    cols: any[];
    searchCols: any[];
    msgs: Message[] = [];
    BatchesBelongsToItems: any = [];
    isLoader: boolean = true;
    constructor(private toastr: ToastrService, private batchesService: BatchesService, private itemService: ItemService, route: ActivatedRoute, private messageService: MessageService) {
        let sub = route
            .queryParams
            .subscribe(params => {
                let id = +params['id'] || 0;
                if (id != 0) {
                    this.itemService.getInvItemMastersDataById(id).subscribe(resp => {
                        this.BatchItemData = resp
                        console.log(this.BatchItemData);
                        this.addBatchData = true;
                    });
                };
            });
        //this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
    }

    ngOnInit() {
        this.cols = [
            { field: 'Description', header: 'Description' },
            { field: 'BatchNumber', header: 'Batch No' },
            { field: 'LotNumber', header: 'Lot No' },
            { field: 'BatchQuantity', header: 'Batch Quantity' },
            { field: 'CurrentQuantity', header: 'Current Quantity' },
            { field: 'ManufacturedDate', header: 'Manufactured Date' },
            { field: 'ExpiryDate', header: 'Expiry Date' },
            { field: 'ItemLocation', header: 'Item Location' },
            { field: 'BatchCode', header: 'Batch Code' },
            { field: 'IsActive', header: 'IsActive' }
        ];
        this.searchCols = [
            { field: 'InvItemMasterName', header: 'Item Name' },
            { field: 'ItemCode', header: 'Item Code' },
            { field: 'CurrentQuantity', header: 'Current Quantity' },
        ]
        this.getInvBatchesMasterData();
    }
    addBatch() {
        this.BatchData = [];
        this.BatchItemData = [];
        this.addBatchData = true;
        this.editBatch = false;
    }

    showSuccess(msg) {
        this.toastr.success(msg, "Success Message");
    }

    showError(msg) {
        this.toastr.success(msg, "Error Message");
    }

    updateBatch(datas) {
        var today = new Date();
        let userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let data: any = {
            Agent: datas.Agent,
            BatchCode: datas.BatchCode,
            BatchNumber: datas.BatchNumber,
            BatchQuantity: +datas.BatchQuantity,
            Comments: datas.Comments,
            Description: datas.Description,
            ExpiryDate: this.parseDate(this.ExpiryDate),
            ManufacturedDate: this.parseDate(this.ManufacturedDate),
            CurrentQuantity: datas.CurrentQuantity,
            InvBatchMasterId: this.BatchData.InvBatchMasterId,
            InvItemMasterId: this.BatchItemData.InvItemMasterId,
            InvStoreId: this.BatchItemData.InvStoreId,
            DateCreated: this.BatchItemData.DateCreated,
            IsActive: datas.IsActive,
            LotNumber: datas.LotNumber,
            CreatedByUserId: this.BatchItemData.CreatedByUserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId,
            ManufacturerName: datas.ManufacturerName
        }
        console.log(data)
        this.batchesService.updateInvBatchMaster(data).subscribe(res => {
            this.msgs.push({ severity: 'success', summary: 'Updated!!!', detail: 'Batch updated successfully..' });
            this.getInvBatchesMasterData();
            this.addBatchData = false;
            this.editBatch = false;
        })
    }

    addNewBatches(datas) {
        this.isLoader = true
        var today = new Date();
        let userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let data: any = {
            Agent: datas.Agent,
            BatchCode: datas.BatchCode,
            BatchNumber: datas.BatchNumber,
            BatchQuantity: +datas.BatchQuantity,
            Comments: datas.Comments,
            Description: datas.Description,
            ExpiryDate: this.parseDate(this.ExpiryDate),
            ManufacturedDate: this.parseDate(this.ManufacturedDate),
            CurrentQuantity: datas.CurrentQuantity,
            InvItemMasterId: this.BatchItemData.InvItemMasterId,
            InvStoreId: datas.InvStoreId,
            DateCreated: date,
            IsActive: datas.IsActive,
            LotNumber: datas.LotNumber,
            CreatedByUserId: userDetails.UserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId,
            ManufacturerName: datas.ManufacturerName
        }
        this.batchesService.addNewInvBatch(data).subscribe(res => {
            console.log(res);
            if (res) {
                this.msgs.push({ severity: 'success', summary: 'Added', detail: 'batch added successfully..', life: 2000 });
                this.getInvBatchesMasterData();
                this.addBatchData = false;
                this.editBatch = false;
                this.isLoader = false;
            }
        })
    }

    getInvBatchesMasterData() {
        this.isLoader = true;
        this.batchesService.getInvBatchMastersData().subscribe(resp => {
            this.invBatchesDatas = resp;
            this.isLoader = false;
            console.log("batchs",this.invBatchesDatas)
        });
    }

    // Change Active / In-Active status
    changeStatus(datas, status) {
        var today = new Date();
        let userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let data: any = {
            Agent: datas.Agent,
            BatchCode: datas.BatchCode,
            BatchNumber: datas.BatchNumber,
            BatchQuantity: +datas.BatchQuantity,
            Comments: datas.Comments,
            Description: datas.Description,
            ExpiryDate: datas.ExpiryDate,
            ManufacturedDate: datas.ManufacturedDate,
            CurrentQuantity: datas.CurrentQuantity,
            InvBatchMasterId: datas.InvBatchMasterId,
            InvItemMasterId: datas.InvItemMasterId,
            InvStoreId: datas.InvStoreId,
            DateCreated: datas.DateCreated,
            IsActive: status,
            LotNumber: datas.LotNumber,
            CreatedByUserId: datas.CreatedByUserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId,
            ManufacturerName: datas.ManufacturerName
        }
        console.log(data)
        this.batchesService.updateInvBatchMaster(data).subscribe(res => {
            this.msgs.push({ severity: 'success', summary: 'Updated!!!', detail: 'Batch updated successfully..', life: 2000 });
            this.getInvBatchesMasterData();
            this.addBatchData = false;
            this.editBatch = false;
        })
    }

    editBatches(id) {
        this.batchesService.getInvBatchMastersDataById(id).subscribe(resp => {
            this.BatchData = resp;
            this.ManufacturedDate = resp.ManufacturedDate.substring(0, 10);
            this.ExpiryDate = resp.ExpiryDate.substring(0, 10);
            this.getItemBatchData(resp.InvItemMasterId);
            // console.log(this.BatchData);
            this.isChecked = this.BatchData.IsActive;
            this.editBatch = true;
            this.addBatchData = false;
        });
    }

    getAllInvBatchByItemCode(code) {
        this.batchesService.getAllInvBatchByItemCode(code).subscribe(resp => {
            console.log('getAllInvBatchByItemCode')
            console.log(resp)
            this.BatchesBelongsToItems = resp
        })
    }

    getItemBatchData(id) {
        this.itemService.getInvItemMastersDataById(id).subscribe(res => {
            this.BatchItemData = res;
        })
    }

    findItems(item) {
        this.itemService.searchItems(item).subscribe(resp => {
            console.log(resp)
            this.searchResults = resp
        });
    }

    onRowSelect(event) {
        this.BatchItemData = event.data
        console.log(this.BatchItemData)
        this.getAllInvBatchByItemCode(this.BatchItemData.ItemCode)
        $("#myModal").modal("hide");
    }

    onBatchSelect(event) {
        this.isChecked = this.BatchData.IsActive;
        this.ManufacturedDate = event.data.ManufacturedDate.substring(0, 10);
        this.ExpiryDate = event.data.ExpiryDate.substring(0, 10);
        this.BatchData = event.data
        console.log(event.data)
    }
    backToHome() {
        this.editBatch = false;
        this.addBatchData = false;
    }

    // IST Date format to String (yyyy-mm-dd)
    parseDate(date) {
        let d = new Date(Date.parse(date));
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    // Active Status Change
    onChange(event) {
        this.isChecked = event.currentTarget.checked;
        console.log(this.isChecked)
    }

    // Check Expiry Date or Not
    checkExpiryDate(date) {
        // console.log(date)
        var CurrentDate = new Date();
        var GivenDate = new Date(this.parseDate(date));
        if (GivenDate > CurrentDate) {
            return false;
        } else {
            return true;
        }
    }


}