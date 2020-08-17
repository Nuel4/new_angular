import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { DirectivesModule } from '../../../theme/directives/directives.module';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {CalendarModule} from 'primeng/calendar';
import { PatientManagementComponent } from './../patient-management/patient-management.component'
import { RegisterpatientComponent } from './../patient-management/registerpatient/registerpatient.component';
import { OtherinformationComponent } from './../patient-management/registerpatient/otherinformation/otherinformation.component';
import { MessagesComponent } from './../patient-management/registerpatient/messages/messages.component';
import { FilesComponent } from './../patient-management/registerpatient/files/files.component';
import { ConsentsComponent } from './../patient-management/registerpatient/consents/consents.component';
import { PharmaciesComponent } from './../patient-management/registerpatient/pharmacies/pharmacies.component';
import { FieldErrorDisplayComponent } from './../field-error-display/field-error-display.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
// import {DetailsModalComponent} from '../calendar/add-appointment/details-modal/details-modal.component'


import {
  RadioButtonModule,
  KeyFilterModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  ScheduleModule,
  TabViewModule,
  MessageModule,
  CheckboxModule,
  InputTextareaModule,
  FieldsetModule,
  InputMaskModule,
  PanelModule,
  AccordionModule,
  TooltipModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { PatientgurantordetailsComponent } from './registerpatient/patientdetails/patientgurantordetails/patientgurantordetails.component';
import { InsuranceComponent } from './registerpatient/insurance/insurance.component';
import { PrimaryInsuranceComponent } from './registerpatient/insurance/primary-insurance/primary-insurance.component';
import { SecondaryInsuranceComponent } from './registerpatient/insurance/secondary-insurance/secondary-insurance.component';
import { TertiaryInsuranceComponent } from './registerpatient/insurance/tertiary-insurance/tertiary-insurance.component';
import { PatientdetailsComponent } from './registerpatient/patientdetails/patientdetails.component';
import {FileUploadModule} from 'primeng/fileupload';
import { GuarantormodalComponent } from './registerpatient/guarantormodal/guarantormodal.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared.module';
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component';
import { UploadfilesComponent } from './registerpatient/files/uploadfiles/uploadfiles.component';
import { PatientTabviewComponent } from './patient-tabview/patient-tabview.component';
import { ViewhistorymodalComponent } from './registerpatient/insurance/viewhistorymodal/viewhistorymodal.component';

export const routes = [
    { path: '', component: PatientManagementComponent, data: { breadcrumb: 'Patient Management' } },
    { path: 'patientgurantor', component: PatientgurantordetailsComponent},
    { path: 'registerpatient/:selectedPatientId', component: RegisterpatientComponent, data: { breadcrumb: 'Edit Patient' } },
    { path: 'patientdetails', compomnent: PatientdetailsComponent},
    
];

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    NgxDatatableModule,
    DirectivesModule,
    ReactiveFormsModule,
    RadioButtonModule,
    KeyFilterModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ScheduleModule,
    TabViewModule,
    HttpClientModule,
    MessageModule,
    CheckboxModule,
    InputTextareaModule,
    FieldsetModule,
    InputMaskModule,
    PanelModule,
    TableModule,
    AutoCompleteModule,
    AccordionModule,
    FileUploadModule,
    SharedModule,
    TooltipModule,
    // ModelviewComponent,
    NgbModule.forRoot()
    
  ],
  declarations: [
    PatientManagementComponent,
    RegisterpatientComponent,
    PatientdetailsComponent,
    OtherinformationComponent,
    ConsentsComponent,
    FilesComponent,
    MessagesComponent,
    PharmaciesComponent,
    FieldErrorDisplayComponent,
    PatientgurantordetailsComponent,
    InsuranceComponent,
    PrimaryInsuranceComponent,
    SecondaryInsuranceComponent,
    TertiaryInsuranceComponent,
    GuarantormodalComponent,
    UploadfilesComponent,
    ViewhistorymodalComponent,
    // DetailsModalComponent
    // PatientTabviewComponent,
    // ModelviewComponent
   
  ],
  entryComponents: [
    GuarantormodalComponent,
    ModelviewComponent,
    UploadfilesComponent,
    ViewhistorymodalComponent
    // DetailsModalComponent
  ]
})
export class PatientManagementModule {}
