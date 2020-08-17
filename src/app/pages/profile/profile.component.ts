import { ProfileService } from './../../services/profile/profile.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { AuthenticationStore } from '../../authentication/authentication-store';
import { ChartTilePickerComponent} from './chart-tile-picker/chart-tile-picker.component'
import {SelectItem} from 'primeng/api';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  SpecialityList: { name: string; code: string; }[];
  PreferredTemplateGrpList: { name: string; code: string; }[];
  MessageTypeList: { name: string; code: string; }[];
  QualificationList: { name: string; code: string; }[];
  base64Image: string;
  url: any;
  salutation: any;
  selectedSalutation: any;
  selectedFacility: any;
  userDetails: any;
  firstname: any;
  lastname: any;
  middlename: any;
  SSN: any;
  workPhone: any;
  homePhone: any;
  cellPhone: any;
  email: any;
  altEmail: any;
  fax: any;
  altPhone: any;
  paddressline1: any;
  paddressline2: any;
  pcity: any;
  pstatecode: any;
  pzipcode: any;
  pzip4: any;
  saddressline1: any;
  saddressline2: any;
  scity: any;
  sstatecode: any;
  szipcode: any;
  szip4: any;
  qualification : any;
  selectedSpeciality: any=[];
  selectedQualification : any=[];
  specialityList : any;
  selectedPreferredTemplateGrp: any=[];
  selectedMessageType : any=[];
  facility: any;
  cdsMessageType: any;
  activeTemplateGroup: any=[];
  cdsMessageTypePreference: any;
  physicianTemplateGroup: any;
  internationalAddress: boolean = false;
  generalNote : any;
  getUsers: any = {};
  nonPhysician: boolean = false;
  physicianDetail : boolean = false;
  physicianUsers: any;
  preferredFacility: any;
  selectedPreferredFacility: any;
  selectedPhysicianUsers : any = {};
  selectedPhysicianUsers2: any = {};
  selectedPhysicianUsers3: any = {};
  constructor(private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService,private profileService: ProfileService,public authstore: AuthenticationStore) { }

  ngOnInit() {
    this.getUserwithChildTable();
    
    this.SpecialityList = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    this.QualificationList = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    this.MessageTypeList = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    this.PreferredTemplateGrpList = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
   
  }
  pinModal(){
    const modRef = this.modalService.open(ProfileModalComponent,  { centered: true, size: 'sm', windowClass: 'modelStyle' });
    modRef.componentInstance.viewModal = true;
    modRef.componentInstance.pinNumber = this.userDetails.Pin
  }
  changePassword(){
    const modRef = this.modalService.open(ProfileModalComponent,  { centered: true, size: 'sm', windowClass: 'modelStyle' });
    modRef.componentInstance.password = true;
  }
  editUserInfo(){
    this.profileService.getUsers(this.userDetails.UserId).subscribe(res => {
    this.getUsers = res;
    let photo = this.url.slice(23)
    let payload = {
      UserId: this.getUsers.UserId,
      Username:this.getUsers.Username,
      Password: this.getUsers.Password,
      Inactive : false,
      FirstName: this.firstname,
      MiddleName: this.middlename,
      LastName:this.lastname,
      Ssn: this.SSN,
      SalutationId: this.selectedSalutation.SalutationId,
      PrimaryAddressLine1: this.paddressline1,
      PrimaryAddressLine2 : this.paddressline2,
      PrimaryCity : this.pcity,
      PrimaryStateCode : this.pstatecode,
      PrimaryZipCode : this.pzipcode,
      PrimaryZipPlus4 : this.pzip4,
      SecondaryAddressLine1:this.saddressline1,
      SecondaryAddressLine2 : this.saddressline2,
      SecondaryCity : this.scity,
      SecondaryStateCode : this.sstatecode,
      SecondaryZipCode: this.szipcode,
      SecondaryZipPlus4 : this.szip4,
      HasInternationalAddress : this.internationalAddress,
      WorkPhone : this.workPhone,
      HomePhone : this.homePhone,
      MobilePhone: this.cellPhone,
      AltPhone: this.altPhone,
      Fax : this.fax,
      Email1: this.email,
      Email2 : this.altEmail,
      GeneralNote:this.generalNote,
      DateCreated: this.getUsers.DateCreated,
      CreatedByUserId: this.getUsers.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authstore.UserDetail.UserId,
      PreferredFacility1: this.selectedFacility.FacilityId,
      PreferredFacility2:null,
      PreferredFacility3:null,
      PreferredPhysician1:this.selectedPhysicianUsers.physicianName ? this.selectedPhysicianUsers.physicianName:null,
      PreferredPhysician2:this.selectedPhysicianUsers2.physicianName ? this.selectedPhysicianUsers2.physicianName:null,
      PreferredPhysician3:this.selectedPhysicianUsers3.physicianName ? this.selectedPhysicianUsers3.physicianName:null,
      ApplicationUserId: this.getUsers.ApplicationUserId,
      WorkPhoneExt: this.workPhone,
      License: this.getUsers.License,
      AppointmentDurationMinutes: this.getUsers.AppointmentDurationMinutes,
      Pin: this.getUsers.Pin,
      DrFirstPracticeUsername : this.getUsers.DrFirstPracticeUsername,
      DrFirstPracticeUsernameProduction : this.getUsers.DrFirstPracticeUsernameProduction,
      PhotoImage: photo,
  }
    this.profileService.updateUsers(payload).subscribe(res => {
    })
  })
    const modRef = this.modalService.open(ProfileModalComponent,  { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.userInfo = true;
  }
  preferredIcds(){
    const modRef = this.modalService.open(ProfileModalComponent,  { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.preferredIcd = true;
    modRef.componentInstance.icdTitle = true
  }
  preferredCpt(){
    const modRef = this.modalService.open(ProfileModalComponent,  { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.preferredCpt = true;
  }
  userSchedule(){
    const modRef = this.modalService.open(ProfileModalComponent, {centered: true, size: 'lg', windowClass: 'modelStyle'});
    modRef.componentInstance.userSchedule = true;
    
  }
  getSalutationCode(){
    this.profileService.getSalutations().subscribe(res => {
      this.salutation = res;
      this.salutation.forEach(key => {
        if(key.SalutationId === this.userDetails.SalutationId){
          this.selectedSalutation = key;
        }
      })
    })
  }
  getUserwithChildTable(){
    let payload = {
      userId : this.authstore.UserDetail.UserId
    }
    this.profileService.getUsersWithChildTables(payload).subscribe(res => {
      this.userDetails = res;
      this.firstname = this.userDetails.FirstName;
      this.lastname = this.userDetails.LastName;
      this.middlename = this.userDetails.MiddleName;
      this.SSN = this.userDetails.Ssn;
      this.workPhone = this.userDetails.WorkPhone;
      this.homePhone = this.userDetails.HomePhone;
      this.cellPhone = this.userDetails.MobilePhone;
      this.email = this.userDetails.Email1;
      this.altEmail = this.userDetails.Email2;
      this.fax = this.userDetails.Fax;
      this.altPhone = this.userDetails.AltPhone;
      this.paddressline1 = this.userDetails.PrimaryAddressLine1;
      this.paddressline2 = this.userDetails.PrimaryAddressLine2;
      this.pcity = this.userDetails.PrimaryCity;
      this.pstatecode = this.userDetails.PrimaryStateCode;
      this.pzipcode = this.userDetails.PrimaryZipCode;
      this.pzip4 = this.userDetails.PrimaryZipPlus4;
      this.saddressline1 = this.userDetails.SecondaryAddressLine1;
      this.saddressline2 = this.userDetails.SecondaryAddressLine2;
      this.scity = this.userDetails.SecondaryCity;
      this.sstatecode = this.userDetails.SecondaryStateCode;
      this.szipcode = this.userDetails.SecondaryZipCode;
      this.szip4 = this.userDetails.SecondaryZipPlus4;
      this.generalNote = this.userDetails.GeneralNote;
      this.internationalAddress = this.userDetails.HasInternationalAddress;
      if((this.userDetails.PhotoImage === null)||(this.userDetails.PhotoImage === ""))
      {
        this.url = "../../../../../../assets/images/avatar.jpg"
      } else {
        this.url = this.userDetails.PhotoImage
      }
      this.getPreferredFacility();
      this.getSalutationCode();
      this.getFacility();
      this.getSpeciality();
      this.getQualification();
      this.getCdsMessageType();
      this.getActiveTemplateGroup();
      this.convertingfrom64();
    })
  }
  convertingfrom64(){
    var c1,c2,c3;
    var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
var encoded = this.userDetails.PhotoImage;
var decoded = Base64.decode(encoded);
var extension = undefined;
var lowerCase = decoded.toLowerCase();
if (lowerCase.indexOf("png") !== -1) extension = "png"
else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
    extension = "jpg"
else extension = "tiff";
this.url = "data:image/" + extension + ";base64," + encoded;
  }
  getSpeciality(){
    this.profileService.getSpeciality().subscribe(res => {
      this.specialityList = res;
      this.specialityList.map(item => {
        this.userDetails.UserSpecialityUsers.map(key => {
          if(item.SpecialityId === key.SpecialityId){
            this.selectedSpeciality.push(item);
          }
        })
      })
    })
  }
  getCdsMessageType(){
    this.profileService.getCdsMessageType().subscribe(res => {
      this.cdsMessageType = res;
      let payload = {
        userId : this.authstore.UserDetail.UserId
      }
      this.profileService.getCdsMessageTypePreferences(payload).subscribe(res => {
        this.cdsMessageTypePreference = res;
        this.cdsMessageTypePreference.forEach(ele => {
        this.cdsMessageType.forEach(item => {
            if(item.CdsMessageTypeId === ele.CdsMessageTypeId){
              this.selectedMessageType.push(item)
            }
          })
        })
      })
     
    })
  }
  getQualification(){
    this.profileService.getQualification().subscribe(res => {
      this.qualification = res;
      this.qualification.map(ele => {
        this.userDetails.UserQualificationUsers.map(qua => {
          if(ele.QualificationId === qua.QualificationId){
            this.selectedQualification.push(ele)
          }
        })
      })
    })
  }
  getFacility(){
    this.profileService.getFacilities().subscribe(res => {
      this.facility = res;
      this.facility.forEach(item => {
        if(item.FacilityId === this.userDetails.PreferredFacility1){
          this.selectedFacility = item;
        }
      })
    })
  }
  getActiveTemplateGroup(){
    this.profileService.getActiveTemplateGroup().subscribe(res => {
      this.activeTemplateGroup = res;
      let payload = { 
        physicianId : this.authstore.PhysicianDetail.length ? this.authstore.PhysicianDetail[0].PhysicianId : this.authstore.PhysicianDetail.PhysicianId,
      }
      this.profileService.getPhysicianCommonTemplateGroup(payload).subscribe(res => {
        this.physicianTemplateGroup = res;
        this.physicianTemplateGroup.forEach(ele => {
          this.activeTemplateGroup.forEach(item => {
            if(item.MrTemplateGroupId === ele.MrTemplateGroupId){
              this.selectedPreferredTemplateGrp.push(item)
            }
          })
        })
      })
      
    })
  }
 
  tilePicker(){
   const modRef = this.modalService.open(ChartTilePickerComponent, {centered: true, size: 'lg'})
  }
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
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           this.base64Image= btoa(binaryString);
   }
  getPreferredFacility(){
    if(this.authstore.PhysicianDetail.length === 0){
    this.nonPhysician = true;
    this.physicianDetail = false;
      let payload = {
        pFacilityName : 'a'
      }
      this.profileService.getFacilitiesByName(payload).subscribe(res => {
        this.preferredFacility = res;
        this.preferredFacility.forEach(item => {
          if(item.FacilityId === this.userDetails.PreferredFacility1){
            this.selectedPreferredFacility = item;
          }
        })
      })
      let physicianUsers = {
        facilityID : this.userDetails.PreferredFacility1
      }
      this.profileService.getPhysicianUsers(physicianUsers).subscribe(res => {
        this.physicianUsers = res;
      })
      
    }
    else{
      this.nonPhysician = false;
      this.physicianDetail = true;
    }
  }
}
