import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CalendarModule, CardModule, RadioButtonModule, KeyFilterModule, DialogModule, DropdownModule, InputTextModule, ScheduleModule, TabViewModule, CheckboxModule, MessageModule, FieldsetModule, InputMaskModule, FileUploadModule, AutoCompleteModule, InputTextareaModule, TooltipModule, PaginatorModule, ListboxModule, PickListModule, SelectButtonModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TableModule } from 'primeng/table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from '../theme/directives/directives.module';
import { HttpClientModule } from '@angular/common/http';
import { GridsterModule } from 'angular-gridster2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModelviewComponent } from '../theme/components/modelview/modelview.component';
import { AddAppointmentComponent } from './workspace/calendar/add-appointment/add-appointment.component';
import { DatepickerPopupComponent } from './workspace/calendar/datepicker-popup/datepicker-popup.component';
import {ChartModule} from 'primeng/chart'
import { AddProblemsComponent } from './chart/add-problems/add-problems.component';
import { SelectIcdComponent } from './chart/widgets/select-icd/select-icd.component';
import { SelectCptCodeComponent } from './chart/select-cpt-code/select-cpt-code.component';
import { IcdSearchmodalComponent } from './chart/widgets/select-icd/icd-searchmodal/icd-searchmodal.component';
import {OrderListModule} from 'primeng/orderlist';
import { BillersNoteComponent } from '../theme/components/applications/waitingroom/billers-note/billers-note.component';
import { AvailabilityExceptionComponent } from './workspace/calendar/availability-exception/availability-exception.component';
import { PatientTabviewComponent } from './workspace/patient-management/patient-tabview/patient-tabview.component';
import { FormsComponent } from './workspace/forms/forms.component';
import { ChkavlComponent } from './workspace/chkavl/chkavl.component';
import { UserscheduleComponent } from './workspace/userschedule/userschedule.component';
import { VAllAppointmentsComponent } from './workspace/v-all-appointments/v-all-appointments.component';
import { VChartsComponent } from './workspace/v-charts/v-charts.component';
import { DynamicModule } from 'ng-dynamic-component';
import { CalendarComponent } from './workspace/calendar/calendar.component';
import { WidgetHeaderComponent } from './workspace/widget-header.component';
import { FileuploadComponent } from '../theme/components/fileupload/fileupload.component';
import { ReferringPhysicianListComponent } from './workspace/referring-physician/referring-physician-list.component';
import { ReferringPhysicianDetailsComponent } from './workspace/referring-physician/referring-physician-details/referring-physician-details.component';
import { ViewLabOrderModalComponent } from './orders/showresults/view-lab-order-modal/view-lab-order-modal.component';

@NgModule({
    imports: [
    CommonModule,
        FormsModule,
        OrderListModule,
        ReactiveFormsModule,
        CalendarModule,
        PerfectScrollbarModule,
        NgxChartsModule,
        CardModule,
        TableModule,
        NgxDatatableModule,
        DirectivesModule,
        RadioButtonModule,
        ChartModule,
        KeyFilterModule,
        DialogModule,
        ConfirmDialogModule,
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
        PaginatorModule,
        ListboxModule,
        PickListModule,
        SelectButtonModule,
        DynamicModule.withComponents([
            CalendarComponent,
            UserscheduleComponent,
            // AlertsmodalsComponent,
            // MypostsComponent,
          ])
    ],
    exports: [
        AddAppointmentComponent,
        SelectCptCodeComponent,
        ModelviewComponent,
        DatepickerPopupComponent,
        AddProblemsComponent,
        SelectIcdComponent,
        IcdSearchmodalComponent,
        BillersNoteComponent,
        PatientTabviewComponent,
        AvailabilityExceptionComponent,
        ChkavlComponent,
        FormsComponent,
        VAllAppointmentsComponent,
        CalendarComponent,
        VChartsComponent,
        ReferringPhysicianListComponent,
        ReferringPhysicianDetailsComponent,
        UserscheduleComponent,
        FileuploadComponent,
        WidgetHeaderComponent,
        ViewLabOrderModalComponent
    ],
    declarations: [
        
        AddAppointmentComponent,
        SelectCptCodeComponent,
        ModelviewComponent,
        DatepickerPopupComponent,
        AddProblemsComponent,
        SelectIcdComponent,
        IcdSearchmodalComponent,
        BillersNoteComponent,
        AvailabilityExceptionComponent,
        PatientTabviewComponent,
        ChkavlComponent,
        FormsComponent,
        VAllAppointmentsComponent,
        UserscheduleComponent,
        CalendarComponent,
        VChartsComponent,
        FileuploadComponent,
        ReferringPhysicianListComponent,
        ReferringPhysicianDetailsComponent,
        WidgetHeaderComponent,
        ViewLabOrderModalComponent
    ],
    entryComponents:[
        IcdSearchmodalComponent,
        BillersNoteComponent,
        AddAppointmentComponent,
        CalendarComponent,
        ViewLabOrderModalComponent,
        AddProblemsComponent
    ],
    providers: [ConfirmationService]
})
export class SharedModule { }