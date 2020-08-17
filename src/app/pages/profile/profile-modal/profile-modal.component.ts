import { AuthenticationStore } from './../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../../../services/profile/profile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileModalComponent implements OnInit {
@Input() viewModal;
@Input() password;
@Input() userInfo;
@Input() userSchedule;
@Input() pinNumber;
@Input() preferredIcd;
@Input() preferredCpt;
@Input() icdTitle;
appointmentDuration : any = [];
applicationUserId: any = {};
userPhysicianDetail : any;
license : any;
licenseState : any;
physicianByUserId: any;
npi : any;
physicalTaxIden : any;
drugEnforcementAdmin : any;
uniquePhysician : any;
physicianProviderCode : any;
medicare : boolean = false;
taxanomyCode : any;
  userName: any;
  newPassWord: any;
  confirmPassword: any;
  public imagePath;
  imgURL: string;
  public message: string;
  base64Image : any;
  selectedDuration: any = {};
  fileName: string;
  constructor(private modal: NgbActiveModal,private modalService: NgbModal,private toaster: ToastrService, private profileService: ProfileService,public authstore: AuthenticationStore) { }

  ngOnInit() {
    this.appointmentDuration = [
      {label: 1},
      {label: 2},
      {label: 3},
      {label: 4},
      {label: 5},
      {label: 6},
      {label: 7},
      {label: 8},
      {label:9},
      {label:10},
      {label:11},
      {label:12},
      {label:13},
      {label:14},
      {label:15},
      {label:16},
      {label:17},
      {label:18},
      {label:19},
      {label:20}
    ];
    if(this.password){
      this.getAppointmentUserDetail()
    }
    if(this.userInfo){
      this.getUserPhysicianId();
      this.getPhysicianIdByUserId();
      this.appointmentDuration.forEach(item => {
        if(item.label === this.physicianByUserId.AppointmentDurationMinutes){
          this.selectedDuration = item;
        }
      })
    }
  }
