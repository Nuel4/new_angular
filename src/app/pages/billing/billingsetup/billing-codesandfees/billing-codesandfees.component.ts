
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillingSetupService } from '../../../../../app/services/billing/billing-setup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { BillingSetupModalComponent } from '../billing-setup-modal/billing-setup-modal.component';
import { AddCptComponent } from './add-cpt/add-cpt.component';
@Component({
  selector: 'app-billing-codesandfees',
  templateUrl: './billing-codesandfees.component.html',
  styleUrls: ['./billing-codesandfees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingCodesandfeesComponent implements OnInit {
  cols: any = [];
  categoryList: any = [];
  selectedCategory: any = {};
  billingSetupCPT: any;
  billingSetupDescription: any;
  CPTCodeCategory: any={};
  nonProcedureList: any;
  billingSetupCode: any;
  billingSetupAmount: any;
  
   constructor(private billingSetupService : BillingSetupService, private toastr: ToastrService,private modalService: NgbModal, private modal: NgbActiveModal) { }

  ngOnInit() {
    this.cols = [
      { field: 'CptCode1' , header: 'CPT Code'},
      { field: 'Description' , header: 'Description'},
      { field: 'ProfessionalCost' , header: 'PC'},
      { field: 'TechnicalCost' , header: 'TC'},
      { field: 'PurchasedCost' , header: 'PC2'},
      { field: 'OtherCost' , header: 'OC'},
      { field: 'CoPayAmount' , header: 'Copay'},
      { field: 'DefaultPosCode' , header: 'POS'},
      { field: 'Modifier1' , header: 'M1'},
      { field: 'Modifier2' , header: 'M2'},
      { field: 'Modifier3' , header: 'M3'},
      { field: 'Modifier4' , header: 'M4'},

    ],
  
    this.getCPTCategory();
    this.getFacilities();
    
  }
  getCPTCategory(){
    this.billingSetupService.getCPTCategory().subscribe(res => {
      this.categoryList = res;
    })
  }
  getFacilities(){
    this.billingSetupService.getFaciliteis().subscribe(res => {
    })
  }
  getCptcodeCategory(pgno){
    let payload = {
      cptcode: this.billingSetupCPT ? this.billingSetupCPT : '',
      desc: this.billingSetupDescription ? this.billingSetupDescription:'',
      categoryId: this.selectedCategory.CptCategoryId ? this.selectedCategory.CptCategoryId: 0,
      offset:pgno,
      limit: 4
    }
      this.billingSetupService.getCptCodeCategory(payload).subscribe((res: any) => {
      this.CPTCodeCategory = res;
    })
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.getCptcodeCategory(currentpage)
  }
  nonProcedureOffice(){
    const modRef = this.modalService.open(BillingSetupModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.officeCharge = true;
    
  }
  editCPT(rowData){
    const modRef = this.modalService.open(AddCptComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.cptcode = true;
    modRef.componentInstance.editCPTCode = true;
    modRef.componentInstance.rowData = rowData;
  }
  deleteAddcpt(rowData){
    const modRef = this.modalService.open(BillingSetupModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.deleteCPT = true;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if(value){
        this.billingSetupService.deleteCptCode(rowData).subscribe(res => {
        this.showAlert("Deleted Successfully");
        this.getCptcodeCategory(0)
      })
      }
    })
  }
  editRVU(rowData){
    const modRef  = this.modalService.open(AddCptComponent, { centered: true,size:'lg',windowClass:'modelStyle'});
    modRef.componentInstance.editRUV = true;
    modRef.componentInstance.rvuData = true;
    modRef.componentInstance.rvuRowData = rowData;
  }
  addCPTModal(){
    const modRef = this.modalService.open(AddCptComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.cptcode = true;
  }
  clearDatas(){
    this.billingSetupCPT = null;
    this.selectedCategory = {};
    this.billingSetupDescription = null;
  }
  showAlert(msg: string) {
    this.toastr.success(msg)
  }
  showWarningAlert(msg: string) {
    this.toastr.warning(msg)
  }
}
