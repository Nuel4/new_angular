import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import { PatientmedicalhistoryService} from '../../../../services/chart/patientmedicalhistory.service'
import { ToastrService} from 'ngx-toastr'


@Component({
  selector: 'app-pmh-modal',
  templateUrl: './pmh-modal.component.html',
  styleUrls: ['./pmh-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PmhModalComponent implements OnInit {
  @Input() pmhData;
  @Input() IsDelete;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  @Input() PEValueObj: any;
pmhCategories: any = []
  detailedPMH: any;
  SelectedDetailsList: any;
  SelectedDetails: any;

  constructor(private modal: NgbActiveModal, 
    private pmhService: PatientmedicalhistoryService,
     private toaster: ToastrService) { }
  pmhDate: any = ""
  pmhDetails: any =""
  pmhComments: any = ""
  selectedCategory: any = ""
  ngOnInit() {
    // let param = {
    //   MrPastMedicalHistoryId: this.pmhData.MrPastMedicalHistoryId,
    // }
    this.pmhService.GetPatientPmhDetails(this.pmhData.MrPastMedicalHistoryId).subscribe( 
      res => {
        this.detailedPMH = res
      }
    )
    this.pmhDetails = {
      medical_term: this.pmhData.Description
    }
    this.pmhComments = this.pmhData.EnteredData;

      this.pmhData.Category == 1 ? this.selectedCategory = { label: 'Problem', value: '1' } : this.selectedCategory = { label: 'Surgery', value: '2' }
      this.pmhDate = new Date(this.pmhData.DateEntered) 
    this.pmhCategories = [
      { label: 'Select Category', value: 'null' },
      { label: 'Problem', value: '1' },
      { label: 'Surgery', value: '2' },
    ];
    if(this.PEValueObj){
      this.PEValueObj[0] = {
        DateEntered: this.pmhDate,
        EnteredData: this.pmhData.EnteredData,
        Category: this.pmhData.Category,
        Description: this.pmhData.Description
      }
    }
  }
  onFormDataChange() {
    this.PEValueObj[0] = {
      DateEntered: this.pmhDate,
      EnteredData: this.pmhComments,
      Category: this.selectedCategory.value,
      Description: this.SelectedDetails ? this.SelectedDetails.medical_term : ''
    }
  }
  fixUTCDate(date) {
    if (date) {
    date.setTime(new Date(new Date(date.getTime() - (date.getTimezoneOffset() * 60 *
    1000)).toUTCString()));
    }
    return date
    }
updatePmh(){
  let userDetails = JSON.parse(sessionStorage.getItem('UserDetail'))
  let param = {
    Active: this.pmhData.Active,
    MrPastMedicalHistoryId: this.pmhData.MrPastMedicalHistoryId,
    PatientId: this.pmhData.PatientId,
    MrPatientEncounterId: this.pmhData.MrPatientEncounterId,
    PhysicianId: this.pmhData.PhysicianId,
    Description: this.pmhDetails.medical_term,
    Document: this.detailedPMH.Document,
    EnteredData: this.pmhComments,
    DateCreated: this.pmhData.DateCreated,
    CreatedByUserId: this.detailedPMH.CreatedByUserId,
    DateLastUpdated: new Date(),
    LastUpdatedByUserId: userDetails.UserId,
    MrTemplateSectionId: this.detailedPMH.MrTemplateSectionId,
    MrFormFieldId: this.detailedPMH.MrFormFieldId,
    Category: this.selectedCategory.value,
    DateEntered: this.fixUTCDate(this.pmhDate)
  }
  this.pmhService.EditPastMedicalHistory((param)).subscribe(
    (result) => {
this.loadEvent.emit(true);
this.modal.dismiss('Cross click');
this.showAlert("Past medical history updated successfully!")
    }
  )
}
deletePmh(){
  // let param = { 
  //   MrPastMedicalHistoryId: this.pmhData.MrPastMedicalHistoryId
  // }
  this.detailedPMH.Active = false
  // let param = {
  //   MrPastMedicalHistoryId: this.pmhData.MrPastMedicalHistoryId,
  //   PatientId: this.patient,
  //   MrPatientEncounterId: null,
  //   PhysicianId: null,
  //   Description: "CAAT",
  //   Document: "",
  //   EnteredData: "ddddddddd",
  //   DateCreated: "2019-04-10T08:31:36.893",
  //   CreatedByUserId: 82,
  //   DateLastUpdated: "2019-04-10T08:31:36.893",
  //   LastUpdatedByUserId: 82,
  //   MrTemplateSectionId: null,
  //   MrFormFieldId: null,
  //   Category: 1,
  //   Active: true,
  //   DateEntered: "2019-04-10T08:31:05.24",
  //   CreatedByUser: null,
  //   LastUpdatedByUser: null,
  //   MrPatientEncounter: null,
  //   Patient: null,
  //   Physician: null,
  //   MrFormField: null,
  //   MrTemplateSection: null
  //   }
  this.pmhService.DeletePastMedicalHistory(this.detailedPMH).subscribe(
    (result: any) => {
      this.loadEvent.emit(true);
      this.modal.close('Close click')
      this.showAlert("Past medical history deleted successfully!")
    }
  )
}

LoadDetails(SelectedDetails) {
  let Detail;
  if (!SelectedDetails) {
    Detail = {
      search: "a"
    }
  }
  else {
    Detail = {
      search: SelectedDetails
    }
  }
  this.pmhService.SearchMedicalTerms(Detail).subscribe(resp => {
    this.SelectedDetailsList = resp
  })
}

showAlert(msg: string){
  this.toaster.success(msg)
}
}
