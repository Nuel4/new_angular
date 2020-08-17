import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientmanagementService } from '../../../../services/workspace/patient-management.service'
import { AuthenticationStore } from '../../../../authentication/authentication-store';
import { PatientsSummaryService } from '../../../../services/patientSummary.service';
import { AddAppointmentComponent } from '../../../../pages/workspace/calendar/add-appointment/add-appointment.component';


@Component({
  selector: 'app-patient-summary',
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientSummaryComponent implements OnInit {
  patientAppointment: any = {};
  appointmentStatus: any = "";
  showAppointments: boolean = true;
  isDisable: boolean = false;
  apptStatus: any;
  selectedApptStatus: any = { appointmentStatus: 'Scheduled' }
  totalRecords: any;
  rows: any;
  patientDetails: any;
  AllergyList: any;
  EncounterList: any = {};
  EncounterDetail: any;
  constructor(
    private activeModal: NgbActiveModal,
    private _patientmanagementService: PatientmanagementService,
    private AuthStore: AuthenticationStore,
    private patientsummaryService: PatientsSummaryService ,private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getpatientappointment(this.AuthStore.PatientDetail.PatientId);
    this.getAppointmentStatus();
    this.getMrPatientEncounterByPatientId();
   
  }

  reset() {
    // this.router.navigate(['pages']);    
    this.activeModal.dismiss('Cross click');
  }

  paginateAppointment(event) {
    console.log("paginate page ", event)
    let currentpage = event.first / event.rows;
    console.log("paginate page ", currentpage)
    this.getpatientappointment(this.AuthStore.PatientDetail.PatientId, currentpage);
  }

  getpatientappointment(patientid = this.AuthStore.PatientDetail.PatientId, pageNo?) {
    console.log(this.selectedApptStatus)
    let param = {
      // 35870
      patientid: patientid,
      AppointmentStatus: this.selectedApptStatus.appointmentStatus,
      offset: pageNo ? pageNo : 0,
      limit: 5
    }
    this.patientAppointment = ""
    this._patientmanagementService.GetPatientAppointment(param).subscribe(res => {

      this.patientAppointment = res;
      // this.patientAppointment.appointmentstatus = this.appointmentStatus
      this.showAppointments = false;
      this.totalRecords = res.TotalItems
      this.rows = res.PageSize
      console.log("cfappointment", this.patientAppointment)
    })
  }

  getAppointmentStatus() {
    this._patientmanagementService.getAppointmentStatus().subscribe(resp => {
      this.apptStatus = resp
      console.log(this.apptStatus)
    })
  }

  getMrPatientEncounterByPatientId(){
  this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
      offset:0,
      limit:10,

    }
    this.patientsummaryService.getPatientEncounterByPatientId(param).subscribe((results: any) => {
    this.EncounterList = results;
    console.log("EncounterList are:",this.EncounterList)
  })
}

onExpand(rowData){
this.getTemplatePatientEncounterSectionByEncounterId(rowData)
}

getTemplatePatientEncounterSectionByEncounterId(data){
  let param = {
    encounterId:data.mr_patient_encounter_id,
  }
  this.patientsummaryService.getTemplatePatientEncounterSection(param).subscribe((results: any) => {
    this.EncounterDetail = results;
    console.log("encounter detail:",this.EncounterDetail)
  })

}



// getMrPatientEncounterByEncounterId(data){
  //   let param = {
  //     encounterId: data.mr_patient_encounter_id,

  //   }
  //   this.patientsummaryService.getPatientEncounterFullByEncounterId(param).subscribe((results: any) => {
  //     this.EncounterDetail = results;
  //     console.log("encounter detail:",this.EncounterDetail)
  //   })
  // }

  disableEdit() {
    this.isDisable = true
  }
  bookAppointment(){
    const modRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.bookAppointment = true;
    modRef.componentInstance.selectedData = {
      ApptObj : {
      LastName: this.AuthStore.PatientDetail.LastName,
      FirstName: this.AuthStore.PatientDetail.FirstName,
      DateOfBirth: this.AuthStore.PatientDetail.DateOfBirth,
      UniqueNumber: this.AuthStore.PatientDetail.UniqueNumber,
      MobilePhone : this.AuthStore.PatientDetail.MobilePhone,
      FlagSelfPayPatient : this.AuthStore.PatientDetail.FlagSelfPayPatient,
      },
      start : new Date(),
      end: new Date(),
      co_pay_amount: '',
      comments:'',
      is_specialist_visit: false,
      facility: {
        id:0
      }
    }
  }
}
