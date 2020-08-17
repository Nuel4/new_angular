import { routes } from './../../../pages/workspace/patient-management/patient-management.module';
import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PatientmanagementService } from '../../../services/workspace/patient-management.service'
import { AuthenticationStore } from '../../../authentication';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
//Broadcaster
import { Broadcaster } from '../../../broadcast/broadcaster';
import { Services } from '../../../pages/services/services';
import { selectRows } from '@swimlane/ngx-datatable/release/utils';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InsuranceProviderService } from './../../../services/billing/insuranceprovider.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PatientDto } from '../../../pages/workspace/patient-management/registerpatient/patientdetails/patientDetailForm.model'
import { NavbarService } from '../../../services/navbar.service'
import { AddAppointmentComponent } from '../../../../app/pages/workspace/calendar/add-appointment/add-appointment.component';
declare var $: any;
@Component({
  selector: 'app-modelview',
  templateUrl: './modelview.component.html',
  styleUrls: ['./modelview.component.scss'],
  providers: [Services, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  encapsulation: ViewEncapsulation.None
})
export class ModelviewComponent implements OnInit {
  @ViewChild('lgModal') private _poup: ElementRef;
  @Input() openPopUp: boolean;
  @Input() ComponentName: string;
  @Input() popupData: any;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  @Output() PassPatient: EventEmitter<any> = new EventEmitter();
  @Output() passpayment: EventEmitter<any> = new EventEmitter();
  @Output() patientdataview: EventEmitter<any> = new EventEmitter();
  @Output() patientdatapost: EventEmitter<any> = new EventEmitter();
  @Output() newOrder: EventEmitter<any> = new EventEmitter();
  @Output() chartsHome: EventEmitter<any> = new EventEmitter();
  @Output() searchedData: EventEmitter<any> = new EventEmitter();
  @Input() patientData: any;
  public data: any = [];
  patientObj: any = {};
  //changed by Ankur Sanghvi
  status: any = [];
  selectedStatus: any //= { Description: 'Active', PatientStatusId: 1 };
  selectedRow: any;
  currentURL: any;
  isquickadd: boolean = false;
  tableCol: any = [
    { field: 'PatientId', header: 'ID' },
    { field: 'Name', header: 'Name' },
    { field: 'DOB', header: 'DOB' },
    { field: 'Sex', header: 'Sex' },
    { field: 'Phone', header: 'Phone' },
    { field: 'Charts', header: 'Charts'},
    { field: 'Edit', header: 'Edit'},
    { field: 'Appointment', header: 'Appointment'}
  ];
  isLoader = true;
  selectedselfpay: boolean;
  Index: number = 0
  TotalRecords: number;
  PageSize: number;
  salutationlist: any
  selectedSalutation: any = {}
  facility: any;
  modalRef: any;
  user: any;
  selectedfacility: any;
  User: any;
  selectedUser: any = { UserId: 0 };
  selectedFacilityList: any = [];
  insprovider: any = []
  inscode: any
  selectedinsprovider: any
  gender: any = true
  QuickAddForm: FormGroup
  PatientDetail: {};
  dob: any;
  ssn: any;
  firstname: any;
  middlename: any;
  lastname: any;
  homephone: any;
  cellphone: any;
  defaultFacility: any = { FacilityId: 0 };
  Insurance: any;
  groupname: any;
  policynumber: any;
  copayamt: any;
  currenturl;
  PaymentsData;
  emptyList: boolean = false;
  patientList: boolean = false;
  searchedPatient: any = []
  constructor(
    private fb: FormBuilder,
    private patMngServ: PatientmanagementService,
    private patInsServ: InsuranceProviderService,
    private authStore: AuthenticationStore,
    protected localStorage: LocalStorage,
    private broadcaster: Broadcaster, private serv: Services,
    private router: Router,
    private route: ActivatedRoute,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private nav: NavbarService,
    private location: Location,
  ) {

    this.patientObj.offset = 0;
    this.patientObj.limit = 10;
    this.patientObj.firstname = '';
    this.patientObj.lastname = '';
    this.patientObj.ssn = '';
    this.patientObj.dob = '';
    this.patientObj.phone = '';
    this.patientObj.visitdate = '';
    this.patientObj.status = 1;
  }

  ngOnInit() {
    if(this.authStore.SearchedPatientList.length > 0){
      this.data=this.authStore.SearchedPatientList;
      this.isLoader = false; 
    }
    else{
      this.isLoader = true;
    }
    
    this.QuickAddForm = new FormGroup({
      selectedSalutation: new FormControl(''),
      firstname: new FormControl('', Validators.required),
      middlename: new FormControl(''),
      lastname: new FormControl('', Validators.required),
      ssn: new FormControl(''),
      dob: new FormControl('', Validators.required),
      cellphone: new FormControl(''),
      homephone: new FormControl(''),
      defaultFacility: new FormControl(''),
      selectedUser: new FormControl(''),
      selectedselfpay: new FormControl(''),
      selectedinsprovider: new FormControl(''),
      inscode: new FormControl('', Validators.required),
     
    })
    this.selectedselfpay = false;
    this.patientObj.lastname = this.popupData ? this.popupData : '';
    if(this.patientData) {
      let data = this.patientData.PatientName.split(',')
    this.patientObj.lastname = data[0];
    this.patientObj.firstname = data[1];
    }
    if (this.nav.visible) {
      this.loadStatus()
    }
    this.currenturl = this.location.path();
    this.loadSalutation();
    this.loadInsProvider();
    // this.SelectedFacility(selectedFacility);
  }
  
  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.patientsSearch()
  }
  
  
  public findPatient() {
    $("#lgModal").modal("hide");
  }
  public changePatient() {
    $("#lgModal").modal("hide");
  }
  public closeModel(value) {
    $("#" + value).modal("hide");
  }
  
  openQuickADD() {
    this.isquickadd = true;
    this.openPopUp = false
  }
  closeQuickADD() {
    this.isquickadd = false;
    this.openPopUp = true
  }

  public patientsSearch() {
    this.patientObj.status = this.selectedStatus ? this.selectedStatus.Description : '';
    this.patientObj.offset = this.Index;
    //+ "&dob="+this.patientObj.dob 
    //+ "&visitdate="+this.patientObj.visitdate;
    this.patMngServ.GetAllPatientsPagedWithFilters(this.patientObj).subscribe(resp => {
      this.TotalRecords = resp.TotalItems;
      this.PageSize = resp.PageSize;
      this.data = resp.Results;
      sessionStorage.setItem('SearchedPatientList', JSON.stringify(this.data));
      this.authStore.SearchedPatientList = JSON.parse(sessionStorage.getItem("SearchedPatientList"));
      this.serv.senPatient();
      this.isLoader = false;
    });
  }

  /**
   * name
   */
  public name() {
    
  }
  
  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }


  public clearPatient(event) {
    this.data = "";
    this.patientObj.firstname = '';
    this.patientObj.lastname = '';
    this.patientObj.ssn = '';
    this.patientObj.dob = '';
    this.patientObj.phone = '';
    this.patientObj.visitdate = '';
    this.selectedRow = '';
    sessionStorage.setItem('PatientDetail', null);    
    this.router.navigate([this.currenturl]);
  }
  
  public onRowSelect(rowData) {
    if (this.ComponentName === "guarantor") {
      this.PassPatient.emit(rowData);
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.authStore.ReloadPatientData()
    } else if(this.router.url === '/pages/billing' || this.router.url === '/pages/billing/payments' || this.router.url === '/pages/billing/viewbills' || this.router.url === '/pages/billing/postcharges'){
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.router.navigate([this.currenturl]);
      this.authStore.ReloadPatientData();
      var url = this.router.url
      this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() =>
        this.router.navigate([url]));
    } else if(this.ComponentName === "Payments"){
      this.passpayment.emit(rowData);
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.authStore.ReloadPatientData()
    }
     else if(this.router.url === '/pages/chart') {
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.authStore.ReloadPatientData();
      this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() => 
        this.router.navigate(['/pages/chart/charts'])
      );
    }
    else if(this.router.url === '/pages/chart/charts') {
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.authStore.ReloadPatientData();
      this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() => 
        this.router.navigate(['/pages/chart'])
      );
    }
    else if(this.router.url === '/pages/billing/patientaccount'){
      
      this.authStore.patientAccount=rowData;
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    }
    else if(this.router.url === '/pages/orders/neworder'){
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      this.router.navigate(["/pages/orders/neworder"]);
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.authStore.ReloadPatientData()
      this.newOrder.emit(rowData);
      // this.router.navigateByUrl('/pages/orders/neworder', { skipLocationChange: true }).then(() =>
      // this.router.navigate(["/pages/orders/neworder"]));
      // this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      // this.authStore.ReloadPatientData()
    } if(this.router.url === '/pages/scanning/documents') {
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      // this.router.navigate([this.currenturl]);
      this.authStore.ReloadPatientData();
      var url = this.router.url
      this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() =>
        this.router.navigate([url]));
    } if(this.router.url === '/pages/scanning/home') {
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      // this.router.navigate([this.currenturl]);
      this.authStore.ReloadPatientData();
      var url = this.router.url
      this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() =>
        this.router.navigate([url]));
    }
    else {
      switch(this.ComponentName){
        case 'post': this.patientdataview.emit(rowData)
        break;
        case 'view': this.patientdatapost.emit(rowData)
          break;
          default: 
          break ; 
      }
      sessionStorage.setItem('PatientDetail', JSON.stringify(rowData));
      // this.currentURL = this.router.url;
      this.router.navigate([this.router.url]);
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.authStore.ReloadPatientData()
      this.activeModal.close()
      this.loadEvent.emit(true);
      // this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() =>
      //   this.router.navigate([this.router.url]));
    }
    this.activeModal.dismiss('Cross click');
  }

  openCharts() {
    this.router.navigate(['/pages/chart'])
    this.activeModal.dismiss('Cross click');
  }
  public onRowHover(event) {
  }

  public setselfpay() {
    this.selectedselfpay = !this.selectedselfpay;
  }

  public loadStatus() {
    this.patMngServ.GetAllPatientStatus().subscribe(resp => {
      this.status = resp
    });
  }
  public loadSalutation() {
    this.patMngServ.getSalutations().subscribe(resp => {
      this.salutationlist = resp
    });
  }
  public loadInsProvider() {
    this.patInsServ.getInsuranceProviders().subscribe(resp => {
      resp.forEach(element => {
        element.insname = element.InsuranceProviderName + " (" + element.InsuranceProviderCode + ")"
        this.insprovider.push(element)
      });
    });
  }
  SelectedFacility(selectedFacility) {
    let params = {
      FacilityId: selectedFacility.FacilityId
    }
    this.patMngServ.getPhyminDtFacID(params).subscribe(resp => {
      this.User = resp;
      this.User.map(item => {
        item.fullName = item.lastname + ' ' + item.firstname
      })
      if (this.User.length === 0) {
        this.showInfo("No records found");
      }
    });
  }
  // selectedFacility
  LoadFacility(selectedFacility) {
    let Facility;
    if (!selectedFacility) {
      Facility = {
        pFacilityName: "a"
      }
    } else {
      Facility = {
        pFacilityName: selectedFacility.query
      }
    }
    this.patMngServ.getFacilitieswithFacilitiesName(Facility).subscribe(resp => {
      this.selectedFacilityList = resp
    });

  }

  showInfo(msg: string) {
    this.toastr.info(msg);
  }
  showSuccess(msg: string) {
    this.toastr.success(msg);
  }


  addQuickPatient() {
    if(this.selectedselfpay === true){
      if(this.firstname === undefined || this.lastname === undefined || this.dob === undefined || this.gender === true || this.cellphone === undefined || this.homephone === undefined){
        this.toastr.error('Please enter Mandatory fields')
      } else {
        this.insertPatient();
      }
    }
    else if(this.selectedselfpay === false){
      if(this.firstname === undefined || this.lastname === undefined || this.dob === undefined || this.gender === true || this.cellphone === undefined || this.homephone === undefined || this.policynumber === undefined){
        this.toastr.error('Please enter Mandatory fields')
      } else {
        this.insertPatient()
      }
    } 
    
  }

  insertPatient() {
    this.PatientDetail = {
      "Ssn": this.ssn ? this.ssn : null,
      "DateOfBirth": this.dob,
      "SalutationId": this.selectedSalutation.SalutationId ? this.selectedSalutation.SalutationId : null,
      "Sex": this.gender,
      "FirstName": this.firstname,
      "MiddleName": this.middlename,
      "LastName": this.lastname,
      "HomePhone": this.homephone,
      "MobilePhone": this.cellphone,
      "PatientStatus": "Active",
      "DateCreated": new Date(),
      "CreatedByUserId": JSON.parse(sessionStorage.getItem('UserDetail')).UserId,
      "DateLastUpdated": new Date(),
      "LastUpdatedByUserId": JSON.parse(sessionStorage.getItem('UserDetail')).UserId,
      "DefaultFacility": this.defaultFacility.FacilityId !== 0 ? this.defaultFacility.FacilityId : null,
      "DefaultPhysician": this.selectedUser.UserID !== 0 ? this.selectedUser.UserID : null,
      "FlagSelfPayPatient": this.selectedselfpay,
      "InsuranceCategoryId": this.selectedselfpay ? null : this.selectedinsprovider.InsuranceCategoryId,
      "ChartNumber": "",
      "MaritalStatusId": null,
      "ReligionId": null,
      "RaceId": null,
      "EthnicityId": null,
      "Language1Id": null,
      "Language2Id": null,
      "Language3Id": null,
      "RequiresInterpreter": false,
      "PrimaryAddressLine1": null,
      "PrimaryAddressLine2": null,
      "PrimaryCity": null,
      "PrimaryStateCode": null,
      "PrimaryZipCode": null,
      "PrimaryZipPlus4": null,
      "SecondaryAddressLine1": null,
      "SecondaryAddressLine2": null,
      "SecondaryCity": null,
      "SecondaryStateCode": null,
      "SecondaryZipCode": null,
      "SecondaryZipPlus4": null,
      "HasInternationalAddress": true,
      "WorkPhone": null,
      "WorkPhoneExt": null,
      "AltPhone": null,
      "Fax": null,
      "PreferredContactNo": null,
      "PhotoImage": null,
      "Email1": null,
      "Email2": null,
      "GeneralNote": null,
      "Occupation": null,
      "HipaaViaMail": false,
      "HipaaViaVoice": false,
      "HipaaViaNotice": false,
      "HipaaViaMessage": false,
      "HipaaAllowSms": false,
      "HipaaAllowEmail": false,
      "PriceLevel": null,
      "ReferralSourceId": null,
      "SignatureOnFile": false,
      "AssignedProvider": null,
      "SofDate": null,
      "MedicalChartNumber": null,
      "UserId": null,
      "ApplicationUserId": null,
      "HippaAllowPhoneCall": false,
      "HippaAllowPatientPortal": false,
      "PatientPortalMakeClinicalSummaryAvailableToPatient": false,
      "PatientPortalMakeLabResultsAvailableToPatient": false,
      "PatientPortalMakeProblemListAvailableToPatient": false,
      "PatientPortalMakeMedicationListAvailableToPatient": false,
      "PatientPortalMakeAllergyInfoAvailableToPatient": false,
      "PatientPortalMakeRadiologyReportsInfoAvailableToPatient": false,
      "PatientPortalMakeReferralLettersInfoAvailableToPatient": false,
      "ReferringPhysicianId": null,
      "ReferringOrganizationId": null,
      "ReferralDetails": null,
      "SummaryDocument": null,
      "AmountCurrentBalanceDue": null,
      "AmountCurrentBalanceDueCurrency": null,
      "DateCurrentBalanceDue": null,
      "OnPaymentArrangement": false,
      "UniqueNumber": null,
      "IsLivingWill": true,
      "AdvancedDirectivesId": null,
      "Note": null,
      "FlagDoNotSendPatientStatement": false,
      "AcceptAssignment": false,
      "RcopiaPatientId": null,
      "RcopiaXml": null,
    }
    this.patMngServ.postPatientRegisterDetails(this.PatientDetail).subscribe(resp => {
      if (!this.selectedselfpay) {
        this.Insurance = {
          "PatientId": resp.PatientId,
          "InsuranceProviderId": this.selectedinsprovider.InsuranceProviderId,
          "Order": 1,
          "PolicyNumber": this.policynumber,
          "GroupNumber": this.groupname,
          "Verified": false,
          "CopayAmount": this.copayamt,
          "InsuranceCode": this.inscode,
          "DateCreated": new Date(),
          "CreatedByUserId": JSON.parse(sessionStorage.getItem('UserDetail')).UserId,
          "DateLastUpdated": new Date(),
          "LastUpdatedByUserId": JSON.parse(sessionStorage.getItem('UserDetail')).UserId,
          "InsuredIsPatient": true,
          "InsuredIsGuarantor": false,
          "VerificationDate": null,
          "Rejected": null,
          "RejectionReason": null,
          "EligibleForMedical": false,
          "EligibleForPrescriptions": false,
          "EligibleForDurableMedicalEquipment": false,
          "EligibleForVision": false,
          "EligibleForDental": false,
          "EligibleForOtcMedications": false,
          "EligibleForHospitalization": false,
          "WarnOnNextAppointment": false,
          "WarnOnBilling": false,
          "AllowedVisits": null,
          "VisitsUsed": null,
          "AllowedAmount": null,
          "AmountUsed": null,
          "VisitsWarning": null,
          "AmountWarning": null,
          "EffectiveDateFrom": null,
          "ExpirationDate": null,
          "PatientGuarantorId": null,
          "IsCopayPercentage": true,
          "SubmitterInsuranceNumber": null,
          "SpecialistInsuranceCopayRequired": null,
          "PriorAuthorizationNumber": null,
          "ReferralStartDate": null,
          "ReferralExpiryDate": null,
          "AcceptAssignment": true,
          "OtherClaimId": null
        }
        this.patInsServ.postpatientinsuranceproviders(this.Insurance).subscribe(resp => {
          this.showSuccess("Patient Successfully Added.")
          this.closeQuickADD()
        })
      }
      else {
        this.showSuccess("Patient Successfully Added.")
        this.closeQuickADD()
      }
    })
  
  }

  setInsCode(data) {
    this.insprovider.map(item => {
      if (item.InsuranceProviderId === data.InsuranceProviderId) {
        this.inscode = item.InsuranceProviderCode
      }
    })
  }

  openEditModal(ApptObj,isUpdate) {
    if (isUpdate) {
      this.loadFacility(ApptObj)
    }    
  }

  loadFacility(ApptObj) {
    ApptObj.facility_id = ApptObj.facilityid
    this.patMngServ.GetCustomFormattedGenericFacilities().subscribe(resp => {
      resp.map(obj => {
        if (obj.id == ApptObj.facilityid) {
          this.facility = obj
        } else if(obj.id == ApptObj.DefaultFacility) {
          this.facility = obj
        }
      })
      this.getUserById(ApptObj)
    })
  }

  getUserById(ApptObj) {
    let userID = ApptObj.userId ? ApptObj.userId : ApptObj.UserId
    this.patMngServ.getUserById(userID).subscribe(resp => {
      this.activeModal.dismiss('Cross click');
      this.user = resp
      this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
      this.modalRef.componentInstance.selectedData = {
        ApptObj,
      }
      this.modalRef.componentInstance.loadEvent.subscribe((value) => {
        if (value) {
          this.modalRef.close()
        }
      })
    })
  }

  onEditPatient(rowData) {
    let selectedPatientId = rowData.PatientId
    this.router.navigate(['/pages/workspace/patientmanagement/registerpatient', selectedPatientId]);
    this.activeModal.dismiss('Cross click');
  }
  expandedCSS: boolean = false;
  autoTable(val){
     this.expandedCSS = !val;
  }
  onCancel() {
    this.location.back();
    this.activeModal.dismiss();
  }

}
