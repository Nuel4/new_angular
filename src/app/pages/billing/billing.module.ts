import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { ViewbillComponent } from './viewbill/viewbill.component';
import { PostchargesComponent } from './postcharges/postcharges.component';
import { ClaimsComponent } from './claims/claims.component';
import { PaymentsComponent } from './payments/payments.component';
import { PatientaccountsComponent } from './patientaccounts/patientaccounts.component';
import { AccountreceivableComponent } from './accountreceivable/accountreceivable.component';
import { BillingsetupComponent } from './billingsetup/billingsetup.component';
import { BillingportalComponent } from './billingportal/billingportal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2CompleterModule } from 'ng2-completer';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import { Broadcaster } from '../../broadcast/broadcaster';
import { Services } from '../services/services';
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import {TabViewModule} from 'primeng/tabview';
import {AccordionModule} from 'primeng/accordion';
import {InputMaskModule} from 'primeng/inputmask';
import {MultiSelectModule} from 'primeng/multiselect';
import { AllocateInsuranceComponent } from './payments/allocate-insurance/allocate-insurance.component';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {  PaginatorModule  } from 'primeng/primeng';
import {ListboxModule} from 'primeng/listbox';
import { PickListModule } from 'primeng/picklist';
import { ElectronicClaimsComponent } from './claims/electronic-claims/electronic-claims.component';
import { RejectedClaimsComponent } from './claims/rejected-claims/rejected-claims.component';
import { RemittanceAdviceComponent } from './claims/remittance-advice/remittance-advice.component';
import { ApproveRemittanceAdviceComponent } from './claims/approve-remittance-advice/approve-remittance-advice.component';
import { PatientStatementComponent } from './patientaccounts/patient-statement/patient-statement.component';
import { PatientaccountSummaryComponent } from './patientaccounts/patientaccount-summary/patientaccount-summary.component';
import { BillingCodesandfeesComponent } from './billingsetup/billing-codesandfees/billing-codesandfees.component';
import { BillingPracticeComponent } from './billingsetup/billing-practice/billing-practice.component';
import { BillingPhysicianComponent } from './billingsetup/billing-physician/billing-physician.component';
import { BillingInsuranceProviderComponent } from './billingsetup/billing-insurance-provider/billing-insurance-provider.component';
import { AddCptComponent } from './billingsetup/billing-codesandfees/add-cpt/add-cpt.component';
import { AddInsuranceProviderComponent } from './billingsetup/billing-insurance-provider/add-insurance-provider/add-insurance-provider.component';
import { FeeScheduleTypeComponent } from './billingsetup/billing-insurance-provider/fee-schedule-type/fee-schedule-type.component';
import { AddArTypeComponent } from './billingsetup/billing-insurance-provider/add-ar-type/add-ar-type.component';
import { EditDefaultFeeComponent } from './billingsetup/billing-insurance-provider/edit-default-fee/edit-default-fee.component';
import { ArWorklistComponent } from './accountreceivable/ar-worklist/ar-worklist.component';
import { CollectionsComponent } from './accountreceivable/collections/collections.component';
import { PostchargesModalComponent } from './postcharges/postcharges-modal/postcharges-modal.component';
import { SharedModule } from '../shared.module';
// import { BillersNoteComponent } from '../../theme/components/applications/waitingroom/billers-note/billers-note.component';
import { QuillModule } from 'ngx-quill';
import { AddProblemsComponent } from '../chart/add-problems/add-problems.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { ClaimsModalComponent } from './claims/claims-modal/claims-modal.component';
import {FieldsetModule} from 'primeng/fieldset';
import { DeleteModalComponent } from './payments/delete-modal/delete-modal.component';
import { PatientaccountSummaryModalComponent } from './patientaccounts/patientaccount-summary/patientaccount-summary-modal/patientaccount-summary-modal.component';
import { PatientstatementModalComponent } from './patientaccounts/patient-statement/patientstatement-modal/patientstatement-modal.component';
import { ActreceivableModalsComponent } from './accountreceivable/actreceivable-modals/actreceivable-modals.component';
import { BillingSetupModalComponent } from './billingsetup/billing-setup-modal/billing-setup-modal.component';
import { EmailtoPatientComponent } from './accountreceivable/emailto-patient/emailto-patient.component';
import { BillingPhysicianModalComponent } from './billingsetup/billing-physician/billing-physician-modal/billing-physician-modal.component';
import { FeesModalComponent } from './billingsetup/billing-insurance-provider/fees-modal/fees-modal.component';


