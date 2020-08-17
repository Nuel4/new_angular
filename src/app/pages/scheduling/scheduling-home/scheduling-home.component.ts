import { Component, OnInit, ViewEncapsulation, Injectable, AfterViewInit } from '@angular/core'
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms'
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
import * as jQuerys from "jquery";
(window as any).$ = jQuerys;
import 'fullcalendar-scheduler';

import { AddAppointmentComponent } from '../../workspace/calendar/add-appointment/add-appointment.component';
import { DatepickerPopupComponent } from '../../workspace/calendar/datepicker-popup/datepicker-popup.component';
import { AuthenticationStore } from './../../../authentication/authentication-store';
@Component({
  selector: 'app-scheduling-home',
  templateUrl: './scheduling-home.component.html',
  styleUrls: ['./scheduling-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulingHomeComponent implements OnInit {
  public usersList: any = []
  selectedUser: any = { userId: 0 }
  public facilityList: any = []
  selectedFacility: any
  public refPhyList: any = []
  public refOrgList: any = []
  public appointmentListbyDate: any = []
  public refPhyIntList: any = []
  public data: any = []
  public appointmentList: any = []
  findPatient: FindpatientComponent
  cachedata: any = []
  appointMentModel: any = {}
  public options: any = {}
  appointmentDuration: any
  widgetData: any
  toWorkSpace: boolean
  myDate: any

  id: any = 1
  title: string
  startdate: any
  enddate: any
  ResourceID: number
  Color: any
  event: any
  businessHour: any = []
  modalRef: any
  events: any = [
    {
      "resourceId": 3,
      "title": "Click for Google",
      "start": "2019-02-25",
      "color": 'red'
    }
  ]
  doctorList = []
  isedit = true
  isCancel = false
  currentDate: string;
  constructor(
    private fb: FormBuilder,
    private _patientmanagementService: PatientmanagementService,
    private _appointmentService: AppointmentService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private authStore: AuthenticationStore
  ) { }

  ngOnInit(): void {
    $('#calendar').fullCalendar({
      themeSystem: 'bootstrap4',
      selectable: true,
      schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
      customButtons: {
        datepicker: {
          click: () => {
            this.openDatePicker(true)
          }
        },
        prev: {
          click: () => this.prev()
        },
        next: {
          click: () => this.next()
        },
        today: {
          text: 'Today',
          click: () => this.today()
        }
      },
      header: {
        right: 'prev,next today',
        center: 'title',
        left: 'agendaDay,agendaFourDay,datepicker'
      },
      groupByResource: true,
      views: {
        agendaFourDay: {
          type: 'agenda',
          duration: { days: 4 }
        }
      },
      bootstrapFontAwesome: {
        datepicker: 'fa-calendar-o',
        prev: 'fa-chevron-left',
        next: 'fa-chevron-right'
      },
      buttonText: {
        agendaDay: '1',
        agendaFourDay: '4'
      },
      allDaySlot: false,
      editable: true,
      eventLimit: true,
      defaultView: 'agendaDay',
      events: this.events,
      scrollTime: moment().format("HH:mm"),
      slotDuration: moment("12:00:00 AM", ["h:mm:ss A"]).add(this.authStore.UserDetail.AppointmentDurationMinutes, "minute").format("HH:mm:ss"),
      slotLabelInterval: 15,
      slotLabelFormat: 'HH:mm',
      businessHours: this.businessHour,
      resources: this.doctorList,
      viewRender: function (view, element) {
        //bugs fix in jquery fullcalendar
        $('.fc-center')[0].children[0].innerText = view.title.replace(new RegExp("undefined", 'g'), "");;

      },
      eventClick: (eventObj) => this.onEventClicked(eventObj),
      dayClick: (date, jsEvent, view, resource) => this.onDayClick(date, jsEvent, view, resource),
      select: (startDate, endDate, jsEvent, view, resource) => this.selectedDays(startDate, endDate, jsEvent, view, resource),
      eventRender: (event, element, view) => this.onEventRender(event, element, view),
      eventDrop: (event, delta, revertFunc) => this.onEventDroped(event, delta, revertFunc),
      eventResize: (event, delta, revertFunc) => this.onEventResized(event, delta, revertFunc),
    });
    this.getFacilityList()
    this.GetFacilitiesByuserId()
    this.currentDate = moment(new Date()).format('YYYY-MM-DD')
    this.myDate = new Date()
    console.log('events', this.events)
  }

  GetFacilitiesByuserId() {
    this._appointmentService.GetFacilitiesByuserId(JSON.parse(sessionStorage.getItem("UserDetail")).UserId).subscribe(resp => {
      resp.map(item => {
        // if (!this.chkfacility)
        this.selectedFacility = {
          id: item.FacilityId,
          name: item.FacilityName,
          isActive: item.Inactive
        }
        // else
        //   this.selectedFacility = {
        //     id: this.chkfacility.FacilityId,
        //     name: this.chkfacility.FacilityName,
        //     isActive: this.chkfacility.Inactive
        //   }
        this.getUsers()
      })
      console.log(this.selectedFacility)
    })
  }

  getUsers() {
    const id = this.selectedFacility == null ? 0 : this.selectedFacility.id
    this._appointmentService.GetActiveUsersForApptDiary(id).subscribe(resp => {
      this.cachedata = [...resp]
      this.usersList = resp
      console.log('USER LISTs')
      console.log(this.usersList)
      this.loadBussinessHour()
    })
  }

  getFacilityList() {
    this._appointmentService.GetCustomFormattedGenericFacilities().subscribe(resp => {
      this.facilityList = resp
      console.log('Facility Lists')
      console.log(this.facilityList)
    })
  }

  weekAndDay(date, opt) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'],
      daynumber = [0, 1, 2, 3, 4, 5, 6]
    switch (opt) {
      case 'day':
        return days[date.getDay()]
      case 'daynumber':
        return days.indexOf(date)
    }
  }

  dateformater(date) {
    let d = new Date(date)
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }

  loadAppointments(dateform = new Date, dateend = new Date, datestart = new Date) {
    console.log(this.usersList)
    let users = []
    this.usersList.map(item => {
      users.push(item.userId)
    })
    console.log(users)
    let params = {
      dateFrom: this.dateformater(dateform),
      facilityId: this.selectedFacility == null ? 0 : this.selectedFacility.id,
      // visitDateStart: this.dateformater(datestart),
      visitDateStart: moment(datestart).subtract(1, 'd').format('YYYY-MM-DD').toLocaleString(),
      // visitDateEnd: this.dateformater("2019/3/9"),
      visitDateEnd: moment(dateend).add(4, 'd').format('YYYY-MM-DD').toLocaleString(),
      userId: users
    }
    console.log("params", params)
    let tempevent, comment
    $('#calendar').fullCalendar('removeEvents')
    this.events = []
    this._appointmentService.getAppointmentForWeekForFacilityById(params).subscribe(resp => {
      this.appointmentList = resp
      console.log("appointments", this.appointmentList)
      this.appointmentList.map(appt => {
        comment = appt.comments == null ? '' : '- ' + appt.comments
        tempevent = {
          "resourceId": appt.user_id,
          "id": appt.appointment_id,
          "title": appt.last_name + ', ' + appt.first_name + "-" + appt.reason_description + comment,
          "start": appt.start_time,
          "end": appt.end_time,
          "color": appt.color_code
        }
        this.events.push(tempevent)
      })
      $('#calendar').fullCalendar('addEventSource', this.events)
      console.log("EVENTS", this.events)

    })
  }

  loadBussinessHour() {
    let params = {
      facilityID: this.selectedFacility == null ? 0 : this.selectedFacility.id,
      userID: this.selectedUser == null ? 0 : this.selectedUser.userId,
      dayOfWeek: '',//this.weekAndDay(new Date(), 'day'),
      weekOfMonth: "All Weeks",
      schedulerView: '',
    }
    this.businessHour = []
    this.doctorList = []
    $('#calendar').fullCalendar('refetchResources')
    this._appointmentService.GetUserDtlsByViewModeProc(params).subscribe(resp => {
      console.log('businessHour resp', resp)
      this.usersList.map(Uitem => {
        let bh = []
        resp.map(item => {
          if (Uitem.userId === item.user_id) {
            bh.push(
              {
                dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
                start: moment(item.start_time).format('HH:mm').toString(),
                end: moment(item.lunch_break_start_time).format('HH:mm').toString()
              },
              {
                dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
                start: moment(item.lunch_break_end_time).format('HH:mm').toString(),
                end: moment(item.end_time).format('HH:mm').toString()
              }
            )
          }
        })
        let data = {
          id: Uitem.userId,
          title: Uitem.fullName,
          businessHours: bh
        }
        this.doctorList.push(data)
        $('#calendar').fullCalendar('addResource', data);
      })
      // resp.map(item => {
      //   this.usersList.map(Uitem => {
      //     let data
      //     if (Uitem.userId === item.user_id) {
      //       data = {
      //         id: Uitem.userId,
      //         title: Uitem.fullName,
      //         businessHours: [
      //           {
      //             dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
      //             start: moment(item.start_time).format('HH:mm').toString(),
      //             end: moment(item.lunch_break_start_time).format('HH:mm').toString()
      //           },
      //           {
      //             dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
      //             start: moment(item.lunch_break_end_time).format('HH:mm').toString(),
      //             end: moment(item.end_time).format('HH:mm').toString()
      //           }
      //         ]
      //       }
      //       this.doctorList.push(data)
      //       $('#calendar').fullCalendar('addResource', data);
      //     }
      //   })
      // })
      $('#calendar').fullCalendar('option', 'selectConstraint', "businessHours");
      // $('#calendar').fullCalendar('option', 'selectConstraint', "businessHours");
      console.log("current resources", $('#calendar').fullCalendar('getResources'))
      $("#calendar").fullCalendar('render');
      this.loadAppointments()
    })
  }

  getDiffTime() {
    const date1: string = this.appointMentModel.starttime
    const date2: string = this.appointMentModel.endtime

    const diffInMs: number = Date.parse(date2) - Date.parse(date1)
    this.appointmentDuration = diffInMs / 1000 / 60 / 60

    console.log(this.appointmentDuration)
  }

  /*Ankur: func for handling calendar events */
  onDayClick(date, jsEvent, view, resource) {
    console.log('>>ondayClick')
    if (jsEvent.target.classList.contains('fc-nonbusiness') ||
      jsEvent.target.classList.contains('busy-time')) {
      this.openDatePicker(false, date, resource)
    }
    else {
      // Do something if it is a business hour
      return
    }
    // this.ResourceID = resource.id
    // this.startdate = date.format()
    // this.enddate = date.format()
    //alert('clicked ' + date.format() + ' on resource ' + resource.id)
    // $('#exampleModal').modal('show')
    // this.openmodal()
  }

  openDatePicker(isDatePicker, date?, resource?) {
    this.modalRef = this.modalService.open(DatepickerPopupComponent, { centered: true, size: 'sm' })
    this.modalRef.componentInstance.isDatepicker = isDatePicker
    this.modalRef.componentInstance.loadDate.subscribe((data) => {
      if (isDatePicker) {
        if (data.bool) {
          console.log('edit', data.value)
          $("#calendar").fullCalendar('gotoDate', data.value);
          this.closemodal()
          this.loadAppointments(data.value, data.value, data.value)
        }
      } else {
        if (data.bool) {
          this.closemodal()
          this.usersList.map(item => {
            if (item.userId == resource.id)
              this.selectedUser = item
          })
          this.openmodal(date.format(), date.add(1, 'hours').format())
        }
      }
    })
  }

  openmodal(start = new Date, end = new Date, isUpdate = false) {
    this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
    this.modalRef.componentInstance.selectedData = {
      start,
      end,
      facility: this.selectedFacility,
      user: this.selectedUser,
      isUpdate,
      ApptObj: {}
    }
    this.modalRef.componentInstance.loadEvent.subscribe((value) => {
      console.log('edit', value)
      if (value) {
        this.loadAppointments()
        this.closemodal()
      }
    })
  }

  openEditModal(ApptObj, isCancel, isUpdate = false) {
    if (isUpdate) {
      this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
      this.modalRef.componentInstance.selectedData = {
        start: ApptObj.start_time,
        end: ApptObj.end_time,
        facility: this.selectedFacility,
        user: this.selectedUser,
        isUpdate,
        ApptObj,
      }
    }
    if (isCancel) {
      this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' })
      this.modalRef.componentInstance.selectedData = {
        isCancel,
        isUpdate,
        ApptObj,
      }
    }
    this.modalRef.componentInstance.loadEvent.subscribe((value) => {
      console.log("passing", value)
      if (value) {
        this.loadAppointments()
        this.closemodal()
      }
    })
  }

  closemodal() {
    this.modalRef.close()
  }

  showSuccess(msg: string) {
    this.toastr.success(msg)
  }

  CreateEvent() {
    console.log('>>CreateEvent')
    // $('#calendar').fullCalendar('renderEvent', obj)
    // console.log(this.events)
    this.closemodal()
    // $('#exampleModal').modal('hide')
  }

  EditEvent() {
    console.log('>>EditEvent')
    $('#calendar').fullCalendar('updateEvents', this.events)
    // console.log('r id:', this.ResourceID)
    // if (this.ResourceID == 1)
    //   this.Color = 'blue'
    // else if (this.ResourceID == 2)
    //   this.Color = 'green'
    // else if (this.ResourceID == 3)
    //   this.Color = 'red'
    // console.log(this.Color)
    this.events = this.events.filter((item) => {
      if (item.id === this.id) {
        item.title = this.title
      }
      return item
    })
    console.log('update events:', this.events)
    // console.log($('#calendar').fullCalendar( 'addEventSource', this.events ))
    $('#exampleModal').modal('hide')
    this.isedit = true
  }
  onEventClicked(eventObj) {
    console.log('>>onEventClicked')
    this.event = eventObj
    // this.isedit = false
    let Apptobj
    console.log(eventObj)
    this.appointmentList.map(appt => {
      if (appt.appointment_id == eventObj.id) {
        Apptobj = appt
        console.log(Apptobj)
      }
    })
    if (!this.isCancel)
      this.openEditModal(Apptobj, false, true)
    else
      this.openEditModal(this.event.id, true, false)

    this.isCancel = false
  }

  onEventRender(event, element, view) {
    console.log("renderEvent", event)
    console.log("renderEvent", element)
    // console.log(">>onEventRender")
    if (view.name == 'listDay') {
      element.find(".fc-list-item-time").append("<span class='closeon pull-right p-1'>X</span>")
    } else {
      element.find(".fc-content").prepend("<span class='closeon pull-right p-1 pr-1'>X</span>")
    }
    element.find(".closeon").on('click', () => {
      // $('#calendar').fullCalendar('removeEvents', event._id)
      this.isCancel = true
      this.event = event.id
    })
  }

  onEventDroped(event, delta, revertFunc) {
    let ApptObj
    console.log(">>onEventDroped", event)
    console.log(">>onEventDroped", delta)
    this.appointmentList.map(appt => {
      if (appt.appointment_id == event.id) {
        console.log('appt', appt)
        appt.user_id = event.resourceId
        ApptObj = appt
      }
    })
    ApptObj.start_time = moment(event.start).format('YYYY-MM-DD HH:mm')
    ApptObj.end_time = moment(event.end).format('YYYY-MM-DD HH:mm')
    this.openEditModal(ApptObj, false, true)
  }

  onEventResized(event, delta, revertFunc) {
    let ApptObj
    console.log(">>onEventResized", moment(event.end).format('YYYY-MM-DD HH:mm'))
    console.log(">>onEventResized", delta)
    this.appointmentList.map(appt => {
      if (appt.appointment_id == event.id) {
        ApptObj = appt
      }
    })
    ApptObj.start_time = moment(event.start).format('YYYY-MM-DD HH:mm')
    ApptObj.end_time = moment(event.end).format('YYYY-MM-DD HH:mm')
    this.openEditModal(ApptObj, false, true)
  }


  selectedDays(startDate, endDate, jsEvent, view, resource) {
    console.log('>>selectedDays', resource)
    this.usersList.map(item => {
      if (item.userId == resource.id)
        this.selectedUser = item
    })
    // alert('selected ' + startDate.format() + ' to ' + endDate.format())
    this.openmodal(startDate.format(), endDate.format())
  }


  prev() {
    $('#calendar').fullCalendar('prev');
    this.loadAppointments($('#calendar').fullCalendar('getDate'), $('#calendar').fullCalendar('getDate'), $('#calendar').fullCalendar('getDate'))
  }

  next() {
    $('#calendar').fullCalendar('next');
    this.loadAppointments($('#calendar').fullCalendar('getDate'), $('#calendar').fullCalendar('getDate'), $('#calendar').fullCalendar('getDate'))
  }

  today() {
    $('#calendar').fullCalendar('today');
    this.loadAppointments(new Date, new Date, new Date)
  }

}
