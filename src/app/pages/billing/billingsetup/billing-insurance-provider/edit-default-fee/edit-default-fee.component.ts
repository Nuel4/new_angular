import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { InsuranceProviderService } from '../../../../../services/billing/insuranceprovider.service';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
declare var $: any;


@Component({
  selector: 'app-edit-default-fee',
  templateUrl: './edit-default-fee.component.html',
  styleUrls: ['./edit-default-fee.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditDefaultFeeComponent implements OnInit {
  @Input() editDefaultFee;
  @Input() feeScheduleRowData;
  @Input() buttonCptRvu;
  rtuColumns: any = [];
  rtuDatas: any = [];
  rowRtuClicked: any = [];
  defaultFS: any;
  cptFeeSchedule: any;
  cptRvuFeeschedule: any;
  selectedCPT: any;
  currentRowData: any;
  rvuFactor: any;
  customFormattedCPT: any;
  cptCode: any;
  feeScheduleRow: boolean = false;
  cpt: boolean = false;
  constructor(private insuranceProviderService: InsuranceProviderService, public authStore: AuthenticationStore, private toastr: ToastrService, private modal: NgbActiveModal) { }

  ngOnInit() {
    this.getOrCreateDefaultFS();
    this.rtuDatas = [
      { cptCode: '99225', rvu: '$225.00' },
      { cptCode: '99205', rvu: '$300.00' },
      { cptCode: '99221', rvu: '$258.00' },
      { cptCode: '99265', rvu: '$357.00' },
      { cptCode: '99212', rvu: '$125.00' },
      { cptCode: '99322', rvu: '$456.00' },
      { cptCode: '92344', rvu: '$752.00' },
      { cptCode: '92543', rvu: '$245.00' },
      { cptCode: '98766', rvu: '$265.00' },
      { cptCode: '95677', rvu: '$256.00' },
      { cptCode: '93456', rvu: '$225.00' },
      { cptCode: '98766', rvu: '$426.00' },
    ];
    if(this.feeScheduleRowData){
      this.cpt = false
      this.feeScheduleRow = true;
    }
    if(this.buttonCptRvu){
      this.cpt = true;
      this.feeScheduleRow = false;
    }
  }
  getCPTFeeSchedule() {
    let payload = {
      feeScheduleId: this.defaultFS[0].FeeScheduleId
    }
    this.insuranceProviderService.getCptFeesSchedule(payload).subscribe(res => {
      this.cptFeeSchedule = res;
    })
  }
  getOrCreateDefaultFS() {
    let payload = {
      updatedByUserId: this.authStore.UserDetail.UserId
    }
    this.insuranceProviderService.getOrCreateDefaultFS(payload).subscribe(res => {
      this.defaultFS = res;
      this.getCPTFeeSchedule();
      this.getCustomFormattedCPTFS()
    })

  }
  getCustomFormattedCPTFS() {
    let payload = {
      CptFeeScheduleId: this.defaultFS[0].FeeScheduleId
    }
    this.insuranceProviderService.getCustomFormattedCPT(payload).subscribe(res => {
      this.cptRvuFeeschedule = res;
      this.customFormattedCPT = res;
    })
  }
  onSave() {
    let saveArr = [], updateArr = [];
    let cfs: any = {};
    this.cptRvuFeeschedule.forEach(item => {
      if (this.cptFeeSchedule != null) {
        cfs = this.cptFeeSchedule.find(key => key.CptFeeScheduleId === item.cptFeeScheduleId)
        if (cfs !== undefined) {
          if (cfs.RvuConversionFactor !== item.rvuConversionFactor) {
            cfs.RvuConversionFactor = parseFloat(item.rvuConversionFactor);
            cfs.DateLastUpdated = new Date();
            cfs.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
            updateArr.push(cfs);
          }
        }

        else {
          cfs = {};
          if (item.rvuConversionFactor !== null) {
            cfs.FeeScheduleId = this.defaultFS[0].FeeScheduleId;
            cfs.CptCode = item.cptCode;
            cfs.RvuConversionFactor = parseFloat(item.rvuConversionFactor);
            cfs.DateCreated = new Date();
            cfs.DateLastUpdated = new Date();
            cfs.CreatedByUserId = this.authStore.UserDetail.UserId;
            cfs.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
            saveArr.push(cfs);
          }
        }
      }
    })
    if (saveArr.length > 0) {
      this.insuranceProviderService.addCPTFeeSchedule(saveArr).subscribe(res => {
        this.toastr.success("Successfully Added");
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
      })
    }
    if (updateArr.length > 0) {
      this.insuranceProviderService.updateCPTFeeSchedule(updateArr).subscribe(res => {
        this.toastr.success('Successfully Updated');
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
      })
    }
  }
  rvuConversation(event) {
    this.rvuFactor = event;
  }
  filterCPT(cptCode) {
    this.cptRvuFeeschedule = [];
    this.cptRvuFeeschedule = this.customFormattedCPT.filter(item => item.cptCode === cptCode)
    if (this.cptRvuFeeschedule.length <= 0) {
      this.cptRvuFeeschedule = this.customFormattedCPT;
    }
  }
  onRowSelect(rowData) {
    this.currentRowData = rowData.data
  }
  closeRVUEditModal() {
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }

}
