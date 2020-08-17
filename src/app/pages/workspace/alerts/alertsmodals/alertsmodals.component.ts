import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditmodalComponent } from '../editmodal/editmodal.component';
import { AlertService } from '../../../../services/workspace/alerts.service';
import { ModelviewComponent } from '../../../../theme/components/modelview/modelview.component'
@Component({
  selector: 'app-alertsmodals',
  templateUrl: './alertsmodals.component.html',
  styleUrls: ['./alertsmodals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertsmodalsComponent implements OnInit {

  // values to show or hide modals
  Search: boolean = false;
  edit: boolean = false;
  stackedmodal: boolean = false;
  results: any;
  AssignToData: any = [];
  AlertsData: any;
  totalRecords: any;
  alerts: any;
  actionCodeData: any;
  actionCode: any = "";
  constructor(public modal: NgbActiveModal,
    private modalService: NgbModal,
    private alertservice: AlertService,
    
  ) { }

  alertList: any = [];
  actionList: any = [];
  selectedAction: any
  selectedtype: any
  physicianList: any = [];
  Datefrom: any = ""
  Dateto: any = ""
  selectedphysician: any = ""
  patientName: any = ""
  alertTypes: any = [];
  alertTypeData: any;
  alertTypeId: any ="";
  physicianId: number = 0;
  ngOnInit() {
    // this.Search = name.Searchmodal;
    // console.log("value of name is: ",this.name);
    // this.results = this.name.results;
  this.searchAlertsWithPaged();
//   if(this.AlertsData.AlertActionCode == "New") {
//   } else if(this.AlertsData.AlertActionCode == "Reassigned"){
//     this.actionCode = { label: 'Reassigned', value:4}
//   } else if(this.AlertsData.AlertActionCode == "In-Progress"){
// this.actionCode = { label: 'In-Progress', value:2}
//   } else if(this.AlertsData.AlertActionCode == "Resolved"){
//     this.actionCode = { label: 'Resolved', value:3}
//   }
    this.actionList = [
      { label: 'All Action Codes', value: 1 },
      { label: 'New', value: "New" },
      { label: 'In-Progress', value: "In-Progress" },
      { label: 'Resolved', value: "Resolved" },
      { label: 'Reassigned', value: "Reassigned" },

    ];

    this.getPhysician()
    this.getAlertType()
  }
   
   getPhysician(){
    this.alertservice.getAllDoctors().subscribe(results => {
      this.physicianList = results
    });
  }

  getAlertType() {
    this.alertservice.getAlertType().subscribe(results => {
      this.alertTypes = results
    });
  }
  physicianChange(physicianData){
this.physicianId = physicianData.physicianId
  }
  alertChange(alertData){
    if(alertData == null){
      this.alertTypeId = ' '
      // console.log("Data is nulllll")
    }else{
      this.alertTypeId = alertData.AlertTypeId;
    }
let param = {
  first: 5,
  page: 0,
  pageCount: 24,
  rows: 5
}
this.paginate(param);
  }
  actionCodeChange(actionData){
if(actionData === null || actionData.label === 'All'){
  this.actionCode = ''
}else{
  this.actionCode = actionData.label

}
let param = {
  first: 5,
  page: 0,
  pageCount: 24,
  rows: 5
}
this.paginate(param);
  }
  paginate(event){
    // console.log(userdata)
    let param = {
      userId: this.physicianId,
      offset: event.page,
      limit: "5",
      actioncode: this.actionCode,
      datefrom: this.Datefrom,
      dateto: this.Dateto,
      alertypeId: this.alertTypeId,
      patientname: this.patientName
    }
    this.alertservice.getAllAlerts(param).subscribe(results => {
      this.AlertsData = results
      this.totalRecords = this.AlertsData.TotalItems;
      this.alerts = this.AlertsData.Results
          });
  }

  searchAlertsWithPaged() {
    let param = {
      first: 5,
      page: 0,
      pageCount: 24,
      rows: 5
    }
    this.paginate(param)
    // let filter = {
    //   offset: 0,
    //   limit: 10,
    //   userid: JSON.parse(sessionStorage.getItem('UserDetail')).UserId,
    //   actioncode: this.selectedAction.value,
    //   datefrom: this.Datefrom,
    //   dateto: this.Dateto,
    //   alertypeId: 1,//this.selectedtype.AlertTypeId,
    //   patientname: this.patientName
    // }
    // this.alertservice.GetAlertsWithPagedFilter(filter).subscribe(resp => {
    //   this.alertList = resp.Results;
    //   console.log("alerts list is=", this.alertList);
    // })
  }

  editbutton(item) {
    const modRef = this.modalService.open(EditmodalComponent);
    modRef.componentInstance.alertContent = item;
  }

findPatient(){
  const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle'});
  modalRef.componentInstance.name = 'true';
  modalRef.componentInstance.ComponentName = 'Charts';
  modalRef.componentInstance.openPopUp = true;
}
  // getassigntovalues(){
  //   this.alertservice.GetUsersWithRoles().subscribe(results => {
  //     this.AssignToData = results
  //     for(let i=0; i<this.AssignToData; i++){
  //       this.AssignToData[i].FullName = this.AssignToData[i].LastName + "," + this.AssignToData[i].FirstName;
  //     }
  //     console.log("value of assign to data is: ",this.AssignToData);
  //     });
  //   }
}
