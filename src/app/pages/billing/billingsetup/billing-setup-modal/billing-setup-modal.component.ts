import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { BillingSetupService } from '../../../../services/billing/billing-setup.service';
import { ToastrService } from 'ngx-toastr'
import { AuthenticationStore } from '../../../../authentication/authentication-store';
@Component({
  selector: 'app-billing-setup-modal',
  templateUrl: './billing-setup-modal.component.html',
  styleUrls: ['./billing-setup-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingSetupModalComponent implements OnInit {

  @Input() IsDelete;
  @Input() deleteCPT;
  @Input() IsDeleteNonProcedural;
  @Input() officeCharge;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter()
  nonProcedureList: any = [];
  nonProcedureListClone: any = [];
  billingSetupCPT: any;
  billingSetupDescription: any;
  officeChargeColumns: any = [];
  billingSetupCode: any;
  billingSetupAmount: number;
  Update: boolean = false;
  Save: boolean = true;
  editData: any = {};
  selectedCategory: any = {}
  constructor(private modal: NgbActiveModal, private billingSetupService: BillingSetupService, private toastr: ToastrService, public authStore: AuthenticationStore) { }

  ngOnInit() {
    if (this.officeCharge) {
      this.getNonProcedure()
    }
    this.officeChargeColumns = [
      { field: 'NonProcedureOfficeChargeId', header: 'Id' },
      { field: 'Description', header: 'Description' },
      { field: 'NonProcedureOfficeChargeCode', header: 'Code' },
      { field: 'ChargeAmount', header: 'Amount' }
    ]
  }
  deleteFaciltyInsuranceProvider() {
    this.loadEvent.emit(true);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }

  getNonProcedure() {
    this.billingSetupService.getNonProcedureOfficeCharge().subscribe(res => {
      this.nonProcedureList = res;
      this.nonProcedureListClone = res;
    })
  }
  deleteNonProcedural(rowData) {

    let payload = {
      NonProcedureOfficeChargeId: rowData.NonProcedureOfficeChargeId
    }
    this.billingSetupService.deleteNonproceduralOfficeCharge(payload).subscribe(res => {
      this.showAlert('Delete Successfully')
      this.getNonProcedure()
    })

  }
  saveNonProcedure(save) {
    if (this.billingSetupDescription === undefined || this.billingSetupCode === undefined || this.billingSetupAmount === undefined) {
      this.toastr.error("Please select mandatory fields ")
    }
    let payload = {
      Description: this.billingSetupDescription,
      ChargeAmount: this.billingSetupAmount,
      DateCreated: new Date(),
      CreatedByUserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0,
      NonProcedureOfficeChargeCode: this.billingSetupCode
    }
    this.billingSetupService.postNonProceduralOfficeCharge(payload).subscribe(res => {
      this.showAlert("Successfully Added")
      this.getNonProcedure()
    })
  }
  editNonProcedure(rowData) {
    this.editData = rowData
    this.billingSetupDescription = rowData.Description;
    this.billingSetupCode = rowData.NonProcedureOfficeChargeCode;
    this.billingSetupAmount = rowData.ChargeAmount;
    // let editData = {
    //   Description: rowData.Description,
    //   Code: rowData.NonProcedureOfficeChargeCode,
    //   Amount:rowData.ChargeAmount
    // }
    this.Save = false;
    this.Update = true;

  }
  updateNonProcedure() {
    let payload = {
      Description: this.billingSetupDescription,
      ChargeAmount: this.billingSetupAmount,
      DateCreated: this.editData.DateCreated,
      CreatedByUserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : 0,
      NonProcedureOfficeChargeCode: this.billingSetupCode,
      NonProcedureOfficeChargeId: this.editData.NonProcedureOfficeChargeId
    }
    this.billingSetupService.updateNonProcedureOfficeCharge(payload).subscribe(res => {
      this.showAlert("Successfully Updated");
      this.getNonProcedure();
    })
  }
  selectNonOfficeCharge(data) {
    this.billingSetupDescription = data.Description;
    this.billingSetupCode = data.NonProcedureOfficeChargeCode;
    this.billingSetupAmount = data.ChargeAmount;
    this.Save = false;
    this.Update = true;
    this.nonProcedureList = this.nonProcedureListClone.filter(item =>
      item.NonProcedureOfficeChargeId === data.NonProcedureOfficeChargeId)
    this.nonProcedureListClone.filter(item => {
      if (item.NonProcedureOfficeChargeId === data.NonProcedureOfficeChargeId) {
        this.editData = item;
      }
    })
  }
  clearNonProcedure() {
    this.billingSetupDescription = '';
    this.billingSetupCode = '';
    this.billingSetupAmount = null;
    this.selectedCategory = null;
    this.Update = false;
    this.Save = true;
    this.getNonProcedure()
  }
  deleteCpt() {
    this.loadEvent.emit(true);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
  showAlert(msg: string) {
    this.toastr.success(msg)
  }
  showWarningAlert(msg: string) {
    this.toastr.warning(msg)
  }
}
