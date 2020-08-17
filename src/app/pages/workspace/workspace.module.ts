import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { WorkspaceHomeComponent } from './workspace-home.component'
import { PatientManagementModule } from './patient-management/patient-management.module'
import { RegisterpatientComponent } from './patient-management/registerpatient/registerpatient.component';
import { ChkavlComponent } from './chkavl/chkavl.component';
import { FormsComponent } from './forms/forms.component';
import { FileuploadComponent } from '../../theme/components/fileupload/fileupload.component';
import { UserscheduleComponent } from './userschedule/userschedule.component';
import { VAllAppointmentsComponent } from './v-all-appointments/v-all-appointments.component';
import { VChartsComponent } from './v-charts/v-charts.component';
import { ReferringPhysicianListComponent } from './referring-physician/referring-physician-list.component';
import { ReferringPhysicianDetailsComponent } from './referring-physician/referring-physician-details/referring-physician-details.component';
import { PatientgurantordetailsComponent } from './patient-management/registerpatient/patientdetails/patientgurantordetails/patientgurantordetails.component';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { GridsterModule } from 'angular-gridster2';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { ListboxModule } from 'primeng/listbox';
import { PickListModule } from 'primeng/picklist';
import { TooltipModule } from 'primeng/tooltip';
import {PostsmodalsComponent} from './alerts/postsmodals/postsmodals.component'

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
  Fieldset,
  FieldsetModule,
  InputTextareaModule,
  SelectButtonModule

} from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import { Message } from '../../../../node_modules/@angular/compiler/src/i18n/i18n_ast';

import { MessagesComponent } from './patient-management/registerpatient/messages/messages.component';
import { DashboardWidgetComponent } from './workspace-widget.component';
import { DynamicComponentService } from './dynamic-component.service';
import { DynamicModule } from 'ng-dynamic-component';
import { WidgetHeaderComponent } from './widget-header.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';
import { AlertsComponent } from './alerts/alerts.component';
import { NoticeboardmodalComponent } from '../workspace/noticeboard/noticeboardmodal/noticeboardmodal.component';
import { MypostsComponent } from './myposts/myposts.component';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MypostmodalComponent } from './myposts/mypostmodal/mypostmodal.component';
import { AlertsmodalsComponent } from './alerts/alertsmodals/alertsmodals.component';
import { EditmodalComponent } from './alerts/editmodal/editmodal.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AddAppointmentComponent } from './calendar/add-appointment/add-appointment.component';
import { SharedModule } from '../shared.module';
import { RefPhyDeleteModalComponent } from './referring-physician/ref-phy-delete-modal/delete-modal.component';
import { FormsDeleteModalComponent } from './forms/forms-delete-modal/forms-delete-modal.component';
import { DatepickerPopupComponent } from './calendar/datepicker-popup/datepicker-popup.component';
import { AvailabilityExceptionComponent } from './calendar/availability-exception/availability-exception.component';
import { DetailsModalComponent } from './calendar/add-appointment/details-modal/details-modal.component';
// import { ModelviewComponent } from '../../theme/components/modelview/modelview.component'
// import { PostsmodalsComponent } from './alerts/postsmodals/postsmodals.component';


export const routes = [
  { path: '', component: WorkspaceHomeComponent, data: { breadcrumb: 'Workspace' } },
  {
    path: 'patientmanagement', loadChildren: 'app/pages/workspace/patient-management/patient-management.module#PatientManagementModule',
    data: { breadcrumb: 'Patient Management' }
  },
  { path: 'chkavl', component: ChkavlComponent, data: { breadcrumb: 'Check Availability' } },
  { path: 'forms', component: FormsComponent, data: { breadcrumb: 'Forms' } },
  { path: 'userschedule', component: UserscheduleComponent, data: { breadcrumb: 'User Schedule' } },
  { path: 'v-all-appointments', component: VAllAppointmentsComponent, data: { breadcrumb: 'View All Appointments' } },
  { path: 'calendar', component: CalendarComponent, data: { breadcrumb: 'View All Appointments' } },
  { path: 'noticeboard', component: NoticeboardComponent, data: { breadcrumb: 'Notice Board' } },
  { path: 'myposts', component: MypostsComponent, data: { breadcrumb: 'My Posts' } },
  // {path: 'noticeboard/:NBValue', component: NoticeboardmodalComponent, data: {breadcrumb: 'Notice Board Modal'} },
  { path: 'alerts', component: AlertsComponent, data: { breadcrumb: 'Alerts' } },
  { path: 'v-charts', component: VChartsComponent, data: { breadcrumb: 'View Charts' } },
  { path: 'referringphysician', component: ReferringPhysicianListComponent, data: { breadcrumb: 'Referring Physician' } },
  {
    path: 'referringphysiciandetails/:referringphysicianid', component: ReferringPhysicianDetailsComponent,
    data: { breadcrumb: 'Referring Physician Details' }
  },
  { path: 'exception', component: WorkspaceHomeComponent,  data: { breadcrumb: 'Availability Exception' }}
];

@NgModule({
  imports: [
    SharedModule,
    // SelectButtonModule,
    CommonModule,
    CalendarModule,
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
    MessageModule,
    FieldsetModule,
    GridsterModule,
    InputMaskModule,
    FileUploadModule,
    AutoCompleteModule,
    InputTextareaModule,
    TooltipModule,
    NgbModule.forRoot(),
    DynamicModule.withComponents([
      // CalendarComponent,
      UserscheduleComponent,
      AlertsmodalsComponent,
      MypostsComponent,
    ]),
    PaginatorModule,
    ListboxModule,
    PickListModule,

  ],
  declarations: [
    WorkspaceHomeComponent,
    // ChkavlComponent,
    // FormsComponent,
    // UserscheduleComponent,
    // VAllAppointmentsComponent,
    // CalendarComponent,
    // AddAppointmentComponent,
    // VChartsComponent,
    // FileuploadComponent,
    // ReferringPhysicianListComponent,
    // ReferringPhysicianDetailsComponent,
    DashboardWidgetComponent,
    // WidgetHeaderComponent,
    NoticeboardComponent,
    AlertsComponent,
    // NoticeboardmodalComponent,
    MypostsComponent,
    MypostmodalComponent,
    AlertsmodalsComponent,
    EditmodalComponent,
    RefPhyDeleteModalComponent,
    FormsDeleteModalComponent,
    DetailsModalComponent,
    PostsmodalsComponent,
    // AvailabilityExceptionComponent,
    // DatepickerPopupComponent,
    // ModelviewComponent,
    // PostsmodalsComponent,
  ],
  exports: [
    // ReferringPhysicianListComponent,
    // FormsComponent,
    // AvailabilityExceptionComponent,
    // AddAppointmentComponent,
    DatepickerPopupComponent
    // ModelviewComponent
  ],
  entryComponents: [
    // NoticeboardmodalComponent,
    PostsmodalsComponent,
    AlertsmodalsComponent,
    EditmodalComponent,
    MypostmodalComponent,
    // CalendarComponent,
    // AddAppointmentComponent,
    // AvailabilityExceptionComponent,
    RefPhyDeleteModalComponent,
    FormsDeleteModalComponent,
    DatepickerPopupComponent,
    DetailsModalComponent
    // ModelviewComponent
    // PostsmodalsComponent
  ],
  providers: [
    DynamicComponentService,
    NgbActiveModal
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WorkspaceModule { }
