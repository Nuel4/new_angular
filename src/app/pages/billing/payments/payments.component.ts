import { Component, OnInit, ViewEncapsulation, Output } from "@angular/core";
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { Observable, forkJoin } from 'rxjs';
import { PaymentsService } from "../../../services/billing/payments.service";
import { PrescribeService } from './../../../services/chart/prescribe.service';
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component';
import { InsuranceProviderService } from '../../../services/billing/insuranceprovider.service';
import { AllocateInsuranceComponent } from '../payments/allocate-insurance/allocate-insurance.component';
import { WaitingroomService } from '../../../services/waitingnroom/waitingroom.service';
import { BillersNoteComponent } from '../../../theme/components/applications/waitingroom/billers-note/billers-note.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { parse } from "path";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { element } from "@angular/core/src/render3/instructions";
interface Insurance {
  name: string;
  insuranceProviderId?: number;
  insuranceProviderName?: string;
}
// interface Payments {
//   name: string;
// }
// interface Method {
//   name: string;
// }
// interface Payment {
//   name: string;
// }
// interface Details {
//   name: string;
// }
// interface Details {
//   name: string;
// }
// interface Pending {
//   name: string;
// }
// interface Physician {
//   name: string;
// }
// interface Type {
//   name: string;
// }
@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})


export class PaymentsComponent implements OnInit {
  insurance: Insurance[];
  selectedInsurance: any = {};
  method: Insurance[];
  selectedMethod: Insurance;
  payment: Insurance[];
  selectedPayment: Insurance;
  details: Insurance[];
  selectedDetails: Insurance;
  bulk: any[];
  InsuranceCol: any[];
  patient: any[];
  paymentCol: any[];
  pending: Insurance[];
  selectedPending = { name: "Pending Allocation" };
  type: any;
  selectedType: any;
  physician: Insurance[];
  selectedPhysician: any;
  paymnts: Insurance[];
  selectedPayments: Insurance;
  superBills: any[];
  columns: any[];
  payments: any[];
  amountdata: any[];
  colmn: any[];
  patientdata: any = {};
  CheckBillarNote: boolean = true;
  hasRequiredPatientAmount: boolean = false;
  // variables based on old app
  LblTopUniqueNumber;
  CFPhysicians;

