import { Component, OnInit, ViewEncapsulation, Injectable, ViewChild } from '@angular/core'
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms'
// import { Subject } from 'rxjs'
// import { map, catchError } from 'rxjs/operators'

import { Observable, forkJoin } from 'rxjs'

// import { BehaviorSubject } from 'rxjs/BehaviorSubject'

// import { HttpWrapperService, GlobalState, Global } from '../../../core'

import { Input, Output, EventEmitter } from '@angular/core'
import { Appointment } from '../../../model/appointment.model'
import { PatientmanagementService } from '../../../services/workspace/patient-management.service'
import { AppointmentService } from '../../../services/workspace/appointment.service'
import { FindpatientComponent } from '../../../theme/components/findpatient/findpatient.component'
import { NgForm } from '@angular/forms'
import { NgbModal, NgbDatepicker, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
declare var $: any
import * as moment from 'moment'
// import * as $ from "jquery"
// import * as jQuery from "jquery"
// (window as any).$ = (window as any).jQuery = jQuery
import 'fullcalendar-scheduler'
import { Title } from '@angular/platform-browser'
import { Visit } from './../../../model/visit.model';
//import { Paginator } from 'primeng/primeng';
// Interface to hold id amd values of patient Salutation and navigate through the value
interface FacilityListDropDown {
  FacId: number
  FacValue: string
}


@Component({
  selector: 'app-v-all-appointments',
  templateUrl: './v-all-appointments.component.html',
  styleUrls: ['./v-all-appointments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VAllAppointmentsComponent implements OnInit {

  usersList: any = []
  selectedUser: any = { UserId: 0 }
  facilityList: any = []
  selectedFacility: any = { id: 0 }
  appointmentList: any = []
  apptTypeList: any = []
  selectedType: any = { AppointmentTypeId: 0 }
  selectedDate: any
  Index: number = 0
  PageSize: any;
  TotalPages: any;
  TotalItems: any;
  TotalRecords: any;
  user : boolean = true;
  appointment: boolean = true;
  dateChange: boolean = true;
  constructor(
    private fb: FormBuilder,
    private _patientmanagementService: PatientmanagementService,
    private _appointmentService: AppointmentService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.Index = 0
    this.selectedDate = new Date()
    this.getFacilityList()
    // this.GetFacilitiesByuserId()
    this.getAppointmentType()
  }

  dateformater(date) {
    let d = new Date(date)
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }
  //@ViewChild('p') paginator: Paginator;
  GetFacilitiesByuserId() {
    this._appointmentService.GetFacilitiesByuserId(JSON.parse(sessionStorage.getItem("UserDetail")).UserId).subscribe(resp => {
      resp.map(item => {
        this.selectedFacility = {
          id: item.FacilityId,
          name: item.FacilityName,
          isActive: item.Inactive
        }
        this.getUsers(this.selectedFacility.id)
        // this.loadPatientAppt()
      })
      // this.GetAllPatientAppointments()
      this.GetAllPatientAppointmentsPaged()
    })
  }

  getAppointmentType() {
    this._appointmentService.GetAppointmentType().subscribe(resp => {
      this.apptTypeList = resp
    })
  }

  getUsers(id) {
    this._appointmentService.GetActiveUsersForApptDiary(id).subscribe(resp => {
      this.usersList = resp
    })
  }

  getFacilityList() {
    this._appointmentService.GetCustomFormattedGenericFacilities().subscribe(resp => {
      this.facilityList = resp
    })
  }

  loadApptNUser(facilityid) {    
    if(this.selectedFacility === null || this.selectedFacility === undefined){
      this.usersList = [];
      this.selectedUser = {};
      this.apptTypeList = [];
      this.selectedType = {};
      this.selectedDate = "";
      this.user = true;
      this.appointment = true;
      this.dateChange = true;
    }
    else if(this.selectedFacility !== null){
      this.user = false;
      this.appointment = true;
      this.dateChange = true;
      this.getUsers(facilityid.id)
    }
    // this.GetAllPatientAppointments()
    // this.GetAllPatientAppointmentsPaged()
  }

  GetAllPatientAppointments() {
    let params = {
      facilityid: this.selectedFacility.id,
      visitdate: moment(this.selectedDate).format('YYYY-MM-DD')
    }
    this._appointmentService.GetAllPatientAppointments(params).subscribe(resp => {
      this.appointmentList = resp
      if (this.selectedUser && this.selectedUser.UserId != 0) {
        this.appointmentList = this.appointmentList.filter(item => item.UserId == this.selectedUser.UserId)
      }
      if (this.selectedType && this.selectedType.AppointmentTypeId != 0) {
        this.appointmentList = this.appointmentList.filter(item => item.AppointmentTypeId == this.selectedType.AppointmentTypeId)
      }
      // this.PrintTable();
      setTimeout(() => {
        var divElements = document.getElementById('printtable').innerHTML;
        var win = window.open()
        win.document.head.innerHTML = `
    <style>
      th, td {
        border: 0.5px solid black;
        padding: 15px;
        text-align: left;
      }
    </style>`
        win.document.body.innerHTML =
          `<body>
        <center>
          <h2>Appointment Schedule</h2>
          <p>Date: ` + moment().format("YYYY-MM-DD") + `</p>
        </center>
        <br>`
          + divElements.slice(divElements.search("<table"), divElements.search("</table>")) + `
      </body>`;
        win.print();
        this.GetAllPatientAppointmentsPaged()
        win.close();
      }, 1000);
    })
  }
  filterchanged(){
    if(this.selectedUser === null || this.selectedUser === undefined){
      this.apptTypeList = [];
      this.selectedType = {};
      this.selectedDate = "";
      this.appointment = true;
      this.dateChange = true;
    }
    else{
      this.appointment = false;
      this.dateChange = false;
      this.Index =0;
      this.GetAllPatientAppointmentsPaged()
    }
}

  GetAllPatientAppointmentsPaged() {
    let params = {
      offset: this.Index,
      limit: 10,
      facilityid: this.selectedFacility.id,
      visitdate: moment(this.selectedDate).format('YYYY-MM-DD')
    }
    this._appointmentService.GetAllPatientAppointmentsPaged(params).subscribe(resp => {
      this.appointmentList = resp.Results
      this.PageSize = resp.PageSize
      this.TotalPages = resp.TotalPages
      this.TotalRecords = resp.TotalItems
      if (this.selectedUser && this.selectedUser.UserId != 0&&this.selectedUser.UserId) {
        this.appointmentList = this.appointmentList.filter(item => (item.UserId == this.selectedUser.UserId) || (item.UserId == this.selectedUser.userId))
      }
      if (this.selectedUser && this.selectedUser.userId != 0&&this.selectedUser.userId) {
        this.appointmentList = this.appointmentList.filter(item => (item.UserId == this.selectedUser.UserId) || (item.UserId == this.selectedUser.userId))
      }
      if (this.selectedType.AppointmentTypeId != 0) {
        this.appointmentList = this.appointmentList.filter(item => item.AppointmentTypeId == this.selectedType.AppointmentTypeId)
      }
    })
  }

  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    // this.loadPatientAppt()
    this.GetAllPatientAppointmentsPaged()
  }

  // loadPatientAppt() {
  //   let params = {
  //     offset: this.Index,
  //     limit: 10,
  //     faclityid: this.selectedFacility.id,
  //     date: this.selectedDate
  //   }
  //   this._appointmentService.GetCustomFormattedGenericFacilities().subscribe(resp => {
  //     this.appointmentList = resp
  //     console.log('appt list', this.appointmentList)
  //   })
  // }

  weekAndDay(date, opt) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'],
      daynumber = [0, 1, 2, 3, 4, 5, 6]
    switch (opt) {
      case 'day':
        return days[date.getDay()]
      case 'daynumber':
        return daynumber[date.getDay()]
    }
  }

  showSuccess(msg: string) {
    this.toastr.success(msg)
  }

}