getAppointmentUserDetail(){
  let payload = {
    appuserId : this.authstore.UserDetail.ApplicationUserId
  }
  this.profileService.getApplicationUser(payload).subscribe(res => {
    this.applicationUserId = res;
    this.userName = this.applicationUserId.Username
  })
}
getUserPhysicianId(){
  let payload = {
    physicianId : this.authstore.PhysicianDetail.length ? this.authstore.PhysicianDetail[0].PhysicianId : this.authstore.PhysicianDetail.PhysicianId,
  }
  this.profileService.getUsersByPhyscianId(payload).subscribe(res => {
    this.userPhysicianDetail = res[0];
    
  })
}
getPhysicianIdByUserId(){
  let payload = {
    userId : this.authstore.UserDetail.UserId
  }
  this.profileService.getPhysicianIdByUserId(payload).subscribe(res => {
    this.physicianByUserId = res[0];
    this.license = this.physicianByUserId.License;
    this.licenseState = this.physicianByUserId.LicenseState;
    this.npi = this.physicianByUserId.NationalProviderIdentifier;
    this.physicalTaxIden = this.physicianByUserId.PhysicianTaxIdentifier;
    this.drugEnforcementAdmin = this.physicianByUserId.DrugEnforcementAdministrationNumber;
    this.uniquePhysician = this.physicianByUserId.UniquePhysicianIdentificationNumber;
    this.physicianProviderCode = this.physicianByUserId.ProviderCode;
    this.medicare = this.physicianByUserId.MedicareParticipant;
    this.taxanomyCode = this.physicianByUserId.TaxonomyCode;
    this.appointmentDuration.forEach(item => {
      if(item.label === this.physicianByUserId.AppointmentDurationMinutes){
        this.selectedDuration = item;
      }
    })
    if((this.physicianByUserId.SignatureImage === null)||(this.physicianByUserId.SignatureImage === ""))
    {
      this.imgURL = "../../../../assets/images/avatar.jpg"
    } else {
      this.imgURL = this.physicianByUserId.SignatureImage
    }
    this.convertingfrom64();
  })
}
convertingfrom64(){
var c1,c2,c3;
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var encoded = this.physicianByUserId.SignatureImage;
var decoded = Base64.decode(encoded);
var extension = undefined;
var lowerCase = decoded.toLowerCase();
if (lowerCase.indexOf("png") !== -1) extension = "png"
else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
  extension = "jpg"
else extension = "tiff";
this.imgURL = "data:image/" + extension + ";base64," + encoded;
}
editUserInfo(){
  if(this.npi === undefined || this.physicalTaxIden === undefined){
    this.toaster.error('Please Select Mandatory Fields');
  }
  let sign = this.imgURL.slice(23)
  let payload = {
    PhysicianId : this.physicianByUserId.PhysicianId,
    UserId : this.physicianByUserId.UserId,
    License : this.license,
    LicenseState :  this.licenseState,
    SignatureImage : sign,
    NationalProviderIdentifier : this.npi,
    PhysicianTaxIdentifier : this.physicalTaxIden,
    DrugEnforcementAdministrationNumber: this.drugEnforcementAdmin,
    UniquePhysicianIdentificationNumber : this.uniquePhysician,
    MedicareParticipant : this.medicare,
    TaxonomyCode: this.taxanomyCode,
    ProviderCode: this.physicianProviderCode,
    DateCreated: this.physicianByUserId.DateCreated,
    CreatedByUserId:this.physicianByUserId.CreatedByUserId,
    DateLastUpdated : new Date(),
    LastUpdatedByUserId : this.authstore.UserDetail.UserId,
    AppointmentDurationMinutes: this.selectedDuration.label,
    SignatureImageFileName:this.fileName,
    AppointmentStart:this.physicianByUserId.AppointmentStart,
    AppointmentEnd: this.physicianByUserId.AppointmentEnd,
    LunchBreakStart:this.physicianByUserId.LunchBreakStart,
    LunchBreakEnd: this.physicianByUserId.LunchBreakEnd,
    StateLicenseNumber: this.physicianByUserId.StateLicenseNumber,
    GroupNationalPhysicianIdentifier: this.physicianByUserId.GroupNationalPhysicianIdentifier,
    SpecialtyLicense:this.physicianByUserId.SpecialtyLicense,
    ClaimsSubmitterId: this.physicianByUserId.ClaimsSubmitterId,
    MammographyCertificationNumber: this.physicianByUserId.MammographyCertificationNumber,
    CarePlanOversightNumber: this.physicianByUserId.CarePlanOversightNumber,
    HospiceEmployed: this.physicianByUserId.HospiceEmployed,
    RequirePatientEligibilityVerification: this.physicianByUserId.RequirePatientEligibilityVerification,
    OtherLicenseNumber: this.physicianByUserId.OtherLicenseNumber,
    OtherLicenseDescription: this.physicianByUserId.OtherLicenseDescription
  }
  this.profileService.updatePhysician(payload).subscribe(res => {
    this.toaster.success('Succefully Updated');
  })
}
changePin(){
  if(this.pinNumber === undefined){
    this.toaster.warning('Please select Mandatory fields');
  }
  let payload = {
    UserId: this.authstore.UserDetail.UserId,
    Username: this.authstore.UserDetail.Username,
    Password: this.authstore.UserDetail.Password,
    Inactive: this.authstore.UserDetail.Inactive,
    FirstName : this.authstore.UserDetail.FirstName,
    MiddleName: this.authstore.UserDetail.MiddleName,
    LastName: this.authstore.UserDetail.LastName,
    Ssn: this.authstore.UserDetail.Ssn,
    SalutationId: this.authstore.UserDetail.SalutationId,
    PrimaryAddressLine1 : this.authstore.UserDetail.PrimaryAddressLine1,
    PrimaryAddressLine2: this.authstore.UserDetail.PrimaryAddressLine2,
    PrimaryCity : this.authstore.UserDetail.PrimaryCity,
    PrimaryStateCode : this.authstore.UserDetail.PrimaryStateCode,
    PrimaryZipCode: this.authstore.UserDetail.PrimaryZipCode,
    PrimaryZipPlus4 : this.authstore.UserDetail.PrimaryZipPlus4,
    SecondaryAddressLine1 : this.authstore.UserDetail.SecondaryAddressLine1,
    SecondaryAddressLine2 : this.authstore.UserDetail.SecondaryAddressLine2,
    SecondaryCity : this.authstore.UserDetail.SecondaryCity,
    SecondaryStateCode : this.authstore.UserDetail.SecondaryStateCode,
    SecondaryZipCode: this.authstore.UserDetail.SecondaryZipCode,
    SecondaryZipPlus4: this.authstore.UserDetail.SecondaryZipPlus4,
    HasInternationalAddress: this.authstore.UserDetail.HasInternationalAddress,
    WorkPhone: this.authstore.UserDetail.WorkPhone,
    HomePhone: this.authstore.UserDetail.HomePhone,
    MobilePhone: this.authstore.UserDetail.MobilePhone,
    AltPhone: this.authstore.UserDetail.AltPhone,
    Fax: this.authstore.UserDetail.Fax,
    PhotoImage: this.authstore.UserDetail.PhotoImage,
    Email1: this.authstore.UserDetail.Email1,
    Email2: this.authstore.UserDetail.Email2,
    GeneralNote: this.authstore.UserDetail.GeneralNote,
    DateCreated:this.authstore.UserDetail.DateCreated,
    CreatedByUserId : this.authstore.UserDetail.CreatedByUserId,
    DateLastUpdated: new Date(),
    LastUpdatedByUserId : this.authstore.UserDetail.LastUpdatedByUserId,
    PreferredFacility1: this.authstore.UserDetail.PreferredFacility1,
    PreferredFacility2: this.authstore.UserDetail.PreferredFacility2,
    PreferredFacility3 : this.authstore.UserDetail.PreferredFacility3,
    PreferredPhysician1 : this.authstore.UserDetail.PreferredPhysician1,
    PreferredPhysician2: this.authstore.UserDetail.PreferredPhysician2,
    PreferredPhysician3: this.authstore.UserDetail.PreferredPhysician3,
    ApplicationUserId: this.authstore.UserDetail.ApplicationUserId,
    WorkPhoneExt: this.authstore.UserDetail.WorkPhoneExt,
    License: this.authstore.UserDetail.License,
    AppointmentDurationMinutes: this.authstore.UserDetail.AppointmentDurationMinutes,
    Pin: this.pinNumber,
    DrFirstPracticeUsername: this.authstore.UserDetail.DrFirstPracticeUsername,
    DrFirstPracticeUsernameProduction: this.authstore.UserDetail.DrFirstPracticeUsernameProduction
  }
  this.profileService.updateUsers(payload).subscribe(res => {
    this.toaster.success('Successfully Updated');
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  })
}
  
