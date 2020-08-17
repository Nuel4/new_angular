import { PatientAccountsService } from './../../../../../services/billing/patient-accounts.service';
import { Component, OnInit, ViewEncapsulation,Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import * as moment from 'moment';
import { ReportmodalComponent } from '../../../../../../app/pages/chart/progressnote/template-editor/reportmodal/reportmodal.component';

@Component({
  selector: 'app-patientaccount-summary-modal',
  templateUrl: './patientaccount-summary-modal.component.html',
  styleUrls: ['./patientaccount-summary-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientaccountSummaryModalComponent implements OnInit {
@Input() printStatement;
@Input() pastStatement;
@Input() patientId;
lastPatientaDate: any;
patientBalance: any;
dataRange: any;
paymants: any;
cols: any[];
pastDetails: any = [];
totrec = 0;
totpage = 0;
rows: any;
  constructor(private modalService: NgbModal,private modal: NgbActiveModal,private toaster: ToastrService,private patientAccService : PatientAccountsService) { }

  ngOnInit() {
    this.cols = [
      { field: 'dateCreated', header: 'Date' },
      { field: 'fileName', header: 'File Name' },
     
  ];
  if(this.pastStatement){
    this.getPastStatement(0)
  }
  }
  getPastStatement(pgno){
    let payload = {
      patientid: this.patientId,
      offset: pgno,
      limit: 5
    }
    this.patientAccService.getPastStatement(payload).subscribe(res => {
      console.log(res);
      this.pastDetails =res.Results
      this.totrec = res.TotalItems;
      this.totpage = res.TotalPages;
      this.rows = res.PageSize;
      this.pastDetails.forEach((item,id) =>{
        this.pastDetails[id].dateCreated = moment(this.pastDetails[id].dateCreated).format('DD-MM-YYYY');
      })
    })
  }
  selectedPage(event) {
    console.log(event);
    let currentpage = event.first / event.rows;
    this.getPastStatement(currentpage)
  }
  displayReport() {
    const modalRef = this.modalService.open(ReportmodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.audit = true;
    modalRef.componentInstance.header = 'Print/Email Patient Statement Confirmation Window'
  }
}
