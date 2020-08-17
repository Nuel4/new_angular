import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PhysicianService } from '../../../../services/practice/physician.service'
import { InsuranceProviderService } from '../../../../services/billing/insuranceprovider.service';
import { ActReceivableService } from '../../../../services/billing/act-receivable.service';
import * as moment from 'moment';
import { element } from '@angular/core/src/render3/instructions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActreceivableModalsComponent } from '../actreceivable-modals/actreceivable-modals.component';
import { BillersNoteComponent } from '../../../../theme/components/applications/waitingroom/billers-note/billers-note.component';
import { WaitingroommodalComponent } from '../../../../theme/components/applications/waitingroom/appointmentdetails/waitingroommodal/waitingroommodal.component';
import { ExportToExcelService } from '../../../../services/billing/export-to-excel.service';


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CollectionsComponent implements OnInit {
  dueDays: any = [];
  physicianLists: any = [];
  insuranceProvidersList: any = [];
  collectionsColumns: any = [];
  collectionsDatas: any = [];
  patientDetails: any;
  selectedPhysician: any;
  selectedProvider: any;
  belowSixtyDays: boolean = false;
  belowNintyDays: boolean = false;
  belowOneTwentyDays: boolean = false;
  aboveOneTwentyDays: boolean = false;
  closedCollections: boolean = false;
  patientCollectionData: any;
  userDetails: any;

  constructor(private physicianService: PhysicianService,
    private insuranceProviderService: InsuranceProviderService,
    private actReceiveService: ActReceivableService,
    private modal: NgbModal,
    private exportService: ExportToExcelService) { }

  ngOnInit() {
    this.collectionsColumns = [
      { field: 'dateSentToCollections', header: 'Date sent to Collections' },
      { field: 'billDate', header: 'Bill Date' },
      { field: 'serviceDate', header: 'Service Date' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'patientUniqeNumber', header: 'Acct No' },
      { field: 'physician', header: 'Physician' },
      { field: 'balAge', header: 'Bal.Age' },
      { field: 'resp', header: 'Resp.' },
      { field: 'totalDue', header: 'Bal.Due' },
    ]
    this.dueDays = [
      { label: '30-60 Days', value: '1' },
      { label: '61-90 Days', value: '2' },
      { label: '91-120 Days', value: '3' },
      { label: '121+ Days', value: '4' },
      { label: 'Closed Collections', value: '5' },
    ];
    this.getPhysicians();
    this.getInsuranceProviders();
  }

  openAlertModal() {
    const modRef = this.modal.open(ActreceivableModalsComponent, { windowClass: "actReceivableAlert" })
    modRef.componentInstance.opensAlertModal = true;
    modRef.componentInstance.openActionModal = false;
  }

  openBillerNote(type) {
    const modalRef = this.modal.open(BillersNoteComponent);
    modalRef.componentInstance.name = "true";
    modalRef.componentInstance.openBillersModal = true;
    modalRef.componentInstance.patientData = this.patientDetails;
    console.log("patient details:", this.patientDetails);
    if (type === 'Payment') {
      modalRef.componentInstance.paymentType = 'Payment'
    }
  }

  openActSummary() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    console.log("patient details", this.patientDetails)
    const modRef = this.modal.open(WaitingroommodalComponent, { windowClass: "account-summary" })
    modRef.componentInstance.name = 'true';
    modRef.componentInstance.openAccountSummaryModal = true;
    modRef.componentInstance.patientData = {
      uniqueNumber:this.patientDetails.UniqueNumber,
      patientdateofbirth:this.patientDetails.DateOfBirth,
      patientname:this.patientDetails.FirstName + " " + this.patientDetails.LastName,
      username:this.userDetails.Username,
      patientId:this.patientDetails.PatientId,

    };
  }


  getPhysicians() {
    this.physicianService.getPhysicianWithMinimumDetails().subscribe(resp => {
      this.physicianLists = resp;
      for (let i = 0; i < this.physicianLists.length; i++) {
        this.physicianLists[i].physicianName = this.physicianLists[i].firstname + ' ' + this.physicianLists[i].lastname
      }
      console.log('physician lists', this.physicianLists)
    });
  }


  getInsuranceProviders() {
    this.insuranceProviderService.getInsuranceProviders().subscribe(resp => {
      this.insuranceProvidersList = resp;
      for (let i = 0; i < this.insuranceProvidersList.length; i++) {
        this.insuranceProvidersList[i].insuranceProviderNamewithCode = this.insuranceProvidersList[i].InsuranceProviderName + '(' + this.insuranceProvidersList[i].InsuranceProviderCode + ')'
      }
      console.log('Insurace Provider lists', this.insuranceProvidersList)
    });
  }

  getPatientCollectionByParam(){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      physicianId:this.selectedPhysician?this.selectedPhysician.physicianid:null,
      insuranceProviderId:this.selectedProvider?this.selectedProvider.InsuranceProviderId:null,
      showBillsDueIn3060:this.belowSixtyDays,
      showBillsDueIn6190: this.belowNintyDays,
      showBillsDueIn91120: this.belowOneTwentyDays,
      showBillsDueIn121:this.aboveOneTwentyDays,
      completedTasks: this.closedCollections,
      patientId:this.patientDetails.PatientId,
    }

    this.actReceiveService.getPatientsCollections(param).subscribe((results : any) =>{
      this.patientCollectionData = results;
      this.patientCollectionData.forEach((element,index) => {
        element.dateSentToCollections = moment(element.dateSentToCollections).format('DD/MM/YYYY');
        element.billDate = moment(element.billDate).format('DD/MM/YYYY');
        element.serviceDate = moment(element.serviceDate).format('DD/MM/YYYY');
        element.key=index;
        
      })
      console.log("patient collection data:",this.patientCollectionData)

    })

  }

  ExportFile(data) {
    var newlist = data;
    newlist.map((item: any, index: any) => {
      delete item.billId;
      delete item.patientId;
      delete item.physicianId;
      delete item.userId;
      delete item.insProviderId;
      delete item.mrPatientEncounterId;
      delete item.datePosted;
      delete item.patientDOB;
      delete item.patientMobileNumber;
      delete item.ssnOrId;
      delete item.insProvider;
      delete item.patientAmtDue;
      delete item.insAmtDue;
      delete item.lastPaymentDate;
      delete item.isDirectCharge;
      delete item.includeCompletedTasks;
      delete item.flagSelfPay;
      delete item.addNoteVisible;
      delete item.noteVisible;
      delete item.colorGreen;
      delete item.colorRed;
      delete item.colorWhite;
      delete item.key;


    })
    console.log("export file",newlist)
    this.exportService.exportExcel(newlist, 'patientCollectionData');
  }



  
  clearData(){
    this.selectedPhysician = { physicianName: ''};
    this.selectedProvider = { insuranceProviderNamewithCode: ''};
    this.belowSixtyDays = false;
    this.belowNintyDays = false;
    this.belowOneTwentyDays = false;
    this.aboveOneTwentyDays = false;
    this.closedCollections = false;
    
  }

}
