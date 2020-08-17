import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
// import { CalendarModule } from 'angular-calendar';
import { AllChartPtComponent } from './all-chart-pt/all-chart-pt.component';
import { SktchPadComponent } from './sktch-pad/sktch-pad.component';
import { MsgComponent } from './msg/msg.component';
import { LettersComponent } from './letters/letters.component';
import { DocumentsComponent } from './documents/documents.component';
import { GraphsComponent } from './graphs/graphs.component';
import { AddVitalsComponent } from './add-vitals/add-vitals.component';
import { AddInvestComponent } from './add-invest/add-invest.component';
import { ImmunzScheComponent } from './immunz-sche/immunz-sche.component';
import { AddAllergyComponent } from './add-allergy/add-allergy.component';
import { AddPmhComponent } from './add-pmh/add-pmh.component';
// import { AddProblemsComponent } from './add-problems/add-problems.component';
// import { PrescribeComponent } from './prescribe/prescribe.component';
import { ProgressnoteComponent } from './progressnote/progressnote.component';
import { EdtPtDetailsComponent } from './edt-pt-details/edt-pt-details.component';
import { FindpatComponent } from './findpat/findpat.component';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PickListModule } from 'primeng/picklist';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule, ListboxModule, TabViewModule, PaginatorModule, MultiSelectModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { SharedModule } from '../shared.module';
import { AddLetterComponent } from './letters/add-letter/add-letter.component';
// import { DoughnutChartComponent, PieChartComponent, BarChartComponent } from 'angular-d3-charts';
import { OrderListModule } from 'primeng/orderlist';

import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { PatientWeightChartComponent } from './graphs/patient-weight-chart/patient-weight-chart.component';
import { PatientHeightChartComponent } from './graphs/patient-height-chart/patient-height-chart.component';
import { BloodPressureChartComponent } from './graphs/blood-pressure-chart/blood-pressure-chart.component';
import { BmiChartComponent } from './graphs/bmi-chart/bmi-chart.component';
import { LabResultsChartComponent } from './graphs/lab-results-chart/lab-results-chart.component';
import { VitalsComponent } from './graphs/vitals/vitals.component';
import { EditImmunzComponent } from './immunz-sche/edit-immunz/edit-immunz.component';
import { ImmunzBatchComponent } from './immunz-sche/immunz-batch/immunz-batch.component';
import { ChartHomeComponent } from './chart-home/chart-home.component';
import { PatientEducationComponent } from './patient-education/patient-education.component';
import { MedicationsComponent } from './medications/medications.component';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { ChartComponent } from './chart-widget.component';
import { DynamicComponentService } from './dynamic-component.service';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { PastMedicalHistoryComponent } from './past-medical-history/past-medical-history.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { WidgetHeaderComponent } from './widget-header.component';
import { ReviewScanComponent } from './documents/review-scan/review-scan.component';
import { AccordionModule } from 'primeng/accordion';
import { DocumentActionsComponent } from './documents/document-actions/document-actions.component';
// import { ComparemodalComponent } from './medications/comparemodal/comparemodal.component';
// import { AllergiesModalComponent } from './allergies/allergies-modal/allergies-modal.component'
// import { DocumentActionsComponent } from './documents/document-actions/document-actions.component';
import { ComparemodalComponent } from './medications/comparemodal/comparemodal.component'
import { SearchAllergyComponent } from './add-allergy/search-allergy/search-allergy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DrawOnImageComponent } from './sktch-pad/sketchpad/draw-on-image.component';
import { SketchpadModalComponent } from './sktch-pad/sketchpad-modal/sketchpad-modal.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PanelModule } from 'primeng/panel';
import {SplitButtonModule} from 'primeng/splitbutton';

