import { Component, OnInit,Output, ViewEncapsulation, Input, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select } from 'd3';
import { ProgressnoteService } from '../../../../../../app/services/chart/progressnote.service';
import { AlertService } from '../../../../../services/workspace/alerts.service'
import * as moment from 'moment'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-templatemodal',
  templateUrl: './templatemodal.component.html',
  styleUrls: ['./templatemodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TemplatemodalComponent implements OnChanges {
  @Input() follw_up_visit: any;
  @Input() import: any;
  @Input() save_sign: any;
  @Input() templateSectionObj: any;
  @Output() saveProgressNote: EventEmitter<any> = new EventEmitter()
  Date: any[];
  Reasons: any[];
  Year: any[];
  selectedValue: any;
  Physician: any;
  cars: any[] = []
  cols: any[];
  patientDetails: any;
  Encouter: any;
  selectedPhysician: any;
  selectedReason: any;
  comments: any;
  userDetails: any;
  followupVisits: any;
  selectedDate =  { label: '1', value: 1 };
  selectedYear = { label: 'Days', value: 'days' }
  pin: any;
  constructor(public activeModal: NgbActiveModal, private progressService: ProgressnoteService, private alertService: AlertService, private toaster: ToastrService) {
    this.Date = [
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
      { label: '5', value: 5 },
      { label: '6', value: 6 },
      { label: '7', value: 7 },
      { label: '8', value: 8 },
      { label: '9', value: 9 },
      { label: '10', value: 10 },
      { label: '11', value: 11 },
      { label: '12', value: 12 },
    ]

    this.Reasons = [
      { label: 'Blood Pressure Check', value: 'blood pressure check' },
      { label: 'Endoscopy', value: 'endoscopy' },
      { label: 'Labs/Blood', value: 'labs/blood' }
    ]
    this.cols = [
      { field: 'followupVisitDate', header: 'Visit Date' },
      { field: 'followUpVisitReasonDescription', header: 'Reason' },
      { field: 'comments', header: 'Comments' },
      { field: 'physicianName', header: 'Physician Name' }
    ];
  }


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
  ngOnInit() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"));
    this.userDetails = JSON.parse(sessionStorage.getItem('UserDetail'))
    if(this.import){this.getImport()}
    this.Year = [
      { label: 'Days', value: 'days' },
      { label: 'Weeks', value: 'weeks' },
      { label: 'Months', value: 'months' },
      { label: 'Years', value: 'years' }
    ]
    this.selectedValue = { label: 'Months', value: 'months' }
   if(this.follw_up_visit){ this.getPhysician();
    this.getReasons();
    this.getVisits();}
  }
  editFollowup(rowData){
console.log('edit :', rowData);
  }
  deleteFollowup(rowData){
    console.log("delete", rowData);
    // this.progressService.DeleteFollowupVisit
  }
  getPhysician() {
    this.alertService.getAllDoctors().subscribe(value => {
      console.log('value :', value);
      this.Physician = value
    })
  }
  getReasons() {
    this.progressService.GetFollowUpVistReason().subscribe(result => {
      console.log('result :', result);
      this.Reasons = result
    })
  }
  getVisits(event?) {
    let index = 0
    if(event){ index = (event.first / event.rows);}
    let param = {
      patientId: this.patientDetails.PatientId,
      offset: index,
      limit: 5
    }
    this.progressService.GetFollowUpVisit(param).subscribe(result => {
      console.log('visit result :', result);
      this.followupVisits = result
      this.followupVisits.Results.forEach(value => {
        value.followupVisitDate = moment(value.followupVisitDate).format('MM/DD/YYYY')
      })
    })
  }
  getImport() {
    console.log(this.templateSectionObj)
    let param = {
      patientID: this.patientDetails.PatientId,
      sections: this.templateSectionObj
    }
    this.progressService.getEncounterPatient(param).subscribe(res => {
      this.Encouter = res;
      console.log('Encounter Patient', res)
    })
  }
  addFollowup(){
    let date;
    switch(this.selectedYear.value){
      case 'days': date = moment().add(this.selectedDate.value, 'days');
      case 'weeks': date = moment().add(this.selectedDate.value, 'weeks')
      case 'months': date = moment().add(this.selectedDate.value, 'months')
      case 'years': date = moment().add(this.selectedDate.value, 'years')
    }
    console.log('date :', date);
    let param = {
      FollowupVisitDate: date,
      PatientId: this.patientDetails.PatientId,
      FollowUpVisitReasonCode: this.selectedReason.FollowUpVisitReasonCode,
      PhysicianId: this.selectedPhysician.physicianId,
      Comments: this.comments,
      DateCreated: new Date(),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.UserId,
      Active: true,
      // FollowUpVisitReasonCodeNavigation: this.selectedReason
    }
    this.progressService.AddFollowupVisit(param).subscribe( result => {
      console.log('add visit result :', result);
      this.getVisits()
  })

  }
  onTabOpen(e) {
    var index = e.index;
    let param = {
      patientEncounterId: e.MrPatientEncounterId,
    }
    this.progressService.getEncounterComplete(param).subscribe(res => {
      console.log('Encounter complete', res, param)
    })
    this.onFormField(e)
  }
  onFormField(e) {
    let payload = {
      patientEncounterId: e.MrPatientEncounterId,
    }
    this.progressService.getEncounterFormField(payload).subscribe(res => {
      console.log('Form Field', res)
    })
  }
  validatePin(){
    if(this.userDetails.Pin === this.pin){
this.saveProgressNote.emit(true)
this.activeModal.close()
    } else {
this.toaster.error("Please enter valid pin!")
    }
  }
}
