import {
  ComponentFactoryResolver, ComponentRef, Directive, Input, OnInit,
  ViewContainerRef
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
import { TextboxComponent } from './../textbox/textbox.component';
import { DatepickerComponent } from "../datepicker/datepicker.component";
import { DropdownlistComponent } from "../dropdownlist/dropdownlist.component";
import { ListboxComponent } from './../listbox/listbox.component';
import { SmartTextboxComponent } from "../smart-textbox/smart-textbox.component";
import { CheckboxComponent } from './../checkbox/checkbox.component';
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { LabelComponent } from './../label/label.component';
import { TextareaComponent } from './../textarea/textarea.component';
import { AddVitalsComponent } from './../../../../add-vitals/add-vitals.component';
import { AdditionalCmtComponent } from './../../../../widgets/additional-cmt/additional-cmt.component';
import { AlcoholUsageComponent } from './../../../../widgets/alcohol-usage/alcohol-usage.component';
import { AddAllergyComponent } from './../../../../add-allergy/add-allergy.component';
import { FamilyMedHistoryComponent } from './../../../../widgets/family-med-history/family-med-history.component';
import { ImmunzScheComponent } from './../../../../immunz-sche/immunz-sche.component';
import { AddInvestComponent } from './../../../../add-invest/add-invest.component';
import { PastMedicalHistoryComponent } from './../../../../past-medical-history/past-medical-history.component';
import { ReviewSystemComponent } from './../../../../widgets/review-system/review-system.component';
import { SelectIcdComponent } from './../../../../widgets/select-icd/select-icd.component';
import { AddProblemsComponent } from './../../../../add-problems/add-problems.component';
import { SktchPadComponent } from './../../../../sktch-pad/sktch-pad.component';
import { SubstanceAbuseComponent } from './../../../../widgets/substance-abuse/substance-abuse.component';
import { TobaccoUsageComponent } from './../../../../widgets/tobacco-usage/tobacco-usage.component';
import { VitalsComponent } from './../../../../graphs/vitals/vitals.component';
import { SubSectionComponent } from './../sub-section/sub-section.component';
import { AllergiesComponent } from "../../../../allergies/allergies.component";
import { SelectPatientEducationComponent } from './../../../../widgets/select-patient-education/select-patient-education.component';
import { PatientEducationComponent } from '../../../../../chart/patient-education/patient-education.component'

const componentMapper = {
  "Text Box": TextboxComponent,
  "Small Text Box": TextboxComponent,
  "DatePicker": DatepickerComponent,
  "Dropdown List": DropdownlistComponent,
  "Multi Select List Box": ListboxComponent,
  "Smart Text Box": SmartTextboxComponent,
  "Check Box Group": CheckboxComponent,
  "Check Box": CheckboxComponent,
  "Radio Button Group": RadiobuttonComponent,
  "Label": LabelComponent,
  "Sections": SubSectionComponent,
  "Multiline Text Box": TextareaComponent,
  "Physician Additional Comments": AdditionalCmtComponent,
  "Alcohol Usage": AlcoholUsageComponent,
  "Allergies": AllergiesComponent,
  "Family Medical History": FamilyMedHistoryComponent,
  "Immunizations & Injections": ImmunzScheComponent,
  "Investigations": AddInvestComponent,
  invenstigationresult: AddInvestComponent,
  "Past Medical History": PastMedicalHistoryComponent,
  pastresults: AddInvestComponent,
  "Patient Education Resources": SelectPatientEducationComponent,
  "Review of Systems": ReviewSystemComponent,
  "Search/Select CPT4": AddProblemsComponent,
  "Search/Select ICD9": SelectIcdComponent,
  "Sketch Pad": SktchPadComponent,
  "Substance Abuse": SubstanceAbuseComponent,
  "Tobacco Usage": TobaccoUsageComponent,
   Vitals: AddVitalsComponent,
};
@Directive({
  selector: '[appDynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef) {}

  ngOnInit() {
    // console.log('this.componentRef.instance',this.field)
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
      );
      this.componentRef = this.container.createComponent(factory);
      // console.log('this.componentRef.instance',this.componentRef.instance);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
    if (this.field.type === 'Vitals') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Allergies') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Past Medical History') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Patient Education Resources') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Investigations') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Immunizations & Injections') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Physician Additional Comments') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Search/Select CPT4') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Family Medical History') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    } else if (this.field.type === 'Substance Abuse' || 'Tobacco Usage' || 'Alcohol Usage') {
      this.componentRef.instance.PEValueObj = this.field.collections;
    }
  }

}