// fusion charts starts
import { FusionChartsModule } from 'angular-fusioncharts';
// import { SharedModule } from '../shared.module';
// Import FusionCharts library
import * as FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/viz/column2d';
// Load FusionCharts Individual Charts
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as TimeSeries from 'fusioncharts/fusioncharts.timeseries';
// import { DeleteLetterComponent } from './letters/delete-letter/delete-letter.component';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as Ocean from 'fusioncharts/themes/fusioncharts.theme.ocean';
import * as Fint from 'fusioncharts/themes/fusioncharts.theme.fint';
import * as Candy from 'fusioncharts/themes/fusioncharts.theme.candy';
import * as Gammel from 'fusioncharts/themes/fusioncharts.theme.gammel';
import * as Zune from 'fusioncharts/themes/fusioncharts.theme.zune';
// import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as Carbon from 'fusioncharts/themes/fusioncharts.theme.carbon';
import { HeadCircumferenceComponent } from './graphs/head-circumference/head-circumference.component';
import { AllergiesModalComponent } from './allergies/allergies-modal/allergies-modal.component';
import { ConsultationTemplateComponent } from './progressnote/consultation-template/consultation-template.component';
import { TemplateEditorComponent } from './progressnote/template-editor/template-editor.component';
import { TemplatemodalComponent } from './progressnote/template-editor/templatemodal/templatemodal.component';
import { SelectIcdComponent } from './widgets/select-icd/select-icd.component';
import { AlcoholUsageComponent } from './widgets/alcohol-usage/alcohol-usage.component';
import { TobaccoUsageComponent } from './widgets/tobacco-usage/tobacco-usage.component';
import { SubstanceAbuseComponent } from './widgets/substance-abuse/substance-abuse.component';
import { SelectPatientEducationComponent } from './widgets/select-patient-education/select-patient-education.component';
import { AdditionalCmtComponent } from './widgets/additional-cmt/additional-cmt.component';
import { HistoryofIllnessComponent } from './widgets/historyof-illness/historyof-illness.component';
import { ReviewSystemComponent } from './widgets/review-system/review-system.component';
import { FamilyMedHistoryComponent } from './widgets/family-med-history/family-med-history.component';
import { ImmunizationsComponent } from './immunizations/immunizations.component';
import { LabsComponent } from './labs/labs.component';
import { VitalWidgetComponent } from './vital-widget/vital-widget.component';
import { DropdownlistComponent } from './progressnote/template-editor/fields/dropdownlist/dropdownlist.component';
import { TextboxComponent } from './progressnote/template-editor/fields/textbox/textbox.component';
import { DatepickerComponent } from './progressnote/template-editor/fields/datepicker/datepicker.component';
import { TextareaComponent } from './progressnote/template-editor/fields/textarea/textarea.component';
import { RadiobuttonComponent } from './progressnote/template-editor/fields/radiobutton/radiobutton.component';
import { CheckboxComponent } from './progressnote/template-editor/fields/checkbox/checkbox.component';
import { ListboxComponent } from './progressnote/template-editor/fields/listbox/listbox.component';
import { SmartTextboxComponent } from './progressnote/template-editor/fields/smart-textbox/smart-textbox.component';
import { LabelComponent } from './progressnote/template-editor/fields/label/label.component';
import { DynamicFieldDirective } from './progressnote/template-editor/fields/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './progressnote/template-editor/fields/dynamic-form/dynamic-form.component';
import { SubSectionComponent } from './progressnote/template-editor/fields/sub-section/sub-section.component';
// import { IcdSearchmodalComponent } from './widgets/select-icd/icd-searchmodal/icd-searchmodal.component';
import { ViewPrevousResComponent } from './widgets/select-patient-education/view-prevous-res/view-prevous-res.component';
import { AddProblemsComponent } from './add-problems/add-problems.component';
import { QuillModule } from 'ngx-quill';
import { DwtComponent } from './dwt/dwt.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { SmartnoteTemplateComponent } from './progressnote/template-editor/fields/smart-textbox/smartnote-template/smartnote-template.component'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReportmodalComponent } from './progressnote/template-editor/reportmodal/reportmodal.component';
import { PatientPortalComponent } from './chart-home/patient-portal/patient-portal.component';
import { EditorViewComponent } from './progressnote/template-editor/editor-view/editor-view.component';
import { LetterEditorComponent } from './letters/letter-editor/letter-editor.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { SmartTextModalComponent } from './progressnote/template-editor/fields/smart-textbox/smart-text-modal/smart-text-modal.component';

