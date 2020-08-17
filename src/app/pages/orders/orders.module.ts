import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CalendarModule } from 'angular-calendar';
import { FindpatientsComponent } from './findpatients/findpatients.component';
import { HomeComponent } from './home/home.component';
import { NeworderComponent } from './neworder/neworder.component';
import { SearchComponent } from './search/search.component';
import { InboxComponent } from './inbox/inbox.component';
import { TestpodepreferenceComponent } from './testpodepreference/testpodepreference.component';
import { IcdcodepreferenceComponent } from './icdcodepreference/icdcodepreference.component';
import { MainportalComponent } from './mainportal/mainportal.component';
import { ShowresultsComponent } from './showresults/showresults.component';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared.module';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ViewLabOrderModalComponent } from './showresults/view-lab-order-modal/view-lab-order-modal.component'
export const routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'findpatients', component: FindpatientsComponent, data: { breadcrumb: 'Find Patients' } },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Home' } },
  { path: 'neworder', component: NeworderComponent, data: { breadcrumb: 'New Order' } },
  { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } },
  { path: 'inbox', component: InboxComponent, data: { breadcrumb: 'Inbox' } },
  { path: 'admin', component: AdminComponent, data: { breadcrumb: 'Admin' } },
  { path: 'testcodepreference', component: TestpodepreferenceComponent, data: { breadcrumb: 'Test Code Preference' } },
  { path: 'icdcodepreference', component: IcdcodepreferenceComponent, data: { breadcrumb: 'ICD Code Preference' } },
  { path: 'mainportal', component: MainportalComponent, data: { breadcrumb: 'Mail Portal' } },
  { path: 'showresults', component: ShowresultsComponent, data: { breadcrumb: 'Show Results' } },
  
];

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule,
    TableModule,
    CardModule, 
    PanelModule,
    SharedModule,
    RadioButtonModule
  ],
  declarations: [
   
  FindpatientsComponent,
   
  HomeComponent,
   
  NeworderComponent,
   
  SearchComponent,
   
  InboxComponent,
   
  TestpodepreferenceComponent,
   
  IcdcodepreferenceComponent,
   
  MainportalComponent,
   
  ShowresultsComponent,
   
  AdminComponent,
   
  // ViewLabOrderModalComponent
],

  entryComponents: [
    // ViewLabOrderModalComponent,
  ]
})

export class OrdersModule { }
