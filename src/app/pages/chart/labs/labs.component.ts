import {Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import {LabOrdersService } from '../../../services/chart/lab-orders.service'
@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LabsComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  widgetData: any;
  toChart: boolean;
  selectedItem: any;
  selectedResult: any;
  selectedTest: any;
  patientDetails: any;
  totalRecords: any;
  rows: any;
modalRef: any;
OrdersList: any;
  itemStatus: any;
  reviewStatus: any;
  testResult: any;
  constructor(private labOrderService: LabOrdersService) { }

  ngOnInit() {
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
    this.getOrdersList();
  }
  paginate(event) {
    let currentpage = event.first / event.rows;
    this.getOrdersList(currentpage);
  }
  refreshData() {
    this.onSomething.emit();
    let page = 0;
    // this.getAllergies(page)
  }

getOrdersList(currentpage?){
  let param = {
    patientid: this.patientDetails.PatientId,
    phyId: 22,
    ReviewStatus: this.reviewStatus ? this.reviewStatus.label : 'All',
    ItemStatus: this.itemStatus ? this.itemStatus.label : 'All',
    testResult: this.testResult ? this.testResult : 'All',
    offset: currentpage? currentpage : 0,
    limit: "5",
  } 
  this.labOrderService.GetCustomOrdersForPatientsPaged(param).subscribe(results => {
    this.totalRecords = results.TotalItems
    this.OrdersList = results.Results
    this.rows = results.PageSize
    return 
  });
}
getItem(data){
}
itemChange(data){
  this.itemStatus = data
  this.getOrdersList();
}
statusChange(data){
this.reviewStatus = data
this.getOrdersList();
}
testChange(data){
  this.testResult = data
  this.getOrdersList();
}
}
