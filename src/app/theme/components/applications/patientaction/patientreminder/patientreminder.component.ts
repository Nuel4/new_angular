import { Component, OnInit, ViewEncapsulation, Output, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientActionService } from './../../../../../services/chart/patient-action.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationStore } from './../../../../../authentication/authentication-store';

@Component({
  selector: 'app-patientreminder',
  templateUrl: './patientreminder.component.html',
  styleUrls: ['./patientreminder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientreminderComponent implements OnInit {
  @Input() selectedData;
  @Output() loadReminder: EventEmitter<any> = new EventEmitter();

  reason: any
  notes: any
  name: any;
  FollowUpData: any;
  constructor(
    private activeModal: NgbActiveModal,
    private patientAction: PatientActionService,
    private toastr: ToastrService, 
    private authStore: AuthenticationStore
    ) {

  }

  ngOnInit() {
    this.name = this.selectedData.name
    this.reason = this.selectedData.reason
    this.notes = this.selectedData.notes
    this.getfollowupdata()
  }

  getfollowupdata(){
    this.patientAction.getFollowUpCallListById({followUpListId:this.selectedData.FollowUpCallListId}).subscribe(resp=>{
      this.FollowUpData = resp
      console.log(this.FollowUpData)
    })
  }

  onSubmit() {
    // let updateData = {
    //   "FollowUpCallListId": 0,
    //   "FacilityId": 0,
    //   "PatientId": 0,
    //   "CallReason": "",
    //   "DateCalled": "2019-04-24T10:36:23.369Z",
    //   "CallMadeByUserId": 0,
    //   "Notes": "",
    //   "FollowUpCallStatus": "",
    //   "DateCreated": "2019-04-24T10:36:23.369Z",
    //   "CreatedByUserId": 0,
    //   "DateLastUpdated": "2019-04-24T10:36:23.369Z",
    //   "LastUpdatedByUserId": 0,
    // }

    let updateData = this.FollowUpData
    updateData.CallReason = this.reason
    updateData.Notes = this.notes
    // updateData.LastUpdatedByUserId = this.authStore.UserDetail.Userid
    // updateData.DateLastUpdated = new Date()

    this.patientAction.putFollowUpCallList(updateData).subscribe(resp=>{
      console.log(resp)
      this.loadReminder.emit(true)
    })
  }
}
