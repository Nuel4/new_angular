import { ClaimsModalComponent } from './../claims-modal/claims-modal.component';
import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ClaimService } from '../../../../services/billing/claims.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment';
@Component({
  selector: 'app-approve-remittance-advice',
  templateUrl: './approve-remittance-advice.component.html',
  styleUrls: ['./approve-remittance-advice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApproveRemittanceAdviceComponent implements OnInit {

  cols: any = [];
  column: any = [];
  PatientName: any;
  PatientSsn: any;
  PatientdateOfBirth: any;
  PatientUniqueNumber: any;
  PatientCellPhone: any;
  PatientId: any;
  approveRemittanceChequeReference: any;
  approveRemittance: any = [];
  UserId: any;
  approveBillTransaction: any = [];
  approveList: any = [];
  totrec:0;
  totpage:0;
  rows:any;
  constructor(private claimService: ClaimService, public authStore: AuthenticationStore, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService) {

  }

  ngOnInit() {

    this.cols = [
      { field: 'BillHeaderId', header: 'Id' },
      { field: 'PatientName', header: 'Patient Name' },
      { field: 'ServiceStart', header: 'Service Date' },
      { field: 'ReferenceNumber', header: 'Reference #' },
      { field: 'Amount', header: 'Total Charges' },
      { field: 'ClaimStatusCode', header: 'Approve' },
      { field: 'delete', header: 'Delete' }
    ]
    this.column = [
      { field: 'billTransactionId', header: 'Id' },
      { field: 'serviceStart', header: 'Service Date' },
      { field: 'cptcode', header: 'CPT' },
      { field: 'amount', header: 'Tot.Charges' },
      { field: 'pos', header: 'POS' },
      { field: 'units', header: 'Units' }
    ];
    this.getUserDetails()
    this.getApproveRemittance(0);

  }
  // getPatientDetails() {
  //   let patientDetails = this.authStore.PatientDetail

  //   this.PatientName = patientDetails.FirstName + ' ' + patientDetails.LastName;
  //   this.PatientSsn = patientDetails.Ssn;
  //   this.PatientdateOfBirth = this.parseDate(patientDetails.DateOfBirth);
  //   this.PatientUniqueNumber = patientDetails.UniqueNumber;
  //   this.PatientCellPhone = patientDetails.MobilePhone;
  //   this.PatientId = patientDetails.PatientId;

  // }
  getUserDetails() {
    let userDetails = this.authStore.UserDetail
    this.UserId = userDetails.UserId;
  }
  getApproveRemittance(pgno) {
    let payload = {
      patientId: this.authStore.PatientDetail.PatientId ? this.authStore.PatientDetail.PatientId : 0,
      referenceNumber: this.approveRemittanceChequeReference ? this.approveRemittanceChequeReference : '',
      offset:pgno,
      limit:3
    };
    this.claimService.getApproveRemittanceAdvice(payload).subscribe(resp => {
      this.totrec = resp.TotalItems;
      this.totpage = resp.TotalPages;
      this.rows = resp.PageSize;
      this.approveRemittance = resp.Results;
      this.approveRemittance.forEach((item, index) => {
        this.approveRemittance[index].ServiceStart = moment(this.approveRemittance[index].ServiceStart).format("DD-MM-YYYY")
      })
    })
  }
  getApproved(value) {
    let payload = {
      pBillHeaderId: value.BillHeaderId,
    }
    this.claimService.approveRemittance(payload).subscribe(res => {
      this.getApproveRemittance(0);
    })
  }
  getBillTransactionsApproved(value) {
    let payload = {
      pBillHeaderId: value.BillHeaderId,
    }
    this.claimService.getBillTransactionsApproved(payload).subscribe(res => {
      this.approveBillTransaction = res;
      this.approveBillTransaction.forEach((item, id) => {
        this.approveBillTransaction[id].serviceStart = moment(this.approveBillTransaction.serviceStart).format("DD-MM-YYYY");
      })
    })
  }
  clearApproveRemittance() {
    this.authStore.PatientDetail = {};
  }
  deleteApproveRemittance(approvedObj) {

    const modRef = this.modalService.open(ClaimsModalComponent, { windowClass: "delete-class" });
    modRef.componentInstance.IsDelete = true;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if(value){
        let payload = {
          BillHeaderId: approvedObj.BillHeaderId,
          UserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0
        }
        this.claimService.deleteApproveRemitance(payload).subscribe(res => {

          modRef.close()
          this.modal.close('Close click')
          this.showAlert("Deleted successfully!")
          this.getApproveRemittance(0);
        })
      }
    })

  }
  getDeleteApproveRemittanceList() {
    this.claimService.getAfterDeleteApproveRemittance().subscribe(res => {
      this.approveList = res;
      this.approveList.forEach((item, index) => {
        this.approveList[index].serviceStart = moment(this.approveList[index].serviceStart).format("DD-MM-YYYY");
      })
    })
  }
  parseDate(date) {
    let d = new Date(Date.parse(date));
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.getApproveRemittance(currentpage)
  }
  showAlert(msg: string) {
    this.toaster.success(msg)
  }
}
