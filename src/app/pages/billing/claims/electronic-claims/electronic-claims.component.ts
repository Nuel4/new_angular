import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation, OnChanges, Input } from '@angular/core';
import { ClaimService } from '../../../../services/billing/claims.service';
import { PhysicianService } from '../../../../services/practice/physician.service'
import { InsuranceProviderService } from '../../../../services/billing/insuranceprovider.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment';
import { ClaimsModalComponent } from '../claims-modal/claims-modal.component';
// import { Session } from 'inspector';
import { ModelviewComponent } from '../../../../theme/components/modelview/modelview.component';
@Component({
  selector: 'app-electronic-claims',
  templateUrl: './electronic-claims.component.html',
  styleUrls: ['./electronic-claims.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ElectronicClaimsComponent implements OnChanges, OnInit {
  @Input() emptyArr;
  cols: any = [];
  rows: any;
  physicianLists: any = [];
  insuranceProvidersList: any = [];
  insuranceFilterType: any = [];
  PatientName: any = null;
  patientId: any;
  PatientSsn: any;
  PatientdateOfBirth: any;
  PatientUniqueNumber: any;
  PatientCellPhone: any;
  claimData: any[] = [];
  submissonDate: any;
  electronicBillingRangeFrom: any;
  electronicBillingRangeTo: any;
  electronicPhysician: any
  electronicInsuranceProvider: any
  electronicInsuranceType: any;
  superBillData: any = [];
  totrec = 0;
  totpage = 0;
  InsType: any = "All";
  patientdata: any = [];
  InsPro: any = 0;
  PSTBillParam: any = { pPhysicianUserId: "", pInsuranceProviderId: "", pSpecialityId: 0, pFacilityId: this.InsPro };
  SBSV = "Pending";
  DOSF: any; 
  DOST: any;
  patientDetail: any = {};
  private PTName: boolean = false;
  constructor(private claimService: ClaimService,
    private physicianService: PhysicianService,
    private insuranceProviderService: InsuranceProviderService, public authStore: AuthenticationStore, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService) { }
  ngOnChanges() {
    this.claimData = [];
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // if(this.patientDetail !== null){
      // this.patientDetail = this.authStore.PatientDetail
      
    // }
  }
  ngOnInit() {
    // this.getPatientDetails()
    this.cols = [
      { field: "ClaimId", header: 'Id' },
      { field: 'ClaimSubmissionTimestamp', header: 'Submiited Date' },
      { field: 'ClaimFileName', header: 'Claim File Name' },
      { field: 'CountTotalClaims', header: 'Claims Count' },
      { field: 'SubmittedBy', header: 'Submitted By' },

    ]
    this.insuranceFilterType = [
      { InsuranceFilterName: 'All' },
      { InsuranceFilterName: 'Primary' },
      { InsuranceFilterName: 'Secondary' },
      { InsuranceFilterName: 'Tertiary' },
    ]
// if(this.authStore.PatientDetail === []){
  
    this.getPhysicians();
    this.getInsuranceProviders();
  // }

  }

  getPhysicians() {
    this.physicianService.getPhysicianWithMinimumDetails().subscribe(resp => {
      this.physicianLists = resp;
      for (let i = 0; i < this.physicianLists.length; i++) {
        this.physicianLists[i].physicianName = this.physicianLists[i].firstname + ' ' + this.physicianLists[i].lastname
      }
    });
  }
  getInsuranceProviders() {
    this.insuranceProviderService.getInsuranceProviders().subscribe(resp => {
      this.insuranceProvidersList = resp;
    });
  }
  getPatientDetails() {
    // $("#lgModal").modal('show');
    if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
      // $("#lgModal").modal('show');
      const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.openPopUp = true;
    }
    if ((JSON.parse(sessionStorage.getItem("PatientDetail")) != null)) {
      this.patientdata = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.patientdata.DateCreated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateLastUpdated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateOfBirth = new Date(this.patientdata.DateOfBirth);
      this.patientdata.FullName = this.patientdata.LastName + ", " + this.patientdata.FirstName;
      this.PTName = true;
      this.PSTBillParam = {
        pPatientId: this.patientdata.PatientId,
        pFacilityId: this.patientdata.DefaultFacility,
        pSpecialityId: 0,
        pSuperbillStatus: this.SBSV,
        pPhysicianUserId: 0,
        pDateCreatedFrom: this.DOSF,
        pDateCreatedTo: this.DOST,
        pInsuranceProviderId: this.InsPro,
        pInsuranceType: this.InsType,
      }
    }
  }

  parseDate(date) {
    let d = new Date(Date.parse(date));
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  retrievePatientClaims(pgno) {
    // electronicTable.reset();
    this.claimData = [];
    let claimsObject = {
      dateFrom: this.electronicBillingRangeFrom ? this.electronicBillingRangeFrom : '',
      dateTo: this.electronicBillingRangeTo ? this.electronicBillingRangeTo : '',
      physicianId: this.electronicPhysician ? this.electronicPhysician.physicianid : 0,
      insuranceProviderId: this.electronicInsuranceProvider ? this.electronicInsuranceProvider.InsuranceProviderId : 0,
      patientId: this.authStore.PatientDetail.PatientId ? this.authStore.PatientDetail.PatientId : 0,
      insuranceType: this.electronicInsuranceType ? this.electronicInsuranceType.InsuranceFilterName : '',
      offset: pgno,
      limit: 3
    }
    this.claimService.getClaimSubmissionsWithFilters(claimsObject).subscribe(res => {
      this.totrec = res.TotalItems;
      this.totpage = res.TotalPages;
      this.rows = res.PageSize;
      this.claimData = res.Results;
      this.claimData = this.claimData.map((el, key) => ({
        ...el,
        ClaimSubmissionTimestamp: moment(el.ClaimSubmissionTimestamp).format("DD-MM-YYYY"),
      }));

    })
  }
  clearAllDetails() {
    this.electronicBillingRangeFrom = "";
    this.electronicBillingRangeTo = "";
    this.electronicPhysician = { physicianId: 0 };
    this.electronicInsuranceProvider = { InsuranceProviderId: 0 };
    this.electronicInsuranceType = { InsuranceFilterName: '' };    
    this.patientDetail = {};
    // this.PatientName = null;
    // this.PatientSsn = null;
    // this.PatientdateOfBirth = null;
    // this.PatientUniqueNumber = null;
    // this.PatientCellPhone = null;
  }
  viewContent(rowdata) {
    const modRef = this.modalService.open(ClaimsModalComponent, { windowClass: "modelStyle" });
    modRef.componentInstance.isContent = true;
    modRef.componentInstance.claimBody = rowdata;

  }
  viewSuperBill(rowdata) {
    const modRef = this.modalService.open(ClaimsModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.viewBill = true;
    modRef.componentInstance.claimId = rowdata.ClaimId ? rowdata.ClaimId : 0;
    modRef.componentInstance.physicianId =this.physicianLists.physicianid
  }
  showAlert(msg: string) {
    this.toaster.success(msg)
  }

  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.retrievePatientClaims(currentpage)
  }
}
