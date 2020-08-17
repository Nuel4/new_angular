import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { CalendarModule } from 'primeng/calendar';
import {CardModule} from 'primeng/card';
import {InputMaskModule} from 'primeng/inputmask';
import { GridsterModule } from 'angular-gridster2';
import {FileUploadModule} from 'primeng/fileupload';
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
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import { Message } from '../../../../node_modules/@angular/compiler/src/i18n/i18n_ast';

// importing components
import { TrackingComponent } from '../inventory/tracking/tracking.component';
import { ItemsComponent } from '../inventory/items/items.component';
import { BatchesComponent } from '../inventory/batches/batches.component';
import { OrderComponent } from '../inventory/orderMaster/order.component';
import { ShippingComponent } from '../inventory/shipping/shipping.component';
import { CategoriesComponent } from '../inventory/categories/categories.component';

import { ShippingOrderComponent } from '../inventory/shipping/shipping-order/shipping-order.component';
import { ShippingTableComponent } from '../inventory/shipping/shipping-table/shipping-table.component';
import { ShippingDetailComponent } from '../inventory/shipping/shipping-detail/shipping-detail.component';
import { ShippingLabelComponent } from '../inventory/shipping/shipping-label/shipping-label.component';
import { UploadComponent } from '../inventory/upload/upload.component';

export const routes = [
  { path: '', component: TrackingComponent, data: { breadcrumb: 'Inventory/Tracking' } },
  { path: 'tracking', component: TrackingComponent, data: { breadcrumb: 'tracking'} },
  { path: 'items', component: ItemsComponent, data: { breadcrumb: 'items'} },
  { path: 'batches', component: BatchesComponent, data: { breadcrumb: 'batches'} },
  { path: 'orderMaster', component: OrderComponent, data: { breadcrumb: 'orders'} },
  { path: 'shipping', component: ShippingComponent, data: { breadcrumb: 'shipping'} },
  { path: 'categories', component: CategoriesComponent, data: { breadcrumb: 'categories'} },
  { path: 'shipping-order', component: ShippingOrderComponent, data: { breadcrumb: 'shipping-order'} },
  { path: 'shipping-label', component: ShippingLabelComponent, data: { breadcrumb: 'shipping-label'} },
  { path: 'uploads', component: UploadComponent, data: { breadcrumb: 'upload'} },

];

@NgModule({
  imports: [
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
    DialogModule,
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
    InputTextareaModule,
  ],
  declarations: [
    TrackingComponent,
    ItemsComponent,
    BatchesComponent,
    OrderComponent,
    ShippingComponent,
    CategoriesComponent,
    ShippingOrderComponent,
    ShippingTableComponent,
    ShippingDetailComponent,
    ShippingLabelComponent,
    UploadComponent

  ],
  exports: [
    
  ],
  providers: [
    
  ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryModule { }
