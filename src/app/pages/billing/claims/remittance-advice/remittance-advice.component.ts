import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PhysicianService } from '../../../../services/practice/physician.service'
import { InsuranceProviderService } from '../../../../services/billing/insuranceprovider.service';
import { ClaimService } from '../../../../services/billing/claims.service';
import * as moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ClaimsModalComponent } from '../claims-modal/claims-modal.component';
import { Global } from './../../../../core/global';


@Component({
  selector: 'app-remittance-advice',
  templateUrl: './remittance-advice.component.html',
  styleUrls: ['./remittance-advice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RemittanceAdviceComponent implements OnInit {
  @Input() emptyArr;
  cols: any = [];
  physicianLists: any = [];
  insuranceProvidersList: any = [];
  insuranceFilterType: any = [];
  remittanceFilterType: any = [];
  PatientName: any;
  PatientSsn: any;
  PatientdateOfBirth: any;
  PatientUniqueNumber: any;
  PatientCellPhone: any;
  PatientId: any;
  FirstName: any;
  LastName: any;
  remittanceBillingRangeFrom: any;
  remittanceBillingRangeTo: any;
  remittanceSelectedPhysician: any = {};
  remittanceInsuranceProvider: any = {};
  insuranceType: any = {};
  remittanceChequeReference: any;
  remittanceFilter: any = {};
  PhyNPI: any;
  remittanceAdvice: any = [];
  totrec: 0;
  totpage: 0;
  rows: any;
  autoPostRAOp: any = [];
  autoPastRAOApprove: any = [];
  constructor(private claimService: ClaimService,
    private physicianService: PhysicianService,
    private insuranceProviderService: InsuranceProviderService, public authStore: AuthenticationStore, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService) { }
  ngOnChanges() {
    this.remittanceAdvice = [];
  }
  ngOnInit() {
    this.cols = [
      { field: 'ClaimRemittanceAdviceFileName', header: 'File Name' },
      { field: '', header: 'Payment Date' },
      { field: 'PaymentMethod', header: 'Payment Method' },
      { field: 'ReferenceNumber', header: 'Reference Number' },
      { field: 'Amount', header: 'Payment Amount($)' },
      { field: 'PayerName', header: 'Payer Name' },
      { field: 'Status', header: 'Status' },

    ]
    this.insuranceFilterType = [
      { InsuranceFilterName: 'All' },
      { InsuranceFilterName: 'Primary' },
      { InsuranceFilterName: 'Secondary' },
      { InsuranceFilterName: 'Tertiary' }
    ]
    this.remittanceFilterType = [
      { RemittanceFilterName: 'All' },
      { RemittanceFilterName: 'Posting Errors' },
      { RemittanceFilterName: 'Unapproved' }
    ]
    this.getPhysicians();
    this.getInsuranceProviders();

  }
  getPhysicians() {
    this.physicianService.getPhysicianWithMinimumDetails().subscribe(resp => {
      this.physicianLists = resp;
      for (let i = 0; i < this.physicianLists.length; i++) {
        this.physicianLists[i].physicianName = this.physicianLists[i].firstname + ' ' + this.physicianLists[i].lastname;
        // this.PhyNPI = this.physicianLists.nationalprovideridentifier
      }
    });
  }
  getInsuranceProviders() {
    this.insuranceProviderService.getInsuranceProviders().subscribe(resp => {
      this.insuranceProvidersList = resp;
    });
  }
  // getPatientDetails() {
  //   let patientDetails =this.authStore.PatientDetail;
  //   this.PatientName = patientDetails.FirstName + ' ' + patientDetails.LastName;
  //   this.FirstName = patientDetails.FirstName;
  //   this.LastName = patientDetails.LastName;
  //   this.PatientSsn = patientDetails.Ssn;
  //   this.PatientdateOfBirth = this.parseDate(patientDetails.DateOfBirth);
  //   this.PatientUniqueNumber = patientDetails.UniqueNumber;
  //   this.PatientCellPhone = patientDetails.MobilePhone;
  //   this.PatientId = patientDetails.PatientId;
  // }
  getRemittanceAdvice(pgno) {
    let payload = {
      dateFrom: this.remittanceBillingRangeFrom ? this.remittanceBillingRangeFrom : 'DD-MM-YYYY',
      dateTo: this.remittanceBillingRangeTo ? this.remittanceBillingRangeTo : 'DD-MM-YYYY',
      physicianId: this.remittanceSelectedPhysician.physicianid ? this.remittanceSelectedPhysician.physicianid : 0,
      insuranceProviderNumber: this.remittanceInsuranceProvider.InsuranceProviderId ? this.remittanceInsuranceProvider.InsuranceProviderId : '',
      patientId: this.PatientId ? this.PatientId : 0,
      insuranceType: this.insuranceType.InsuranceFilterName ? this.insuranceType : 0,
      phyNPI: this.remittanceSelectedPhysician.nationalprovideridentifier ? this.remittanceSelectedPhysician.nationalprovideridentifier : '',
      patientSSN: this.PatientSsn ? this.PatientSsn : '',
      firstName: this.FirstName ? this.FirstName : '',
      lastName: this.LastName ? this.LastName : '',
      checkReferenceNumber: this.remittanceChequeReference ? this.remittanceChequeReference : '',
      remittanceFilter: this.remittanceFilter.RemittanceFilterName ? this.remittanceFilter.RemittanceFilterName : '',
      offset: pgno,
      limit: 3
    }
    this.claimService.GetClaimRemittanceAdvice(payload).subscribe(res => {
      this.remittanceAdvice = res.Results;
      this.totrec = res.TotalItems;
      this.totpage = res.TotalPages;
      this.rows = res.PageSize;
    })
  }
  clearRemittanceAdvice() {
    this.remittanceBillingRangeFrom = '';
    this.remittanceBillingRangeTo = '';
    this.remittanceSelectedPhysician = { physicianid: 0 };
    this.remittanceInsuranceProvider = { InsuranceProviderId: 0 };
    this.insuranceType = { InsuranceFilterName: 0 };
    this.remittanceSelectedPhysician = { nationalprovideridentifier: '' };
    this.remittanceChequeReference = '';
    this.remittanceFilter = { RemittanceFilterName: '' };
    this.authStore.PatientDetail = {};
  }
  getComments(rowData) {
    const modRef = this.modalService.open(ClaimsModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.commentInfo = true;
    modRef.componentInstance.remitAdvice = rowData;

  }
  viewRemittanceAdvice(rowData) {
    let payload = {
      fileName: rowData.ClaimRemittanceAdviceFileName,
      userId: this.authStore.UserDetail.UserId,
      corePracticeId: this.authStore.PracticeDetail.PracticeId
    }
    this.claimService.viewRemittanceAdvice(payload).subscribe(res => {
    })
  }
  downloadRemittance() {
    let payload = {
      userId: this.authStore.UserDetail.UserId,
      corePracticeId: this.authStore.PracticeDetail.PracticeId
    }
    this.claimService.downloadRemmitance(payload).subscribe(res => {
      const modRef = this.modalService.open(ClaimsModalComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' });
      modRef.componentInstance.downloadRemmitance = true;
    })
  }

  autoPost(rowData) {
    let infoDisplay = '', lstCouldNotMatchBills, lstCouldNotMatchInsuranceProvider, lstHasPreviousPayments
    if (Global.Globel_Direct_Auto_Post) {
      // this.autoPostRAOp = this.autoPostRemittanceAdvice(rowData);
      let payload = {
        raHeaderId: rowData.ClaimRemittanceAdviceHeaderId,
        userId: this.authStore.UserDetail ? this.authStore.UserDetail.UserId : 0,
      }
      this.claimService.autoPostRemittanceAdvice(payload).subscribe(res => {
        this.autoPostRAOp = res;
        // return res;
      // })
      if (this.autoPostRAOp && this.autoPostRAOp.length === 1 && this.autoPostRAOp) {
        if (this.autoPostRAOp[0].passed && this.autoPostRAOp[0].errorMessage === null || (this.autoPostRAOp[0].errorMessage && this.autoPostRAOp[0].errorMessage.length === 0))
          infoDisplay = "Auto post of remittance advice successful."
        else if (this.autoPostRAOp[0].passed && this.autoPostRAOp[0].errorMessage !== null || (this.autoPostRAOp[0].errorMessage && this.autoPostRAOp[0].errorMessage.length > 0))
          infoDisplay = "Auto post of remittance advice partially successful. There were errors with some transactions."
        else {
          infoDisplay = this.autoPostRAOp[0].errorMessage
          if (infoDisplay == null)
            infoDisplay = "Auto-posting issues: Could not post remittance advice successfully. Please allocate this remittance advice manually.";
          else {
            let splitComments = infoDisplay.split(new RegExp(["AUTOPOST-|", "APPROVEANDPOST-|", "{", "}", "|"].join('|')))
            splitComments.map(item => {
              if (item.includes(Global.ErrorRACouldNotMatchBill))
                lstCouldNotMatchBills.Add(item.replace(item, Global.ErrorRACouldNotMatchBill));

              if (item.includes(Global.ErrorRACouldNotMatchInsuranceProvider))
                lstCouldNotMatchInsuranceProvider.Add(item.replace(item, Global.ErrorRACouldNotMatchInsuranceProvider));

              if (item.includes(Global.ErrorRAPreviousPayment))
                lstHasPreviousPayments.Add(item.replace(item, Global.ErrorRAPreviousPayment));
            })
            if (lstCouldNotMatchBills.Count > 0) {
              infoDisplay = "Auto-posting issues: Please allocate payment for these service lines manually.\r\n";
              lstCouldNotMatchBills.map(item => {
                infoDisplay += item + "\r\n";
              })
            }

            if (lstCouldNotMatchInsuranceProvider.Count > 0) {
              infoDisplay = "Auto-posting issues: Could not match insurance provider in yeats. Please add insurance provider in yeats.\r\n";
              lstCouldNotMatchInsuranceProvider.map(item => {
                infoDisplay += item + "\r\n";
              })
            }

            if (lstHasPreviousPayments.Count > 0) {
              infoDisplay = "Auto-posting issues: There was payment previously applied to one or more service line of this bill. Please allocate payment for this bill manually.\r\n";
              lstHasPreviousPayments.map(item => {
                infoDisplay += item + "\r\n";
              })
            }

            infoDisplay = infoDisplay.replace(";", "; ");
            // this.toaster.warning(infoDisplay)
          }
        }
      }
      this.showWarningAlert(infoDisplay)
    })
  }
    else {
      // this.autoPastRAOApprove = this.approveRemittance(rowData)
      let payload = {
        raHeaderId: rowData.ClaimRemittanceAdviceHeaderId,
        userId: this.authStore.UserDetail ? this.authStore.UserDetail.UserId :0
      }
      this.claimService.approveRemittanceAdvice(payload).subscribe(res => {
        this.autoPastRAOApprove = res
      
      if (this.autoPastRAOApprove && this.autoPastRAOApprove.length === 1 && this.autoPastRAOApprove) {
        if (this.autoPastRAOApprove[0].passed && this.autoPastRAOApprove[0].errorMessage === null || (this.autoPostRAOp[0].errorMessage && this.autoPostRAOp[0].errorMessage.length === 0))
          infoDisplay = "Approve of remittance advice successful."
        else if (this.autoPastRAOApprove[0].passed && this.autoPastRAOApprove[0].errorMessage !== null || (this.autoPostRAOp[0].errorMessage && this.autoPostRAOp[0].errorMessage.length > 0))
          infoDisplay = "Approve of remittance advice partially successful. There were errors with some transactions."
        else {
          infoDisplay = this.autoPastRAOApprove[0].errorMessage

          let splitComments = infoDisplay.split(new RegExp(["AUTOPOST-|", "APPROVEANDPOST-|", "{", "}", "|"].join('|')))

          splitComments.map(item => {
            if (item.includes(Global.ErrorRACouldNotMatchBill))
              lstCouldNotMatchBills.Add(item.replace(item, Global.ErrorRACouldNotMatchBill));

            if (item.includes(Global.ErrorRACouldNotMatchInsuranceProvider))
              lstCouldNotMatchInsuranceProvider.Add(item.replace(item, Global.ErrorRACouldNotMatchInsuranceProvider));

          })
          if (lstCouldNotMatchBills.Count > 0) {
            infoDisplay = "Auto-posting issues: Please allocate payment for these service lines manually.\r\n";
            lstCouldNotMatchBills.map(item => {
              infoDisplay += item + "\r\n";
            })
          }

          if (lstCouldNotMatchInsuranceProvider.Count > 0) {
            infoDisplay = "Auto-posting issues: Could not match insurance provider in yeats. Please add insurance provider in yeats.\r\n";
            lstCouldNotMatchInsuranceProvider.map(item => {
              infoDisplay += item + "\r\n";
            })
          }

          infoDisplay = infoDisplay.replace(";", "; ");
          // this.toaster.warning(infoDisplay)
        }
       
      }
      this.showWarningAlert(infoDisplay)
    })
    }
  }
  autoPostRemittanceAdvice(rowData) {
    let payload = {
      raHeaderId: rowData.ClaimRemittanceAdviceHeaderId,
      userId: this.authStore.UserDetail ? this.authStore.UserDetail.UserId : 0,
    }
    this.claimService.autoPostRemittanceAdvice(payload).subscribe(res => {
      return res;
    })
  }
  approveRemittance(rowData){
    let payload = {
      raHeaderId: rowData.ClaimRemittanceAdviceHeaderId,
      userId: this.authStore.UserDetail ? this.authStore.UserDetail.UserId :0
    }
    this.claimService.approveRemittanceAdvice(payload).subscribe(res => {
      return res;
    })
  }
  parseDate(date) {
    let d = new Date(Date.parse(date));
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.getRemittanceAdvice(currentpage)
  }
  showWarningAlert(msg: string) {
    this.toaster.warning(msg)
  }
}
