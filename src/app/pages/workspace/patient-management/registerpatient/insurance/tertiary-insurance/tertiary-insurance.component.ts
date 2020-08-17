import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InsuranceProviderService } from '../../../../../../services/billing/insuranceprovider.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {ViewhistorymodalComponent} from '../viewhistorymodal/viewhistorymodal.component'
import {DetailsModalComponent} from '../../../../calendar/add-appointment/details-modal/details-modal.component'
import {AppointmentService} from '../../../../../../services/workspace/appointment.service'
import { PatientmanagementService } from '../../../../../../services/workspace/patient-management.service'
@Component({
  selector: 'app-tertiary-insurance',
  templateUrl: './tertiary-insurance.component.html',
  styleUrls: ['./tertiary-insurance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TertiaryInsuranceComponent implements OnInit {
  patientIdToEdit;
  insuranceCompany;
  showprtandchrge: boolean;
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
  @Input() 
  set _insuranceCompany(val: any[]){
    this.insuranceCompany = val;
    // this.getinsurancedetails();
  }

  get _insuranceCompany(): any[] {
    return this.insuranceCompany;
  }
  // @Input() insuranceCompany: any;
  @Output() childnext = new EventEmitter();
  @Output() modal = new EventEmitter();
  @Output() chrgslip = new EventEmitter()
  public tertiaryInsuranceForm: FormGroup;
  // insuranceCompany: any = [];
  PatientInsuranceProviderId;
isSubmitted: boolean = false;
  insuranceCompanydetails: any = [];
  insuranceCategory: any = [];
  insuranceCategory1: any = [];
  submitted: boolean = false;
  testingdata: any;
  Guarantorvalue: boolean;
  postingresp: any;
  msg:string;
  Modalname = "PrimaryInsurance";
  isInsuranceCompany = true;
  InsuranceSelected: number;
  assignPolicyOwner;
  assignInsurance:any;
  patientDetailsData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private IPS: InsuranceProviderService,
    private modalService: NgbModal,
    private apptService: AppointmentService,
    private patientMngServ: PatientmanagementService
  ) { }

  ngOnInit() {
    this.createForm();
    this.getPatientvalues();
    // this.insuranceCompany = [
    //   { label: 'Aetna(AET)', value: null },
    //   { label: 'Cigna(CIG)', value: 1 },
    //   { label: 'LIC', value: 2 },
    //   { label: 'Medicare(MDCR)', value: 3 },
    //   { label: 'National Insurance Company', value: 4 }
    // ]
  }
  viewHistory(){
    console.log("clicked")
    const modRef = this.modalService.open(ViewhistorymodalComponent, {centered: true, size: 'lg'});
    modRef.componentInstance.order = 3;
    modRef.componentInstance.patientId = this.patientIdToEdit
  }
  getinsurancedetails(){
    this.patientIdToEdit = parseInt(this.patientIdToEdit);
    let params = {
      patientId: this.patientIdToEdit
    }
    this.IPS.getInsuranceByPatientId(params).subscribe(resp =>{
      if(resp != null){
      for(let i=0;i<resp.length;i++){
        if(resp[i].Order === 3){
          this.PatientInsuranceProviderId = resp[i].PatientInsuranceProviderId
          this.tertiaryInsuranceForm.patchValue(resp[i])
          if(resp[i].InsuredIsPatient === true){
            this.assignPolicyOwner = "true"
            this.tertiaryInsuranceForm.patchValue({
              InsuredIsPatient: "true"
            })
            this.Guarantorvalue = false
          } else {
            this.assignPolicyOwner = "false"
            this.tertiaryInsuranceForm.patchValue({
              InsuredIsPatient: "false"
            })
            this.Guarantorvalue = true
          }
          for(let j=0;j<this.insuranceCompany.length;j++)
          {
            if(resp[i].InsuranceProviderId === this.insuranceCompany[j].InsuranceProviderId){
              this.assignInsurance = this.insuranceCompany[j]
              this.InsuranceSelected = this.insuranceCompany[j].InsuranceProviderId
            }
          }
//         this.tertiaryInsuranceForm.patchValue({
//           PatientId: resp[i].PatientId,
//           InsuranceProviderId: resp[i].InsuranceProviderId,
//           Order: resp[i].Order,
//           PolicyNumber: resp[i].PolicyNumber,
//           Verified: resp[i].Verified,
//           VerificationDate: resp[i].VerificationDate,
//           Rejected: resp[i].Rejected,
//           RejectionReason: resp[i].RejectionReason,
//           GroupNumber: resp[i].GroupNumber,
//           EligibleForMedical: resp[i].EligibleForMedical,
//           EligibleForPrescriptions: resp[i].EligibleForPrescriptions,
//           EligibleForDurableMedicalEquipment: resp[i].EligibleForDurableMedicalEquipment,
//           EligibleForVision: resp[i].EligibleForVision,
//           EligibleForDental: resp[i].EligibleForDental,
//           EligibleForOtcMedications: resp[i].EligibleForOtcMedications,
//           EligibleForHospitalization: resp[i].EligibleForHospitalization,
//           WarnOnNextAppointment: resp[i].WarnOnNextAppointment,
//           WarnOnBilling: resp[i].WarnOnBilling,
//           AllowedVisits: resp[i].AllowedVisits,
//           VisitsUsed: resp[i].VisitsUsed,
//           AllowedAmount: resp[i].AllowedAmount,
//           AmountUsed: resp[i].AmountUsed,
//           VisitsWarning: resp[i].VisitsWarning,
//           AmountWarning: resp[i].AmountWarning,
//           CopayAmount: resp[i].CopayAmount,
//           InsuranceCode: resp[i].InsuranceCode,
//           EffectiveDateFrom: resp[i].EffectiveDateFrom,
//           ExpirationDate: resp[i].ExpirationDate,
//           DateCreated: resp[i].DateCreated,
//           CreatedByUserId: resp[i].CreatedByUserId,
//           DateLastUpdated: resp[i].DateLastUpdated,
//           LastUpdatedByUserId: resp[i].LastUpdatedByUserId,
//           // InsuredIsPatient: resp[i].InsuredIsPatient,
//           // InsuredIsGuarantor: resp[i].InsuredIsGuarantor,
//           PatientGuarantorId: resp[i].PatientGuarantorId,
//           IsCopayPercentage: resp[i].IsCopayPercentage,
//           SubmitterInsuranceNumber: resp[i].SubmitterInsuranceNumber,
//           SpecialistInsuranceCopayRequired: resp[i].SpecialistInsuranceCopayRequired,
//           PriorAuthorizationNumber: resp[i].PriorAuthorizationNumber,
//           ReferralStartDate: resp[i].ReferralStartDate,
//           ReferralExpiryDate: resp[i].ReferralExpiryDate,
//           AcceptAssignment: resp[i].AcceptAssignment,
//           OtherClaimId: resp[i].OtherClaimId,
//           primaryInsuranceCategory: resp[i].primaryInsuranceCategory,
//           // payer: resp[i].// payer,
//           // ReferralNumber: resp[i].ReferralNumber,
        
//         })
// if(resp[i].InsuredIsPatient === true){
//   this.InsuredIsPatient();
// }
// if(resp[i].InsuredIsGuarantor === true){
//   this.InsuredIsGuarantor();
// }
//         for(let j=0;j<this.insuranceCompany.length;j++){
// if(resp[i].InsuranceProviderId === this.insuranceCompany[j].InsuranceProviderId){
//   this.primaryInsuranceForm.patchValue({
//     InsuranceProviderId: this.insuranceCompany[j]
//   }) 
// }
//         }
      break;
      }
      }
      }
      });
  }

  private createForm() {
    this.tertiaryInsuranceForm = this.fb.group({
      PatientId: [""],
      InsuranceProviderId: [""],
      Order: [3],
      PolicyNumber: [""],
      Verified: [false],
      VerificationDate: [""],
      Rejected: [""],
      RejectionReason: [""],
      GroupNumber: [""],
      EligibleForMedical: [""],
      EligibleForPrescriptions: [""],
      EligibleForDurableMedicalEquipment: [""],
      EligibleForVision: [""],
      EligibleForDental: [""],
      EligibleForOtcMedications: [""],
      EligibleForHospitalization: [""],
      WarnOnNextAppointment: [""],
      WarnOnBilling: [""],
      AllowedVisits: [""],
      VisitsUsed: [""],
      AllowedAmount: [""],
      AmountUsed: [""],
      VisitsWarning: [""],
      AmountWarning: [""],
      CopayAmount: [""],
      InsuranceCode: [""],
      EffectiveDateFrom: [""],
      ExpirationDate: [""],
      DateCreated: [""],
      CreatedByUserId: [""],
      DateLastUpdated: [""],
      LastUpdatedByUserId: [""],
      InsuredIsPatient: [""],
      InsuredIsGuarantor: [""],
      PatientGuarantorId: [""],
      IsCopayPercentage: [""],
      SubmitterInsuranceNumber: [""],
      SpecialistInsuranceCopayRequired: [""],
      PriorAuthorizationNumber: [""],
      ReferralStartDate: [""],
      ReferralExpiryDate: [""],
      AcceptAssignment: [true],
      OtherClaimId: [""],
      primaryInsuranceCategory: [""], //delete it before submitting form
      ReferralNumber: [""] // delete it b4 submitting


      // tertiaryPolicyOwnedBy: null,
      // tertiaryInsuranceCompany: null,
      // tertiaryInsuranceCode: null,
      // tertiaryInsurancePayer: null,
      // tertiaryInsuranceCategory: null,
      // tertiaryPolicyNumber: null,
      // tertiaryGroupNumber: null,
      // tertiaryGroupNumberVerify: null,
      // tertiaryVerifyResults: null,
      // tertiaryVerificationDate: null,
      // tertiaryCopay:  null,
      // tertiaryEffectiveDate: null,
      // tertiaryExpirationDate: null,
      // tertiaryEligibleMedical: null,
      // tertiaryEligiblePrescriptions: null,
      // tertiaryEligibleVision: null,
      // tertiaryEligibleDental: null,
      // tertiaryEligibleHospitalization: null,
      // tertiaryEligibleDurableEquipment: null,
      // tertiaryAcceptAssignment: null,
      // tertiaryAllowableVisits: null,
      // tertiaryUsedVisits: null,
      // tertiaryReferralNumber: null,
      // tertiaryReferralStartDate: null,
      // tertiaryReferralExpiryDate: null
    });

    this.getinsurancedetails();
  }
  onNext(){
    this.childnext.emit();
  }
  onClose() {
    this.router.navigate(['/pages/workspace/patientmanagement']);
  }
  
  openmodal(){
  this.modal.emit(this.Modalname);
}


selectedInsurance(event) {
  let temp = event.value;
  if(temp || temp != null){
    this.isInsuranceCompany = false
    this.tertiaryInsuranceForm.patchValue({
      InsuredIsPatient: true,
      InsuredIsGuarantor: false
    });
  } else {
    this.isInsuranceCompany = true
  }
  this.InsuranceSelected = temp.InsuranceProviderId
  this.tertiaryInsuranceForm.patchValue({
    // InsuranceProviderId: temp.InsuranceProviderId,
    InsuranceCode: temp.InsuranceProviderCode,
    SubmitterInsuranceNumber: temp.SubmitterInsuranceNumber
  })
}
verificationResult() {
  console.log("patient detail" ,this.patientDetailsData)
  let payload = {
    patientName: this.patientDetailsData.LastName + ' ' + this.patientDetailsData.FirstName,
    limit: 3,
    offset: 0
  }
  console.log(payload)
  this.apptService.getPatientEligibilityVerificationforPaitent(payload).subscribe((res:any)=>{
    if(res.Results.length > 0) {
      let modalRef = this.modalService.open(DetailsModalComponent, { centered: true, size: 'lg' })
    modalRef.componentInstance.enableDetailsModal = true;
    modalRef.componentInstance.verificationDetails = res;
    modalRef.componentInstance.payload = payload;
    } else {
      let modalRef = this.modalService.open(DetailsModalComponent, { centered: true, size: 'sm' })
      modalRef.componentInstance.enableNoResults = true;
    }
  })
}
getPatientvalues() {
    
  // this.patientIdToEdit = parseInt(this.patientIdToEdit);
  this.patientMngServ.getPatientById(this.patientIdToEdit).subscribe(resp => {
    this.patientDetailsData = resp;      
    // this.InsuranceCategory();
  })
}
clearClick(){
  this.isInsuranceCompany = true
  this.assignInsurance = null
  this.tertiaryInsuranceForm.patchValue({
    // InsuranceProviderId: temp.InsuranceProviderId,
    InsuranceCode: '',
    SubmitterInsuranceNumber: ''
  })
}
 Verified() {
    this.tertiaryInsuranceForm.patchValue({
      Verified: true,
      Rejected: false
    });
  }

  Rejected() {
    this.tertiaryInsuranceForm.patchValue({
      Verified: false,
      Rejected: true
    });
  }
  
  showSuccess(msg) {
    this.toastr.success(this.msg);
  }

  showerror(msg){
    this.toastr.error(this.msg);
  }



  InsuredIsPatient() {
    let temp = this.tertiaryInsuranceForm.get('InsuredIsPatient').value
    this.tertiaryInsuranceForm.patchValue({
      InsuredIsPatient: true,
      InsuredIsGuarantor: false
    });
    this.Guarantorvalue = false
  
  }
  
  InsuredIsGuarantor() {
    let temp = this.tertiaryInsuranceForm.get('InsuredIsGuarantor').value;
    this.tertiaryInsuranceForm.patchValue({
      InsuredIsPatient: false,
      InsuredIsGuarantor: true
    });
    this.Guarantorvalue = true
  }

  onSubmit(value) {
    this.patientIdToEdit = parseInt(this.patientIdToEdit);
    let logindata = JSON.parse(sessionStorage.getItem('UserDetail'));
    logindata = logindata.UserId
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let temp = this.tertiaryInsuranceForm.get('InsuredIsPatient').value;
    if (temp === "false") {
      this.isSubmitted = false
    } else if (temp === "true") {
      this.isSubmitted = false
    } else {
      this.isSubmitted = true;
      this.msg = "Please Select Policy Owner"
      this.showerror(this.msg)
      return;
    }
    this.tertiaryInsuranceForm.patchValue({
      PatientId: this.patientIdToEdit
    });
    value.PatientId = this.patientIdToEdit;
    value.PatientId = this.patientIdToEdit;
    value.InsuranceProviderId = this.InsuranceSelected;
    if(this.Guarantorvalue === true){
      value.InsuredIsPatient = false,
      value.InsuredIsGuarantor = true
    } else {
      value.InsuredIsPatient = true,
      value.InsuredIsGuarantor = false
    }
    this.tertiaryInsuranceForm.patchValue({
      InsuranceProviderId: this.InsuranceSelected,
    });
    value.CreatedByUser = null;
    value.InsuranceProvider = null;
    value.LastUpdatedByUser = null;
    value.Patient = null;
    value.PatientGuarantor = null;

    if(this.PatientInsuranceProviderId > 0){
      value.PatientInsuranceProviderId = this.PatientInsuranceProviderId;
      value.DateLastUpdated = date
      value.LastUpdatedByUserId = logindata
      this.IPS.putpatientinsuranceproviders(value).subscribe(
        resp => {
         this.postingresp = resp
         this.msg = "tertiary Insurance details are updated successfully";
         this.showSuccess(this.msg) 
        });
    } else{
      value.DateCreated = date;
      value.CreatedByUserId = logindata;
      value.DateLastUpdated = date;
      value.LastUpdatedByUserId = logindata;
    this.IPS.postpatientinsuranceproviders(value).subscribe(
      resp => {
       this.postingresp = resp
       this.msg = "Primary Insurance details are saved successfully";
       this.showSuccess(this.msg) 
        // this.insuranceCategory = resp
      });
    }
    this.submitted = true;

    // // stop here if form is invalid
    // if (this.tertiaryInsuranceForm.invalid) {
    //     return;
    // }

  }
  chargeSlips(data){
    this.chrgslip.emit(data)
   }
}
