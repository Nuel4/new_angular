import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { NgbDateStruct, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { InsuranceProviderService } from '../../../services/billing/insuranceprovider.service';
import { PhysicianService } from '../../../services/practice/physician.service';
import { SuperBillService } from '../../../services/billing/superbill.service';
import { AuthenticationStore } from '../../../authentication';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TableModule } from 'primeng/table';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule, } from '@angular/forms';
//Broadcaster
import { ToastrService } from 'ngx-toastr';
import { Broadcaster } from '../../../broadcast/broadcaster';
import { Services } from '../../services/services'
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component';
import { BillHeadersModel } from '../../../model/Billings/BillHeaders.model';
import { PatDetailsModel } from '../../../model/Billings/patientDetails.model';
import { LetterService } from '../../../services/chart/letter.service';
import { CheckboxModule } from 'primeng/checkbox';
import { WaitingroomService } from '../../../services/waitingnroom/waitingroom.service'

import * as moment from 'moment';
declare var $: any;

// filling demo data for dropdowns
interface dropdown {
  name: string;
  code: number;
}

interface showInsurance {
  PCode: any;
  PPayerId: any;
  PCategory: any;
  PCompanyName: any;
  PPolicyNo: any;
  PGroupNo: any;
  SCode: any;
  SPayerId: any;
  SCategory: any;
  SCompanyName: any;
  SPolicyNo: any;
  SGroupNo: any;
  TCode: any;
  TPayerId: any;
  TCategory: any;
  TCompanyName: any;
  TPolicyNo: any;
  TGroupNo: any;
}

@Component({
  selector: 'app-viewbill',
  templateUrl: './viewbill.component.html',
  styleUrls: ['./viewbill.component.scss'],
  providers: [Broadcaster, Services],
  encapsulation: ViewEncapsulation.None
})
export class ViewbillComponent implements OnInit {


  @Input() position: number = 400;

  @ViewChild('findPatient') private _selector: ElementRef;
  @ViewChild('lgModal') private _poup: ElementRef;


  // patient model
  patientDetailForm: PatDetailsModel;
  // editBills: EditBillsModel;
  // public totaltables: any = [];
  public data: any = [];
  physicianList: any = [];
  // declaring variables for show bill

  //Super bill status variable
  SBSV = "Pending";
  DOSF: any;
  DOST: any;
  InsPro: any = 0;
  InsType: any = "All";
  PSTBillParam: any = { pPhysicianUserId: "", pInsuranceProviderId: "", pSpecialityId: 0, pFacilityId: this.InsPro };
  updateBillSts: any = { pBillIds: "", pStatus: "", pUserId: "" };
  insuranceProvidersList: any = [];
  dateFrom: any;
  dateTo: any;
  Pendingbillsdata: any = [];
  SBSD = { name: 'Pending', code: 1 };
  POS: any[] = [];
  SelectedPOS;
  ModifiersCodes;
  TemplateSections;
  // declaring array for Patient information
  patientdata: any = [];
  private Used_visits: any;
  private Allowable_visits: any;
  private RStDate: any;
  private REDate: any;
  private showInsuranceTabs: boolean;
  //declaring array for table headers
  private tbh: any = [];
  private trd: any = [];
  private transactiontable;
  // declaring array for selected rows in table
  private CptcodeDetails: any = [];
  private selectedSuperBill: any = {};
  private selbill: any = [];
  private billStsResp: any = [];
  private PI: any = [];
  // private BillHeaders: any = [];
  BillHeaders: BillHeadersModel = {};
  patientAmountRequired;


  // filling demo data for dropdowns
  SBSStatus: dropdown[];
  Insutype: dropdown[];
  isInsured: any = [
    { name: "Patient", code: "PT" },
    { name: "Guarantor", code: "GT" },
  ];
  PIInsuredIs = {};
  SIInsuredIs = {};
  TIInsuredIs = {};
  SelectedSuperBill = {};
  editableSUperBill;
  // declaring variables for show/hide DOM
  private SearchBills: boolean = true;
  private ViewBills: boolean = false;
  private Editbills: boolean = false;
  private PTName: boolean = false;
  display: boolean = false;
  isLoader: boolean = true;
  private Billdetail: boolean;

  // these are for biller notes
  BillerNotes: any[] = [];
  CustomFormattedInsurance;
  PlaceOfService;
  AppointmentDetails;
  ShowInsuranceDetails: showInsurance = {
    PCode: "",
    PPayerId: "",
    PCategory: "",
    PCompanyName: "",
    PPolicyNo: "",
    PGroupNo: "",
    SCode: "",
    SPayerId: "",
    SCategory: "",
    SCompanyName: "",
    SPolicyNo: "",
    SGroupNo: "",
    TCode: "",
    TPayerId: "",
    TCategory: "",
    TCompanyName: "",
    TPolicyNo: "",
    TGroupNo: "",
  };
  InsProvider;
  UserDetails;
  // this is a dummy variable declared for bill header details
  DemoDrop: any = [];
  transtab;
  constructor(private http: HttpClient,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private physicianServ: PhysicianService,
    private insuranceProServ: InsuranceProviderService,
    private superBillserv: SuperBillService,
    protected localStorage: LocalStorage,
    //private state: GlobalState,
    private fb: FormBuilder,
    private LS: LetterService,
    private waitingservices: WaitingroomService,
    private modalService: NgbModal,
    // to detech changes
    private broadcaster: Broadcaster, private serv: Services) {
    this.broadcaster.on<string>('MyEvent')
      .subscribe(message => {
        console.log("From Pages Component :" + message)
      });
  }

