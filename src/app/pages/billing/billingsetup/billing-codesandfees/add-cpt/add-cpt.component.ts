import { Component, OnInit, ViewEncapsulation, Input,Output, EventEmitter } from '@angular/core';
import { BillingSetupService } from '../../../../../services/billing/billing-setup.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationStore } from '../../../../../authentication/authentication-store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-add-cpt',
  templateUrl: './add-cpt.component.html',
  styleUrls: ['./add-cpt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCptComponent implements OnInit {
  @Input() IsDelete;
  @Input() cptcode;
  @Input() editCPTCode;
  @Input() editRUV;
  @Input() rowData;
  @Input() rvuData;
  @Input() rvuRowData;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter()
  cptCategoryList: any;
  selectedCategory:any;
  placeofServices: any;
  selectedPOS: any = {};
  selectedTOS: any = {};
  tosList: any;
  active: boolean = true;
  labProcedure: boolean = true;
  writeOff:any;
  coPayAmount: any;
  costDescription:any;
  otherCost: any;
  purchasedCost: any;
  technicalCost: any;
  billingSetupprofessionalCost:any;
  ndcUnitPrice: any;
  save: boolean = true;
  update: boolean = false;
  rvuSave: boolean = true;
  rvuUpdate: boolean = false;
  billingSetupCPT: any;
  transactionType: any =[];
  averageTimeDuration: any =[];
  selectedTransaction:any;
  drugCode: any;
  billingSetupNdcDescription: any;
  billingSetupshortDescription: any;
  description: any;
  billingSetupDefaultUnit: any;
  m1: any;
  m2: any;
  m3: any;
  m4: any;
  followUpDays: any;
  selectedAverage:any = {};
  ndcunitMeasure:any=[];
  notUsedClaims: boolean = false;
  selectedNdcUnitMeasure:any={};
  codeIDQualifier: any;
  customFormattedRuv: any = []; 
  // boolean value to display modals
  ModalDisplay: boolean;
  cptRuvData: any = [];
  cols: any = [];
  index: any = [];
  cusNewdata: any = [];
  Headdisplay: boolean;
  cptCode : boolean = false;
  constructor(private modal: NgbActiveModal,private billingSetupService : BillingSetupService,private toastr: ToastrService,public authStore: AuthenticationStore) { 
     
  }
 
  ngOnInit() {
    this.ModalDisplay = true;
    this.getCPTCategoryList();
    this.getPlaceOfServices();
    this.getTypesOfServicesList();
    this.cols = [
      { field: 'rvuPaymentMethodName' , header: 'RVU Payment Method'},
      {field:'rvu',header:'RVU'}     
    ]
    this.ndcunitMeasure = [
      {value:'GR',label:'Gram'},
      {value:'ML',label:'Millilitre'},
      {value:'F2',label:'International Unit'},
      {value:'UN',label:'Unit'},
      {value:'ME',label:'Milligram'}
    ]
    
    this.averageTimeDuration = [
      {value:'1'},
      {value:'2'},
      {value:'3'},
      {value:'4'},
      {value:'5'},
      {value:'6'},
      {value:'10'},
      {value:'12'},
      {value:'15'},
      {value:'20'},
      {value:'30'},
      {value:'60'}
    ]
    
    this.transactionType = [
      {value:'Adjustment-Charge'},
      {value:'Adjustment-Credit'},
      {value:'Insurance Adjustment'},
      {value:'Insurance Charge Back'},
      {value:'Insurance Full Payment-Primary'},
      {value:'Insurance Full Payment-Secondary'},
      {value:'Insurance Full Payment-Tertiary'},
      {value:'Insurance Partial Payment-Primary'},
      {value:'Insurance Partial Payment-Secondary'},
      {value:'Insurance Partial Payment-Tertiary'},
      {value:'Inventory'},
      {value:'Patient Payment'},
      {value:'Procedure - Insurance'},
      {value:'Procedure - Unclassified'}
    ]
    
    if(this.editCPTCode){
      
      this.editCPT();
      this.billingSetupCPT = this.rowData.CptCode1;
      this.drugCode = this.rowData.NdcDrugCode;
      // this.selectedCategory.CategoryName = this.rowData.CptCategory; 
      this.ndcunitMeasure.forEach(item => {
        if(this.rowData.NdcUom = item.value){
          this.selectedNdcUnitMeasure = item
        }
      })
     
      this.billingSetupNdcDescription =  this.rowData.NdcDescription;
      this.billingSetupshortDescription = this.rowData.ShortDescription;
      this.ndcUnitPrice = this.rowData.NdcUnitPrice;
      this.description = this.rowData.Description;
      // this.selectedNdcUnitMeasure.label = this.rowData.NdcUom;
      this.billingSetupDefaultUnit = this.rowData.NdcDefaultUnit;
      this.codeIDQualifier = this.rowData.NdcCodeIdQualifier;
      // this.selectedTransaction.value = this.rowData.TransactionCodeType;
      this.active =  this.rowData.Inactive;
      this.billingSetupprofessionalCost = this.rowData.ProfessionalCost;
      this.technicalCost = this.rowData.TechnicalCost;
      this.purchasedCost = this.rowData.PurchasedCost;
      this.otherCost =  this.rowData.OtherCost;
      this.costDescription = this.rowData.OtherCostDescription;
      this.coPayAmount = this.rowData.CoPayAmount;
      this.writeOff = this.rowData.WriteOffAmount;
      // this.selectedPOS.Name = this.rowData.DefaultPosCode;
      // this.selectedTOS.Description = this.rowData.TypeOfServiceCode
      this.m1 = this.rowData.Modifier1;
      this.m2 = this.rowData.Modifier2;
      this.averageTimeDuration.forEach(item => {
        if(this.rowData.AvgTimeDuration == item.value){
          this.selectedAverage = item;
        }
      })
      this.transactionType.forEach(item => {
        if(this.rowData.TransactionCodeType = item.value){
          this.selectedTransaction = item
        }
      })
      this.m3=this.rowData.Modifier3;
      this.m4=this.rowData.Modifier4;
      this.followUpDays=this.rowData.FollowUpDays;
    //  this.selectedAverage.value= this.rowData.AvgTimeDuration ;
     this.labProcedure= this.rowData.LabProcedureRequiresCliaNumber;
      this.notUsedClaims=this.rowData.NotUsedForClaims;
    }
    if(this.rvuData){
      this.editRVU()
      this.billingSetupCPT = this.rvuRowData.CptCode1
      this.getCptRuv();
      this.getCptRuvCustomFormatted()
    }
  }
getCPTCategoryList(){
  this.billingSetupService.getCPTCategory().subscribe(res => {
      this.cptCategoryList = res;
      if(this.editCPTCode){
      this.cptCategoryList.forEach(item => {
        if(this.rowData.CptCategoryId = item.CptCategoryId){
this.selectedCategory = item

        }
      })
    }
  })
}
getPlaceOfServices(){
  this.billingSetupService.getPlaceOfServices().subscribe(res => {
    this.placeofServices = res;
    if(this.editCPTCode){
    this.placeofServices.forEach(item => {
      if(this.rowData.DefaultPosCode =item.PlaceOfServiceId){
        this.selectedPOS = item;
        
      }
    })
  }
  })
}
getTypesOfServicesList(){
  this.billingSetupService.getTypesOfServices().subscribe(res => {
    this.tosList = res;
    if(this.editCPTCode){
    this.tosList.forEach(item => {
      if(this.rowData.TypeOfServiceCode = item.Code){
        this.selectedTOS = item;
      }
    })
  }
  })
}
saveAddCPTCode(save){
  
  if(this.billingSetupCPT === undefined || this.selectedCategory === undefined || this.selectedTransaction === undefined){
    this.toastr.error("Please select mandatory fields ")
  }
  
  let payload = {
    DateCreated: new Date(),
    DateLastUpdated: new Date(),
    CreatedByUserId: this.authStore.UserDetail.UserId?this.authStore.UserDetail.UserId:0,
    LastUpdatedByUserId:this.authStore.UserDetail.UserId?this.authStore.UserDetail.UserId:0,
    CptCode1: this.billingSetupCPT,
    CptCategoryId:this.selectedCategory.CptCategoryId,
    TransactionCodeType:this.selectedTransaction.value,
    NdcDrugCode: this.drugCode ? this.drugCode:0,
    NdcDescription:this.billingSetupNdcDescription ? this.billingSetupNdcDescription:'',
    ShortDescription: this.billingSetupshortDescription ? this.billingSetupshortDescription:'',
    NdcUnitPrice: this.ndcUnitPrice ? this.ndcUnitPrice:0,
    Description:this.description ? this.description:'',
    DefaultUnit: this.billingSetupDefaultUnit ? this.billingSetupDefaultUnit:0,
    Active:this.active ? this.active :false,
    ProfessionalCost:this.billingSetupprofessionalCost ? this.billingSetupprofessionalCost :0,
    TechnicalCost: this.technicalCost ? this.technicalCost :0,
    PurchasedCost: this.purchasedCost ? this.purchasedCost:0,
    OtherCost:this.otherCost ? this.otherCost:0,
    CopayAmount: this.coPayAmount ? this.coPayAmount: 0,
    OtherCostDesc:this.costDescription ? this.costDescription :0,
    writeOffAmount: this.writeOff ? this.writeOff :0,
    DefaultPos:this.selectedPOS.Code ? this.selectedPOS.Code:0,
    TypeOfService: this.selectedTOS.Description ? this.selectedTOS.Description:'',
    Modifer1:this.m1 ? this.m1:0,
    Modifier2:this.m2 ? this.m2:0,
    Modifier3:this.m3 ? this.m3:0,
    Modifier4:this.m4 ? this.m4:0,
    FollowUpDays:this.followUpDays ? this.followUpDays:0,
    AvgTimeDuration:this.selectedAverage.value ? this.selectedAverage.value:0,
    LabProcedure:this.labProcedure ? this.labProcedure:false,
    NDCUnitMeasurement: this.selectedNdcUnitMeasure.value ? this.selectedNdcUnitMeasure.value:'',
    NotUsedForClaims:this.notUsedClaims ? this.notUsedClaims:false,
    codeIDQualifier:this.codeIDQualifier ? this.codeIDQualifier:''
  }
 
  this.billingSetupService.saveCPTCode(payload).subscribe(res => {
    this.ModalDisplay = true;
    this.cptcode = false;
    this.editRUV = true;
    this.getCptRuv()
    this.showAlert("Successfully Added")
  })
}
getCptRuv(){
  let payload = {
    cptCode: this.billingSetupCPT
  }
  this.billingSetupService.getCPTRVUdata(payload).subscribe(res => {
    this.cptRuvData = res;
  })
  this.getCptRuvCustomFormatted()
}
getCptRuvCustomFormatted(){
  let payload = {
    cptCode: this.billingSetupCPT
  }
  this.billingSetupService.getCPTRVUCustomFormattedData(payload).subscribe(res => {
    this.customFormattedRuv = res;
    this.cusNewdata = res;
  })
}

saveCPTRvu(){
  let payload = [];
  this.cusNewdata.forEach((item,id) => {
    let temp;
    if(item.rvu !== null){
      item.cptcode = this.billingSetupCPT
      temp = {
        Rvu: item.rvu,
        CptRvuId: item.cptRvuId,
        RvuPaymentMethodId: item.rvuPaymentMmethodId,
        CptCode: item.cptcode
      }    
      payload.push(temp)      
    }
  })
    this.billingSetupService.postCPtRuv(payload).subscribe(res => {
    this.ModalDisplay = false;
    this.showAlert("Successfully Aadded");
  })
}
changeHead(){
  this.Headdisplay = false;
}
showAlert(msg: string) {
  this.toastr.success(msg)
}
showWarningAlert(msg: string) {
  this.toastr.warning(msg)
}
editCPT(){
this.cptCode = true;
this.update = true;
this.save = false;
}
editRVU(){
  this.rvuSave = false;
  this.rvuUpdate = true;
}
UpdateCptCode(){
  if(this.selectedCategory === undefined || this.selectedTransaction === undefined){
    this.toastr.error("Please select mandatory fields ")
  }
  let payload = {
    DateCreated: this.rowData.DateCreated,
    DateLastUpdated: new Date(),
    CreatedByUserId: this.authStore.UserDetail.UserId?this.authStore.UserDetail.UserId:0,
    LastUpdatedByUserId:this.authStore.UserDetail.UserId?this.authStore.UserDetail.UserId:0,
    CptCode1: this.billingSetupCPT,
    CptCategoryId:this.selectedCategory.CptCategoryId,
    TransactionCodeType:this.selectedTransaction.value,
    NdcDrugCode: this.drugCode ? this.drugCode:0,
    NdcDescription:this.billingSetupNdcDescription ? this.billingSetupNdcDescription:'',
    ShortDescription: this.billingSetupshortDescription ? this.billingSetupshortDescription:'',
    NdcUnitPrice: this.ndcUnitPrice ? this.ndcUnitPrice:0,
    Description:this.description ? this.description:'',
    DefaultUnit: this.billingSetupDefaultUnit ? this.billingSetupDefaultUnit:0,
    Active:this.active ? this.active :false,
    ProfessionalCost:this.billingSetupprofessionalCost ? this.billingSetupprofessionalCost :0,
    TechnicalCost: this.technicalCost ? this.technicalCost :0,
    PurchasedCost: this.purchasedCost ? this.purchasedCost:0,
    OtherCost:this.otherCost ? this.otherCost:0,
    CopayAmount: this.coPayAmount ? this.coPayAmount: 0,
    OtherCostDesc:this.costDescription ? this.costDescription :0,
    writeOffAmount: this.writeOff ? this.writeOff :0,
    DefaultPos:this.selectedPOS.Code ? this.selectedPOS.Code:0,
    TypeOfService: this.selectedTOS.Description ? this.selectedTOS.Description:'',
    Modifer1:this.m1 ? this.m1:0,
    Modifier2:this.m2 ? this.m2:0,
    Modifier3:this.m3 ? this.m3:0,
    Modifier4:this.m4 ? this.m4:0,
    FollowUpDays:this.followUpDays ? this.followUpDays:0,
    AvgTimeDuration:this.selectedAverage.value ? this.selectedAverage.value:0,
    LabProcedure:this.labProcedure ? this.labProcedure:false,
    NDCUnitMeasurement: this.selectedNdcUnitMeasure.value ? this.selectedNdcUnitMeasure.value:'',
    NotUsedForClaims:this.notUsedClaims ? this.notUsedClaims:false,
    codeIDQualifier:this.codeIDQualifier ? this.codeIDQualifier:''
  }
  this.billingSetupService.UpdateCptCode(payload).subscribe(res => {
    this.showAlert("Successfully Updated")
   
    this.getCptRuv()
  })
}
UpdateCptRvu(){
  let payload = [];
   this.cusNewdata.forEach((item,id) => {
    let temp;
    if(item.rvu !== null){
      item.cptcode = this.billingSetupCPT
      temp = {
        Rvu: item.rvu,
        CptRvuId: item.cptRvuId,
        RvuPaymentMethodId: item.rvuPaymentMmethodId,
        CptCode: item.cptcode
      }    
      payload.push(temp)      
    }
  })
  this.billingSetupService.UpdateCptRvu(payload).subscribe(res => {
    this.showAlert("Successfully Updated")
  })
}
}
