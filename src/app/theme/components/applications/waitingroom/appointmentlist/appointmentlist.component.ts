import { Component, OnInit, ViewEncapsulation, ViewChild, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpWrapperService, GlobalState, Global } from '../../../../../core';
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { CustomFormattedPatientAppointment } from '../../../../../model/custom-formatted-patient-appointment.model';
import { AppointmentService } from '../../../../../services/workspace/appointment.service';
import { DatePipe } from '@angular/common';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-appointmentlist',
  templateUrl: './appointmentlist.component.html',
  styleUrls: ['./appointmentlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentlistComponent implements OnInit {
  @Output() OnRowSelection = new EventEmitter<any>();
  appointments: any = [];
  cachedata: any = [];
  dt: Date;
  m: string;
  y: string;
  d: string;
  selected = [];
  selectedTab = 'Scheduled';
  selectedDate: any = this.convertTime(new Date());
   @ViewChild(DatatableComponent) tblAppointment: DatatableComponent;

  constructor(private _appointmentService: AppointmentService, private router: Router) {

  }
  ngOnInit() {
    this.loadAppointments();
  }

  convertTime(str: any) {
    this.dt  = new Date(str);
    this.m = ('0' + (this.dt.getMonth() + 1)).slice(-2);
    this.d  = ('0' + this.dt.getDate()).slice(-2);
    this.y  = (this.dt.getFullYear().toString());
    return [this.y, this.m, this.d].join('-');
}

  OnDateSelectionChanged(pSelectedDate: any, pSelectedTab: string) {
    this.appointments = null;
    this.selectedTab = pSelectedTab;
    this.selectedDate = this.convertTime(pSelectedDate);
    this.loadAppointments();
  }

  loadAppointments() {
      this._appointmentService.getAppointmentsByDateAndStatus(this.selectedDate, this.selectedTab, 0).subscribe(resp => {
      this.cachedata = [...resp]
      this.appointments = resp;
    });
  }
  onSelect({ selected }, event: Event) {
    this.OnRowSelection.next(selected);
   }

  ApplyFilter(pSelectedTab: string) {
    this.selectedTab = pSelectedTab;
    this.OnDateSelectionChanged(this.selectedDate, this.selectedTab);
}
}
