import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MedicationService } from '../../../../services/chart/medication.service'

@Component({
  selector: 'app-comparemodal',
  templateUrl: './comparemodal.component.html',
  styleUrls: ['./comparemodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComparemodalComponent implements OnInit {
 
  cols: any[];
  data: any[];
  // past: any[];
  pastValue: any[];
  patientDetails: any;
  patientMedicationList: any;
  currentMedList: any;
  pastMedList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private mediService: MedicationService
  ) { }

  ngOnInit() {
    this.cols = [
      { field:'DrfStartdate', header:'Start Date'},
      { field:'Drugname', header:'Drug Details'},
      { field:'Physicianname', header:'Prescriber'}
    ];
    this.data = [
      { startdate:'03/2/2019', drugdetails:'Humira', prescriber:'aaa'},
      { startdate:'06/1/2019', drugdetails:'Vitamin A', Prescriber:'bbb'}
    ];
    this.pastValue = [
      { startdate:'03/2/2019', drugdetails:'Humira', prescriber:'aaa'},
      { startdate:'06/1/2019', drugdetails:'Vitamin A', Prescriber:'bbb'} 
    ];
    this.getCurrentMedList();
    this.getPastMedList();
  }
  getMedicationList(page, archive) {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let payload = {
      patientId: this.patientDetails.PatientId,
      offset: page,
      limit: 4,
      version: 1,
      archive: archive ,
    }
    this.mediService.CustomGetMedicationlists(payload).subscribe((results: any) => {
      // this.patientMedicationList = results.Results;
      if(archive === "N"){
this.currentMedList = results.Results;
      } else if(archive === "Y"){
        this.pastMedList = results.Results;

              }
    })
  }
  getCurrentMedList(){
    let page =0;
    let archive ="N"
    this.getMedicationList(page, archive)
  }
  getPastMedList(){
    let page =0;
    let archive ="Y"
    this.getMedicationList(page, archive)
  }
}
