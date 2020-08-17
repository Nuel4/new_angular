import { Component, OnInit, ViewEncapsulation , Input} from '@angular/core';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppointmentService} from '../../../../../../services/workspace/appointment.service'
import { moment } from 'fullcalendar';
@Component({
  selector: 'app-viewhistorymodal',
  templateUrl: './viewhistorymodal.component.html',
  styleUrls: ['./viewhistorymodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewhistorymodalComponent implements OnInit {
@Input() order;
@Input() patientId;
  col: any;
tableValue: any;
  pageSize: any;
  totalItems: any;
  constructor( private modal: NgbActiveModal,
    private apptService: AppointmentService) { }

  ngOnInit() {
    this.col = [
      {field: 'insurancename', header: 'Insurance Name'},
      {field: 'insuranceprovidercode', header: 'Code'},
      {field: 'insurancepolicynumber', header: 'Policy number'},
      {field: 'groupnumber', header: 'Group number'},
      {field: 'effectivedate', header: 'Effective date'},
      {field: 'expirationdate', header: 'Expiration date'},
      {field: 'inactivedate', header: 'Inactive date'},
    ]
    let param ={
      patientId: this.patientId,
      order: this.order,
      offset: 0,
      limit: 5
    }
    this.apptService.GetCustomFormattedInsuranceByOrder(param).subscribe(
      result => {
        console.log("GetCustomFormattedInsuranceByOrder", result)
        result.Results.forEach(element => {
          element.inactivedate = element.inactivedate === null ? '' : moment(element.inactivedate).format('DD/MM/YYYY')
        element.expirationdate = element.expirationdate === null ? '' : moment(element.expirationdate).format('DD/MM/YYYY')
        element.effectivedate = element.effectivedate === null ? '' : moment(element.effectivedate).format('DD/MM/YYYY')
        });
        
        this.tableValue = result.Results
        this.pageSize = result.PageSize;
        this.totalItems = result.TotalItems
        console.log("this.tableValue", this.tableValue)
      }
    )
  }
paginate(event){
  console.log("event", event)
}
}
