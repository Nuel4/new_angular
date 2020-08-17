import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { BillingSetupService } from '../../../../../services/billing/billing-setup.service';
import { LookupService } from '../../../../../services/lookup.service';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import * as moment from 'moment';
@Component({
  selector: 'app-add-insurance-provider',
  templateUrl: './add-insurance-provider.component.html',
  styleUrls: ['./add-insurance-provider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddInsuranceProviderComponent implements OnInit {

  @Input() addInsuranceCompany;
  @Input() editInsuranceCategory;
  @Input() rowData;
  @Input() addPro;
  insuranceProviderType: any = [];
  selectedInsuranceProvider: any;
  feeScheduleType: any = [];
  selectedFeeType: any;
  rvuPaymentData: any = [];
  selectedRvu: any = [];
  stateList: any = [];
  selectState: any = {};
  selectedARTypes: any = {};
  insuranceCategory: any = [];
  idQualifier: any = [];
  selectedIdQualifier: any = {};
  insuranceProviderName: any;
  insuranceProviderCode: any;
  addressLine1: any;
  addressLine2: any;
  city: any;
  zipCode: any;
  zipPlus: any;
  mainPhone: any;
  altPhone: any;
  eligibilityVerificationPhone: any;
  elgibContactName: any;
  authPhone: any;
  authContactName: any;
  fax: any;
  email: any;
  primaryEDI: any;
  secondaryEDI: any;
  tertiaryEDI: any;
  EvPayerIdentifier: any;
  cmsIdentifier: any;
  altCMSIdentifier: any;
  inActive: boolean = false;
  npiOnly: boolean = false;
  complimentaryCross: any;
  groupTaxanomy: boolean = false;
  maximumTransaction: any;
  x12ReceiverID: any;
  x12DefaultID: any;
  mediGap: any;
  clearingHouseCommercial: any;
  clearingSubmitter: any;
  destinationId: any;
  providerCarrId: any;
  providerGroupName: any;
  submitClaims: any;
  groupPracticeId: any;
  wrapANSIFile: boolean = false;
  temp: any;
  altPhoneExt: any;
  eligibilityExt: any;
  pilotClaims: boolean = false;
  Use2420aNot2310b: boolean = false;
  UsesPatientLoop2000c: boolean = false;
  icd10EffectiveDate: any;
  payerId: any;
  insCompanyName: any;
  receiverName: any;
  receiverId: any;
  insuPayerId: any;
  insCompanyType: any;
  supervisingId: any;
  billingProvider: any;
  renderingProvider: any;
  referringProvider: any;
  servicefacility: any;
  otherSubscriber: any;
  insuranceProviderById: any;
  save: boolean = false;
  update: boolean = false;
  constructor(private modal: NgbActiveModal, private toastr: ToastrService, private billingSetupService: BillingSetupService, private lookupServ: LookupService, public authStore: AuthenticationStore) { }

  ngOnInit() {
    this.insuranceProviderType = [
      { label: 'Medicare' },
      { label: 'Medicaid' },
      { label: 'TRICARE CHAMPUS' },
      { label: 'CHAMPVA' },
      { label: 'Group Health Plan' },
      { label: 'FECA' },
      { label: 'Other' }
    ];

    this.idQualifier = [
      { value: '0', label: 'Tax Id' },
      { value: '1', label: 'SSN' }
    ];

    this.getFeesScheduleTypes();
    this.getRVUPaymentMethod();
    this.getState();
    this.getInsuranceCategory();
    if(this.editInsuranceCategory){
      this.save = false;
      this.update = true;
      this.getInsuranceProviderById()
    }
    if(this.addPro){
      this.save = true;
      this.update = false;
    }
  }
  getFeesScheduleTypes() {
    this.billingSetupService.getFeesScheduleType().subscribe(res => {
      this.feeScheduleType = res
    })
  }
  getRVUPaymentMethod() {
    this.billingSetupService.getRVUPaymentMethod().subscribe(res => {
      this.rvuPaymentData = res;
    })
  }
  private getState() {
    this.stateList = this.lookupServ.getAllStates();
  }
  getInsuranceCategory() {
    this.billingSetupService.getInsuranceCategory().subscribe(res => {
      this.insuranceCategory = res
    })
  }
  getInsuranceProviderById(){
    this.billingSetupService.getInsuranceProviderById(this.rowData.insuranceProviderId).subscribe(res => {
      this.insuranceProviderById = res;
      this.insuranceProviderName = this.insuranceProviderById.InsuranceProviderName;
      this.insuranceProviderCode = this.insuranceProviderById.InsuranceProviderCode;
      this.payerId=this.insuranceProviderById.SubmitterInsuranceNumber;
       this.insuranceProviderType.forEach(item => {
         if(item.label === this.insuranceProviderById.InsuranceProviderType){
           this.selectedInsuranceProvider = item;
         }
       })
      this.addressLine1 = this.insuranceProviderById.AddressLine1;
      this.addressLine2 = this.insuranceProviderById.AddressLine2;
      this.city = this.insuranceProviderById.City;
      this.stateList.forEach(item => {
        if(item.value === this.insuranceProviderById.StateCode){
          this.selectState = item;
        }
      })
      this.insuranceCategory.forEach(item => {
        if(item.InsuranceCategoryId === this.insuranceProviderById.InsuranceCategoryId){
          this.selectedARTypes = item;
        }
      });
      this.idQualifier.forEach(item => {
        if(item.label === this.insuranceProviderById.IdQualifier2010aa){
          this.selectedIdQualifier = item;
        }
      })
      this.feeScheduleType.forEach(item => {
        if(item.FeeScheduleTypeId === this.insuranceProviderById.FeeScheduleTypeId){
          this.selectedFeeType = item;
        }
      })
      this.rvuPaymentData.forEach(item => {
        if(item.RvuPaymentMethodId === this.insuranceProviderById.RvuPaymentMethodId){
          this.selectedRvu = item;
        }
      })
      this.mainPhone = this.insuranceProviderById.MainPhone;
      this.temp = this.insuranceProviderById.MainPhoneExt;
      this.altPhone = this.insuranceProviderById.AltPhone;
      this.altPhoneExt = this.insuranceProviderById.AltPhoneExt;
      this.eligibilityVerificationPhone = this.insuranceProviderById.EligibilityPhone;
      this.eligibilityExt =this.insuranceProviderById.EligibilityPhoneExt;
      this.elgibContactName = this.insuranceProviderById.EligibilityContactName;
      this.authContactName = this.insuranceProviderById.AuthorizationContactName;
      this.inActive = this.insuranceProviderById.Inactive;
      this.zipCode = this.insuranceProviderById.ZipCode;
      this.zipPlus = this.insuranceProviderById.ZipPlus4;
      this.authPhone = this.insuranceProviderById.AuthorizationPhone;
      this.fax = this.insuranceProviderById.Fax;
      this.email = this.insuranceProviderById.Email1;
      this.primaryEDI = this.insuranceProviderById.PrimaryEdiReceiver;
      this.secondaryEDI = this.insuranceProviderById.SecondaryEdiReceiver;
      this.tertiaryEDI = this.insuranceProviderById.TertiaryEdiReceiver;
      this.EvPayerIdentifier = this.insuranceProviderById.EvPayerIdentifier;
      this.cmsIdentifier = this.insuranceProviderById.CmsIdentifier;
      this.altCMSIdentifier = this.insuranceProviderById.AltCmsIdentifier;
      this.maximumTransaction = this.insuranceProviderById.MaximumTransactions;
      this.npiOnly = this.insuranceProviderById.NpiOnly;
      this.complimentaryCross = this.insuranceProviderById.ComplimentaryCrossover;
      this.groupTaxanomy = this.insuranceProviderById.IsGroupTaxonomyCodeRequired;
      this.x12ReceiverID = this.insuranceProviderById.X12ReceiverId;
      this.x12DefaultID = this.insuranceProviderById.X12DefaultPartnerId;
      this.mediGap = this.insuranceProviderById.MedigapCobaId;
      this.clearingHouseCommercial = this.insuranceProviderById.ClearinghouseCommercialIdNumber;
      this.clearingSubmitter = this.insuranceProviderById.ClearinghouseSubmitterIdNumber;
      this.destinationId = this.insuranceProviderById.ClearinghouseDestinationIdNumber;
      this.submitClaims = this.insuranceProviderById.SubmitClaimsAsGroupPractice;
      this.wrapANSIFile = this.insuranceProviderById.WrapAnsiFile;
      this.pilotClaims = this.insuranceProviderById.PilotClaims;
      this.icd10EffectiveDate = new Date(this.insuranceProviderById.Icd10EffectiveDate);
      this.insCompanyName = this.insuranceProviderById.Nm103loop2010bb;
      this.receiverName = this.insuranceProviderById.Nm103loop1000b;
      this.receiverId = this.insuranceProviderById.Nm109loop1000b;
      this.insuPayerId = this.insuranceProviderById.Nm109loop2010bb;
      this.insCompanyType = this.insuranceProviderById.Sbr09loop2000b;
      this.supervisingId = this.insuranceProviderById.Ref01loop2410e;
      this.billingProvider = this.insuranceProviderById.Ref01loop2010aa;
      this.renderingProvider = this.insuranceProviderById.Ref01loop2310b;
      this.referringProvider = this.insuranceProviderById.Ref01loop2310a;
      this.servicefacility = this.insuranceProviderById.Ref01loop2310d;
      this.otherSubscriber = this.insuranceProviderById.Sbr05loop2320
    })
  }
  addInsuranceProvider() {
    if(this.insuranceProviderName === undefined || this.selectedInsuranceProvider === undefined || this.selectedFeeType === undefined || this.selectedIdQualifier.label === undefined || this.receiverName === undefined || this.receiverId === undefined){
      this.toastr.error('Select all Mandatory Field')
    }
    else{
    let payload = {
      InsuranceProviderName: this.insuranceProviderName,
      InsuranceProviderCode: this.insuranceProviderCode,
      AddressLine1: this.addressLine1 ? this.addressLine1 : '',
      AddressLine2: this.addressLine2 ? this.addressLine2 : '',
      City: this.city ? this.city : '',
      StateCode: this.selectState.value ? this.selectState.value : '',
      ZipCode: this.zipCode ? this.zipCode : '',
      ZipPlus4: this.zipPlus ? this.zipPlus : '',
      MainPhone: this.mainPhone ? this.mainPhone : " ",
      MainPhoneExt: this.temp ? this.temp : null,
      AltPhone: this.altPhone ? this.altPhone : " ",
      AltPhoneExt: this.altPhoneExt ? this.altPhoneExt : null,
      EligibilityPhone: this.eligibilityVerificationPhone ? this.eligibilityVerificationPhone : " ",
      EligibilityPhoneExt: this.eligibilityExt ? this.eligibilityExt : null,
      EligibilityContactName: this.elgibContactName ? this.elgibContactName : '',
      AuthorizationPhone: this.authPhone ? this.authPhone : '',
      AuthorizationContactName: this.authContactName ? this.authContactName : '',
      Fax: this.fax ? this.fax : '',
      Email1: this.email ? this.email : '',
      PrimaryEdiReceiver: this.primaryEDI ? this.primaryEDI : '',
      SecondaryEdiReceiver: this.secondaryEDI ? this.secondaryEDI : '',
      TertiaryEdiReceiver: this.tertiaryEDI ? this.tertiaryEDI : '',
      EvPayerIdentifier: this.EvPayerIdentifier ? this.EvPayerIdentifier : '',
      CmsIdentifier: this.cmsIdentifier ? this.cmsIdentifier : '',
      AltCmsIdentifier: this.altCMSIdentifier ? this.altCMSIdentifier : '',
      MaximumTransactions: this.maximumTransaction ? this.maximumTransaction : null,
      Inactive: this.inActive,
      NpiOnly: this.npiOnly,
      ComplimentaryCrossover: this.complimentaryCross ? this.complimentaryCross : '',
      IsGroupTaxonomyCodeRequired: this.groupTaxanomy,
      X12ReceiverId: this.x12ReceiverID ? this.x12ReceiverID : '',
      X12DefaultPartnerId: this.x12DefaultID ? this.x12DefaultID : '',
      InsuranceProviderType: this.selectedInsuranceProvider ? this.selectedInsuranceProvider.label : '',
      MedigapCobaId: this.mediGap ? this.mediGap : '',
      ClearinghouseCommercialIdNumber: this.clearingHouseCommercial ? this.clearingHouseCommercial : '',
      ClearinghouseSubmitterIdNumber: this.clearingSubmitter ? this.clearingSubmitter : '',
      ClearinghouseDestinationIdNumber: this.destinationId ? this.destinationId : '',
      InsuranceProviderCarrierId: this.providerCarrId ? this.providerCarrId : '',
      InsuranceProviderGroupName: this.providerGroupName ? this.providerGroupName : '',
      FeeScheduleTypeId: this.selectedFeeType.FeeScheduleTypeId,
      SubmitClaimsAsGroupPractice: this.submitClaims,
      GroupPracticeIdNumber: this.groupPracticeId ? this.groupPracticeId : '',
      DateCreated: new Date(),
      CreatedByUserId: this.authStore.UserDetail.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
      WrapAnsiFile: this.wrapANSIFile,
      PilotClaims: this.pilotClaims,
      Use2420aNot2310b: this.Use2420aNot2310b,
      UsesPatientLoop2000c: this.UsesPatientLoop2000c,
      RvuPaymentMethodId: this.selectedRvu.RvuPaymentMethodId ? this.selectedRvu.RvuPaymentMethodId : 0,
      InsuranceCategoryId: this.selectedARTypes.InsuranceCategoryId ? this.selectedARTypes.InsuranceCategoryId : null,
      IdQualifier2010aa: this.selectedIdQualifier.label,
      Icd10EffectiveDate: this.icd10EffectiveDate ? this.icd10EffectiveDate : '',
      SubmitterInsuranceNumber: this.payerId ? this.payerId : '',
      Nm103loop2010bb: this.insCompanyName ? this.insCompanyName : '',
      Nm103loop1000b: this.receiverName ? this.receiverName : '',
      Nm109loop1000b: this.receiverId ? this.receiverId : '',
      Nm109loop2010bb: this.insuPayerId ? this.insuPayerId : '',
      Sbr09loop2000b: this.insCompanyType ? this.insCompanyType : '',
      Ref01loop2410e: this.supervisingId ? this.supervisingId : '',
      Ref01loop2010aa: this.billingProvider ? this.billingProvider : '',
      Ref01loop2310b: this.renderingProvider ? this.renderingProvider : '',
      Ref01loop2310a: this.referringProvider ? this.referringProvider : '',
      Ref01loop2310d: this.servicefacility ? this.servicefacility : '',
      Sbr05loop2320: this.otherSubscriber ? this.otherSubscriber : '',
      InsuredSignatureOnFile: null,
      PhysicianSignatureOnFile: null,
      SignatureOnFile: null
    }
    this.billingSetupService.postInsuranceProvider(payload).subscribe(res => {
      this.toastr.success('Successfully Added')
    })
  }
  }
  updateInsuranceProvider(){
    if(this.insuranceProviderName === undefined || this.selectedInsuranceProvider === undefined || this.selectedFeeType === undefined || this.selectedIdQualifier.label === undefined || this.receiverName === undefined || this.receiverId === undefined){
      this.toastr.error('Select all Mandatory Field')
    }
    else{
    let payload = {
      InsuranceProviderId: this.insuranceProviderById.InsuranceProviderId,
      InsuranceProviderName: this.insuranceProviderName,
      InsuranceProviderCode: this.insuranceProviderCode,
      AddressLine1: this.addressLine1 ? this.addressLine1 : '',
      AddressLine2: this.addressLine2 ? this.addressLine2 : '',
      City: this.city ? this.city : '',
      StateCode: this.selectState.value ? this.selectState.value : '',
      ZipCode: this.zipCode ? this.zipCode : '',
      ZipPlus4: this.zipPlus ? this.zipPlus : '',
      MainPhone: this.mainPhone ? this.mainPhone : " ",
      MainPhoneExt: this.temp ? this.temp : null,
      AltPhone: this.altPhone ? this.altPhone : " ",
      AltPhoneExt: this.altPhoneExt ? this.altPhoneExt : null,
      EligibilityPhone: this.eligibilityVerificationPhone ? this.eligibilityVerificationPhone : " ",
      EligibilityPhoneExt: this.eligibilityExt ? this.eligibilityExt : null,
      EligibilityContactName: this.elgibContactName ? this.elgibContactName : '',
      AuthorizationPhone: this.authPhone ? this.authPhone : null,
      AuthorizationContactName: this.authContactName ? this.authContactName : '',
      Fax: this.fax ? this.fax : '',
      Email1: this.email ? this.email : '',
      PrimaryEdiReceiver: this.primaryEDI ? this.primaryEDI : '',
      SecondaryEdiReceiver: this.secondaryEDI ? this.secondaryEDI : '',
      TertiaryEdiReceiver: this.tertiaryEDI ? this.tertiaryEDI : '',
      EvPayerIdentifier: this.EvPayerIdentifier ? this.EvPayerIdentifier : '',
      CmsIdentifier: this.cmsIdentifier ? this.cmsIdentifier : '',
      AltCmsIdentifier: this.altCMSIdentifier ? this.altCMSIdentifier : '',
      MaximumTransactions: this.maximumTransaction ? this.maximumTransaction : null,
      Inactive: this.inActive,
      NpiOnly: this.npiOnly,
      ComplimentaryCrossover: this.complimentaryCross ? this.complimentaryCross : '',
      IsGroupTaxonomyCodeRequired: this.groupTaxanomy,
      X12ReceiverId: this.x12ReceiverID ? this.x12ReceiverID : '',
      X12DefaultPartnerId: this.x12DefaultID ? this.x12DefaultID : '',
      InsuranceProviderType: this.selectedInsuranceProvider ? this.selectedInsuranceProvider.label : '',
      MedigapCobaId: this.mediGap ? this.mediGap : '',
      ClearinghouseCommercialIdNumber: this.clearingHouseCommercial ? this.clearingHouseCommercial : '',
      ClearinghouseSubmitterIdNumber: this.clearingSubmitter ? this.clearingSubmitter : '',
      ClearinghouseDestinationIdNumber: this.destinationId ? this.destinationId : '',
      InsuranceProviderCarrierId: this.providerCarrId ? this.providerCarrId : '',
      InsuranceProviderGroupName: this.providerGroupName ? this.providerGroupName : '',
      FeeScheduleTypeId: this.selectedFeeType.FeeScheduleTypeId ? this.selectedFeeType.FeeScheduleTypeId : '',
      SubmitClaimsAsGroupPractice: this.submitClaims,
      GroupPracticeIdNumber: this.groupPracticeId ? this.groupPracticeId : '',
      DateCreated: this.insuranceProviderById.DateCreated,
      CreatedByUserId: this.insuranceProviderById.CreatedByUserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
      WrapAnsiFile: this.wrapANSIFile,
      PilotClaims: this.pilotClaims,
      Use2420aNot2310b: this.Use2420aNot2310b,
      UsesPatientLoop2000c: this.UsesPatientLoop2000c,
      RvuPaymentMethodId: this.selectedRvu.RvuPaymentMethodId ? this.selectedRvu.RvuPaymentMethodId : 0,
      InsuranceCategoryId: this.selectedARTypes.InsuranceCategoryId ? this.selectedARTypes.InsuranceCategoryId : null,
      IdQualifier2010aa: this.selectedIdQualifier.label ? this.selectedIdQualifier.label : '',
      Icd10EffectiveDate: this.icd10EffectiveDate ? this.icd10EffectiveDate : '',
      SubmitterInsuranceNumber: this.payerId ? this.payerId : '',
      Nm103loop2010bb: this.insCompanyName ? this.insCompanyName : '',
      Nm103loop1000b: this.receiverName ? this.receiverName : '',
      Nm109loop1000b: this.receiverId ? this.receiverId : '',
      Nm109loop2010bb: this.insuPayerId ? this.insuPayerId : '',
      Sbr09loop2000b: this.insCompanyType ? this.insCompanyType : '',
      Ref01loop2410e: this.supervisingId ? this.supervisingId : '',
      Ref01loop2010aa: this.billingProvider ? this.billingProvider : '',
      Ref01loop2310b: this.renderingProvider ? this.renderingProvider : '',
      Ref01loop2310a: this.referringProvider ? this.referringProvider : '',
      Ref01loop2310d: this.servicefacility ? this.servicefacility : '',
      Sbr05loop2320: this.otherSubscriber ? this.otherSubscriber : '',
      InsuredSignatureOnFile: null,
      PhysicianSignatureOnFile: null,
      SignatureOnFile: null
    }
    this.billingSetupService.updateInsuranceProvider(payload).subscribe(res => {
      this.toastr.success('Successfully Updated');
      this.modal.dismiss('Cross click');
      this.modal.close('Close click');
    })
  }
  }
  onInputChange(val) {
    let test = val.split(/[()-]+/)
    this.temp = test[1];
  }
  altPhoneChange(val) {
    let altPhone = val.split(/[()-]+/)
    this.altPhoneExt = altPhone[1];
  }
  eligibilityExtChange(val) {
    let eligibility = val.split(/[()-]+/)
    this.eligibilityExt = eligibility[1];
  }
  closeModal(){
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
}
