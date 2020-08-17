import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../../../../app/services/workspace/appointment.service';
import * as moment from 'moment';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetailsModalComponent implements OnInit {

  @Input() enableDetailsModal: boolean;
  @Input() verificationDetails: any = {};
  @Input() enableNoResults: boolean;
  @Input() payload: any = {};
  cols: any = [];
  rowData: any = this.verificationDetails;
  dateFrom: any;
  dateTo: any;
  status: any;  
  Statuslist: any = []
  constructor(    
    private modalService: NgbModal,
    private apptService: AppointmentService,
    public activeModal: NgbActiveModal,
  ) {   }

  ngOnInit() {
    this.cols = [
      { field: "displayDate", header: "Verification Date" },
      { field: "Comment", header: "Insurance Provider" },
      { field: "displayDate", header: "Physician" },
      { field: "Comment", header: "Status" },
      { field: "displayDate", header: "Inquiry Result" },
      { field: "Comment", header: "Details" },
      { field: "displayDate", header: "Print" }
    ];
    this.Statuslist = [
      { name: 'All', value: 1},
      { name: 'Failed', value: 2},
      { name: 'Pending', value: 3},
      { name: 'Completed', value: 4},
    ]
  }

  searchDetails() {
    this.paginate()
  }

  clearForm() {
    this.status = {};
    this.dateFrom = '';
    this.dateTo = '';
  }

  paginate(event?) {   
    this.verificationDetails = [];
    const index = event ? (event.first / event.rows) : 0;
    this.payload.offset = index,
    this.payload.transactionStatus = this.status ? this.status.name : '',
    this.payload.startingDate = this.dateFrom ? moment(this.dateFrom).format('DD-MM-YYYY') : '',
    this.payload.endingDate = this.dateTo ? moment(this.dateTo).format('DD-MM-YYYY'): ''
    this.apptService.getPatientEligibilityVerificationforPaitent(this.payload).subscribe((res:any)=>{
      this.verificationDetails = res;
    })
  }

}