export const routes = [
  { path: '', redirectTo: 'viewbills', pathMatch: 'full'},
  // { path: '', component: ViewbillComponent, data: { breadcrumb: 'Billing' } },
  { path: 'viewbills', component: ViewbillComponent, data: { breadcrumb: 'View Bills' } },
  { path: 'postcharges', component: PostchargesComponent, data: { breadcrumb: 'Post Charges' } },
  { path: 'claims', component: ClaimsComponent, data: { breadcrumb: 'Claims' } },
  { path: 'payments', component: PaymentsComponent, data: { breadcrumb: 'Payments' } },
  { path: 'patientaccount', component: PatientaccountsComponent, data: { breadcrumb: 'Patient Accounts' } },
  { path: 'accountreceivable', component: AccountreceivableComponent, data: { breadcrumb: 'Account Receivable' } },
  { path: 'billingsetup', component: BillingsetupComponent, data: { breadcrumb: 'Billing Setup' } },
  { path: 'billingportal', component: BillingportalComponent, data: { breadcrumb: 'Billing Portal' } },
  { path: 'allocate-insurance', component: AllocateInsuranceComponent, data: { breadcrumb: 'Allocate Insurance'}}
];
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    HttpClientModule,
    Ng2SmartTableModule,
    Ng2CompleterModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    PickListModule,
    PaginatorModule,
    AccordionModule,
    DropdownModule,
    RadioButtonModule,
    TableModule,
    CheckboxModule,
    ListboxModule,
    TabViewModule,
    DialogModule,
    CardModule,
    TabViewModule,
    SharedModule,
    InputMaskModule,
    MultiSelectModule,
    FieldsetModule,
    QuillModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ViewbillComponent,
    PostchargesComponent,
    ClaimsComponent,
    PaymentsComponent,
    PatientaccountsComponent,
    AccountreceivableComponent,
    BillingsetupComponent,
    BillingportalComponent,
    AllocateInsuranceComponent,
    ElectronicClaimsComponent,
    RejectedClaimsComponent,
    RemittanceAdviceComponent,
    ApproveRemittanceAdviceComponent,
    PatientStatementComponent,
    PatientaccountSummaryComponent,
    BillingCodesandfeesComponent,
    BillingPracticeComponent,
    BillingPhysicianComponent,
    BillingInsuranceProviderComponent,
    AddCptComponent,
    AddInsuranceProviderComponent,
    FeeScheduleTypeComponent,
    AddArTypeComponent,
    EditDefaultFeeComponent,
    ArWorklistComponent,
    CollectionsComponent,
    PostchargesModalComponent,
    // BillersNoteComponent,
    ClaimsModalComponent,
    
    DeleteModalComponent,
    PatientaccountSummaryModalComponent,
    
    PatientstatementModalComponent,
    
    ActreceivableModalsComponent,
    
    BillingSetupModalComponent,
    
    EmailtoPatientComponent,
    
    BillingPhysicianModalComponent,
    
    FeesModalComponent,
    
    
    // AddProblemsComponent
  ],

  entryComponents: [
    PostchargesModalComponent,
    ClaimsModalComponent,
    PatientaccountSummaryModalComponent,
    PatientstatementModalComponent,
    DeleteModalComponent,
    AllocateInsuranceComponent,
    // BillersNoteComponent,
    ActreceivableModalsComponent,
    ClaimsModalComponent,PatientaccountSummaryModalComponent,
    BillingSetupModalComponent,
    EmailtoPatientComponent,
    BillingSetupModalComponent,
    AddCptComponent,
    BillingPhysicianModalComponent,AddInsuranceProviderComponent,
    FeeScheduleTypeComponent,EditDefaultFeeComponent,
    AddArTypeComponent,FeesModalComponent
  ],
  providers: [Broadcaster, Services, Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class BillingModule { }
