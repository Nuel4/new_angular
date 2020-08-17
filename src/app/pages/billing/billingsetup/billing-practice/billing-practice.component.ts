import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { InsuranceProviderService } from '../../../../services/billing/insuranceprovider.service';
import { BillingSetupService } from '../../../../../app/services/billing/billing-setup.service';
import { AuthenticationStore } from '../../../../authentication/authentication-store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { BillingSetupModalComponent } from '../billing-setup-modal/billing-setup-modal.component';

@Component({
  selector: 'app-billing-practice',
  templateUrl: './billing-practice.component.html',
  styleUrls: ['./billing-practice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingPracticeComponent implements OnInit {
  @ViewChild('addInsuranceCompany') private _poup: ElementRef;
  rowClicked: any = []
  insuranceProvidersList: any = [];
  providerDatas: any = []
  cols: any = [];
  facilities: any;
  applyForAll: boolean = true;
  selectedFacility: any = {};
  FacilityInsuranceProvider: any = [];
  selectedInsuanceProvider: any;
  InsuranceProviderData: any = [];
  addInsurance: boolean = false;
  saveFacilityInsurance: boolean = true;
  deleteFaciltyInsurane: boolean = false;
  constructor(private insuranceProviderService: InsuranceProviderService, private billingSetupService: BillingSetupService, public authStore: AuthenticationStore, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService) {


  }

  ngOnInit() {
    this.getFacilityInsuranceProvider();
    this.cols = [
      { field: 'InsuranceProviderName', header: 'Insurance Provider' },
      { field: 'InsuranceProviderCode', header: 'Location Provider Number' }
    ]
    this.providerDatas = [
      { InsuranceProviderName: 'Cigma', locationProviderNumber: '123' },
      { InsuranceProviderName: 'LIC', locationProviderNumber: '56' },
      { InsuranceProviderName: 'Aetna', locationProviderNumber: '8' },
      { InsuranceProviderName: 'Medicare', locationProviderNumber: '43' },
      { InsuranceProviderName: 'National Insurance Company', locationProviderNumber: '98' },

    ]

    this.getFacilities();

  }

  getFacilities() {
    this.billingSetupService.getFaciliteis().subscribe(res => {
      this.facilities = res;
    })
  }
  getFacilityInsuranceProvider() {
    let payload = {
      pFacilityId: this.selectedFacility ? this.selectedFacility.FacilityId : 0
    }
    this.insuranceProviderService.getInsuranceProviders().subscribe(resp => {
      this.insuranceProvidersList = resp;
      this.billingSetupService.getFacilityInsuranceProvider(payload).subscribe(res => {
        this.FacilityInsuranceProvider = res;
        this.FacilityInsuranceProvider.forEach((item, i) => {
          item.indexval = i
          this.insuranceProvidersList.forEach(element => {
            if (item.InsuranceProviderId === element.InsuranceProviderId) {
              item.InsuranceProviderName = element
            }
          })
        })
      })
    });
  }
  addInsuranceCo() {
    let data = {
      InsuranceProviderName: {
        InsuranceProviderName: ''
      },
      LocationProviderNumber: null,
      CreatedByUser: null,
      CreatedByUserId: this.authStore.UserDetail.CreatedByUserId,
      DateCreated: new Date(),
      DateLastUpdated: new Date(),
      Facility: null,
      FacilityId: this.applyForAll ? null : this.selectedFacility.FacilityId,
      FacilityInsuranceProviderBillingDetailsId: 0,
      InsuranceProvider: null,
      InsuranceProviderId: null,
      LastUpdatedByUser: null,
      LastUpdatedByUserId: this.authStore.UserDetail.CreatedByUserId,
      indexval: this.FacilityInsuranceProvider.length
    }
    this.FacilityInsuranceProvider.push(data);
    this.addInsurance = true;
    this.saveFacilityInsurance = false;
    this.deleteFaciltyInsurane = true;
  }
  saveChanges() {
    this.billingSetupService.postFacilityInsuranceProvider(this.FacilityInsuranceProvider).subscribe(res => {
      this.FacilityInsuranceProvider.pop()
      this.getFacilityInsuranceProvider();
      this.showAlert("Updated successfully");
      this.saveFacilityInsurance = true;
      this.addInsurance = false;
      this.deleteFaciltyInsurane = false;
    })

  }

  updateInsuranceId(value) {
    this.FacilityInsuranceProvider.forEach(element => {
      if (element.indexval === value.indexval) {
        element.InsuranceProviderId = value.InsuranceProviderName.InsuranceProviderId
      }
    });
  }
  deleteFacilityProvider(rowData) {
    const modRef = this.modalService.open(BillingSetupModalComponent, { windowClass: "delete-class" });
    modRef.componentInstance.IsDelete = true;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.InsuranceProviderData.push(rowData)
        this.billingSetupService.deleteFacilityInsuranceProvider(this.InsuranceProviderData).subscribe(res => {
          this.getFacilityInsuranceProvider()
          this.InsuranceProviderData.pop()
          this.showAlertWarning("Deleted Successfully")
        })
      }
    })
  }
  showAlert(msg: string) {
    this.toaster.success(msg)
  }
  showAlertWarning(msg: string) {
    this.toaster.warning(msg)
  }
}
