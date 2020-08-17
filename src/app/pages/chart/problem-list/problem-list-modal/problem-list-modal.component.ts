import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import {ProblemlistService} from '../../../../services/chart/problemlist.service'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-problem-list-modal',
  templateUrl: './problem-list-modal.component.html',
  styleUrls: ['./problem-list-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProblemListModalComponent implements OnInit {
@Input() problemDetails;
@Input() modalType;
options: any;
@Output() loadEvent: EventEmitter<any> = new EventEmitter()
  selectedCategory = {value: 'Active'}
  dateDiagnosed: Date;
  userDetails: any;
  constructor( private modal: NgbActiveModal,
    private problemService: ProblemlistService,
    private toaster: ToastrService) { }

  ngOnInit() {
this.options = [
  {value: 'Active'},
  {value: 'Inactive'},
  {value: 'Resolved'},
  {value: 'Error'}
] 
if(this.problemDetails){
  this.options.forEach(item => {
    if(item.value === this.problemDetails.Status){
      this.selectedCategory = item;
    }
  })
}
this.userDetails = JSON.parse(sessionStorage.getItem('UserDetail'))
this.problemDetails.DateDiagnosed = new Date(this.problemDetails.DateDiagnosed)
}
deleteProblem(){
  let param ={
    MrProblemListId: this.problemDetails.MrProblemListId
  }
this.problemService.DeleteProblem(param).subscribe(
  (Result) => {
    this.loadEvent.emit(true);
    this.modal.close('Close click');
    this.showAlerts("Problem deleted successfully!")
  }
)
}
fixUTCDate(date) {
  if (date) {
  date.setTime(new Date(new Date(date.getTime() - (date.getTimezoneOffset() * 60 *
  1000)).toUTCString()));
  }
  return date
  }
saveProblem(){
  this.problemDetails.Active = true;
  this.problemDetails.Status = this.selectedCategory.value
  this.problemDetails.DateDiagnosed =this.fixUTCDate(this.problemDetails.DateDiagnosed)
  this.problemDetails.DateLastUpdated = new Date()
  this.problemDetails.DateModified = new Date()
  this.problemDetails.LastUpdatedByUserId = this.userDetails.UserId
  // let param = {
  //   MrProblemListId: this.problemDetails.ProblemListId,
  //   PatientId: this.userDetails.PatientId,
  //   MrPatientEncounterId: this.problemDetails.EncounterId,
  //   PhysicianId: this.problemDetails.,
  //   Status: this.problemDetails.Status,
  //   IsIcd10: this.problemDetails.,
  //   DateDiagnosed: this.problemDetails.DateDiagnosed,
  //   DateModified: this.problemDetails.DateModified,
  //   DateCreated: this.problemDetails.DateCreated,
  //   CreatedByUserId: this.problemDetails.CreatedUserId,
  //   DateLastUpdated: this.problemDetails.,
  //   LastUpdatedByUserId: this.problemDetails.,
  //   RcopiaProblemId: null,
  //   RcopiaXml: null,
  //   Code: null,
  //   CodeDescription: this.problemDetails.,
  //   Active: null
  //  }
  this.problemService.EditProblem(this.problemDetails).subscribe(
    (Result) => {
    this.loadEvent.emit(true);
    this.modal.close('Close click');
    this.showAlerts("Problem updated successfully!")
    }
  )
}

showAlerts(msg: string){
  this.toaster.success(msg)
}
}
