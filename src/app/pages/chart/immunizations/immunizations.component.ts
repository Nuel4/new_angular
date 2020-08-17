import {Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import { ImmunzScheService } from '../../../services/chart/immunzsche.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditImmunzComponent } from '../immunz-sche/edit-immunz/edit-immunz.component';
@Component({
  selector: 'app-immunizations',
  templateUrl: './immunizations.component.html',
  styleUrls: ['./immunizations.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImmunizationsComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  widgetData: any;
  toChart: boolean;
  title = 'Using Dynamic Web TWAIN in Angular Project';
  // DWObject: WebTwain;
  patientDetails: any;
  totalRecords: any;
  rows: any;
  immunizationlist: any;
  modalRef: any;
  constructor(private ImmunizationService: ImmunzScheService, private modalService: NgbModal) { }

  ngOnInit() {
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
this.getImmunizationList();
  }
  paginate(event) {
    let currentpage = event.first / event.rows;
    this.getImmunizationList(currentpage);
  }
  refreshData() {
    this.onSomething.emit();
    let page = 0;
    // this.getAllergies(page)
  }

getImmunizationList(currentpage?){
  let param = {
    patientid: this.patientDetails.PatientId,
    offset: currentpage? currentpage : 0,
    limit: "5"
  } 
  this.ImmunizationService.GetPatientImmunizationsByPatientIdWithPaged(param).subscribe(results => {
    this.totalRecords = results.TotalItems
    this.immunizationlist = results.Results
    this.rows = results.PageSize
    return 
  });
}
routeToEditImm(id, isTick = false) {
  this.modalRef = this.modalService.open(EditImmunzComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
  this.modalRef.componentInstance.PatientImmuniationID = id
  this.modalRef.componentInstance.Status = isTick
  this.modalRef.componentInstance.loadEvent.subscribe((value) => {
    if (value) {
      this.getImmunizationList()
    }
  })
}
}
