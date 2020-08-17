import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CalendarModule } from 'angular-calendar';
import { FacilityComponent } from './facility/facility.component';
import { PmPracticeComponent } from './pm-practice/pm-practice.component';
import { PmSpecialityComponent } from './pm-speciality/pm-speciality.component';
import { PmQualComponent } from './pm-qual/pm-qual.component';
import { PmEmpRoleComponent } from './pm-emp-role/pm-emp-role.component';
import { PmLupTbComponent } from './pm-lup-tb/pm-lup-tb.component';
import { PmElVerfComponent } from './pm-el-verf/pm-el-verf.component';
import { PmEmployeeMaintenanceComponent } from './pm-employee-maintenance/pm-employee-maintenance.component';
import { PmCdsComponent } from './pm-cds/pm-cds.component';
import { RtPtListComponent } from './rt-pt-list/rt-pt-list.component';
import { RtAuditReportComponent } from './rt-audit-report/rt-audit-report.component';
import { RtPtRemainderComponent } from './rt-pt-remainder/rt-pt-remainder.component';
import { RtMumComponent } from './rt-mum/rt-mum.component';
import { RtCqmComponent } from './rt-cqm/rt-cqm.component';
import { HieEdEhiComponent } from './hie-ed-ehi/hie-ed-ehi.component';
import { HieAuditGshahComponent } from './hie-audit-gshah/hie-audit-gshah.component';
import { HieGetstComponent } from './hie-getst/hie-getst.component';
import { HiePhsComponent } from './hie-phs/hie-phs.component';
import { HieEecComponent } from './hie-eec/hie-eec.component';
import { HieExcCliInfoComponent } from './hie-exc-cli-info/hie-exc-cli-info.component';
import { HieIrsComponent } from './hie-irs/hie-irs.component';
import { HieSddComponent } from './hie-sdd/hie-sdd.component';
import { AdminModalityComponent } from './admin-modality/admin-modality.component';
import { AdminDeptComponent } from './admin-dept/admin-dept.component';
import { AdminPosComponent } from './admin-pos/admin-pos.component';
import { AdminCalEvtComponent } from './admin-cal-evt/admin-cal-evt.component';
import { AdminReffPhyComponent } from './admin-reff-phy/admin-reff-phy.component';
import { AdminRlorgComponent } from './admin-rlorg/admin-rlorg.component';
import { AdminUomComponent } from './admin-uom/admin-uom.component';
import { AdminCptcodeComponent } from './admin-cptcode/admin-cptcode.component';
import { AdminLabComponent } from './admin-lab/admin-lab.component';
import { AdminLabInvestComponent } from './admin-lab-invest/admin-lab-invest.component';
import { AdminInvestComponent } from './admin-invest/admin-invest.component';
import { AdminMgPatientComponent } from './admin-mg-patient/admin-mg-patient.component';
import { TemplatSbComponent } from './templat-sb/templat-sb.component';
import { TemplateStlComponent } from './template-stl/template-stl.component';
import { TemplateSntComponent } from './template-snt/template-snt.component';
import { TemplateTgComponent } from './template-tg/template-tg.component';
import { TemplatePerComponent } from './template-per/template-per.component';
import { TemplateLtComponent } from './template-lt/template-lt.component';
import { TemplateEstComponent } from './template-est/template-est.component';


