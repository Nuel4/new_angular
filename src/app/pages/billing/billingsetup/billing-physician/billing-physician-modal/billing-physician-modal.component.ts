import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { BillingSetupService } from '../../../../../services/billing/billing-setup.service';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import { ToastrService } from 'ngx-toastr'
import { subscribeOn } from 'rxjs/operators';
@Component({
  selector: 'app-billing-physician-modal',
  templateUrl: './billing-physician-modal.component.html',
  styleUrls: ['./billing-physician-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingPhysicianModalComponent implements OnInit {
  @Input() billingDetails;
  @Input() billingRowdata;
  @Input() insuranceDetails;
  @Input() insuranceRowdata;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter()
  physicianName: any;
  facilityName: any;
  physicianNumber: any;
  taxNumber: any;
  uniqueNumber: any;
  medicareParticipant: boolean = true;
  hospiceEmployed: boolean = true;
  eligibiltyVerification: boolean = true;
  stateLicNumber: any;
  groupNationalIden: any;
  specialityNumber: any;
  DEANumber: any;
  submitterId: any;
  CertificationNumber: any;
  overSightNumber: any;
  otherLicNumber: any;
  otherLicDescription: any;
  physicianById: any = {};
  cols: any = [];
  insuranceProviderList: any = [];
  selectedInsuranceProvider: any;
  productionStatus: any = [];
  selectedProductionStatus: any;
  idQualifier: any = [];
  selectedQualifier: any;
  password: any;
  save: boolean = true;
  update: boolean = false
  nmLoop: any;
  individualProvider: boolean = false;
  transmitNPI: boolean = false;
  excludeLoop: boolean = false;
  taxId: boolean = false;
  qualifier: boolean = false;
  physicianInsuranceData: any = [];
  physicianInsRow: any;
  constructor(private modal: NgbActiveModal, private billingSetupService: BillingSetupService, public authStore: AuthenticationStore, private toastr: ToastrService) { }

  ngOnInit() {
    if (this.billingDetails) {
      this.getPhysiciansById()
      this.physicianName = this.billingRowdata.physicianName;
      this.facilityName = this.billingRowdata.facilityName;
      this.physicianNumber = this.billingRowdata.nationalProviderIdentifier;
      this.taxNumber = this.billingRowdata.physicianTaxIdentifier;
      // this.uniqueNumber = this.physicianById.UniquePhysicianIdentificationNumber;
      // this.medicareParticipant = this.physicianById.MedicareParticipant;
      // this.hospiceEmployed = this.physicianById.HospiceEmployed;
      // this.eligibiltyVerification= this.physicianById.RequirePatientEligibilityVerification;
      // this.stateLicNumber = this.physicianById.StateLicenseNumber;
      // this.groupNationalIden = this.physicianById.GroupNationalPhysicianIdentifier;
      // this.specialityNumber = this.physicianById.SpecialtyLicense;
      // this.DEANumber = this.physicianById.DrugEnforcementAdministrationNumber;
      // this.submitterId = this.physicianById.ClaimsSubmitterId;
      // this.CertificationNumber = this.physicianById.MammographyCertificationNumber;
      // this.overSightNumber = this.physicianById.CarePlanOversightNumber;
      // this.otherLicNumber = this.physicianById.OtherLicenseNumber;
      // this.otherLicDescription = this.physicianById.OtherLicenseDescription
    }
    if (this.insuranceDetails) {
      this.cols = [
        { field: 'InsuranceProvider', header: 'Insurance Provider' },
        { field: 'SubmitterPassword', header: 'Submitted Password' },
        { field: 'Nm109loop1000a', header: 'NM109 Loop 1000A' },
        { field: 'ProductionStatus', header: 'Production Status' },
        { field: 'IdQualifier2010aa', header: 'ID Qualifier' },

      ]
      this.getCFInsurance()
      this.productionStatus = [
        { label: 'TEST' },
        { label: 'PRODUCTION' }
      ];
      this.idQualifier = [
        { value: '0', label: 'Tax Id' },
        { value: '1', label: 'SSN' }
      ];
      this.getPhysicianInsurance()
    }
  }
  getPhysiciansById() {
    this.billingSetupService.getPhysiciansById(this.billingRowdata.physicianId).subscribe(res => {
      this.physicianById = res;
      this.uniqueNumber = this.physicianById.UniquePhysicianIdentificationNumber;
      this.medicareParticipant = this.physicianById.MedicareParticipant;
      this.hospiceEmployed = this.physicianById.HospiceEmployed;
      this.eligibiltyVerification = this.physicianById.RequirePatientEligibilityVerification;
      this.stateLicNumber = this.physicianById.StateLicenseNumber;
      this.groupNationalIden = this.physicianById.GroupNationalPhysicianIdentifier;
      this.specialityNumber = this.physicianById.SpecialtyLicense;
      this.DEANumber = this.physicianById.DrugEnforcementAdministrationNumber;
      this.submitterId = this.physicianById.ClaimsSubmitterId;
      this.CertificationNumber = this.physicianById.MammographyCertificationNumber;
      this.overSightNumber = this.physicianById.CarePlanOversightNumber;
      this.otherLicNumber = this.physicianById.OtherLicenseNumber;
      this.otherLicDescription = this.physicianById.OtherLicenseDescription
    })
  }
  updatePhysician() {
    if (this.physicianNumber === undefined || this.taxNumber === undefined || this.uniqueNumber === undefined || this.DEANumber === undefined) {
      this.toastr.error("Please select mandatory fields ")
    }
    let payload = {
      PhysicianId: this.billingRowdata.physicianId ? this.billingRowdata.physicianId : 0,
      UserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0,
      License: this.physicianById.License,
      LicenseState: this.physicianById.LicenseState,
      SignatureImage: this.physicianById.SignatureImage,
      NationalProviderIdentifier: this.physicianNumber,
      PhysicianTaxIdentifier: this.taxNumber,
      DrugEnforcementAdministrationNumber: this.DEANumber,
      UniquePhysicianIdentificationNumber: this.uniqueNumber,
      MedicareParticipant: this.medicareParticipant,
      AppointmentDurationMinutes: this.physicianById.AppointmentDurationMinutes,
      AppointmentStart: this.physicianById.AppointmentStart,
      AppointmentEnd: this.physicianById.AppointmentEnd,
      LunchBreakStart: this.physicianById.LunchBreakStart,
      LunchBreakEnd: this.physicianById.LunchBreakEnd,
      StateLicenseNumber: this.stateLicNumber,
      GroupNationalPhysicianIdentifier: this.groupNationalIden,
      SpecialtyLicense: this.specialityNumber,
      ClaimsSubmitterId: this.submitterId,
      MammographyCertificationNumber: this.CertificationNumber,
      CarePlanOversightNumber: this.overSightNumber,
      HospiceEmployed: this.hospiceEmployed,
      RequirePatientEligibilityVerification: this.eligibiltyVerification,
      OtherLicenseNumber: this.otherLicNumber,
      OtherLicenseDescription: this.otherLicDescription,
      DateCreated: this.physicianById.DateCreated,
      CreatedByUserId: this.physicianById.UserId ? this.physicianById.UserId : 0,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0,
      SignatureImageFileName: this.physicianById.SignatureImageFileName,
      ProviderCode: this.physicianById.ProviderCode,
      TaxonomyCode: this.physicianById.TaxonomyCode
    }
    this.billingSetupService.updatePhysician(payload).subscribe(res => {
      this.showAlert("Updated Successfully");
      this.loadEvent.emit(true);
      this.modal.dismiss('Cross click');
      this.modal.close('Close click');
    })
  }
  showAlert(msg: string) {
    this.toastr.success(msg)
  }
  getCFInsurance() {
    this.billingSetupService.getCFInsurance().subscribe(res => {
      this.insuranceProviderList = res;

    })
  }
  getPhysicianInsurance() {
    let payload = {
      PhysicianId: this.insuranceRowdata.physicianId
    }
    this.billingSetupService.getPhysicianInsuranceIdentification(payload).subscribe(res => {
      this.physicianInsuranceData = res;
      this.physicianInsuranceData.forEach(element => {
        switch (element.IdQualifier2010aa) {
          case "0": element.IdQualifier2010aa = "Tax Id"
            break;
          case "1": element.IdQualifier2010aa = "SSN"
            break;
        }
      })
    })
  }
  newPhysicianInsurance() {
    if (this.selectedInsuranceProvider === undefined || this.selectedProductionStatus === undefined || this.selectedQualifier === undefined) {
      this.toastr.error("Please select mandatory fields ")
    }
    let payload = {
      PhysicianId: this.insuranceRowdata.physicianId,
      InsuranceProviderId: this.selectedInsuranceProvider.insuranceProviderId,
      InsurancePin: 0,
      ClaimInsuranceIdQualifier: 0,
      EnrollmentId: 0,
      UserName: this.authStore.UserDetail.Username,
      Password: null,
      DateCreated: new Date(),
      CreatedByUserId: this.authStore.UserDetail.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
      SubmitterPassword: this.password ? this.password : '',
      Nm109loop1000a: this.nmLoop ? this.nmLoop : '',
      ProductionStatus: this.selectedProductionStatus.label ? this.selectedProductionStatus.label : '',
      IdQualifier2010aa: this.selectedQualifier.value ? this.selectedQualifier.value : '',
      IndividualProvider2010aa: this.individualProvider,
      Npireq: this.transmitNPI,
      Exclude2310d: this.excludeLoop,
      ExcludeTinssn: this.taxId,
      PriorAuthorizationQualifier: this.qualifier
    }
    this.billingSetupService.postPhysicianInsuranceIdentification(payload).subscribe(res => {
      this.showAlert("Successfully Added")
      this.getPhysicianInsurance()
    })
  }

  selectedRow(value) {
    this.physicianInsRow = value;
    this.insuranceProviderList.forEach((item) => {
      if (item.insuranceProviderId === value.InsuranceProviderId) {
        this.selectedInsuranceProvider = item
      }
    })
    this.idQualifier.forEach(item => {
      if (item.label === value.IdQualifier2010aa) {
        this.selectedQualifier = item
      }
    })
    this.productionStatus.forEach(item => {
      if (item.label === value.ProductionStatus) {
        this.selectedProductionStatus = item
      }
    })
    // this.selectedInsuranceProvider = value.InsuranceProvider;
    this.password = value.SubmitterPassword;
    this.nmLoop = value.Nm109loop1000a;
    this.individualProvider = value.IndividualProvider2010aa;
    this.transmitNPI = value.Npireq;
    this.excludeLoop = value.Exclude2310d;
    this.taxId = value.ExcludeTinssn;
    this.qualifier = value.PriorAuthorizationQualifier
    this.save = false;
    this.update = true;
  }
  editPhysicianInsurance() {
    let payload = {
      PhysicianInsuranceIdentificationId: this.physicianInsRow.PhysicianInsuranceIdentificationId,
      PhysicianId: this.physicianInsRow.PhysicianId,
      InsuranceProviderId: this.selectedInsuranceProvider.insuranceProviderId,
      InsurancePin: this.physicianInsRow.InsurancePin,
      ClaimInsuranceIdQualifier: this.physicianInsRow.ClaimInsuranceIdQualifier,
      EnrollmentId: this.physicianInsRow.EnrollmentId,
      UserName: this.authStore.UserDetail.Username,
      Password: this.physicianInsRow.Password,
      DateCreated: this.physicianInsRow.DateCreated,
      CreatedByUserId: this.physicianInsRow.CreatedByUserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
      SubmitterPassword: this.password,
      Nm109loop1000a: this.nmLoop,
      ProductionStatus: this.selectedProductionStatus.label,
      IdQualifier2010aa: this.selectedQualifier.value,
      IndividualProvider2010aa: this.individualProvider,
      Npireq: this.transmitNPI,
      Exclude2310d: this.excludeLoop,
      ExcludeTinssn: this.taxId,
      PriorAuthorizationQualifier: this.qualifier
    }
    this.billingSetupService.updatePhysicianInsuranceIdentification(payload).subscribe(res => {
      this.showAlert("Successfully Updated");
      this.getPhysicianInsurance();
      this.modal.dismiss('Cross click');
      this.modal.close('Close click');
    })
  }
  deletePhysicianInsurance(rowData) {
    let payload = {
      PhysicianInsuranceIdentificationId: rowData.PhysicianInsuranceIdentificationId
    }
    this.billingSetupService.deletephysicianinsuranceidentification(payload).subscribe(res => {
      this.showWarningAlert('Deleted Successfully')
      this.getPhysicianInsurance()
    })
  }
  showWarningAlert(msg: string) {
    this.toastr.warning(msg)
  }
}
