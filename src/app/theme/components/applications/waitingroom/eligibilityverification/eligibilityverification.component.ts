import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppointmentService } from '../../../../../../app/services/workspace/appointment.service';

@Component({
  selector: 'app-eligibilityverification',
  templateUrl: './eligibilityverification.component.html',
  styleUrls: ['./eligibilityverification.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EligibilityverificationComponent implements OnInit {
  @Input() patientData: any;
  statusList: any = [];
  cols: any =[];
  constructor(private activeModal: NgbActiveModal, 
    private appointmentService:  AppointmentService,   
    private modalService: NgbModal,) { }

  ngOnInit() {
    this.statusList =[{statusName:'All'},
    {statusName:'Failed'},
    {statusName:'Pending'},
    {statusName:'Completed'},]  
    this.cols = [
      { field: 'patientname', header: 'Verification Date', filter: true },
      { field: "username", header: "Insurance Provider"},
      { field: "appointmentstarttime", header: "Physician"},
      { field: 'appointmenttype', header: 'Status'},
      { field: "inquiry", header: "Inquiry Result" },
      { field: "details", header: "Details" },
      { field: 'print', header: 'Print' },
    ] ;
  }

  verifyPatientEligibility() {
    let payload = {
      
    }
    this.appointmentService.verifyPatientEligibility(payload).subscribe((res)=>{})
  }

}
