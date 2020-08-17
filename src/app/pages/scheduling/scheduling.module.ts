import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { FindpatientComponent } from './findpatient/findpatient.component';
import { RegisterpatientComponent } from './registerpatient/registerpatient.component';
// import { ChkavlComponent } from './chkavl/chkavl.component';
import { FormsComponent } from '../workspace/forms/forms.component';
import { ChkavlComponent } from '../workspace/chkavl/chkavl.component';
import { UserscheduleComponent } from '../workspace/userschedule/userschedule.component';
import { VAllAppointmentsComponent } from '../workspace/v-all-appointments/v-all-appointments.component';
import { VChartsComponent } from '../workspace/v-charts/v-charts.component';
import { RegisterFilesComponent } from './registerpatient/register-files/register-files.component';
import { RegisterConsentsComponent } from './registerpatient/register-consents/register-consents.component';
import { RegisterInsuranceComponent } from './registerpatient/register-insurance/register-insurance.component';
import { RegisterPharmaciesComponent } from './registerpatient/register-pharmacies/register-pharmacies.component';
import { RegisterDetailsComponent } from './registerpatient/register-details/register-details.component';
import { RegisterOthersComponent } from './registerpatient/register-others/register-others.component';
import { TabViewModule } from 'primeng/tabview';
import { RegisterMessagesComponent } from './registerpatient/register-messages/register-messages.component';
import { ErrorFieldDisplayComponent } from './error-field-display/error-field-display.component';
import { RefPhyComponent } from './ref-phy/ref-phy.component';
import { SchedulingHomeComponent } from './scheduling-home/scheduling-home.component'
import { DropdownModule, CardModule, RadioButtonModule, KeyFilterModule, DialogModule, InputTextModule, ScheduleModule, CheckboxModule, MessagesModule, FieldsetModule, InputMaskModule, FileUploadModule, AutoCompleteModule, InputTextareaModule, TooltipModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { GridsterModule } from 'angular-gridster2';

import { CalendarModule } from 'primeng/calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddAppointmentComponent } from '../workspace/calendar/add-appointment/add-appointment.component';
import { DatepickerPopupComponent } from '../workspace/calendar/datepicker-popup/datepicker-popup.component';
import { SharedModule } from '../shared.module';
import { AvailabilityExceptionComponent } from '../workspace/calendar/availability-exception/availability-exception.component';
import { ReferringPhysicianListComponent } from '../workspace/referring-physician/referring-physician-list.component';
import { ReferringPhysicianDetailsComponent } from '../workspace/referring-physician/referring-physician-details/referring-physician-details.component';

// import { CalendarModule } from 'angular-calendar';

export const routes = [
  // { path: '', redirectTo: 'findpatient', pathMatch: 'full' },
  { path: '', component: SchedulingHomeComponent, data: { breadcrumb: 'Scheduling' } },
  {
    path: 'patientmanagement', loadChildren: 'app/pages/workspace/patient-management/patient-management.module#PatientManagementModule',
    data: { breadcrumb: 'Patient Management' }
  },
  // {
  //   path: 'chkavl', loadChildren: 'app/pages/workspace/chkavl',
  //   data: { breadcrumb: 'Check Availability' }
  // },
  // { path: 'findpatient', component: FindpatientComponent, data: { breadcrumb: 'Find Patient' } },
  // { path: 'registerpatient', component: RegisterpatientComponent, data: { breadcrumb: 'Register Patient' } },
  { path: 'chkavl', component: ChkavlComponent, data: { breadcrumb: 'Check Availability' } },
  { path: 'forms', component: FormsComponent, data: { breadcrumb: 'Forms' } },
  { path: 'userschedule', component: UserscheduleComponent, data: { breadcrumb: 'User Schedule' } },
  { path: 'v-all-appointments', component: VAllAppointmentsComponent, data: { breadcrumb: 'View All Appointments' } },
  { path: 'v-charts', component: VChartsComponent, data: { breadcrumb: 'View Charts' } },
  { path: 'referringphysician', component: ReferringPhysicianListComponent, data: { breadcrumb: 'Referring Physician' } },
  {
    path: 'referringphysiciandetails/:referringphysicianid', component: ReferringPhysicianDetailsComponent,
    data: { breadcrumb: 'Referring Physician Details' }
  },
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule,
    TabViewModule,
    DropdownModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    CardModule,
    TableModule,
    NgxDatatableModule,
    DirectivesModule,
    ReactiveFormsModule,
    RadioButtonModule,
    KeyFilterModule,
    // DialogModule,
    DropdownModule,
    InputTextModule,
    ScheduleModule,
    TabViewModule,
    HttpClientModule,
    CheckboxModule,
    MessagesModule,
    FieldsetModule,
    GridsterModule,
    InputMaskModule,
    FileUploadModule,
    AutoCompleteModule,
    InputTextareaModule,
    TooltipModule,
    NgbModule.forRoot(),
  ],
  declarations: [
    FindpatientComponent,
    RegisterpatientComponent,
    // ChkavlComponent,
    // FormsComponent,
    // UserscheduleComponent,
    // VAllAppointmentsComponent,
    // VChartsComponent,
    RefPhyComponent,
    RegisterFilesComponent,
    RegisterConsentsComponent,
    RegisterInsuranceComponent,
    RegisterPharmaciesComponent,
    RegisterDetailsComponent,
    RegisterOthersComponent,
    RegisterMessagesComponent,
    ErrorFieldDisplayComponent,
    SchedulingHomeComponent,
  ],
  entryComponents: [AddAppointmentComponent,DatepickerPopupComponent],
})

export class SchedulingModule { }
