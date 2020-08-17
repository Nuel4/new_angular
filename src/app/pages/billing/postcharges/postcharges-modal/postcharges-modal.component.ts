import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { PostBillsService } from '../../../../services/billing/postbills.services';
import { RVU } from './../../../../model/Billings/RVU.model';
import { ToastrService } from 'ngx-toastr';
import { SuperBillService } from '../../../../services/billing/superbill.service';
import { RVUinter } from '../../../../model/Billings/PostBillRVU.type';
import { AppointmentService } from './../../../../services/workspace/appointment.service';
import { Visit } from './../../../../model/visit.model';
import { CalendarDate } from './../../../../model/calendardate.model';
import { PrescribeService } from '../../../../services/chart/prescribe.service';
import { ProgressnoteService } from '../../../../services/chart/progressnote.service';
import { LookupService } from '../../../../services/lookup.service';
import {InsuranceProviderService} from '../../../../services/billing/insuranceprovider.service';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-postcharges-modal',
  templateUrl: './postcharges-modal.component.html',
  styleUrls: ['./postcharges-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostchargesModalComponent implements OnInit {
  @Input() patientDetails;
  @Input() usersList;
  @Input() enouterid;
  @Input() TemplateSections;
  @Input() billsdata;
  @Input() getPractice;
  @Output() SavedData = new EventEmitter();
  @Output() loadEvent = new EventEmitter();
  AssociationTable: any[] = [];
  // RVU[];
  visitAppointment;
  computedLevelOfService;
  ServiceCptCode;
  maxDate;
  isValid: boolean;
  compFrom = 'post'
  ComponentName;
  ApptID;
  visitid;
  EncounterId;
  cols: any[];
  index: number = 0;
  data: {}[];
  facilitylist: any;
  DOS;
  selectedfacility;
  moveNext: boolean = false;
  moveToNext: boolean = false;
  description: string = '';
  selectedPhysician: any = {}
  InsuranceList: any;
  symtomType: any[];
  treatmentType: any[];
  AccidentType: any[];
  NatureOfAccident: any[];
  referringType: any[];
  LocalUseBox: any[];
  pTab: boolean = false;
  codes: { cptcode: string; description: string; pointers: string; }[];
  selectedCptCode: any;
  selectedIcdCode: any;
  SelectedPhysicianId;
  SelectedPhysiciansUserId;
  SelectedFacilityId;
  POSList: any;
  BillerNotes;
  firsttab: boolean = true;
  secondtab: boolean = true;
  lasttab: boolean = true;
  RVUValues: RVU;
  DXcodevalues;
  patientData;
  // these variables are for save api's
  visit: Visit;
  calendarDate: CalendarDate;
  getRVU: any = {};
  //  RVU;
  userdata;
  cfAppointment;
  patientState;
Modifiers;
// variables in association tab
admitDate;
DischargeDate;
ReferralStartDate;
  ReferralEndDate;
PatientInsuranceProvider;
  Encounter: any;
primaryClaim: any;
secondaryClaim: any;
tertiaryClaim: any;
primaryAccept: boolean;
secondaryAccept: boolean;
tertiaryAccept: boolean;
  symptomDate: any;
  selectedSType: any;
  OtherTreatmentDate: any;
  selectedTreatment: any;
  LastXrayDate: any;
  selectedAccidentType: any;
  AccidentDate: any;
  UnableToWorkFromDate: any;
  UnableToWorkTo: any;
  selectedPatientState: any;
  selectedNature: any;
  accidentQualifier: any;
  hospitalizationFrom: any;
  hospitalizationTo: any;
  claimCondition1: any;
  claimCondition2: any;
  claimCondition3: any;
  claimCondition4: any;
  claimCondition5: any;
  selectedReferringType: any;
  box23: any;
  box19: any;
  outsideLab: any;
  labCharge: any;
  selectedLocalUse: any;
  LocalUseBox22Text: any;
  departmentId: any;
  constructor(
    private lus: LookupService,
    private activeModal: NgbActiveModal,
    private pbs: PostBillsService,
    private toaster: ToastrService,
    private sbs: SuperBillService,
    private apptService: AppointmentService,
    private ps: PrescribeService,
    private IPS: InsuranceProviderService,
    private Pns: ProgressnoteService
  ) { }

  ngOnInit() {
    console.log("patient details", this.patientDetails)
    this.ComponentName = "PostCharges"
    this.patientData = JSON.parse(sessionStorage.getItem('PatientDetail'))
    this.userdata = JSON.parse(sessionStorage.getItem('UserDetail'))
    this.data = [{}];
    this.DOS = new Date();
    this.maxDate = new Date();
    // this.value = [{}];
    console.log("value of userlist and facility", this.usersList)

    this.getAllDatas();


    this.cols = [
      { field: "cptCode", header: "CPT code" },
      { field: "cptCodeDescription", header: "Description" },
      { field: "pointers", header: "Pointers" },
    ];

    this.codes = [
      { cptcode: '1234', description: 'aaaa', pointers: 'yyy' },
      { cptcode: '1111', description: 'bbbb', pointers: 'xxxx' },
    ];

    this.symtomType = [
      { name: 'Injury', code: 'Injury' },
      { name: 'Illness', code: 'illness' },
      { name: 'LMP', code: 'lmp' },
    ];
    this.treatmentType = [
      { name: 'Initial Treatment', code: 'initialTreat' },
      { name: 'Latest Visit or Consulation', code: 'latestVisit' },
      { name: 'Acute Manifestation of a Chronic Condition', code: 'acute' },
      { name: 'Accident', code: 'accident' },
      { name: 'Last X-Ray', code: 'lastX-ray' },
      { name: 'Prescription', code: 'prescription' },
      { name: 'Report Start(Assumed Care Date)', code: 'reportstart' },
      { name: 'Report End (Relinquished Care Date)', code: 'relinquished' },
      { name: 'First Visit or Consultation', code: 'firstvisit' },
    ];

    this.AccidentType = [
      { name: 'Auto', code: 'auto' },
      { name: 'Employment Related', code: 'employmentrelated' },
      { name: 'Other', code: 'other' },
    ];

    this.NatureOfAccident = [
      { name: 'Injured at home', code: 'auto' },
      { name: 'Injured at school', code: 'employmentrelated' },
      { name: 'Injured during recreation', code: 'recreation' },
      { name: 'Work injury/self Employee', code: 'selfemp' },
      { name: 'Work injury/non collision', code: 'noncollision' },
      { name: 'Work injury/collision', code: 'workinjury' },
      { name: 'MotorCycle Injury', code: 'motorcycleinjury' },
      { name: 'Other', code: 'other' },

    ];
    this.referringType = [
      { name: 'Referring Provider', code: 'referring' },
      { name: 'Ordering Provider', code: 'ordering' },
      { name: 'Supervising Provider', code: 'Supervise' },

    ];

    this.LocalUseBox = [
      { name: 'Replacement', code: 'replace' },
      { name: 'Void/Cancel', code: 'cancel' },
    ];

    if (this.billsdata.computedLevelOfService) {
      this.computedLevelOfService = this.billsdata.computedLevelOfService;
      console.log("value of bills data", this.billsdata);
    }

  }

  UpdatePIP()
  {

  }

  SaveUpdateConsultation()
  {
  this.UpdatePIP();
  }

  public isCPTDAvalid() {
    console.log("isCPTAvalid",this.AssociationTable);
    let hasCPTHeader: boolean = false;
    let error: boolean = false;
    let mod1: boolean = false;
    let mod2: boolean = false;
    let mod3: boolean = false;
    let mod4: boolean = false;
  // try{
    this.AssociationTable.forEach((item) => {
      console.log("Associatio table", item)
      this.Modifiers.forEach((ele)=>{
        if(ele === item.cptCodeModifier1){
          mod1 = true;
        }
        if(ele === item.cptCodeModifier2){
          mod2 = true;
        }
        if(ele === item.cptCodeModifier3){
          mod3 = true;
        }
        if(ele === item.cptCodeModifier4){
          mod4 = true;
        }
      })
//       if (!item.assessmentDiagnosisCode1Checked && item.assessmentDiagnosisCode2Checked && item.assessmentDiagnosisCode3Checked &&
//         !item.assessmentDiagnosisCode4Checked && item.assessmentDiagnosisCode5Checked && item.assessmentDiagnosisCode6Checked &&
//         !item.assessmentDiagnosisCode7Checked && item.assessmentDiagnosisCode8Checked && item.assessmentDiagnosisCode9Checked &&
//         !item.assessmentDiagnosisCode10Checked && item.assessmentDiagnosisCode11Checked && item.assessmentDiagnosisCode12Checked) {
//         hasCPTHeader = true;
//         error = true;
//         // this.toaster.error(item.cptCode + ": Please Select atleast one Diagnosis Code");
//         // return;
//       }
//       if (item.cptCodeModifier1 !== null && item.cptCodeModifier1 !== "") {
// if(mod1){
//         if (!hasCPTHeader) {
//           hasCPTHeader = true
//           error = true
//           // this.toaster.error(item.cptCode + " : ")
//         }}
//         error = true;
//         // this.toaster.error("'"+item.cptCodeModifier1+"' is not a valid modifier. Please enter a valid Modifier.");
//       }
//       if (item.cptCodeModifier2 !== null && item.cptCodeModifier2 !== "") {
//         if(mod2){
//         if (!hasCPTHeader) {
//           hasCPTHeader = true
//           error = true;
//           this.toaster.error(item.cptCode + " : ")
//         }}
//         error = true;
//         this.toaster.error("'"+item.cptCodeModifier2+"' is not a valid modifier. Please enter a valid Modifier.");
//       }
//       if (item.cptCodeModifier3 !== null && item.cptCodeModifier3 !== "") {
//         if(mod3){
//         if (!hasCPTHeader) {
//           error = true;
//           hasCPTHeader = true
//           this.toaster.error(item.cptCode + " : ")
//         }}
//         error = true;
//         this.toaster.error("'"+item.cptCodeModifier3+"' is not a valid modifier. Please enter a valid Modifier.");
//       }
//       if (item.cptCodeModifier4 !== null && item.cptCodeModifier4 !== "") {
//         if(mod4){
//         if (!hasCPTHeader) {
//           error = true;
//           hasCPTHeader = true
//           this.toaster.error(item.cptCode + " : ")
//         }}
//         error = true;
//         this.toaster.error("'"+item.cptCodeModifier4+"' is not a valid modifier. Please enter a valid Modifier.");
//       }

      // if(item._serviceStartDate !== null && item._serviceEndDate !== null){
      //   if(item._serviceStartDate > item._serviceEndDate){
      //     error = true;
      //     hasCPTHeader = true
      //     this.toaster.error(item.cptCode + " : ")         
      //   }
      //   error = true;
      //   this.toaster.error("From Date should not be greater than to Date")
      // }

      // if(item._decimalunits){
      //   if(!hasCPTHeader){
      //     error = true;
      //     hasCPTHeader = true;
      //     this.toaster.error(item.cptCode + " : ")          
      //   }
      //   error = true;
      //   this.toaster.error("please enter units");
      // }
      // if(item._posc){
      //   if(!hasCPTHeader){
      //     error = true;
      //     hasCPTHeader = true;
      //     this.toaster.error(item.cptCode + " : ")     
      //   }
      //   error = true;
      //   this.toaster.error("Please enter Place of service")
      // } 
      // if(item._modifyUnitCharge){
      //   if(!hasCPTHeader){
      //     error = true;
      //     hasCPTHeader = true;
      //     this.toaster.error(item.cptCode + " : ")   
      //   }
      //   error = true;
      //   this.toaster.error("Please enter modify unit charge")
      // }
      console.log("item.modifiedProcedureUnitCharge", item.modifiedProcedureUnitCharge)
if(item.modifiedProcedureUnitCharge < 0 || item.modifiedProcedureUnitCharge == null)
{
console.log("Unit charge must be greater than $0", error)
error = true;
this.toaster.error("Unit charge must be greater than $0")
}
    });

  // } 
//   catch(ex){
//     error = true;
// this.toaster.error("Please select one or more diagnosis codes, units, place of service for cpt code.")
// this.index = 1
//   }
  if(this.admitDate && this.DischargeDate){
if(this.admitDate>this.DischargeDate){
console.log("Admit date cannot be greater than Discharge date.", error)
error = true;
  this.toaster.error("Admit date cannot be greater than Discharge date.")
}
  }
  if(this.ReferralStartDate && this.ReferralEndDate)
  {
if(this.ReferralStartDate>this.ReferralEndDate){
console.log("Referral start date cannot be greater than Referral Expiration date.", error)

  error = true;
  this.toaster.error("Referral start date cannot be greater than Referral Expiration date.")
}
  }
console.log("error", error)
  return error;
  }


  getAllDatas() {
    this.patientState = this.lus.getAllStates();
    let temp
    let arparam = {
      patientId: this.patientDetails.PatientId
    }
    let billparams = {
      pEncounterId: this.enouterid ? this.enouterid : 0
    }
    let cfParams = {
      patientID: this.patientDetails.PatientId
    }
    let pis = {
      pPatientId: this.patientDetails.PatientId
    }
    let artype = this.pbs.getPatientARTypeInfo(arparam);
    let facility = this.pbs.getFacilityList();
    let pos = this.pbs.getPOSByAllFacility();
    let cfpatient = this.sbs.getBillerNotes(billparams);
    let cfApp = this.pbs.getCustomFormattedInsuranceByPatientId(cfParams)
    let modo = this.sbs.getModifierCodes()
    let patinspro = this.IPS.getInsurancebyPtId(pis);
    forkJoin([artype, facility, pos, cfpatient, cfApp, modo, patinspro]).subscribe(result => {
      temp = result[0]
      if (temp) {
        this.patientDetails.PI = temp[0] ? temp[0].insuranceCompany : '';
        this.patientDetails.AR = temp[0] ? temp[0].arType : '';
      }
      this.facilitylist = result[1];
      this.POSList = result[2];
      this.BillerNotes = result[3];
      this.cfAppointment = result[4];
      this.Modifiers = result[5];
      this.PatientInsuranceProvider = result[6];
      this.usersList.forEach((item) => {
        if (item.physicianid === this.patientData.DefaultPhysician) {
          this.selectedPhysician = item;
          this.SelectedPhysicianId = item.physicianid;
          this.SelectedPhysiciansUserId = item.userid;
        }
        this.facilitylist.forEach((ele) => {
          if (item.facilityid === ele.FacilityId) {
            this.selectedfacility = ele
            this.SelectedFacilityId = ele.FacilityId
          }
        })
      })
      console.log("value of result", result);
    })
    this.getInsuranceByPatientIdandSuperBillId();
  }


  SelectFacility(event) {
    console.log("value of selected facility", event);
    this.SelectedFacilityId = event.value.FacilityId
  }

  openPrev() {
    this.index = (this.index === 0) ? 4 : this.index - 1;
  }



  handleChange(e) {
    console.log("value of event", e);
    this.index = e.index;
    //   if(!this.description){
    // this.index = 0;
    // this.toaster.error("Please add Description")
    // return;
    //   }
    //   if(!this.selectedPhysician){
    //     this.index = 0;
    //     this.toaster.error("Please Select Physician")
    //     return;
    //   }
    //   if(this.selectedCptCode){
    //     this.index = 0;
    //     this.toaster.error("Please Select One cpt Code")
    //     return;
    //   }
    // if(this.moveNext && e.index !== 0) {
    //   this.toaster.warning('please select atleast one cpt')
    //   }
    //   else if((this.selectedPhysician.FullName === undefined || this.description === '') && e.index !== 0)
    //   {
    //     this.toaster.warning('select physician and description')
    //   }
    //   else {
    //     this.indexValue = e.index;
    //     this.pTab = true;
    //     if(this.moveToNext && e.index !==1){
    //       this.toaster.warning('please select atleast one ICD')
    //     }
    //     if(this.indexValue === 2){
    //       this.getInsuranceByPatientIdandSuperBillId();
    //     }
    //   }
  }

  openNext() {
    console.log("value of index", this.index);
    if (this.index === 0) {
      this.openfirstNext();
      return;
    }
    if (this.index === 1) {
      this.openSecondNext();
      return;
    }
    if (this.index === 2) {
      this.index = this.index + 1;
      return;
    } if (this.index === 3) {
      this.index = this.index + 1;
      // this.lasttab = false
      return;
    }
    if (this.index === 4) {
      this.index = 0;
      return;
    }

    // this.index = this.index + 1;
    // this.index = (this.index === 4) ? 0 : this.index + 1;
  }

  next() {
    this.index = this.index + 1
  }
  catchdxcode(data) {
    this.DXcodevalues = data;
    console.log("value of dx code in post charges", this.DXcodevalues);
  }

  openfirstNext() {
    if (!(this.SelectedPhysicianId)) {
      this.toaster.error('Please Select a Physician');
      // this.openPrev();
      this.index = 0;
      return
    } else if (!(this.description)) {
      this.toaster.error('Please add a Description');
      // this.openPrev();
      this.index = 0;
      return;
    } else if (!(this.selectedCptCode)) {
      this.toaster.error('Please select atleast one cpt code');
      // this.openPrev();
      this.index = 0;
      return;
    }
    else {
      // this.savefirsttab();
      this.firsttab = false;
      // this.selectedCptCode.forEach((item, i) => {
      //   let objRUVValues: RVUinter = {
      //     cptCode: item.CptCode1,
      //     cptCodeDescription: item.Description,
      //     a: 'A',
      //     b: 'B',
      //     c: 'C',
      //     d: 'D',
      //     e: 'E',
      //     f: 'F',
      //     g: 'G',
      //     h: 'H',
      //     i: 'I',
      //     j: 'J',
      //     k: 'K',
      //     l: 'L',
      //   }
      //   this.RVUValues.push(objRUVValues);
      // })
      this.index = this.index + 1;
      console.log("value of index is", this.RVUValues)
    }
  }


  AssociationtableArray() {
    let dxcodeId;
    let temparray = [];
    let poin = [];
    let pointers: string;
    for (let i = 65; i < (65 + this.DXcodevalues.length); i++) {
      poin.push(String.fromCharCode(i));
    }
    pointers = poin.toString();
    pointers = pointers.replace(',', '')
    console.log("value of pointers", pointers)
    this.DXcodevalues.forEach((item) => {
      let temp = {
        Icdcode: item.Code,
        IcdDescritpion: item.ShortDescription
      }
      this.Pns.getICDcode(temp).subscribe(res => {
        console.log("value of response of geticd code is", res)
        // dxcodeId.push(res)
        if (res.length === 0) {
          item.ICD9Code = null;
        } else {
          item.ICD9Code = res[0].ICD9Code
        }
      })
    });
    console.log("value of DXcodeValues is", this.DXcodevalues);
    this.selectedCptCode.forEach((item, index) => {
      // let keycodid;
      // let len = this.DXcodevalues.length;
      // let Association:any = {};

      //   Association.cptDiagnosisAssociationId = null;
      //   Association.cptdaEncounterId = null;
      //   Association.templateGroupId = null;
      //   Association.cptCodeDescription = item.Description;
      //   Association.cptCode = item.CptCode1;
      // this.DXcodevalues.forEach((ele,i)=>{
      //   i++;
      //   keycodid   = 'assessmentDiagnosisCode' + i + 'Id'
      //   Association[keycodid] = item.ICD9Code
      // })
      // for(len++;len<=12;len++){
      //   keycodid = 'assessmentDiagnosisCode' +len+'Id';
      //   Association[keycodid] = null;
      // }
      let temp = {
        cptCode: item.CptCode1,
        cptCodeDescription: item.Description,
        cptDiagnosisAssociationId: null,
        cptdaEncounterId: null,
        templateGroupId: null,
        assessmentDiagnosisCode1Id: this.DXcodevalues[0] ? this.DXcodevalues[0].ICD9Code : null,
        assessmentDiagnosisCode2Id: this.DXcodevalues[1] ? this.DXcodevalues[1].ICD9Code : null,
        assessmentDiagnosisCode3Id: this.DXcodevalues[2] ? this.DXcodevalues[2].ICD9Code : null,
        assessmentDiagnosisCode4Id: this.DXcodevalues[3] ? this.DXcodevalues[3].ICD9Code : null,
        assessmentDiagnosisCode5Id: this.DXcodevalues[4] ? this.DXcodevalues[4].ICD9Code : null,
        assessmentDiagnosisCode6Id: this.DXcodevalues[5] ? this.DXcodevalues[5].ICD9Code : null,
        assessmentDiagnosisCode7Id: this.DXcodevalues[6] ? this.DXcodevalues[6].ICD9Code : null,
        assessmentDiagnosisCode8Id: this.DXcodevalues[7] ? this.DXcodevalues[7].ICD9Code : null,
        assessmentDiagnosisCode9Id: this.DXcodevalues[8] ? this.DXcodevalues[8].ICD9Code : null,
        assessmentDiagnosisCode10Id: this.DXcodevalues[9] ? this.DXcodevalues[9].ICD9Code : null,
        assessmentDiagnosisCode11Id: this.DXcodevalues[10] ? this.DXcodevalues[10].ICD9Code : null,
        assessmentDiagnosisCode12Id: this.DXcodevalues[11] ? this.DXcodevalues[11].ICD9Code : null,
        assessmentDiagnosisCode1: this.DXcodevalues[0] ? this.DXcodevalues[0].Code : null,
        assessmentDiagnosisCode2: this.DXcodevalues[1] ? this.DXcodevalues[1].Code : null,
        assessmentDiagnosisCode3: this.DXcodevalues[2] ? this.DXcodevalues[2].Code : null,
        assessmentDiagnosisCode4: this.DXcodevalues[3] ? this.DXcodevalues[3].Code : null,
        assessmentDiagnosisCode5: this.DXcodevalues[4] ? this.DXcodevalues[4].Code : null,
        assessmentDiagnosisCode6: this.DXcodevalues[5] ? this.DXcodevalues[5].Code : null,
        assessmentDiagnosisCode7: this.DXcodevalues[6] ? this.DXcodevalues[6].Code : null,
        assessmentDiagnosisCode8: this.DXcodevalues[7] ? this.DXcodevalues[7].Code : null,
        assessmentDiagnosisCode9: this.DXcodevalues[8] ? this.DXcodevalues[8].Code : null,
        assessmentDiagnosisCode10: this.DXcodevalues[9] ? this.DXcodevalues[9].Code : null,
        assessmentDiagnosisCode11: this.DXcodevalues[10] ? this.DXcodevalues[10].Code : null,
        assessmentDiagnosisCode12: this.DXcodevalues[11] ? this.DXcodevalues[11].Code : null,
        assessmentDiagnosisCode1Visibility: this.DXcodevalues[0] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode2Visibility: this.DXcodevalues[1] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode3Visibility: this.DXcodevalues[2] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode4Visibility: this.DXcodevalues[3] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode5Visibility: this.DXcodevalues[4] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode6Visibility: this.DXcodevalues[5] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode7Visibility: this.DXcodevalues[6] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode8Visibility: this.DXcodevalues[7] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode9Visibility: this.DXcodevalues[8] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode10Visibility: this.DXcodevalues[9] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode11Visibility: this.DXcodevalues[10] ? "Visible" : "Collapsed",
        assessmentDiagnosisCode12Visibility: this.DXcodevalues[11] ? "Visible" : "Collapsed",
        assessmentDiagnosisCodeIcd101: null,
        assessmentDiagnosisCodeIcd102: null,
        assessmentDagnosisCodeIcd103: null,
        assessmentDiagnosisCodeIcd104: null,
        assessmentDiagnosisCodeIcd105: null,
        assessmentDiagnosisCodeIcd106: null,
        assessmentDiagnosisCodeIcd107: null,
        assessmentDiagnosisCodeIcd108: null,
        assessmentDiagnosisCodeIcd109: null,
        assessmentDiagnosisCodeIcd1010: null,
        assessmentDiagnosisCodeIcd1011: null,
        assessmentDiagnosisCodeIcd1012: null,
        assessmentDiagnosisCode1Checked: this.DXcodevalues[0] ? true : false,
        assessmentDiagnosisCode2Checked: this.DXcodevalues[1] ? true : false,
        assessmentDiagnosisCode3Checked: this.DXcodevalues[2] ? true : false,
        assessmentDiagnosisCode4Checked: this.DXcodevalues[3] ? true : false,
        assessmentDiagnosisCode5Checked: this.DXcodevalues[4] ? true : false,
        assessmentDiagnosisCode6Checked: this.DXcodevalues[5] ? true : false,
        assessmentDiagnosisCode7Checked: this.DXcodevalues[6] ? true : false,
        assessmentDiagnosisCode8Checked: this.DXcodevalues[7] ? true : false,
        assessmentDiagnosisCode9Checked: this.DXcodevalues[8] ? true : false,
        assessmentDiagnosisCode10Checked: this.DXcodevalues[9] ? true : false,
        assessmentDiagnosisCode11Checked: this.DXcodevalues[10] ? true : false,
        assessmentDiagnosisCode12Checked: this.DXcodevalues[11] ? true : false,
        assessmentDiagnosisCodeDescription1: this.DXcodevalues[0] ? this.DXcodevalues[0].ShortDescription : null,
        assessmentDiagnosisCodeDescription2: this.DXcodevalues[1] ? this.DXcodevalues[1].ShortDescription : null,
        assessmentDiagnosisCodeDescription3: this.DXcodevalues[2] ? this.DXcodevalues[2].ShortDescription : null,
        assessmentDiagnosisCodeDescription4: this.DXcodevalues[3] ? this.DXcodevalues[3].ShortDescription : null,
        assessmentDiagnosisCodeDescription5: this.DXcodevalues[4] ? this.DXcodevalues[4].ShortDescription : null,
        assessmentDiagnosisCodeDescription6: this.DXcodevalues[5] ? this.DXcodevalues[5].ShortDescription : null,
        assessmentDiagnosisCodeDescription7: this.DXcodevalues[6] ? this.DXcodevalues[6].ShortDescription : null,
        assessmentDiagnosisCodeDescription8: this.DXcodevalues[7] ? this.DXcodevalues[7].ShortDescription : null,
        assessmentDiagnosiscodeDescription9: this.DXcodevalues[8] ? this.DXcodevalues[8].ShortDescription : null,
        assessmentDiagnosisCodeDescription10: this.DXcodevalues[9] ? this.DXcodevalues[9].ShortDescription : null,
        assessmentDiagnosisCodeDescription11: this.DXcodevalues[10] ? this.DXcodevalues[10].ShortDescription : null,
        assessmentDiagnosisCodeDescription12: this.DXcodevalues[11] ? this.DXcodevalues[11].ShortDescription : null,
        billersNote: null,
        billersNoteId: null,
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        e: "E",
        f: "F",
        g: "G",
        h: "H",
        i: "I",
        j: "J",
        k: "K",
        l: "L",
        pointers: pointers.toString(),
        controlsLoaded: null,
        isEditable: null,
        isCptResendToClaimVisibility: null,
        isCptResendToClaim: null,
        cptCodeModifier1: null,
        cptCodeModifier2: null,
        cptCodeModifier3: null,
        cptCodeModifier4: null,
        _decimalunits: 1,
        _units: "1",
        _posc: 11,
        _pastUnits: null,
        _pastPOSC: null,
        consultationCreatedDate: new Date(),
        _serviceStartDate: new Date(),
        _serviceEndDate: new Date(),
        _insurancePriorAuthorizationNumber: null,
        _modifyUnitCharge: false,
        procedureUnitCharge: null,
        modifiedProcedureUnitCharge: null,
        rvuValue: null,
        currentDate: new Date(),
        isCptDeleted: "collapsed",
        isEncounterCptDeleted: null,
        isCptLevelOfService: false
      }
      console.log("value of rvu values is", temp);
      // this.AssociationTable.push(temp)
      temparray.push(temp)
    })
    console.log("value of association table is", this.AssociationTable)
    let rvuvalues = {
      // ieCptda: this.AssociationTable,
      patientId: this.patientDetails.PatientId,
      selfPayAppt: false
    }
    this.pbs.GetRvuvalues(temparray, rvuvalues).subscribe(respon => {
      this.AssociationTable = respon
      console.log("value of rvuvalues response is", this.AssociationTable)
      for (let i = 0; i < this.AssociationTable.length; i++){
        this.AssociationTable[i]._serviceEndDate = new Date(this.AssociationTable[i]._serviceEndDate)
        this.AssociationTable[i]._serviceStartDate = new Date(this.AssociationTable[i]._serviceStartDate)
      }
      console.log("value of rvuvalues response is", this.AssociationTable)
    })
  }

  StatusChange(rowdata) {
    console.log("value of row data is", rowdata);
    rowdata._posc = rowdata._posc.Code
    this.AssociationTable.forEach((item) => {
      if (item.cptCode = rowdata.cptCode) {
        item = rowdata
      }
    })
    console.log("value of array and object is", this.AssociationTable, rowdata)
  }


  openSecondNext() {
    if (this.DXcodevalues) {
      this.secondtab = false;
      this.AssociationtableArray()
      this.index = this.index + 1;
      this.lasttab = false
    } else {
      this.toaster.error("please select atleast one ICD code ")
      this.index = 1;
    }

  }
  getInsuranceByPatientIdandSuperBillId() {
    let cfiparam = {
      patientID: this.patientDetails.PatientId ? this.patientDetails.PatientId : 0,
      superBillId: 0,
    }
    this.pbs.getCustomFormattedInsuranceByPatientId(cfiparam).subscribe(res => {
      this.InsuranceList = res
    })
  }


  recallChild(data) {
    this.selectedCptCode = data;
    console.log("value of child event", this.selectedCptCode);
    // this.selectedCptCode = data.cptCode
    // console.log("selectedcpt:", this.selectedCptCode)
  }

  recallingChild(data) {
    console.log("value of child event", data);
    this.moveToNext = data.bool;
    this.selectedIcdCode = data.selectedICD
    console.log("selectedIcd:", this.selectedIcdCode)
  }

  SelectedPhysicianChange(data) {
    this.selectedPhysician = data;
    this.SelectedPhysicianId = data.physicianid;
    this.SelectedPhysiciansUserId = data.userid;
    console.log("value of selected physician in parent data is", this.selectedPhysician, this.SelectedPhysicianId, this.SelectedPhysiciansUserId)
  }
  ButtonsPressed(data) {
    console.log("value of button pressed", data)
    switch (data) {
      case "save": console.log("save value is clicked")
        break;
      case "next": this.openNext();
        break;
      case "previous": this.openPrev();
        break;
      case "close": console.log("close button is clicked")
        break;
    }
  }


  saveData() {
    // switch (this.index) {
    //   case 0:
        // console.log("value of mindata entered is",this.IsMinDataEntered());
        // if (this.IsMinDataEntered() && ((icdWidget.mrDxCollectionCustomObjects.Count() > 0 && cptWidget.mrDxCPTCollection.Count() > 0) ? IsCPTDAValid() : true))
        if (!(this.SelectedPhysicianId)) {
          this.toaster.error('Please Select a Physician');
          return
        } else if (!(this.description)) {
          this.toaster.error('Please add a Description');
          return;
        } else if (!(this.selectedCptCode)) {
          this.toaster.error('Please select atleast one cpt code');
          return;
        }
        else {
          // this.savefirsttab();
          this.CreateNewAppointment();
        }
        // break;
      // default: console.log("entered default condititon");
      //   break;
    // }
  }

  CreateNewAppointment(post?) {
    //   // this.isLoader = true
    let chiefTemplateSectionId;
    let chiefFormFieldId;
    let planTemplateSectionId;
    let planFormFieldId;
    // calling get api's first
    // let visitParam = {
    //   visitdate: moment(new Date).format("YYYY-MM-DD"),
    //   facilityid: this.SelectedFacilityId,
    //   patientId: this.patientData.PatientId,
    // }
    // console.log("value of visit date oaram is id is",visitParam)
    // this.apptService.getAllVisits(visitParam).subscribe(res=>{
    //   console.log("value of get all visits is",res)
    // })

    // return;
    // // first create this object
    this.TemplateSections.forEach((item) => {
      if ((item.SectionHeading === "Chief Complaint") && (item.SectionIdentifier === "Chief Complaint")) {
        item.MrFormFields.forEach((ele) => {
          if (ele.Label === "Chief Complaint") {
            chiefTemplateSectionId = ele.MrTemplateSectionId;
            chiefFormFieldId = ele.MrFormFieldId
          }
        })
      }
      if ((item.SectionHeading === "Procedure Codes") && (item.SectionIdentifier === "Plan/Procedures")) {
        item.MrFormFields.forEach((elem) => {
          if (elem.DataType === "CPT4") {
            planTemplateSectionId = elem.MrTemplateSectionId;
            planFormFieldId = elem.MrFormFieldId;
          }
        })
      }
    })
    this.visit = {
      PatientId: this.patientData.PatientId,
      FacilityId: this.selectedfacility ? this.selectedfacility.FacilityId : null,
      VisitDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CoPayAmount: null,
      PaymentMethod: null,
      CheckNumber: null,
      InsuranceVerificationDone: false,
      CreditCardVerificationDone: false,
      Comments: null,
      Billed: null,
      DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CreatedByUserId: this.userdata.UserId,
      DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      LastUpdatedByUserId: this.userdata.UserId,
      Appointments: [
        {
          VisitId: 0,
          PatientId: this.patientData.PatientId,
          AllowedVisits: null,
          AppointmentStatus: "Completed_NoVisit",
          AppointmentReasonId: 1,
          AppointmentTypeId: 1,
          CancelledByUserId: null,
          CancelledStatus: null,
          CheckInTime: null,
          CheckNumber: null,
          Comments: "Appointment created automatically when saving patient chart.",
          Confirmed: null,
          ConfirmedByUserId: null,
          ConfirmedStatus: null,
          CoInsurancePatientAmount: null,
          CoInsurancePatientPercentage: null,
          CoPayAmount: null,
          SendReminder: false,
          ReminderDate: null,
          SmsReminderSent: null,
          EmailReminderSent: null,
          PhoneReminderMade: null,
          PhoneReminderByUserId: null,
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.userdata.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.userdata.UserId,
          ExceptionAppointments: null,
          PaymentMethod: null,
          InsuranceCopayRequired: null,
          IsCopayPercentage: null,
          DateConfirmed: null,
          DateCancelled: null,
          ReferringPhysicianId: null,
          InternalReferringPhysicianId: null,
          IsSpecialistVisit: 0,
          FlagSelfPayPatient: 0,
          Deductible: null,
          IsWalkIn: false,
          InsuranceCoInsuranceRequired: null,
          InsuranceDeductibleRequired: null,
          PriorAuthorizationNumber: null,
          VisitsUsed: null,
          ReferralStartDate: null,
          ReferralExpiryDate: null,
          ExternalReferenceId: null,
          DoNotBillAppointment: null,
          CaseNumber: null,
          RoomId: null,
        }],
    }
    console.log(this.visit)
    //   // pass the visit object here
    this.apptService.AddVisitAppointment(this.visit).subscribe(resp => {
      console.log("value of response", resp)
      //     // store the response in apptid
      this.visitAppointment = resp
      this.ApptID = resp.Value.AppointmentId;
      this.visitid = resp.Value.VisitId;
      console.log("POST Appt:", this.ApptID)
      //     // once the response arrive create calendardate object
      this.calendarDate = {
        ScheduledDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
        PhysicianId: this.SelectedPhysicianId,
        ResourceId: null,
        RoomId: null,
        DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        CreatedByUserId: this.userdata.UserId,
        DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        LastUpdatedByUserId: this.userdata.UserId,
        UserId: this.SelectedPhysiciansUserId,
        ScheduledSlots: [
          {
            AppointmentId: this.ApptID,
            // add calender error
            EventDescription: null,
            StartTime: moment(new Date()).format("YYYY-MM-DD") + " " + moment(new Date()).format("HH:mm"),
            EndTime: moment(new Date()).format("YYYY-MM-DD") + " " + moment(new Date()).format("HH:mm"),
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.userdata.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.userdata.UserId,
            PhysicianId: this.SelectedPhysicianId,
            UserId: this.SelectedPhysiciansUserId,
          }
        ]
      }
      console.log("value of calender date is", this.calendarDate)

      let AddpatientEncounter = {
        PatientId: this.patientData.PatientId,
        VisitId: this.visitid,
        ChiefComplaintId: null,
        ChiefComplaint: this.description,
        AdditionalText: null,
        EncounterIndicatorId: null,
        Billed: null,
        PhysicianId: this.SelectedPhysicianId,
        FacilityId: this.SelectedFacilityId,
        TimeSpentOnConsultation: null,
        PhysicianInitials: null,
        DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        CreatedByUserId: this.userdata.UserId,
        DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        LastUpdatedByUserId: this.userdata.UserId,
        AppointmentId: this.ApptID,
        SummaryDocument: null,
        MedicationReconciliationPerformed: null,
        DateOfMedicationReconciliation: null,
        MedicationNotPrescribed: null,
        SpecialityId: null,
        MrTemplateId: null,
        DepartmentId: null,
        CodeBasedOnTimeSpent: null,
        PresentingProblemRiskLevelId: null,
        DiagnosticProcedureOrderedRiskLevelId: null,
        ManagementOptionsSelectedRiskLevelId: null,
        LevelOfServiceCptCode: null,
        SkipLevelOfService: null,
        IsClinicalSummaryGivenToPatient: null,
        IsOfficeVisit: null,
        MrTemplateGroupId: this.getPractice.PostChargesDefaultBillingTemplateGroupId,
        ConsultationDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
        IsCompleted: false,
        CompletedBy: null,
        DateCompleted: null,
        Active: null,
      }
      console.log("value of patient encounter", AddpatientEncounter)
      this.ps.postPatientEncounter(AddpatientEncounter).subscribe(res => {
        console.log("value of patient encounter", res)
        this.Encounter = res;
        this.EncounterId = res.MrPatientEncounterId
        this.departmentId = res.DepartmentId
        if(post = 'postbill'){
          this.postToBilling()
        }
        let chiefComplaint = {
          MrPatientEncounterId: this.EncounterId, // first add patient encounter will fire once we get the result of that api we can assign encounter  to this field
          PatientId: this.patientData.PatientId,
          EnteredData: this.description,
          MrTemplateSectionId: chiefTemplateSectionId,
          MrFormFieldId: chiefFormFieldId,
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.userdata.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.userdata.UserId,
          MrTemplateChiefComplaintId: null,
          Active: null,
        }
        console.log("value of chiefcomplaitn is", chiefComplaint)
        this.ps.postChiefComplaintment(chiefComplaint).subscribe(res => {
          console.log("value of chief complaintment response is", res)
        })


        this.selectedCptCode.forEach((item) => {


          let Planprocedures = {
            PatientId: this.patientData.PatientId,
            MrPatientEncounterId: this.EncounterId, // first add patient encounter will fire once we get the result of that api we can assign encounter  to this field
            MrPlanProcedureTemplateId: null,
            MrPlanProcedureSectionId: null,
            SelectedCptCode: item.CptCode1,// what we select on those cpt codes
            HcpcsCode: null,
            Modifier1Code: item.Modifier1,
            Modifier2Code: item.Modifier2,
            Modifier3Code: item.Modifier3,
            Modifier4Code: item.Modifier4,
            Unit: 1,
            AdditionalComments: null,
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.userdata.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.userdata.UserId,
            MrTemplateSectionId: planTemplateSectionId,
            MrFormFieldId: planFormFieldId,
            EnteredData: item.CptCode1, // what we select on those cpt codes
            Active: null,
          }

          this.ps.postPlan(Planprocedures).subscribe(respo => {
            console.log("value of responce", respo)
          })
        })
        let ICDParams = {
          encounterId: this.EncounterId
        }
        this.ps.GetSelectedIcdCodes(ICDParams).subscribe(rep => {
          console.log("value of setselectedicdcodes are", rep)
        })
        let billingparams = {
          encounterId: this.EncounterId,
          userId: this.userdata.UserId,
        }

        this.ps.AddorGetBillingSections(billingparams).subscribe(bill => {
          console.log("value of addorgetbiling sections is", bill)

          let Additionalbillingdetails = {
            SuperBillId: null,
            AppointmentId: this.ApptID ? this.ApptID : null,
            MrPatientEncounterId: this.EncounterId,
            SymptomDate: this.symptomDate ? this.symptomDate :  null,
            SymptomType: this.selectedSType ? this.selectedSType.code : null,
            SymptomTypeText: null,
            InitialTreatmentDate: null,
            OtherTreatmentDate: this.OtherTreatmentDate? this.OtherTreatmentDate : null,
            TreatmentType: this.selectedTreatment ? this.selectedTreatment.code : null,
            LastXrayDate: this.LastXrayDate ? this.LastXrayDate :  null,
            AccidentType:this.selectedAccidentType ? this.selectedAccidentType.code : null,
            AccidentDate: this.AccidentDate ? this.AccidentDate : null,
            UnableToWorkFromDate: this.UnableToWorkFromDate ? this.UnableToWorkFromDate : null,
            UnableToWorkFromTo: this.UnableToWorkTo ? this.UnableToWorkTo : null,
            AccidentState:this.selectedPatientState ? this.selectedPatientState.code : null,
            NatureOfAccident:this.selectedNature ? this.selectedNature.code : null,
            AccidentQualifier: this.accidentQualifier ? this.accidentQualifier : null,
            HospitalizationFromDate: this.hospitalizationFrom ? this.hospitalizationFrom : null,
            HospitalizationFromTo: this.hospitalizationTo ? this.hospitalizationTo : null,
            Condition1:this.claimCondition1 ? this.claimCondition1 : null,
            Condition2: this.claimCondition2 ? this.claimCondition2 : null,
            Condition3: this.claimCondition3 ? this.claimCondition3 : null,
            Condition4: this.claimCondition4 ? this.claimCondition4 : null,
            Condition5: this.claimCondition5 ? this.claimCondition5 : null,
            ReferringTypeBox17: this.selectedReferringType ? this.selectedReferringType.code : null,
            LocalUseBox23:this.box23 ? this.box23 : null,
            LocalUseBox19:this.box19 ? this.box19 : null,
            OutsideLab: this.outsideLab ? this.outsideLab : false,
            OutsideLabCharge: this.labCharge ? this.labCharge : null,
            LocalUseBox22Ddl:this.selectedLocalUse ? this.selectedLocalUse.code : null,
            LocalUseBox22Text:this.LocalUseBox22Text ? this.LocalUseBox22Text : null,
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.userdata.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.userdata.UserId,
          }

          this.ps.AddBillDet(Additionalbillingdetails).subscribe(add => {
            console.log("value of additional billing details is", add)
          })
        })


        let emittingdata = {
          EncounterId: this.EncounterId,
          AppointmentId: this.ApptID,
        }
        this.SavedData.emit(emittingdata);
      });
      //     // pass the calendar date object into AddCalendarDateAndScheduleSlot api here it will end
      this.apptService.AddCalendarDateAndScheduleSlot(this.calendarDate).subscribe(resp => {
        console.log("value of show success", resp);
        //       // ApptID = resp
        //       // this.loadEvent.emit(true)
        // this.showSuccess("Appointment Added Successfully")
        //       this.activeModal.dismiss('Cross click')
        //       // console.log("POST Slot:", ApptID)
      })

      //     isSuccess = true
    })









    //   if (isSuccess) {
    //     console.log("successfull")
    //     // this.loadEvent.emit(true)

    //   }
    //   // this.isLoader = false
  }

  IsMinDataEntered() {
    this.isValid = true;
    if (this.description) { } else { this.toaster.error("Please enter chief complaint."); this.isValid = false }
    if (this.DOS) { } else { this.toaster.error("Please enter chief complaint."); this.isValid = false; }
    if (this.selectedPhysician) { } else { this.toaster.error("Please select physician."); this.isValid = false; }
    if (this.selectedfacility) { } else { this.toaster.error("Please select Facility."); this.isValid = false; }

    return this.isValid;
  }

  CheckCPTTableData() {
    let params = {
      cptcode: this.ServiceCptCode
    }
    this.pbs.getCptCode(params).subscribe(resp => {
      console.log("value of getcptcode respnse", resp)
      if (resp) {
        this.computedLevelOfService = resp[0].CptCode1;
        let poin = [];
        let pointers: string;
        for (let i = 65; i < (65 + this.DXcodevalues.length); i++) {
          poin.push(String.fromCharCode(i));
        }
        pointers = poin.toString();
        pointers = pointers.replace(',', '')
        let temp = {
          cptCode: resp[0].CptCode1,
          cptCodeDescription: resp[0].Description,
          cptDiagnosisAssociationId: null,
          cptdaEncounterId: null,
          templateGroupId: null,
          assessmentDiagnosisCode1Id: this.DXcodevalues[0] ? this.DXcodevalues[0].ICD9Code : null,
          assessmentDiagnosisCode2Id: this.DXcodevalues[1] ? this.DXcodevalues[1].ICD9Code : null,
          assessmentDiagnosisCode3Id: this.DXcodevalues[2] ? this.DXcodevalues[2].ICD9Code : null,
          assessmentDiagnosisCode4Id: this.DXcodevalues[3] ? this.DXcodevalues[3].ICD9Code : null,
          assessmentDiagnosisCode5Id: this.DXcodevalues[4] ? this.DXcodevalues[4].ICD9Code : null,
          assessmentDiagnosisCode6Id: this.DXcodevalues[5] ? this.DXcodevalues[5].ICD9Code : null,
          assessmentDiagnosisCode7Id: this.DXcodevalues[6] ? this.DXcodevalues[6].ICD9Code : null,
          assessmentDiagnosisCode8Id: this.DXcodevalues[7] ? this.DXcodevalues[7].ICD9Code : null,
          assessmentDiagnosisCode9Id: this.DXcodevalues[8] ? this.DXcodevalues[8].ICD9Code : null,
          assessmentDiagnosisCode10Id: this.DXcodevalues[9] ? this.DXcodevalues[9].ICD9Code : null,
          assessmentDiagnosisCode11Id: this.DXcodevalues[10] ? this.DXcodevalues[10].ICD9Code : null,
          assessmentDiagnosisCode12Id: this.DXcodevalues[11] ? this.DXcodevalues[11].ICD9Code : null,
          assessmentDiagnosisCode1: this.DXcodevalues[0] ? this.DXcodevalues[0].Code : null,
          assessmentDiagnosisCode2: this.DXcodevalues[1] ? this.DXcodevalues[1].Code : null,
          assessmentDiagnosisCode3: this.DXcodevalues[2] ? this.DXcodevalues[2].Code : null,
          assessmentDiagnosisCode4: this.DXcodevalues[3] ? this.DXcodevalues[3].Code : null,
          assessmentDiagnosisCode5: this.DXcodevalues[4] ? this.DXcodevalues[4].Code : null,
          assessmentDiagnosisCode6: this.DXcodevalues[5] ? this.DXcodevalues[5].Code : null,
          assessmentDiagnosisCode7: this.DXcodevalues[6] ? this.DXcodevalues[6].Code : null,
          assessmentDiagnosisCode8: this.DXcodevalues[7] ? this.DXcodevalues[7].Code : null,
          assessmentDiagnosisCode9: this.DXcodevalues[8] ? this.DXcodevalues[8].Code : null,
          assessmentDiagnosisCode10: this.DXcodevalues[9] ? this.DXcodevalues[9].Code : null,
          assessmentDiagnosisCode11: this.DXcodevalues[10] ? this.DXcodevalues[10].Code : null,
          assessmentDiagnosisCode12: this.DXcodevalues[11] ? this.DXcodevalues[11].Code : null,
          assessmentDiagnosisCode1Visibility: this.DXcodevalues[0] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode2Visibility: this.DXcodevalues[1] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode3Visibility: this.DXcodevalues[2] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode4Visibility: this.DXcodevalues[3] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode5Visibility: this.DXcodevalues[4] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode6Visibility: this.DXcodevalues[5] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode7Visibility: this.DXcodevalues[6] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode8Visibility: this.DXcodevalues[7] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode9Visibility: this.DXcodevalues[8] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode10Visibility: this.DXcodevalues[9] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode11Visibility: this.DXcodevalues[10] ? "Visible" : "Collapsed",
          assessmentDiagnosisCode12Visibility: this.DXcodevalues[11] ? "Visible" : "Collapsed",
          assessmentDiagnosisCodeIcd101: null,
          assessmentDiagnosisCodeIcd102: null,
          assessmentDagnosisCodeIcd103: null,
          assessmentDiagnosisCodeIcd104: null,
          assessmentDiagnosisCodeIcd105: null,
          assessmentDiagnosisCodeIcd106: null,
          assessmentDiagnosisCodeIcd107: null,
          assessmentDiagnosisCodeIcd108: null,
          assessmentDiagnosisCodeIcd109: null,
          assessmentDiagnosisCodeIcd1010: null,
          assessmentDiagnosisCodeIcd1011: null,
          assessmentDiagnosisCodeIcd1012: null,
          assessmentDiagnosisCode1Checked: this.DXcodevalues[0] ? true : false,
          assessmentDiagnosisCode2Checked: this.DXcodevalues[1] ? true : false,
          assessmentDiagnosisCode3Checked: this.DXcodevalues[2] ? true : false,
          assessmentDiagnosisCode4Checked: this.DXcodevalues[3] ? true : false,
          assessmentDiagnosisCode5Checked: this.DXcodevalues[4] ? true : false,
          assessmentDiagnosisCode6Checked: this.DXcodevalues[5] ? true : false,
          assessmentDiagnosisCode7Checked: this.DXcodevalues[6] ? true : false,
          assessmentDiagnosisCode8Checked: this.DXcodevalues[7] ? true : false,
          assessmentDiagnosisCode9Checked: this.DXcodevalues[8] ? true : false,
          assessmentDiagnosisCode10Checked: this.DXcodevalues[9] ? true : false,
          assessmentDiagnosisCode11Checked: this.DXcodevalues[10] ? true : false,
          assessmentDiagnosisCode12Checked: this.DXcodevalues[11] ? true : false,
          assessmentDiagnosisCodeDescription1: this.DXcodevalues[0] ? this.DXcodevalues[0].ShortDescription : null,
          assessmentDiagnosisCodeDescription2: this.DXcodevalues[1] ? this.DXcodevalues[1].ShortDescription : null,
          assessmentDiagnosisCodeDescription3: this.DXcodevalues[2] ? this.DXcodevalues[2].ShortDescription : null,
          assessmentDiagnosisCodeDescription4: this.DXcodevalues[3] ? this.DXcodevalues[3].ShortDescription : null,
          assessmentDiagnosisCodeDescription5: this.DXcodevalues[4] ? this.DXcodevalues[4].ShortDescription : null,
          assessmentDiagnosisCodeDescription6: this.DXcodevalues[5] ? this.DXcodevalues[5].ShortDescription : null,
          assessmentDiagnosisCodeDescription7: this.DXcodevalues[6] ? this.DXcodevalues[6].ShortDescription : null,
          assessmentDiagnosisCodeDescription8: this.DXcodevalues[7] ? this.DXcodevalues[7].ShortDescription : null,
          assessmentDiagnosiscodeDescription9: this.DXcodevalues[8] ? this.DXcodevalues[8].ShortDescription : null,
          assessmentDiagnosisCodeDescription10: this.DXcodevalues[9] ? this.DXcodevalues[9].ShortDescription : null,
          assessmentDiagnosisCodeDescription11: this.DXcodevalues[10] ? this.DXcodevalues[10].ShortDescription : null,
          assessmentDiagnosisCodeDescription12: this.DXcodevalues[11] ? this.DXcodevalues[11].ShortDescription : null,
          billersNote: null,
          billersNoteId: null,
          a: "A",
          b: "B",
          c: "C",
          d: "D",
          e: "E",
          f: "F",
          g: "G",
          h: "H",
          i: "I",
          j: "J",
          k: "K",
          l: "L",
          pointers: pointers.toString(),
          controlsLoaded: null,
          isEditable: null,
          isCptResendToClaimVisibility: null,
          isCptResendToClaim: null,
          cptCodeModifier1: null,
          cptCodeModifier2: null,
          cptCodeModifier3: null,
          cptCodeModifier4: null,
          _decimalunits: 1,
          _units: "1",
          _posc: 11,
          _pastUnits: null,
          _pastPOSC: null,
          consultationCreatedDate: new Date(),
          _serviceStartDate: new Date(),
          _serviceEndDate: new Date(),
          _insurancePriorAuthorizationNumber: null,
          _modifyUnitCharge: false,
          procedureUnitCharge: null,
          modifiedProcedureUnitCharge: null,
          rvuValue: null,
          currentDate: new Date(),
          isCptDeleted: "collapsed",
          isEncounterCptDeleted: null,
          isCptLevelOfService: false
        }


        // this.getRVU.cptDiagnosisAssociationId = null;
        // this.getRVU.cptCodeDescription = resp[0].Description;
        // this.getRVU.cptCode = this.computedLevelOfService;
        // this.getRVU._serviceStartDate = this.DOS
        // this.getRVU._serviceEndDate = this.DOS
        // this.getRVU.currentDate = (moment(new Date()).format("YYYY-MM-DD HH:mm"));
        // if (this.billsdata) {
        //   this.getRVU._posc = this.billsdata.placeOfServiceCode;
        // }
        // this.getRVU._units = "1";
        // this.getRVU._decimalunits = 1;
        // this.getRVU.isCptLevelOfService = true;
        // this.getRVU.isCptDeleted = "Visible";
        // this.getRVU._insurancePriorAuthorizationNumber = this.selectedCptCode[0]._insurancePriorAuthorizationNumber;
        this.AssociationTable.push(temp);
        let Rvuparams = {
          // ieCptda: this.AssociationTable,
          patientId: this.patientData.PatientId,
          selfPayAppt: this.billsdata ? this.billsdata.flagSelfPay : false
        }

        console.log("value of get rvu params is", Rvuparams)
        this.pbs.GetRvuvalues(this.AssociationTable, Rvuparams).subscribe(res => {
          this.AssociationTable = res
          console.log("res association", res)
          for (let i = 0; i < this.AssociationTable.length; i++){
            this.AssociationTable[i]._serviceEndDate = new Date(this.AssociationTable[i]._serviceEndDate)
            this.AssociationTable[i]._serviceStartDate = new Date(this.AssociationTable[i]._serviceStartDate)
          }
          // this.AssociationTable.forEach((item) => {
          //   item._serviceEndDate = new Date(item._serviceEndDate)
          //   item._serviceStartDate = new Date(item._serviceStartDate)
          // })
          console.log("value of rvu response is", res)
        })
      }
    })
  }

  addPointers(vaue, rowData) {
    console.log("value of vaue", vaue, rowData)
  }

  UpdateAssociation() {
    // if (this.ServiceCptCode) { } else { this.toaster.error("Please Enter the Level of service code"); return; }
    if (this.ServiceCptCode == this.computedLevelOfService) { return; }
    this.CheckCPTTableData()
  }

  CheckAndAddAppointment()
  {
    console.log("value of check and appointment")
  }
  approve(){
    console.log('clicked')
      if(!this.isCPTDAvalid()){
    console.log('entered')
    if(this.cfAppointment){
      console.log("condition 1")
      this.CreateNewAppointment()
  // this.SaveUpdateConsultation();
} else {
  console.log("condition 2")
  // this.CheckAndAddAppointment();
}
      }
    
  }
  copyCpt(rowData){
    console.log("row data", rowData)
    this.AssociationTable.push(rowData)
  }
  postToBilling(){
// this.CreateNewAppointment();
    let param = {encounterId: this.EncounterId,
      patientId: this.patientDetails.PatientId,
      encounterCreationDate:this.Encounter.DateCreated,
      appointmentId: this.ApptID,
      visitId: this.visitid,
      facilityId: this.SelectedFacilityId,
      departmentId: this.departmentId ? this.departmentId : null,
      userId: this.SelectedPhysiciansUserId,
      physicianId: this.SelectedPhysicianId,
      admitDate: this.admitDate,
      dischargeDate: this.DischargeDate,
      pId: this.primaryClaim,
    sId: this.secondaryClaim,
  tId: this.tertiaryClaim,
pAA: this.primaryAccept,
sAA: this.secondaryAccept,
tAA: this.tertiaryAccept}
    this.pbs.SavePostBilling(param).subscribe(
      result => {console.log("post result", result)
    this.toaster.success("Posted successfully");
    this.loadEvent.emit(true)
    this.activeModal.close()
  }
    )
  }

}
