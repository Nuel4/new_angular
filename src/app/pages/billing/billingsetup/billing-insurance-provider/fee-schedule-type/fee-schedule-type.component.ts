import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BillingSetupService } from '../../../../../services/billing/billing-setup.service';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-fee-schedule-type',
  templateUrl: './fee-schedule-type.component.html',
  styleUrls: ['./fee-schedule-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FeeScheduleTypeComponent implements OnInit {
@Input() feeSchedule;
  cols: any = [];
  displayDialog: boolean;
  scheduleLists: any = [];
  rowDataClicked: any = [];
  list: any;
  addNew : boolean = false;
  deleteData: any;
  copyScheduleLists: any = [];
  deleteList: any=[];
  constructor(private billingService: BillingSetupService,public authStore: AuthenticationStore,private toaster: ToastrService,private modal: NgbActiveModal) { }

  ngOnInit() {
    this.cols = [
      { field: 'feeScheduleType', header: 'Fee Schedule Type' },
    ],
      // this.scheduleLists = [
      //   { feeScheduleType: 'Commercial' },
      //   { feeScheduleType: 'Default Commercial' },
      //   { feeScheduleType: 'Drivers Commision' },
      //   { feeScheduleType: 'Medicaid' },
      //   { feeScheduleType: 'Medicare' },
      //   { feeScheduleType: 'Medicare with Crossover' },
      //   { feeScheduleType: 'Workers Compensation' },
      // ];
      this.getFeesScheduleType()
  }
  showDialog() {
    this.displayDialog = true;
  }
  addNewRow(){
    this.addNew = true;
    let data = {
      Name: ''
    }
    this.scheduleLists.push(data)
  }
  getFeesScheduleType(){
    this.billingService.getFeesScheduleType().subscribe(res => {
      this.scheduleLists = res;
      })
  }
  deleteFeeSchedule(rowData){
  this.scheduleLists = this.scheduleLists.filter(item => {
      return item!== rowData
    })
   this.deleteList.push(rowData)
  }
  addFeeScheduleType(){
   let saveArr = [],updateArr = [],deleteArr = [];
   let payload :any = {};
   this.copyScheduleLists = [];
   this.billingService.getFeesScheduleType().subscribe(res => {
    this.copyScheduleLists = res;
   this.scheduleLists.forEach(item => {
   if(this.copyScheduleLists !== null){
     payload = this.copyScheduleLists.find(key => parseInt(key.FeeScheduleTypeId) === parseInt(item.FeeScheduleTypeId))
    if(payload !== undefined){
         if(payload.Name !== item.Name){
          payload.Name = item.Name;
          payload.DateLastUpdated = new Date();
          payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
          updateArr.push(payload)
        }
       }
      
       else {
         payload = {};
         if(item.Name !== null){
           payload.DateCreated = new Date();
           payload.CreatedByUserId = this.authStore.UserDetail.UserId;
           payload.DateLastUpdated = new Date();
           payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
           payload.Name = item.Name;
           saveArr.push(payload)
          }
        }
        }
    })    
    if(saveArr.length > 0){
      this.billingService.bulkAddFeeScheduleType(saveArr).subscribe(res => {
        this.toaster.success('Successfully Added')
        this.getFeesScheduleType()
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
      })
    }
    if(updateArr.length > 0){
      this.billingService.bulkUpdateFeeScheduleType(updateArr).subscribe(res => {
        this.toaster.success('Successfully Update')
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
     })
    }
  })
    if(this.deleteList.length > 0)
  this.billingService.bulkDeleteFeeScheduleType(this.deleteList).subscribe(res => {
    this.toaster.error('Successfully Deleted')
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
  })
  }
  onRowSelect(event) {
    this.rowDataClicked = event.data
    this.displayDialog = true;
  }

}
