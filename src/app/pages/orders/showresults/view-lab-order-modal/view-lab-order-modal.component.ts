import { Component, OnInit, ViewEncapsulation, Input,Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { LabOrderService } from '../../../../services/orders/lab-order.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AuthenticationStore } from '../../../../authentication/authentication-store';
@Component({
  selector: 'app-view-lab-order-modal',
  templateUrl: './view-lab-order-modal.component.html',
  styleUrls: ['./view-lab-order-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewLabOrderModalComponent implements OnInit {
@Input() viewModal;
@Input() rowData;
@Input() labOrderItem;
@Input() mrLabOrderDetails;
@Input() customOrder;
@Output() loadEvent: EventEmitter<any> = new EventEmitter()
  laboratory: any;
  selectedLaboratory: any = {};
  patientDOB: any;
  labOrderItemResultDetails: any;
  orderFullName: any;
  comments: any;
  userDetails: any;
  showModal: boolean = false;
  testPerformedDate: any;
  testResultValue: any;
  testSpecimenSource: any;
  selectedTestResult: any;
  resultView: any;
  barCodeNumber: any;
  testReportDate: any;
  checked: boolean = false;
  conditionSpecimen: any;
  labAddress: string;
  labphoneNumber: any;
  units: any;
  testResult: any[];
  constructor(private modal: NgbActiveModal, private labOrderService: LabOrderService,private authstore: AuthenticationStore,private modalService: NgbModal, private toaster: ToastrService) { }

  ngOnInit() {
    this.testResult = [
      {label: 'Positive'},
      {label: 'Negative'},
      {label:'Normal'},
      {label:'Abnormal'},
      {label:'High'},
      {label:'Medium'},
      {label:'Low'}
    ];
    if(this.viewModal){
      this.patientDOB = new Date(this.labOrderItem.DOBPatient);
     
      this.getLaboratory()
    }
  }
  getLaboratory(){
    this.labOrderService.getLaboratory().subscribe(res => {
      this.laboratory = res;
      this.laboratory.forEach(item => {
        if(item.LaboratoryId === this.mrLabOrderDetails.LaboratoryId){
           this.selectedLaboratory = item;
           this.labAddress = item.LabStreetAddress1 + ' ' + item.LabCity + ' ' + item.LabZipCode;
           this.labphoneNumber = item.MainPhone + '/' + item.AltPhone
        }
      })
    })
    this.getUserDetailLabOrderItemResult();
    this.getLabOrderItemUserDetail();
    this.getCptDetailsByLabOrder();
    this.getLabOrderItemResult();
  }
  getUserDetailLabOrderItemResult(){
    let payload = {
      orderItemesultID: this.rowData.MrLabOrderItemResultId
  }
  this.labOrderService.getUserDetails(payload).subscribe(res => {
    this.userDetails = res[0]
    this.showModal = true;
  })
}
getLabOrderItemUserDetail(){
  let payload = {
    itemId:this.labOrderItem.OrderItemID
  }
  this.labOrderService.getUserDetailsByLabOrderItem(payload).subscribe(res => {
    this.labOrderItemResultDetails =  res;
    this.labOrderItemResultDetails.map((item) => {
      this.orderFullName = item.LastName + ' ' + item.FirstName
    })
  })
}
getCptDetailsByLabOrder(){
  let payload = {
    OrderItemID : this.labOrderItem.OrderItemID
  }
  this.labOrderService.getCptDetailsByLabOrder(payload).subscribe(res => {
  })
}
getLabOrderItemResult(){
  let payload = {
    laborderitemresultId: this.rowData.MrLabOrderItemResultId
  }
  this.labOrderService.getMrLabOrderItemResultDetails(payload).subscribe(res => {
    this.resultView = res;
    this.barCodeNumber = this.resultView.BarCodeNumber;
    this.comments = this.resultView.Comments;
    this.testResultValue = this.resultView.TestResultValue;
    this.testSpecimenSource = this.resultView.TestSpecimenSource
    this.testPerformedDate = new Date(this.resultView.TestPerformedDate);
    this.testReportDate = new Date(this.resultView.TestReportDate);
    this.checked = this.resultView.FlagTestResultAbnormal;
    this.conditionSpecimen = this.resultView.ConditionOfSpecimen;
    this.units = this.resultView.UnitOfMeasure
    this.testResult.forEach(item => {
      if(this.resultView.TestResult === item.label){
        this.selectedTestResult = item;
      }
    })
  })
}
onSave(){
  let payload = {
    MrLabOrderItemId: this.resultView.MrLabOrderItemId,
    MrLabOrderItemResultId: this.resultView.MrLabOrderItemResultId,
    LaboratoryId: this.selectedLaboratory.LaboratoryId,
    NormalMinValPrefix: this.resultView.NormalMinValPrefix,
    NormalMinVal: this.resultView.NormalMinVal,
    NormalMaxValPrefix: this.resultView.NormalMaxValPrefix,
    NormalMaxVal: this.resultView.NormalMaxVal,
    UnitOfMeasure: this.units,
    BarCodeNumber: this.barCodeNumber,
    TestPerformedDate: this.testPerformedDate,
    TestReportDate: this.testReportDate,
    TestResult:this.selectedTestResult.label,
    TestResultValue:this.testResultValue,
    TestResultUnitOfMeasure:this.resultView.TestResultUnitOfMeasure,
    TestSpecimenSource:this.resultView.TestSpecimenSource,
    ConditionOfSpecimen: this.conditionSpecimen,
    FlagSpecimenRejected: this.resultView.FlagSpecimenRejected,
    Comments: this.comments,
    ShowInPatientPortal: this.resultView.ShowInPatientPortal,
    DateEmailedToPatient: this.resultView.DateEmailedToPatient,
    DatePrinted: this.resultView.DatePrinted,
    FlagTestResultAbnormal: this.checked,
    DateCreated: new Date(),
    CreatedByUserId: this.authstore.UserDetail.UserId,
    DateLastUpdated: new Date(),
    LastUpdatedByUserId: this.authstore.UserDetail.UserId,
    LabOrderResultStatus:this.resultView.LabOrderResultStatus ? this.resultView.LabOrderResultStatus : '',
    ItemResultAlias: this.resultView.ItemResultAlias,
    ItemResultName: this.resultView.ItemResultName,
    ItemResultStatus: this.resultView.ItemResultStatus,
    TestResultValueText:this.resultView.TestResultValueText
  }
  this.labOrderService.postLabOrderItemResults(payload).subscribe(res => {
    this.toaster.success('Successfully Updated')
    this.loadEvent.emit(true);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  })
}
}
