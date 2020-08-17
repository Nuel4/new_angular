import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MedicationService } from '../../../services/chart/medication.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ComparemodalComponent } from './comparemodal/comparemodal.component'
// import { EventEmitter } from 'protractor';
declare var $: any;
@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedicationsComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  toChart: boolean;
  widgetData: any;

  patientMedicationList: any;
  patientDetails: any;
  buttonValue = "Past";
  archive = "N";
  totalRecords: any;
  rows: any;

  constructor(private mediService: MedicationService,
    private modalService: NgbModal) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.patientDetails = sessionStorage.getItem('PatientDetails')
    let page = 0
    this.getMedicationList(page, this.archive);
  }


  getMedicationList(page, archive) {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let payload = {
      patientId: this.patientDetails.PatientId,
      offset: page,
      limit: 5,
      version: 1,
      archive: archive ,
    }
    this.mediService.CustomGetMedicationlists(payload).subscribe((results: any) => {
      this.patientMedicationList = results.Results;
    this.totalRecords = results.TotalItems;
this.rows = results.PageSize;
    })
  }

  paginate(event) {
    let pageNo = event.first / event.rows;
    this.getMedicationList(pageNo, this.archive)
  }

  refresh() {
    // this.onSomething.emit();
    this.refreshMedication();
  }

  getMedication() {
    if (this.buttonValue == "Past") {
      this.buttonValue = "Current";
      this.archive = "Y";
      let pageNo = 0;
      this.getMedicationList(pageNo, this.archive)
    }
    else {
      this.buttonValue = "Past";
      this.archive = "N";
      let pageNo = 0;
      this.getMedicationList(pageNo, this.archive)
    }
  }

  refreshMedication(){
      if (this.buttonValue == "Past") {
        // this.buttonValue = "Current";
        this.archive = "N";
        let pageNo = 0;
        this.getMedicationList(pageNo, this.archive)
      }
      else {
        // this.buttonValue = "Past";
        this.archive = "Y";
        let pageNo = 0;
        this.getMedicationList(pageNo, this.archive)
      }
  }
  compareMedicationList() {
    const modelRef = this.modalService.open(ComparemodalComponent, {size:'lg',windowClass: "medicationModal" })

    }
  // compareMedicationLis() {
  //   alert();
  // }



}
