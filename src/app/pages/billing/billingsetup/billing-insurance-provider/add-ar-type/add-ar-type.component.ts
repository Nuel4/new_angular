import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import { InsuranceProviderService } from '../../../../../services/billing/insuranceprovider.service';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
declare var $: any;


@Component({
  selector: 'app-add-ar-type',
  templateUrl: './add-ar-type.component.html',
  styleUrls: ['./add-ar-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddArTypeComponent implements OnInit {
  @ViewChild('addInsuranceCompany') private _poup: ElementRef;
  @Input() artype;
  cols: any = [];
  cities: any = [];
  arTypedata: any = [];
  insuranceCategoryList: any = [];
  rowTypeClicked: any = []
  insuranceProvidersLists: any = [];
  selectedCategory: any;
  customFormattedCategory: any;
  selectedInsuranceProvider: any = [];
  insuranceGrouped: any;
  copyInsuranceCategoryList: any;
  deleteList: any = [];
  copyInsuranceGrouped: any;
  copyCustomFormattedCategory: any =[];
  constructor(private insuranceProviderService: InsuranceProviderService,public authStore: AuthenticationStore, private toastr: ToastrService, private modal: NgbActiveModal) {
  }

  ngOnInit() {
    this.cols = [
      { field: 'InsuranceCategoryName', header: 'AR Type (Insurance Cataegory)' }
    ],
      this.getInsuranceCategories();
    this.getInsuranceProviders();
    this.getCustomFormattedInsuranceProvider()
   
  }
  
  getInsuranceCategories() {
    this.insuranceProviderService.getInsuranceCategories().subscribe(resp => {
      this.insuranceCategoryList = resp;
      this.getCustomFormattedInsuranceProviderForCategory();     
      this.getCustomFormattedInsuranceProviderGrouped()
    });
  }
  getInsuranceProviders() {
    this.insuranceProviderService.getInsuranceProviders().subscribe(resp => {
      this.insuranceProvidersLists = resp;
      for (let i = 0; i < this.insuranceProvidersLists.length; i++) {
        this.insuranceProvidersLists[i].insuranceProviderDetails = this.insuranceProvidersLists[i].InsuranceProviderName +
          ' - ' + this.insuranceProvidersLists[i].InsuranceProviderCode +
          ' - ' + this.insuranceProvidersLists[i].SubmitterInsuranceNumber
      }
    });
  }
  getCustomFormattedInsuranceProvider(){
    this.insuranceProviderService.getCFInsurance().subscribe(res => {
    })
  }
  getCustomFormattedInsuranceProviderForCategory(){    
    this.selectedCategory = this.insuranceCategoryList[0];
    let payload = {
      insuranceCategoryId: this.selectedCategory.InsuranceCategoryId
    }
    this.insuranceProviderService.getCustomFormattedInsuranceProviderCategory(payload).subscribe(res => {
      this.customFormattedCategory = res;
      this.copyCustomFormattedCategory = res;
    })
  }
  getCustomFormattedInsuranceProviderGrouped(){
    let payload ={
      insuranceCategoryId: this.selectedCategory.InsuranceCategoryId ? this.selectedCategory.InsuranceCategoryId:0
    }
    this.insuranceProviderService.getCustomFormattedGrouped(payload).subscribe(res => {
      this.insuranceGrouped = res;
    })
  }
  addInsuranceCategory(event){
    let updateList = {},addList = {};
    let payload :any = {};
    this.insuranceProviderService.getInsuranceCategories().subscribe(resp => {
      this.copyInsuranceCategoryList = resp;
      this.insuranceCategoryList.forEach(item => {
        if( this.copyInsuranceCategoryList !== null){
          payload = this.copyInsuranceCategoryList.find(key => key.InsuranceCategoryId === item.InsuranceCategoryId)
          if(payload !== undefined){
            if(payload.InsuranceCategoryName !== item.InsuranceCategoryName){
              payload.InsuranceCategoryName = item.InsuranceCategoryName;
              payload.DateLastUpdated = new Date();
              payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
              updateList = payload;
            }
          }
          else{
            payload = {};
            if(item.InsuranceCategoryName !== null){
              payload.InsuranceCategoryName = item.InsuranceCategoryName;
              payload.DateCreated = new Date,
              payload.CreatedByUserId = this.authStore.UserDetail.UserId,
              payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId,
              payload.DateLastUpdated = new Date();
              addList = payload
            }
          }
        }
      })
      if(Object.keys(addList).length > 0){
        this.insuranceProviderService.addInsuranceCategory(addList).subscribe(res => {
          this.toastr.success('Successfully Added');
        })
      }
      if(Object.keys(updateList).length > 0){
        this.insuranceProviderService.updateInsuranceCategory(updateList).subscribe(res => {
          this.toastr.success('Successfully Updated')
        })
      }
    });
   
    
  }
  deleteFeeSchedule(rowData){
    this.insuranceProviderService.deleteInsuranceCategory(rowData).subscribe(res => {
      this.toastr.warning('Deleted Successfully');
      this.getInsuranceCategories();
      this.getCustomFormattedInsuranceProviderGrouped();
    })
  }
  deleteProviderList(event){
    this.insuranceGrouped = this.insuranceGrouped.filter(item => {
      return item!== event
    })
    this.deleteList.push(event.insuranceProviderId)
  }
  onSave(){
   
    let insuranceProviderId = [];
    let ids:any;
   this.insuranceGrouped.forEach(item => {
    ids = item.insuranceProviderId;
    insuranceProviderId.push(ids)
   })
    let payload = {
      removeInsuranceProvidersIdList: this.deleteList,
      AddInsuranceProvidersIdList: insuranceProviderId,
      insuranceCategoryId: this.selectedCategory.InsuranceCategoryId,
      UserId: this.authStore.UserDetail.UserId
    }
    this.insuranceProviderService.updateInsuranceProvider(payload).subscribe(res => {
      this.toastr.success('Successfully Updated')
    })
  }
  openARAddModal() {
    let addArtype = {
      InsuranceCategoryName:''
    }
    this.insuranceCategoryList.push(addArtype)
  }
  onRowSelect(rowData) {
    this.getCustomFormattedInsuranceProviderGrouped();
  }
  closeModal() {
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
  moveToTarget(event){
    this.customFormattedCategory.push(event.items[0]);
  }
  clearform(){
    this.insuranceGrouped = [{}];
    this.selectedCategory = {};
  }
}
