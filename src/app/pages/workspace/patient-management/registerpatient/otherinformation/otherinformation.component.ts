import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
// import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { FieldErrorDisplayComponent } from '../../../field-error-display/field-error-display.component';
import { Router } from '@angular/router';
import { PatientDto } from '../patientdetails/patientDetailForm.model';
import { PatientmanagementService } from '../../../../../services/workspace/patient-management.service';
import {OtherInformation } from '../../../../../model/Workspace/OtherInformation.model';
// import { EmployerInformation } from '../../../../../model/Workspace/EmployerInformation.model'
// import { Patient } from '../../../../../model/Workspace/patient.model';
import { forkJoin } from "rxjs";
import { map, catchError } from 'rxjs/operators'
import { LookupService } from '../../../../../services/lookup.service';
// import {FormsModule} from '@angular/forms'
import { PatientemployerService } from '../../../../../services/PatientEmployer/patientemployer.service';
import { ToastrService } from 'ngx-toastr';
import { BillersNoteComponent } from '../../../../../theme/components/applications/waitingroom/billers-note/billers-note.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AuthenticationStore } from '../../../../../../app/authentication/authentication-store';

@Component({
  selector: 'app-otherinformation',
  templateUrl: './otherinformation.component.html',
  styleUrls: ['./otherinformation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OtherinformationComponent implements OnInit {
  EmployerInformation: any = {EmployerName:''};

  patientDetailsList: any = {};
  patientIdToEdit
  patientDetail
  public showprtandchrge: boolean;

  @Input()
  set _showprtandchrge(val: any){
    this.showprtandchrge = val;
  }

  get _showprtandchrge(): any {
    return this.showprtandchrge;
  }

  @Input() 
  set _patientIdToEdit(val: number){
    this.patientIdToEdit = val;
  }

  get _patientIdToEdit(): number {
    return this.patientIdToEdit;
  }
@Input() patientLanguage: any;
  @Output() next = new EventEmitter();
  @Output() crgslip = new EventEmitter();

  //declaring form
  OtherInformationform: OtherInformation = {
    MaritalStatusId: null,
    ReligionId: null,
    Language2Id: null,
    Language3Id: null,
    SecondaryAddressLine1: null,
    SecondaryAddressLine2: null,
    SecondaryCity: null,
    SecondaryStateCode: null,
    SecondaryZipCode: null,
    SecondaryZipPlus4: null,
    IsLivingWill: null,
    AdvancedDirectivesId: null,
    Comments: null,
    Note: null,
    employerName: null,
    employerAddressLine1: null,
    employerAddressLine2: null,
    employerCity: null,
    employerState: null,
    employerZipCode: null,
    employerZipPlus4: null,
    DateCreated: null,
    CreatedByUserId: null,
    DateLastUpdated: null,
    LastUpdatedByUserId: null,
  };
PatientInformationform: any = {};
// PatientDto = {
//   // PatientId: this.patientIdToEdit,
//   ChartNumber: null,
//   Ssn: null,
//   DateOfBirth: null,
//   ageValue: null,
//   SalutationId: null,
//   MaritalStatusId: null,
//   Sex: null,
//   ReligionId: null,
//   RaceId: null,
//   EthnicityId: null,
//   Language1Id: null,
//   Language2Id: null,
//   Language3Id: null,
//   RequiresInterpreter: null,
//   FirstName: null,
//   MiddleName: null,
//   LastName: null,
//   PrimaryAddressLine1: null,
//   PrimaryAddressLine2: null,
//   PrimaryCity: null,
//   PrimaryStateCode: null,
//   PrimaryZipCode: null,
//   PrimaryZipPlus4: null,
//   SecondaryAddressLine1: null,
//   SecondaryAddressLine2: null,
//   SecondaryCity: null,
//   SecondaryStateCode: null,
//   SecondaryZipCode: null,
//   SecondaryZipPlus4: null,
//   HasInternationalAddress: null,
//   WorkPhone: null,
//   WorkPhoneExt: null,
//   HomePhone: null,
//   MobilePhone: null,
//   AltPhone: null,
//   Fax: null,
//   PreferredContactNo: null,
//   PhotoImage: null,
//   Email1: null,
//   Email2: null,
//   GeneralNote: null,
//   Occupation: null,
//   HipaaViaMail: null,
//   HipaaViaVoice: null,
//   HipaaViaNotice: null,
//   HipaaViaMessage: null,
//   HipaaAllowSms: null,
//   HipaaAllowEmail: null,
//   PriceLevel: null,
//   PatientStatus: null,
//   ReferralSourceId: null,
//   DateCreated: null,
//   CreatedByUserId: null,
//   DateLastUpdated: null,
//   LastUpdatedByUserId: null,
//   SignatureOnFile: null,
//   AssignedProvider: null,
//   SofDate: null,
//   MedicalChartNumber: null,
//   DefaultFacility: null,
//   DefaultPhysician: null,
//   UserId: null,
//   ApplicationUserId: null,
//   HippaAllowPhoneCall: null,
//   HippaAllowPatientPortal: null,
//   PatientPortalMakeClinicalSummaryAvailableToPatient: null,
//   PatientPortalMakeLabResultsAvailableToPatient: null,
//   PatientPortalMakeProblemListAvailableToPatient: null,
//   PatientPortalMakeMedicationListAvailableToPatient: null,
//   PatientPortalMakeAllergyInfoAvailableToPatient: null,
//   PatientPortalMakeRadiologyReportsInfoAvailableToPatient: null,
//   PatientPortalMakeReferralLettersInfoAvailableToPatient: null,
//   ReferringPhysicianId: null,
//   ReferringOrganizationId: null,
//   ReferralDetails: null,
//   SummaryDocument: null,
//   AmountCurrentBalanceDue: null,
//   AmountCurrentBalanceDueCurrency: null,
//   DateCurrentBalanceDue: null,
//   OnPaymentArrangement: null,
//   UniqueNumber: null,
//   IsLivingWill: null,
//   AdvancedDirectivesId: null,
//   Note: null,
//   FlagSelfPayPatient: null,
//   FlagDoNotSendPatientStatement: null,
//   Comments: null,
//   InsuranceCategoryId: null,
//   AcceptAssignment: null,
//   RcopiaPatientId: null,
//   RcopiaXml: null,
// };
// EmployerInformationform: EmployerInformation
//  = {
//   PatientId: this.patientIdToEdit,
//     PatientEmployerId: null,
//     EmployerName: null,
//     AddressLine1: null,
//     AddressLine2: null,
//     City: null,
//     State: null,
//     ZipCode: null,
//     ZipPlus4: null,
//     DateCreated: null,
//     CreatedByUserId: null,
//     DateLastUpdated: null,
//     LastUpdatedByUserId: null,
// };
// OtherInformationform = {};

  maritalStatus: any = [];
  religion: any = [];
  languageOne: any = [];
  languageTwo: any = [];
  patientState: any = [];
  employerStateNameDrop: any = [];
  activateComments: boolean = true;
  formSumitAttempt: boolean = false;
  otherInformationCols: any = [];
  otherInformationData: any = [];
  private msg: string;
  // EmployerInformationform: FormGroup;

  constructor(
    private routes: Router,
    private toastr: ToastrService,
    // private fb: FormBuilder,
    private pms: PatientmanagementService,
    private pes: PatientemployerService,
    private lookUpServ: LookupService,
    private modalService: NgbModal,
    private authstore: AuthenticationStore
  ) {
    // value = new OtherInformation();
  }

  ngOnInit() {
    this.getPatientdatas();
    // this.getEmployerInformation(this.patientIdToEdit);
    this.createform();
    this.getAlldatasformAPi();
    // alert(this.patientIdToEdit);
    // this.initializeform();

    // this.maritalStatus = [
    //   { label: 'Divorced', value: 1 },
    //   { label: 'Married', value: 2 },
    //   { label: 'Not Answered', value: 3 },
    //   { label: 'Separated', value: 4 },
    //   { label: 'Single', value: 5 },
    //   { label: 'widower', value: 6 }
    // ],
      
    //   this.languageOne = [
    //     { label: 'Arabic', value: null },
    //     { label: 'Dutch', value: 1 },
    //     { label: 'French', value: 2 },
    //     { label: 'English', value: 3 },
    //     { label: 'Hindi', value: 4 }
    //   ],
    //   this.languageTwo = [
    //     { label: 'Arabic', value: null },
    //     { label: 'Dutch', value: 1 },
    //     { label: 'French', value: 2 },
    //     { label: 'English', value: 3 },
    //     { label: 'Hindi', value: 4 }
    //   ],
      
    //   this.employerStateNameDrop = [
    //     { label: 'Albama', value: null },
    //     { label: 'Alaska', value: 1 },
    //     { label: 'Arizona', value: 2 },
    //     { label: 'California', value: 3 },
    //     { label: 'Delaware', value: 4 }
    //   ],
      this.otherInformationCols = [
        { field: 'date', header: 'Date' },
        { field: 'noteType', header: 'Note Type' },
        { field: 'notes', header: 'Notes' },
        { field: '', header: 'Edit' },
        { field: '', header: 'Delete' },
      ],
      this.otherInformationData = [
        { date: '17/01/2019', noteType: 'test_image1', notes: 'Yeats Clinical' },
        { date: '22/01/2019', noteType: 'test_image2', notes: 'Yeats Clinical' },
        { date: '23/12/2018', noteType: 'test_image3', notes: 'Yeats Clinical' },
        { date: '17/11/2018', noteType: 'test_image4', notes: 'Yeats Clinical' },
        { date: '19/11/2018', noteType: 'test_image5', notes: 'Yeats Clinical' },
      ]
      this.getallstates();
  }
  getallstates(){
    this.patientState = this.lookUpServ.getAllStates();
  }
  getAlldatasformAPi(){
    let temp2
    let temp1
    let marstat = this.pms.getCFmaritalStatus();
    let Reg = this.pms.getCFReligion();
    // let Employerinformation = this.pes
    forkJoin([marstat,Reg]).subscribe( resp =>{
     temp1 = resp[0]
      
      temp2 = resp[1]
      console.log("value of datas in otherinformation: ",resp)
       resp[0].map(item =>{
        this.maritalStatus.push({
        label: item.name,
        value: item.id})
      })
      console.log("value of maritalstatus is:",this.maritalStatus)
      // for(let i=0;i<temp2.length;i++){

      // }
      temp2.map(item =>{
        this.religion.push({
        label: item.name,
        value: item.id})
      })
      console.log("value of religion is:",this.religion)
      if (this.patientIdToEdit === "0") {
        this.createform();
      } else {
        this.initializeform();
      }
    })
  }

  createform(){
// this.OtherInformationform = {
//   MaritalStatusId: null,
//   ReligionId: null,
//   Language2Id: null,
//   Language3Id: null,
//   SecondaryAddressLine1: null,
//   SecondaryAddressLine2: null,
//   SecondaryCity: null,
//   SecondaryStateCode: null,
//   SecondaryZipCode: null,
//   SecondaryZipPlus4: null,
//   IsLivingWill: null,
//     AdvancedDirectivesId: null,
//     Comments: null,
//     Note: null,
//     employerName: null,
//     employerAddressLine1: null,
//     employerAddressLine2: null,
//     employerCity: null,
//     employerState: null,
//     employerZipCode: null,
//     employerZipPlus4: null,
//     DateCreated: null,
//     CreatedByUserId: null,
//     DateLastUpdated: null,
//     LastUpdatedByUserId: null,
//      // MaritalStatusId: this.PatientInformationform.MaritalStatusId,
//   //   ReligionId: this.PatientInformationform.ReligionId,
//   //   Language2Id: this.PatientInformationform.Language2Id,
//   //   Language3Id: this.PatientInformationform.Language3Id,
//   //   SecondaryAddressLine1: this.PatientInformationform.SecondaryAddressLine1,
//   //   SecondaryAddressLine2: this.PatientInformationform.SecondaryAddressLine2,
//   //   SecondaryCity: this.PatientInformationform.SecondaryCity,
//   //   SecondaryStateCode: this.PatientInformationform.SecondaryStateCode,
//   //   SecondaryZipCode: this.PatientInformationform.SecondaryZipCode,
//   //   SecondaryZipPlus4: this.PatientInformationform.SecondaryZipPlus4,
// };

// this.EmployerInformationform = this.fb.group({
//   PatientId: [this.patientIdToEdit, [Validators.required]],
//   EmployerName: [""],
//   AddressLine1: [""],
//   AddressLine2: [""],
//   City: [""],
//   State: [""],
//   ZipCode: [""],
//   ZipPlus4: [""],
//   DateCreated: [""],
//   CreatedByUserId: [""],
//   DateLastUpdated: [""],
//   LastUpdatedByUserId: [""]
// });
this.initializeform();
  }


  initializeform(){

    let logindata = JSON.parse(sessionStorage.getItem('UserDetail'));
    logindata = logindata.UserId
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


    if (this.patientIdToEdit > 0)
{
  this.pms.getPatientById(this.patientIdToEdit).subscribe(resp => {
    this.PatientInformationform = resp
    console.log('patientId', this.patientIdToEdit)
    console.log("value of patient details in patientdetails",this.patientDetail);
  
    // if(this.PatientInformationform.MaritalStatusId != null){
    //   this.OtherInformationform.MaritalStatusId = this.PatientInformationform.MaritalStatusId
    // } else {this.OtherInformationform.MaritalStatusId = null; }
    // if(this.PatientInformationform.ReligionId != null){
    //   this.OtherInformationform.ReligionId = this.PatientInformationform.ReligionId
    // } else { this.OtherInformationform.ReligionId = null; }
    // if(this.PatientInformationform.Language2Id != null){
    //    this.OtherInformationform.Language2Id = this.PatientInformationform.Language2Id
    // } else { this.OtherInformationform.Language2Id = null }
    // if(this.PatientInformationform.Language3Id != null){
    //    this.OtherInformationform.Language3Id = this.PatientInformationform.Language3Id
    // } else {this.OtherInformationform.Language3Id = null }
    // if( this.PatientInformationform.SecondaryAddressLine1 != null){
    //    this.OtherInformationform.SecondaryAddressLine1 = this.PatientInformationform.SecondaryAddressLine1
    // } else {this.OtherInformationform.SecondaryAddressLine1 = null }
    // if(this.PatientInformationform.SecondaryAddressLine2 != null){
    //    this.OtherInformationform.SecondaryAddressLine2 = this.PatientInformationform.SecondaryAddressLine2
    // } else {this.OtherInformationform.SecondaryAddressLine2 = null }
    // if(this.PatientInformationform.SecondaryCity != null){
    //    this.OtherInformationform.SecondaryCity = this.PatientInformationform.SecondaryCity
    // } else { this.OtherInformationform.SecondaryCity = null }
    // if(this.PatientInformationform.SecondaryStateCode != null){
    //    this.OtherInformationform.SecondaryStateCode = this.PatientInformationform.SecondaryStateCode
    // } else {  this.OtherInformationform.SecondaryStateCode = null}
    // if(this.PatientInformationform.SecondaryZipCode != null){
    //    this.OtherInformationform.SecondaryZipCode = this.PatientInformationform.SecondaryZipCode
    // } else {  this.OtherInformationform.SecondaryZipCode = null }
    // if( this.PatientInformationform.SecondaryZipPlus4 != null){
    //    this.OtherInformationform.SecondaryZipPlus4 = this.PatientInformationform.SecondaryZipPlus4
    // } else { this.OtherInformationform.SecondaryZipPlus4 = null }
    // if( this.PatientInformationform.IsLivingWill != null){
    //    this.OtherInformationform.IsLivingWill = this.PatientInformationform.IsLivingWill
    // } else { this.OtherInformationform.IsLivingWill = null }
    // if(this.PatientInformationform.AdvancedDirectivesId != null){
    //    this.OtherInformationform.AdvancedDirectivesId = this.PatientInformationform.AdvancedDirectivesId
    // } else { this.OtherInformationform.AdvancedDirectivesId = null }
    // if( this.PatientInformationform.Comments != null){
    //    this.OtherInformationform.Comments = this.PatientInformationform.Comments
    // } else { this.OtherInformationform.Comments= null }
    // if( this.PatientInformationform.Note != null){
    //    this.OtherInformationform.Note = this.PatientInformationform.Note
    // } else { this.OtherInformationform.Note = null }
  });
}

    this.pes.getPatientEmployersbyId({patientId: this.patientIdToEdit}).subscribe(resp => {
      // console.log("value of patientemployer id is",resp.length)
      if(resp != null){
      this.patientDetailsList = resp}
      console.log("value of employerinfo is",this.patientDetailsList)
      
    // if( this.EmployerInformationform != null ){
    //   this.OtherInformationform.employerName = this.EmployerInformationform.EmployerName
    //   this.OtherInformationform.employerAddressLine1 = this.EmployerInformationform.AddressLine1
    //   this.OtherInformationform.employerAddressLine2 = this.EmployerInformationform.AddressLine2
    //   this.OtherInformationform.employerCity = this.EmployerInformationform.City
    //   this.OtherInformationform.employerState = this.EmployerInformationform.State
    //   this.OtherInformationform.employerZipCode = this.EmployerInformationform.ZipCode
    //   this.OtherInformationform.employerZipPlus4 = this.EmployerInformationform.ZipPlus4
    // } else {
    //   this.OtherInformationform.employerName = null
    //   this.OtherInformationform.employerAddressLine1 = null
    //   this.OtherInformationform.employerAddressLine2 = null
    //   this.OtherInformationform.employerCity = null
    //   this.OtherInformationform.employerState = null
    //   this.OtherInformationform.employerZipCode = null
    //   this.OtherInformationform.employerZipPlus4 = null
    // }
  });
  
  }
  
  activateComment(event) {
    console.log('success')
    console.log('data', !event)
    this.activateComments = !event;

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
  // isFieldValid(field: string) {
  //   return (
  //     (!this.otherInformationForm.get(field).valid &&
  //       this.otherInformationForm.get(field).touched) ||
  //     (this.otherInformationForm.get(field).untouched && this.formSumitAttempt)
  //   );
  // }

  // displayFieldCss(field: string) {
  //   return {
  //     'has-error': this.isFieldValid(field),
  //     'has-feedback': this.isFieldValid(field)
  //   };
  // }
  openNext() {
    this.next.emit();
  }
  onClose() {
    this.routes.navigate(['/pages/workspace/patientmanagement']);
  }

  onSubmit(value){
value = this.OtherInformationform

    if((this.PatientInformationform.SecondaryZipCode != null)&&(this.PatientInformationform.SecondaryZipPlus4 != null)&&(this.patientDetailsList.ZipCode != null)&&(this.patientDetailsList.ZipPlus4 != null)){ } 
    else {
      this.formSumitAttempt = true;
      this.msg="Please fill Zip codes in Secondary Address and Employer Information"
      this.showerror(this.msg)
      return;
    }
    console.log("value inside the form is:",value);
    console.log("value of otherinfor forms is:",this.OtherInformationform)
    let logindata = JSON.parse(sessionStorage.getItem('UserDetail'));
    logindata = logindata.UserId
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // initializing forms
    // this.PatientInformationform.PatientId = this.patientIdToEdit;
    console.log("started initilizing petientinformation form");
    // if(this.OtherInformationform.MaritalStatusId != null){
    // this.PatientInformationform.MaritalStatusId = this.OtherInformationform.MaritalStatusId}
    // if(this.OtherInformationform.ReligionId != null ){
    // this.PatientInformationform.ReligionId = this.OtherInformationform.ReligionId}
    // if(this.OtherInformationform.Language2Id != null){
    // this.PatientInformationform.Language2Id = this.OtherInformationform.Language2Id}
    // if(this.OtherInformationform.Language3Id != null){
    // this.PatientInformationform.Language3Id = this.OtherInformationform.Language3Id}
    // if(this.OtherInformationform.SecondaryAddressLine1 != null){
    // this.PatientInformationform.SecondaryAddressLine1 = this.OtherInformationform.SecondaryAddressLine1}
    // this.PatientInformationform.SecondaryAddressLine2 = this.OtherInformationform.SecondaryAddressLine2
    // this.PatientInformationform.SecondaryCity = this.OtherInformationform.SecondaryCity
    // this.PatientInformationform.SecondaryStateCode = this.OtherInformationform.SecondaryStateCode
    // this.PatientInformationform.SecondaryZipCode = this.OtherInformationform.SecondaryZipCode
    // this.PatientInformationform.SecondaryZipPlus4 = this.OtherInformationform.SecondaryZipPlus4
    // this.PatientInformationform.IsLivingWill = this.OtherInformationform.IsLivingWill
    // this.PatientInformationform.AdvancedDirectivesId = this.OtherInformationform.AdvancedDirectivesId
    // this.PatientInformationform.Comments = this.OtherInformationform.Comments
    // this.PatientInformationform.Note = this.OtherInformationform.Note
    this.PatientInformationform.DateLastUpdated = date
    this.PatientInformationform.LastUpdatedByUserId = logindata

    console.log("started initilizing EmployerInformationform form");
    console.log("value of patient id is",this.patientIdToEdit);
// this.EmployerInformationform.PatientId = this.patientIdToEdit;
// this.EmployerInformationform.PatientEmployerId = 
// if(this.OtherInformationform.employerName != null){
// this.EmployerInformationform.EmployerName=this.OtherInformationform.employerName}
// if(this.OtherInformationform.employerAddressLine1 != null){
// this.EmployerInformationform.AddressLine1=this.OtherInformationform.employerAddressLine1}
// if(this.OtherInformationform.employerAddressLine2 != null){
// this.EmployerInformationform.AddressLine2=this.OtherInformationform.employerAddressLine2}
// if(this.OtherInformationform.employerCity != null){
// this.EmployerInformationform.City=this.OtherInformationform.employerCity}
// if(this.OtherInformationform.employerState != null){
// this.EmployerInformationform.State=this.OtherInformationform.employerState}
// if(this.OtherInformationform.employerZipCode != null){
// this.EmployerInformationform.ZipCode=this.OtherInformationform.employerZipCode}
// if(this.OtherInformationform.employerZipPlus4 != null){
// this.EmployerInformationform.ZipPlus4=this.OtherInformationform.employerZipPlus4}
// if( this.EmployerInformationform.PatientEmployerId != null){

// // } else {
// this.EmployerInformation.DateCreated = date
// this.EmployerInformation.CreatedByUserId = logindata
// // }
// this.EmployerInformation.DateLastUpdated = date
// this.EmployerInformation.LastUpdatedByUserId = logindata
// this.EmployerInformationform
console.log("value of patientinformation b4 submittion",this.PatientInformationform)
console.log("value of employerinformation",this.EmployerInformation)
console.log("started updating patient information")
this.pms.updatePatient(this.PatientInformationform).subscribe( resp =>{
  
    // this.msg = "Patientinfo data has been updated Successfully"
    // this.showSuccess(this.msg);
  
});


console.log("started updating employer information")
if( this.patientDetailsList.PatientEmployerId != null){
  this.pes.updatePatientEmployer(this.patientDetailsList).subscribe( resp =>{
      // this.msg = "Employer data has been updated Successfully"
      // this.showSuccess(this.msg);
    
  });
} else {
  delete this.patientDetailsList['PatientEmployerId'];
  console.log("value of employer information form after delete",this.patientDetailsList);
this.pes.postPatientEmployer(this.patientDetailsList).subscribe(resp => {

  this.msg = "Employer has been updated Successfully"
  this.showSuccess(this.msg);

});
}
}
getPatientdatas(){

}
showSuccess(msg: string) {
  this.toastr.success(msg);
}

showerror(msg){
  this.toastr.error(this.msg);
}

chargeSlips(data){
  this.crgslip.emit(data)
 }
  }

  

