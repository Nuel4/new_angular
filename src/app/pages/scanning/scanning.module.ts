import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { FindpatientsComponent } from './findpatients/findpatients.component';
import { DocumnetsComponent } from './documnets/documnets.component';
// import { DocumentsComponent} from '../chart/documents/documents.component'
import {DocumentActionsComponent} from '../chart/documents/document-actions/document-actions.component'
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
// import { DoughnutChartComponent, PieChartComponent, BarChartComponent } from 'angular-d3-charts';
import { OrderListModule } from 'primeng/orderlist';

import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
// import { ScanModalComponent } from './scan-modal/scan-modal.component';

export const routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: FindpatientsComponent, data: { breadcrumb: 'Home' } },
  { path: 'documents', component: DocumnetsComponent, data: { breadcrumb: 'Documents' } },

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
    DropdownModule,
    CardModule,
    CheckboxModule,
    ButtonModule,
    PickListModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule, ListboxModule, TabViewModule, PaginatorModule, MultiSelectModule,
    TableModule,
    TooltipModule,
    SharedModule,
    OrderListModule,
    InputMaskModule,
    FileUploadModule
  ],
  declarations: [
   
  FindpatientsComponent,
  // DocumentsComponent,
  DocumnetsComponent,],
  
  entryComponents: []
})

export class ScanningModule { }