  // declaring variable to store payment data values
  private Paymentdata: any = [];
  private InsurancePayment: any = [];
  patientDetails: any;
  InsuranceList: any;
  InsuranceDetails: any;
  patientName: any;
  payerID: any;
  paymentDate = new Date();
  refNumber: any;
  PaymentAmt: number;
  ChargeBckAmt: number;
  TotalAmt: any;
  userDetails: any;
  dateFrom: any;
  dateUntil: any;
  RefNumber: any;
  Index: number;
  PaymentTransData: any = {};
  val1: string;
  checked = [];
  SavedInsurance: any;
  BulkInsuranceList: any;
  isenableUpdateButton: boolean = false;
  UpdatedInsuranceValue: any;
  PaymentsByProividerId: any;
  InsurancePaymentObj: any;
  deletedInsurance: any;
  patientPaymentTableData: any;
  tabindex: number = 0;
  PayAmount: number;
  DateOfPayment: Date;
  referenceNo: any;
  FullName: string;
  patientPaymentIdData: any;
  PhysicianList: any;
  UpdatedPatientPayments: any;
  guarantorData: any;
  isDisableGuarantor: boolean = true;
  selectedGuarantor: any;
  savedPatientPayments: any;
  AdjWriteOfBills: any = [];
  ExpandTable: any[];
  AdjWriteOfBillsItems: any;
  reversedAmount: any;
  changeReversalAmt: any;
  reversalId: any;
  reversalReason: any;
  ReversedPayment: any;
  openReversalModal: boolean = false;
  requiredPatientAmount: boolean = false;
  PatientAmountData: any;
  selectedList: any = [];
  expand : boolean = false;
  selectedRow: any;
  selectedBulkInsurance: any;
  constructor(
    private modal: NgbActiveModal,
    private router: Router,
    private paymentservice: PaymentsService,
    // private insPayments : PaymentsService,
    private insurancep: InsuranceProviderService,
    private location: Location,
    private PS: PrescribeService,
    private modalService: NgbModal,
    private wrs: WaitingroomService,
    private toastr: ToastrService,
  ) {
    this.getPatientDetails();
    // this.insurance = [
    //   { name: "222222222 - National Insurance Company" },
    //   { name: "AET - Aetna" },
    //   { name: "CIG - Cigna" },
    //   { name: "LIC" },
    //   { name: "MDCR - Medicare" }
    // ];
    this.method = [
      { name: " " },
      { name: "Cash" },
      { name: "Cheque" },
      { name: "Credit Card" },
      { name: "Debit Card" },
      { name: "EFT" }
    ];

    // this.selectedMethod = this.method[0];

    this.paymnts = [
      { name: "All" },
      { name: "Patient Payment" },
      { name: "Insurance Payment" },
      { name: "Adjustment/Write-offs" },
      { name: "Non-procedure Office Charge" }
    ];

    this.selectedPayments = this.paymnts[0];
    // this.payment = [
    //   { name: "National Insurance Company (222222222)" },
    //   { name: "Medicare (MDCR)" },
    //   { name: "LIC" },
    //   { name: "Cigna" },
    //   { name: "Aetna (AET)" }
    // ];
    this.physician = [{ name: "Logic" }, { name: "Test" }, { name: "pentel" }];
    this.details = [
      { name: "All" },
      { name: "Pending Allocations" },
      { name: "Reversed" }
    ];
    this.selectedDetails = this.details[0]
    this.pending = [
      { name: "Pending Allocation" },
      { name: "All Patient Payments" }
    ];
    
     this.type = [
      { name: "Other/General" },
      { name: "Prepayment" },
      { name: "Deductible" },
      { name: "Co-Insurance" },
      { name: "Co-Pay" }
    ];
    this.selectedType = this.type[0];
    this.InsuranceCol = [
      { field: "InsurancePaymentId", header: "ID" },
      { field: "PaymentDate", header: "Payment Date" },
      { field: "InsuranceProvider", header: "Insurance Provider" },
      { field: "CodeAndPayerId", header: "Provider Code/ PayerID" },
      { field: "PaymentMethod", header: "Method" },
      { field: "PaymentReference", header: "Reference" },
      { field: "PaymentAmount", header: "Payment Amount($)" },
      { field: "ChargeBackAmount", header: "Charge Back($)" },
      { field: "TotalAmountAppliedToCharges", header: "Amount Applied($)" },
      { field: "AmountAvailable", header: "Amount Available" },
      // { field: "reversed", header: "Reversed" },
    ];
    this.columns = [
      { field: "BillHeaderId", header: "Bill Id" },
      { field: "PatientName", header: "Patient Name" },
      { field: "BillDate", header: "Bill Date" },
      { field: "DateCreated", header: "Date of Service" },
      { field: "BillReferenceNumber", header: "Bill Reference" },
      { field: "PhysicianName", header: "Physician" },
      { field: "TotalCharges", header: "Total Charges($)" },
      { field: "PaymentDue", header: "Payment Due($)" },
      { field: "WriteOffAmount", header: "Write-Off($)" },
    ];
    this.ExpandTable = [
      { field: "BillTransactionId", header: "Item Id" },
      { field: "DateOfService", header: "Date of Service" },
      { field: "CptCode", header: "Procedure" },
      { field: "TotalCharges", header: "Total Charges($)" },
      { field: "PaymentDue", header: "Payment Due($)" },
      { field: "PatientBalance", header: "Patient Balance($)" },
      // { field: "WriteOffAmount", header: "Write-Off($)" },
    ];
    this.colmn = [
      { field: "Id", header: "ID" },
      { field: "PatientName", header: "Patient Name" },
      { field: "Reference", header: "Reference" },
      { field: "PaymentType", header: "Payment Type" },
      { field: "TransactionCode", header: "Transaction Code" },
      { field: "Amount", header: "Amount($)" },
      { field: "DateCreated", header: "Paymant Date" },
      { field: "Code", header: "Code" },
      { field: "Dos", header: "DOS" },
      { field: "Description", header: "Description" }
    ];
    this.paymentCol = [
      { field: "PatientPaymentId", header: "Id" },
      { field: "PaymentDate", header: "Payment Date" },
      { field: "Amount", header: "Amount($)" },
      { field: "PaidBy", header: "Paid By" },
      { field: "PaidTo", header: "Paid To" },
      { field: "Method", header: "Method" },
      { field: "Reference", header: "Reference" },
      { field: "PreviouslyApplied", header: "Previously Applied($)" },
      { field: "BalanceAvailable", header: "Credit Available($)" },
      { field: "PaymentType", header: "Type" }
    ];
    this.amountdata = [
      { field: "", header:"Id"},
      { field: "", header:"Transaction Code"},
      { field: "", header:"Date Created"},
      { field: "", header:"Payment Date"},
      { field: "", header:"Code"},
      { field: "", header:"DOS"},
      { field: "", header:"Description"},
      
    ]

    // this.selectedType = this.paymentCol[0];
  }

