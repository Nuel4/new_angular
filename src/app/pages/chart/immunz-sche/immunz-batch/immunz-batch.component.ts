import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImmunzScheService } from './../../../../services/chart/immunzsche.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-immunz-batch',
  templateUrl: './immunz-batch.component.html',
  styleUrls: ['./immunz-batch.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImmunzBatchComponent implements OnInit {
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  @Input() TypeID: any
  immunBatchList: any
  Index: any = 0
  storedPatient: any;
  storeUser: any;
  batchno: any;
  expiredate: any;
  batchcount: any;
  remaining: any;
  drug: any;
  tradename: any;
  manufacture: any;
  code: any;
  agent: any;
  isActive: any;
  TotalRecords: any;
  PageSize: any;
  TotalItems: any;
  isUpdate: boolean = false;
  MrImmunizationBatchId: any;
  constructor(
    public activeModal: NgbActiveModal,
    public immScheService: ImmunzScheService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.storedPatient = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.storeUser = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.loadBatchList()
  }

  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.loadBatchList()

  }

  loadBatchList() {
    let param = {
      PMrImmunizationTyeId: this.TypeID,
      offset: this.Index,
      limit: 5
    }
    this.immScheService.GetMrImmunizationBatchByMrImmunizationTypeIdPaged(param).subscribe(resp => {
      this.immunBatchList = resp.Results
      this.PageSize = resp.PageSize
      this.TotalItems = resp.TotalItems
    })
  }

  AddBatch() {
    let batch = {
      MrImmunizationTypeId: this.TypeID,
      BatchNumber: this.batchno,
      ExpiryDate: this.expiredate,
      BatchCount: this.batchcount ? this.batchcount : "",
      Remaining: this.remaining ? this.remaining : "",
      Drug: this.drug ? this.drug : "",
      TradeName: this.tradename ? this.tradename : "",
      Manufacture: this.manufacture ? this.manufacture : "",
      Agent: this.agent ? this.agent : "",
      DateCreated: new Date(),
      CreatedBy: this.storeUser.UserId,
      DateUpdated: new Date(),
      UpdatedBy: this.storeUser.UserId,
      ManufactureCode: this.code ? this.code : "",
      Status: this.isActive
    }
    this.immScheService.InsertMrImmunizationBatch(batch).subscribe(resp => {
      this.showSuccess("Immunization Batch Successfully Added");
      this.loadEvent.emit(true)
    })
  }

  loadBatchData(id) {
    this.isUpdate = true
    this.immunBatchList.map(item=>{
      if(id===item.MrImmunizationBatchId){
        this.MrImmunizationBatchId = id
        this.batchno = item.BatchNumber
        this.expiredate = new Date(item.ExpiryDate)
        this.batchcount = item.BatchCount
        this.remaining = item.Remaining
        this.drug = item.Drug
        this.tradename = item.tradename
        this.manufacture = item.Manufacture
        this.code = item.ManufactureCode
        this.agent = item.Agent
        this.isActive = item.Status
      }
    })

  }

  DeleteBatchData(imm) {
    let batch = {
      MrImmunizationTypeId: this.TypeID,
      BatchNumber: this.batchno,
      ExpiryDate: this.expiredate,
      BatchCount: this.batchcount ? this.batchcount : "",
      Remaining: this.remaining ? this.remaining : "",
      Drug: this.drug ? this.drug : "",
      TradeName: this.tradename ? this.tradename : "",
      Manufacture: this.manufacture ? this.manufacture : "",
      Agent: this.agent ? this.agent : "",
      DateCreated: new Date(),
      CreatedBy: this.storeUser.UserId,
      DateUpdated: new Date(),
      UpdatedBy: this.storeUser.UserId,
      ManufactureCode: this.code ? this.code : "",
      Status: this.isActive
    }
    this.immScheService.DeleteMrImmunizationBatch(imm).subscribe(resp => {
      this.showSuccess("Immunization Batch Successfully Deleted")
      this.loadBatchList()
    })
  }
  UpdateBatch() {
    let batch = {
      MrImmunizationTypeId: this.TypeID,
      MrImmunizationBatchId: this.MrImmunizationBatchId,
      BatchNumber: this.batchno,
      ExpiryDate: this.expiredate,
      BatchCount: this.batchcount ? this.batchcount : "",
      Remaining: this.remaining ? this.remaining : "",
      Drug: this.drug ? this.drug : "",
      TradeName: this.tradename ? this.tradename : "",
      Manufacture: this.manufacture ? this.manufacture : "",
      Agent: this.agent ? this.agent : "",
      DateCreated: new Date(),
      CreatedBy: this.storeUser.UserId,
      DateUpdated: new Date(),
      UpdatedBy: this.storeUser.UserId,
      ManufactureCode: this.code ? this.code : "",
      Status: this.isActive
    }
    this.immScheService.UpdateMrImmunizationBatch(batch).subscribe(resp => {
      this.showSuccess("Immunization Batch Successfully Updated")
      this.activeModal.dismiss('closing')
    })
  }

  onFormReset(){
    this.batchno = "";
    this.expiredate= "";
    this.batchcount="";
    this.remaining= "";
    this.drug= "";
    this.tradename= "";
    this.manufacture= "";
    this.code= "";
    this.agent= "";
    this.isActive= "";
    

  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success Message');
  }

  showError(msg) {
    this.toastr.error(msg, 'Error Message');
  }

  showWarring(msg) {
    this.toastr.warning(msg, 'Warring Message');
  }

  onCancel() {
    this.activeModal.dismiss('closing batch')
  }
}