// import { SafePipe } from  '../../services/safe.pipe';
// './services/safe.pipe';
// for pdf view
// import { SelectCptCodeComponent } from './select-cpt-code/select-cpt-code.component';

// Use fcRoot function to inject FusionCharts library, and the modules you want to use
FusionChartsModule.fcRoot(
  FusionCharts,
  Charts,
  Ocean,
  Fint,
  Candy,
  Gammel,
  Zune,
  Carbon,
  FusionTheme
)
// fusion charts ends



export const routes = [
  // { path: '', redirectTo: 'findpatient', pathMatch: 'full' },
  { path: '', component: ChartHomeComponent, data: { breadcrumb: 'Charts' } },
  { path: 'charts', component: ChartHomeComponent, data: { breadcrumb: 'Charts' } },
  { path: 'all-chart-pt', component: AllChartPtComponent, data: { breadcrumb: 'All Charts Print' } },
  { path: 'sktch-pad', component: SktchPadComponent, data: { breadcrumb: 'Sketch Pad' } },
  { path: 'msg', component: MsgComponent, data: { breadcrumb: 'Messages' } },
  { path: 'letters', component: LettersComponent, data: { breadcrumb: 'Letters' } },
  { path: 'add-letter', component: AddLetterComponent, data: { breadcrumb: 'Add Letters' } },
  { path: 'documents', component: DocumentsComponent, data: { breadcrumb: 'Documents' } },
  { path: 'review-scan', component: ReviewScanComponent, data: { breadcrumb: 'review scan' } },
  { path: 'graphs', component: GraphsComponent, data: { breadcrumb: 'Graphs' } },
  { path: 'immunz-sche', component: ImmunzScheComponent, data: { breadcrumb: 'Immunization Schedule' } },
  { path: 'add-allergy', component: AddAllergyComponent, data: { breadcrumb: 'Add Allergy' } },
  { path: 'add-pmh', component: AddPmhComponent, data: { breadcrumb: 'Add PMH' } },
  { path: 'add-problems', component: AddProblemsComponent, data: { breadcrumb: 'Add Problem' } },
  // { path: 'prescribe/:id', component: PrescribeComponent, data: { breadcrumb: 'Prescribe' } },
  { path: 'progressnote', component: ProgressnoteComponent, data: { breadcrumb: 'Progress Note' } },
  { path: 'edt-pt-details', component: EdtPtDetailsComponent, data: { breadcrumb: 'Edit Patient Details' } },
  { path: 'findpatient', component: FindpatComponent, data: { breadcrumb: 'Find Patient' } },
  { path: 'add-invest', component: AddInvestComponent, data: { breadcrumb: 'Add Investigation' } },
  { path: 'add-vitals', component: AddVitalsComponent, data: { breadcrumb: 'Add Vitals' } },
  { path: 'hop-illness', component: HistoryofIllnessComponent, data: { breadcrumb: 'Add Vitals' } },
  { path: 'template-editor', component: TemplateEditorComponent },
  { path: "selicd", component: SelectIcdComponent }
];

