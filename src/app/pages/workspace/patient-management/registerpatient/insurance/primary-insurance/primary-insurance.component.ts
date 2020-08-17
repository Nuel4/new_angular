import { Component, OnInit, EventEmitter, ViewEncapsulation, Output, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InsuranceProviderService } from '../../../../../../services/billing/insuranceprovider.service';
import { PatientmanagementService } from '../../../../../../services/workspace/patient-management.service'
import {DetailsModalComponent} from '../../../../calendar/add-appointment/details-modal/details-modal.component'
import {AppointmentService} from '../../../../../../services/workspace/appointment.service'
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {ViewhistorymodalComponent} from '../viewhistorymodal/viewhistorymodal.component'
@Component({
  selector: 'app-primary-insurance',
  templateUrl: './primary-insurance.component.html',
  styleUrls: ['./primary-insurance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrimaryInsuranceComponent implements OnInit {
  patientIdToEdit
  insuranceCompany
  showprtandchrge: boolean;
  patientDetailsData: any = [];
  primaryInsurance: any;
  isInsuranceCompany = true;
  insuranceProviderForPatient: any;
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
    // this.getinsurancedetails();
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
 
  // _insuranceCompany: any[];
  @Output() PIData = new EventEmitter();
  @Output() childnext = new EventEmitter();
  @Output() modal = new EventEmitter();
  @Output() chrgslip = new EventEmitter()
  @Output() policyNumber = new EventEmitter()
  public primaryInsuranceForm: FormGroup;
  InsuranceSelected: number;
  isSubmitted: boolean = false;
  insuranceCategory: any = [];
  insuranceCategory1: any = [];
  submitted: boolean = false;
  testingdata: any;
  Guarantorvalue: boolean;
  postingresp: any;
  assignInsurance:any;
  assignPolicyOwner;
  msg:string;
  PatientInsuranceProviderId;
  Modalname = "PrimaryInsurance";
  selectedInsuCategory:any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private IPS: InsuranceProviderService,
    private toastr: ToastrService,
     private patientMngServ: PatientmanagementService,
     private apptService: AppointmentService,
     private modalService: NgbModal
  ) { }

  ngOnInit() {
    // this.primaryInsuranceForm = this.fb.group({
    //   'InsuredIsPatient': new FormControl('', Validators.required),
    //   'InsuredIsPolicy': new FormControl('', Validators.required),
    //   'InsuranceProviderId': new FormControl(''),
    //   'InsuranceCode': new FormControl(''),
    //   'SubmitterInsuranceNumber': new FormControl(''),
    //   'primaryInsuranceCategory': new FormControl(''),
    //   'PolicyNumber': new FormControl(''),
    //   'GroupNumber': new FormControl(''),
    //   'Verified': new FormControl(''),
    //   'Rejected': new FormControl(''),
    //   'RejectionReason': new FormControl(''),
    //   'CopayAmount': new FormControl(''),
    //   'VerificationDate': new FormControl(''),
    //   'EffectiveDateFrom': new FormControl(''),
    //   'ExpirationDate': new FormControl(''),
    //   'EligibleForMedical': new FormControl(''),
    //   'EligibleForPrescriptions': new FormControl(''),
    //   'EligibleForVision': new FormControl(''),
    //   'EligibleForDental': new FormControl(''),
    //   'EligibleForHospitalization': new FormControl(''),
    //   'EligibleForDurableMedicalEquipment':new FormControl(''),
    //   'AcceptAssignment':new FormControl(''),
    //   'AllowedVisits':new FormControl(''),
    //   'VisitsUsed':new FormControl(''),
    //   'ReferralNumber':new FormControl(''),
    //   'ReferralStartDate':new FormControl(''),
    //   'ReferralExpiryDate':new FormControl(''),
    // });
  
// this.setInsuranceCompany();
this.createForm();
// this.getinsurancedetails();
this.getPatientvalues()
    // this.insuranceCompany = [
    //   { label: 'Aetna(AET)', value: null },
    //   { label: 'Cigna(CIG)', value: 1 },
    //   { label: 'LIC', value: 2 },
    //   { label: 'Medicare(MDCR)', value: 3 },
    //   { label: 'National Insurance Company', value: 4 }
    // ],
    // this.insuranceCategory = [
    //   { label: 'AE', value: null },
    //   { label: 'CI', value: 1 },
    //   { label: 'MG', value: 2 },
    // ]
    // this.createForm();
    
  }
  verificationResult() {
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
  viewHistory(){
    console.log("clicked")
    const modRef = this.modalService.open(ViewhistorymodalComponent, {centered: true, size: 'lg'});
    modRef.componentInstance.order = 1;
    modRef.componentInstance.patientId = this.patientIdToEdit
  }
  getinsurancedetails(){
   
    
    this.patientIdToEdit = parseInt(this.patientIdToEdit);
    
    let params = {
      patientId: this.patientIdToEdit
    }
    this.IPS.getInsuranceByPatientId(params).subscribe(resp =>{
      this.insuranceProviderForPatient = resp;
      if(resp != null){
      for(let i=0;i<resp.length;i++){
        if(resp[i].Order === 1){
          this.PatientInsuranceProviderId = resp[i].PatientInsuranceProviderId
          this.primaryInsurance = resp[i].PolicyNumber
          // this.primaryInsuranceForm.patchValue(resp[i]);
          if(resp[i].InsuredIsPatient === true){
            this.assignPolicyOwner = "true"
            this.primaryInsuranceForm.patchValue({
              InsuredIsPatient: "true"
            })
            this.Guarantorvalue = false
          } else {
            this.assignPolicyOwner = "false"
            this.primaryInsuranceForm.patchValue({
              InsuredIsPatient: "false",

            })
            this.Guarantorvalue = true
          }
          // if(resp[i].InsuredIsGuarantor === true){
          //   this.primaryInsurance.patchValue({
          //     InsuredIsGuarantor: true
          //   })
          // } else {
          //   this.primaryInsurance.patchValue({
          //     InsuredIsGuarantor: false,
          //     InsuredIsPatient: true
          //   })
          // }
          for(let j=0;j<this.insuranceCompany.length;j++)
          {
            if(resp[i].InsuranceProviderId === this.insuranceCompany[j].InsuranceProviderId){
              this.assignInsurance = this.insuranceCompany[j]
              this.isInsuranceCompany = false
              this.InsuranceSelected = this.insuranceCompany[j].InsuranceProviderId
            }
              // this.primaryInsuranceForm.patchValue({InsuranceProviderId: new FormControl(this.insuranceCompany[j].InsuranceProviderName) }) }
          }
          
          // this.primaryInsuranceForm = resp[0];
        // this.primaryInsuranceForm.patchValue({
        //   PatientId: resp[i].PatientId,
        //   InsuranceProviderId: resp[i].InsuranceProviderId,
        //   Order: resp[i].Order,
        //   PolicyNumber: resp[i].PolicyNumber,
        //   Verified: resp[i].Verified,
        //   VerificationDate: resp[i].VerificationDate,
        //   Rejected: resp[i].Rejected,
        //   RejectionReason: resp[i].RejectionReason,
        //   GroupNumber: resp[i].GroupNumber,
        //   EligibleForMedical: resp[i].EligibleForMedical,
        //   EligibleForPrescriptions: resp[i].EligibleForPrescriptions,
        //   EligibleForDurableMedicalEquipment: resp[i].EligibleForDurableMedicalEquipment,
        //   EligibleForVision: resp[i].EligibleForVision,
        //   EligibleForDental: resp[i].EligibleForDental,
        //   EligibleForOtcMedications: resp[i].EligibleForOtcMedications,
        //   EligibleForHospitalization: resp[i].EligibleForHospitalization,
        //   WarnOnNextAppointment: resp[i].WarnOnNextAppointment,
        //   WarnOnBilling: resp[i].WarnOnBilling,
        //   AllowedVisits: resp[i].AllowedVisits,
        //   VisitsUsed: resp[i].VisitsUsed,
        //   AllowedAmount: resp[i].AllowedAmount,
        //   AmountUsed: resp[i].AmountUsed,
        //   VisitsWarning: resp[i].VisitsWarning,
        //   AmountWarning: resp[i].AmountWarning,
        //   CopayAmount: resp[i].CopayAmount,
        //   InsuranceCode: resp[i].InsuranceCode,
        //   EffectiveDateFrom: resp[i].EffectiveDateFrom,
        //   ExpirationDate: resp[i].ExpirationDate,
        //   DateCreated: resp[i].DateCreated,
        //   CreatedByUserId: resp[i].CreatedByUserId,
        //   DateLastUpdated: resp[i].DateLastUpdated,
        //   LastUpdatedByUserId: resp[i].LastUpdatedByUserId,
        //   InsuredIsPatient: resp[i].InsuredIsPatient,
        //   InsuredIsGuarantor: resp[i].InsuredIsGuarantor,
        //   PatientGuarantorId: resp[i].PatientGuarantorId,
        //   IsCopayPercentage: resp[i].IsCopayPercentage,
        //   SubmitterInsuranceNumber: resp[i].SubmitterInsuranceNumber,
        //   SpecialistInsuranceCopayRequired: resp[i].SpecialistInsuranceCopayRequired,
        //   PriorAuthorizationNumber: resp[i].PriorAuthorizationNumber,
        //   ReferralStartDate: resp[i].ReferralStartDate,
        //   ReferralExpiryDate: resp[i].ReferralExpiryDate,
        //   AcceptAssignment: resp[i].AcceptAssignment,
        //   OtherClaimId: resp[i].OtherClaimId,
        //   primaryInsuranceCategory: resp[i].primaryInsuranceCategory,
        //   payer: resp[i].payer,
        //   ReferralNumber: resp[i].ReferralNumber,
        
        // })
        
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
this.primaryInsuranceForm = this.fb.group({
      'InsuredIsPatient': new FormControl(resp[i].InsuredIsPatient),
      'InsuredIsPolicy': new FormControl(resp[i].InsuredIsGuarantor),
      'InsuranceProviderId': new FormControl(resp[i].InsuranceProviderId),
      'InsuranceCode': new FormControl(resp[i].InsuranceCode),
      'SubmitterInsuranceNumber': new FormControl(resp[i].SubmitterInsuranceNumber),
      'primaryInsuranceCategory': new FormControl(''),
      'PolicyNumber': new FormControl(resp[i].PolicyNumber),
      'GroupNumber': new FormControl(resp[i].GroupNumber),
      'Verified': new FormControl(resp[i].Verified),
      'Rejected': new FormControl(resp[i].Rejected),
      'RejectionReason': new FormControl(resp[i].RejectionReason),
      'CopayAmount': new FormControl(resp[i].CopayAmount),
      'VerificationDate': new FormControl(resp[i].VerificationDate == null ? undefined: new Date(resp[i].VerificationDate)),
      'EffectiveDateFrom': new FormControl(resp[i].EffectiveDateFrom == null ? undefined: new Date(resp[i].EffectiveDateFrom)),
      'ExpirationDate': new FormControl(resp[i].ExpirationDate == null ? undefined: new Date(resp[i].ExpirationDate)),
      'EligibleForMedical': new FormControl(resp[i].EligibleForMedical),
      'EligibleForPrescriptions': new FormControl( resp[i].EligibleForPrescriptions),
      'EligibleForVision': new FormControl(resp[i].EligibleForVision),
      'EligibleForDental': new FormControl(resp[i].EligibleForDental),
      'EligibleForHospitalization': new FormControl( resp[i].EligibleForHospitalization),
      'EligibleForDurableMedicalEquipment':new FormControl(resp[i].EligibleForDurableMedicalEquipment),
      'AcceptAssignment':new FormControl(resp[i].AcceptAssignment),
      'AllowedVisits':new FormControl(resp[i].AllowedVisits),
      'VisitsUsed':new FormControl(resp[i].VisitsUsed),
      'ReferralNumber':new FormControl(resp[i].ReferralNumber),
      'ReferralStartDate':new FormControl(resp[i].ReferralStartDate == null ? undefined : new Date(resp[i].ReferralStartDate)),
      'ReferralExpiryDate':new FormControl(resp[i].ReferralExpiryDate == null ? undefined : new Date(resp[i].ReferralExpiryDate)),
    });
      }
      }
      }
      // this.primaryInsuranceForm.patchValue({
      //   GroupNumber: resp[0].GroupNumber,
      // })
      });
  
  }
  
//   initializeForm(){
// this.primaryInsuranceForm 
//   }
 createForm() {
  this.primaryInsuranceForm = this.fb.group({
    // PatientInsuranceProviderId: ["", [Validators.required]],
    PatientId: [""],
    InsuranceProviderId: [""],
    Order: [1],
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
    InsuredIsPolicy: [""],
    PatientGuarantorId: [""],
    IsCopayPercentage: [""],
    SubmitterInsuranceNumber: [""],
    SpecialistInsuranceCopayRequired: [""],
    PriorAuthorizationNumber: [""],
    ReferralStartDate: [""],
    ReferralExpiryDate: [""],
    AcceptAssignment: [""],
    OtherClaimId: [""],
    primaryInsuranceCategory: [""], //delete it before submitting form
    payer: [""], // delete it b4 submitting
    ReferralNumber: [""] // delete it b4 submitting
  });
  // this.secondaryInsuranceForm = this.fb.group({
  //   secondaryPolicyOwnedBy: null,
  //   secondaryInsuranceCompany: null,
  //   secondaryInsuranceCode: null,
  //   secondaryInsurancePayer: null,
  //   secondaryInsuranceCategory: null,
  //   secondaryPolicyNumber: null,
  //   secondaryGroupNumber: null,
  //   secondaryGroupNumberVerify: null,
  //   secondaryVerifyResults: null,
  //   secondaryVerificationDate: null,
  //   secondaryCopay:  null,
  //   secondaryEffectiveDate: null,
  //   secondaryExpirationDate: null,
  //   secondaryEligibleMedical: null,
  //   secondaryEligiblePrescriptions: null,
  //   secondaryEligibleVision: null,
  //   secondaryEligibleDental: null,
  //   secondaryEligibleHospitalization: null,
  //   secondaryEligibleDurableEquipment: null,
  //   secondaryAcceptAssignment: null,
  //   secondaryAllowableVisits: null,
  //   secondaryUsedVisits: null,
  //   secondaryReferralNumber: null,
  //   secondaryReferralStartDate: null,
  //   secondaryReferralExpiryDate: null
  // });
  this.getinsurancedetails();
}


  selectedInsurance(event) {
    console.log("Event", event)
    let temp = event.value;
    if(temp || temp != null){
      
    this.Guarantorvalue = false
      this.isInsuranceCompany = false
      this.Guarantorvalue = false
      // this.primaryInsuranceForm.patchValue({
      //   InsuredIsPatient: 'true',
      //   InsuredIsGuarantor: 'false'
      // });
    //  this.primaryInsuranceForm.value.InsuredIsPatient = true;
    //  this.primaryInsuranceForm.value.InsuredIsGuarantor = false;

    } else {
      this.isInsuranceCompany = true
      // console.log("insurance touched")
    
    }
    
    this.InsuranceSelected = temp.InsuranceProviderId
      this.primaryInsuranceForm.patchValue({
        // InsuranceProviderId: temp.InsuranceProviderId,
        InsuranceCode: temp.InsuranceProviderCode,
        SubmitterInsuranceNumber: temp.SubmitterInsuranceNumber,
      })
  }
  clearClick(){
    this.isInsuranceCompany = true
    this.assignInsurance = null
    this.primaryInsuranceForm.patchValue({
      // InsuranceProviderId: temp.InsuranceProviderId,
      InsuranceCode: '',
      SubmitterInsuranceNumber: ''
    })
  }
  getPatientvalues() {
    
    // this.patientIdToEdit = parseInt(this.patientIdToEdit);
    this.patientMngServ.getPatientById(this.patientIdToEdit).subscribe(resp => {
      this.patientDetailsData = resp;      
      this.InsuranceCategory();
    })
  }


  InsuranceCategory() {
    this.IPS.getInsuranceCategories().subscribe(
      resp => {
        this.insuranceCategory = resp;
        this.insuranceCategory.forEach(item => {
          if(item.InsuranceCategoryId === this.patientDetailsData.InsuranceCategoryId){
            this.selectedInsuCategory = item
          }
        })
        // resp.map(item => {
        //   this.insuranceCategory.push({
        //     label: item.InsuranceCategoryName,
        //     value: item.InsuranceCategoryName
        //   })
        // })
        
        // this.insuranceCategory = resp)
      });
    // InsuranceCategoryName
  }

  InsuredIsPatient() {
    // let temp = this.primaryInsuranceForm.get('InsuredIsPatient').value
    this.primaryInsuranceForm.patchValue({
      InsuredIsPatient: true,
      InsuredIsGuarantor: false
    });
    this.Guarantorvalue = false
  }

  InsuredIsGuarantor() {
    this.Guarantorvalue = true
    this.primaryInsuranceForm.patchValue({
      InsuredIsPatient: false,
      InsuredIsGuarantor: true
    });
  }

  Verified() {
    this.primaryInsuranceForm.patchValue({
      Verified: true,
      Rejected: false
    });
  }

  Rejected() {
    this.primaryInsuranceForm.patchValue({
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

  // showError(msg) {
  //   this.toastr.error(this.msg);
  // }
  onSubmit(value) {
    this.patientIdToEdit = parseInt(this.patientIdToEdit);
    let logindata = JSON.parse(sessionStorage.getItem('UserDetail'));
    logindata = logindata.UserId
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let temp = this.primaryInsuranceForm.get('InsuredIsPatient').value;
    if (temp === "false") {
      this.isSubmitted = false
    } else if (temp === "true") {
      this.isSubmitted = false
    } 
    // else {
    //   this.isSubmitted = true;
    //   this.msg = "Please Select Policy Owner"
    //   this.showerror(this.msg)
    //   return;
    // }
    this.primaryInsuranceForm.patchValue({
      PatientId: this.patientIdToEdit
    });
    value.PatientId = this.patientIdToEdit;
    value.InsuranceProviderId = this.InsuranceSelected;
    if(this.Guarantorvalue === true){
      value.InsuredIsPatient = false,
      value.InsuredIsGuarantor = true
    } else {
      value.InsuredIsPatient = true,
      value.InsuredIsGuarantor = false
    }
    this.primaryInsuranceForm.patchValue({
      InsuranceProviderId: this.InsuranceSelected,
    });
    value.CreatedByUser = null;
    value.InsuranceProvider = null;
    value.LastUpdatedByUser = null;
    value.Patient = null;
    value.PatientGuarantor = null;
    
    // value = JSON.parse(value);
    if(this.PatientInsuranceProviderId > 0){
      value.PatientInsuranceProviderId = this.PatientInsuranceProviderId;
      value.DateLastUpdated = date
      value.LastUpdatedByUserId = logindata
      value.Order = 1;
      value.CreatedByUserId = logindata
      value.DateCreated = new Date();
      this.IPS.putpatientinsuranceproviders(value).subscribe(
        resp => {
         this.postingresp = resp
         this.msg = "Primary Insurance details are updated successfully";
         this.showSuccess(this.msg) 
        });
    }
    else {
      value.DateCreated = date;
      value.CreatedByUserId = logindata;
      value.DateLastUpdated = date;
      value.LastUpdatedByUserId = logindata;
    this.IPS.postpatientinsuranceproviders(value).subscribe(
      resp => {
       this.postingresp = resp
       this.msg = "Primary Insurance details are saved successfully";
       this.showSuccess(this.msg) 
      });
    this.submitted = true;
  }
    // // stop here if form is invalid
    // if (this.primaryInsuranceForm.invalid) {
    //     return;
    // }

  }

  onSave() {
  }

  onNext() {
    this.childnext.emit();
  }
  onClose() {
    this.router.navigate(['/pages/workspace/patientmanagement']);
  }
  openmodal(){
  this.modal.emit(this.Modalname);
}

chargeSlips(data){
  this.chrgslip.emit(data);
  this.policyNumber.emit(this.primaryInsurance)
 }
}