  ngAfterViewChecked(): void {
    //Called after every check of the component's view. Applies to components only.
    //Add 'implements AfterViewChecked' to the class.
    this.SearchBills;
    this.ViewBills;
    this.Editbills;
    this.cdRef.detectChanges();
  }


  ngOnInit() {
    this.ViewBills = false;
    this.Editbills = false;
    this.showInsuranceTabs = false;
    this.getPatientDetails();
    this.UserDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
    // this is a dummy data for bill header details
    this.DemoDrop = [
      { name: 'Processed as Primary', code: 'PI' },
      { name: 'Processed as Secondary', code: 'SC' },
      { name: 'Processed as Tertiary', code: 'TR' },
      { name: 'Denied', code: 'DN' },
      { name: 'Pended', code: 'PD' },
      { name: 'Received, but not in process', code: 'RNP' },
      { name: 'Suspended', code: 'SUS' },
      { name: 'Suspended, Investigation with Field', code: 'SIF' },
      { name: 'Suspended - return with Material', code: 'SRM' },
      { name: 'Suspended - review Pending', code: 'SRP' },
      { name: 'Processed as Primary, Forwarded to Additional Payer(s)', code: 'PIA' },
      { name: 'Processed as Secondary, Forwarded to Additional Payer(s)', code: 'SFA' },
      { name: 'Processed as Teritatry, Forwarded to Additional Payer(s)', code: 'TFA' },
      { name: 'Reversal of Previous Payment', code: 'RPP' },
      { name: 'Not Our Claim, Formarded to Additional Payer(s)', code: 'FAP' },
      { name: 'Predetermination Pricing Only - No Payment', code: 'PPO' },
      { name: 'Reviewed', code: 'RV' }
    ];
    this.trd = [
      { field: "cptCode", header: "CPT code" },
      { field: "cptCodeDescription", header: "Description" },
      { field: "pointers", header: "Pointers" },
    ]

    // adding static value for Super bill status
    this.SBSStatus = [
      { name: 'Pending', code: 1 },
      { name: 'All', code: 2 },
      { name: 'Archived', code: 3 },
      { name: 'Submitted', code: 4 },
      { name: 'Bill Error', code: 5 },
      { name: 'Rejected', code: 6 },
      { name: 'Re-Submitted', code: 7 },
      { name: 'No Dues', code: 8 },
      { name: 'Collections', code: 9 },
      { name: 'Collections -InProgress', code: 10 },
    ]

    // adding static data for insurance type
    this.Insutype = [
      { name: 'All', code: null },
      { name: 'Primary', code: 2 },
      { name: 'Secondary', code: 3 },
      { name: 'Tertiary', code: 4 },
      { name: 'Self Pay', code: 5 },
      { name: 'No Insurance', code: 6 },
      { name: 'No Self Pay', code: 7 }
    ]

    // adding values for table headers
    this.tbh = [
      { field: 'billid', header: 'Bill Id' },
      { field: 'chartnumber', header: 'Chart Number' },
      { field: 'patientname', header: 'Patient Name' },
      { field: 'ssnorid', header: 'SSN/ID' },
      { field: 'status', header: 'Status' },
      { field: 'servicedate', header: 'Service Date' },
      { field: 'physician', header: 'Physician' },
      { field: 'facility', header: 'Facility' },
      { field: 'totalamt', header: 'Total Amount' },
      { field: 'copay', header: 'Copay' },
      { field: 'coinsurance', header: 'Co-Insurance' },
      { field: 'deductible', header: 'Deductible' },
    ]
    this.SearchBills = true;
    // this.createForm();
    let physicians = this.physicianServ.getPhysicianWithMinimumDetails();
    let insuranceProviders = this.insuranceProServ.getCFInsurance();
    // let insuranceProviders = this.insuranceProServ.getInsuranceProviders();

    forkJoin([physicians, insuranceProviders]).subscribe(results => {
      console.log("forkjoin1 function: ")
      console.log(results)
      console.log("physicianlIST INside forjoin function")
      this.physicianList = results[0];
      console.log(this.physicianList)
      console.log("Insurance Provider List inside forkjoin function")
      this.insuranceProvidersList = results[1];
      console.log(this.insuranceProvidersList)
    });

    this.getData((data) => {
      this.data = data;
      console.log("getting data table");
      console.log(data);
    });
    this.showBills();
  }

  // getting Date of services
  DOSFrom() {
    console.log("Value ot Date of Service from", this.DOSF);
    this.DOSF = moment(new Date(this.DOSF)).format("YYYY-MM-DD");
    console.log("Value ot Date of Service from", this.DOSF);
    this.PSTBillParam = {
      pPatientId: this.patientdata.PatientId,
      pFacilityId: this.patientdata.DefaultFacility,
      pSpecialityId: 0,
      pSuperbillStatus: this.SBSV,
      pPhysicianUserId: 0,
      pDateCreatedFrom: this.DOSF,
      pDateCreatedTo: this.DOST,
      pInsuranceProviderId: this.InsPro,
      pInsuranceType: this.InsType,
    }
    console.log("value of PstBillParameters: ", this.PSTBillParam);
    this.showBills();

  }

  // getting Date of services to

  DOSTO() {
    this.DOST = moment(new Date(this.DOST)).format("YYYY-MM-DD");
    this.PSTBillParam = {
      pPatientId: this.patientdata.PatientId,
      pFacilityId: this.patientdata.DefaultFacility,
      pSpecialityId: 0,
      pSuperbillStatus: this.SBSV,
      pPhysicianUserId: 0,
      pDateCreatedFrom: this.DOSF,
      pDateCreatedTo: this.DOST,
      pInsuranceProviderId: this.InsPro,
      pInsuranceType: this.InsType,
    }
    this.showBills();
  }


