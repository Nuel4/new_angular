import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import {NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FieldsetModule} from 'primeng/fieldset';
import { LookupService } from '../../../../../services/lookup.service';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { ModelviewComponent } from '../../../../../theme/components/modelview/modelview.component'; 
import { PatientGuarantorService } from '../../../../../services/workspace/patient-guarantor.service';
import { ToastrService } from 'ngx-toastr';

const nameregex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

@Component({
  selector: 'app-guarantormodal',
  templateUrl: './guarantormodal.component.html',
  styleUrls: ['./guarantormodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GuarantormodalComponent implements OnInit {
  dateTime = new Date();
  @Input() data;
  @Output() PassGuarantor: EventEmitter<any> = new EventEmitter();
  uploadedFiles: any[] = [];
  public patientOccupation: any;
  public patientState: any =[];
  public  name: string;
public patientSalutation: any = [];
public patientLanguage: any = [];
public patientId: number;
public GuarantorOwnPolicyForm: FormGroup;
GuarantorDetails: any;
patientRelation;
ImportedPatient: any;
newbutton: boolean = false;
selectedGuaranator: any;
public PatientGuarantorId;
  public PatientData;
  public DOBV: boolean = false;
  url: any;
  base64Image: string;
  constructor(private modalService: NgbModal,
    public lookUpServ: LookupService,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private pgs:PatientGuarantorService,
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
    this.createform();
    this.PatientData = JSON.parse(sessionStorage.getItem('PatientDetail'));
    console.log("value of patient data",this.PatientData)
    this.getstates();
    this.splitdata();
this.getRelationship();
// this.GetGuarantorDetails()
// this.GuarantorDetails = [
//   {label: "patient", value: 1 },
//   {label: "name", value: 2 },
//   {label: "select", value: 3 },
//   {label: "here", value: 4 },
// ]

// this.patientRelation = [
//   {label: "Spouse", value: "Spouse"},
//   {label: "Parent", value: "Parent"},
//   {label: "Other", value: "Other"},
//   {label: "Childred", value: "Childred"},
// ]

this.patientOccupation = [
  {label: "Employed", value: 1 },
  {label: "Self-Employed", value: 2 },
  {label: "Student Part-time", value: 3 },
  {label: "Student Full-time", value: 4 },
  {label: "Unemployed/Homemaker/other", value: 5 },
];
    // Patient data before selecting Guarantor
    this.PatientData = JSON.parse(sessionStorage.getItem('PatientDetail'));
    
  }
  getRelationship(){
    this.pgs.getRelationships().subscribe(
      res => {
        console.log("relationship res", res);
        this.patientRelation = res
      }
    )
  }
 getstates(){
  this.patientState = this.lookUpServ.getAllStates();
 }

 splitdata(){
  console.log("value of data is: ",this.data)
this.name = this.data.componentname;
this.patientSalutation = this.data.salutationdata;
this.patientLanguage = this.data.languages;
console.log("this.patientLanguage", this.patientLanguage)
this.patientId = parseInt(this.data.patientId);
   console.log("value of component name is: ",this.name);
console.log("value of patient salutation is: ",this.patientSalutation);
console.log("value of language is: ",this.patientLanguage);
if(this.name === "PrimaryInsurance"){
  this.newbutton = true;
  this.GetGuarantorDetails(this.patientId);
} else {
this.newbutton = false; }
console.log("value of new button is: ",this.newbutton);
this.GetGuarantorDetails(this.patientId);
 }

 createform(){
  this.GuarantorOwnPolicyForm = this.fb.group({
    // ExistingGuarantor:  [""],
    Ssn: [""],
    DateOfBirth: ["",Validators.required],
    SalutationId: ["",Validators.required],
    FirstName: ["",[Validators.required,Validators.pattern(nameregex)]],
    LastName: ["",[Validators.required,Validators.pattern(nameregex)]],
    MiddleName:  ["",[Validators.pattern(nameregex)]],
    RelationshipToPatientHcfa: ["",Validators.required],
    Language1Id: [""],
    RequiresInterpreter: [false],
    Language2Id: [""],
    Language3Id: [""],
    PrimaryAddressLine1: [""],
    PrimaryAddressLine2: [""],
    PrimaryCity: [""],
    PrimaryStateCode: [""],
    PrimaryZipCode: [""],
    PrimaryZipPlus4: [""],
    SecondaryAddressLine1: [""],
    SecondaryAddressLine2: [""],
    SecondaryCity: [""],
    SecondaryStateCode: [""],
    SecondaryZipCode: [""],
    SecondaryZipPlus4: [""],
    WorkPhone: [""],
    HomePhone: [""],
    MobilePhone: [""],
    AltPhone: [""],
    Fax: [""],
    Email1: [""],
    Email2: [""],
    Occupation: [""],
    GeneralNote: [""],
    Sex: [""],
  });
 }

 GetGuarantorDetails(patientid?){
   let param = {
     patientId: patientid
   }
   this.pgs.GetPatientGuarantor(param).subscribe(resp =>{
     if(resp != null){
     this.GuarantorDetails = resp
     this.PatientGuarantorId = resp.PatientGuarantorId;
     this.GuarantorDetails.DateOfBirth = new Date(resp.DateOfBirth)
     if((this.GuarantorDetails.PhotoImage === null)||(this.GuarantorDetails.PhotoImage === ""))
     {
       this.url = "../../../../../../assets/images/avatar.jpg"
     } else {
       this.url = this.GuarantorDetails.PhotoImage
     }
    //  this.GuarantorOwnPolicyForm.patchValue({
    //   ExistingGuarantor: this.GuarantorDetails});
     console.log("value of guarantor details are",this.GuarantorDetails)
    } else {
      // this.createform();
      alert(false)
    this.showerror("No Guarantor avaliable for this Patient");}
   })

 }

 SelectedGuaranator(event){
   console.log("selectedGuaranator",event, this.selectedGuaranator)
   let temp = event.value;
   this.PatientGuarantorId = temp.PatientGuarantorId;
   this.GuarantorOwnPolicyForm.patchValue({
    Ssn: temp.Ssn,
    DateOfBirth: new Date(temp.DateOfBirth),
    SalutationId: temp.SalutationId,
    FirstName: temp.FirstName,
    LastName: temp.LastName,
    MiddleName:  temp.MiddleName,
    Language1Id: temp.Language1Id,
    RequiresInterpreter: temp.RequiresInterpreter,
    Language2Id: temp.Language2Id,
    Language3Id: temp.Language3Id,
    PrimaryAddressLine1: temp.PrimaryAddressLine1,
    PrimaryAddressLine2: temp.PrimaryAddressLine2,
    PrimaryCity: temp.PrimaryCity,
    PrimaryStateCode: temp.PrimaryStateCode,
    PrimaryZipCode: temp.PrimaryZipCode,
    PrimaryZipPlus4: temp.PrimaryZipPlus4,
    SecondaryAddressLine1: temp.SecondaryAddressLine1,
    SecondaryAddressLine2: temp.SecondaryAddressLine2,
    SecondaryCity: temp.SecondaryCity,
    SecondaryStateCode: temp.SecondaryStateCode,
    SecondaryZipCode: temp.SecondaryZipCode,
    SecondaryZipPlus4: temp.SecondaryZipPlus4,
    WorkPhone: temp.WorkPhone,
    HomePhone: temp.HomePhone,
    MobilePhone: temp.MobilePhone,
    AltPhone: temp.AltPhone,
    Fax: temp.Fax,
    Email1: temp.Email1,
    Email2: temp.Email2,
    Occupation: temp.Occupation,
    GeneralNote: temp.GeneralNote,
    Sex: temp.Sex,
  })
  this.url = temp.PhotoImage;
  this.convertingfrom64()
 }

 onsubmit(value){
  //  delete value['ExistingGuarantor'];
   console.log("value of data is",value);
value.PatientId = this.patientId
let logindata = JSON.parse(sessionStorage.getItem('UserDetail'));
logindata = logindata.UserId
const today = new Date();
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let photo = this.url.slice(23)
value.DateLastUpdated = new Date()
value.LastUpdatedByUserId = logindata
value.PhotoImage = photo
// this.PassGuarantor.emit(value);
// console.
if(this.selectedGuaranator){ 
  value.DateCreated = new Date(this.selectedGuaranator.DateCreated)
  value.CreatedByUserId = this.selectedGuaranator.CreatedByUserId
  value.Inactive = this.selectedGuaranator.Inactive ? this.selectedGuaranator.Inactive : undefined;
  value.api = false
  value.PatientGuarantorId = this.selectedGuaranator.PatientGuarantorId;
  let relationship = value.RelationshipToPatientHcfa.Relationship1;
  value.RelationshipToPatientHcfa = relationship;
  console.log("value of form data b4 submitting",value);
  this.PassGuarantor.emit(value);
  // this.pgs.putPatientGuarantor(value).subscribe(resp =>{
  //   console.log("value of resp is",resp)
  // });
}
else {
  // value.PatientGuarantorId = -1
  value.DateCreated = new Date()
  value.CreatedByUserId = logindata
  value.api = true;
  let relationship = value.RelationshipToPatientHcfa.Relationship1
  value.RelationshipToPatientHcfa = relationship
  console.log("value of form data b4 submitting",value);
  this.PassGuarantor.emit(value);
  // this.pgs.postPatientGuarantor(value).subscribe(resp =>{
  //   console.log("value of resp is",resp)
  // });
}
  //  PatientId
  //  Inactive
  // DateCreated
  // CreatedByUserId
  // DateLastUpdated
  // LastUpdatedByUserId
  // type

 }

 // for setting back the patient to its origin
 setPatientdata(){
  sessionStorage.setItem('PatientDetail', JSON.stringify(this.PatientData));
 }
 clearData(){
   this.GuarantorOwnPolicyForm.reset()
 }
//  onUpload(event) {
//   for(let file of event.files) {
//       this.uploadedFiles.push(file);
//   }
//   console.log("value of file is:",this.uploadedFiles[0]);

// }
onUpload(event){
  if (event.files && event.files[0]) 
  {
    var reader = new FileReader();
    var reader1 = new FileReader();
    reader.onload = (event: any) => {
    this.url = event.currentTarget.result;
    }
    reader.readAsDataURL(event.files[0]);
    reader1.onload = this._handleReaderLoaded.bind(this)
    reader1.readAsBinaryString(event.files[0]);
  }
  // this.changedprofilepic = true;
}
convertingfrom64(){
  var c1,c2,c3;
  var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var encoded = this.GuarantorDetails.PhotoImage;
var decoded = Base64.decode(encoded);
var extension = undefined;
var lowerCase = decoded.toLowerCase();
if (lowerCase.indexOf("png") !== -1) extension = "png"
else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
  extension = "jpg"
else extension = "tiff";
this.url = "data:image/" + extension + ";base64," + encoded;
}
_handleReaderLoaded(readerEvt) {
  var binaryString = readerEvt.target.result;
         this.base64Image= btoa(binaryString);
 }
ImportPatient()
{
  console.log("Import Patient button clicked");
  const modalRef = this.modalService.open(ModelviewComponent, {size: 'lg'});
  modalRef.componentInstance.openPopUp = true;
  modalRef.componentInstance.ComponentName = "guarantor";
  modalRef.componentInstance.PassPatient.subscribe((resp) =>{
    this.ImportedPatient = resp
    console.log("value of importedpatient is:",this.ImportedPatient)
    this.GuarantorOwnPolicyForm.patchValue({
      Ssn: this.ImportedPatient.Ssn,
      DateOfBirth: new Date(this.ImportedPatient.DateOfBirth),
      SalutationId: this.ImportedPatient.SalutationId,
      FirstName: this.ImportedPatient.FirstName,
      LastName: this.ImportedPatient.LastName,
      MiddleName:  this.ImportedPatient.MiddleName,
      Language1Id: this.ImportedPatient.Language1Id,
      RequiresInterpreter: this.ImportedPatient.RequiresInterpreter,
      Language2Id: this.ImportedPatient.Language2Id,
      Language3Id: this.ImportedPatient.Language3Id,
      PrimaryAddressLine1: this.ImportedPatient.PrimaryAddressLine1,
      PrimaryAddressLine2: this.ImportedPatient.PrimaryAddressLine2,
      PrimaryCity: this.ImportedPatient.PrimaryCity,
      PrimaryStateCode: this.ImportedPatient.PrimaryStateCode,
      PrimaryZipCode: this.ImportedPatient.PrimaryZipCode,
      PrimaryZipPlus4: this.ImportedPatient.PrimaryZipPlus4,
      SecondaryAddressLine1: this.ImportedPatient.SecondaryAddressLine1,
      SecondaryAddressLine2: this.ImportedPatient.SecondaryAddressLine2,
      SecondaryCity: this.ImportedPatient.SecondaryCity,
      SecondaryStateCode: this.ImportedPatient.SecondaryStateCode,
      SecondaryZipCode: this.ImportedPatient.SecondaryZipCode,
      SecondaryZipPlus4: this.ImportedPatient.SecondaryZipPlus4,
      WorkPhone: this.ImportedPatient.WorkPhone,
      HomePhone: this.ImportedPatient.HomePhone,
      MobilePhone: this.ImportedPatient.MobilePhone,
      AltPhone: this.ImportedPatient.AltPhone,
      Fax: this.ImportedPatient.Fax,
      Email1: this.ImportedPatient.Email1,
      Email2: this.ImportedPatient.Email2,
      Occupation: this.ImportedPatient.Occupation,
      GeneralNote: this.ImportedPatient.GeneralNote,
      Sex: this.ImportedPatient.Sex,
    })


  });
  
}

showerror(msg){
  this.toastr.error(msg);
}


calculateAge()
   {
     console.log("selected date of birth is: ", this.GuarantorOwnPolicyForm.get('DateofBirth').value);
    let dt = new Date();
    if (this.GuarantorOwnPolicyForm.get('DateofBirth').value >= dt) {
      this.DOBV = true
    } else {
      this.DOBV = false
    }
  }
}


