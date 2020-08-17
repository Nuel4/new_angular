import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { CalendarModule } from 'angular-calendar';
import { VideosComponent } from './videos/videos.component';
import { UmComponent } from './um/um.component';
import { WhatsnewComponent } from './whatsnew/whatsnew.component';
import { AboutComponent } from './about/about.component';
import { DropdownModule } from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {InputTextareaModule} from 'primeng/inputtextarea';
  
export const routes = [
  { path: '', redirectTo: 'videos', pathMatch: 'full' },
  { path: 'videos', component: VideosComponent, data: { breadcrumb: 'Videos' } },
  { path: 'um', component: UmComponent, data: { breadcrumb: 'User Manual' } },
  { path: 'whatsnew', component: WhatsnewComponent, data: { breadcrumb: 'Whats New' } },
  { path: 'about', component: AboutComponent, data: { breadcrumb: 'About' } },

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
    TableModule,
    InputTextareaModule
  ],
  declarations: [
  VideosComponent,
  UmComponent,
  WhatsnewComponent,
  AboutComponent]
})

export class HelpModule { }