  // after changing insurance
  InsurChange(InsPro) {
    this.InsPro = InsPro.insuranceProviderId;
    console.log(this.InsPro);
    this.PSTBillParam = {
      pPatientId: this.patientdata.PatientId,
      pFacilityId: this.patientdata.DefaultFacility,
      pSpecialityId: 0,
      pSuperbillStatus: this.SBSV,
      pPhysicianUserId: 0,
      pDateCreatedFrom: this.DOSF,
      pDateCreatedTo: this.DOST,
      pInsuranceProviderId: this.InsPro,
      pInsuranceType: this.InsType,
    }
    this.showBills();
  }

  InsuranceType() {
    this.InsType = this.InsType.name;
    console.log(this.InsType);
    this.PSTBillParam = {
      pPatientId: this.patientdata.PatientId,
      pFacilityId: this.patientdata.DefaultFacility,
      pSpecialityId: 0,
      pSuperbillStatus: this.SBSV,
      pPhysicianUserId: 0,
      pDateCreatedFrom: this.DOSF,
      pDateCreatedTo: this.DOST,
      pInsuranceProviderId: this.InsPro,
      pInsuranceType: this.InsType,
    }
    this.showBills();

  }
  // createForm() {
  // this.ViewBillsForm = this.fb.group({
  //   DateFrom: null,
  //   DateTo: null,
  //   InsPro: null,
  //   SBS: null,
  //   InsuranceFilter: null,
  // });
  // }

  public getData(data) {
    // this.ngProgress.start()
    this.superBillserv.getSuperBillData().subscribe(resp => {
      console.log("get data function")
      console.log(resp)
      // this.ngProgress.done()
      data(resp);
      // this.data = resp;
    });
    console.log("patient data is: ");
    console.log(this.patientdata);
    this.PSTBillParam = {
      pPatientId: this.patientdata.PatientId,
      pFacilityId: this.patientdata.DefaultFacility,
      pSpecialityId: 0,
      pSuperbillStatus: this.SBSV,
      pPhysicianUserId: 0,
      pDateCreatedFrom: this.DOSF,
      pDateCreatedTo: this.DOST,
      pInsuranceProviderId: this.InsPro,
      pInsuranceType: this.InsType,
    }
  }

