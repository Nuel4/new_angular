import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LetterService } from '../../../../services/chart/letter.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Quill from 'quill';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LetterEditorComponent } from '../letter-editor/letter-editor.component';
var Link = Quill.import('formats/link');
class MyLink extends Link {
  static create(value) {
    // let pr: PatientsSummaryService
    // let obj: SmartTextboxComponent = new SmartTextboxComponent(pr)
    let node = super.create(value);
    // value = this.sanitize(value);
    // alert(value) 
    //modified
    node.setAttribute('href', "#");
    node.style.cursor = 'pointer'
    node.addEventListener('click', function (event) {
      // obj.linkCall()
    });
    node.removeAttribute('target');
    return node;
  }
}
Quill.register(MyLink);

@Component({
  selector: 'app-add-letter',
  templateUrl: './add-letter.component.html',
  styleUrls: ['./add-letter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddLetterComponent implements OnInit {
  addLetter: FormGroup;
  cols: any[];
  itemLists: any[];
  isdisabled: boolean = true;
  //  relatedOrganization: any = [];
  refPhysician: any = [];
  healthProvider: any = [];
  letterList: any;
  patientDetails: any;
  Index: number;
  letterTempCategoryList: any;
  healthCareProviderList: any = [];
  referringPhysicianList: any = [];
  LetterTemplateList: any = [];
  relatedOrganizationList: any;
  selectedRelOrganization: any;
  totalrecords: any;
  AllPracticesList: any;
  rowData: any;
  AllPastHistoryForLetter: any;
  selectedLeter: any
  LetterActiveCondition: any;
  PatientExaminationOption: any;
  PatientInvestigation: any;
  FacilityList: any;
  PatientsList: any;
  Salutations: any;
  FormattedProblemList: any;
  GroupSectionList: any;
  GroupFieldsList: any;
  AllFamilyMedicalHistory: any;
  AllPMHSections: any;
  MedicationList: any;
  SocialHistory: any;
  UOMsWithChildTables: any;
  CPTCodesPlanProcedure: any;
  userDetails: any;
  QualificationID: any;
  CustomFormattedInsurance: any;
  PastillnessInjuries: any;
  letterProblemList: any;
  LetterPlanProcedure: any;
  AllAllergies: any;
  LetterImmunizations: any;
  PatientEncounter: any;
  letterdate: any;
  selectedTemplateCategory: any;
  selectedRefPhysician: any;
  selectedHealthcareprovider: any;
  selectedTemplate: any;
  pageSize: any;
  filterLetter: any = {};
  



  constructor(private router: Router,
    private addletterService: LetterService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder, ) {
      this.addLetter = this.fb.group({
        letterdate: ['',Validators.required],
        selectedTemplateCategory: ['',Validators.required],
        selectedTemplate: ['',Validators.required],
        selectedRelOrganization: ['',Validators.required],
        selectedRefPhysician: ['',Validators.required],
        selectedHealthcareprovider: ['',Validators.required],
        description: ['',Validators.required],
      })

  }
  backbtnfun(event) {
    this.router.navigate(['/pages/chart/letters'], { skipLocationChange: true });

  }
  cancelbtnfun(event) {
    this.router.navigate(['/pages/chart/letters'], { skipLocationChange: true });
  }
  
  ngOnInit() {
    this.cols = [
      { field: 'date_created', header: 'Date' },
      { field: 'chief_complaint', header: 'Details' },
      { field: 'physician', header: 'Physician' },
      { field: 'is_clinical_summary_given_to_patient', header: 'Summary' },
    ];

    
    // this.patientletter = [
    //   { label:'Referral Letter' , value:1},
    //   { label:'Patient Letters' , value:2},
    //   { label:'Encounter Reports' , value:3},
    //   { label:'Immunization Reports' , value:4}
    // ];

    // this.patientTemplate = [
    //   { label:'Refer to Physician' , value:1},
    //   { label:'MTA Doctors Note' , value:2},
    //   { label:'PDT' , value:3},
    //   { label:'Letter to Referring Physician' , value:4}
    // ];
    // this.relatedOrganization = [
    //   { label:'Attorney' , value:1},
    //   { label:'DMV' , value:2},
    //   { label:'Individual' , value:3},
    //   { label:'KUB' , value:4}

    // ];


    // this.getLetterTempCategories();
    // this.getLetterTemplates();
    // this.getRelatedOrganizations();

    // this.getHealthCareProvider();
    // this.getMrPatientEncounter();

  }

  getDropdowns() {
    this.getLetterTempCategories();
    this.getLetterTemplates();
    this.getRelatedOrganizations();
    this.getHealthCareProvider();
  }

  submit() {
  }
  openEditor() {
    let modalRef = this.modalService.open(LetterEditorComponent , { centered: true,size:'lg'})
    modalRef.componentInstance.newLetter = this.filterLetter;
    modalRef.componentInstance.header = 'Letter Editor'
    // modalRef.componentInstance.editEvent.subscribe((value) => {
    //   if (value) {
    //     // this.cancelReferralLetters(LettersId)        
    //     this.getReferalLetter();
    //     // this.modalRef.close()
    //   }
    // })
  }

  // onSubmit() {
  //   this.getPractices();
  //   this.getAllPastHistoryForLetter();
  //   this.getLetterActiveConditions();
  //   this.getPatientExaminationOptions();
  //   this.getPatientInvestigations();
  //   this.getPatientsByDOB();
  //   this.getFacilities();
  //   // this.getAllSalutations();
  //   this.getMedicationLists();
  //   this.getFormattedProblems();
  //   this.getGroupSection();
  //   this.getGroupFields();
  //   this.getAllPmhSection();
  //   this.getAllFamilyMedicalHistory();
  //   this.getAllSocialHistory();
  //   this.getAllUOMsWithChildTables();
  //   this.getCPTCodesPlanProcedure();
  //   this.getQualificationsID();
  //   this.getCustomFormattedInsurance();
  //   this.getLetterPastillnessInjuries();
  //   this.getAllLetterProblemList();
  //   this.getAllLetterPlanProcedure();
  //   this.getAllAllergiesByPatientId(this.Index);
  //   this.getLetterImmunizationList();
  //   this.getPatientEncounterFullByID();
  //   this.AddLetter();
  // }

  onRowSelect(event) {
    this.isdisabled = false;
  }

  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.getMrPatientEncounter(this.Index)
  }

  getMrPatientEncounter(index?) {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,

      offset: index ? index : 0,
      limit: 10,
    }
    this.addletterService.getPatientEncounterByPatientId(param).subscribe((results: any) => {
      this.letterList = results.Results;
      this.letterList.forEach((item, index) => {
        item.date_created = moment(item.date_created).format("DD-MM-YYYY")
      })
      this.totalrecords = results.TotalItems;
      this.pageSize = results.PageSize;
    })
  }

  getLetterTempCategories() {
    this.addletterService.getLetterTemplateCategory().subscribe((results: any) => {
      this.letterTempCategoryList = results;
    })
  }

  getHealthCareProvider() {
    this.addletterService.getAllSystemUsers().subscribe((results: any) => {
      for (let i = 0; i < results.length; i++) {
        results[i].FullName = results[i].firstName + " " + results[i].lastName
      }
      this.healthCareProviderList = results;
    })
  }

  getReferringPhysician() {
    this.addletterService.getReferringPhysicianByOrganizationId({ relatedOrganizationId: this.filterLetter.selectedRelOrganization.RelatedOrganizationId }).subscribe((results: any) => {
      for (let i = 0; i < results.length; i++) {
        results[i].FullName = results[i].ReferringPhysicianFirstName + " " + results[i].ReferringPhysicianLastName
      }
      this.referringPhysicianList = results;
    })
  }


  getLetterTemplates() {
    this.addletterService.getLetterTemplate().subscribe((results: any) => {
      this.LetterTemplateList = results;
    })
  }

  getRelatedOrganizations() {
    this.addletterService.getRelatedOrganization().subscribe((results: any) => {
      this.relatedOrganizationList = results;
    })
  }

  getPractices() {
    this.addletterService.getAllPractices().subscribe((results: any) => {
      this.AllPracticesList = results;
    })
  }

  getAllPastHistoryForLetter() {
    this.addletterService.getPastHistoryForLetter({ encounterId: this.selectedLeter ? this.selectedLeter.MrPatientEncounterId : 0 }).subscribe((results: any) => {
      this.AllPastHistoryForLetter = results;
    })
  }

  getLetterActiveConditions() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
    }

    this.addletterService.getLetterActiveCondition(param).subscribe((results: any) => {
      this.LetterActiveCondition = results;
    })

  }

  getPatientExaminationOptions() {
    this.addletterService.getPatientExaminationOption().subscribe((results: any) => {
      this.PatientExaminationOption = results;
    })
  }

  getPatientInvestigations() {
    this.addletterService.getPatientInvestigationsByEncounter({ encounterId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.PatientInvestigation = results;
    })
  }

  getPatientsByDOB() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      firstname: this.patientDetails.FirstName,
      lastname: this.patientDetails.LastName,
      dob: this.patientDetails.DateOfBirth
    }
    this.addletterService.getPatients(param).subscribe((results: any) => {
      this.PatientsList = results;
    })
  }

  getFacilities() {
    this.addletterService.getFacility().subscribe((results: any) => {
      this.FacilityList = results;
    })
  }

  getAllSalutations() {
    this.addletterService.getSalutations().subscribe((results: any) => {
      this.Salutations = results;
    })
  }

  getMedicationLists() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId
    }
    this.addletterService.getMedicationList(param).subscribe((results: any) => {
      this.MedicationList = results;
    })
  }

  getFormattedProblems() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId
    }
    this.addletterService.getFormattedProblemList(param).subscribe((results: any) => {
      this.FormattedProblemList = results;
    })
  }

  getGroupSection() {

    let params = {
      encounterId: this.selectedLeter.MrPatientEncounterId,
    }
    this.addletterService.getGroupSectionByEncounterId(params).subscribe((results: any) => {
      this.GroupSectionList = results;
    });
  }

  getGroupFields() {
    let params = {
      encounterId: this.selectedLeter.MrPatientEncounterId,
    }
    this.addletterService.getGroupFieldsByEncounterId(params).subscribe((results: any) => {
      this.GroupFieldsList = results;
    })
  }

  getAllPmhSection() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId
    }
    this.addletterService.getAllPMHSectionByPatientId(param).subscribe((results: any) => {
      this.AllPMHSections = results;
    })
  }

  getAllFamilyMedicalHistory() {
    this.addletterService.getMrFamilyMedicalHistory({ patientEncountId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.AllFamilyMedicalHistory = results;
    })
  }

  getAllSocialHistory() {
    this.addletterService.getMrSocialHistory().subscribe((results: any) => {
      this.SocialHistory = results;
    })
  }

  getAllUOMsWithChildTables() {
    this.addletterService.getUOMswithChildTables().subscribe((results: any) => {
      this.UOMsWithChildTables = results;
    })
  }

  getCPTCodesPlanProcedure() {
    this.addletterService.getCPTCodesPlanProcedureByEncounterId({ encounterId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.CPTCodesPlanProcedure = results;
    })
  }

  getQualificationsID() {
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))

    let param = {
      userId: this.userDetails.userId
    }
    this.addletterService.getQualificationsIDByUserID(param).subscribe((results: any) => {
      this.QualificationID = results;
    })
  }

  getCustomFormattedInsurance() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientID: this.patientDetails.PatientId
    }
    this.addletterService.getCustomFormattedInsuranceByPatientId(param).subscribe((results: any) => {
      this.CustomFormattedInsurance = results;
    })
  }

  getLetterPastillnessInjuries() {
    this.addletterService.getLetterPastillnessInjuriesById({ encounterId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.PastillnessInjuries = results;
    })
  }

  getAllLetterProblemList() {
    this.addletterService.getLetterProblemList({ encounterId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.letterProblemList = results;
    })
  }

  getAllLetterPlanProcedure() {
    this.addletterService.getLetterPlanProcedureById({ encounterId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.LetterPlanProcedure = results;
    })
  }

  getAllAllergiesByPatientId(index?) {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
      encounterId: this.selectedLeter.MrPatientEncounterId,
      offset: index ? index : 0,
      limit: 10,
    }
    this.addletterService.getAllergiesByPatientId(param).subscribe((results: any) => {
      this.AllAllergies = results;
    })
  }

  getLetterImmunizationList() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
      encounterId: this.selectedLeter.MrPatientEncounterId
    }

    this.addletterService.getLetterImmunizationsByPatientId(param).subscribe((results: any) => {
      this.LetterImmunizations = results;
    })

  }

  getPatientEncounterFullByID() {
    this.addletterService.getPatientEncounterFullByEncounterID({ encounterId: this.selectedLeter.MrPatientEncounterId }).subscribe((results: any) => {
      this.PatientEncounter = results;
    })
  }

  AddLetter() {
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      PatientId: this.patientDetails.PatientId,
      DateCreated: new Date(),
      DateLastUpdated: new Date(),
      Document: '',
      CreatedByUserId: this.userDetails.UserId,
      LastUpdatedByUserId: this.userDetails.UserId,
      IsInactive: false,
      SavedMethodIdentifier: 3,
      Printed: false,
      Active: null,
      CreatedByUser: null,
      FileName: null,
      IncludeClinicalSummary: null,
      IncludeCompleteMedicalHistory: null,
      IncludeSummaryOfCareRecord: null,
      LastUpdatedByUser: null,
      LetterTemplate: null,
      LetterTemplateCategory: null,
      MrPatientEncounter: null,
      MrPatientEncounterId: this.selectedLeter.MrPatientEncounterId,
      Patient: null,
      PrintedTimestamp: null,
      ProviderUser: null,
      ReferringPhysician: null,
      RelatedOrganisation: null,
      LetterDate: this.letterdate,
      LetterTemplateId: this.selectedTemplate.LetterTemplateId,
      LetterTemplateCategoryId: this.selectedTemplateCategory.LetterTemplateCategoryId,
      RelatedOrganisationId: this.selectedRelOrganization.RelatedOrganizationId,
      ReferringPhysicianId: this.selectedRefPhysician && this.selectedRefPhysician.ReferringPhysicianId || null,
      ProviderUserId: this.selectedHealthcareprovider.UserId,


    }
    this.addletterService.AddReferalLetter(param).subscribe((results: any) => {
      this.showSuccess("letter added successfully")
    })

  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

}
