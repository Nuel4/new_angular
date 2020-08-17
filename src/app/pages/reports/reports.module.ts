import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CalendarModule } from 'angular-calendar';
import { AppointmentsComponent } from './appointments/appointments.component';
import { BillingComponent } from './billing/billing.component';
import { PatientsComponent } from './patients/patients.component';
import { PracticeComponent } from './practice/practice.component';
import { UserstComponent } from './userst/userst.component';
import { ReportsComponent } from './reports/reports.component';
import { TokenInterceptorService } from '../../services/reports/token-interceptor.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule, ListboxModule, TabViewModule, PaginatorModule, MultiSelectModule } from 'primeng/primeng';

export const routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  { path: 'reports', component: ReportsComponent, data: { breadcrumb: 'Reports' } },
  { path: 'appointments', component: AppointmentsComponent, data: { breadcrumb: 'Appointments' } },
  { path: 'billing', component: BillingComponent, data: { breadcrumb: 'Billing' } },
  { path: 'patients', component: PatientsComponent, data: { breadcrumb: 'Patients' } },
  { path: 'practice', component: PracticeComponent, data: { breadcrumb: 'Practice' } },
  { path: 'userst', component: UserstComponent, data: { breadcrumb: 'Users' } },


];
const APP_PROVIDERS = [
  TokenInterceptorService
];
@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DropdownModule,
    RadioButtonModule,
    DirectivesModule
  ],
  declarations: [

  AppointmentsComponent,

  BillingComponent,

  PatientsComponent,

  PracticeComponent,

  UserstComponent,

  ReportsComponent,
],
providers: [{
  provide: HTTP_INTERCEPTORS, useClass:
  TokenInterceptorService, multi: true
}]
})

export class ReportsModule { }
