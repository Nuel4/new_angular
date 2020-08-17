import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PhysicianService } from '../../../../services/practice/physician.service'
import { InsuranceProviderService } from '../../../../services/billing/insuranceprovider.service';
import { ClaimService } from '../../../../services/billing/claims.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment';
import { ClaimsModalComponent } from '../claims-modal/claims-modal.component';

@Component({
  selector: 'app-rejected-claims',
  templateUrl: './rejected-claims.component.html',
  styleUrls: ['./rejected-claims.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RejectedClaimsComponent implements OnInit {
  @Input() emptyArr;
  cols: any = [];
  physicianLists: any = [];
  insuranceProvidersList: any = [];
  insuranceFilterType: any = [];
  PatientName: any;
  PatientSsn: any;
  PatientdateOfBirth: any;
  PatientUniqueNumber: any;
  PatientCellPhone: any;
  rejectedBillingRangeFrom: string;
  rejectedBillingRangeTo: string;
  rejectedSelectedPhysician: any = {};
  rejectedInsuranceProvider: any = {};
  electronicInsuranceProvider: any = {};
  PatientId: any;
  workedClaims: boolean = false;
  reversedWorked: boolean = false;
  rejectedClaimsData: any = [];
  workedButton: boolean = true;
  selectedBillId: any[] = [];
  remittanceComments: any = {};
  totrec: 0;
  totpage: 0;
  rows: any;
  patientDetail: any = {};
  constructor(private claimService: ClaimService,
    private physicianService: PhysicianService,
    private insuranceProviderService: InsuranceProviderService, public authStore: AuthenticationStore, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService) { }
  ngOnChanges() {
    this.rejectedClaimsData = [];
  }
  ngOnInit() {

    this.cols = [
      { field: 'BillId', header: 'Bill Id' },
      { field: '', header: 'Downloaded Date' },
      { field: 'BillReferenceNumber', header: 'Bill Reference Number' },
      { field: 'PatientName', header: 'Patient Name' },
      { field: 'ServiceDate', header: 'Service Date' },
      { field: 'Physician', header: 'Physician' },

    ]
    this.insuranceFilterType = [
      { InsuranceFilterName: 'All' },
      { InsuranceFilterName: 'Primary' },
      { InsuranceFilterName: 'Secondary' },
      { InsuranceFilterName: 'Tertiary' },
    ]
    this.getPhysicians();
    this.getInsuranceProviders();

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

  parseDate(date) {
    let d = new Date(Date.parse(date));
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  rejectedClaims(pgno) {
    if (this.workedClaims === true) {
      this.reversedWorked = true;
      this.workedButton = false
    }
    else {
      this.reversedWorked = false;
      this.workedButton = true;
    }
    let payload = {
      dateFrom: this.rejectedBillingRangeFrom ? this.rejectedBillingRangeFrom : '',
      dateTo: this.rejectedBillingRangeTo ? this.rejectedBillingRangeTo : '',
      physicianId: this.rejectedSelectedPhysician.physicianid ? this.rejectedSelectedPhysician.physicianid : 0,
      insuranceProviderId: this.rejectedInsuranceProvider.InsuranceProviderId ? this.rejectedInsuranceProvider.InsuranceProviderId : 0,
      patientId: this.authStore.PatientDetail.PatientId ? this.authStore.PatientDetail.PatientId : 0,
      insuranceType: this.electronicInsuranceProvider.InsuranceFilterName ? this.electronicInsuranceProvider.InsuranceFilterName : '',
      isWorked: this.workedClaims ? this.workedClaims : '',
      offset: pgno,
      limit: 2
    }
    this.claimService.getRejectClaimSubmissionsWithFilters(payload).subscribe(res => {
      this.rejectedClaimsData = res.Results;
      this.totrec = res.TotalItems;
      this.totpage = res.TotalPages;
      this.rows = res.PageSize;
      this.rejectedClaimsData.forEach((item, id) => {
        this.rejectedClaimsData[id].ServiceDate = moment(this.rejectedClaimsData[id].ServiceDate).format("DD-MM-YYYY");
      })
    })
  }
  clearDetails() {
    this.rejectedBillingRangeFrom = '';
    this.rejectedBillingRangeTo = '';
    this.rejectedSelectedPhysician = { physicianid: 0 };
    this.rejectedInsuranceProvider = { InsuranceProviderId: 0 };
    this.electronicInsuranceProvider = { InsuranceFilterName: '' };
    this.workedClaims = false;
    this.authStore.PatientDetail = {};
  }
  workedRemittanceClaim() {
    //   this.rejectedClaimsData.forEach( (item, index) => {
    //   this.selectedBillId[index] = item.BillId
    // })
    if (this.selectedBillId.length === 0) {
      this.showWarningAlert("Select atleast one row from the table")
      return;
    }
    let temo: any[] = [];
    this.selectedBillId.forEach(element => {
      temo.push(element.BillId)
    });
    let payload = {
      selectedBills: temo,
      isWorked: true,
    }
    this.claimService.setWorkedRemittanceClaims(payload).subscribe(res => {
      this.rejectedClaims(0);
      this.showAlert("Updated successfully!");
    })
  }
  reversedWorkedMethod() {
    if (this.selectedBillId.length === 0) {
      this.showWarningAlert("Select atleast one row from the table")
      return;
    }
    let temp: any[] = [];
    this.selectedBillId.forEach(element => {
      temp.push(element.BillId)
    });
    let payload = {
      selectedBills: temp,
      isWorked: false,
    }
    this.claimService.setWorkedRemittanceClaims(payload).subscribe(res => {
      this.rejectedClaims(0);
      this.showAlert("Updated successfully!");
    })
  }
  expandRowComment(rowdata) {
    let payload = {
      superBillId: rowdata.BillId,
    }
    this.claimService.getSuperBillIdClaim(payload).subscribe(res => {
      this.remittanceComments = res;
    })
  }
  physicianPracticeInformation(rowData) {
    const modRef = this.modalService.open(ClaimsModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.physicianInformation = true;
    modRef.componentInstance.physicianlist = this.physicianLists;
    modRef.componentInstance.BillId = rowData.BillId
    modRef.componentInstance.physicianId = rowData.PhysicianId;
    modRef.componentInstance.facilityId = rowData.FacilityId;
  }
  reSubmitWindow() {
    const modRef = this.modalService.open(ClaimsModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.reSubmit = true;
  }
  downloadRejection() {
    let payload = {
      userId: this.authStore.UserDetail.UserId,
      corePracticeId: this.authStore.PracticeDetail.PracticeId
    }
    this.claimService.downloadRejectedClaims(payload).subscribe(res => {
    })
  }
  showAlert(msg: string) {
    this.toaster.success(msg)
  }
  showWarningAlert(msg: string) {
    this.toaster.warning(msg)
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.rejectedClaims(currentpage)
  }
}
