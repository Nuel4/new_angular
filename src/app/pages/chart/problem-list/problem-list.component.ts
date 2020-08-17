import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
// import { EventEmitter } from 'events';
import { ProblemlistService } from './../../../services/chart/problemlist.service';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import { ProblemListModalComponent} from './problem-list-modal/problem-list-modal.component'
declare var $: any;
// import * as $ from 'jquery'
@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProblemListComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  
  toChart: boolean;
  widgetData: any;
  problemList: any;
  patientDetails: any;
  totalRecords = 0;
  cols: any = [];
  currentpage: any;
  rows: any;

  constructor( private problemservice: ProblemlistService,
    private modalService: NgbModal,
    private modal: NgbActiveModal) { }
  ngAfterViewInit() {
  
  }
  ngOnInit() {
   
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
    if (this.patientDetails !== undefined) {
      let page = 0
      this.getProblemList(page);
    }
      // { field: 'Name', header: 'Patient Name' },
    
    this.cols = [
      // {field: '', header: ''},
      {field: 'icd10', header: 'ICD10'},
      {field: 'status', header: 'Status'},
      {field: 'diagnosis', header: 'Diagnosis'},
      {field: 'edit', header: 'Edit'},
      {field: 'delete', header: 'Delete'}
    ];
  }
  refreshData() {
    this.onSomething.emit();
    let page = 0;
    this.getProblemList(page)
  }
  getProblemList(currentpage){
    let param = {
      patientId: this.patientDetails.PatientId,
      offset: currentpage,
      limit: "5"
    }  
this.problemservice.getFormattedProblemList(param).subscribe( Result => {
  this.currentpage = Result.CurrentPage
  this.problemList = Result.Results
  this.totalRecords = Result.TotalItems
  this.rows = Result.PageSize
})
  }
  paginate(event) {
    let currentpage = event.first / event.rows;
    this.getProblemList(currentpage);
  }
  deleteModal(problemData){
// $('#deleteModal').modal('show');
// $('#deleteModal').appendTo('body');
const modRef = this.modalService.open(ProblemListModalComponent, {windowClass: 'delete-class'})
modRef.componentInstance.modalType = 'delete'
modRef.componentInstance.problemDetails = problemData;
modRef.componentInstance.loadEvent.subscribe(
  (value) => {
    if(value){
      // let page = 0;
      this.getProblemList(this.currentpage)
    }
  }
)
  }
  editModal(rowdata){
const modRef = this.modalService.open(ProblemListModalComponent);
modRef.componentInstance.modalType = 'edit'
modRef.componentInstance.problemDetails = rowdata;
modRef.componentInstance.loadEvent.subscribe(
  (value) => {
    if(value){
      // let page = 0;
      this.getProblemList(this.currentpage)
    }
  })
}
}
