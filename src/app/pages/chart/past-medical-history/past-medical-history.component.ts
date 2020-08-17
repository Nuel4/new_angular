import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { PatientmedicalhistoryService} from '../../../services/chart/patientmedicalhistory.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { PmhModalComponent} from './pmh-modal/pmh-modal.component'
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';
@Component({
  selector: 'app-past-medical-history',
  templateUrl: './past-medical-history.component.html',
  styleUrls: ['./past-medical-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PastMedicalHistoryComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  toChart: boolean;
  widgetData: any;
  patientDetails: any;
  pmhList: any;
  totalRecords: any;
  rows: any;
  currentPage: any;
  isenableOnlyTable: boolean = false;
  isenableWidgetPmh: boolean = false;
  cols: any[];

  constructor(private pmhservice: PatientmedicalhistoryService,
     private modalService: NgbModal,
     private route: ActivatedRoute,
     private fb: FormBuilder) { }
  ngAfterViewInit() {
  
  }
  ngOnInit() {
    this.cols = [
      {field: '', header: 'Date added'},
      {field: '', header: 'Description'},
      {field: '', header: 'Type'},
      {field: '', header: 'Edit'},
      {field: '', header: 'Deactivate'},
    ]
    this.widgetData = this.wData && JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"));
    if (this.patientDetails !== undefined) {
      let page = 0
      this.getpmhlist(page);
    }

    if(this.route.snapshot.routeConfig.path === ""){
      
      // this.isenableOnlyTable = true;
      this.isenableWidgetPmh = false;

    }
    else if(this.route.snapshot.routeConfig.path === "template-editor"){
      this.isenableWidgetPmh = true;
      // this.isenableOnlyTable = true;
    }
    if(this.PEValueObj){
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
  
  }

getpmhlist(currentpage){
  let param ={
    patientId: this.patientDetails.PatientId,
    offset: currentpage,
    limit: "5"
  }
this.pmhservice.GetCustomFormattedPastMedicalHistory(param).subscribe(
  res => {
    this.currentPage = res.CurrentPage
    this.pmhList = res.Results;
    this.totalRecords = res.TotalItems
    this.rows = res.PageSize
  } 
)
}
paginate(event){
  let currentpage = event.first / event.rows;
  this.getpmhlist(currentpage);
}
editPmh(pmhList){
const modRef = this.modalService.open(PmhModalComponent, {size:'lg', centered: true})
modRef.componentInstance.pmhData = pmhList;
modRef.componentInstance.IsDelete = false;
modRef.componentInstance.PEValueObj = this.PEValueObj;
modRef.componentInstance.loadEvent.subscribe(
  (value) => {
    if(value){
      this.getpmhlist(this.currentPage);
    }
  }
)
}
deletePmh(pmhlist){
const modRef = this.modalService.open(PmhModalComponent, {windowClass: "delete-class"});
modRef.componentInstance.pmhData = pmhlist;
modRef.componentInstance.IsDelete = true;
modRef.componentInstance.loadEvent.subscribe(
  (value) => {
    if(value){
      // let page = 0
      this.getpmhlist(this.currentPage);
    }
  }
)
}
  refreshData() {
    this.onSomething.emit();
    let page = 0;
    this.getpmhlist(page)
  }
}