@NgModule({
  imports: [
    CKEditorModule,
    SplitButtonModule,
    NgbModule,
    CommonModule,
    OrderListModule,
    CalendarModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    FusionChartsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule,
    CardModule,
    SharedModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    PickListModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    TableModule,
    TooltipModule,
    ListboxModule,
    TabViewModule,
    InputMaskModule,
    AutoCompleteModule,
    FileUploadModule,
    GridsterModule,
    PaginatorModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelModule,
    AccordionModule,
    DynamicModule.withComponents([
      PatientEducationComponent,
      MedicationsComponent,
      PastMedicalHistoryComponent,
      AllergiesComponent,
      ProgressnoteComponent,
      ProblemListComponent,
      ImmunizationsComponent,
      LabsComponent,
      VitalWidgetComponent
    ]),
    QuillModule,
    TabMenuModule,
    PdfViewerModule
  ],
  declarations: [
    AllChartPtComponent,
    SktchPadComponent,
    MsgComponent,
    LettersComponent,
    DocumentsComponent,
    GraphsComponent,
    AddVitalsComponent,
    // AddProblemsComponent,
    AddInvestComponent,
    ImmunzScheComponent,
    AddAllergyComponent,
    AddPmhComponent,
    // PrescribeComponent,
    ProgressnoteComponent,
    EdtPtDetailsComponent,
    FindpatComponent,
    AddLetterComponent,
    PatientWeightChartComponent,
    PatientHeightChartComponent,
    BloodPressureChartComponent,
    BmiChartComponent,
    LabResultsChartComponent,
    VitalsComponent,
    EditImmunzComponent,
    ImmunzBatchComponent,
    ChartHomeComponent,
    PatientEducationComponent,
    MedicationsComponent,
    ChartComponent,
    ProblemListComponent,
    PastMedicalHistoryComponent,
    AllergiesComponent,
    // WidgetHeaderComponent,
    ReviewScanComponent,
    SearchAllergyComponent,
    DrawOnImageComponent,
    SketchpadModalComponent,
    // SafePipe,
    // DeleteLetterComponent,
    HeadCircumferenceComponent,
    AllergiesModalComponent,
    TemplateEditorComponent,
    TemplatemodalComponent,
    // SelectIcdComponent,
    AlcoholUsageComponent,
    TobaccoUsageComponent,
    SubstanceAbuseComponent,
    SelectPatientEducationComponent,
    AdditionalCmtComponent,
    HistoryofIllnessComponent,
    ReviewSystemComponent,
    FamilyMedHistoryComponent,
    ImmunizationsComponent,
    LabsComponent,
    VitalWidgetComponent,
    DropdownlistComponent,
    TextboxComponent,
    DatepickerComponent,
    TextareaComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    ListboxComponent,
    SmartTextboxComponent,
    LabelComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    SubSectionComponent,
    ViewPrevousResComponent,
    // IcdSearchmodalComponent,
    DwtComponent,
    SmartnoteTemplateComponent,
    // ReportmodalComponent,
    PatientPortalComponent,
    EditorViewComponent,
    LetterEditorComponent,
    SmartTextModalComponent,
    // SelectCptCodeComponent
    // ConsultationTemplateComponent
    // ProblemListModalComponent,
    // DocumentActionsComponent,
    // AllergiesModalComponent,
    // DocumentActionsComponent,
    // ComparemodalComponent,
  ],
  exports: [
    FindpatComponent,
    AutoCompleteModule,
    SearchAllergyComponent,
    DynamicFormComponent,
    // SafePipe
  ],
  entryComponents: [
    SearchAllergyComponent,
    SketchpadModalComponent,
    EditImmunzComponent,
    ImmunzBatchComponent,
    AllergiesModalComponent,
    TemplatemodalComponent,
    TextboxComponent,
    DatepickerComponent,
    TextareaComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    ListboxComponent,
    SmartTextboxComponent,
    LabelComponent,
    DropdownlistComponent,
    AddVitalsComponent,
    AdditionalCmtComponent,
    AlcoholUsageComponent,
    AddAllergyComponent,
    FamilyMedHistoryComponent,
    ImmunzScheComponent,
    AddInvestComponent,
    PastMedicalHistoryComponent,
    PatientEducationComponent,
    ViewPrevousResComponent,
    ReviewSystemComponent,
    // SelectIcdComponent,
    SubstanceAbuseComponent,
    SktchPadComponent,
    TobaccoUsageComponent,
    SubSectionComponent,
    AddAllergyComponent,
    // IcdSearchmodalComponent,
    SelectPatientEducationComponent,
    DrawOnImageComponent,
    SmartnoteTemplateComponent,
    // ReportmodalComponent,
    PatientPortalComponent,
    // ConsultationTemplateComponent,   
    LetterEditorComponent,
    SmartTextModalComponent
    // ComparemodalComponent
  ],
  bootstrap: [],
  providers: [DynamicComponentService]
})

export class ChartModule { }
