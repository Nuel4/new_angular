import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { AuthenticationStore } from '../../../../authentication/authentication-store';
import { CharthomeService } from '../../../../services/chart/charthome.service';
@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientPortalComponent implements OnInit {
@Input() portal;
fullname: any;
clinicalSummary: boolean = false;
problemList: boolean = false;
medicationList: boolean = false;
allergyInformation: boolean = false;
labResults: boolean = false;
radiology: boolean = false;
referral: boolean = false;
patientDetail: any = {};
  constructor(private modal: NgbActiveModal,private toaster: ToastrService,public authStore: AuthenticationStore,private chartservive: CharthomeService) { }

  ngOnInit() {
    this.fullname = this.authStore.PatientDetail.LastName +  '' + this.authStore.PatientDetail.FirstName;
    this.getPatientById()
      }
  getPatientById(){
    this.chartservive.getPatient(this.authStore.PatientDetail.PatientId).subscribe(res => {
    this.patientDetail = res;
    this.clinicalSummary = this.patientDetail.PatientPortalMakeClinicalSummaryAvailableToPatient;
    this.problemList = this.patientDetail.PatientPortalMakeProblemListAvailableToPatient;
    this.medicationList = this.patientDetail.PatientPortalMakeMedicationListAvailableToPatient;
    this.allergyInformation = this.patientDetail.PatientPortalMakeAllergyInfoAvailableToPatient;
    this.labResults = this.patientDetail.PatientPortalMakeLabResultsAvailableToPatient;
    this.radiology = this.patientDetail.PatientPortalMakeRadiologyReportsInfoAvailableToPatient;
    this.referral = this.patientDetail.PatientPortalMakeReferralLettersInfoAvailableToPatient;

    })
  }
  updatePatient(){
    this.patientDetail.PatientPortalMakeClinicalSummaryAvailableToPatient = this.clinicalSummary;
    this.patientDetail.PatientPortalMakeProblemListAvailableToPatient = this.problemList;
    this.patientDetail.PatientPortalMakeMedicationListAvailableToPatient = this.medicationList;
    this.patientDetail.PatientPortalMakeAllergyInfoAvailableToPatient = this.allergyInformation;
    this.patientDetail.PatientPortalMakeLabResultsAvailableToPatient = this.labResults;
    this.patientDetail.PatientPortalMakeRadiologyReportsInfoAvailableToPatient = this.radiology;
    this.patientDetail.PatientPortalMakeReferralLettersInfoAvailableToPatient = this.referral;
    this.chartservive.updatePatient(this.patientDetail).subscribe(res => {
      this.toaster.success('Successfully Updated');
      this.modal.close('Close click');
    })
  }
}