export const routes = [
  { path: '', redirectTo: 'findpatient', pathMatch: 'full' },
  { path: 'facility', component: FacilityComponent, data: { breadcrumb: 'Facility' } },
  { path: 'pm-practice', component: PmPracticeComponent, data: { breadcrumb: 'Practice' } },
  { path: 'pm-speciality', component: PmSpecialityComponent, data: { breadcrumb: 'Speciality' } },
  { path: 'pm-qual', component: PmQualComponent, data: { breadcrumb: 'Qualification' } },
  { path: 'pm-emp-role', component: PmEmpRoleComponent, data: { breadcrumb: 'Employee Role' } },
  { path: 'pm-lup-tb', component: PmLupTbComponent, data: { breadcrumb: 'LookUp Table' } },
  { path: 'pm-el-verf', component: PmElVerfComponent, data: { breadcrumb: 'Eligibility Verification' } },
  { path: 'pm-employee-maintenance', component: PmEmployeeMaintenanceComponent, data: { breadcrumb: 'Employee Maintenance' } },
  { path: 'pm-cds', component: PmCdsComponent, data: { breadcrumb: 'Clinical Decition Support' } },
  { path: 'rt-pt-list', component: RtPtListComponent, data: { breadcrumb: 'Patients List' } },
  { path: 'rt-audit-report', component: RtAuditReportComponent, data: { breadcrumb: 'Audit Report' } },
  { path: 'rt-pt-remainder', component: RtPtRemainderComponent, data: { breadcrumb: 'Patient Remainder' } },
  { path: 'rt-mum', component: RtMumComponent, data: { breadcrumb: 'Stage1 MU Measures' } },
  { path: 'rt-cqm', component: RtCqmComponent, data: { breadcrumb: 'Clinical Quality Measure' } },
  { path: 'hie-ed-ehi', component: HieEdEhiComponent, data: { breadcrumb: 'Encrypt/Decrypt EHI' } },
  { path: 'hie-audit-gshah', component: HieAuditGshahComponent, data: { breadcrumb: 'Generate SHA256 Hash' } },
  { path: 'hie-getst', component: HieGetstComponent, data: { breadcrumb: 'General Encryption Test' } },
  { path: 'hie-phs', component: HiePhsComponent, data: { breadcrumb: 'Public Health Surveillance' } },
  { path: 'hie-eec', component: HieEecComponent, data: { breadcrumb: 'Electronic Exchange Concept' } },
  { path: 'hie-exc-cli-info', component: HieExcCliInfoComponent, data: { breadcrumb: 'Exchange Clinical Information' } },
  { path: 'hie-irs', component: HieIrsComponent, data: { breadcrumb: 'Immunization Registry Submission' } },
  { path: 'hie-sdd', component: HieSddComponent, data: { breadcrumb: 'Sync DrFirst Data' } },
  { path: 'admin-modality', component: AdminModalityComponent, data: { breadcrumb: 'Modality' } },
  { path: 'admin-dept', component: AdminDeptComponent, data: { breadcrumb: 'Department' } },
  { path: 'admin-pos', component: AdminPosComponent, data: { breadcrumb: 'Place Of Service' } },
  { path: 'admin-cal-evt', component: AdminCalEvtComponent, data: { breadcrumb: 'Calendar Event' } },
  { path: 'admin-reff-phy', component: AdminReffPhyComponent, data: { breadcrumb: 'Reffering Physician' } },
  { path: 'admin-rlorg', component: AdminRlorgComponent, data: { breadcrumb: 'Related Organization' } },
  { path: 'admin-uom', component: AdminUomComponent, data: { breadcrumb: 'Unit of Measure' } },
  { path: 'admin-cptcode', component: AdminCptcodeComponent, data: { breadcrumb: 'CPT4 Codes' } },
  { path: 'admin-lab', component: AdminLabComponent, data: { breadcrumb: 'Laboratories' } },
  { path: 'admin-lab-invest', component: AdminLabInvestComponent, data: { breadcrumb: 'Lab Investigations' } },
  { path: 'admin-invest', component: AdminInvestComponent, data: { breadcrumb: 'Investigations' } },
  { path: 'admin-mg-patient', component: AdminMgPatientComponent, data: { breadcrumb: 'Merge Patient' } },
  { path: 'templat-sb', component: TemplatSbComponent, data: { breadcrumb: 'Section Builder' } },
  { path: 'template-stl', component: TemplateStlComponent, data: { breadcrumb: 'Smart Text Lookups' } },
  { path: 'template-snt', component: TemplateSntComponent, data: { breadcrumb: 'Smart Note Template' } },
  { path: 'template-tg', component: TemplateTgComponent, data: { breadcrumb: 'Template Group' } },
  { path: 'template-per', component: TemplatePerComponent, data: { breadcrumb: 'Patient Education Resource' } },
  { path: 'template-lt', component: TemplateLtComponent, data: { breadcrumb: 'Letter Template' } },
  { path: 'template-est', component: TemplateEstComponent, data: { breadcrumb: 'Encounter Summary Template' } },
  
];

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule
  ],
  declarations: [
   
  FacilityComponent,
   
  PmPracticeComponent,
   
  PmSpecialityComponent,
   
  PmQualComponent,
   
  PmEmpRoleComponent,
   
  PmLupTbComponent,
   
  PmElVerfComponent,
   
  PmEmployeeMaintenanceComponent,
   
  PmCdsComponent,
   
  RtPtListComponent,
   
  RtAuditReportComponent,
   
  RtPtRemainderComponent,
   
  RtMumComponent,
   
  RtCqmComponent,
   
  HieEdEhiComponent,
   
  HieAuditGshahComponent,
   
  HieGetstComponent,
   
  HiePhsComponent,
   
  HieEecComponent,
   
  HieExcCliInfoComponent,
   
  HieIrsComponent,
   
  HieSddComponent,
   
  AdminModalityComponent,
   
  AdminDeptComponent,
   
  AdminPosComponent,
   
  AdminCalEvtComponent,
   
  AdminReffPhyComponent,
   
  AdminRlorgComponent,
   
  AdminUomComponent,
   
  AdminCptcodeComponent,
   
  AdminLabComponent,
   
  AdminLabInvestComponent,
   
  AdminInvestComponent,
   
  AdminMgPatientComponent,
   
  TemplatSbComponent,
   
  TemplateStlComponent,
   
  TemplateSntComponent,
   
  TemplateTgComponent,
   
  TemplatePerComponent,
   
  TemplateLtComponent,
   
  TemplateEstComponent]
})

export class PracticeModule { }
