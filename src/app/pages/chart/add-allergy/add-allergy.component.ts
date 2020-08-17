import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SearchAllergyComponent } from './search-allergy/search-allergy.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AllergiesService } from '../../../services/chart/allergies.service';
import { ToastrService } from 'ngx-toastr';
import { AllergiesComponent } from '../allergies/allergies.component';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';


declare var $: any;
@Component({
  selector: 'app-add-allergy',
  templateUrl: './add-allergy.component.html',
  styleUrls: ['./add-allergy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAllergyComponent implements OnInit {
  @Output() onSomething = new EventEmitter<string>();
  @Output() refreshData: EventEmitter<any> = new EventEmitter();
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  sensitivity: any[]
  severity: any[]
  status: any[]
  selectedsensitivity: string
  selectedseverity: string
  selectedstatus: string
  allergyName: any;
  allergyReaction: any;
  adverseDate: any;
  adverseAge: any;
  selectedSensitivity: any;
  selectedSeverity: any;
  selectedStatus: any;
  foodAllergies: any = [];
  allergyHead: any = [];
  allergyValue: any
  drugAllergies: any = [];
  drugHead: any = [];
  searchDescription: any;
  modalRef: any;
  userDetails: any;
  patientDetails: any;
  allergyObj: any;
  newAllergy: any;
  isenableControls: boolean = false;
  knownAllergies: any = [];
  knownDrugAllergies: any = [];
  // isenableCancelBtn: boolean = true;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private Allergies: AllergiesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder
    // private allergy: AllergiesComponent
  ) {
  }

  ngOnInit() {
    if (this.route.snapshot.routeConfig.path == "template-editor") {
      // alert('temp')
      this.isenableControls = true;
      // this.isenableOnlyTable = true;
    }

    this.sensitivity = [
      { label: 'Adverse Reaction', value: 1 },
      { label: 'Allergy', value: 2 },
      { label: 'Contraindication', value: 3 },
      { label: 'Introlerance', value: 4 }
    ]
    this.severity = [
      { label: 'Mild', value: 1 },
      { label: 'Moderate', value: 2 },
      { label: 'Severe', value: 3 },
      { label: 'Unknown', value: 4 },
    ]
    this.status = [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 2 },
    ]

    // if(this.route.snapshot.routeConfig.path === "app-add-allergy"){
    //   this.isenableAllergyTable = false;
    // }
    //  if(this.route.snapshot.routeConfig.path === "template-editor"){

    //     this.isenableCancelBtn = false;
    //   }
   
      // if(this.PEValueObj){
this.PEValueObj === undefined && (this.PEValueObj = [{}])
        this.PEValueObj[0] = {
          AllergyName: '',
          Reaction: '',
          AdverseEventDate: '',
          Age: '',
          Sensitivity: '',
          Severity: '',
          Status: '',
          NoKnownAllergiesIntolerances: false,
          NoKnownDrugAllergiesIntolerances: false,
        }
      // }   
      if(this.PEValueObj){
        console.log('PevalueObj :');
        const control = this.fb.control(this.PEValueObj)
        this.group.addControl(this.field.name, control);
      }
  }
  // changeInAllergyForm() {
  //   this.PEValueObj[0] = {
  //     AllergyName: this.allergyName ? this.allergyName : '',
  //     Reaction: this.allergyReaction ? this.allergyReaction : '',
  //     AdverseEventDate: this.adverseDate ? this.adverseDate : '',
  //     Age: this.adverseAge ? this.adverseAge : '',
  //     Sensitivity: this.selectedSensitivity ? this.selectedSensitivity.label : '',
  //     Severity: this.selectedSeverity ? this.selectedSeverity.label : '',
  //     Status: this.selectedStatus ? this.selectedStatus.label : '',
  //     NoKnownAllergiesIntolerances: this.knownAllergies.length > 0 ? true : false,
  //     NoKnownDrugAllergiesIntolerances: this.knownDrugAllergies.length > 0 ? true : false,
  //   }
  // }

  onSaveAllergies(allergyData) {
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
  onClearAllergy(searchDescription) {
    this.searchDescription = null;
  }

  addPatientAllergyList() {
    if(this.allergyName === undefined && this.allergyReaction === undefined){
      this.toastr.error("Please Select Mandatory Fields")
    }
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      PatientId: this.patientDetails.PatientId,
      // MrPatientAllergyListId:this.
      MrPatientEncounterId: null,
      MrAllergyId: this.allergyObj.MrAllergyId,
      AgeOfOnset: this.adverseAge,
      Reaction: this.allergyReaction,
      Severity: this.selectedSeverity ? this.selectedSeverity.label :'',
      Sensitivity: this.selectedSensitivity ? this.selectedSensitivity.label :'',
      Status: true,
      DateCreated: new Date(),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.LastUpdatedByUserId,
      AdverseEventDate: new Date(),
      NoKnownAllergiesIntolerances: true,
      DisplayInChart: true,
      Newcropseveritytypeid: null,
      NoKnownDrugAllergiesIntolerances: true,
      RcopiaAllergyId: '',
      RcopiaXml: '',
      Active: true,

    }

    this.Allergies.patientAllergyList(param).subscribe((results: any) => {
      this.newAllergy = results;
      this.showSuccess("Allergy added successfully");
      this.clearData();
      if (this.route.snapshot.routeConfig.path === 'add-allergy') {
        this.router.navigate(['/pages/chart'], { skipLocationChange: true });
      }
      this.refreshData.emit()
      
    })
  }

  
  clearData(){
    this.allergyName = "";
    this.allergyReaction = "";
    this.adverseDate = "";
    this.adverseAge = "";
    this.selectedSensitivity = "";
    this.selectedSeverity = "";
    this.selectedStatus = "";
    this.knownAllergies = false;
    this.knownDrugAllergies = false;
  }


  onCheckboxChange(value){
    this.knownAllergies = value;
  }

  pageCancel() {
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

}


