import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { PaymentsService } from '../../../../services/billing/payments.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationStore } from '../../../../authentication/authentication-store';
interface Type {
  name: string;
}
interface Code {
  name: string;
}
interface Adjustment {
name: string
}
interface Off {
  name: string;
}
@Component({
  selector: 'app-allocate-insurance',
  templateUrl: './allocate-insurance.component.html',
  styleUrls: ['./allocate-insurance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllocateInsuranceComponent implements OnInit {
@Input() patientInfo: any;
@Input() insuranceInfo: any;
@Input() savedInsuranceData: any;
@Input() insuranceProvider: any;
@Input() patientPayment;
@Input() patientRowData;
@Input() bulkInsurancePayment;
@Input() insurancePaymentId;
@Input() paymentNewData;
@Input() patientNew;
selectedType: Type;
code: Code[];
selectedCode: Code;
adjustment: Adjustment[];
selectedAdjustment: Adjustment;
writeoff: Off[];
selectedWrite: Off[];
patient: any[];
cols: any[];
PaymentsDetail: any[];
provider: any[];
ExpandTable: any[];
col: any;
  financialType: any;
  insuranceFinancialCode: any;
  adjustmentFinancialCode: any;
  writeoffinancialCode: any;
  paymentPendingData: any;
  patientDetails: any;
  BillsData: any;
  ExpandBillsData: any;
  patientPaymentTableData: any = [];
  flagSending: any;
  patientFinancialCode: any;
  selectedPatientPayment: any;
  customFormattedNonProcedure: any;
  constructor(
     private activeModal: NgbActiveModal,
    private paymentservice: PaymentsService,
    private toastr: ToastrService,
    public authStore: AuthenticationStore
    ) {
   
   
  }

  getFinancialTypes(){
    this.paymentservice.GetFinancialType().subscribe((results: any) => {
      this.financialType = results;
      console.log("financial type:",this.financialType)
    })
  }
getInsurancePaymentCustomData(){
  let payload = {
    insurancePaymentId: this.insurancePaymentId
  }
  this.paymentservice.getInsurancePaymentCustomData(payload).subscribe(res => {
    this.patientPaymentTableData = res;
  })
}
  getInsuranceFinancialCode(){
    let param = {
      category:"Insurance Payments"
    }
    this.paymentservice.getFinancialcode(param).subscribe((results: any) => {
    this.insuranceFinancialCode = results;
    console.log("insurance financial code:", this.insuranceFinancialCode)

    })
  }
 getPatientPaymentFinancialCode(){
  let param = {
    category:"Patient Payments"
  }
  this.paymentservice.getFinancialcode(param).subscribe((results: any) => {
  this.patientFinancialCode = results;
  console.log("Patient financial code:", this.patientFinancialCode)

  })
 }
  getAdjustmentFinancialCode(){
    let param = {
      category:"Adjustment"
    }
    this.paymentservice.getFinancialcode(param).subscribe((results: any) => {
    this.adjustmentFinancialCode = results;
    console.log("adjustment financial code:", this.adjustmentFinancialCode)

    })
  }

  getWriteOffFinancialCode(){
    let param = {
      category:"Write-off"
    }
    this.paymentservice.getFinancialcode(param).subscribe((results: any) => {
    this.writeoffinancialCode = results;
    console.log("write-off financial code:", this.writeoffinancialCode)

    })
  }
  getCustomFormattedNonProcedure(){
    let payload = {
      patientId : this.authStore.PatientDetail.PatientId
    }
    this.paymentservice.getCustomFormattedNonProcedureOfficeCharge(payload).subscribe(res => {
      console.log('non procedure',res);
      this.customFormattedNonProcedure = res;
    })
  }

  getCustomFormattedBills(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    if(this.patientPayment){
      let param = {
        patientId: this.patientDetails.PatientId,
        isInsurancePayment: true,
        paymentId:this.patientRowData.PatientPaymentId,
        billTransactionId:0,
      }
      this.paymentservice.getPatientCustomFormattedBills(param).subscribe((results : any) =>{
        this.BillsData = results;
        this.BillsData.map(element => {
          element.DateCreated = moment(element.DateCreated).format('DD-MM-YYYY');
        });
        console.log("display bills data:",this.BillsData )
      })
    }
    if(this.bulkInsurancePayment){
      let param = {
        patientId: this.patientDetails.PatientId,
        isInsurancePayment: true,
        paymentId:this.insurancePaymentId.InsurancePaymentId,
        billTransactionId:0,
      }
      this.paymentservice.getPatientCustomFormattedBills(param).subscribe((results : any) =>{
        this.BillsData = results;
        this.BillsData.map(element => {
          element.DateCreated = moment(element.DateCreated).format('DD-MM-YYYY');
        });
        console.log("display bills data:",this.BillsData )
      })
    }
    if(this.savedInsuranceData){
      console.log(this.savedInsuranceData)
      let param = {
        patientId: this.patientDetails.PatientId,
        isInsurancePayment: true,
        paymentId:this.savedInsuranceData.InsurancePaymentId,
        billTransactionId:0,
      }
      this.paymentservice.getPatientCustomFormattedBills(param).subscribe((results : any) =>{
        this.BillsData = results;
        this.BillsData.map(element => {
          element.DateCreated = moment(element.DateCreated).format('DD-MM-YYYY');
        });
        console.log("display bills data:",this.BillsData )
      })
    }
    if(this.paymentNewData){
      console.log(this.paymentNewData)
      let param = {
        patientId: this.patientDetails.PatientId,
        isInsurancePayment: true,
        paymentId:this.paymentNewData.PatientPaymentId,
        billTransactionId:0,
      }
      this.paymentservice.getPatientCustomFormattedBills(param).subscribe((results : any) =>{
        this.BillsData = results;
        this.BillsData.map(element => {
          element.DateCreated = moment(element.DateCreated).format('DD-MM-YYYY');
        });
        console.log("display bills data:",this.BillsData )
      })
    }
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
     this.paymentservice.getPatientCustomFormattedBillsItems(param).subscribe((results : any) => {
       this.ExpandBillsData = results;
       this.ExpandBillsData.map(item => {
         item.ServiceDate = moment(item.ServiceDate).format('DD-MM-YYYY')
       })
       console.log("table expand bill data:",this.ExpandBillsData)
     })
   }
  //  insertBillHeaders(){
  //    let payload ={

  //    }
  //    this.paymentservice.postBillHeaders(payload).subscribe(res => {
  //      console.log('res',res);
  //    })
  //  }
  //  insertBillTransactionList(){
  //    let payload ={
       
  //    }
  //    this.paymentservice.postBillTransactions(payload).subscribe(res => {
  //      console.log(res);
  //    })
  //  }
   onSave(){
     if(this.paymentNewData.PatientPaymentId === 0 && !this.savedInsuranceData){
      this.toastr.warning('Please Select Patient Payment.');
     }
     else if(this.savedInsuranceData.InsurancePaymentId === 0 && this.savedInsuranceData){
       this.toastr.warning('Please Select Insurance Payment');
     }
     else if(this.patientPaymentTableData.length ===0 && this.BillsData.length === 0){
      this.toastr.warning('No bills listed.')
     }
     else{
       {
         if(!this.savedInsuranceData){
          let totalBillDetailAmount = 0, billItemAmount = 0, totalBillDetailApplyAmount = 0, totalBillDetailAdjustmentAmount = 0, totalBillDetailWriteOffAmount = 0, totalBillDetailAmountForAllBills = 0;
          let strValidationError = '',billTransactionPaymentDueErrors = "",billHeaderTotalAmountError ="",validateCopay = " ", validateCoInsurance = " ",validateDeductible ="";
          let isAmountToApplyEntered = false,isAdjustmentAmountEntered = false,isWriteOffAmountEntered = false,hasTransactionCodeError = false,isAmountEnteredForBill = false;
          let copyBillsData  : any = [];
          copyBillsData = this.BillsData;
          let equalData : any = [];
          this.BillsData.forEach(item => {
            let isAmountEnteredForBill = false;
            let totalBillDetailAmount = 0;
            this.ExpandBillsData.forEach(ele => {
              if(ele.BillHeaderId === item.BillHeaderId){
                equalData.push(ele);
              }
            })
            this.ExpandBillsData.forEach(expand => {
              if((expand.CopayAmountRequired ? expand.CopayAmountRequired : 0) > 0 && (expand.CopayAmountRequired ? expand.CopayAmountRequired : 0) < ((expand.CopayAmountRequired ? expand.CopayAmountRequired : 0) + (expand.CopayAmountPaidToApply ? expand.CopayAmountPaidToApply : 0))){
                validateCopay = expand.BillTransactionId.toString();
              }
              if((expand.coinsuranceAmountRequired ? expand.coinsuranceAmountRequired : 0) > 0 && (expand.coinsuranceAmountRequired ? expand.coinsuranceAmountRequired : 0) < ((expand.coinsuranceAmountRequired ? expand.coinsuranceAmountRequired : 0) + (expand.CoInsuranceAmountPaidToApply ? expand.CoInsuranceAmountPaidToApply : 0))){
                validateCoInsurance = expand.BillTransactionId.toString();
              }
              if((expand.deductibleAmountRequired ? expand.deductibleAmountRequired : 0) > 0 && (expand.deductibleAmountRequired ? expand.deductibleAmountRequired : 0) < ((expand.DeductibleAmountPaid ? expand.DeductibleAmountPaid : 0) + (expand.DeductibleAmountPaidToApply ? expand.DeductibleAmountPaidToApply : 0))){
                validateDeductible = expand.BillTransactionId.toString();
              }
              billItemAmount = ((expand.CopayAmountPaidToApply === null ? 0 : expand.CopayAmountPaidToApply) + (expand.CoInsuranceAmountPaidToApply == null ? 0 : expand.CoInsuranceAmountPaidToApply) + (expand.DeductibleAmountPaidToApply == null ? 0 : expand.DeductibleAmountPaidToApply) + (expand.AmountToApply == null ? 0 : expand.AmountToApply) + (expand.AmountToAdjustment == null ? 0 : expand.AmountToAdjustment) + (expand.AmountToWriteOff == null ? 0: expand.AmountToWriteOff));
              if(billItemAmount > expand.PaymentDue){
                billTransactionPaymentDueErrors = expand.billTransactionId.toString();
              }
              totalBillDetailAmount = billItemAmount;
              totalBillDetailApplyAmount = expand.AmountToApply ? expand.AmountToApply : 0;
              totalBillDetailAdjustmentAmount = expand.AmountToAdjustment ? expand.AmountToAdjustment : 0;
              totalBillDetailWriteOffAmount = expand.AmountToWriteOff ? expand.AmountToWriteOff : 0;
              if((expand.AmountToApply == null ? 0 : expand.AmountToApply) > 0){
                isAmountToApplyEntered = isAmountEnteredForBill = true;
              }
              if((expand.AmountToAdjustment == null ? 0 : expand.AmountToAdjustment) > 0){
                isAdjustmentAmountEntered = true;
              }
              if((expand.AmountToWriteOff == null ? 0 : expand.AmountToWriteOff) > 0){
                isWriteOffAmountEntered = true;
              }
            })
            totalBillDetailAmountForAllBills = totalBillDetailAmount;
          })
          let totalDirectChargeApplyAmount = 0, directChargeAmount = 0, totalDirectChargeAmount = 0;
          let directChargePaymentDueErrors = '';
          this.customFormattedNonProcedure.forEach(item => {
            totalDirectChargeApplyAmount = item.amount_to_apply.HasValue ? item.amount_to_apply.Value : 0;
            directChargeAmount = ((item.amount_to_apply == null ? 0 : item.amount_to_apply) + (item.amount_to_adjustment == null ? 0 : item.amount_to_adjustment.Value) + (item.amount_to_write_off == null ? 0 : item.amount_to_write_off.Value));
            if (directChargeAmount > item.PaymentDue)
            {
              directChargePaymentDueErrors = item.id.ToString() + ", ";
            } 
        if (((item.amount_to_apply == null ? 0 : item.amount_to_apply)) > 0){
            isAmountToApplyEntered = true;
        }
        if (((item.amount_to_adjustment == null ? 0 : item.amount_to_adjustment)) > 0)
        { 
        isAdjustmentAmountEntered = true;
        }
        if (((item.amount_to_write_off == null ? 0 : item.amount_to_write_off)) > 0)
                 {
                    isWriteOffAmountEntered = true;
                  }
                  totalDirectChargeAmount = directChargeAmount;
                })
        // if ((totalBillDetailApplyAmount + totalDirectChargeApplyAmount) > creditAmount)
        // {
        //    billHeaderTotalAmountError = "Entered amount to apply should be less than or equal to payment credit amount.";
        // } 
        //                     if (isAmountToApplyEntered && this.DdlPatTransactionCode.SelectedIndex == -1)
        //                     {
        //                         hasTransactionCodeError = true;
        //                     }   
        //                     if (isAdjustmentAmountEntered && this.DdlAdjustmentTransactionCode.SelectedIndex == -1)
        //                     {
        //                         hasTransactionCodeError = true;
        //                     }
        //                     if (isWriteOffAmountEntered && this.DdlWriteOffTransactionCode.SelectedIndex == -1)
        //                     {
        //                         hasTransactionCodeError = true;
        //                     }
        if (billTransactionPaymentDueErrors.trim().length == 0 && billHeaderTotalAmountError.trim().length == 0 && !hasTransactionCodeError && directChargePaymentDueErrors.trim().length == 0 && validateCopay.trim().length == 0 && validateCoInsurance.trim().length == 0 && validateDeductible.trim().length == 0)
        {
            if (totalBillDetailAmountForAllBills == 0 && (this.BillsData.length > 0 ? (totalDirectChargeAmount == 0) : true))
            {
                this.toastr.warning("Please enter amount to apply for at least one bill or transaction.");
                // EnableSaveCancelButtons();
            }
            else{
              let lstCustomBills: any = {};
              this.BillsData.forEach(bill => {
                let copayPaid = bill.CopayAmountPaid;
                let coInsPaid = bill.CoInsurancePatientAmountPaid ? bill.CoInsurancePatientAmountPaid : 0;
                let deductiblePaid = bill.DeductibleAmountPaid ? bill.DeductibleAmountPaid : 0;
                let copayPaidBalance = copayPaid, coInsPaidBalance = coInsPaid, deductiblePaidBalance = deductiblePaid;
                this.ExpandBillsData.forEach(expand => {
                  if(expand.BillHeaderId === bill.BillHeaderId){
                    lstCustomBills = bill;
                  }
                  // BillingAdministration.AddToBillTransactionList(expand.BillTransactionId, (expand.AmountToApply ? expand.AmountToApply : 0), (expand.AmountToAdjustment ? expand.AmountToAdjustment : 0), (expand.AmountToWriteOff ? expand.AmountToWriteOff : 0), bill.IsAssociatedAsPrimaryInsurance, bill.IsAssociatedAsSecondaryInsurance, bill.IsAssociatedAsTertiaryInsurance, (expand.ChargesAllowed ? expand.ChargesAllowed : 0), (expand.CopayAmountRequired ? expand.CopayAmountRequired : 0), (expand.coinsuranceAmountRequired ? expand.coinsuranceAmountRequired : 0), (expand.deductibleAmountRequired ? expand.deductibleAmountRequired : 0), (expand.CopayAmountPaidToApply ? expand.CopayAmountPaidToApply : 0), (expand.CoInsuranceAmountPaidToApply ? expand.CoInsuranceAmountPaidToApply : 0), (expand.DeductibleAmountPaidToApply ? expand.DeductibleAmountPaidToApply : 0), expand.RebillToAmountToApplyComments, expand.RebillToAdjustmentComments, expand.RebillToWriteoffComments, expand.RebillToValue, expand.InsuranceBalanceOTF);

                })
                // BillingAdministration.AddToBillHeaderList(bill.super_bill_id, bill.bill_header_id, bill.patient_id, (this.savedInsuranceData ? this.savedInsuranceData.InsurancePaymentId : this.patientRowData.PatientPaymentId), Convert.ToDecimal(bill.amount_to_apply), Convert.ToDecimal((bill.amount_to_adjustment.HasValue ? bill.amount_to_adjustment.Value : 0)), Convert.ToDecimal((bill.amount_to_write_off.HasValue ? bill.amount_to_write_off.Value : 0)), bill.isAssociatedAsPrimaryInsurance, bill.isAssociatedAsSecondaryInsurance, bill.isAssociatedAsTertiaryInsurance, null, null, null, physicianId: bill.rendering_physician_id);
              })
              let lstCustomDirectChargeBills: any = {};


              this.customFormattedNonProcedure.forEach(nonProcedure => {
                // BillingAdministration.AddToBillHeaderList(nonProcedure.PatientId, nonProcedure.Id, Convert.ToDecimal(nonProcedure.amount_to_apply), Convert.ToDecimal((nonProcedure.amount_to_adjustment.HasValue ? nonProcedure.amount_to_adjustment.Value : 0)), Convert.ToDecimal((nonProcedure.amount_to_write_off.HasValue ? nonProcedure.amount_to_write_off.Value : 0)), patientPaymentId);
              })

              if(lstCustomDirectChargeBills.length === 0){

              }
              else{
                if(lstCustomBills.length === 0){

                }
                else{

                }
              }
            }
          }
              else{
                if (validateCopay.trim().length > 0 || validateCoInsurance.trim().length > 0 || validateDeductible.trim().length > 0)
                {
                    strValidationError = "Cannot allocate payments.\r\n";
                    strValidationError += "The amount entered in co-pay and/or co-insurance and/or deductible should not be greater than required amount for the following bill transaction(s)\r\n";
                    // if (validateCopay.trim().length > 0)
                    // {
                    //     strValidationError += "Co-Pay: " + validateCopay.trim().Substring(0, validateCopay.trim().length - 1) + "\r\n";
                    // }
                    // if (validateCoInsurance.trim().length > 0)
                    // {
                    //     strValidationError += "Co-Insurance: " + validateCoInsurance.trim().Substring(0, validateCoInsurance.trim().length - 1) + "\r\n";
                    // }
                    // if (validateDeductible.trim().length > 0)
                    // { 
                    //   strValidationError += "Deductible: " + validateDeductible.trim().Substring(0, validateDeductible.trim().length - 1) + "\r\n";
                    // }
                }
                else if (billTransactionPaymentDueErrors.trim().length > 0)
                {
                    strValidationError = "Cannot allocate payments.\r\n";
                    strValidationError += "The amount to apply entered should not be greater than pending dues for the following\r\n";
                    if (billTransactionPaymentDueErrors.trim().length > 0){
                        // strValidationError += "Bill Transaction(s): " + billTransactionPaymentDueErrors.trim().Substring(0, billTransactionPaymentDueErrors.Trim().Length - 1) + "\r\n";
                    }
                }

              }
        }
       }
     }
   }
  //  getPatientPaymentData() {
  //   this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
  //      let param = {
  //     patientId: this.patientDetails.PatientId,
  //     FlageSendingAllocation: true
  //   }
  //   this.paymentservice.getPatientPaymentCustomData(param).subscribe((results: any) => {
  //     this.patientPaymentTableData = results;
      // this.patientPaymentTableData.forEach(item => {
        // if(this.patientRowData.PatientPaymentId === item.PatientPaymentId){
        //   item
        // }

      // })
  //     console.log('patient payment',this.patientPaymentTableData)
  //   })
  // }
  

  ngOnInit() {
    this.cols = [
      {field: 'payment_date', header: 'Payment Date'},
      {field: 'amount', header: 'Amount$'},
      {field: 'paid_by', header: 'Paid By'},
      {field: 'method', header: 'Method'},
      {field: 'reference', header: 'Reference'},
      {field: 'payment_type', header: 'Payment Type'},
      {field: 'previously_apply', header: 'Previously Applied($)'},
      {field: 'credit_available', header: 'Credit Available($)'}
    ];

    this.PaymentsDetail = [
      {field: 'payment_date', header: 'Bill Id'},
      {field: 'amount', header: 'Date'},
      {field: 'paid_by', header: 'Non Procedure Office Charge'},
      { field:'Total', header:'Total Charges'},
      {field: 'method', header: 'Payments Due'},
      {field: 'reference', header: 'Amount To Apply'},
      {field: 'reference', header: 'Write-Off'},

    ];
    // this.patient = [
    //   {payment_date: '01/01/19', amount: '300', paid_by: 'Cigna', method: 'Cash', reference: '', payment_type: '', previously_apply: '', credit_available: '$300.00'}
    // ];
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
      {field: 'ServiceDate', header: 'Service Date'},
      {field: 'CptCode', header: 'CPT'},
      {field: 'InsuranceBalance', header: 'Charge'},
      {field: 'CopayAmountRequired', header: 'Co-Pay Due'},
      {field: 'coinsuranceAmountRequired', header: 'Co-Ins Due'},
      {field: 'deductibleAmountRequired', header: 'Deduct Due'},
      {field: 'CopayAmountPaid,CoinsuranceAmountPaid,DeductibleAmountPaid', header: 'Paid:Co-Pay Co-Ins Deduc'},
      {field: 'ChargesAllowed', header: 'Allow'},
      {field: 'AmountToApply', header: 'Apply'},
      {field: 'AmountToAdjustment', header: 'Adjst'},
      {field: 'AmountToWriteOff', header: 'W/O'},
      {field: 'InsuranceBalance', header: 'Ins. Bal'},
      {field: 'PatientBalance', header: 'Pat.Bal'},
      {field: 'RebillToValue', header: 'Rebill To'},
      {field: 'PaymentMade', header: 'Tot. Pat. Payments'},
      {field: 'CopayAmountRequired,coinsuranceAmountRequired,deductibleAmountRequired', header: 'Due:Co-Pay Co-Ins Deduc'},
      {field: 'Modifiers', header: 'M1-M4'},
      {field: 'PlaceOfServiceCode', header: 'POS'},
      {field: 'Units', header: 'Units'},
      {field: 'BillTransactionId', header: 'Id'},
    ]
console.log("saved insurance data:",this.patientRowData);
console.log("insurance provider:",this.insuranceProvider);
  if(this.patientPayment){
    this.patientPaymentTableData.push(this.patientRowData)
  }
  if(this.bulkInsurancePayment){
    this.getInsurancePaymentCustomData()
  }
  if(this.savedInsuranceData){
    let data :any = {};
    this.savedInsuranceData.map(item => 
      {
        data.PaymentDate = item.PaymentDate
        data.Amount = item.PaymentAmount;
        data.PaidBy = this.insuranceProvider.insuranceProviderName;
        data.Method = item.PaymentMethod;
        data.Reference = item.PaymentReference;
        data.BalanceAvailable =item.TotalAmountAppliedToCharges
      })
      this.patientPaymentTableData.push(data);
      console.log(this.patientPaymentTableData)
  }
  if(this.paymentNewData){
    let patientData :any = {};
    this.paymentNewData.map(item => {
      patientData.PaymentDate = item.PaymentDate
      patientData.Amount = item.PaymentAmount
      patientData.PaidBy = this.patientInfo.FullName
      patientData.Method = item.PaymentMethod
      patientData.Reference = item.PaymentReference
      patientData.BalanceAvailable = item.PaymentAmount
    })
    console.log('jkloop',patientData)
    this.patientPaymentTableData.push(patientData)
  }
   this.getFinancialTypes();
   this.getInsuranceFinancialCode();
   this.getAdjustmentFinancialCode();
   this.getWriteOffFinancialCode();
   this.getPatientPaymentFinancialCode();
   this.getCustomFormattedBills();
   this.getCustomFormattedNonProcedure();
  }
}
