import { Component, OnInit, ViewEncapsulation, Input, Output , EventEmitter} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../services/workspace/alerts.service';
import { ToastrService} from 'ngx-toastr'

@Component({
  selector: 'app-editmodal',
  templateUrl: './editmodal.component.html',
  styleUrls: ['./editmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditmodalComponent implements OnInit {
  @Input() alertContent;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  actionDescription: any;
actionCodeList: any = [];
  AssignToData: any;
  actionCode: any;
  assignTo: any;
  inProgress: boolean = false;
  lastEditedUser: any;
  action: any = "";
  firstname: any = "";
  lastname: any = "";
  time: any = "";
  description: any;
  constructor(public modal: NgbActiveModal,
    private alertservice: AlertService,
    private toaster: ToastrService) { }

  ngOnInit() {
    
    if(this.alertContent.AlertActionCode == "New") {
      this.actionCode = { label: 'New', value:1}
    } else if(this.alertContent.AlertActionCode == "Reassigned"){
      this.actionCode = { label: 'Reassigned', value:4}
    } else if(this.alertContent.AlertActionCode == "In-Progress"){
this.actionCode = { label: 'In-Progress', value:2}
    } else if(this.alertContent.AlertActionCode == "Resolved"){
      this.actionCode = { label: 'Resolved', value:3}
    }
    this.actionCodeList= [
      { label: 'New', value:1},
      { label: 'In-Progress', value:2},
      { label: 'Resolved', value:3},
      { label: 'Reassigned', value:4},
      
    ];
    this.lastEditUserDetails();
    this.getassigntovalues();

    this.getHistory();
  }
  getHistory(){
    for(let i=0; i< 4;i++){
      if(this.alertContent.AlertTypeId  == this.actionCodeList[i].value){
        this.action = this.actionCodeList[i].label;
      }
    }
   
  }
  acChange(item){
    this.actionCode = item
    if(this.actionCode.value == 2){
      this.inProgress = true
    } else {
      this.inProgress = false
    }
  }
  atChange(item){
    this.assignTo = item
  }
  saveAlert(){
    if(this.assignTo !== undefined){
this.alertContent.AssignedToUserId = this.assignTo.UserId
    }
    let param = {
      AlertId: this.alertContent.AlertId,
      AlertMessage: this.alertContent.AlertMessage,
      AssignedToUserId: this.alertContent.AssignedToUserId,
      AssignedPhysicianId: this.alertContent.AssignedPhysicianId,
      AlertActionCode: this.actionCode.label,
      ActionTimestamp: this.alertContent.ActionTimestamp,
      ActionDescription: this.actionDescription,
      AuditActivityId: this.alertContent.AuditActivityId,
      AlertTypeId: this.alertContent.AlertTypeId,
      DateCreated: this.alertContent.DateCreated,
      CreatedByUserId: this.alertContent.CreatedByUserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.alertContent.LastUpdatedByUserId,
      PatientId: this.alertContent.PatientId,
      ShowPatientNotification: true,
      RenewalRequestGuid: this.alertContent.RenewalRequestGuid,
      AlertScheduledDateDate: this.alertContent.AlertScheduledDateDate,
      CollectionTaskId: this.alertContent.CollectionTaskId,
      PatientLastname: this.alertContent.PatientLastname,
      PatientFirstname: this.alertContent.PatientFirstname,
      PatientMiddlename: this.alertContent.PatientMiddlename,
      PatientDob: this.alertContent.PatientDob
    }
    this.alertservice.EditAlerts(param).subscribe( result => {
      this.loadEvent.emit(true)
      this.showAlert("Alert updated succesfully!")
    })
  }
  lastEditUserDetails(){
    this.alertservice.GetUserDetails(this.alertContent.LastUpdatedByUserId).subscribe(results => 
     {
       this.lastEditedUser = results;
       this.firstname = this.lastEditedUser.FirstName;
       this.lastname  = this.lastEditedUser.LastName;
       this.time = this.alertContent.ActionTimestamp;
       this.description = this.alertContent.ActionDescription
     });
  }
  getassigntovalues(){
//     let userdata = JSON.parse(sessionStorage.getItem("UserDetail"));
//     console.log(userdata.UserId)
// let param = {
//   UserId: userdata.UserId
// }
    // this.alertservice.GetUsersWithRoles().subscribe(results => {
    //   this.AssignToData = results
    //   console.log(this.AssignToData)
    //   // for(let i=0; i<this.AssignToData; i++){
    //   //   this.AssignToData[i].FullName = this.AssignToData[i].LastName + "," + this.AssignToData[i].FirstName;
    //   // }
    //   console.log("value of assign to data is: ",this.AssignToData);
    //   });
    this.alertservice.getAllDoctors().subscribe(results => {
      this.AssignToData = results
    });
    }
    showAlert(msg: string){
      this.toaster.success(msg)
    }
}
