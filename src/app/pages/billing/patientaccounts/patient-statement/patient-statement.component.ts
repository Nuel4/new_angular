import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { AuthenticationService } from './../../../../authentication/authentication.service';
import { PatientAccountsService } from './../../../../services/billing/patient-accounts.service';
import { PatientstatementModalComponent } from './patientstatement-modal/patientstatement-modal.component';
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { InsuranceProviderService } from "../../../../services/billing/insuranceprovider.service";
import { PhysicianService } from "../../../../services/practice/physician.service";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import { BillersNoteComponent } from '../../../../theme/components/applications/waitingroom/billers-note/billers-note.component';
interface Artypes {
  name: string;
}

interface Insurances {
  name: string;
}
interface Bills {
  name: string;
}
interface Days {
  name: string;
}
@Component({
  selector: "app-patient-statement",
  templateUrl: "./patient-statement.component.html",
  styleUrls: ["./patient-statement.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PatientStatementComponent implements OnInit {
  Unapplied;
  days: any;
  cols: any[];
  Patient: any[];
  accounts: any[];
  Bill: Bills[];
  selectedBills: Bills;
  ARTypes: Artypes[];
  selectedARTypes: any = [];
  Insurance: Insurances[];
  selectedInsurance: Insurances;
  Physicians: any;
  selectedPhysicians: any = [];
  private InsuranceProvider: any[];
  private PhysicianService: any[];
  selectedInsuranceProvider: any = [];
  patientBalanceDue: boolean = true;
  insuranceBalanceDue: boolean = false;
  excludePatient: boolean = false;
  billCreatedDate: any;
  billEndedDate: any;
  serviceStartDate;
  serviceEndDate: any;
  selectedrows: any = [];
  patientSummaryDetails: any = [];
  FlagAccountInCollections: boolean=false;
  FlagAccountInSuspense: boolean=false;
  patientDetail: any = [];
  customFormattedInsurance: any = [];
  patientPaymentDetails: any = [];
  unappliedPaymentAmounts: any;
  LblUnappldPatPaymnts: any = {};
  LblTotCharges: any = {};
  LblPatPaymnts: any = {};
  LblInsPaymnts: any = {};
  LblTotalAdj: any = {};
  LblTotalWO: any = {};
  LblPatBalanceDue: any = {};
  LblInsBalanceDue: any = {};
  TotalCharges: any;
  TotalPatientPayments: any;
  TotalInsurancePayments: any;
  TotalAdjustments: any;
  TotalWriteOffAmount: any;
  PatientBalanceDue: any;
  InsuranceBalanceDue: any;
  LastServiceDate: any;
  DatePutInAging: number;
  LastStatementDate: any;
  _0To30daysPatientBalance: any;
  _31To60daysInsuranceBalance: any;
  _31To60daysPatientBalance: any;
  _61To90daysPatientBalance: any;
  _91To120daysInsuranceBalance: any;
  _91To120daysPatientBalance: any;
  _150PlusDaysPatientBalance: any;
  _0To30daysInsuranceBalance: any;
  _61To90daysInsuranceBalance: any;
  _121To150daysInsuranceBalance: any;
  _150PlusDaysInsuranceBalance: any;
  isCollection: boolean = false;
  isSuspense:boolean = false;
  patientAccDetails: any = [];
  constructor(
    private insProvider: InsuranceProviderService,
    private physicianSer: PhysicianService,
    private modalService: NgbModal,
    private PatientAccService: PatientAccountsService,
    private modal: NgbActiveModal,
    private toaster: ToastrService,
    private authstore: AuthenticationStore
  ) {
    this.cols=[
      {field:'days',header: 'Days  0-to-30'},
      {field:'one', header: '31-to-60'},
      {field:'two',header:'61-to-90'},
      {field:'three',header:'91-to-120'},
      {field:'four',header:'121-to-150'},
      {field:'five',header:'150+'}
    ]
    this.accounts = [
      {field: 'PatientName', header: 'Patient Name'},
      {field: 'UniqueNumber', header: 'Uniq Number'},
      {field: 'TotCharges', header: 'Tot.Charges'},
      {field: 'TotPatPayment', header: 'Total.pat payment'},
      {field: 'TotInsPayment', header:'Total.Ins Payment'},
      {field: 'TotAdjustments', header:'Total.adj'},
      {field: 'PatientBalanceDue', header:'Pat.Bal($)'},
      {field: 'InsuranceBalanceDue', header:'Ins.Bal($)'},
      {field: 'AccBalance', header: 'Acc.Bal($)'},
   ]
  //  this.balance = [{days:'_0To30daysPatientBalance',one: '_31To60daysPatientBalance',two:'_61To90daysPatientBalance',three:'_91To120daysPatientBalance',four:'_150PlusDaysPatientBalance',five:''}]
   this.Patient = [ 
     {name: 'Kaheem',uniq: '',charge:'200$',patient:'',Insurance:'Primary',adj:'',pat:'',ins:'',acc:''}
   ]
    this.Bill = [
      { name: "All" },
      { name: "Approved" },
      { name: "Archived" },
      { name: "Pending" },
      { name: "Submitted" },
      { name: "Cancelled"},
      { name: "Bill Error"},
      {name: "Rejected"},
      {name: "Resubmitted"},
      {name: "No Dues"},
      {name: "Collections"},
      {name: "Closed"},
      {name: "Correction In-Progress"}
    ];
    
  }
  ngOnInit() {
    this.getInsurancePro();
    this.getPhysician();
    this.getInsuranceCategory();
  }
  ngOnChanges(){
    // this.getPatients();

  }
  getInsurancePro() {
    this.insProvider.getInsuranceProviders().subscribe(resp => {
      resp.forEach(element => {
        element.insuranceprovider = element.InsuranceProviderName + ' ' + '('+ element.InsuranceProviderCode + ')';
      });
      this.insProvider = resp;
      console.log("Insurance Provider Details");
      console.log(this.insProvider);
    });
  }
  getPhysician() {
    this.physicianSer.getPhysicianWithMinimumDetails().subscribe(res => {
      console.log(res);
      res.forEach(element => {
        element.name = element.lastname + ', ' + element.firstname;            
      });
      this.Physicians = res;
      console.log(this.Physicians);
    });
  }
  getInsuranceCategory(){
    this.insProvider.getInsuranceCategories().subscribe(res =>{
      console.log(res);
      this.ARTypes = res;
      console.log("Insurance Category");
      console.log(this.ARTypes);
    })
  }
  getArTypes(){
    const modRef = this.modalService.open(PatientstatementModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.artypes = true;
    modRef.componentInstance.InsuranceCategoryNameList = this.ARTypes;
    modRef.componentInstance.InsuranceProvider = this.insProvider;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.selectedARTypes = value
        console.log(this.selectedARTypes)
      }
    })
  }
  getInsuranceProvider(){
    const modRef = this.modalService.open(PatientstatementModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.insuraceProviderList = true;
    modRef.componentInstance.InsuranceProvider = this.insProvider;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.selectedInsuranceProvider = value
        console.log(this.selectedInsuranceProvider)
      }
    })
  }
  selectPhysicians(){
    const modRef = this.modalService.open(PatientstatementModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.physician = true;
    modRef.componentInstance.physicianList = this.Physicians;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.selectedPhysicians = value
        console.log(this.selectedPhysicians)
      }
    })
  }
  getPatientStatements(){
    let insuranceProvider:any = [];
    this.selectedInsuranceProvider.forEach(item => {
      insuranceProvider.push(item.InsuranceProviderId)
      console.log("selectedInsuranceProvider", item)
    })
    let physicianIds:any = [];
    this.selectedPhysicians.forEach(item => {
      console.log("selectedInsuranceProvider", item)
      physicianIds.push(item.physicianid)
    })
    let insuCategoryIds:any = [];
    this.selectedARTypes.forEach(element => {
      console.log("selectedInsuranceProvider", element)
      insuCategoryIds.push(element.InsuranceCategoryId)
    });
    console.log("111111", insuranceProvider, physicianIds, insuCategoryIds)
    let payload = {
      isInsBalance:this.insuranceBalanceDue,
      isPatBalance: this.patientBalanceDue,
      isCollection:this.isCollection,
      isSuspense: this.isSuspense,
      billStartDate:moment(this.billCreatedDate?this.billCreatedDate:new Date).format('YYYY-MM-DD'),
      billEndDate:moment(this.billEndedDate?this.billEndedDate: new Date).format('YYYY-MM-DD'),
      serviceStartDate:moment(this.serviceStartDate?this.serviceStartDate: new Date).format('YYYY-MM-DD'),
      serviceEndDate:moment(this.serviceEndDate?this.serviceEndDate: new Date).format('YYYY-MM-DD'),
      status:this.selectedBills?this.selectedBills.name:null,
      insuranceIDs:insuranceProvider.length > 0 ? insuranceProvider : [],
      arTypeCategoryIds:insuCategoryIds?insuCategoryIds:[],
      physicainIds:physicianIds?physicianIds:[],
      patStatementDate:moment(this.days?moment(new Date).subtract(this.days,'d'):new Date ).format('YYYY-MM-DD')
      // patStatementDate:this.days?moment(new Date).subtract(this.days,'d'):null
    }
    console.log(this.selectedBills,payload)
    this.PatientAccService.getPatientStatements(payload).subscribe(res => {
      console.log(res);
      this.patientAccDetails = res;
    })
  }
  getPatients(PatientId){
    console.log(PatientId)
    this.PatientAccService.getPatients(PatientId).subscribe(res => {
      console.log('Patient Detail',res);
      this.patientDetail = res
    })
  }
  getCustomFromattedInsurance(){
    let payload = {
      patientID: this.authstore.patientAccount.PatientId
    }
    this.PatientAccService.getCustomFormattedPatientInsurance(payload).subscribe(res => {
      console.log('Custom Formatted Insurance',res);
      this.customFormattedInsurance = res;
    })
  }
  getPatientAccountSummary(rowdata){
    console.log(rowdata)
    let payload = {
      patientId: rowdata.PatientId
    }
    this.PatientAccService.getPatientAccountSummary(payload).subscribe(res => {
      console.log(res)
      this.patientSummaryDetails = res[0]
      res.forEach(item => {
        if(item.PatientId == rowdata.PatientId){
          console.log("bnnmm",item.PatientId == rowdata.PatientId)
          this.FlagAccountInCollections = item.FlagAccountInCollections;
          this.FlagAccountInSuspense =item.FlagAccountInSuspense;
          if(item !== null){
            if(item.TotalCharges !== null){
              this.TotalCharges = Math.round(item.TotalCharges)
            }
            if(item.TotalPatientPayments !== null)
            this.TotalPatientPayments = Math.round(item.TotalPatientPayments)
          }
          if(item.TotalInsurancePayments !== null){
            this.TotalInsurancePayments = Math.round(item.TotalInsurancePayments)
          }
          if(item.TotalAdjustments !== null){
            this.TotalAdjustments = Math.round(item.TotalAdjustments)
          }
          if(item.TotalWriteOffAmount !== null){
            this.TotalWriteOffAmount = Math.round(item.TotalWriteOffAmount)
          }
          if(item.PatientBalanceDue !== null){
            this.PatientBalanceDue = Math.round(item.PatientBalanceDue)
          }
          if(item.InsuranceBalanceDue !== null){
            this.InsuranceBalanceDue = Math.round(item.InsuranceBalanceDue)
          }
          if(item.LastServiceDate !== null){
            this.LastServiceDate = moment(item.LastServiceDate).format("DD-MM-YYYY")
          }
          if(item.DatePutInAging !== null){
            this.DatePutInAging = item.DatePutInAging
          }
          if(item.LastStatementDate !== null){
            this.LastStatementDate = moment(item.LastStatementDate).format("DD-MM-YYYY")
          }
          if(item.FlagAccountInCollections !== null){
            this.FlagAccountInCollections = item.FlagAccountInCollections
          } 
          if(item.FlagAccountInSuspense !== null){
            this.FlagAccountInSuspense = item.FlagAccountInSuspense
          } 
          if(item._0To30daysPatientBalance !== null){
            this._0To30daysPatientBalance = Math.round(item._0To30daysPatientBalance)
          } 
         if(item._31To60daysPatientBalance !== null){
           this._31To60daysPatientBalance = Math.round(item._31To60daysPatientBalance)
          } 
          if(item._61To90daysPatientBalance !== null){
            this._61To90daysPatientBalance = Math.round(item._61To90daysPatientBalance)
          } 
          if(item._91To120daysPatientBalance !== null){
            this._91To120daysPatientBalance = Math.round(item._91To120daysPatientBalance)
          }
          if(item._150PlusDaysPatientBalance !== null){
            this._150PlusDaysPatientBalance = Math.round(item._150PlusDaysPatientBalance)
            console.log('ghjk',this._150PlusDaysPatientBalance)
          }
          if(item._0To30daysInsuranceBalance !== null){
            this._0To30daysInsuranceBalance = Math.round(item._0To30daysInsuranceBalance)
          }
          if(item._31To60daysInsuranceBalance !== null){
            this._31To60daysInsuranceBalance = Math.round(item._31To60daysInsuranceBalance)
          }
          if(item._61To90daysInsuranceBalance !== null){
            this._61To90daysInsuranceBalance = Math.round(item._61To90daysInsuranceBalance)
          } 
          if(item._91To120daysInsuranceBalance !== null){
            this._91To120daysInsuranceBalance = Math.round(item._91To120daysInsuranceBalance)
          }
          if(item._121To150daysInsuranceBalance !== null){
            this._121To150daysInsuranceBalance = Math.round(item._121To150daysInsuranceBalance)
          }
          if(item._150PlusDaysInsuranceBalance !== null){
            this._150PlusDaysInsuranceBalance = Math.round(item._150PlusDaysInsuranceBalance)
          }
        }
      })
      console.log("patient", this.patientSummaryDetails)
      
     
      this.getPatients(rowdata.PatientId);
    })
    // this.getPatients()
    console.log(rowdata)
    
    this.getCustomFromattedInsurance();
    this.getPatientPayment()
  }
  getPatientPayment() {
    let payload = {
      patientId: this.authstore.patientAccount.PatientId,
    }
    this.PatientAccService.getPatientPayment(payload).subscribe(res => {
      console.log('Patient Account', res);
      this.patientPaymentDetails = res;
      this.patientPaymentDetails.forEach(item => {
        if(item.PaymentAmount !== null && item.TotalAmountAppliedToCharges !== null){
          this.unappliedPaymentAmounts = item.PaymentAmount - item.TotalAmountAppliedToCharges
        }
      })
      this.Unapplied = this.unappliedPaymentAmounts
    })
  }
  printStatement(){
    const modRef = this.modalService.open(PatientstatementModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.printStatement = true;
  }
  openBillersNote(type){
    const modRef = this.modalService.open(BillersNoteComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.openBillersModal = true;
    modRef.componentInstance.patientData = this.authstore.PatientDetail;
    console.log("patient details:",this.authstore.PatientDetail);
    if(type === 'Payment') {
      modRef.componentInstance.paymentType = 'Payment'
    }
  }
}
