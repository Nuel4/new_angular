import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { BillingSetupService } from '../../../../../services/billing/billing-setup.service';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { EditDefaultFeeComponent } from '../edit-default-fee/edit-default-fee.component';
@Component({
  selector: 'app-fees-modal',
  templateUrl: './fees-modal.component.html',
  styleUrls: ['./fees-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeesModalComponent implements OnInit {
@Input() fees;
@Input() rowData;
  feeScheduleType: any =[];
  selectedFeeScheduleType:any;
  cols: any[];
  customFormattedFeeSchedule: any;
  feeScheduleTable: boolean = false;
  effectiveStartDate: any;
  effectiveEndDate: any;
  feeScheduleDisplayName: any;
  save: boolean = true;
  update: boolean = false;
  feeScheduleRowData: any;
  fileReaded: any;
  constructor(private modal: NgbActiveModal,private modalService: NgbModal,private billingService: BillingSetupService,public authStore: AuthenticationStore,private toaster: ToastrService) { }

  ngOnInit() {
    this.getFeeScheduleType();
    this.getCutomFormattedFeeSchedule();
    this.cols = [
      { field: 'FeeScheduleDisplayName', header: 'Fee Schedule Display Name' },
      {field: 'feeScheduleType', header: 'Schedule Type' },
      { field: 'EffectiveStartDate', header: 'Start Date' },
      { field: 'EffectiveEndDate', header: 'End Date' }
  ];
  }
getFeeScheduleType(){
  this.billingService.getFeesScheduleType().subscribe(res => {
    this.feeScheduleType = res;
  
  })
}
getCutomFormattedFeeSchedule(pgno?){
  let payload = {
    insuranceproviderId: this.rowData.insuranceProviderId,
    offset: pgno,
    limit:5
  }
this.billingService.getCustomFormattedFeeSchedule(payload).subscribe(res => {
  this.customFormattedFeeSchedule = res;
  this.feeScheduleTable = true;
  this.customFormattedFeeSchedule.Results.map((item,index) =>{
    item.EffectiveStartDate = moment(item.EffectiveStartDate).format('DD-MM-YYYY');
    item.EffectiveEndDate = moment(item.EffectiveEndDate).format('DD-MM-YYYY');
  })
})
}
selectedPage(event) {
  let currentpage = event.first / event.rows;
  this.getCutomFormattedFeeSchedule(currentpage)
}
onSave(){
  this.save = true;
  this.update = false;
  let payload ={
    InsuranceProviderId : this.rowData.insuranceProviderId,
    FeeScheduleTypeId: this.selectedFeeScheduleType.FeeScheduleTypeId,
    FeeScheduleDisplayName:this.feeScheduleDisplayName,
    EffectiveStartDate: this.effectiveStartDate,
    EffectiveEndDate: this.effectiveEndDate,
    DateCreated:new Date(),
    CreatedByUserId: this.authStore.UserDetail.UserId,
    DateLastUpdated: new Date(),
    LastUpdatedByUserId: this.authStore.UserDetail.UserId
  }
  this.billingService.addFeeSchedule(payload).subscribe(res => {
    this.toaster.success('Successfully Added');
    this.getCutomFormattedFeeSchedule()
  })
}
editFeeSchedule(rowData){
this.save = false;
this.update = true;
this.feeScheduleDisplayName = rowData.FeeScheduleDisplayName;
this.feeScheduleType.forEach(item => {
  if(item.FeeScheduleTypeId === rowData.FeeScheduleTypeId){
    this.selectedFeeScheduleType = item
  }
})
this.effectiveStartDate = new Date(rowData.EffectiveStartDate);
this.effectiveEndDate = new Date(rowData.EffectiveEndDate);
this.feeScheduleRowData = rowData;
}
onUpdate(){
  let payload = {
    FeeScheduleId: this.feeScheduleRowData.FeeScheduleId,
    InsuranceProviderId:this.feeScheduleRowData.InsuranceProviderId,
    FeeScheduleTypeId: this.selectedFeeScheduleType.FeeScheduleTypeId,
    FeeScheduleDisplayName: this.feeScheduleDisplayName,
    EffectiveStartDate: this.effectiveStartDate,
    EffectiveEndDate: this.effectiveEndDate,
    DateCreated: this.feeScheduleRowData.DateCreated,
    CreatedByUserId: this.feeScheduleRowData.CreatedByUserId,
    DateLastUpdated: new Date(),
    LastUpdatedByUserId: this.authStore.UserDetail.UserId
  }
  this.billingService.updateFeeSchedule(payload).subscribe(res => {
    this.toaster.success('Successfully Updated');
    this.getCutomFormattedFeeSchedule()
  })
}
feeSchedule(rowData){
  const modRef = this.modalService.open(EditDefaultFeeComponent, { centered: true, size: 'lg', windowClass: 'modelStyle'});
  modRef.componentInstance.editDefaultFee = true;
  modRef.componentInstance.feeScheduleRowData = rowData;
}
clearform(){
  this.feeScheduleDisplayName = '';
  this.selectedFeeScheduleType = {};
  this.effectiveStartDate = '';
  this.effectiveEndDate = '';
  this.save = true;
  this.update = false;
}
updateCptRvu(rowData,csv:any){
  this.fileReaded = csv.target.files[0];  
let reader: FileReader = new FileReader();  
reader.readAsText(this.fileReaded);  
  
reader.onload = (e) => {  
let csv : any  = reader.result;  
let allTextLines = csv.split(/\r|\n|\r/);  
let headers = allTextLines[0].split('","');  
let lines = []; 
for (let i = 1; i < allTextLines.length; i++) { 
// split content based on comma  
let data = allTextLines[i].split('","');  
for(let i = 0; i < data.length; i++ ){
  data[i] = data[i].replace('"', ' ') 
}  
  if (data.length === headers.length) {  
    let tarr = {
      cptCode: '',
      rvu :0,
      rvuConversionFactor:0
    };  
    for (let j = 0; j < headers.length; j++) {  
      tarr.cptCode = data[0]; 
      tarr.rvu = parseInt(data[1]);
      tarr.rvuConversionFactor = parseInt(data[2]); 
    }  
    
    // log each row to see outpu2t  
    lines.push(tarr);  
  }
// all rows in the csv file  
}
let payload = {
  feeScheduleId: rowData.FeeScheduleId,
  insuranceProviderId: rowData.InsuranceProviderId,
  feeScheduleTypeId: rowData.FeeScheduleTypeId,
  feeScheduleDisplayName: rowData.FeeScheduleDisplayName,
  effectiveStartDate: rowData.EffectiveStartDate,
  effectiveEndDate:rowData.EffectiveEndDate,
  updatedByUserId: this.authStore.UserDetail.UserId,
}
let enumCustomFormattedCPTRVU = lines

this.billingService.uploadCptRvuDefaultFS(enumCustomFormattedCPTRVU,payload).subscribe(res => {
  this.toaster.success('Successfully Upload');
})
}
}
closeModal(){
  this.modal.dismiss('Cross click');
  this.modal.close('Close click');
}
}
