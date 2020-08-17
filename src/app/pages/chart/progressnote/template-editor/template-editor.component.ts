import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { CharthomeService } from '../../../../../app/services/chart/charthome.service';
import * as moment from "moment";
import { TemplatemodalComponent } from './templatemodal/templatemodal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressnoteService } from '../../../../../app/services/chart/progressnote.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators } from "@angular/forms";
import { FieldConfig } from "./field.interface";
import { DynamicFormComponent } from './fields/dynamic-form/dynamic-form.component';
import { AuthenticationStore } from "./../../../../authentication/authentication-store";
import { AppointmentService } from '../../../../services/workspace/appointment.service'
import { ChangeDetectorRef } from '@angular/core';
import { ImmunzScheService } from '../../../../services/chart/immunzsche.service'
import {ToastrService} from 'ngx-toastr'
@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TemplateEditorComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  // we are reusing the select-icd component in billing modules hence using compform variable we are adding few conditions
  compFrom = 'template';
  PatientDetail: any;
  selectedValues: string[] = [];
  age: any = '';
  gender: any = '';
  smokingStatus: any = '';
  buttonList: any = [];
  options: any = [];
  item: string;
  temporaryId: any;
  Identifier: any = [];
  getSectionId: any = [];
  cities2: any = [];
  Reasons: any[];
  selectedDeceased: any;
  Item: any;
  checked: boolean = false;
  cities1: any = [];
  regConfig: FieldConfig[] = []
  urlEncounterId: string;
  PEncounterObj: any
  PEncounterFDObj: any;
  showButtons: boolean = true;
  templateSectionId = []
  userDetails: any;
  physician: any;
  consultationDate: any;
  initials: any;
  timeSpent: any;
  appointment: any;
  chiefComplaint: any;
  firstClick = 1;
  facility: any;
  patientEncounter: any;
  patientEncounterId: any;
  isSigned = false;
  savedProgress: any;
  firstEncounter = 1;
  summaryItems = [ {label: 'Detailed', command: () => {
    this.GetPatientEncounter();
}},
{label: 'Update', command: () => {
  this.GetPatientEncounter();
}}]
  constructor(private chartservive: CharthomeService,
    private modalService: NgbModal,
    private progressService: ProgressnoteService,
    private route: ActivatedRoute,
    private authStore: AuthenticationStore,
    private router: Router,
    private appointmentService: AppointmentService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private immuneService: ImmunzScheService,
    private toaster: ToastrService
  ) {
    this.cities2 = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
    this.Reasons = [
      { label: 'Blood Pressure Check', value: 'blood pressure check' },
      { label: 'Endoscopy', value: 'endoscopy' },
      { label: 'Labs/Blood', value: 'labs/blood' }
    ];
    this.cities1 = [
      { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
      { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
      { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
      { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
      { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];
  }

  ngOnInit() {
    sessionStorage.removeItem("PEVitals")
    this.consultationDate = JSON.parse(sessionStorage.getItem('ConsultationDate'))
    this.appointment = JSON.parse(sessionStorage.getItem('Appointment'))
    this.facility = JSON.parse(sessionStorage.getItem('ProgressnoteFacility'))
    this.regConfig = []
    this.PatientDetail = this.authStore.PatientDetail
    this.userDetails = this.authStore.UserDetail
    this.physician = JSON.parse(sessionStorage.getItem('PhysicianDetail'))
    this.getProgressNoteOption();
    this.temporaryId = this.route.snapshot.paramMap.get('snapshot/queryParams/Id');
    this.urlEncounterId = this.route.snapshot.queryParams.EncounterId
    if (this.route.snapshot.queryParams.EncounterId) {
      this.getTemplateGroupByEncounter()
    } else {
      this.getTemplateGroup()
    }

    this.age = this.getAge(moment(this.PatientDetail.DateOfBirth).format('DD-MM-YYYY'));
    if (this.PatientDetail.Sex = true) {
      this.gender = "M"
    } else {
      this.gender = "F"
    }
    this.buttonList = [{ name: 'Title' }, { name: 'Impressions' }, { name: 'Recommendations' }, { name: 'Procedures' },]
    this.getSmokingStatus();

    this.options = [
      { label: 'Office Visit', value: 'Office Visit' },
      { label: 'CS Provided within 3days', value: 'CS Provided within 3days' },
      { label: 'Skip level of service', value: 'Skip level of service' },
      { label: 'Time Spent', value: 'Time Spent' },

    ];
    let a = JSON.stringify(this.form)
    this.firstEncounter === 1 && (this.createEncounter(), this.firstEncounter++)
    

    // setInterval(()=>{
    //   console.log("auto save working")
    // },15000)

  }
  ngAfterViewInit() {

  }
  ngAfterViewChecked() {
    if (this.form) {
      // console.log("1");
      if (this.form.value) {
        let obj = Object.keys(this.form.value)
        // console.log('obj :', obj);
        if (obj.length === 1) {
          // console.log("length is 1");
          if (this.form.value[obj[0]].length !== 0) {
            // console.log('this.form.value :', this.form.value);
            // console.log("last", this.form.value[obj[0]]);
            this.chiefComplaint = this.form.value[obj[0]]
            // console.log('this.chiefComplaint :', this.chiefComplaint);
            this.Identifier.map(item => item.disabled = false)
          }
        } else if (obj.length > 1) {
          // console.log("last");
          this.Identifier.map(item => item.disabled = false)
        }
      }
    }
    this.isSigned && this.Identifier.map(item => item.label != 'Additional comments' && (item.disabled = true))
    this.ChangeDetectorRef.detectChanges()
    // console.log("ngAfterViewChecked")
    // let a = JSON.stringify(this.form)
    // console.log('this.form :', JSON.parse(a));
    // console.log('this.form value :', JSON.stringify(this.form.value)); 
    // console.log('this.form value :',this.form.value); 
    // this.ChangeDetectorRef.
  }
  ngOnChanges() {
    let a = JSON.stringify(this.form)
    // console.log('this.form :', JSON.parse(a));
    // console.log('this.form value :', JSON.stringify(this.form));
  }
  closeProgressNote() {
    this.router.navigate(['/pages/chart']);
    sessionStorage.removeItem("PEVitals")
  }
  GetPatientEncounter() {
    this.progressService.GetPatientEncounterFullByEncounterIDSummary({
      encounterId: this.patientEncounterId
    }).subscribe(resp => {
      this.PEncounterObj = resp
      console.log("PEncounterObj", this.PEncounterObj)
      this.buttonOnClick(0, 0)
    })
  }

  GetFormFieldDataForEncounter() {
    this.progressService.GetFormFieldDataForEncounter({
      patientEncounterId: this.urlEncounterId
    }).subscribe(resp => {
      this.PEncounterFDObj = resp
      // console.log(this.PEncounterFDObj)
    })
  }

  getSmokingStatus() {
    this.chartservive.GetSmokingStatus(this.PatientDetail.PatientId).subscribe(results => {
      // console.log("the smoking status is ", results)
      this.smokingStatus = results.TobaccoUsage;
    })
  }
  getAge(dateString) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    var dob = new Date(dateString.substring(6, 10),
      dateString.substring(0, 2) - 1,
      dateString.substring(3, 5)
    );

    var yearDob = dob.getFullYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    // var age = {};
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";


    var yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    var age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };

    if (age.years > 1) yearString = " years";
    else yearString = " year";
    if (age.months > 1) monthString = " months";
    else monthString = " month";
    if (age.days > 1) dayString = " days";
    else dayString = " day";


    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + ", " + age.months + monthString + ", and " + age.days + dayString;
    else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
      ageString = age.days + dayString;
    else if ((age.years > 0) && (age.months == 0) && (age.days == 0))
      ageString = age.years + yearString;
    else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
      ageString = age.years + yearString + " and " + age.months + monthString;
    else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " and " + age.days + dayString;
    else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
      ageString = age.years + yearString + " and " + age.days + dayString;
    else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
      ageString = age.months + monthString;
    else ageString = " ";

    return ageString;
  }
  getProgressNoteOption() {
    let param = {
      category: 'Practice',
      property: 'AutoSave'
    }
    this.progressService.getTemplateBuilderOption(param).subscribe(res => {
      // console.log("Progress Order:", res)
    })
  }

  getTemplateGroupByEncounter() {
    let param = {
      encounterId: this.urlEncounterId,
      templateGroupId: this.route.snapshot.queryParams.Id
    }
    this.progressService.GetSectionsForTemplateGroupByEncounter(param).subscribe(resp => {
      this.Identifier = resp;
      this.GetPatientEncounter()
      this.GetFormFieldDataForEncounter()
    })
  }

  getTemplateGroup() {
    // console.log(this.route)
    // console.log(this.route.snapshot.queryParams.Id)
    let param = {
      templateGroupId: this.route.snapshot.queryParams.Id ? this.route.snapshot.queryParams.Id : this.route.snapshot.queryParams.tempID
    }
    this.progressService.getTemplateGroupSection(param).subscribe(res => {
      this.Identifier = res;
      // console.log(this.Identifier)
      this.Identifier.forEach((value, index) => {

        this.getSectionId.push(value.MrTemplateSectionId)
        this.GetPatientEncounter()
        this.GetFormFieldDataForEncounter()
        index === 0 ? value.disabled = false : value.disabled = true
      })


      // this.Identifier[0].MrFormFields.map(field => {
      //   this.regConfig.push({
      //     label: field.DisplayLabel,
      //     name: field.MrFormFieldId,
      //     inputType: field.FieldType === "Text Box" ? "text" : '',
      //     options: field.MrFormFieldValueOptions.length > 0 ? field.MrFormFieldValueOptions : '',
      //     optionLabel: "ValueOption",
      //     collections: '',
      //     type: field.WidgetType == null ? field.FieldType : field.WidgetType,
      //     value: this.PEncounterObj ? this.PEncounterObj.MrFormFieldData[0].Data : '',

      //   })
      // })


      // console.log('temporary group id', this.Identifier)
    })
    this.progressService.templateType.subscribe(resp => {
      this.Identifier = resp
      // console.log('aasss', this.Identifier)
    })
  }
  buttonOnClick(event, _index) {
    // console.log("before click", this.firstClick, event);
    if (event === 'click' && this.firstClick === 1 && this.chiefComplaint) {
      // console.log("first click")
      this.firstClick++
      this.chiefComplaint && (this.patientEncounter.ChiefComplaint = this.chiefComplaint)
      this.updateEncounter()
    }
    if (event === 'click') {
      this.saveProgressNote()
    }
    // alert(this.Identifier[_index].MrFormFields.length)
    this.regConfig = []
    // console.log(this.Identifier[_index]);
    if (this.Identifier[_index] && this.Identifier[_index].MrFormFields.length > 0) {
      this.Identifier[_index].MrFormFields.sort((a, b) => { return a.RowOrder - b.RowOrder })
      // console.log(this.PEncounterObj)
      this.Identifier[_index].MrFormFields.map(field => {
        this.templateSectionId.push(field)
        // console.log('this.templateSectionId :', this.templateSectionId);
        // console.log(field)
        let SettedValue = [];
        let WidgetValue = [];
        if (this.urlEncounterId) {
          if (this.PEncounterObj.MrFormFieldData.length > 0) {
            this.PEncounterObj.MrFormFieldData.map(fielddata => {
              if (field.MrFormFieldId === fielddata.MrFormFieldId) {
                switch (fielddata.MrFormField.FieldType) {
                  case "Text Box":
                    SettedValue = fielddata.Data
                    break;
                  case "Small Text Box":
                    SettedValue = fielddata.Data
                    break;
                  case "Multiline Text Box":
                    SettedValue = fielddata.Data
                    break;
                  case "Smart Text Box":
                    SettedValue = fielddata.Data
                    break;
                  case "DatePicker":
                    SettedValue = fielddata.Data
                    break;

                  default:
                    fielddata.MrFormField.MrFormFieldValueOptions.map(val => {
                      if (val.ValueOption === fielddata.Data) {
                        SettedValue.push(val)
                      }
                    })
                    break;
                }
              }
            })
          }
        } else {

        }
        // console.log('field.WidgetType', field)
        if (field.WidgetType !== null) {
          switch (field.WidgetType) {
            case "Vitals":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrVitals : '';
              break;
            case "Allergies":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPatientAllergyLists : '';
              break;
            case "Past Medical History":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPastMedicalHistories : '';
              break;
            case "Investigations":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.PatientInvestigations : '';
              break;
            case "Immunizations & Injections":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPatientImmunizations : '';
              break;
            case "Patient Education Resources":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPatientEducations : '';
              break;
            case "Physician Additional Comments":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrAdditionalComments : '';
              break;
            case "Search/Select CPT4":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPlanProcedures : '';
              break;
            case "Family Medical History":
              WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrFamilyMedicalHistories : '';
              break;
            case "Substance Abuse":
            case "Tobacco Usage":
            case "Alcohol Usage":
              WidgetValue = this.PEncounterObj.MrSocialHistories[0]
              break;
          }
        }
        this.regConfig.push({
          label: field.DisplayLabel,
          name: field.MrFormFieldId,
          inputType: field.FieldType === "Text Box" ? "text" : '',
          options: field.MrFormFieldValueOptions.length > 0 ? field.MrFormFieldValueOptions : '',
          optionLabel: "ValueOption",
          collections: WidgetValue,
          type: field.WidgetType == null ? field.FieldType : field.WidgetType,
          value: SettedValue,

        })
      })
      // console.log(this.regConfig)
    }
    else {
      this.Identifier[_index] && this.Identifier[_index].SectionIdentifierNavigation.MrTemplateSections.map(section => {
        let configfield = []
        let WidgetValue = []
        if (this.Identifier[_index].MrTemplateSectionId === section.ParentSectionId) {
          // console.log(section)
          section.MrFormFields.sort((a, b) => { return a.RowOrder - b.RowOrder })
          section.MrFormFields.map(field => {
            let SettedValue = [];
            if (this.urlEncounterId) {
              this.PEncounterObj.MrFormFieldData.map(fielddata => {
                // console.log("fielddata", fielddata)
                if (field.MrFormFieldId === fielddata.MrFormFieldId) {
                  switch (fielddata.MrFormField.FieldType) {
                    case "Text Box":
                      SettedValue = fielddata.Data
                      break;
                    case "Small Text Box":
                      SettedValue = fielddata.Data
                      break;
                    case "Multiline Text Box":
                      SettedValue = fielddata.Data
                      break;
                    case "Smart Text Box":
                      SettedValue = fielddata.Data
                      break;
                    case "DatePicker":
                      SettedValue = fielddata.Data
                      break;

                    default:
                      fielddata.MrFormField.MrFormFieldValueOptions.map(val => {
                        if (val.ValueOption === fielddata.Data) {
                          SettedValue.push(val)
                        }
                      })
                      break;
                  }
                }
              })
            }
            if (field.WidgetType !== null) {
              switch (field.WidgetType) {
                case "Vitals":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrVitals : '';
                  break;
                case "Allergies":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPatientAllergyLists : '';
                  break;
                case "Past Medical History":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPastMedicalHistories : '';
                  break;
                case "Investigations":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.PatientInvestigations : '';
                  break;
                case "Immunizations & Injections":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPatientImmunizations : '';
                  break;
                case "Patient Education Resources":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPatientEducations : '';
                  break;
                case "Physician Additional Comments":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrAdditionalComments : '';
                  break;
                case "Search/Select CPT4":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrPlanProcedures : '';
                  break;
                case "Family Medical History":
                  WidgetValue = this.PEncounterObj !== null ? this.PEncounterObj.MrFamilyMedicalHistories : '';
                  break;
                case "Substance Abuse":
                case "Tobacco Usage":
                case "Alcohol Usage":
                  WidgetValue = this.PEncounterObj.MrSocialHistories[0]
                  break;
              }
            }
            configfield.push({
              label: field.DisplayLabel,
              name: field.MrFormFieldId,
              inputType: field.FieldType === "Text Box" ? "text" : '',
              options: field.MrFormFieldValueOptions.length > 0 ? field.MrFormFieldValueOptions : '',
              optionLabel: "ValueOption",
              collections: WidgetValue,
              type: field.WidgetType == null ? field.FieldType : field.WidgetType,
              value: SettedValue,
            })
          })
          this.regConfig.push({
            collections: configfield,
            type: "Sections",
            label: section.SectionHeading
          })
          return;
        }
        // else {
        //   section.MrFormFields.map(field => {
        //     configfield.push({
        //       label: field.DisplayLabel,
        //       name: "",
        //       inputType: field.FieldType === "Text Box" ? "text" : '',
        //       options: field.MrFormFieldValueOptions.length > 0 ? field.MrFormFieldValueOptions : '',
        //       optionLabel: "ValueOption",
        //       collections: '',
        //       type: field.WidgetType == null ? field.FieldType : field.WidgetType,
        //       value: field.DefaultValue
        //     })
        //   })
        //   this.regConfig.push({
        //     collections: configfield,
        //     type: "Sections",
        //     label: section.SectionHeading
        //   })
        //   return 1
        // }
      })
      // console.log()
    }
  }

  openModal(type) {
    if (type === 'save_sign') {
      const modalRef = this.modalService.open(TemplatemodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.save_sign = true;
      modalRef.componentInstance.saveProgressNote.subscribe(value => {
        // console.log("object", value);
        value === true && (this.saveProgressNote(true), this.isSigned = true)
        // this.Identifier.map(item => {
        //   item.label != 'Additional comments' && (item.disabled = true)
        // })
        this.patientEncounter.IsCompleted === null && delete this.patientEncounter.IsCompleted
        this.patientEncounter.IsCompleted = true
        this.updateEncounter();
      })
    } else if (type === 'follw_up_visit') {
      const modalRef = this.modalService.open(TemplatemodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.follw_up_visit = true;
    } else if (type === 'import') {
      const modalRef = this.modalService.open(TemplatemodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.import = true;
      modalRef.componentInstance.templateSectionObj = this.getSectionId;
    }

  }

  deceasedChecked() {
    this.checked = true;
  }
  saveProgressNote(save?) {

    let form = Object.assign({}, this.form.value)
    // console.log('this.form.value :', this.form.value);
    let payload = []
    for (let key in form) {
      // console.log("key", key)
      // console.log(form[key]);
      let FormFieldDataId;
      let templateID = this.templateSectionId.find(item => item.MrFormFieldId === parseInt(key))
      this.savedProgress && (FormFieldDataId = this.savedProgress.find(item => item.MrFormFieldId === parseInt(key)))
      // console.log('templateID :', templateID);
      // if(form[key].length != 0){
      //   obj.id = key;
      // obj.value = form[key]
      // console.log('form[key].length :', form[key].length != 0);
      if (Array.isArray(form[key]) ) {
        // form[key] = form[key].pop()
        form[key] = JSON.stringify(form[key])
      }
if(!( FormFieldDataId && FormFieldDataId.Data === form[key] ))
{
      form[key] != null && form[key].length != 0 && payload.push({
        MrPatientEncounterId: this.patientEncounterId,
        PatientId: this.PatientDetail.PatientId,
        MrFormFieldDataId: FormFieldDataId ? FormFieldDataId.MrFormFieldDataId : FormFieldDataId,
        MrTemplateGroupId: parseInt(this.route.snapshot.queryParams.Id),
        MrFormFieldId: parseInt(key),
        MrTemplateSectionId: templateID ? templateID.MrTemplateSectionId : undefined,
        Data: form[key],
        DateCreated: new Date(),
        CreatedByUserId: this.userDetails.UserId,
        DateLastUpdated: new Date(),
        LastUpdatedByUserId: this.userDetails.UserId,
      })
    }
      // form[key] = JSON.parse(form[key])
      // if(JSON.parse(form[key]).length === 1) {
      //   form[key] = JSON.parse(form[key])
      // }
      // }
    }
    //     MrFormFieldDataId: -2147482643
    // MrFormFieldId: 3174
    // MrPatientEncounterId: 16218
    // PatientId: 11549
    // Data: ""chief""
    // DateCreated: "2020-01-23T14:06:34.879Z"
    // CreatedByUserId: 12
    // DateLastUpdated: "2020-01-23T14:06:34.879Z"
    // LastUpdatedByUserId: 12
    // MrTemplateSectionId: 574
    console.log("payload", payload)
    payload.length > 0 && this.progressService.saveProgressNote(payload).subscribe((result) => {
      console.log('progressnote śresult :', result);
      save && this.showSuccess("Saved successfully!")
      this.savedProgress = result
    })
    // let visitObj = {
    //   PatientId : this.PatientDetail.PatientId,
    //   FacilityId: this.facility[0].PhysicianId,
    //   VisitDate: new Date,
    //   DateCreated: new Date,
    //   CreatedByUserId: this.userDetails.UserId,
    //   DateLastUpdated: new Date,
    //   LastUpdatedByUserId: this.userDetails.UserId,
    //   InsuranceVerificationDone: false,
    //   CreditCardVerificationDone: false
    // }
    // this.appointmentService.AddVisit(visitObj).subscribe(
    //   (result) => {
    //     console.log('result :', result);
    //     let appointmentObj = {}
    //     this.appointmentService.AddAppointment(appointmentObj).subscribe((result) => {

    //     })
    //   })
    // payload = payload.map(item => {
    //   if(item.Data.length = 0)
    //   return item
    // })
    // console.log("payload", payload)
  }
  createEncounter() {
    console.log('this.chiefComplaint :', this.chiefComplaint);
    let payload = {
      AppointmentId: this.appointment.AppointmentId,
      // ChiefComplaint: this.chiefComplaint,
      ConsultationDate: this.consultationDate,
      PatientId: this.PatientDetail.PatientId,
      FacilityId: this.facility.id,
      MrTemplateGroupId: parseInt(this.route.snapshot.queryParams.Id),
      IsCompleted: false,
      IsOfficeVisit: 1,
      VisitId: this.appointment.VisitId,
      PhysicianId: this.physician[0].PhysicianId,
      VisitDate: this.appointment.VisitDate,
      DateCreated: new Date,
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date,
      LastUpdatedByUserId: this.userDetails.UserId,
    }
    this.immuneService.addPatientEncounter(payload).subscribe((result) => {
      console.log('result :', result);
      this.patientEncounterId = result.MrPatientEncounterId
      this.patientEncounter = result
      // this.saveProgressNote()
    })
  }
  updateEncounter() {
    this.immuneService.updatePatientEncounter(this.patientEncounter).subscribe((result => {
      console.log("update method", result);
      this.patientEncounter = result
    }))
  }
  openPrescribe() {
    this.router.navigate(['/prescribe/1'])
  }
  showSuccess(msg: string){
    this.toaster.success(msg)
  }
}
