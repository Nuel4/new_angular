import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
// import { CalendarModule } from 'angular-calendar';
import { CustomPreloading} from './custom-preloading'
import { NgProgressModule } from '@ngx-progressbar/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

// import SimpleCrypto from "simple-crypto-js";

import { routing } from './app.routing';
import { AppSettings } from './app.settings';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { HeaderComponent } from './theme/components/header/header.component';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { GlobalState, HttpWrapperService } from './core';
import { AuthenticationInterceptor, AuthenticationStore, AuthenticationGuard } from './authentication'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';
import {ListboxModule} from 'primeng/listbox'
import {TooltipModule} from 'primeng/tooltip';
// Broadcaster
import { Broadcaster } from './broadcast/broadcaster';
import { ModelviewComponent } from './theme/components/modelview/modelview.component';
// import { AppointmentdetailsComponent } from './theme/components/applications/waitingroom/appointmentdetails/appointmentdetails.component';
import { AppointmentlistComponent } from './theme/components/applications/waitingroom/appointmentlist/appointmentlist.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { DatePipe, registerLocaleData } from '@angular/common'
import {NgbModule, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import {WaitingroomComponent} from './theme/components/applications/waitingroom/waitingroom.component'
import {
  KeyFilterModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  ScheduleModule,
  TabViewModule,
  MessageModule,
  CheckboxModule,
  CalendarModule,
  DataTableModule,
  InputTextareaModule,
  AccordionModule,
  SelectButtonModule,
 } from 'primeng/primeng';
 import {TableModule} from 'primeng/table';
//  import {AutoCompleteModule} from 'primeng/autocomplete';
// import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import en from '@angular/common/locales/en';
import {RadioButtonModule} from 'primeng/radiobutton';
import { BillersNoteComponent } from './theme/components/applications/waitingroom/billers-note/billers-note.component';
import { EligibilityverificationComponent } from './theme/components/applications/waitingroom/eligibilityverification/eligibilityverification.component';
import { PatientmanagementService } from './services/workspace/patient-management.service';
import { PatientreminderComponent } from './theme/components/applications/patientaction/patientreminder/patientreminder.component';
import { PatientSummaryComponent } from './theme/components/applications/patient-summary/patient-summary.component';
import { ProgressnoteComponent } from './pages/chart/progressnote/progressnote.component';
import { ConsultationTemplateComponent } from './pages/chart/progressnote/consultation-template/consultation-template.component';
import { InternetStatusModalComponent } from './internet-status-modal/internet-status-modal.component';
import { ChargeslipsComponent } from './chargeslips/chargeslips.component';
import { CptDisclaimerComponent } from './pages/login/cpt-disclaimer/cpt-disclaimer.component';
import { AddAppointmentComponent } from './pages/workspace/calendar/add-appointment/add-appointment.component';
import { AvailabilityExceptionComponent } from './pages/workspace/calendar/availability-exception/availability-exception.component';
import { PatientTabviewComponent } from './pages/workspace/patient-management/patient-tabview/patient-tabview.component';
import {CarouselModule} from 'primeng/carousel';
import { PrescribeComponent} from './pages/chart/prescribe/prescribe.component'
registerLocaleData(en);
import { UserIdleModule } from 'angular-user-idle';
import {Injector} from '@angular/core';

export let InjectorInstance: Injector;

// Application wide providers
const APP_PROVIDERS = [
  AppSettings,
  GlobalState,
  AuthenticationStore,
  HttpWrapperService,
  AuthenticationInterceptor,
  AuthenticationGuard,
  Broadcaster
];

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    PrescribeComponent,
    // AppointmentdetailsComponent,
    AppointmentlistComponent,
    PatientreminderComponent,
    PatientSummaryComponent,
    ConsultationTemplateComponent,
    InternetStatusModalComponent,
    ChargeslipsComponent,
    CptDisclaimerComponent,
    WaitingroomComponent,
    // AddAppointmentComponent,
    // AvailabilityExceptionComponent,
    // PatientTabviewComponent
    // ProgressnoteComponent
    // PatientactionComponent,
    // EligibilityverificationComponent,
    // BillersNoteComponent,
    // WaitingroommodalComponent,    


  // HeaderComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    LoadingBarHttpClientModule,
    CalendarModule,
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
    TableModule,
    NgxChartsModule,
    NgxDatatableModule,
    TooltipModule,
    InputTextareaModule,
    AccordionModule,
    ListboxModule,
    CarouselModule,
    // SimpleCrypto,
    // AutoCompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    }),
    // CalendarModule.forRoot(),
    CalendarModule,
    RadioButtonModule,
    routing,
    DataTableModule,
    // NgZorroAntdModule
    SelectButtonModule,
    UserIdleModule.forRoot({idle: 1800, timeout: 1, ping: 120})
  ],
  exports: [CptDisclaimerComponent],
  entryComponents: [
    PatientreminderComponent,
    PatientSummaryComponent,
    InternetStatusModalComponent,
    // ProgressnoteComponent
    // AddAppointmentComponent,
    ConsultationTemplateComponent,
    ChargeslipsComponent,
    CptDisclaimerComponent
  ],
  providers: [CustomPreloading, APP_PROVIDERS,PatientmanagementService,NgbActiveModal,
    [{
      provide: HTTP_INTERCEPTORS, useClass:
      AuthenticationInterceptor, multi: true
    }]],
    // { provide: NZ_I18N, useValue: en_US }]],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(private injector: Injector) 
  {
    InjectorInstance = this.injector;
  }
 }