  // declaring function to Find Patient
  getPatientDetails() {
    // $("#lgModal").modal('show');
    console.log("value of session sotrage");
    console.log(JSON.parse(sessionStorage.getItem("PatientDetail")));
    if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
      // $("#lgModal").modal('show');
      const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.openPopUp = true;
      modalRef.componentInstance.ComponentName = 'viewbills';
    }
    if ((JSON.parse(sessionStorage.getItem("PatientDetail")) != null)) {
      this.patientdata = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.patientdata.DateCreated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateLastUpdated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateOfBirth = new Date(this.patientdata.DateOfBirth);
      this.patientdata.FullName = this.patientdata.LastName + ", " + this.patientdata.FirstName
      console.log("patient data is: ");
      console.log(this.patientdata);
      console.log(this.patientdata.PatientId);
      console.log(this.patientdata.FullName);
      this.PTName = true;

      this.PSTBillParam = {
        pPatientId: this.patientdata.PatientId,
        pFacilityId: this.patientdata.DefaultFacility,
        pSpecialityId: 0,
        pSuperbillStatus: this.SBSV,
        pPhysicianUserId: 0,
        pDateCreatedFrom: this.DOSF,
        pDateCreatedTo: this.DOST,
        pInsuranceProviderId: this.InsPro,
        pInsuranceType: this.InsType,
      }
    }
  }

  showBills() {
    this.isLoader = true;
    this.superBillserv.getPstBillingDetails(this.PSTBillParam).subscribe(resp => {
      console.log("PSTBillParams function")
      console.log(resp)
      // this.ngProgress.done()
      this.data = [resp];
      console.log(this.data)
      this.Pendingbillsdata = resp
      for (let i = 0; i < this.Pendingbillsdata.length; i++) {
        this.Pendingbillsdata[i].servicedate = this.parseDate(this.Pendingbillsdata[i].servicedate);
        this.Pendingbillsdata[i].indexvalue = i;
      }
      this.isLoader = false;
      console.log("pendingbillsdata")
      console.log(this.Pendingbillsdata);
      this.selbill = [];
    });
  }
  getColor(value){
    if(value){
      switch(value){
        case 'true_false': return 'Orange';
        // break;
        case 'false_false': return 'Red';
        // break;
        case 'false_true': return '#FFFFFF';
        // break;
        default: return'#FFFFFF';
        // break;
      }
    } else {
      return'#FFFFFF';
    }

  }
  parseDate(date) {
    if (date) {
      const d = new Date(Date.parse(date));
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    } else {
      return null;
    }
  }

  // parseDateformat(date) {
  //   if (date) {
  //     const d = new Date(date.parse(date));
  //     return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  //   } else {
  //     return null;
  //   }
  // }


  public onDeleteConfirm(event): void {
    console.log("value of event", event);
    if (window.confirm('Are you sure you want to delete?')) {
      var superbill = {
        pSuperbillId: event.billid
      }
      this.superBillserv.DeleteSuperBills(superbill).subscribe(resp => {
        this.toastr.success("Bill has been deleted Successfully");
      })
      console.log("resolved");
    } else {

      console.log("rejected");
    }


  }

  StatusChange(SBSD) {
    this.SBSV = SBSD.name;
    console.log("Value of SUper bill status");
    console.log(this.SBSV);
    this.PSTBillParam = {
      pPatientId: this.patientdata.PatientId,
      pFacilityId: this.patientdata.DefaultFacility,
      pSpecialityId: 0,
      pSuperbillStatus: this.SBSV,
      pPhysicianUserId: 0,
      pDateCreatedFrom: this.DOSF,
      pDateCreatedTo: this.DOST,
      pInsuranceProviderId: this.InsPro,
      pInsuranceType: this.InsType,
    }
    this.showBills();
  }

  editbill(rowData) {
    let temp = {};
    this.selbill = rowData;
    switch (rowData.status) {
      case "Pending": temp = rowData;
        break;
      case "Bill Error": temp = rowData;
        break;
      case "Submitted": temp = rowData;
        break;
      case "Re-Submitted": temp = rowData;
        break;
      case "Corrections -InProgress": temp = rowData;
        break;
      default: this.toastr.error("Only Superbills with Status 'Pending', 'Bill Error', 'Submitted', 'Re-Submitted' and 'Corrections -InProgress' can be editted", "Error Window",
        { timeOut: 5000 });
        return;
    }
    this.editableSUperBill = rowData
    console.log("value of Row data is", rowData);
    if (this.SBSV === "Archived") {
      this.display = true;
    } else {
      this.Billdetail = false;
      this.isLoader = true;
      let pSuperBillId = rowData.billid;
      let pEncounterId = rowData.mrpatientencounterid;
      let PatientId = rowData.patientid;
      let pAppointmentId = {
        pAppointmentId: rowData.appointmentid,
      }

      let pEnCounterID = {
        pEncounterId: pEncounterId,
      }
      this.PSTBillParam = {
        pSuperBillId: pSuperBillId
      }
      let pPatientId = {
        pPatientId: PatientId,
      }
      this.FetchaLLAPI(this.PSTBillParam, pEnCounterID, pPatientId, pAppointmentId);
      console.log(rowData.billid);
      if (this.PI.length > 1) {
        for (let i = 0; i < this.PI.length; i++) {
          switch (this.PI[i].Order) {
            case 1: this.PI[i].Order = "Primary";
              break;
            case 2: this.PI[i].Order = "Secondary";
              break;
            case 3: this.PI[i].Order = "Tertairy";
              break;
          }
        }
      }
      this.SearchBills = false;
      this.Editbills = true;
      // this.createEditbillsForm();
    }
    this.calculateCharges()
  }

  // creating another form for editing bills
  // createEditbillsForm() {
  //   this.EditBillsForm = this.fb.group({

  //   });
  // }

  // Fetching Superbill Details based on bill Id
  FetchaLLAPI(pSuperBillId, pEnCounterID, pPatientId, pAppointmentId) {

    let PTSBI = {
      patientID: pPatientId.PatientId,
      superBillId: pSuperBillId.pSuperBillId
    }
    let encounter = {
      PatientEncounterId: pEnCounterID.pEncounterId
    }

    let encounterid = {
      patientEncounterId: pEnCounterID.pEncounterId
    }

    let groupid = {
      templateGroupId: 6
    }

    let cfBillingcpt = {
      patientEncounterId: "4771"
    }
    let billernotesencounter = {
      pEncounterId: "4771"
    }
    let gpecpt = {
      PatientEncounterId: "4771"
    }

    let PatientDetails = this.superBillserv.getSuperBillbyID(pSuperBillId);
    let BillHeaderTabs = this.superBillserv.getBillHeaderDetails(pEnCounterID);
    let TransactionDetails = this.superBillserv.getEncounterCptCodes(pEnCounterID);
    let InsuranceDetails = this.insuranceProServ.getInsurancebyPtId(pPatientId);
    let BillerNotes = this.superBillserv.getBillerNotes(pEnCounterID);
    let CFInsurance = this.insuranceProServ.getCFIbyPTandSBI(PTSBI);
    let Appo = this.superBillserv.getAppointmentDetailsbyid(pAppointmentId);
    let POSservice = this.physicianServ.getPos();
    let transaction = this.insuranceProServ.getPatientEncounterCPT(encounter);
    this.LS.getGroupSection(groupid).subscribe(res => {
      this.TemplateSections = res
      console.log("value of templateSections", this.TemplateSections)
    })


    this.superBillserv.getEncounterCptCodes(pEnCounterID).subscribe(rescpt => {
      this.CptcodeDetails = rescpt
      console.log("value of CptcodeDetails", this.CptcodeDetails);
    })

    this.superBillserv.getSuperBillbyID(pSuperBillId).subscribe(res => {
      this.selectedSuperBill = res;
      this.selectedSuperBill = this.selectedSuperBill[0];
      this.selectedSuperBill.servicedate = this.parseDate(this.selectedSuperBill.servicedate)
      this.selectedSuperBill.datecreated = this.parseDate(this.selectedSuperBill.datecreated)
      console.log("Patient Details", this.selectedSuperBill)
      if (res) {
        this.isLoader = false;
        this.showInsuranceTabs = true;
      }
    })
    this.superBillserv.getBillHeaderDetails(pEnCounterID).subscribe(resp => {
      this.BillHeaders = resp[0];
      // this.BillHeaders = this.BillHeaders[0];
      console.log("value of bill heraders", this.BillHeaders);
      if (this.BillHeaders.PrimaryInsuranceEffectiveDateFrom) {
        this.BillHeaders.PrimaryInsuranceEffectiveDateFrom = new Date(this.BillHeaders.PrimaryInsuranceEffectiveDateFrom);
      } else { this.BillHeaders.PrimaryInsuranceEffectiveDateFrom = null }
      if (this.BillHeaders.PrimaryInsuranceEffectiveDateTo) {
        this.BillHeaders.PrimaryInsuranceEffectiveDateTo = new Date(this.BillHeaders.PrimaryInsuranceEffectiveDateTo);
      } else { this.BillHeaders.PrimaryInsuranceEffectiveDateTo = null; }
      if (this.BillHeaders.SecondaryInsuranceEffectiveDateFrom) {
        this.BillHeaders.SecondaryInsuranceEffectiveDateFrom = new Date(this.BillHeaders.SecondaryInsuranceEffectiveDateFrom);
      } else { this.BillHeaders.SecondaryInsuranceEffectiveDateFrom = null; }
      if (this.BillHeaders.SecondaryInsuranceEffectiveDateTo) {
        this.BillHeaders.SecondaryInsuranceEffectiveDateTo = new Date(this.BillHeaders.SecondaryInsuranceEffectiveDateTo);
      } else { this.BillHeaders.SecondaryInsuranceEffectiveDateTo = null; }
      if (this.BillHeaders.TertiaryInsuranceEffectiveDateFrom) {
        this.BillHeaders.TertiaryInsuranceEffectiveDateFrom = new Date(this.BillHeaders.TertiaryInsuranceEffectiveDateFrom);
      } else { this.BillHeaders.TertiaryInsuranceEffectiveDateFrom = null }
      if (this.BillHeaders.TertiaryInsuranceEffectiveDateTo) {
        this.BillHeaders.TertiaryInsuranceEffectiveDateTo = new Date(this.BillHeaders.TertiaryInsuranceEffectiveDateTo);
      } else { this.BillHeaders.TertiaryInsuranceEffectiveDateTo = null }
      if (this.BillHeaders.AdmitDate) {
        this.BillHeaders.AdmitDate = new Date(this.BillHeaders.AdmitDate)
      } else { this.BillHeaders.AdmitDate = null; }
      if (this.BillHeaders.DischargeDate) {
        this.BillHeaders.DischargeDate = new Date(this.BillHeaders.DischargeDate);
      } else { this.BillHeaders.DischargeDate = null; }
      if (this.BillHeaders.PrimaryInsuranceInsuredIsPatient === true) {
        this.PIInsuredIs = { name: "Guarantor", code: "GT" }
      } else if (this.BillHeaders.PrimaryInsuranceInsuredIsGuarantor === true) {
        this.PIInsuredIs = { name: "Patient", code: "PT" }
      } else { this.PIInsuredIs = { name: "", code: "" } }
      if (this.BillHeaders.SecondaryInsuranceInsuredIsPatient === true) {
        this.SIInsuredIs = { name: "Patient", code: "PT" }
      } else if (this.BillHeaders.SecondaryInsuranceInsuredIsGuarantor === true) {
        this.SIInsuredIs = { name: "Guarantor", code: "GT" }
      } else { this.SIInsuredIs = { name: "", code: "" } }
      if (this.BillHeaders.TertiaryInsuranceInsuredIsPatient === true) {
        this.TIInsuredIs = { name: "Patient", code: "PT" }
      } else if (this.BillHeaders.TertiaryInsuranceInsuredIsGuarantor === true) {
        this.TIInsuredIs = { name: "Guarantor", code: "GT" }
      } else { this.TIInsuredIs = { name: "", code: "" } }
      console.log("Fetching Bill Headers Details")
      console.log(this.BillHeaders)
      if (resp) {
        this.isLoader = false;
        this.showInsuranceTabs = true;
      }
    })

    this.insuranceProServ.getCFIbyPTandSBI(PTSBI).subscribe(respo => {
      this.CustomFormattedInsurance = respo
      this.CustomFormattedInsurance.forEach((item) => {
        switch (item.order) {
          case 1: item.insuranceType = "Primary Insurance";
            this.ShowInsuranceDetails.PCode = item.insuranceprovidercode;
            this.ShowInsuranceDetails.PPayerId = item.insuranceproviderpayerid;
            this.ShowInsuranceDetails.PCategory = item.insuranceprovidercategory;
            this.ShowInsuranceDetails.PCompanyName = item.insurancename;
            this.ShowInsuranceDetails.PPolicyNo = item.insurancepolicynumber;
            this.ShowInsuranceDetails.PGroupNo = item.groupnumber;
            break;
          case 2: item.insuranceType = "Secondary Insurance";
            this.ShowInsuranceDetails.SCode = item.insuranceprovidercode;
            this.ShowInsuranceDetails.SPayerId = item.insuranceproviderpayerid;
            this.ShowInsuranceDetails.SCategory = item.insuranceprovidercategory;
            this.ShowInsuranceDetails.SCompanyName = item.insurancename;
            this.ShowInsuranceDetails.SPolicyNo = item.insurancepolicynumber;
            this.ShowInsuranceDetails.SGroupNo = item.groupnumber;
            break;
          case 3: item.insuranceType = "Tertiary Insurance";
            this.ShowInsuranceDetails.TCode = item.insuranceprovidercode;
            this.ShowInsuranceDetails.TPayerId = item.insuranceproviderpayerid;
            this.ShowInsuranceDetails.TCategory = item.insuranceprovidercategory;
            this.ShowInsuranceDetails.TCompanyName = item.insurancename;
            this.ShowInsuranceDetails.TPolicyNo = item.insurancepolicynumber;
            this.ShowInsuranceDetails.TGroupNo = item.groupnumber;
            break;
        }
        if (item) {
          this.isLoader = false;
          this.showInsuranceTabs = true;
        }
      })
      console.log("value of cfinsurance", this.CustomFormattedInsurance);

    });

    this.superBillserv.getAppointmentDetailsbyid(pAppointmentId).subscribe(item => {
      this.AppointmentDetails = item
      if (this.AppointmentDetails.length === 0) {

      } else {
        this.AppointmentDetails = this.AppointmentDetails[0];
        this.RStDate = new Date(this.AppointmentDetails.ReferralStartDate);
        this.REDate = new Date(this.AppointmentDetails.ReferralExpiryDate);
        this.Allowable_visits = this.AppointmentDetails.AllowedVisits;
        this.Used_visits = this.AppointmentDetails.VisitsUsed;
      }
    });

    this.physicianServ.getPos().subscribe(ele => {
      this.POS = ele
      this.SelectedPOS = this.POS[0];
      console.log("value of POS", this.POS)
      if (ele) {
        this.superBillserv.getEncounterCptCodes(pEnCounterID).subscribe(rescpt => {
          this.CptcodeDetails = rescpt
          console.log("value of CptcodeDetails", this.CptcodeDetails);
          if (rescpt) {
            this.superBillserv.getBillerNotes(billernotesencounter).subscribe(res => {
              this.BillerNotes = res;
              console.log("value of billernotes", this.BillerNotes)
              if (res) {
                // encounter
                this.insuranceProServ.getPatientEncounterCPT(gpecpt).subscribe(elem => {
                  if (elem) {
                    this.transactiontable = [elem];
                    this.transactiontable.forEach((item) => {
                      item.showDeletebutton = false;
                      this.BillerNotes.forEach((bil) => {
                        if (item.MrPatientEncounterCptDiagnosisAssociationId === bil.MrPatientEncounterCptDiagnosisAssociationId) {
                          item.Notes = bil.Note
                          item.Notetype = bil.NoteType
                          return;
                        }
                      })
                      this.CptcodeDetails.forEach((cpt) => {
                        if (item.CptCode === cpt.CptCode1) {
                          item.description = cpt.Description;
                          return;
                        }
                      })
                      // this.POS.forEach((serv) => {
                      //   if (item.PlaceOfServiceCode === serv.Code) {
                      //     this.SelectedPOS = serv;
                      //   }
                      // })
                      item.ServiceStartDate = new Date(item.ServiceStartDate);
                      item.ServiceEndDate = new Date(item.ServiceEndDate);
                    })
                    console.log("value of transaction table", this.transactiontable);
                    console.log("value of CptcodeDetails", this.CptcodeDetails);
                    console.log("value of billernotes", this.BillerNotes)
                  }
                });

              }
            })
          }
        })
      }
    });


    // http promise
    // this.physicianServ.getPos().then(res => {
    //   this.POS = res
    //   this.SelectedPOS = this.POS[0];
    //   console.log("value of POS",this.POS)
    // })

    this.superBillserv.getModifierCodes().subscribe(eleme => {
      this.ModifiersCodes = eleme;
      console.log("value of Modifiers table", this.ModifiersCodes)
    });
    // encounterid
    this.insuranceProServ.getCFBillingCPTDiagnosisAssociation(cfBillingcpt).subscribe(response => {
      this.transtab = response
      console.log("value of transtab b4 doing any manipultaion", this.transtab)
      this.transtab.forEach((item, i) => {
        item.showDeletebutton = false;
        item.indexvalue = i
        this.POS.forEach((serv) => {
          if (serv.Code === item._posc) {
            item.SelectedPOS = serv;
            return;
          }
        })
        item._serviceEndDate = new Date(item._serviceEndDate)
        item._serviceStartDate = new Date(item._serviceStartDate)
      })
      console.log("value of trans tab is", this.transtab)
    })
  }

  viewBill(rowData) {
    this.selbill = rowData;
    console.log("value of row data", rowData, this.selbill);
    this.selectedSuperBill = rowData;
    let pAppointmentId = {
      pAppointmentId: rowData.appointmentid,
    }


    this.isLoader = true;
    this.Billdetail = true;
    let pSuperBillId = rowData.billid;
    let pEncounterId = rowData.mrpatientencounterid;
    let PatientId = rowData.patientid;
    let pEnCounterID = {
      pEncounterId: pEncounterId,
    }
    this.PSTBillParam = {
      pSuperBillId: pSuperBillId
    }
    let pPatientId = {
      pPatientId: PatientId,
    }
    this.FetchaLLAPI(this.PSTBillParam, pEnCounterID, pPatientId, pAppointmentId);
    console.log(rowData.billid);
    if (this.PI.length > 1) {
      for (let i = 0; i < this.PI.length; i++) {
        switch (this.PI[i].Order) {
          case 1: this.PI[i].Order = "Primary";
            break;
          case 2: this.PI[i].Order = "Secondary";
            break;
          case 3: this.PI[i].Order = "Tertairy";
            break;
        }
      }
    }
    this.SearchBills = false;
    this.Editbills = true;
    //   this.selectedSuperBill = rowData;
    console.log("view bill is");
    //  console.log(this.selectedSuperBill);
    console.log(rowData.billid);

  }

  calculateCharges() {
    this.patientAmountRequired = (this.selectedSuperBill.copayrequired == null ? 0 : this.selectedSuperBill.copay) +
      (this.selectedSuperBill.coinsurancerequired == null ? 0 : this.selectedSuperBill.coinsurance) + (this.selectedSuperBill.deductiblerequired == null ? 0 : this.selectedSuperBill.deductible);
  }



  closebill(value) {
    console.log("which button is clicked", value)
    this.transtab.sort((a, b) => { return a.cptCode - b.cptCode });
    this.transactiontable.sort((a, b) => { return a.CptCode - b.CptCode })
    for (let i = 0; i < this.transtab.length; i++) {
      if ((this.transtab[i].pointers === null) || (this.transtab[i].pointers === "")) {
        this.toastr.error("Please select atleast one Diagnosis code for cpt " + this.transtab[i].cptCode);
        return;
      }
      for (let j = 0; j < this.BillerNotes.length; j++) {
        if (this.transtab[i].billersNoteId === this.BillerNotes[i].BillersNoteId) {
          this.BillerNotes[i].Note = this.transtab[i].billersNote
        }
      }
      for (let k = 0; k < this.transactiontable.length; k++) {
        if (this.transtab[i].cptCode === this.transactiontable[k].CptCode) {
          this.transactiontable[k].Modifier1 = this.transtab[i].cptCodeModifier1
          this.transactiontable[k].Modifier2 = this.transtab[i].cptCodeModifier2
          this.transactiontable[k].Modifier3 = this.transtab[i].cptCodeModifier3
          this.transactiontable[k].Modifier4 = this.transtab[i].cptCodeModifier4
          this.transactiontable[k].Units = this.transtab[i]._units
          this.transactiontable[k].PlaceOfServiceCode = this.transtab[i]._posc
          this.transactiontable[k].ServiceStartDate = this.transtab[i]._serviceStartDate
          this.transactiontable[k].ServiceEndDate = this.transtab[i]._serviceEndDate
          this.transactiontable[k].InsurancePriorAuthorizationNumber = this.transtab[i]._insurancePriorAuthorizationNumber
          this.transactiontable[k].ModifyUnitCharge = this.transtab[i]._modifyUnitCharge
          this.transactiontable[k].ProcedureUnitCharge = this.transtab[i].modifiedProcedureUnitCharge
        }
      }
      // this.ngOnInit();
    }
    this.waitingservices.updateBillersNote(this.BillerNotes).subscribe(resp => {
      // this.toastr.success("Super bill saved Successfully");
      if (resp) {
      }
      console.log("value of updatebillernote", resp);
    })

    this.insuranceProServ.putPatientEncounterCPT(this.transactiontable).subscribe(resp => {
      this.toastr.success("Super Bill Saved Successfully");
      if (resp) {
      }
      console.log("value of putpatientencountercpt", resp)
    })
    this.SearchBills = true;
    this.Editbills = false;
  }

  AppSub(Savemodal) {
    console.log("selected bill to Approve and submit is: ", this.selbill);
    let temp: any[] = [];
    if (this.selbill.length === 0) {
      this.toastr.error("Please select atleast one Bill to Submit");
      return;
    }
    for (let i = 0; i < this.selbill.length; i++) {
      if ((this.selbill[i].status === "Pending") || (this.selbill[i].status === "Bill Error")) {
        temp.push(this.selbill[i])
      } else {
        this.toastr.error("Please select a Super bill which has status as 'Pending' or 'Bill Error'")
        return;
      }
    }
    console.log("value of temp is", temp);
    this.modalService.open(Savemodal, { centered: true, size: 'lg', windowClass: 'modelStyle' })
    // this.toastr.success("Bill has been submitted Successfully");

  }

  Forms() {
    console.log("value of unit charge", this.transtab)
    this.patientAmountRequired = (this.editableSUperBill.copay == null ? 0 : this.editableSUperBill.copay) + (this.editableSUperBill.coinsurance == null ? 0 : this.editableSUperBill.coinsurance) + (this.editableSUperBill.deductible == null ? 0 : this.editableSUperBill.deductible);
    // this.BillHeaders.TotalCharges = 0;
    // this.BillHeaders.TotalDueFromInsurance = 0;
    let totalDueFromPatient = 0;
    let patientAmountPaid = 0;
    let totalDueFromInsurance = 0;
    this.transtab.forEach((item) => {
      if (item._modifyUnitCharge) {
        this.BillHeaders.TotalCharges = this.BillHeaders.TotalCharges + (item.modifiedProcedureUnitCharge ? 0 : item.modifiedProcedureUnitCharge)
      } else {
        this.BillHeaders.TotalCharges = this.BillHeaders.TotalCharges + (item.procedureUnitCharge ? 0 : item.procedureUnitCharge)
      }
    });
    if (this.editableSUperBill.selfpay == null || this.editableSUperBill.selfpay == false) {

    } else {
      this.patientAmountRequired = this.BillHeaders.TotalCharges;
    }
    patientAmountPaid = this.BillHeaders.CopayAmountPaid + this.BillHeaders.CoInsurancePatientAmountPaid + this.BillHeaders.DeductibleAmountPaid
    totalDueFromInsurance = this.BillHeaders.TotalCharges - this.patientAmountRequired;
    totalDueFromPatient = this.patientAmountRequired - patientAmountPaid;
    // this.BillHeaders.TotalDueFromInsurance = totalDueFromInsurance < 0 ? 0 : (totalDueFromInsurance? 0: totalDueFromInsurance);
    this.BillHeaders.TotalDueFromInsurance = totalDueFromInsurance < 0 ? 0 : totalDueFromInsurance;
    this.BillHeaders.TotalDueFromPatient = totalDueFromPatient < 0 ? 0 : (totalDueFromPatient ? 0 : totalDueFromPatient);
    this.BillHeaders.TotalPaymentsReceived =
      (this.BillHeaders.TotalCharges) - this.BillHeaders.TotalDueFromInsurance;
    // ((totalDueFromInsurance?0: totalDueFromInsurance) + (totalDueFromPatient? 0: totalDueFromPatient))
    // this.BillHeaders.TotalCharges - (this.BillHeaders.TotalDueFromInsurance + this.BillHeaders.CoInsurancePatientAmountPaid+this.BillHeaders.DeductibleAmountPaid)
    console.log("selected bill to generate forms is: ", this.BillHeaders);
  }

  ArchiveBill() {
    var superBillId: any[] = [];
    if (this.selbill.length === 0) {
      this.toastr.error("Please select a bill");
      return;
    }
    console.log("selected bill to archive is: ", this.selbill);
    for (let i = 0; i < this.selbill.length; i++) {
      if (this.selbill[i].status === "Pending" || this.selbill[i].status === "Bill Error") {
        let temp = this.selbill[i].billid
        superBillId.push(temp)
      } else {
        this.toastr.error("The Bills with status Pending and Bill Error can be archieved");
        return 0;
      }
    }
    console.log("value of peding bills data before moving", this.Pendingbillsdata)
    this.superBillserv.archieveSuperBills(superBillId).subscribe(resp => {
      console.log("value of resp", resp);
      this.Pendingbillsdata = [];
      this.selbill = [];
      this.showBills();
      console.log("value of peding bills data after moving", this.Pendingbillsdata)
      this.toastr.success("Bills has been Archieved")
    });
  }


  clearform(){
    this.DOSF = null;
    this.DOST = null;
    this.InsProvider = null;
    this.SBSD = null;
    this.InsType = null;
    this.Pendingbillsdata = null;
    this.selbill = null;
    let obj:showInsurance;
    obj.PCode = "3";
    console.log("value of obj is",obj);
  }
  UnarchiveBill() {
    var SuperBillId: any[] = [];
    if (this.selbill.length === 0) {
      this.toastr.error("Please select a bill")
      return;
    }
    for (let i = 0; i < this.selbill.length; i++) {
      if (this.selbill[i].status === "Archived") {
        let temp = this.selbill[i].billid
        SuperBillId.push(temp)
      } else {
        this.toastr.error("Please select an Archieved bill");
        return;
      }
    }
    console.log("Selected bill to unarchive is: ", this.selbill);
    console.log("value of peding bills data before moving", this.Pendingbillsdata)
    this.superBillserv.unArchieveSuperBills(SuperBillId).subscribe(resp => {
      console.log("value of resp", resp)
      this.Pendingbillsdata = [];
      this.selbill = [];
      this.showBills();
      this.toastr.success("Bill has been Un-Archieved Successfully");
    })
  }
  closeView() {
    this.SearchBills = true;
    this.Editbills = false;
    this.ngOnInit();
  }

  // adding duplicate row and seperate index value for that row
  copyCpt(rowdata, cpttable) {
    this.transtab.push(rowdata);
    // sorting array
    console.log(this.transtab)
    this.transtab = this.transtab.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }))
    let ind = this.transtab.length - 1
    this.transtab[ind].DateCreated = new Date();
    this.transtab[ind].DateLastUpdated = new Date();
    this.transtab[ind].CreatedByUserId = this.UserDetails.UserId;
    this.transtab[ind].LastUpdatedByUserId = this.UserDetails.UserId;
    this.transtab[ind].showDeletebutton = true;
    this.transtab[ind].assessmentDiagnosisCode1Checked = false;
    this.transtab[ind].assessmentDiagnosisCode2Checked = false;
    this.transtab[ind].assessmentDiagnosisCode3Checked = false;
    this.transtab[ind].assessmentDiagnosisCode4Checked = false;
    this.transtab[ind].assessmentDiagnosisCode5Checked = false;
    this.transtab[ind].assessmentDiagnosisCode6Checked = false;
    this.transtab[ind].assessmentDiagnosisCode7Checked = false;
    this.transtab[ind].assessmentDiagnosisCode8Checked = false;
    this.transtab[ind].assessmentDiagnosisCode9Checked = false;
    this.transtab[ind].assessmentDiagnosisCode10Checked = false;
    this.transtab[ind].assessmentDiagnosisCode11Checked = false;
    this.transtab[ind].assessmentDiagnosisCode12Checked = false;
    this.transtab[ind].pointers = null;
    console.log("value of cpt code details after push is", this.transtab)
    this.transtab.sort((a, b) => { return a.indexvalue - b.indexvalue });
    // cpttable.reset();
  }

  deletecpt(row, table) {
    console.log("value of row", row);
    let i = row.indexvalue;
    this.transtab.splice(i, 1);
    this.transtab = this.transtab.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }))
    table.reset();
  }
  addPointers(alphabet, rowData) {
    switch (alphabet) {
      case "A": if (rowData.assessmentDiagnosisCode1Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "B": if (rowData.assessmentDiagnosisCode2Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "C": if (rowData.assessmentDiagnosisCode3Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "D": if (rowData.assessmentDiagnosisCode4Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
        console.log(rowData.pointers)
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "E": if (rowData.assessmentDiagnosisCode5Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "F": if (rowData.assessmentDiagnosisCode6Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "G": if (rowData.assessmentDiagnosisCode7Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "H": if (rowData.assessmentDiagnosisCode8Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "I": if (rowData.assessmentDiagnosisCode9Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "J": if (rowData.assessmentDiagnosisCode10Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "K": if (rowData.assessmentDiagnosisCode11Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
      case "L": if (rowData.assessmentDiagnosisCode12Checked) {
        if(rowData.pointers){
        rowData.pointers = rowData.pointers + alphabet;}
        else {rowData.pointers = alphabet;}
      } else {
         rowData.pointers = rowData.pointers.replace(alphabet, '');
      }
        break;
    }
    console.log("value of pointers",rowData.pointers)
  }

}
