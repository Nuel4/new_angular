import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PatientAccountsService } from './../../../../services/billing/patient-accounts.service';
import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { Router } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment';
import { PatientaccountSummaryModalComponent } from './patientaccount-summary-modal/patientaccount-summary-modal.component'
@Component({
  selector: 'app-patientaccount-summary',
  templateUrl: './patientaccount-summary.component.html',
  styleUrls: ['./patientaccount-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientaccountSummaryComponent implements OnInit {
  service: any[];
  cols: any[];
  detail: any[];
  col: any[];
  collection: boolean = false;
  patientSummaryDetails: any = [];
  patienPaymentDetails: any = [];
  patientAccountSummary: any = []
  customFromattedInsurance: any = {};
  totrec = 0;
  totpage = 0;
  rows: any;
  totalrec = 0;
  totalpage = 0;
  rowsBasic: any;
  basicSummary: any = [];
  detailSummary: any = {};
  finalCollection: any = [];
  charge: any;
  constructor(private patientAccService: PatientAccountsService, public authStore: AuthenticationStore, private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService) {

    this.cols = [

      { field: 'BillId', header: 'Bill Id' },
      { field: 'DateOfService', header: 'Service Date' },
      { field: 'CptCode', header: 'Charge Code' },
      { field: 'Amount', header: 'Charge($)' },
      { field: 'CopayDue', header: 'Copay Due($)' },
      { field: 'DeductibleDue', header: 'Ded Due($)' },
      { field: 'PatPayments', header: 'Pat Payment($)' },
      { field: 'Allowable', header: 'Allowable($)' },
      { field: 'InsPayments', header: 'Ins Payments($)' },
      { field: 'Adjustment', header: 'Adj($)' },
      { field: 'WriteOff', header: 'W/O($)' },
      { field: 'InsBalance', header: 'Ins Bal($)' },
      { field: 'PatBalance', header: 'Pat Bal($)' }
    ];
    this.col = [
      { field: 'posting_date', header: 'Posting Date' },
      { field: 'date_of_service', header: 'Service Date' },
      { field: 'physician', header: 'Physician' },
      { field: 'units', header: 'Units' },
      { field: 'place_of_service', header: 'POS' },
      { field: 'activity_description', header: 'Activity Description' },
      { field: 'financial_type', header: 'Financial Type' },
      { field: 'activity_code', header: 'Code' },
      { field: 'reference_number', header: 'Reference' },
      { field: 'charge', header: 'Charge' },
      { field: 'payment', header: 'Payment' },
      { field: 'adjustmentWO', header: 'Adj/Writeoff' },
      { field: 'account_balance', header: 'Balance' },
      { field: 'payment_date', header: 'Date Paid' },
      { field: 'username', header: 'User' }
    ]
  }

  ngOnChanges() {
    // this.authStore.PatientDetail;
    // console.log('On Change',this.authStore.PatientDetail.PatientId);
    let temp = this.route.snapshot['_routerState']
    console.log("Navigating:", temp.url)
    console.log('Authstore Patient Account Details', this.authStore.patientAccount)
    console.log("Full Name", this.authStore.patientAccount.LastName, this.authStore.patientAccount.FirstName)
  }

  ngOnInit() {
    this.getPatientAccountBasicSummaryByCharg(0);
    this.getPatientSummaryByCharge(0);
    this.getPatientPayment();
    this.getPatientAccountSummary();
    this.getCustomFormattedPatientInsurance();
  }
  CheckRecordExists(finalCollection, record) {
    let isExists = false;
    finalCollection.forEach((id) => {
      if (id.patient_account_activity_id === record.patient_account_activity_id) {
        isExists = true;
      }
    })
    return isExists;
  }
  // getTotalAmount(finalCollection, record) {
  //   if (!this.CheckRecordExists(finalCollection, record)) {
  //     if (!(this.patienPaymentDetails.FlagCoPay == 1 || this.patienPaymentDetails.FlagPatientCoInsurance == 1 || this.patienPaymentDetails.FlagDeductible == 1)) {
  //       let amount = 0;
  //       if (record.transaction_code == null && record.account_activity_category == "Charge" && record.amount >= 0) {
  //         if (record.primary_co_insurance_amount_paid != null) {
  //           amount += record.primary_co_insurance_amount_paid;
  //         }
  //       else if (record.primary_deductible_amount_paid != null) {
  //           amount += record.primary_deductible_amount_paid;
  //         }
  //        else if (record.primary_copay_amount_paid != null) {
  //           amount += record.primary_copay_amount_paid;
  //         }
  //         this.patientSummaryDetails.forEach((el,id) => {
  //           if(el.bill_transaction_id !== null){
  //             if(el.bill_transaction_id === record.bill_transaction_id){
  //               if(el.payment_transaction_id !== null){
  //                 if(el.amount !== null){

  //                   if(el.flag_primary_co_pay_reversal !==1 && el.flag_primary_deductible_reversal !==1 && el.flag_primary_patient_co_insurance_reversal !==1){

  //                     amount += el.amount
  //                     }
  //                 }
  //               }
  //             }
  //           }
  //         })
  //       }
  //       else if(record.transaction_code === null && record.account_activity_category === "Office Charge" && record.patient_non_procedure_office_charge_id !== null){
  //         if(record.primary_co_insurance_amount_paid !== null){
  //           amount += record.primary_co_insurance_amount_paid
  //         }
  //         else if(record.primary_co_insurance_amount_paid != null){
  //           amount = record.primary_co_insurance_amount_paid
  //         }
  //         else if(record.primary_copay_amount_paid != null){
  //           amount = record.primary_copay_amount_paid
  //         }
  //         this.patientSummaryDetails.forEach(item => {
  //           if(item.patient_non_procedure_office_charge_id !== null){
  //             if(item.patient_non_procedure_office_charge_id === record.patient_non_procedure_office_charge_id){
  //               if(item.amount !== null){
  //                 if(item.account_activity_category != "Office Charge"){
  //                   if(item.flag_primary_co_pay_reversal !==1 && item.flag_primary_deductible_reversal  !==1 && item.flag_primary_patient_co_insurance_reversal !==1){
  //                     amount = item.amount;
  //                   }
  //                 }
  //                 this.finalCollection.Add
  //               }
  //             }
  //           }
  //         })
  //       }
  //     }
  //   }
  //   if(record.transaction_code == null && record.account_activity_category === "Charge" && record.amount >=0 ){

  //   }
  // }
  getPatientSummaryByCharge(pgno) {
    let payload = {
      patientId: this.authStore.patientAccount?this.authStore.patientAccount.PatientId:0,
      offset: pgno,
      limit: 3
    }
    let activity_des: any;
    this.patientAccService.getPatientSummaryByCharge(payload).subscribe(res => {
      console.log('Patient Detailed Summary', res);
      this.patientSummaryDetails = res.Results;
      this.totrec = res.TotalItems;
      this.totpage = res.TotalPages;
      this.rows = res.PageSize;
      this.patientSummaryDetails.forEach(item => {
        item.charge = Math.abs(item.charge);
        item.payment = Math.abs(item.payment);
        item.adjustmentWO = Math.abs(item.adjustmentWO);
        item.account_balance = Math.abs(item.account_balance)
        item.posting_date = moment(item.posting_date).format("DD-MM-YYYY");
        item.date_of_service = moment(item.date_of_service).format("DD-MM-YYYY");
      })
      // if (this.patientSummaryDetails.activity_description !== null) {
      //   if (this.patientSummaryDetails.activity_description.includes(", Place of service code: ")
      //     || this.patientSummaryDetails.activity_description.includes(", Physician: ")
      //     || this.patientSummaryDetails.activity_description.includes(", Units: ")) {

      //     if (this.patientSummaryDetails.activity_description.includes(", Units: ")) {
      //       activity_des = this.patientSummaryDetails.activity_description.replace(", Units: ", "$").split('$');
      //       this.patientSummaryDetails.activity_description = activity_des.charAt(0);
      //       if (activity_des.charAt(1).includes(", Place of service code: ")) {
      //         activity_des = activity_des.charAt(1).replace(", Physician: ", "$").split('$');
      //         this.patientSummaryDetails.place_of_service_code = activity_des.charAt(0);
      //         this.patientSummaryDetails.Physician = activity_des.charAt(1);
      //       }
      //       else {
      //         this.patientSummaryDetails.place_of_service_code = activity_des.charAt(1);
      //       }
      //     }
      //     else if (activity_des.charAt(1).includes(", Physician: ")) {
      //       activity_des = activity_des.charAt(1).replace(", Physician: ", "$").split('$');
      //       this.patientSummaryDetails.units = activity_des.charAt(0);
      //       this.patientSummaryDetails.Physician = activity_des.charAt(1);
      //     }
      //     else {
      //       this.patientSummaryDetails.units = activity_des.charAt(1);
      //     }
      //   }
      //   else if (this.patientSummaryDetails.activity_description.includes(", Place of service code: ")) {
      //     activity_des = this.patientSummaryDetails.activity_description.replace(", Place of service code: ", "$").Split('$');
      //     this.patientSummaryDetails.activity_description = activity_des.charAt(0);
      //     if (activity_des.charAt(1).includes(", Physician: ")) {
      //       activity_des = activity_des.charAt(1).replace(", Physician: ", "$").Split('$');
      //       this.patientSummaryDetails.place_of_service_code = activity_des.charAt(0);
      //       this.patientSummaryDetails.Physician = activity_des.charAt(1);
      //     }
      //     else {
      //       this.patientSummaryDetails.place_of_service_code = activity_des.charAt(0);
      //     }
      //   }
      //   else if (this.patientSummaryDetails.activity_description.includes(", Physician: ")) {
      //     activity_des = this.patientSummaryDetails.activity_description.replace(", Physician: ", "$").Split('$');
      //     this.patientSummaryDetails.activity_description = activity_des.charAt(0);
      //     this.patientSummaryDetails.Physician = activity_des.charAt(1);
      //   }
      //   else {
      //     this.patientSummaryDetails.activity_description = this.patientSummaryDetails.activity_description;
      //   }
      // }
      // else {
      //   this.patientSummaryDetails.activity_description = this.patientSummaryDetails.activity_description;
      // }
      // this.patientSummaryDetails.reference_number = this.patientSummaryDetails.reference_number;
      // if (this.patientSummaryDetails.amount !== null) {
      //   if (this.patientSummaryDetails.transaction_code === null && ((this.patientSummaryDetails.account_activity_category === "Charge" && this.patientSummaryDetails.amount >= 0) || (this.patientSummaryDetails.account_activity_category === "Office Charge" && this.patientSummaryDetails.patient_non_procedure_office_charge_id !== null)) || (this.patientSummaryDetails.amount < 0 && this.patientSummaryDetails.patient_non_procedure_office_charge_id != null)) {
      //     this.patientSummaryDetails.charge = this.patientSummaryDetails.amount;
      //     if (!(this.patientSummaryDetails.amount < 0 && this.patientSummaryDetails.patient_non_procedure_office_charge_id != null))
      //       this.patientSummaryDetails.account_balance = this.patientSummaryDetails.amount + "totalAmount";
      //   }
      //   else if (this.patientSummaryDetails.account_activity_category == "Patient Payments" || this.patientSummaryDetails.account_activity_category == "Insurance Payments" || this.patientSummaryDetails.account_activity_category == "Reversal" || (this.patientSummaryDetails.account_activity_category == "Charge" && this.patientSummaryDetails.amount < 0))//office charge payments 
      //   {
      //     if (((this.patientSummaryDetails.flag_co_pay == 1 || this.patientSummaryDetails.flag_patient_co_insurance == 1 || this.patientSummaryDetails.flag_deductible == 1) && this.patientSummaryDetails.bill_transaction_id == null) && "totalAmount" != null)
      //       this.patientSummaryDetails.account_balance = "totalAmount";
      //     if (this.patientSummaryDetails.adjustment_write_off_id != null)
      //       this.patientSummaryDetails.adjustmentWO = this.patientSummaryDetails.amount;
      //     else
      //       this.patientSummaryDetails.payment = this.patientSummaryDetails.amount;

      //   }
      //   else if (this.patientSummaryDetails.account_activity_category == "Write-off" || this.patientSummaryDetails.account_activity_category == "Adjustment") {
      //     this.patientSummaryDetails.adjustmentWO = this.patientSummaryDetails.amount;

      //   }
      // }

      // this.patientSummaryDetails.payment_date = this.patientSummaryDetails.payment_date;
      // if (this.patientSummaryDetails.place_of_service != null){
      //   this.patientSummaryDetails.place_of_service_name = this.patientSummaryDetails.place_of_service;
      // }
      // else{
      //   this.patientSummaryDetails.place_of_service_name = "";

      // this.patientSummaryDetails.username = this.patientSummaryDetails.username;
      // }
      // return this.patientSummaryDetails;

    })
  }
  getPatientPayment() {
    let payload = {
      patientId: this.authStore.patientAccount ? this.authStore.patientAccount.PatientId:0,
    }
    this.patientAccService.getPatientPayment(payload).subscribe(res => {
      console.log('Patient Account', res);
      this.patienPaymentDetails = res[0]
    })
  }
  getPatientAccountSummary() {
    let payload = {
      patientId: this.authStore.patientAccount.PatientId
    }
    this.patientAccService.getPatientAccountSummary(payload).subscribe(res => {
      console.log('Patient Account Summary', res)
      this.patientAccountSummary = res[0]
      if (this.patientAccountSummary.FlagAccountInCollections === true) {
        this.collection = this.patientAccountSummary.FlagAccountInCollections;
      }
    })
  }
  printStatement() {
    const modRef = this.modalService.open(PatientaccountSummaryModalComponent, { windowClass: "modelStyle" });
    modRef.componentInstance.printStatement = true;
  }
  pastStatement() {
    const modRef = this.modalService.open(PatientaccountSummaryModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.pastStatement = true;
    modRef.componentInstance.patientId = this.authStore.patientAccount?this.authStore.patientAccount.PatientId:0
  }
  selectedPage(event) {
    console.log(event);
    let currentpage = event.first / event.rows;
    this.getPatientSummaryByCharge(currentpage)
  }
  checkActivityRecords() {
    // let payload = {

    // }
    // this.patientAccService.CheckActivityRecordsExists(payload).subscribe(res => {

    // })
  }
  getPatientAccountBasicSummaryByCharg(pgno) {
    let payload = {
      patientId: this.authStore.patientAccount ? this.authStore.patientAccount.PatientId : 0,
      offset: pgno,
      limit: 2
    }
    this.patientAccService.getPatientAccountBasicSummaryByCharge(payload).subscribe(res => {
      console.log('Basic Summary', res)
      this.basicSummary = res.Results;
      this.totalrec = res.TotalItems;
      this.totalpage = res.TotalPages;
      this.rowsBasic = res.PageSize;
      this.basicSummary.forEach((el, id) => {
        this.basicSummary[id].DateOfService = moment(this.basicSummary[id].DateOfService).format('DD-MM-YYYY')
        console.log('Service date', this.basicSummary[id].date_of_service)
      })
    })
  }
  selectedBasicSummary(event) {
    console.log(event);
    let currentpage = event.first / event.rows;
    this.getPatientAccountBasicSummaryByCharg(currentpage)
  }
  getCustomFormattedPatientInsurance() {
    let temp;
    let payload = {
      patientID: this.authStore.patientAccount?this.authStore.patientAccount.PatientId:0,
    }
    this.patientAccService.getCustomFormattedPatientInsurance(payload).subscribe(res => {
      console.log('Custom formatted API', res);
      temp = res
      temp.forEach((ele) => {
        switch (ele.order) {
          case 1: this.customFromattedInsurance.PI = ele.insurancename
            break;
          case 2: this.customFromattedInsurance.SI = ele.insurancename
            break;
          case 3: this.customFromattedInsurance.TI = ele.insurancename
            break;

        }
      });
    })
  }
}
