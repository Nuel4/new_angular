import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PhysicianService } from '../../../../services/practice/physician.service'
import { InsuranceProviderService } from '../../../../services/billing/insuranceprovider.service';
import { ActReceivableService } from '../../../../services/billing/act-receivable.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActreceivableModalsComponent } from '../actreceivable-modals/actreceivable-modals.component';
import { BillersNoteComponent } from '../../../../theme/components/applications/waitingroom/billers-note/billers-note.component';
import { WaitingroommodalComponent } from '../../../../theme/components/applications/waitingroom/appointmentdetails/waitingroommodal/waitingroommodal.component';
import { element } from '@angular/core/src/render3/instructions';
import * as moment from 'moment';
import { ExportToExcelService } from '../../../../services/billing/export-to-excel.service';
@Component({
  selector: 'app-ar-worklist',
  templateUrl: './ar-worklist.component.html',
  styleUrls: ['./ar-worklist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArWorklistComponent implements OnInit {
  physicianLists: any = [];
  insuranceProvidersList: any = [];
  arWorklistColumns: any = [];
  arWorklistDatas: any = [];
  showBillsBalance: any[];
  patientBalance: boolean = false;
  insuranceBalance: boolean = false;
  selectedCategory: any;
  balanceAmount: any;
  belowSixtyDays: boolean = false;
  belowNintyDays: boolean = false;
  belowOneTwentyDays: boolean = false;
  aboveOneTwentyDays: boolean = false;
  patientDetails: any;
  ARWorklistTableData: any;
  selectedPhysician: any;
  selectedProvider: any;
  userDetails: any;
  PatientData: any;
  constructor(private physicianService: PhysicianService,
    private insuranceProviderService: InsuranceProviderService,
    private actReceiveService: ActReceivableService,
    private modal: NgbModal,
    private exportService: ExportToExcelService) { }

  ngOnInit() {
    this.showBillsBalance = [
      { name: 'Less than', code: 'LT' },
      { name: 'More than', code: 'MT' },
    ]
    this.arWorklistColumns = [
      { field: 'billDate', header: 'Bill Date' },
      { field: 'serviceDate', header: 'Service Date' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'patientUniqeNumber', header: 'Acct No' },
      { field: 'physician', header: 'Physician' },
      { field: 'balAge', header: 'Bal.Age' },
      { field: 'insProvider', header: 'Ins Provider' },
      { field: 'totalDue', header: 'Total Due' },
      { field: 'patientAmtDue', header: 'Pat.Amt Due' },
      { field: 'insAmtDue', header: 'Ins.Amt Due' },
      { field: 'lastPaymentDate', header: 'Last Payment' },
    ]
    this.getPhysicians();
    this.getInsuranceProviders();
  }

  getPhysicians() {
    this.physicianService.getPhysicianWithMinimumDetails().subscribe(resp => {
      this.physicianLists = resp;
      for (let i = 0; i < this.physicianLists.length; i++) {
        this.physicianLists[i].physicianName = this.physicianLists[i].firstname + ' ' + this.physicianLists[i].lastname
      }
    });
  }
  getInsuranceProviders() {
    this.insuranceProviderService.getInsuranceProviders().subscribe(resp => {
      this.insuranceProvidersList = resp;
      for (let i = 0; i < this.insuranceProvidersList.length; i++) {
        this.insuranceProvidersList[i].insuranceProviderNamewithCode = this.insuranceProvidersList[i].InsuranceProviderName + '(' + this.insuranceProvidersList[i].InsuranceProviderCode + ')'
      }
    });
  }

  getPatientARWorkListbyParam() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      physicianId: this.selectedPhysician ? this.selectedPhysician.physicianid : null,
      insuranceProviderId: this.selectedProvider ? this.selectedProvider.InsuranceProviderId : null,
      showBillsPBDue: this.patientBalance,
      showBillsIBDue: this.insuranceBalance,
      isGreaterThan: this.selectedCategory ? this.selectedCategory.name === "More than" ? 1 : 0 : -1,
      glAmount: this.balanceAmount,
      showBillsDueIn3060: this.belowSixtyDays,
      showBillsDueIn6190: this.belowNintyDays,
      showBillsDueIn91120: this.belowOneTwentyDays,
      showBillsDueIn121: this.aboveOneTwentyDays,
      patientId: this.patientDetails.PatientId,

    }
    this.actReceiveService.getPatientARWorkList(param).subscribe((results: any) => {
      this.ARWorklistTableData = results;
      this.ARWorklistTableData.forEach(element => {
        element.billDate = moment(element.billDate).format('DD/MM/YYYY');
        element.serviceDate = moment(element.serviceDate).format('DD/MM/YYYY');
        element.lastPaymentDate = moment(element.lastPaymentDate).format('DD/MM/YYYY');

      })
    })
  }

  openAlertModal() {
    const modRef = this.modal.open(ActreceivableModalsComponent, { windowClass: "actReceivableAlert" })
    modRef.componentInstance.opensAlertModal = true;
    modRef.componentInstance.openActionModal = false;
    modRef.componentInstance.openViewBillModal = false;


  }

  openActionModel(rowData) {
    const modRef = this.modal.open(ActreceivableModalsComponent, { windowClass: "actReceivableAction" })
    modRef.componentInstance.opensAlertModal = false;
    modRef.componentInstance.openActionModal = true;
    modRef.componentInstance.openViewBillModal = false;
    modRef.componentInstance.rowData = rowData;
  }

  openViewBill(rowData){
    const modRef = this.modal.open(ActreceivableModalsComponent, { windowClass:"ViewBillModal" })
    modRef.componentInstance.openViewBillModal = true;
    modRef.componentInstance.opensAlertModal = false;
    modRef.componentInstance.openActionModal = false;
    modRef.componentInstance.rowData = rowData;
  }

  openActSummary() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
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

 

  clearData() {
    this.selectedPhysician = { physicianName: '' };
    this.selectedProvider = { insuranceProviderNamewithCode: '' };
    this.patientBalance = false;
    this.insuranceBalance = false;
    this.belowSixtyDays = false;
    this.belowNintyDays = false;
    this.belowOneTwentyDays = false;
    this.aboveOneTwentyDays = false;
    this.selectedCategory = { name: '' };
    this.balanceAmount = "";

  }

  ExportFile(data) {
    console.log(data)
    var newlist = data;
    newlist.map((item: any, index: any) => {
      delete item.colorRed;
      delete item.colorGreen;
      delete item.colorWhite;
      delete item.isDirectCharge;
      delete item.includeCompletedTasks;
      delete item.flagSelfPay;
      delete item.noteVisible;
      delete item.addNoteVisible;
      delete item.billId;
      delete item.patientId;
      delete item.userId;
      delete item.physicianId;
      delete item.insProvider;
      delete item.mrPatientEncounterId;
      delete item.datePosted;
      delete item.dateSentToCollections;
      delete item.patientDOB;
      delete item.patientMobileNumber;
      delete item.ssnOrId;
      delete item.resp;


    })
    console.log("exported files:",newlist)
    this.exportService.exportExcel(newlist, 'workListData');
  }


}