changePassword(control,confirmPassword){
  if(this.userName === undefined || this.newPassWord === undefined || this.confirmPassword === undefined){
    this.toaster.warning('Please fill the Mandatory fields');
  }
  if(control === confirmPassword){
    if (control !== undefined) {
      if ((!control.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) && (!control.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/))) {
        this.toaster.warning('Invalid Password,password should contains caps,small letter and numbers.')
      }
    }
  }
          else{
            //here i need to add check for special characters
            this.toaster.warning('Password does not match')
          }
  let payload = {
    username: this.userName,
    password: this.newPassWord,
    applicationUserId : this.authstore.UserDetail.ApplicationUserId
  }
  this.profileService.updateSalteHash(payload).subscribe(res => {
    this.toaster.success('Successfully Updated');
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  })
}
uploadImage(event) 
{
  this.fileName = event.target.files[0].name
  if (event.target.files && event.target.files[0]) 
  {
    var reader = new FileReader();
    var reader1 = new FileReader();
    reader.onload = (event: any) => {
    this.imgURL = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    reader1.onload = this._handleReaderLoaded.bind(this)
    reader1.readAsBinaryString(event.target.files[0]);
  }
  // this.changedprofilepic = true;
}
_handleReaderLoaded(readerEvt) {
  var binaryString = readerEvt.target.result;
         this.base64Image= btoa(binaryString);
 }
}
