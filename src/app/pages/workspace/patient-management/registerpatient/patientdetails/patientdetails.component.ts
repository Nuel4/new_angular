import { Component, OnInit, EventEmitter, Output, ViewEncapsulation,ElementRef, ViewChild, ViewChildren, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { AuthenticationStore } from '../../../../../authentication'
import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms'
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { FileUploadModule } from 'primeng/fileupload';
import { forkJoin } from "rxjs";
import { fileupload, Form, FileUploadType } from '../../../../../model';
import { PatientmanagementService } from '../../../../../services/workspace/patient-management.service';
import { PatientDto } from './patientDetailForm.model';
import { LookupService } from '../../../../../services/lookup.service';
// import { ChargeslipsComponent } from '../../../../../chargeslips/chargeslips.component';
import * as jsPDF from 'jspdf'

class ImageSnippet {
  constructor(public src: string, public file: File,
    
    ) { }
}

const pattern = /^[a-zA-Z ]{2,30}$/;

@Component({
  selector: 'app-patientdetails',
  templateUrl: './patientdetails.component.html',
  styleUrls: ['./patientdetails.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientdetailsComponent implements OnInit {
  dateTime = new Date();
  showprtandchrge;
  public imagePath;
  imgURL: any;
  public message: string;
  uploadedFiles: any[] = [];
  selectedFile: ImageSnippet;
  patientData
  patientIdToEdit
  @Input() patientSalutation;
  base64Image: string;
  @Input()
  set _patientIdToEdit(val: any){
    this.patientIdToEdit = val;
  }

  get _patientIdToEdit(): any {
    return this.patientIdToEdit;
  }


  @Input()
  set _showprtandchrge(val: any){
    this.showprtandchrge = val;
  }

  get _showprtandchrge(): any {
    return this.showprtandchrge;
  }
  @Input() patientLanguage: any
  @Input() 
  set _patientDetailsData(val: number){
    this.patientData = val;
  }

  get _patientDetailsData(): number {
    return this.patientData;
  }
  
  @Output() childEvent = new EventEmitter();

  @Output() next = new EventEmitter();
@Output() crgslip = new EventEmitter()
  @Output() modalEvent = new EventEmitter();
Modalname = "Pd"
  public componentName = "Patient Details";
  public patientDetailsForm: FormGroup;
  public file: any;
  selectedimgFile: File;
  value: any;
  currentDate: any;
  newDate: any;
  ageValue: any;
  temp: any;
  displayGuantWindow: any;
  patientStatus: any = [];
  patientState: any = [];
  patientEthnicity: any = [];
  patientRace: any = [];
  referringOrganization: any = [];
  referringPhysician: any = [];
  defaultPhy: any = [];
  defaultFacility: any = [];
  organzationId = 0
  facilityId = 0
  guarantorRelationship: any = [];
  private formSumitAttempt: boolean = false;
  patientDetailsFormDatas: any;
  patientDetail: PatientDto;
  sensitivity: { label: string; value: number; }[];
  DOBV: boolean = false;
  selfpay: boolean = false;
  filteredCountriesSingle: any[];
  countries: any[];
 loadAPi: boolean = false;
  selectedFacilityList: any = [];
  selectedFacility: any;
  public usrFacId;
  public usersList: any = [];
  public Sun: boolean = true;
  public weekdrop: Boolean = true;
  public Params: any;
  public PhysicianId;
// public showprtandchrge: boolean;
  files: fileupload[] = [];
  isDisabled: boolean;
  public url: any;
  changedprofilepic: boolean = false;
  photoimg;



  constructor(
    private patManServ: PatientmanagementService,
    private authStore: AuthenticationStore,
    private lookUpServ: LookupService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.patientDetail = new PatientDto();
  }

  ngOnInit() {
    this.sensitivity = [
      { label: 'Select Sensitivity', value: null },
      { label: 'Adverse Reaction', value: 1 },
      { label: 'Allergy', value: 2 },
      { label: 'Contraindication', value: 3 },
      { label: 'Introlerance', value: 4 }
    ],
      this.guarantorRelationship = [
        { label: 'Spouse', value: 2 },
        { label: 'Parent', value: null },
        { label: 'Other', value: 1 },
        { label: 'Child', value: 3 },
      ]
    this.getdatasfromapi();
    this.getState();
    console.log('patientID in details page', this.patientIdToEdit)
  }


  getdatasfromapi(){
    let patientstatus =  this.patManServ.getPatientStatus();
    let facility = this.patManServ.getFacilityDetails();
    let Rorganization = this.patManServ.getRelatedOrganization();
    let ethnicity = this.patManServ.getCFEthnicity();
    let Race = this.patManServ.getRace();
    forkJoin([patientstatus,facility,Rorganization,ethnicity,Race]).subscribe( resp =>{
      resp[0].map(item => {
              this.patientStatus.push({
                label: item.Description,
                value: item.Description
              })
            })
      this.defaultFacility = resp[1]
      resp[2].map(item => {
              this.referringOrganization.push({
                label: item.RelatedOrganizationName,
                value: item.RelatedOrganizationId
              })
            })
      resp[3].map(item => {
                    this.patientEthnicity.push({
                      label: item.name,
                      value: item.id
                    })
                  })
      resp[4].map(item => {
                          this.patientRace.push({
                            label: item.RaceName,
                            value: item.RaceId
                          })
                        })
                        if (this.patientIdToEdit === "0") {
                          this.createform();
                        } else {
                          this.getPatientDetailsById();
                        }
    });
  }

  createform() {
    this.url = "../../../../../../assets/images/avatar.jpg";
    this.patientDetail = {
      ResponsibleParty: null,
      UniqueNumber: null,
      ChartNumber: null,
      Ssn: null,
      DateOfBirth: null,
      ageValue: null,
      SalutationId: null,
      MaritalStatusId: null,
      Sex: false,
      ReligionId: null,
      RaceId: null,
      EthnicityId: null,
      Language1Id: null,
      Language2Id: null,
      Language3Id: null,
      RequiresInterpreter: false,
      FirstName: null,
      MiddleName: null,
      LastName: null,
      PrimaryAddressLine1: null,
      PrimaryAddressLine2: null,
      PrimaryCity: null,
      PrimaryStateCode: null,
      PrimaryZipCode: null,
      PrimaryZipPlus4: null,
      SecondaryAddressLine1: null,
      SecondaryAddressLine2: null,
      SecondaryCity: null,
      SecondaryStateCode: null,
      SecondaryZipCode: null,
      SecondaryZipPlus4: null,
      HasInternationalAddress: null,
      WorkPhone: null,
      WorkPhoneExt: null,
      HomePhone: null,
      MobilePhone: null,
      AltPhone: null,
      Fax: null,
      PreferredContactNo: null,
      PhotoImage: null,
      Email1: null,
      Email2: null,
      GeneralNote: null,
      Occupation: null,
      HipaaViaMail: null,
      HipaaViaVoice: null,
      HipaaViaNotice: null,
      HipaaViaMessage: null,
      HipaaAllowSms: null,
      HipaaAllowEmail: null,
      PriceLevel: null,
      PatientStatus: null,
      ReferralSourceId: null,
      DateCreated: null,
      CreatedByUserId: null,
      DateLastUpdated: null,
      LastUpdatedByUserId: null,
      SignatureOnFile: false,
      AssignedProvider: null,
      SofDate: null,
      MedicalChartNumber: null,
      DefaultFacility: null,
      DefaultPhysician: null,
      UserId: null,
      ApplicationUserId: null,
      HippaAllowPhoneCall: null,
      HippaAllowPatientPortal: null,
      PatientPortalMakeClinicalSummaryAvailableToPatient: null,
      PatientPortalMakeLabResultsAvailableToPatient: null,
      PatientPortalMakeProblemListAvailableToPatient: null,
      PatientPortalMakeMedicationListAvailableToPatient: null,
      PatientPortalMakeAllergyInfoAvailableToPatient: null,
      PatientPortalMakeRadiologyReportsInfoAvailableToPatient: null,
      PatientPortalMakeReferralLettersInfoAvailableToPatient: null,
      ReferringPhysicianId: null,
      ReferringOrganizationId: null,
      ReferralDetails: null,
      SummaryDocument: null,
      AmountCurrentBalanceDue: null,
      AmountCurrentBalanceDueCurrency: null,
      DateCurrentBalanceDue: null,
      OnPaymentArrangement: null,
      IsLivingWill: null,
      AdvancedDirectivesId: null,
      Note: null,
      FlagSelfPayPatient: null,
      FlagDoNotSendPatientStatement: null,
      InsuranceCategoryId: null,
      AcceptAssignment: null,
      RcopiaPatientId: null,
      RcopiaXml: null,
      Comments: null,
    };
    // this.showprtandchrge = false;
  }
  firstNameChange(string){
    this.patientDetail.FirstName = string.split(' ').join('');
  }
  lastNameChange(event){
    this.patientDetail.LastName = event.split(' ').join('');
  }
  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }
  preview(files) {
    if (files.length === 0) {
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "only images are supported";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  openmodal() {
  this.modalEvent.emit(this.Modalname);
  }



  onUpload(event) {
    if(this.uploadedFiles != null){
    this.uploadedFiles.pop()}
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
    console.log("value of file is:",this.uploadedFiles[0]);

  }
  RemImg() {
    this.imgURL = null;
    this.message = null;
    this.imagePath = null;

  }
  getPatientStatus() {
    this.patManServ.getPatientStatus().subscribe(resp => {
      console.log('status', resp);
      if(resp){
        resp.map(item => {
          this.patientStatus.push({
            label: item.Description,
            value: item.Description
          })
        })
      }
    });
  }

  getState() {
    this.patientState = this.lookUpServ.getAllStates();
  }

  filterCountry(query, countries: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < countries.length; i++) {
      let country = countries[i];
      if (country.value.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    return filtered;
  }
  getReferringPhysicianByOrganization(value) {
    console.log("value of referring is",value);
    this.patientDetail.ReferringOrganizationId = value;
    console.log('dropdown event', this.patientDetail.ReferringOrganizationId);
    this.patManServ.getReferringPhysicianByOrganization(this.patientDetail.ReferringOrganizationId).subscribe(resp => {
      console.log('physician', resp);
      if(resp){
resp.map( item =>{
  item.physicianName = item.ReferringPhysicianLastName+", "+item.ReferringPhysicianFirstName
  this.referringPhysician.push({
    label: item.physicianName,
    value: item.ReferringPhysicianId
  })
})
    }
    });
  }
  getFacilityDetails() {
    this.patManServ.getFacilityDetails().subscribe(resp => {
      console.log('facility', resp);
      this.defaultFacility = resp;
    });
  }
  getRelatedOrganization() {
    this.patManServ.getRelatedOrganization().subscribe(resp => {
      console.log('organisation', resp);
      if(resp){
        resp.map(item => {
          this.referringOrganization.push({
            label: item.RelatedOrganizationName,
            value: item.RelatedOrganizationId
          })
        })
      }
    });
  }
  getEthnicity() {
    this.patManServ.getCFEthnicity().subscribe(resp => {
      console.log('ethnicity', resp);
      if(resp){
        resp.map(item => {
          this.patientEthnicity.push({
            label: item.name,
            value: item.id
          })
        })
      }
    });
  }

  getRace() {
    this.patManServ.getRace().subscribe(resp => {
      console.log('race', resp);
      if(resp){
        resp.map(item => {
          this.patientRace.push({
            label: item.RaceName,
            value: item.RaceId
          })
        })
      }
    });
  }

  convertingfrom64(){
    var c1,c2,c3;
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var encoded = this.patientDetail.PhotoImage;
var decoded = Base64.decode(encoded);
var extension = undefined;
var lowerCase = decoded.toLowerCase();
if (lowerCase.indexOf("png") !== -1) extension = "png"
else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
    extension = "jpg"
else extension = "tiff";
this.url = "data:image/" + extension + ";base64," + encoded;
  }

  
  getPatientDetailsById() {    
    let temp
    if (this.patientIdToEdit > 0) {
      this.patManServ.getPatientById(this.patientIdToEdit).subscribe(resp => {
        this.patientDetail = resp
        this.photoimg = resp.PhotoImage
        console.log("value of photoimg is",this.photoimg)
        // this.showprtandchrge = true
        this.patientDetail.DateOfBirth = new Date(resp.DateOfBirth)
        this.calculateAge(this.patientDetail.DateOfBirth);
        if((this.patientDetail.PhotoImage === null)||(this.patientDetail.PhotoImage === ""))
        {
          this.url = "../../../../../../assets/images/avatar.jpg"
        } else {
          this.url = this.patientDetail.PhotoImage
        }
        console.log("value of patient data in patient Details is",this.patientDetail)
        if(this.patientDetail.ReferringOrganizationId != null){
          this.getReferringPhysicianByOrganization(this.patientDetail.ReferringOrganizationId)
        }
        this.convertingfrom64();
      });
    }
}
  calculateAge(value)
   {
    console.log("selected date of birth is: ", value);
    value = new Date(value);
     console.log("selected date of birth is: ", this.patientDetail.DateOfBirth);
    if (value) {
      const timeDiff = Math.abs(Date.now() - value);
      this.ageValue = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      console.log('age', this.ageValue)
      this.patientDetail.ageValue = this.ageValue
    }
    let dt = new Date();
    if (value > dt) {
      this.DOBV = true
      console.log("selected date is greater");
    } else {
      this.DOBV = false
    }
  }

  public hideGurantorDetails() {
    console.log('clicked')
    this.value = false;
  }

  public showGurantorDetails() {
    console.log('clicked')
    this.value = true;
  }
  patGuarantorDetails() {
    console.log('pat Gurarntor details');
    this.router.navigate(['/pages/workspace/patientmanagement/patientgurantor']);
  }

  removeFile(): void {
    this.file = '';
  }

  onCancel() {
    this.patientDetailsForm.reset();
    this.router.navigate(['/pages/workspace/patientmanagement']);
  }


  valueChange(value) {
    value.PhotoImage = this.url
    console.log(value);
    console.log("value of url is",this.url);
    delete this.patientDetail['ageValue'];
    if((this.patientDetail.DateOfBirth != null)&&(this.patientDetail.FirstName != null)&&(this.patientDetail.LastName != null)&&(this.patientDetail.PatientStatus != null) && (this.patientDetail.PrimaryZipCode != null) && (this.patientDetail.PrimaryZipPlus4 != null) &&(this.patientDetail.HomePhone != null) ){
    } else {
      this.formSumitAttempt = true;
      return
    }
    console.log('success',value);
    this.patientDetail.DefaultFacility=this.usrFacId
    this.patientDetailsFormDatas = this.patientDetail
    console.log("value of patientdetail and detail",this.patientDetail,this.patientDetailsFormDatas)
    const today = new Date();
    const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (this.patientIdToEdit === "0") {
      this.patientDetailsFormDatas.DateCreated = date
      this.patientDetailsFormDatas.CreatedByUserId = UserDetail.UserId
    } else {
      this.patientDetailsFormDatas.DateCreated = this.patientDetail.DateCreated
      this.patientDetailsFormDatas.CreatedByUserId = this.patientDetail.CreatedByUserId
    }
    this.patientDetailsFormDatas.DateLastUpdated = date
    this.patientDetailsFormDatas.LastUpdatedByUserId = UserDetail.UserId
    let temp = this.patientDetail;

    if (this.patientDetailsFormDatas.DefaultFacility != null) {
      this.patientDetailsFormDatas.DefaultFacility = temp.DefaultFacility
    }
    console.log("value of DefaultFacility is: ", temp);
    if (this.patientDetailsFormDatas.DefaultPhysician != null) {
      this.patientDetailsFormDatas.DefaultPhysician = temp.DefaultPhysician
    }
    console.log("value of default physician is: ", temp,this.patientDetailsFormDatas.DefaultPhysician);
    if (this.patientDetailsFormDatas.EthnicityId != null) {
      this.patientDetailsFormDatas.EthnicityId = temp.EthnicityId
    }
    console.log("value of ethni", temp)
    if (this.patientDetailsFormDatas.Language1Id != null) {
      this.patientDetailsFormDatas.Language1Id = temp.Language1Id
    }
    console.log("value of lang", temp)
    this.patientDetailsFormDatas.PatientStatus = temp.PatientStatus

    console.log("value of PatientStatus", temp)
    if (this.patientDetailsFormDatas.PrimaryStateCode != null) {
      this.patientDetailsFormDatas.PrimaryStateCode = temp.PrimaryStateCode
    }
    console.log("value of primary status code, ", temp)
    if (this.patientDetailsFormDatas.RaceId != null) {
      this.patientDetailsFormDatas.RaceId = temp.RaceId
    }
    console.log("value of RaceId code ", temp)
    if (this.patientDetailsFormDatas.ReferringOrganizationId != null) {
      this.patientDetailsFormDatas.ReferringOrganizationId = temp.ReferringOrganizationId
    }
    console.log("value of ReferringOrganizationId code, ", temp)
    if (this.patientDetailsFormDatas.ReferringPhysicianId != null) {
      this.patientDetailsFormDatas.ReferringPhysicianId = temp.ReferringPhysicianId
    }
    console.log("value of ReferringPhysicianId code, ", temp)
    if (this.patientDetailsFormDatas.SalutationId != null) {
      this.patientDetailsFormDatas.SalutationId = temp.SalutationId
    }
    console.log("value of SalutationId code, ", temp)
    console.log("patient status", this.patientDetail.PatientStatus)
    if (this.patientDetail.Sex === true) {
      this.patientDetailsFormDatas.Sex = true
    } else {
      this.patientDetailsFormDatas.Sex = false
    }

    if (this.patientIdToEdit === "0") {
      if(this.changedprofilepic === true){
        this.patientDetailsFormDatas.PhotoImage = this.base64Image
      } else {
        this.patientDetailsFormDatas.PhotoImage = null
      }
      this.patientDetailsFormDatas.HipaaViaMail = false
      this.patientDetailsFormDatas.HipaaViaVoice = false
      this.patientDetailsFormDatas.HipaaViaNotice = false
      this.patientDetailsFormDatas.HipaaViaMessage = false
      this.patientDetailsFormDatas.HipaaAllowSms = false
      this.patientDetailsFormDatas.HipaaAllowEmail = false
      this.patientDetailsFormDatas.SignatureOnFile = false
      this.patientDetailsFormDatas.HippaAllowPhoneCall = false
      this.patientDetailsFormDatas.HippaAllowPatientPortal = false
      this.patientDetailsFormDatas.PatientPortalMakeClinicalSummaryAvailableToPatient = false
      this.patientDetailsFormDatas.PatientPortalMakeLabResultsAvailableToPatient = false
      this.patientDetailsFormDatas.PatientPortalMakeProblemListAvailableToPatient = false
      this.patientDetailsFormDatas.PatientPortalMakeMedicationListAvailableToPatient = false
      this.patientDetailsFormDatas.PatientPortalMakeAllergyInfoAvailableToPatient = false
      this.patientDetailsFormDatas.PatientPortalMakeRadiologyReportsInfoAvailableToPatient = false
      this.patientDetailsFormDatas.PatientPortalMakeReferralLettersInfoAvailableToPatient = false
    } else {
      if(this.changedprofilepic === true){
        this.patientDetailsFormDatas.PhotoImage = this.base64Image
      } else {
        this.patientDetailsFormDatas.PhotoImage = this.photoimg
        console.log("value of photoimg is",this.photoimg)
      }
      this.patientDetailsFormDatas.PatientId = this.patientIdToEdit
      this.patientDetailsFormDatas.HipaaViaMail = this.patientDetail.HipaaViaMail
      this.patientDetailsFormDatas.HipaaViaVoice = this.patientDetail.HipaaViaVoice
      this.patientDetailsFormDatas.HipaaViaNotice = this.patientDetail.HipaaViaNotice
      this.patientDetailsFormDatas.HipaaViaMessage = this.patientDetail.HipaaViaMessage
      this.patientDetailsFormDatas.HipaaAllowSms = this.patientDetail.HipaaAllowSms
      this.patientDetailsFormDatas.HipaaAllowEmail = this.patientDetail.HipaaAllowEmail
      this.patientDetailsFormDatas.SignatureOnFile = this.patientDetail.SignatureOnFile
      this.patientDetailsFormDatas.HippaAllowPhoneCall = this.patientDetail.HippaAllowPhoneCall
      this.patientDetailsFormDatas.HippaAllowPatientPortal = this.patientDetail.HippaAllowPatientPortal
      this.patientDetailsFormDatas.PatientPortalMakeClinicalSummaryAvailableToPatient = this.patientDetail.PatientPortalMakeClinicalSummaryAvailableToPatient
      this.patientDetailsFormDatas.PatientPortalMakeLabResultsAvailableToPatient = this.patientDetail.PatientPortalMakeLabResultsAvailableToPatient
      this.patientDetailsFormDatas.PatientPortalMakeProblemListAvailableToPatient = this.patientDetail.PatientPortalMakeProblemListAvailableToPatient
      this.patientDetailsFormDatas.PatientPortalMakeMedicationListAvailableToPatient = this.patientDetail.PatientPortalMakeMedicationListAvailableToPatient
      this.patientDetailsFormDatas.PatientPortalMakeAllergyInfoAvailableToPatient = this.patientDetail.PatientPortalMakeAllergyInfoAvailableToPatient
      this.patientDetailsFormDatas.PatientPortalMakeRadiologyReportsInfoAvailableToPatient = this.patientDetail.PatientPortalMakeRadiologyReportsInfoAvailableToPatient
      this.patientDetailsFormDatas.PatientPortalMakeReferralLettersInfoAvailableToPatient = this.patientDetail.PatientPortalMakeReferralLettersInfoAvailableToPatient
    }
    console.log('data from patient details before emit', this.patientDetailsFormDatas,this.changedprofilepic)
    this.childEvent.emit(this.patientDetailsFormDatas);
  }

  openNext() {
    console.log("formsumit")
    if((this.patientDetail.DateOfBirth != null || this.patientDetail.DateOfBirth != undefined)&&(this.patientDetail.FirstName != null || this.patientDetail.FirstName != undefined)&&(this.patientDetail.LastName != null || this.patientDetail.LastName != undefined)&&(this.patientDetail.PatientStatus != null || this.patientDetail.PatientStatus != undefined) && (this.patientDetail.PrimaryZipCode != null || this.patientDetail.PrimaryZipCode != undefined) && (this.patientDetail.PrimaryZipPlus4 != null || this.patientDetail.PrimaryZipPlus4 != undefined) &&(this.patientDetail.HomePhone != null || this.patientDetail.HomePhone != undefined) ){
      this.formSumitAttempt = true;
    } else {
    }
    this.next.emit(this.formSumitAttempt);
    this.formSumitAttempt = false;
  }
  onClose() {
    this.router.navigate(['/pages/workspace/patientmanagement']);
  }

  SelectedFacility(event) {
    this.usrFacId = event.FacilityId
    // this.patientDetail.DefaultFacility=this.usrFacId
    console.log("event is: ", this.usrFacId);
    console.log("Selected facility is: ", this.usrFacId);
    this.patManServ.getPhyminDtFacID(this.usrFacId).subscribe(resp => {
      console.log("Phy Min List", resp)
        resp.map(item => {
          let fullname = item.lastname+", "+item.firstname
          this.defaultPhy.push({
            label: fullname,
            value: item.physicianid
          })
        })
        console.log("value of physician id is",this.defaultPhy)
    });
  }

  LoadFacility(event) {
    let Facility = {
      pFacilityName: event.query
    }
    if (event.query === "") {
      event.query = "a";
      Facility = {
        pFacilityName: event.query
      }
    }
    console.log("Drowdown clicked", event);
    console.log("value of facility name is: ", Facility);
    this.patManServ.getFacilitieswithFacilitiesName(Facility).subscribe(resp => {
      this.selectedFacilityList = resp
      console.log(this.selectedFacilityList)
    });

  }

  selfpayvalues(value){
    console.log("value of selfpay is:",value);
    this.selfpay = value;
  }

  fileChange(fileList: Array<File>) {
    let data: any = [];
    for (let file of fileList) {
      data.push(new fileupload(file));
    }
    this.files = data;
    this.isDisabled = false;
  }

  uploadImage(event) 
  {
    if (event.target.files && event.target.files[0]) 
    {
      console.log(event.target.files[0]);
      var reader = new FileReader();
      var reader1 = new FileReader();
      reader.onload = (event: any) => {
      this.url = event.target.result;
      console.log(this.url);
      }
      reader.readAsDataURL(event.target.files[0]);
      reader1.onload = this._handleReaderLoaded.bind(this)
      reader1.readAsBinaryString(event.target.files[0]);
    }
    this.changedprofilepic = true;
  }
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           this.base64Image= btoa(binaryString);
           console.log('Base 64 image',btoa(binaryString));
   }

   printdetails(){

   }

   chargeSlips(data){
    this.crgslip.emit(data)
   }
}

