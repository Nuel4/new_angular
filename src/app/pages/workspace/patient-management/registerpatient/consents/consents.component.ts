import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input, ViewChild } from '@angular/core';
// import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientDto } from '../patientdetails/patientDetailForm.model';
import { ConsentsData } from '../../../../../model/Workspace/ConsentsData.model';
import { PatientmanagementService } from '../../../../../services/workspace/patient-management.service';
import { ToastrService } from 'ngx-toastr';
import {SimpleCrypto} from "simple-crypto-js";

@Component({
  selector: 'app-consents',
  templateUrl: './consents.component.html',
  styleUrls: ['./consents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsentsComponent implements OnInit {
  
  private patientid;
   patientData: any = {};
   portalData: any = {};
   showprtandchrge: boolean;
   secretKey = "some-unique-key";
crypto = new SimpleCrypto(this.secretKey)
   @Input()
   set _showprtandchrge(val: any){
     this.showprtandchrge = val;
   }
 
   get _showprtandchrge(): any {
     return this.showprtandchrge;
   }

  @Input()
  set _patientIdToEdit(val: any) {
    this.patientid = val;
    console.log("value of patient id in other consents form is",this.patientid)
    if(this.patientid > 0){
      this.initializeform()
    }
     
  }

  get _patientIdToEdit(): any {
    return this.patientid;
  }
  @Output() next = new EventEmitter();
  @Output() crgslip = new EventEmitter();
msg:string;
portalSelected:  boolean = true;
crpto: any;
  ConsentsData: ConsentsData;
  constructor(
    private routes: Router,
    private pms: PatientmanagementService,
    private toastr: ToastrService,
    // private simpleCrypto: SimpleCrypto
  ) { }

  ngOnInit() {
    // this.createform();
    // const crpto = new SimpleCrypto()
    this.initializeform();
//  console.log("Id generated",this.makeid(6));
// console.log("DEcrypted",this.crypto.decrypt(this.makeid(6)))
  }

  createform() {
    this.ConsentsData = {
      HipaaViaMail: null,
      HipaaViaVoice: null,
      HipaaViaNotice: null,
      HipaaViaMessage: null,
      HipaaAllowSms: null,
      HipaaAllowEmail: null,
      HippaAllowPhoneCall: null,
      HippaAllowPatientPortal: null,
      AcceptAssignment: null,
      isApproved: null,
      isActive: null,
      PasswordPolicy: null
    }
    this.initializeform();
  }

  initializeform(){
    this.pms.getPatientById(this.patientid).subscribe(resp => {
      if(resp != null){
      this.patientData = resp}
      console.log("value of patient data in consents are",this.patientData);
    
    // if (this.patientData.HipaaViaMail === false) {
    //   this.ConsentsData.HipaaViaMail = false
    // } else {
    //   this.ConsentsData.HipaaViaMail = true
    // }
    // if (this.patientData.HipaaViaVoice === false) {
    //   this.ConsentsData.HipaaViaVoice = false
    // } else {
    //   this.ConsentsData.HipaaViaVoice = true
    // }
    // if (this.patientData.HipaaViaNotice === false) {
    //   this.ConsentsData.HipaaViaNotice = false
    // } else {
    //   this.ConsentsData.HipaaViaNotice = true
    // }
    // if (this.patientData.HipaaViaMessage === false) {
    //   this.ConsentsData.HipaaViaMessage = false
    // } else {
    //   this.ConsentsData.HipaaViaMessage = true
    // }
    // if (this.patientData.HipaaAllowSms === false) {
    //   this.ConsentsData.HipaaAllowSms = false
    // } else {
    //   this.ConsentsData.HipaaAllowSms = true
    // }
    // if (this.patientData.HipaaAllowEmail === false) {
    //   this.ConsentsData.HipaaAllowEmail = false
    // } else {
    //   this.ConsentsData.HipaaAllowEmail = true
    // }
    // if (this.patientData.HippaAllowPhoneCall === false) {
    //   this.ConsentsData.HippaAllowPhoneCall = false
    // } else {
    //   this.ConsentsData.HippaAllowPhoneCall = true
    // }
    // if (this.patientData.HippaAllowPatientPortal === false) {
    //   this.ConsentsData.HippaAllowPatientPortal = false
    // } else {
    //   this.ConsentsData.HippaAllowPatientPortal = true
    // }
    // if (this.patientData.AcceptAssignment === false) {
    //   this.ConsentsData.AcceptAssignment = false
    // } else {
    //   this.ConsentsData.AcceptAssignment = true
    // }
  });
      
  }

  openNext() {
    // this.index = (this.index === 6) ? 0 : this.index + 1;
    this.next.emit();
  }

  onClose() {
    this.routes.navigate(['/pages/workspace/patientmanagement']);
  }

  patientportal(value) {
    if (value === true) {
      this.patientData.HipaaAllowEmail = true
      // this.allowEmail = true
    }

    console.log("value of patient portal is", value);
  }
  makeid() {
    // var result           = '';
    // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var charactersLength = characters.length;
    // for ( var i = 0; i < length; i++ ) {
    //    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    // }
    let r = Math.random().toString(36).substring(7);
    var encrypt = this.crypto.encrypt(r)
    return encrypt;
 }
 
postPatientLogin(){
  if(this.patientData.Email1 === null){
this.showError('Please provide email id')
  } else {
    
  let param = {
    // PatientLoginId: 0,
    PatientId: this.patientData.PatientId,
    IsApproved: this.portalData.isApproved ? this.portalData.isApproved : false,
    IsActive: this.portalData.isActive ? this.portalData.isActive : false,
    Username: this.patientData.Email1,
    Password: this.makeid(),
    DateCreated: new Date(),
    // VerificationNumber: null,
    DateVerified: new Date(),
    // ChangePasswordToken: null,
    ChangePasswordTokenExpiration: null,
    WelcomeMessageSent: true,
    EnforcePasswordPolicy: this.portalData.PasswordPolicy ? this.portalData.PasswordPolicy : false,
  }
  this.pms.postPatientLogin(param).subscribe(
    result => {
      console.log("result", result)
    }
  )
  }
}
  onSubmit(value) {
    const today = new Date();
    const UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    // delete this.ConsentsData['isApproved'];
    // delete this.ConsentsData['isActive'];
    // delete this.ConsentsData['PasswordPolicy'];
    // delete value['isApproved'];
    // delete value['isActive'];
    // delete value['PasswordPolicy'];
    console.log("value in the form is", value)
    console.log("consents in the form is", this.patientData)
    
    // if(value.AcceptAssignment === true){
    //   this.patientData.AcceptAssignment = value.AcceptAssignment
    // }else{
    //   this.patientData.AcceptAssignment = false
    // }
    // if(value.HipaaAllowEmail === true){
    //   this.patientData.HipaaAllowEmail = value.HipaaAllowEmail
    // }else {
    //   this.patientData.HipaaAllowEmail = false
    // }
    // if(value.HipaaAllowSms === true){
    //   this.patientData.HipaaAllowSms = value.HipaaAllowSms
    // }else{
    //   this.patientData.HipaaAllowSms = false
    // }
    // if(value.HipaaViaMail === true){
    //   this.patientData.HipaaViaMail = value.HipaaViaMail
    // }else{
    //   this.patientData.HipaaViaMail = false
    // }
    // if(value.HipaaViaMessage === true){
    //   this.patientData.HipaaViaMessage = value.HipaaViaMessage
    // }else{
    //   this.patientData.HipaaViaMessage = false
    // }
    // if(value.HipaaViaNotice === true){
    //   this.patientData.HipaaViaNotice = value.HipaaViaNotice
    // }else{
    //   this.patientData.HipaaViaNotice = false
    // }
    // if(value.HipaaViaVoice === true){
    //   this.patientData.HipaaViaVoice = value.HipaaViaVoice
    // }else{
    //   this.patientData.HipaaViaVoice = false
    // }
    // if(value.HippaAllowPatientPortal === true){
    //   this.patientData.HippaAllowPatientPortal = value.HippaAllowPatientPortal
    // }else{
    //   this.patientData.HippaAllowPatientPortal = false
    // }if(value.HippaAllowPhoneCall === true){
    //   this.patientData.HippaAllowPhoneCall = value.HippaAllowPhoneCall
    // }else{
    //   this.patientData.HippaAllowPhoneCall = false
    // }
    this.patientData.LastUpdatedByUserId = UserDetail.UserId
    this.patientData.DateLastUpdated = date
    this.pms.updatePatient(this.patientData).subscribe( resp => {
      this.msg = "Patient data updated successfully";
      this.showSuccess(this.msg)
      console.log("value of consents data are",resp)
    })
  }

    showSuccess(msg: string) {
      this.toastr.success(msg);
    
  }
showError(msg: string){
  this.toastr.error(msg)
}
  chargeSlips(data){
    this.crgslip.emit(data)
   }
portalChange(event){
  console.log("event", this.portalData.PasswordPolicy, this.portalData.isApproved, this.portalData.isActive)
  if(this.portalData.PasswordPolicy || this.portalData.isApproved || this.portalData.isActive){
    this.portalSelected = false;
  } else {
    this.portalSelected = true;
  }
}
}
