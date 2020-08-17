import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActReceivableService } from '../../../../services/billing/act-receivable.service';
@Component({
  selector: 'app-emailto-patient',
  templateUrl: './emailto-patient.component.html',
  styleUrls: ['./emailto-patient.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmailtoPatientComponent implements OnInit {
  patientDetails: any;
  userDetails: any;
  sendMailtoSinglePat: any;
  UpdateLastDate: any;
  selectedPayments:any=[];
  constructor(  private modal: NgbActiveModal,
    private ngbmodal: NgbModal,
    private actReceiveService: ActReceivableService,
    ) { }

  ngOnInit() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))

  }

  CloseModal(){
    this.modal.close('Close click');
  }

  sendMail(){
    if(this.selectedPayments.length>0){
      //post to patientbillingFIles with the generated file from stimulesoft
    }
    this.sendMailSinglePatientByParam();
    this.UpdateLastStatementDatePAS();
  }

  sendMailSinglePatientByParam(){
    let param = {
      patientId:this.patientDetails.PatientId,
      userId:this.userDetails.UserId,
    }
    this.actReceiveService.sendMailSinglePatient(param).subscribe((results : any) => {
      this.sendMailtoSinglePat = results;
    })
  }

  UpdateLastStatementDatePAS(){
    let param = {
      patientId:this.patientDetails.PatientId,
    }
    this.actReceiveService.UpdateLastStatementDate(param).subscribe((results : any) => {
      this.UpdateLastDate = results;
    })
  }

  // addPatientBillingFilesByParam(){
  //   this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
  //   this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
  //   let param = {
  //     PatientId: this.patientDetails.PatientId,
  //     FileName:
  //   }
  // }




}
