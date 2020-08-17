import { Component, OnInit, ViewEncapsulation, Injectable, AfterViewInit } from '@angular/core'
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
import { AddAppointmentComponent } from './add-appointment/add-appointment.component'
import { DatepickerPopupComponent } from './datepicker-popup/datepicker-popup.component';
import { RouterModule, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
declare var $: any
import * as moment from 'moment'
// import * as $ from "jquery"
import * as jQuerys from "jquery"
(window as any).$ = jQuerys
import 'fullcalendar-scheduler'
import { Title } from '@angular/platform-browser'
import { AuthenticationStore } from './../../../authentication/authentication-store';
import { AvailabilityExceptionComponent } from './availability-exception/availability-exception.component';
// Interface to hold id amd values of patient Salutation and navigate through the value
interface FacilityListDropDown {
  FacId: number
  FacValue: string
}


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  @Input()
  appointmentModel: Appointment
  @Input() wData: any
  // @Input() chkfacility
  // @Input() chkuser
  isChkVal: boolean
  @Output() onSomething = new EventEmitter<string>()
  public appointmentForm: FormGroup
  _appointment: Appointment
  display = false
  showPatientResults = false
  header: any
  currentDate: string
  currentPageURL: any
  workspaceHead: boolean
  // startDate: Date
  // endDate: Date
  // start: Date
  // end: Date
  // facilityId: number
  // refPhyId: number
  // refOrgId: number
  // userId: number
  // patLastName: any
  // patFirstName: any

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
  toWorkSpace: boolean = false
  myDate: any

  /* Ankur: for calendar */
  businessHour: any = []
  modalRef: any
  id: any
  title: string
  startdate: any
  enddate: any
  Color: any
  event: any
  events: any = []
  isedit = true
  isCancel = false
  gotoDate: any;
  interval: any;
  constructor(
    private fb: FormBuilder,
    private _patientmanagementService: PatientmanagementService,
    private _appointmentService: AppointmentService,
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private authStore: AuthenticationStore
  ) {

    // this.options.customButtons = {
    //   myCustomButton: {
    //     text: 'myCustom',
    //     icon: 'fa-check',
    //     click: r => {
    //   }
    // }
  }

  ngOnInit() {
    this.currentPageURL = this.router.url
    if (this.currentPageURL == "/pages/workspace/calendar") {
      this.workspaceHead = true
    } else {
      this.workspaceHead = false
    }
    if (this.currentPageURL == "/pages/workspace/chkavl") {
      this.isChkVal = false
    } else {
      this.isChkVal = true
    }
    $('#calendar').fullCalendar({
      themeSystem: 'bootstrap4',
      defaultView: 'agendaDay',
      firstHour: 9,
      selectable: true,      
      // now: new Date(),
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
      views: {
        agendaDay: {
          type: 'agenda',
          duration: { days: 1 },
          text: '4'
        },
        agendaFourDay: {
          type: 'agenda',
          duration: { days: 4 },
          text: '4'
        }
      },
      bootstrapFontAwesome: {
        datepicker: 'fa-calendar-o',
        prev: 'fa-chevron-left',
        next: 'fa-chevron-right',
        today: 'fa-calendar-times-o',
      },
      buttonText: {
        agendaDay: '1',
        agendaFourDay: '4',
      },
      // resources: this.doctorList,
      // groupByResource: true,
      // groupByDateAndResource: true,
      allDaySlot: false,
      editable: true,      
      eventLimit: true,
      eventOverlap: false,
      events: this.events,
      slotDuration: moment("12:00:00 AM", ["h:mm:ss A"]).add(this.authStore.UserDetail.AppointmentDurationMinutes, "minute").format("HH:mm:ss"),
      slotLabelInterval: this.authStore.UserDetail.AppointmentDurationMinutes,
      slotLabelFormat: 'hh:mm',
      timeFormat: 'h(:mm)t',
      businessHours: this.businessHour,
      viewRender: function (view, element) {
        //bugs fix in jquery fullcalendar
        $('.fc-center')[0].children[0].innerText = view.title.replace(new RegExp("undefined", 'g'), "");;

      },
      handleWindowResize: true,
      eventClick: (eventObj, element) => {
        if(eventObj.type !== 'exception') {
        this.event = eventObj
        this.authStore.isViewChart = true
        element.bind('dblclick', () => {          
          this.onEventClicked(); });
        }         
      } ,
      //dayClick: (date, jsEvent, view, resource) => this.onDayClick(date, jsEvent, view, resource),
      select: (startDate, endDate, jsEvent, view, resource) => this.selectedDays(startDate, endDate, jsEvent, view, resource),
      // eventRender: (event, element, view) => this.onEventRender(event, element, view),
      eventRender: (event, element,view,eventObj) => {        
        if(event.type !== 'exception') {
          this.onEventRender(event, element, view)
          element.bind('dblclick', () => {          
            this.onEventClicked(); });
          }
        },
        eventDrop: (event, delta, revertFunc) => this.onEventDroped(event, delta, revertFunc),
        eventResize: (event, delta, revertFunc) => this.onEventResized(event, delta, revertFunc),
        dayClick: (date, jsEvent, view, resource) => this.onDayClick(date, jsEvent, view, resource),
      });

    // $(".fc-right .fc-button-group").append(
    //   '<div class="input-group datetimepicker"><input type="text" class="form-control fc-datepicker" placeholder="YYYY-MM-DD" style="padding: 0;width: 0;border: none;margin: 0;"></div>');
    
    this.getFacilityList()
    this.GetFacilitiesByuserId()
    this.currentDate = moment(new Date()).format('YYYY-MM-DD')
    this.myDate = new Date()
    
    // this.loadAppointments()
    // forkJoin([this.getFacilityList,this.GetFacilitiesByuserId,this.loadAppointments])
  
   }


  loadAppointments(dateform = new Date, dateend = new Date, datestart = new Date) {
    $('#calendar').fullCalendar('option', 'scrollTime', moment().format("HH:mm:ss"));
    let params = {
      dateFrom: this.dateformater(dateform),
      facilityId: this.selectedFacility == null ? 0 : this.selectedFacility.id,
      // visitDateStart: this.dateformater(datestart),
      visitDateStart: moment(datestart).subtract(1, 'd').format('YYYY-MM-DD').toLocaleString(),
      // visitDateEnd: this.dateformater("2019/3/9"),
      visitDateEnd: moment(dateend).add(1, 'd').format('YYYY-MM-DD').toLocaleString(),
      userId: this.selectedUser == null ? 0 : this.selectedUser.userId
    }
    let tempevent, comment
    $('#calendar').fullCalendar('removeEvents')    
    this._appointmentService.getAppointmentForWeekForFacilityById(params).subscribe(resp => {
      this.events = []
      this.appointmentList = resp
      this.appointmentList.map(appt => {
        comment = appt.comments == null ? '' : '- ' + appt.comments
        tempevent = {
          "id": appt.appointment_id,
          "title": appt.last_name + ', ' + appt.first_name + "-" + appt.reason_description + comment,
          "start": appt.start_time,
          "end": appt.end_time,
          "color": appt.color_code
        }
        this.events.push(tempevent)
      })      
      this.getExceptions();
      $('#calendar').fullCalendar('addEventSource', this.events)
      // this.loadBussinessHour()
    })
  }


  ngAfterViewInit() {
    $('.fc-datepicker-button').attr("data-toggle", "modal")
    $('.fc-datepicker-button').attr("data-target", "#inlineCalendar")
    // $("#calendar").datepicker({
    //   dateFormat: 'yy-mm-dd',
    //   showOn: "button",
    //   buttonText: '<span class="input-group-addon"><i class="fa fa-calendar"></i></span>',
    // });
    this.widgetData = JSON.parse(this.wData)
    if (this.widgetData) {
      this.toWorkSpace = true
    }
  }

  refreshData() {
    this.onSomething.emit()
    this.loadAppointments(new Date, new Date, new Date)
  }

  dateformater(date) {
    let d = new Date(date)
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }

  loadBussinessHour(dateSelected?) {
    let params = {
      facilityID: this.selectedFacility == null ? 0 : this.selectedFacility.id,
      userID: this.selectedUser == null ? 0 : this.selectedUser.userId,
      dayOfWeek: '',//this.weekAndDay(new Date(), 'day'),
      // weekOfMonth: this.weekAndDay(new Date($('#calendar').fullCalendar('getDate')), 'weekname'),
      weekOfMonth: "All Weeks",
      schedulerView: '',
    }
    this.businessHour = []
    this._appointmentService.GetUserDtlsByViewModeProc(params).subscribe(resp => {
      resp.map(item => {
        this.businessHour.push({
          dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
          start: moment(item.start_time).format('HH:mm').toString(),
          end: moment(item.lunch_break_start_time).format('HH:mm').toString()
        })
        this.businessHour.push({
          dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
          start: moment(item.lunch_break_end_time).format('HH:mm').toString(),
          end: moment(item.end_time).format('HH:mm').toString()
        })
        // this.businessHour.push({
        //   dow: [this.weekAndDay(item.day_of_week, 'daynumber')],
        //   start: moment(new Date()).format('HH:mm').toString(),
        //   end: moment(new Date()).add(2, 'hours').format('HH:mm').toString()
        // })
      })
      
      //  this.businessHour = [{ dow: [5], start: "09:00", end: "20:00" },{dow:[5],start:'01:00',end:'02:00'}]
      $('#calendar').fullCalendar('option', 'businessHours', this.businessHour);
      $('#calendar').fullCalendar('option', 'selectConstraint', "businessHours");
      $("#calendar").fullCalendar('render');
      if (dateSelected)
        this.loadAppointments(this.gotoDate, this.gotoDate, this.gotoDate)
      else {
        this.loadAppointments()
        this.interval = setInterval(()=>{
          this.loadAppointments()
          },60000)
      }
    })
    // if (this.businessHour.lenght > 0) {
    //   alert()


    // }
    //   this.businessHour = [{
    //     dow: [3, 4],
    //     start: '14:00',
    //     end: '19:00'
    //   }]
  }

  getExceptions() {
    let payload = {
      userID: this.selectedUser == null ? 0 : this.selectedUser.userId,
      startDate: new Date()
    }
    this._appointmentService.getExceptions(payload).subscribe((res)=>{
      let tempevent, events:any = [];
      res.forEach(appt => {
        tempevent = {
          "id": appt.ExceptionId,
          "title": appt.ExceptionType.Description,
          "start": appt.RecurringDetails.StartTime,
          "end": appt.RecurringDetails.EndTime,
          "color": ('#' + ('000000' + (appt.ExceptionType.Colour & 0xFFFFFF).toString(16)).slice(-6)),
          "type": 'exception'
        }
        events.push(tempevent)
      })
      $('#calendar').fullCalendar('addEventSource',events)  
    })
  }

  ngOnDestroy() {
    clearInterval(this.interval)
  }
  GetFacilitiesByuserId() {
    let facilityData: any = JSON.parse(sessionStorage.getItem('UserDetail'))
    this._appointmentService.GetFacilitiesByuserId(this.authStore.UserDetail.UserId).subscribe(resp => {
      resp.forEach(item => {
        if (facilityData.PreferredFacility1 === item.FacilityId) {
          this.selectedFacility = {
            id: item.FacilityId,
            name: item.FacilityName,
            isActive: item.Inactive
          }
        }
        // else
        //   this.selectedFacility = {
        //     id: this.chkfacility.FacilityId,
        //     name: this.chkfacility.FacilityName,
        //     isActive: this.chkfacility.Inactive
        //   }
        this.getUsers()
      })
    })
  }

  loadViewSyc(): Observable<any[]> {
    return forkJoin([this.getFacilityList,])
  }


  loadPatientDetails(event) {
    this.findPatient = new FindpatientComponent(event, event)
    this.findPatient._onClick()
  }

  getUsers() {
    const id = this.selectedFacility == null ? 0 : this.selectedFacility.id
    let PhysicianDetail = JSON.parse(sessionStorage.getItem('PhysicianDetail'))
    this._appointmentService.GetActiveUsersForApptDiary(id).subscribe(resp => {
      this.cachedata = [...resp]
      this.usersList = resp
      resp.forEach(item => {
        if (item.physicianId === PhysicianDetail.PhysicianId) {
          this.selectedUser = item
        } else if (item.physicianId === PhysicianDetail[0].PhysicianId) {
          this.selectedUser = item
        }
      })
      this.loadBussinessHour()
    })
  }

  getFacilityList() {
    this._appointmentService.GetCustomFormattedGenericFacilities().subscribe(resp => {
      this.facilityList = resp
    })
  }

  getUserScheduleForDay() {
    this._appointmentService.GetUserScheduleForDay(this.selectedFacility.id, this.selectedUser.userId, this.weekAndDay(new Date, 'day')).subscribe(resp => {
    })
  }

  weekAndDay(date, opt) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'],
      daynumber = [0, 1, 2, 3, 4, 5, 6],
      weekname = ['First Week', 'Second Week', 'Third Week', 'Fourth Week', 'Fifth Week', 'Sixth Week'];
    switch (opt) {
      case 'day':
        return days[date.getDay()]
      case 'daynumber':
        return days.indexOf(date)
      case 'weekname':
        return weekname[Math.floor(date.getDate() / 7)]
    }
  }


  getDiffTime() {
    const date1: string = this.appointMentModel.starttime
    const date2: string = this.appointMentModel.endtime

    const diffInMs: number = Date.parse(date2) - Date.parse(date1)
    this.appointmentDuration = diffInMs / 1000 / 60 / 60
  }

  /*Ankur: func for handling calendar events */
  onDayClick(date, jsEvent, view, resource) {
    this.authStore.isViewChart = false
    if (jsEvent.target.classList.contains('fc-nonbusiness') ||
      jsEvent.target.classList.contains('busy-time')) {
      this.openDatePicker(false, date)
    }
    else {
      // Do something if it is a business hour
      return
    }
  }

  moveToDate() {
    $(".close").trigger("click");
    $("#calendar").fullCalendar('gotoDate', this.gotoDate);
    this.loadBussinessHour(true)
  }

  openDatePicker(isDatePicker, date?) {
    setTimeout(() => {
      $('.modal-backdrop').remove()
    }, 50);
    if (isDatePicker) {
      let modalRef = this.modalService.open(DatepickerPopupComponent, { centered: true, size: 'sm' })
      modalRef.componentInstance.isDatepicker = isDatePicker
      modalRef.componentInstance.loadDate.subscribe((data) => {
        if (isDatePicker) {
          if (data.bool) {
            $("#calendar").fullCalendar('gotoDate', data.value);
            modalRef.close()
            this.loadAppointments(data.value, data.value, data.value)
          }
        } else {
          if (data.bool) {
            this.openmodal(date.format(), date.add(1, 'hours').format())
          }
        }
      })
    } else {
      let modalRef = this.modalService.open(DatepickerPopupComponent, { centered: true, size: 'sm' })
      modalRef.componentInstance.isDatepicker = isDatePicker
      modalRef.componentInstance.loadDate.subscribe((data) => {
        if (isDatePicker) {
          if (data.bool) {
            $("#calendar").fullCalendar('gotoDate', data.value);
            modalRef.close()
            this.loadAppointments(data.value, data.value, data.value)
          }
        } else {
          if (data.bool) {
            this.openmodal(date.format(), date.add(1, 'hours').format())
          }
        }
      })
    }
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
      if (value) {
        this.loadAppointments()
        this.modalRef.close()
      }
    })
  }
  onRightClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.modalRef = this.modalService.open(AvailabilityExceptionComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
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
      if (value) {
        this.loadAppointments()
        this.modalRef.close()
      }
    })
  }

  showSuccess(msg: string) {
    this.toastr.success(msg)
  }

  CreateEvent() {
    this.modalRef.close()
  }

  EditEvent() {
    $('#calendar').fullCalendar('updateEvents', this.events)
    this.events = this.events.filter((item) => {
      if (item.id === this.id) {
        item.title = this.title
      }
      return item
    })
    $('#exampleModal').modal('hide')
    this.isedit = true
  }

  onEventClicked() {    
    let Apptobj
    this.appointmentList.map(appt => {
      if (appt.appointment_id == this.event.id) {
        Apptobj = appt
      }
    })
    if (!this.isCancel){
      this.openEditModal(Apptobj, false, true)
    }
    else{
      this.openEditModal(this.event.id, true, false)
    }
    this._patientmanagementService.getPatientById(Apptobj.patient_id).subscribe(resp => {
      sessionStorage.setItem("PatientDetail", JSON.stringify(resp))
      this.authStore.PatientDetail = resp;
      this.authStore.isViewChart = true;
    })
    this.isCancel = false
  }

  onEventRender(event, element, view) {
    if (view.name == 'listDay') {
      element.find(".fc-list-item-time").append("<span class='closeon pull-right p-1'>X</span>")
    } else {
      element.find(".fc-content").prepend("<span class='closeon pull-right p-1 pr-1'>X</span>")
    }
    element.find(".closeon").on('click', () => {
      this.isCancel = true
      this.event = event.id
    })
  }

  onEventDroped(event, delta, revertFunc) {
    let ApptObj
    this.appointmentList.map(appt => {
      if (appt.appointment_id == event.id) {
        ApptObj = appt
      }
    })
    ApptObj.start_time = moment(event.start).format('YYYY-MM-DD HH:mm')
    ApptObj.end_time = moment(event.end).format('YYYY-MM-DD HH:mm')
    this.openEditModal(ApptObj, false, true)
  }

  onEventResized(event, delta, revertFunc) {
    let ApptObj
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
