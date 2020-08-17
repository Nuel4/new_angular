import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillingSetupService } from '../../../../services/billing/billing-setup.service';
import { LookupService } from '../../../../services/lookup.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AddInsuranceProviderComponent } from './add-insurance-provider/add-insurance-provider.component';
import { FeeScheduleTypeComponent } from './fee-schedule-type/fee-schedule-type.component';
import { EditDefaultFeeComponent } from './edit-default-fee/edit-default-fee.component';
import { AddArTypeComponent } from './add-ar-type/add-ar-type.component';
import { FeesModalComponent } from './fees-modal/fees-modal.component';
import { AuthenticationStore } from '../../../../authentication/authentication-store';
import { Angular5Csv } from '../../../../../../node_modules/angular5-csv/dist/Angular5-csv';
@Component({
  selector: 'app-billing-insurance-provider',
  templateUrl: './billing-insurance-provider.component.html',
  styleUrls: ['./billing-insurance-provider.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingInsuranceProviderComponent implements OnInit {


  cols: any = [];
  billingSetupInsuranceProvider: any;
  billingSetupCity: any;
  billingSetupcontactPerson: any;
  billingSetupPhone: any;
  stateList: any = [];
  billingSetupState: any = {};
  billingSetuppayerId: any;
  billingSetupInsuranceCode: any;
  billingSetupStatus : any = [];
  selectedStatus: any = {};
  insuranceProvidersData: any = {};
  fileReaded: any;
  lines: any = [];
  constructor(private billingSetupService : BillingSetupService,private lookupServ: LookupService,private toastr: ToastrService,private modalService: NgbModal, private modal: NgbActiveModal,public authStore: AuthenticationStore) { }

  ngOnInit() {
    this.cols = [
      { field: 'insuranceProviderName' , header: 'Insurance Provider'},
      { field: 'submitterInsuranceNumber' , header: 'Payor Id'},
      { field: 'Category' , header: 'AR Type'},
      { field: 'City' , header: 'City'},
      { field: 'StateCode' , header: 'State'},
      { field: 'EligibilityContactName' , header: 'Contact Person'},
      { field: 'MainPhone' , header: 'Phone'},
      { field: 'AltPhone' , header: 'Alt Phone'},
      { field: 'Email1' , header: 'Email'},
      
    ];
    this.billingSetupStatus = [
      {value:true, label: "Active"},
      {value:false, label:"Inactive"}
    ]
    this.getState()
  }
  
  private getState() {
    this.stateList = this.lookupServ.getAllStates();
    
  }
  searchInsuranceProvider(pgno){
    let payload = {
      city:this.billingSetupCity ? this.billingSetupCity : '',
      AuthorizationContactName:this.billingSetupcontactPerson ? this.billingSetupcontactPerson:'',
      mainPhone:this.billingSetupPhone ? this.billingSetupPhone: '',
      stateCode: this.billingSetupState.value ? this.billingSetupState.value :'',
      payerId:this.billingSetuppayerId ? this.billingSetuppayerId : '',
      insuranceProviderCode: this.billingSetupInsuranceCode ? this.billingSetupInsuranceCode : '',
      insuranceProviderName: this.billingSetupInsuranceProvider ? this.billingSetupInsuranceProvider:'',
      inactive:this.selectedStatus ? this.selectedStatus.value: true,
      offset:pgno,
      limit:4
    }
    this.billingSetupService.getCustomFormattedInsuranceProvider(payload).subscribe((res:any) => {
      this.insuranceProvidersData = res
    })
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.searchInsuranceProvider(currentpage)
  }
  addInsuranceCompany(){
    const modRef = this.modalService.open(AddInsuranceProviderComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.addInsuranceCompany = true;
    modRef.componentInstance.addPro = true;
  }
  feeSchedule(){
    const modRef = this.modalService.open(FeeScheduleTypeComponent, { centered: true, size: 'lg', windowClass: 'modelStyle'});
    modRef.componentInstance.feeSchedule = true;
  }
  editDefaultFeeSchedule(){
    const modRef = this.modalService.open(EditDefaultFeeComponent, { centered: true, size: 'lg', windowClass: 'modelStyle'});
    modRef.componentInstance.editDefaultFee = true;
    modRef.componentInstance.buttonCptRvu = true;
  }
  arTypeInsuranceCategory(){
    const modRef = this.modalService.open(AddArTypeComponent, {centered: true, size: 'lg', windowClass: 'modelStyle'});
    modRef.componentInstance.artype = true;
  }
  feesModal(rowData){
    const modRef = this.modalService.open(FeesModalComponent, {centered: true, size: 'lg', windowClass: 'modelStyle'});
    modRef.componentInstance.fees = true;
    modRef.componentInstance.rowData = rowData;
  }
  downloadSampleCSV(){
    
var data = [
  {
  cptCode: 'G0008',
  rvu: 1,
  rvuConversionFactor: 95.1
  },
  {
    cptCode: '46600',
    rvu: 1,
    rvuConversionFactor: 310
    },
    {
      cptCode: '76775',
      rvu: 1,
      rvuConversionFactor: 175
      },
      {
        cptCode: '0029T',
        rvu: 1,
        rvuConversionFactor: 175
        },
];

 var options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: false,
    useBom: true,
    noDownload: false,
    headers: ["cptcode", "rvu", "rvuConversionFactor"]
  };

new Angular5Csv(data, 'Samplecsv' + new Date(),options);
  }
  uploadDefaultFeesSchedule(csv: any){
this.fileReaded = csv.target.files[0];  
let reader: FileReader = new FileReader();  
reader.readAsText(this.fileReaded);  
  
reader.onload = (e) => {  
let csv : any  = reader.result;  
let allTextLines = csv.split(/\r|\n|\r/);  
let headers = allTextLines[0].split('","');  
let lines = []; 
for (let i = 1; i < allTextLines.length; i++) { 
// split content based on comma  
let data = allTextLines[i].split('","');  
for(let i = 0; i < data.length; i++ ){
  data[i] = data[i].replace('"', ' ') 
}  
  if (data.length === headers.length) {  
    let tarr = {
      cptCode: '',
      rvu :0,
      rvuConversionFactor:0
    };  
    for (let j = 0; j < headers.length; j++) {  
      tarr.cptCode = data[0]; 
      tarr.rvu = parseInt(data[1]);
      tarr.rvuConversionFactor = parseInt(data[2]); 
    }  
    
    // log each row to see outpu2t  
    lines.push(tarr);  
  }
// all rows in the csv file  
}
let payload = {
  feeScheduleId:0,
  insuranceProviderId:0,
  feeScheduleTypeId:0,
  feeScheduleDisplayName:'',
  effectiveStartDate:null,
  effectiveEndDate:null,
  updatedByUserId: this.authStore.UserDetail.UserId,
}
let enumCustomFormattedCPTRVU = lines

this.billingSetupService.uploadCptRvuDefaultFS(enumCustomFormattedCPTRVU,payload).subscribe(res => {
  this.toastr.success('Successfully Upload');
})
}
}
editInsuranceCompanies(rowData){
    const modRef = this.modalService.open(AddInsuranceProviderComponent, {centered: true, size: 'lg', windowClass: 'modelStyle'});
    modRef.componentInstance.addInsuranceCompany = true;
    modRef.componentInstance.editInsuranceCategory = true;
    modRef.componentInstance.rowData = rowData;
  }
  clearForm(){
    this.billingSetupInsuranceProvider = "";
    this.billingSetupCity = "";
    this.billingSetupcontactPerson = "";
    this.billingSetupInsuranceCode = "";
    this.billingSetupState = {};
    this.selectedStatus = {};
    this.billingSetuppayerId = "";
    this.billingSetupPhone = "";
  }
}
