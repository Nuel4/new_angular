import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgbModule, NgbActiveModal, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { PipesModule } from '../theme/pipes/pipes.module';
import { CheckboxModule } from 'primeng/checkbox';
import { routing } from './pages.routing';
import { PagesComponent } from './pages.component';
import { InputMaskModule } from 'primeng/inputmask';

import { NgxDatatableModule } from '@swimlane/ngx-datatable'

import { HeaderComponent } from '../theme/components/header/header.component';
import { FooterComponent } from '../theme/components/footer/footer.component';
import { SidebarComponent } from '../theme/components/sidebar/sidebar.component';
import { VerticalMenuComponent } from '../theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from '../theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from '../theme/components/back-top/back-top.component';
import { FullScreenComponent } from '../theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from '../theme/components/applications/applications.component';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { UserMenuComponent } from '../theme/components/user-menu/user-menu.component';
import { FlagsMenuComponent } from '../theme/components/flags-menu/flags-menu.component';
import { SideChatComponent } from '../theme/components/side-chat/side-chat.component';
import { FavoritesComponent } from '../theme/components/favorites/favorites.component';
import { BlankComponent } from './blank/blank.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { FindpatientComponent } from '../theme/components/findpatient/findpatient.component'
import { ProblemListModalComponent } from './chart/problem-list/problem-list-modal/problem-list-modal.component'

import { HttpClientModule, HttpClient } from '@angular/common/http';

// import { Ng2SmartTableModule } from 'ng2-smart-table';
import {DeleteLetterComponent } from './chart/letters/delete-letter/delete-letter.component'
import { Broadcaster } from '../broadcast/broadcaster';
import { DateFormatPipeComponent } from '../../app/pages/dateformatpipe/dateformatpipe.component';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { GrowlModule } from 'primeng/growl';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
// import {SelectButtonModule} from 'primeng/selectbutton';

import { SharedModule } from './shared.module';
import { ToastModule } from 'primeng/toast';
import { ModelviewComponent } from '../theme/components/modelview/modelview.component';
import { RefreshComponent } from './refresh/refresh.component';
import { AccordionModule, TabViewModule, PaginatorModule, PickListModule, ListboxModule, EditorModule, AutoCompleteModule, RadioButtonModule } from 'primeng/primeng';
import { AppointmentdetailsComponent } from '../theme/components/applications/waitingroom/appointmentdetails/appointmentdetails.component';
import { WaitingroommodalComponent } from '../theme/components/applications/waitingroom/appointmentdetails/waitingroommodal/waitingroommodal.component';
// import { BillersNoteComponent } from '../theme/components/applications/waitingroom/billers-note/billers-note.component';
import {PmhModalComponent} from './chart/past-medical-history/pmh-modal/pmh-modal.component'
import { ComparemodalComponent } from './chart/medications/comparemodal/comparemodal.component';
import {AllergiesModalComponent} from './chart/allergies/allergies-modal/allergies-modal.component'
import { DocumentActionsComponent } from './chart/documents/document-actions/document-actions.component';

