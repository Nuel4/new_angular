import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActReceivableService } from '../../../../services/billing/act-receivable.service';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { json } from 'd3';

import { EmailtoPatientComponent } from '../emailto-patient/emailto-patient.component';
import * as moment from 'moment';
@Component({
  selector: 'app-actreceivable-modals',
  templateUrl: './actreceivable-modals.component.html',
  styleUrls: ['./actreceivable-modals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActreceivableModalsComponent implements OnInit {
  activeUsers: any;
  alertType: any;
  @Input() opensAlertModal:boolean;
  @Input() openActionModal:boolean;
  @Input() openViewBillModal:boolean;
  @Input() rowData:any;
  patientDetails: any;
  patientInfo: any;
  alertMessage: any;
  selectedUser: any;
  userDetails: any;
  paymentDate: any;
  savedAlert: any;
  emailSent: any;
  sendMailtoSinglePat: any;
  isEnableModal: boolean = true
  selectedPayments: string[] = ['Show with Payments']
  PatientData: any;
  patActSummary: any;
  insuranceInfo: any;
  actBalDue: any;
  col: any[];
  ExpandTable: any[];
  BillsData: any;
  PatientPaymentInfo: any;
  unAllocatedPayments : any;
  ExpandBillsData: any;
  firstCheckboxValue: any =[];
  secondCheckboxValue: any =[];
  ThirdCheckboxValue : any =[];
  AppUserDetails : any;
  rebuildTo: any;

  constructor( private actReceiveService: ActReceivableService,
    private modal: NgbActiveModal,
    private ngbmodal: NgbModal,
    private toastr: ToastrService,) { 

      this.col = [
        {field: 'BillHeaderId', header: 'Bill Id'},
        {field: 'DateCreated', header: 'Bill Date'},
        {field: 'BillReferenceNumber', header: 'Bill Reference'},
        {field: 'PhysicianName', header: 'Physician'},
        {field: 'TotalCharges', header: 'Total Charges'},
        {field: 'CopayAmountPaid', header: 'Co-Pay Paid'},
        {field: 'CoInsurancePatientAmountPaid', header: 'Co-Ins.Paid'},
        {field: 'DeductibleAmountPaid', header: 'Deductible Paid'},
        {field: 'PatientAmountReceived', header: 'Total Pat.Pymt'},
        {field: 'PrimaryInsuranceAmountReceived', header: 'Prim.Ins.Paid'},
        {field: 'SecondaryInsuranceAmountReceived', header: 'Sec.Ins.Paid'},
        {field: 'TertiaryInsuranceAmountReceived', header: 'Ter.Ins.Paid'}
      ];

      this.ExpandTable = [
        {field: 'BillTransactionId', header: 'Id'},
        {field: 'ServiceDate', header: 'Service Date'},
        {field: 'CptCode', header: 'CPT'},
        {field: 'TotalCharges', header: 'Tot. Charge'},
        {field: 'CopayAmountPaidToApply', header: 'Req. Co-Pay'},
        {field: 'CoInsuranceAmountRequiredToApply', header: 'Req. Co-Ins'},
        {field: 'DeductibleAmountRequiredToApply', header: 'Req. Deduct'},
        {field: 'CopayAmountPaid CoinsuranceAmountPaid DeductibleAmountPaid', header: 'Paid:Co-Pay Co-Ins Deduc'},
        {field: 'ChargesAllowed', header: 'Allow'},
        {field: 'AmountToApply', header: 'Apply'},
        {field: 'AmountToAdjustment', header: 'Adjst'},
        {field: 'AmountToWriteOff', header: 'W/O'},
        {field: 'InsuranceBalanceOTF', header: 'Ins. Bal'},
        {field: 'InsuranceBalanceOTF', header: 'Pat.Bal'},
        {field: 'bill_date', header: 'Rebill To'},
        {field: 'PatientAmountReceived', header: 'Tot. Pat. Payments'},
        {field: 'CopayAmountRequired coinsuranceAmountRequired deductibleAmountRequired', header: 'Req:Co-Pay Co-Ins Deduc'},
        {field: 'Modifiers', header: 'M1-M4'},
        {field: 'PlaceOfServiceCode', header: 'POS'},
        {field: 'Units', header: 'Units'},
      ]
    }

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.AppUserDetails = JSON.parse(sessionStorage.getItem("ApplicationUserDetail"))

    this.rebuildTo = [
      {name: 'Primary',value:1},
      {name: 'Secondary',value:2},
      {name: 'Tertiary',value:3},
    ]
    if(this.opensAlertModal){
      this.getActiveUsers();
      this.getAlertType();
    }
    if(this.openActionModal){
      this.getCustomFormattedPatientsDetails();
    }

    if(this.openViewBillModal){
      this.getPatientInfo();
      this.getPatientAccountSummaryById();
      this.getCustomFormattedInsuranceById();
      this.getPatientPaymentsById();
      this.getCustomFormattedBills();
    }
  
  }

 getActiveUsers(){
    let param = {
      FacilityID:0
    }
    this.actReceiveService.getActiveUsersForApptDairy(param).subscribe((results: any) =>{
      this.activeUsers = results;
      // this.Fullname = this.activeUsers.lastName + " " + this.activeUsers.firstName;
      console.log("alert active users:", this.activeUsers)
    })
  }

  getAlertType(){
    let param = {
      alertType1 : "AR Reminder"
    }
    this.actReceiveService.getAlertTypeByAlertType(param).subscribe((results: any) => {
      this.alertType = results;
      console.log("alert typr reminder",this.alertType)
    } )
  }

  getCustomFormattedPatientsDetails(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      pPatientId: this.patientDetails.PatientId
    }
    this.actReceiveService.getCustomFormattedPatientDetailsById(param).subscribe((results: any) => {
      this.patientInfo = results;
      console.log("patient details:",this.patientInfo)
    })
  }

  savingAlert(){
    let param = {
      AlertMessage:this.alertMessage,
      AssignedToUserId:this.selectedUser.userId,
      AssignedPhysicianId:0,
      AlertActionCode:null,
      ActionTimestamp:null,
      ActionDescription:null,
      AuditActivityId:0,
      AlertTypeId:this.alertType.AlertTypeId,
      DateCreated:new Date(),
      CreatedByUserId:this.userDetails.UserId,
      DateLastUpdated:new Date(),
      LastUpdatedByUserId:this.userDetails.UserId,
      PatientId:this.patientDetails.PatientId,
      ShowPatientNotification:true,
      RenewalRequestGuid:null,
      AlertScheduledDateDate:this.paymentDate,
      CollectionTaskId:0,
      PatientLastname:this.patientDetails.LastName,
      PatientFirstname:this.patientDetails.FirstName,
      PatientMiddlename:this.patientDetails.MiddleName,
      PatientDob:this.patientDetails.DateOfBirth,
    }
    this.actReceiveService.saveAlert(param).subscribe((results: any) => {
      this.savedAlert = results;
      this.toastr.success("Alert save successfully")
      // this.modal.close('Close click');
    
      // console.log("")
    })
  }

  resubmittoclaims(){
    let bills :any =[] 
      bills.push(this.rowData.BillId);
    let param = {
      pSelectedBills:bills,
      UserId:this.userDetails.UserId,
      CorePracticeId :this.AppUserDetails[0].PracticeDetailsId,
      pIsResubmitted:true,
      pIsRebillTo:false,
      pBillTo : 1,
    }
    this.actReceiveService.GetClaimsFile(param).subscribe((results: any) => {
      this.toastr.warning(results.Result);

    },
    error => {
      this.toastr.error(error)
    })
  }

  //action modal api integration

  saveAction() {
    console.log(this.rowData);
    if (this.firstCheckboxValue.length == 0 &&this.secondCheckboxValue.length == 0 &&this.ThirdCheckboxValue.length == 0 ) {
      this.toastr.error("Please select an action to perform.")
    }
    if(this.firstCheckboxValue.length > 0)
    {
      let bills :any =[] 
      bills.push(this.rowData.BillId);
      let param = {
        pSelectedBills:bills,
        UserId:this.userDetails.UserId,
        CorePracticeId :this.AppUserDetails[0].PracticeDetailsId,
        pIsResubmitted:true,
        pIsRebillTo:false,
        pBillTo : 1,
      }
      this.actReceiveService.GetClaimsFile(param).subscribe((results: any) => {
        this.toastr.warning(results.Result);

      },
      error => {
        this.toastr.error(error)
      })
    }
    if(this.secondCheckboxValue.length > 0)
    {
      let param = {
        patientIds: [this.patientDetails.PatientId]
      }
      this.actReceiveService.checkEmailAndAccess(param).subscribe((results: any) => {

        if (results) {
          this.toastr.warning(results);
        } else {
          const modRef = this.ngbmodal.open(EmailtoPatientComponent, { windowClass: "emailToPatient" })
          this.modal.close('Close click');
        }

      })
    }
  }

  
  CloseModal(){
    this.modal.close('Close click');
  }
  
  getPatientInfo(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      firstname: this.patientDetails.FirstName,
      lastname:this.patientDetails.LastName,
      dob:this.patientDetails.DateOfBirth,
    }
    this.actReceiveService.getPatients(param).subscribe((results : any) => {
      this.PatientData = results[0];
      console.log("patient data:", this.PatientData)
    })
  }

  getPatientAccountSummaryById(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
     let param = {
      patientId:this.patientDetails.PatientId
     }
     this.actReceiveService.getPatientAccountSummary(param).subscribe((results : any) => {
       this.patActSummary = results[0];
       this.actBalDue = this.patActSummary.PatientBalanceDue + this.patActSummary.InsuranceBalanceDue;
       console.log("accountBalDue:",this.actBalDue)
     })
  }

  getCustomFormattedInsuranceById(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientID:this.patientDetails.PatientId,
    }
    this.actReceiveService.getcustomFormattedInsurance(param).subscribe((results : any) => {
      this.insuranceInfo = results;

    })
  }

  getPatientPaymentsById(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientId: this.patientDetails.PatientId,
    }
    this.actReceiveService.getPatientPayment(param).subscribe((results : any) => {
      this.PatientPaymentInfo = results;
      if(results!= null){
        let  PatientPayment : any=0,TotalAmtApplied : any=0;
        this.PatientPaymentInfo.forEach((item: any , index: any) => {
          PatientPayment += item.PaymentAmount;
          TotalAmtApplied += item.TotalAmountAppliedToCharges;
        })
       this.unAllocatedPayments = PatientPayment - TotalAmtApplied;
       console.log("unallocated payments:",this.unAllocatedPayments)
       
      }
    })
  }

  getCustomFormattedBills(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
      isInsurancePayment: true,
      paymentId:0,
      billTransactionId:0,
    }
    this.actReceiveService.getPatientCustomFormattedBills(param).subscribe((results : any) =>{
      this.BillsData = results;
      
      console.log("display bills data:",this.BillsData )
      this.BillsData.forEach(item => {
        item.DateCreated = moment(item.DateCreated).format('DD/MM/YYYY');
      })
     
    })
   }

   onRowSelect(data){
    console.log("selected row:",data);
    this.getCustomFormettedBillsItems(data);
  }

   getCustomFormettedBillsItems(values){
    let param = {
     billHeaderId:values.BillHeaderId,
     isInsPayment:false,
     isAssociatedAsPrimaryInsurance:values.IsAssociatedAsPrimaryInsurance,
     isAssociatedAsSecondaryInsurance:values.IsAssociatedAsSecondaryInsurance,
     isAssociatedAsTertiaryInsurance:values.IsAssociatedAsTertiaryInsurance,
    }
    this.actReceiveService.getPatientCustomFormattedBillsItems(param).subscribe((results : any) => {
      this.ExpandBillsData = results;
      console.log("table expand bill data:",this.ExpandBillsData)
      this.ExpandBillsData.forEach(item => {
        item.ServiceDate = moment(item.ServiceDate).format('DD/MM/YYYY');
      })
    })
  }

  

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

}
