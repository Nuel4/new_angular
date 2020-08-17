import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchAllergyComponent } from '../../../chart/add-allergy/search-allergy/search-allergy.component';
import { AllergiesService } from '../../../../services/chart/allergies.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allergies-modal',
  templateUrl: './allergies-modal.component.html',
  styleUrls: ['./allergies-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllergiesModalComponent implements OnInit {
  modalRef: any;
  allergyName: any;
  allergyObj: any;
  sensitivity: any[]
  severity: any[]
  status: any[]
  @Input() allergyData: any;
  @Input() PEValueObj: any;
  allergyReaction: any;
  adverseDate: any;
  adverseAge: any;
  selectedSensitivity: any;
  selectedSeverity: any;
  selectedStatus: any = {};
  updatedAllergy: any;
  userDetails: any;
  patientDetails: any;
  @Output() loadEvent:EventEmitter<any> = new EventEmitter()
  knownAllergies: any = [];
  knownDrugAllergies: any = [];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private Allergies: AllergiesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    // if(this.allergyData){
      
    // }
    this.status = [
      {label:'Active',value:true},
      {label:'Inactive',value:false}
     ]
    this.sensitivity = [
      { label: 'Select Sensitivity' },
      { label: 'Adverse Reaction' },
      { label: 'Allergy'},
      { label: 'Contraindication' },
      { label: 'Introlerance' }
    ]
    this.severity = [
      { label: 'Select Severity' },
      { label: 'Mild' },
      { label: 'Moderate'},
      { label: 'Severe' },
      { label: 'Unknown' },
    ]

    if(this.allergyData) {
      this.allergyName = this.allergyData.Description;
      this.allergyReaction = this.allergyData.Reaction;
      this.adverseDate = this.allergyData.AdverseEventDate?moment(this.allergyData.AdverseEventDate).format('DD-MM-YYYY'):new Date();
      this.adverseAge = this.allergyData.Age;
      this.selectedSensitivity = {label:this.allergyData.Sensitivity};
      this.selectedSeverity = {label:this.allergyData.Severity};
      // this.selectedStatus.label = this.allergyData.Status;
      this.status.forEach(item => {
        if(this.allergyData.Status === item.label){
          this.selectedStatus = item;
        }
      })
    }
    if(this.PEValueObj){
      this.PEValueObj[0] = {
        AllergyName: this.allergyName ? this.allergyName : '',
        Reaction: this.allergyData.Reaction,
        AdverseEventDate:this.allergyData.AdverseEventDate?moment(this.allergyData.AdverseEventDate).format('DD-MM-YYYY'):new Date(),
        Age: this.allergyData.Age,
        Sensitivity: this.allergyData.Sensitivity,
        Severity: this.allergyData.Severity,
        Status: this.allergyData.Status,
        NoKnownAllergiesIntolerances: false,
        NoKnownDrugAllergiesIntolerances: false,
      }
    }
  }

  changeInAllergyForm() {
    this.PEValueObj[0] = {
      AllergyName: this.allergyName ? this.allergyName : '',
      Reaction: this.allergyReaction ? this.allergyReaction : '',
      AdverseEventDate: this.adverseDate ? this.adverseDate : new Date(),
      Age: this.adverseAge ? this.adverseAge : '',
      Sensitivity: this.selectedSensitivity ? this.selectedSensitivity.label : '',
      Severity: this.selectedSeverity ? this.selectedSeverity.label : '',
      Status: this.selectedStatus ? this.selectedStatus.label : '',
      NoKnownAllergiesIntolerances: this.knownAllergies.length > 0 ? true : false,
      NoKnownDrugAllergiesIntolerances: this.knownDrugAllergies.length > 0 ? true : false,
    }
  }
  onSearchAllergy() {
    this.modalRef = this.modalService.open(SearchAllergyComponent, { centered: true, size: 'lg' })
    this.modalRef.componentInstance.desc = this.allergyName
    this.modalRef.componentInstance.loadAllergy.subscribe((value) => {
      this.allergyObj = value;
      if (value) {
        this.allergyName = value.Description
        this.modalRef.close()
      }
    })
  }


  UpdatePatientAllergyList(){
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let payload = {
      
        "MrPatientAllergyListId": this.allergyData.MrPatientAllergyListId,
        "PatientId": this.patientDetails.PatientId,
        "MrPatientEncounterId": null,
        "MrAllergyId": this.allergyData.MrAllergyId,
        "AgeOfOnset": "3",
        "Reaction": this.allergyReaction,
        "Severity":this.selectedSeverity.label,
        "Sensitivity": this.selectedSensitivity.label,
        "Status": this.selectedStatus.value,
        "DateCreated": this.allergyData.DateCreated,
        "CreatedByUserId": this.allergyData.CreatedUserId,
        "DateLastUpdated": new Date(),
        "LastUpdatedByUserId": this.userDetails.UserId,
        "AdverseEventDate": moment(this.adverseDate),
        "NoKnownAllergiesIntolerances": true,
        "DisplayInChart": true,
        "Newcropseveritytypeid": null,
        "NoKnownDrugAllergiesIntolerances": true,
        "RcopiaAllergyId": "",
        "RcopiaXml": "",
        "Active": true
        
    }
    this.Allergies.updatePatientAllergy(payload).subscribe((results: any) => {
      this.updatedAllergy = results;
      this.loadEvent.emit(true);
      this.showSuccess("Allergy Updated successfully")
      this.activeModal.close('Close click')
    })
}

onCheckboxChange(value){
  this.knownAllergies = value;
}
  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

}
