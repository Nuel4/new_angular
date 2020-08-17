import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { CategoryService } from '../../../services/inventory/categories/categories.service';
import { MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [MessageService]
})
export class CategoriesComponent implements OnInit {
    @ViewChild('myModal') private _poup: ElementRef;
    display: boolean = false;

    showDialog() {
        this.display = true;
    }
    categoryData: any = {
        InvCategoryName: '',
        ParentCategoryId: '',
        InvStoreId: '',
        IsActive: true
    };

    invCategoryDatas: any = [];
    storeData: any = [];
    isChecked: boolean = true;
    cols: any[];
    isLoader: boolean = true;
    constructor(private toastr: ToastrService, private categoryService: CategoryService, private messageService: MessageService) {

    }

    ngOnInit() {
        this.cols = [
            { field: 'InvCategoryName', header: 'Name' },
            { field: 'ParentCategoryId', header: 'Parent' },
            { field: 'StoreName', header: 'Store Name' },
            { field: 'IsActive', header: 'IsActive' }
        ];
        this.getInvCategoryMasterData();
        this.getInvStoreData();
    }
    showSuccess(msg) {
        this.toastr.success(msg, "Success Message");
    }

    showError(msg) {
        this.toastr.success(msg, "Error Message");
    }
    onChange(event) {
        this.isChecked = event.currentTarget.checked;
        console.log(this.isChecked)
    }

    addNewCategory(datas) {
        this.categoryData = {
            InvCategoryName: '',
            ParentCategoryId: '',
            InvStoreId: '',
            IsActive: true
        }
        var today = new Date();
        let userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let data: any = {
            InvCategoryName: datas.InvCategoryName,
            ParentCategoryId: +datas.ParentCategoryId,
            IsActive: this.isChecked,
            InvStoreId: +datas.InvStoreId,
            DateCreated: date,
            CreatedByUserId: userDetails.UserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId
        }

        this.categoryService.addNewInvCategory(data).subscribe(res => {
            console.log(res);
            if (res) {
                this.showSuccess("New Category added successfully.")
                console.log('success');
                $("#myModal").modal("hide");
                this.getInvCategoryMasterData();
            }
        })
    }

    getInvCategoryMasterData() {
        this.categoryService.getInvCategoryMastersData().subscribe(resp => {
            console.log(resp)
            this.invCategoryDatas = resp;

            this.getInvStoreData();
        });
    }

    getInvStoreData() {
        this.categoryService.getInvStores().subscribe(resp => {
            console.log(resp)
            this.storeData = resp
            for (var i = 0; i < this.invCategoryDatas.length; i++) {
                console.log("this.invItemDatas", this.invCategoryDatas[i].InvStoreId);
                for (var j = 0; j < this.storeData.length; j++) {
                    if (this.storeData[j].InvStoreId == this.invCategoryDatas[i].InvStoreId) {
                        this.invCategoryDatas[i].StoreName = this.storeData[j].StoreName;
                    }
                }
            }
            this.isLoader = false;
            // this.invCategoryDatas = resp;
        });
    }

    // Change Active / In-Active status
    changeStatus(cat_id, status) {
        this.isLoader = true;
        this.categoryService.getInvCategoryMastersDataById(cat_id).subscribe(resp => {
            console.log(resp)
            this.categoryData = resp
            var today = new Date();
            let userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

            let data: any = {
                InvCategoryId: this.categoryData.InvCategoryId,
                InvCategoryName: this.categoryData.InvCategoryName,
                ParentCategoryId: +this.categoryData.ParentCategoryId,
                IsActive: status,
                InvStoreId: +this.categoryData.InvStoreId,
                DateCreated: this.categoryData.DateCreated,
                CreatedByUserId: this.categoryData.CreatedByUserId,
                DateLastUpdated: date,
                LastUpdatedByUserId: userDetails.UserId
            }
            this.categoryService.updateInvCategoryMaster(data).subscribe(res => {
                console.log(res);
                console.log('success');
                this.showSuccess("Status successfully changed.")
                this.getInvCategoryMasterData();
                this.isLoader = false;
            })
            // console.log(this.categoryData)
            // $("#myModal").modal("show");
        });
    }

    editCategory(cat_id) {
        console.log(cat_id)
        this.categoryService.getInvCategoryMastersDataById(cat_id).subscribe(resp => {
            console.log(resp)
            this.categoryData = resp
            console.log(this.categoryData)
            $("#myModal").modal("show");
        });
    }

    updateCategory(datas) {
        console.log(datas)
        var today = new Date();
        let userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let data: any = {
            InvCategoryId: datas.InvCategoryId,
            InvCategoryName: datas.InvCategoryName,
            ParentCategoryId: +datas.ParentCategoryId,
            IsActive: this.isChecked,
            InvStoreId: +datas.InvStoreId,
            DateCreated: this.categoryData.DateCreated,
            CreatedByUserId: this.categoryData.CreatedByUserId,
            DateLastUpdated: date,
            LastUpdatedByUserId: userDetails.UserId
        }
        this.categoryService.updateInvCategoryMaster(data).subscribe(res => {
            console.log('success');
            this.categoryData = {
                InvCategoryName: '',
                ParentCategoryId: '',
                InvStoreId: '',
                IsActive: true
            }
            this.getInvCategoryMasterData();
            this.showSuccess("Category "+data.InvCategoryName+" successfullly updated.");
            $("#myModal").modal("hide");

        })
    }
    deleteCategory(data) {
        this.categoryService.deleteInvCategoryMaster(data).subscribe(resp => {
            console.log(resp)
            this.getInvCategoryMasterData();
            this.showSuccess("Category Successfully Deleted.")
        });
    }
    clearData() {
        this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
        this.categoryData = []
    }


}