  getPatientDetails() {
    // $("#lgModal").modal('show');
    if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
      // $("#lgModal").modal('show');
      const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.openPopUp = true;
      modalRef.componentInstance.ComponentName = "Payments"
      modalRef.componentInstance.passpayment.subscribe((resp) => {
        this.patientdata = resp
        this.patientdata.DateCreated = new Date(this.patientdata.DateCreated);
        this.patientdata.DateLastUpdated = moment(new Date(this.patientdata.DateCreated)).format("mm/dd/yyyy");
        this.patientdata.DateOfBirth = new Date(this.patientdata.DateOfBirth);
        this.patientdata.FullName = this.patientdata.LastName + ", " + this.patientdata.FirstName
        this.getDatabasedonPatient();

      });

    }
    if ((JSON.parse(sessionStorage.getItem("PatientDetail")) != null)) {
      // this.getCheckBillarNote();

      this.patientdata = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.patientdata.DateCreated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateLastUpdated = moment(new Date(this.patientdata.DateCreated)).format("mm/dd/yyyy");
      this.patientdata.DateOfBirth = new Date(this.patientdata.DateOfBirth);
      this.patientdata.FullName = this.patientdata.LastName + ", " + this.patientdata.FirstName
      if(this.patientdata !== null){
      this.CheckBillarNote = false;
      }
      this.getDatabasedonPatient();
      this.getPatientInsuranceByPatiendId();
      this.getPatientAccountSummaryByPatientId();

    }
  }

  getbasicData() {
    let cat = {
      category: null
    };
    // let Insuranceproviders = this.PS.getCustomFormattedInjectionsbyPatientID(this.patientdata.PatientId);
    // let FC = this.paymentservice.getFinancilaCode(cat);
    let InsuranceProviders = this.insurancep.getInsuranceprovider()
    let CFIProvider = this.insurancep.getCFInsurance();
    let cfPhysicians = this.insurancep.getCFPhysician();
    forkJoin([InsuranceProviders, CFIProvider, cfPhysicians]).subscribe(resp => {
      this.insurance = resp[1],
        // this.selectedInsurance = this.insurance[0]
        this.CFPhysicians = resp[2]
    })
  }

  getDatabasedonPatient() {
    let payload = {
      patientId: this.patientdata.PatientId
    }
    let Insuranceproviders = this.PS.getCustomFormattedInjectionsbyPatientID(this.patientdata.PatientId);
    let Accsummary = this.wrs.getAccountSummary(payload);
    let accpayments = this.wrs.getPatientPayments(payload);
    forkJoin([Insuranceproviders, Accsummary, accpayments]).subscribe(elements => {
    })
  }
  openAllocateInsurance(event,rowData?) {
    // if (this.selectedInsurance === undefined || this.selectedMethod === undefined || this.PaymentAmt === undefined) {
    //   this.toastr.error("Please Select mandatory fields ")
    // }
    if(event ==="Patient Payment"){
      if (this.selectedRow === undefined) {
        this.toastr.error("Please Select a payment to allocate")
      }
      else{
        const modRef = this.modalService.open(AllocateInsuranceComponent, { size: 'lg', centered: true, windowClass: 'allocateModal' });
        modRef.componentInstance.patientInfo = this.patientdata;
        modRef.componentInstance.insuranceInfo = this.InsuranceList;
        modRef.componentInstance.insuranceProvider = this.selectedInsurance;
        modRef.componentInstance.patientPayment = event;
        modRef.componentInstance.patientRowData = rowData;
      }
    }
    else if(event === "insurancePayment"){
      if(this.selectedBulkInsurance === undefined){
        this.toastr.error('Select one row from Bulk Insurance')
      }
      else{
        const modRef = this.modalService.open(AllocateInsuranceComponent, { size: 'lg', centered: true, windowClass: 'allocateModal' });
        modRef.componentInstance.patientInfo = this.patientdata;
        modRef.componentInstance.insuranceInfo = this.InsuranceList;
        modRef.componentInstance.insuranceProvider = this.selectedInsurance;
        modRef.componentInstance.insurancePayment = event;
        modRef.componentInstance.insurancePaymentId = this.selectedBulkInsurance.InsurancePaymentId
      }
    }
    else if(event === 'insurancePayments'){
      if (this.selectedInsurance === undefined || this.selectedMethod === undefined || this.PaymentAmt === undefined) {
        this.toastr.error("Please Select mandatory fields ")
      }
      else{
        this.SaveInsurancePaymentsByParam(true);
          }
      }
      else if(event === 'insertPatientPayments'){
        if(this.PayAmount === undefined || this.DateOfPayment === undefined || this.selectedMethod === undefined){
          this.toastr.error("Please Select mandatory fields");
        }
        else{
          this.savePatientPayments(true)
        }
      }
  }
  findPatient(event) {
    this.patientdata = JSON.parse(sessionStorage.getItem("PatientDetail"));
    // if (this.patientdata) {
    //   let PDyy = this.patientdata.DateOfBirth.substr(0, 4);
    //   let PDdd = this.patientdata.DateOfBirth.substr(5, 2);
    //   let PDmm = this.patientdata.DateOfBirth.substr(8, 2);
    //   let PDfulldate = PDdd + "/" + PDmm + "/" + PDyy;
    //   this.patientdata.DateOfBirth = PDfulldate;
    // }
  }

  patientPaymentData() {
    this.paymentservice.getPatientPayment().subscribe(resp => {
      this.Paymentdata = resp;

      if (this.Paymentdata) {
        for (let i = 0; i < this.Paymentdata.length; i++) {
          let PayDyy = this.Paymentdata[i].PaymentDate.substr(0, 4);
          let PayDdd = this.Paymentdata[i].PaymentDate.substr(5, 2);
          let PayDmm = this.Paymentdata[i].PaymentDate.substr(8, 2);
          let PayDfullPaymentDate = PayDdd + "/" + PayDmm + "/" + PayDyy;
          this.Paymentdata[i].PaymentDate = PayDfullPaymentDate;
        }
      }
    });

  }
  InsurancePayments() {
    this.paymentservice.getInsurancePayment().subscribe(resp => {
      this.InsurancePayment = resp;
      if (this.InsurancePayment) {
        for (let i = 0; i < this.InsurancePayment.length; i++) {
          let Insyy = this.InsurancePayment[i].PaymentDate.substr(0, 4);
          let Insdd = this.InsurancePayment[i].PaymentDate.substr(5, 2);
          let Insmm = this.InsurancePayment[i].PaymentDate.substr(8, 2);
          let InsFullDate = Insdd + "/" + Insmm + "/" + Insyy;
          this.InsurancePayment[i].PaymentDate = InsFullDate;
        }
      }
    });
  }
  onInsurancechange(selectedInsurance) {
    this.selectedInsurance = selectedInsurance
    this.payerID = selectedInsurance.submitterInsuranceNumber
  }

  TotalAmtFun(PaymentAmt) {
    this.TotalAmt = this.ChargeBckAmt ? +this.PaymentAmt + +this.ChargeBckAmt : this.PaymentAmt
  }


  getPatientInsuranceByPatiendId() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
    }
    this.paymentservice.getCustomFormattedInsurance(param).subscribe((results: any) => {
      this.InsuranceList = results;
    })

  }

  getPatientAccountSummaryByPatientId() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
    }
    this.paymentservice.getPatientAccountSummary(param).subscribe((results: any) => {
      this.InsuranceDetails = results;
    })
  }

 

  SaveInsurancePaymentsByParam(value?) {
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let parameter = {
      InsurancePaymentId: 0,
      InsuranceProviderId: this.selectedInsurance.insuranceProviderId,
      PayerId: this.payerID,
      PaymentDate: this.paymentDate,
      PaymentMethod: this.selectedMethod.name,
      PaymentReference: this.refNumber,
      PaymentAmount: this.PaymentAmt,
      ChargeBackAmount: this.ChargeBckAmt,
      TotalAmountAppliedToCharges: this.TotalAmt,
      DateCreated: new Date(),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.UserId,
      FlagPendingAllocation: true,
      FlagPaymentReversed: false,
      ReversalReason: null,
      ReversalDate: null,
      InsuranceProviderCode: this.selectedInsurance.insuranceProviderCode,
    }
    this.paymentservice.SaveInsurancePayments(parameter).subscribe((results: any) => {
      this.SavedInsurance = results;
      if(value){
      const modRef = this.modalService.open(AllocateInsuranceComponent, { size: 'lg', centered: true, windowClass: 'allocateModal' });
      modRef.componentInstance.patientInfo = this.patientdata;
      modRef.componentInstance.insuranceInfo = this.InsuranceList;
      modRef.componentInstance.savedInsuranceData = [this.SavedInsurance];
      modRef.componentInstance.insuranceProvider = this.selectedInsurance;
      modRef.componentInstance.insurancePayment = "insurancePayment";
    }
      this.showSuccess("Insurance Saved Successfully");
    })

  }


  UpdateInsurancePaymentsByParam() {

    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {

      InsurancePaymentId: this.InsurancePaymentObj.InsurancePaymentId,
      InsuranceProviderId: this.selectedInsurance.insuranceProviderId,
      PayerId: this.payerID,
      PaymentDate: this.paymentDate,
      PaymentMethod: this.selectedMethod.name,
      PaymentReference: this.refNumber,
      PaymentAmount: this.PaymentAmt,
      ChargeBackAmount: this.ChargeBckAmt,
      TotalAmountAppliedToCharges: this.TotalAmt,
      DateCreated: this.InsurancePaymentObj.DateCreated,
      CreatedByUserId: this.InsurancePaymentObj.CreatedByUserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.UserId,
      FlagPendingAllocation: this.InsurancePaymentObj.FlagPaymentReversed,
      FlagPaymentReversed: this.InsurancePaymentObj.FlagPendingAllocation,
      ReversalReason: this.InsurancePaymentObj.ReversalReason,
      ReversalDate: this.InsurancePaymentObj.ReversalDate,
      InsuranceProviderCode: this.selectedInsurance.insuranceProviderCode,
    }

    this.paymentservice.UpdateInsurancePayments(param).subscribe((results: any) => {
      this.UpdatedInsuranceValue = results;
      this.showSuccess("Insurance Updated Successfully");
      this.getInsurancePaymentByIdandStatus();

    })
  }

  // deleteInsurancePaymentsById(data){
  //   let param = {
  //     InsurancePaymentId:data.InsurancePaymentId,
  //   }

  //   this.paymentservice.deleteInsurancePayments(param).subscribe((results: any) => {
  //     this.deletedInsurance = results;
  //   })
  // }

  getInsurancePaymentByIdandStatus() {
    
    let temp = [];
    if(this.selectedPayment !== undefined){
    temp.push(this.selectedPayment.insuranceProviderId);
    }
    let param = {
      insuranceProviderId: temp[0]?temp[0] : 0,
      status: this.selectedDetails.name,
    }
    this.paymentservice.getInsurancePaymentByInsuranceProviderIdandStatus(param).subscribe((results: any) => {
      this.BulkInsuranceList = results;
    })
  }

  getInsurancePayments(data) {
    let param = {
      insurancePaymentId: data.InsurancePaymentId
    }

    this.paymentservice.getInsurancePaymentsByProviderId(param).subscribe((results: any) => {
      this.InsurancePaymentObj = results;
    })
  }

  updateInsurance(params) {
    this.isenableUpdateButton = true;
    this.insurance.map((item) => {
      if (item.insuranceProviderId === params.InsuranceProviderId) {
        this.selectedInsurance = item;
      }
    })
    this.payerID = this.selectedInsurance.submitterInsuranceNumber;
    this.paymentDate = new Date(params.PaymentDate);
    this.selectedMethod = { name: params.PaymentMethod };
    this.refNumber = params.PaymentReference;
    this.PaymentAmt = params.PaymentAmount;
    this.ChargeBckAmt = params.ChargeBackAmount;
    this.TotalAmt = params.TotalAmountAppliedToCharges;

    this.getInsurancePayments(params);
  }

  UpdateInsurancePayment() {
    this.UpdateInsurancePaymentsByParam();
  }

  saveInsurance() 
  {
    if (this.selectedInsurance === undefined || this.selectedMethod === undefined || this.PaymentAmt === undefined ){
      this.toastr.error("Please Select mandatory fields")
    }
    else {
    this.SaveInsurancePaymentsByParam();
  }
}

  deleteInsurance(params, index) {
    const modRef = this.modalService.open(DeleteModalComponent, { windowClass: "delete-class" });
    modRef.componentInstance.insuranceData = params;
    modRef.componentInstance.openReversalModal = false;
    modRef.componentInstance.openDeleteModal = true;
    modRef.componentInstance.loadEvent.subscribe(
      (value) => {
        if (value) {
          // this.BulkInsuranceList.splice(index, 1)
          this.getInsurancePaymentByIdandStatus();
        }
      }
    )


  }

  getBulkInsurance() {
    this.getInsurancePaymentByIdandStatus();
  }


  //Patient payments api integration

  getPatientPaymentData() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientId: this.patientDetails.PatientId,
      FlageSendingAllocation: this.selectedPending.name == "Pending Allocation" ? true : false
    }
    this.paymentservice.getPatientPaymentCustomData(param).subscribe((results: any) => {
      this.patientPaymentTableData = results;
    })
  }

  handleChange(e) {
    this.tabindex = e.index;
    if(this.patientdata.FullName !== undefined){
    if (this.tabindex === 1) {
      this.getPatientPaymentData();
      this.getPatientGuarantorData();
      }
    }
    else{
      this.toastr.error("select any patient");
    }
    if (this.tabindex === 2) {
      this.getPatientCustomFormattedAdjWriteOffBills();
    }

  }
  onRowSelect(data,_index,expand) {
    if(expand){
      this.getPatientCustomFormattedAdjWriteOffBillsItems(data,_index);
    }
    this.expand = expand
  }

  postPayments(){
    let totalBillHeaderAmount : any = 0,billHeaderAmount : any =0,totalBillDetailAmount:any=0,billItemAmount:any =0,totalBillDetailAdjustmentAmount:any = 0,totalBillDetailWriteOffAmount:any=0,totalBillDetailAmountForAllBills:any=0;
    let billHeaderPaymentDueErrors : string = "",billtransactionPatientBalanceErrors:string="",billTransactionPaymentDueErrors:string="",billHeaderTransactionAdjustmentTotalError:string="",billHeaderTransactionWriteOffTotalError:string="",billTransactionTotalAmountError:string="",strValidationError:string ="";
    let isAdjustmentAmountEntered : boolean =false;
    let isWriteOffAmountEntered : boolean =false,hasTransactionCodeError:boolean = false;

    this.selectedList.forEach((bill) => {
      billHeaderAmount =  (bill.AmountToAdjustment == null?0:bill.AmountToAdjustment) + (bill.WriteOffAmount == null?0:bill.WriteOffAmount)
      if (billHeaderAmount > bill.PaymentDue){
        billHeaderPaymentDueErrors += bill.BillHeaderId.ToString() + ", ";
      }

      if (((bill.AmountToAdjustment == null ? 0 : bill.AmountToAdjustment)) > 0){
        isAdjustmentAmountEntered = true;
      }
      if (((bill.AmountToWriteOff == null ? 0 : bill.AmountToWriteOff)) > 0){
        isWriteOffAmountEntered = true;
      }
      totalBillDetailAmount = 0;
      bill.AdjWriteOfBillsItems.forEach((billItem) => {
        billItemAmount = ((billItem.AmountToAdjustment == null ? 0 : billItem.AmountToAdjustment) + (billItem.WriteOffAmount == null ? 0 : billItem.WriteOffAmount));
        if (billItemAmount > billItem.PatientBalance){
          billtransactionPatientBalanceErrors += billItem.BillTransactionId.ToString() + ", ";
        }
        if (billItemAmount > billItem.PaymentDue){
          billTransactionPaymentDueErrors += billItem.BillTransactionId.ToString() + ", ";
        }
        totalBillDetailAmount += billItemAmount;
        totalBillDetailAdjustmentAmount += (billItem.AmountToAdjustment == null ? 0: billItem.AmountToAdjustment );
        totalBillDetailWriteOffAmount += (billItem.WriteOffAmount == null ?0: billItem.WriteOffAmount);

      })
      if (billHeaderAmount > 0 && totalBillDetailAmount > 0) {
        if (bill.AmountToAdjustment && bill.AmountToAdjustment > 0) {
          if (totalBillDetailAdjustmentAmount != (bill.AmountToAdjustment == null ?0: bill.AmountToAdjustment )) {
            billHeaderTransactionAdjustmentTotalError += bill.BillHeaderId.ToString() + ", ";
          }
        }

        if (bill.AmountToWriteOff && bill.AmountToWriteOff > 0) {
          if (totalBillDetailWriteOffAmount != (bill.AmountToWriteOff == null ? 0:bill.AmountToWriteOff)) {
            billHeaderTransactionWriteOffTotalError += bill.BillHeaderId.ToString() + ", ";
          }
        }
      }
      else if (billHeaderAmount == 0 && totalBillDetailAmount > 0) {
        if (totalBillDetailAmount > bill.payment_due)
          billTransactionTotalAmountError += bill.bill_header_id.ToString() + ", ";
      }

      totalBillHeaderAmount += billHeaderAmount;
      totalBillDetailAmountForAllBills += totalBillDetailAmount;
    

    })
    if (isAdjustmentAmountEntered ){
      hasTransactionCodeError = true;
    }
    if (isWriteOffAmountEntered){
      hasTransactionCodeError = true;
    }
    if (billHeaderPaymentDueErrors.length == 0 && billTransactionPaymentDueErrors.length == 0 && billHeaderTransactionAdjustmentTotalError.length == 0 && billHeaderTransactionWriteOffTotalError.length == 0 && billTransactionTotalAmountError.length == 0 && !hasTransactionCodeError && billtransactionPatientBalanceErrors.length == 0)
    {
      if (totalBillHeaderAmount == 0 && totalBillDetailAmountForAllBills == 0)
      {
        this.toastr.error("Please enter adjustment/write-off amount for at least one bill or transaction.");
      }
      else
      {
        //BillingAdministration.lstCustomBills = new List<BillHeader>();
        // foreach (CustomFormattedAdjWriteOffBillEdit allBills in (IEnumerable<CustomFormattedAdjWriteOffBillEdit>)RadGvBills.ItemsSource)
        // {
        //     ObservableCollection<CustomFormattedAdjWriteOffBillItems> tempBillTrans = new ObservableCollection<CustomFormattedAdjWriteOffBillItems>(obsCollectionCustomFormattedAdjWriteOffBillItems.Where(x => x.bill_header_id == allBills.bill_header_id));
        //     foreach (CustomFormattedAdjWriteOffBillItems billItem in tempBillTrans)
        //         BillingAdministration.AddToBillTransactionList(billItem.bill_transaction_id, (billItem.amount_to_adjustment.HasValue ? billItem.amount_to_adjustment.Value : 0), (billItem.amount_to_write_off.HasValue ? billItem.amount_to_write_off.Value : 0));

        //     BillingAdministration.AddToBillHeaderList(allBills.super_bill_id, allBills.bill_header_id, allBills.patient_id, Convert.ToDecimal((allBills.amount_to_adjustment.HasValue ? allBills.amount_to_adjustment.Value : 0)), Convert.ToDecimal((allBills.amount_to_write_off.HasValue ? allBills.amount_to_write_off.Value : 0)), physicianId: allBills.rendering_physician_id);
        // }

        // SaveAdjustmentWriteOffAmounts();
    }
}
else
{
    if (billtransactionPatientBalanceErrors.length > 0)
    {
        strValidationError = "Cannot allocate payments.\r\n";
        strValidationError += "The write-off amount entered should not be greater than patient balance for the following\r\n";
        if (billtransactionPatientBalanceErrors.length > 0)
            strValidationError += "Bill Transaction(s): " + billtransactionPatientBalanceErrors.substr(0, billtransactionPatientBalanceErrors.length - 1) + "\r\n";
    }
    else if (billHeaderPaymentDueErrors.length > 0 || billTransactionPaymentDueErrors.length > 0)
    {
        strValidationError = "Cannot allocate payments.\r\n";
        strValidationError += "The write-off amount entered should not be greater than pending dues for the following\r\n";
        if (billHeaderPaymentDueErrors.length > 0)
            strValidationError += "Bill Header(s): " + billHeaderPaymentDueErrors.substr(0, billHeaderPaymentDueErrors.length - 1) + "\r\n";
        if (billTransactionPaymentDueErrors.length > 0)
            strValidationError += "Bill Transaction(s): " + billTransactionPaymentDueErrors.substring(0, billTransactionPaymentDueErrors.length - 1) + "\r\n";
    }
    else if (billHeaderTransactionAdjustmentTotalError.length > 0 || billHeaderTransactionWriteOffTotalError.length > 0 || billTransactionTotalAmountError.length > 0)
    {
        strValidationError = "Cannot allocate payments.\r\n";
        if (billHeaderTransactionAdjustmentTotalError.length > 0)
            strValidationError += "The adjustment amount entered in bill header is not equal to sum of adjustment amount entered in bill items for the following bill(s):\r\n" + billHeaderTransactionAdjustmentTotalError.substring(0, billHeaderTransactionAdjustmentTotalError.length - 1);
        else if (billHeaderTransactionWriteOffTotalError.length > 0)
            strValidationError += "The write-off amount entered in bill header is not equal to sum of write-off amount entered in bill items for the following bill(s):\r\n" + billHeaderTransactionWriteOffTotalError.substring(0, billHeaderTransactionWriteOffTotalError.length - 1);
        else if (billTransactionTotalAmountError.length > 0)
            strValidationError += "The amount pending in bill header is not equal to sum of amount entered in bill items for the following bill(s):\r\n" + billTransactionTotalAmountError.substring(0, billTransactionTotalAmountError.length - 1);
    }
    else if (hasTransactionCodeError)
    {
        strValidationError = "Please select Transaction Codes for the following: ";
        if (isAdjustmentAmountEntered )
            strValidationError += "Adjustment, ";
        if (isWriteOffAmountEntered )
            strValidationError += "Write-Off, ";

        if (strValidationError.length > 0)
            strValidationError = strValidationError.substring(0, strValidationError.length - 1);
    }
}

  }
  getTableData() {
    this.getPatientPaymentData();
  }

  getPhysicians() {
    this.paymentservice.getCustomFormattedPhysician().subscribe((results: any) => {
      this.PhysicianList = results;
      this.PhysicianList.forEach((item, index) => {
        item.FirstName = item.LastName + " " + item.FirstName
      })
      // this.FullName = this.PhysicianList.LastName + ", " + this.PhysicianList.FirstName;
    })
  }

  UpdatePatientPayment(params) {
    this.isenableUpdateButton = true;
    this.selectedType = { name: params.PaymentType };
    this.PayAmount = params.Amount;
    this.DateOfPayment = new Date(params.PaymentDate);
    this.selectedMethod = { name: params.Method };
    this.referenceNo = params.Reference;
    // this.selectedPhysician = params.PaidTo;
    this.PhysicianList.forEach((item, index) => {
      if (params.PaidTo === item.FirstName) {
        this.selectedPhysician = item;
      }
    })
    
    this.getPatientPaymentsById(params);
  }

  reShowButton(){
    this.isenableUpdateButton = false;
  }

  getPatientPaymentsById(data) {
    let param = {
      patientPaymentId: data.PatientPaymentId
    }
    this.paymentservice.getpatientPaymentsInPatientPayments(param).subscribe((results: any) => {
      this.patientPaymentIdData = results[0];
    })
  }

  enableGuarantor() {
    this.isDisableGuarantor = false;
  }
  disableGuarantor(){
    this.isDisableGuarantor = true;
  }

  getPatientGuarantorData() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientId: this.patientDetails.PatientId,
    }

    this.paymentservice.getPatientGuarantor(param).subscribe((results: any) => {
      this.guarantorData = results;
    })
  }

  savePatientPayments(save) {
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      PatientPaymentId: 0,
      PatientId: this.patientDetails.PatientId,
      PatientGuarantorId: this.selectedGuarantor ? this.selectedGuarantor.PatientGuarantorId : null,
      PaymentMethod: this.selectedMethod.name ? this.selectedMethod.name :null,
      PaymentReference: this.referenceNo ? this.referenceNo : null,
      Prepayment: false,
      PaymentAmount: this.PayAmount,
      PaymentDate: this.DateOfPayment ? this.DateOfPayment : null,
      ReceiptPrintedDate: null,
      PaymentEntrySessionId: null,
      TotalAmountAppliedToCharges: 0,
      FlagPendingAllocation: true,
      DateCreated: new Date(),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.UserId,
      PhysicianId: this.selectedPhysician ? this.selectedPhysician.PhysicianId : null,
      FlagPaymentReversed: null,
      ReversalReason: null,
      ReversalDate: null,
      FlagCoPay: false,
      FlagPatientCoInsurance: false,
      FlagDeductible: false,
      AppointmentId: null,
    }
    switch (this.selectedType.name) {
      case "Co-Pay":
        param.FlagCoPay = true
        param.FlagPatientCoInsurance = false
        param.FlagDeductible = false
        param.Prepayment = false
      case "Co-Insurance":
        param.FlagCoPay = false
        param.FlagPatientCoInsurance = true
        param.FlagDeductible = false
        param.Prepayment = false
      case "Deductible":
        param.FlagCoPay = false
        param.FlagPatientCoInsurance = false
        param.FlagDeductible = true
        param.Prepayment = false
      case "Prepayment":
        param.FlagCoPay = false
        param.FlagPatientCoInsurance = false
        param.FlagDeductible = false
        param.Prepayment = true
      case "Other/General":
        param.FlagCoPay = false
        param.FlagPatientCoInsurance = false
        param.FlagDeductible = false
        param.Prepayment = false
    }
    if (save === 'saveP') param.ReceiptPrintedDate = moment(new Date()).format('YYYY/MM/DD');
    this.paymentservice.SavePatientPayments(param).subscribe((results: any) => {
      this.savedPatientPayments = results;
      this.showSuccess("Patient Payment Saved Successfully");
      this. getPatientPaymentData();
      const modRef = this.modalService.open(AllocateInsuranceComponent, { size: 'lg', centered: true, windowClass: 'allocateModal' });
      modRef.componentInstance.patientInfo = this.patientdata;
      modRef.componentInstance.insuranceInfo = this.InsuranceList;
      modRef.componentInstance.insuranceProvider = this.selectedInsurance;
      modRef.componentInstance.patientNew = 'insertPatientPayments';
      modRef.componentInstance.paymentNewData = [this.savedPatientPayments];
      this.clearData();
    })
  }

  
   


  updatePatientPayment(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    let payload = {
      PatientPaymentId: this.patientPaymentIdData.PatientPaymentId,
      PatientId: this.patientPaymentIdData.PatientId,
      PatientGuarantorId: this.selectedGuarantor ? this.selectedGuarantor.PatientGuarantorId : null,
      PaymentMethod: this.selectedMethod.name,
      PaymentReference: this.referenceNo ? this.referenceNo : null,
      Prepayment: this.patientPaymentIdData.Prepayment,
      // PaymentAmount:JSON.stringify(this.PayAmount),
      PaymentAmount: this.PayAmount,
      // PaymentDate: this.DateOfPayment ? moment(this.DateOfPayment).format('DD/MM/YYYY') : '',
      PaymentDate: this.DateOfPayment ? moment(this.DateOfPayment).format('YYYY/MM/DD') : '',
      ReceiptPrintedDate: this.patientPaymentIdData.ReceiptPrintedDate,
      PaymentEntrySessionId: this.patientPaymentIdData.PaymentEntrySessionId,
      TotalAmountAppliedToCharges: this.patientPaymentIdData.TotalAmountAppliedToCharges,
      FlagPendingAllocation: this.patientPaymentIdData.FlagPendingAllocation,
      DateCreated: this.patientPaymentIdData.DateCreated ? moment(this.patientPaymentIdData.DateCreated).format('YYYY/MM/DD') : '',
      // DateCreated: this.patientPaymentIdData.DateCreated ? this.patientPaymentIdData.DateCreated : '',
      CreatedByUserId: this.patientPaymentIdData.CreatedByUserId,
      DateLastUpdated: moment(new Date()).format('YYYY/MM/DD'),
      // DateLastUpdated:new Date(),
      LastUpdatedByUserId: this.userDetails.UserId,
      PhysicianId: this.selectedPhysician ? this.selectedPhysician.PhysicianId : '',
      FlagPaymentReversed: this.patientPaymentIdData.FlagPaymentReversed,
      ReversalReason: this.patientPaymentIdData.ReversalReason,
      ReversalDate: this.patientPaymentIdData.ReversalDate,
      FlagCoPay: this.patientPaymentIdData.FlagCoPay,
      FlagPatientCoInsurance: this.patientPaymentIdData.FlagPatientCoInsurance,
      FlagDeductible: this.patientPaymentIdData.FlagDeductible,
      AppointmentId: this.patientPaymentIdData.AppointmentId,
    }
    this.paymentservice.updatePatientPaymentById(payload).subscribe((results: any) => {
      this.UpdatedPatientPayments = results;
      this.showSuccess("Patient Payments Updated Successfully");
      this. getPatientPaymentData();
      this.clearData();

    })
  }

  deletePatientPayments(params, index) {
    const modRef = this.modalService.open(DeleteModalComponent, { windowClass: "delete-class" });
    modRef.componentInstance.openReversalModal = false;
    modRef.componentInstance.openDeleteModal = true;
    modRef.componentInstance.paymentData = params;
    modRef.componentInstance.loadEvent.subscribe(
      (value) => {
        if (value) {
          // this.patientPaymentTableData.splice(index, 1)
          this.getPatientPaymentData();
          
        }
      })

  }


  // write - Offs API's Integration
  getPatientCustomFormattedAdjWriteOffBills() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientId: this.patientDetails.PatientId,
      outStandingDays: null,
    }
    this.paymentservice.GetPatientCustomFormattedAdjWrite(param).subscribe((results: any) => {
      this.AdjWriteOfBills = results;
      this.AdjWriteOfBills.forEach(element => {
        element.DateCreated = moment(element.DateCreated).format('DD/MM/YYYY')
        element.BillDate = moment(element.BillDate).format('DD/MM/YYYY')
        element.AdjWriteOfBillsItems = []
      });
    })
  }

  getPatientCustomFormattedAdjWriteOffBillsItems(values,_index) {
    let param = {
      billHeaderId: values.BillHeaderId,
    }
    this.paymentservice.GetPatientCustomFormattedAdjWriteItems(param).subscribe((results: any) => {
      this.AdjWriteOfBillsItems = results;
      this.AdjWriteOfBillsItems.forEach(element => {
        element.DateOfService = moment(element.DateOfService).format('DD/MM/YYYY')
      });
      this.AdjWriteOfBills[_index].AdjWriteOfBillsItems = this.AdjWriteOfBillsItems
    });

  }

  RetrieveBills(){
    this.getPatientCustomFormattedAdjWriteOffBills();
  }




  //reversals API's

  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.getPaymentTransactionCustomDataById(this.Index)
  }
  getPaymentTransactionCustomDataById(index?) {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId ? this.patientDetails.PatientId : null,
      dateFrom: this.dateFrom !== undefined ? moment(this.dateFrom).format('YYYY-MM-DD') : null,
      dateTo: this.dateUntil !== undefined ? moment(this.dateUntil).format('YYYY-MM-DD') : null,
      paymentType: this.selectedPayments.name ? this.selectedPayments.name : null,
      referenceNumber: this.RefNumber !== undefined ? this.RefNumber : ' ',
      offset: index ? index : 0,
      limit: 10,
    }
    this.paymentservice.GetPaymentTransactionCustomData(param).subscribe((results: any) => {
      this.PaymentTransData = results;
    })
  }
  getRequiredPatientAmountCustomData(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientId: this.patientDetails.PatientId ? this.patientDetails.PatientId : null,
      dateFrom: this.dateFrom !== undefined ? moment(this.dateFrom).format('YYYY-MM-DD') : null,
      dateTo: this.dateUntil !== undefined ? moment(this.dateUntil).format('YYYY-MM-DD') : null,
    }
    this.paymentservice.GetRequiredPatientAmountData(param).subscribe((results: any) => {
      this.PatientAmountData = results;
    })
  }
  writeOffChanges(rowData,event){
    if(event > rowData.PatientBalance){
      const modRef = this.modalService.open(DeleteModalComponent, { windowClass: "delete-class" });
      modRef.componentInstance.writeOff = true;
    }
  }
  Onreverse(data){
    var modal = this.modalService.open(DeleteModalComponent, {windowClass: 'reverse-Class'});
    modal.componentInstance.openReversalModal = true;
    modal.componentInstance.openDeleteModal = false;
    this.reversedAmount = data.Amount;
    modal.componentInstance.ReverseAmount = this.reversedAmount ;
    modal.componentInstance.changeReversalAmt = this.reversedAmount;
    modal.componentInstance.reversalId =  data.Id;
    modal.componentInstance.Selectedpayments = this.selectedPayments;
    modal.componentInstance.loadEvent.subscribe(
      (value) => {
        if (value) {
          this.getPaymentTransactionCustomDataById(this.Index);
        }
      }
    )
  
  }
  ngOnInit() {
    // this.patientPaymentData();
    // this.InsurancePayments();
    this.getbasicData();
    this.getPhysicians();
  }
  openBillerNote(type) {
    const modalRef = this.modalService.open(BillersNoteComponent);
    modalRef.componentInstance.name = "true";
    modalRef.componentInstance.openBillersModal = true;
    modalRef.componentInstance.patientData = this.patientDetails;
    if(type === 'Payment'){
      modalRef.componentInstance.paymentType = 'Payment'
    }
    if(type === 'Insurance Payments') {
      modalRef.componentInstance.paymentType = 'Insurance Payments'
    }
     else if(type === 'Patient Payments'){
      modalRef.componentInstance.paymentType = 'Patient Payments'
    }
    else if(type === 'Write-Offs'){
      modalRef.componentInstance.paymentType = 'Adjustment WriteOffs'
    }
    else{
      modalRef.componentInstance.paymentType = 'Reversals'
    }
  }
  clearData() {
    this.isenableUpdateButton = false;
    this.val1 = "";
    this.selectedInsurance = "";
    this.payerID = "";
    this.paymentDate = null;
    this.selectedMethod = { name: '' };
    this.refNumber = "";
    this.PaymentAmt = null;
    this.ChargeBckAmt = null,
    this.TotalAmt = "";
    this.dateFrom = "";
    this.dateUntil = "";
    this.RefNumber = "";
    this.selectedPayments = { name: '' };
    // this.checked = false;
    this.selectedType = {name: ''};
    this.val1 = "";
    this.selectedGuarantor = {PatientGuarantorName: ''};
    this.PayAmount = null;
    this.DateOfPayment = null;
    this.selectedPhysician = "";
    this.selectedMethod = { name: ''};
    this.referenceNo = "";
    this.selectedPayment = { name: ''};
    this.selectedDetails = { name: ''};



    // this.selectedPayment = {insuranceProviderName: ''};
  }
  SearchData() {
    if(!this.requiredPatientAmount){
    this.getPaymentTransactionCustomDataById(this.Index);
   this.hasRequiredPatientAmount = false;
    
  }
  else{
    this.getRequiredPatientAmountCustomData();
    this.hasRequiredPatientAmount = true;
  }
}
  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

}