import { EligibilityverificationComponent } from '../theme/components/applications/waitingroom/eligibilityverification/eligibilityverification.component';
import { AddAppointmentComponent } from './workspace/calendar/add-appointment/add-appointment.component';
import { NoticeboardmodalComponent } from './workspace/noticeboard/noticeboardmodal/noticeboardmodal.component';
import { PatientactionComponent } from '../theme/components/applications/patientaction/patientaction.component';
import {TrackingComponent} from './tracking/tracking.component';
import {UploadComponent} from './upload/upload.component'
import { EditorComponent } from './form-elements/editor/editor.component';
// import { ProgressnoteComponent } from './chart/progressnote/progressnote.component';
// import {AutoCompleteModule} from 'primeng/autocomplete';
import {FieldsetModule} from 'primeng/fieldset'; 
import { QuillModule } from 'ngx-quill';
import {TooltipModule} from 'primeng/tooltip';
import { NgxPopperModule } from 'ngx-popper';
import { DynamicFormComponent } from './chart/progressnote/template-editor/fields/dynamic-form/dynamic-form.component';
// import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { SafePipe } from  '../services/safe.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ReportmodalComponent } from './chart/progressnote/template-editor/reportmodal/reportmodal.component';
import { ProfileModalComponent } from './profile/profile-modal/profile-modal.component';
import { ChartTilePickerComponent } from './profile/chart-tile-picker/chart-tile-picker.component';
import{ScanModalComponent} from './scanning/scan-modal/scan-modal.component';
// import { CKEditorModule } from 'ckeditor4-angular';
// import {DocumentsComponent} from './chart/documents/documents.component'
// import SimpleCrypto from "simple-crypto-js";

// import { AddProblemsComponent } from './chart/add-problems/add-problems.component';
@NgModule({
  imports: [
    // CKEditorModule,
    CommonModule,
    FormsModule,
    PdfViewerModule,
    CheckboxModule,
    PerfectScrollbarModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    }),
    AutoCompleteModule,
    ToastContainerModule,
    NgbModule.forRoot(),
    MultiselectDropdownModule,
    PipesModule,
    HttpClientModule,
    // Ng2SmartTableModule,
    routing,
    NgxDatatableModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    CalendarModule,
    CardModule,
    GrowlModule,
    FileUploadModule,
    DropdownModule,
    ToastModule,
    AccordionModule,
    TabViewModule,
    SharedModule,    
    PaginatorModule,
    InputMaskModule,
    PickListModule,
    ListboxModule,
    EditorModule,
    FieldsetModule,
    QuillModule.forRoot(),
    TooltipModule,
    NgxPopperModule,
    NgbPopoverModule,
    RadioButtonModule,
    
    // SelectButtonModule,
    // PdfJsViewerModule
    
    // AutoCompleteModule
  ],
  declarations: [
    EditorComponent,
    TrackingComponent,
    SafePipe,
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    BackTopComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    FlagsMenuComponent,
    SideChatComponent,
    FavoritesComponent,
    BlankComponent,
    SearchComponent,
    ProfileComponent,
    FindpatientComponent,
    UploadComponent,
    // ModelviewComponent,
    DateFormatPipeComponent,
    RefreshComponent,
    AppointmentdetailsComponent,
    PatientactionComponent,
    WaitingroommodalComponent,
    // BillersNoteComponent,
    PmhModalComponent,
    ComparemodalComponent,
    // AllergiesModalComponent,
    DocumentActionsComponent,
    EligibilityverificationComponent,
    ProblemListModalComponent,
    NoticeboardmodalComponent,
    DeleteLetterComponent,
    ReportmodalComponent,
    ProfileModalComponent,
    ChartTilePickerComponent,
    ScanModalComponent,
    // DocumentsComponent
    // AddProblemsComponent,
    // DynamicFormComponent
    // AddAppointmentComponent   
  ],
  // exports: [DynamicFormComponent],
  entryComponents: [
    PmhModalComponent,
    ModelviewComponent,
    AppointmentdetailsComponent,
    PatientactionComponent,
    WaitingroommodalComponent,
    // BillersNoteComponent,
    ComparemodalComponent,
    // ProgressnoteComponent,
    // AllergiesModalComponent,
    DocumentActionsComponent,
    EligibilityverificationComponent,
    ProblemListModalComponent,
    AddAppointmentComponent,
    NoticeboardmodalComponent,
    DeleteLetterComponent,
    ReportmodalComponent,ProfileModalComponent,
    ChartTilePickerComponent,
    ScanModalComponent
    // AddProblemsComponent
    // DynamicFormComponent
  ],
 
  providers: [Broadcaster,NgbActiveModal,SafePipe]
})
export class PagesModule { }
