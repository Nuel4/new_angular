import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillingSetupService } from '../../../../services/billing/billing-setup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { BillingPhysicianModalComponent } from './billing-physician-modal/billing-physician-modal.component';

@Component({
  selector: 'app-billing-physician',
  templateUrl: './billing-physician.component.html',
  styleUrls: ['./billing-physician.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingPhysicianComponent implements OnInit {

  cols: any = [];
  facilities: any = [];
  selectedFacility: any = {};
  billingSetupName: any;
  billingSetupDescription: any;
  physicianBillingList: any = {};
  constructor(private billingSetupService: BillingSetupService, private toastr: ToastrService, private modalService: NgbModal, private modal: NgbActiveModal) { }

  ngOnInit() {
    this.cols = [
      { field: 'physicianName', header: 'Physician' },
      { field: 'stateLicenseNumber', header: 'State License Number' },
      { field: 'nationalProviderIdentifier', header: 'NPI Number' },
      { field: 'physicianTaxIdentifier', header: 'Tax ID' },
      { field: 'facilityName', header: 'Facility' }
    ]
    this.getFacilities();
  }
  getFacilities() {
    this.billingSetupService.getFaciliteis().subscribe(res => {
      this.facilities = res;
    })
  }
  searchPhysicianBilling(pgno) {
    let payload = {
      name: this.billingSetupName ? this.billingSetupName : '',
      facilityID: this.selectedFacility.FacilityId ? this.selectedFacility.FacilityId : 0,
      specialityID: 0,
      ssn: this.billingSetupDescription ? this.billingSetupDescription : '',
      offset: pgno,
      limit: 5
    }
    this.billingSetupService.getSearchPhysicianBilling(payload).subscribe((res: any) => {
      this.physicianBillingList = res;
    })
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.searchPhysicianBilling(currentpage)
  }
  editBillingDetails(rowData) {
    const modRef = this.modalService.open(BillingPhysicianModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.billingDetails = true;
    modRef.componentInstance.billingRowdata = rowData;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.searchPhysicianBilling(0)
      }
    })
  }
  editInsuranceDetails(rowData) {
    const modRef = this.modalService.open(BillingPhysicianModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.insuranceDetails = true;
    modRef.componentInstance.insuranceRowdata = rowData;
  }
  clearDatas() {
    this.selectedFacility = {};
    this.billingSetupName = null;
    this.billingSetupDescription = null;
  }
}
