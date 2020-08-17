import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { PatientmanagementService } from '../../../../../app/services/workspace/patient-management.service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'
import { AddAppointmentComponent} from '../../calendar/add-appointment/add-appointment.component'
import { AppointmentService } from '../../../../services/workspace/appointment.service'
import * as moment from 'moment'
import {AuthenticationStore} from '../../../../authentication/authentication-store'
@Component({
  selector: 'app-patient-tabview',
  templateUrl: './patient-tabview.component.html',
  styleUrls: ['./patient-tabview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientTabviewComponent implements OnInit {
  @Input() rowData: any;

  patientMessage: any = [];
  selectedApptStatus: any = {};
  showAppointments: boolean = true
  totalRecords: any;
  rows: any;
  patientAppointment: any;
  patientInsurance: any;
  showInsurance: boolean = true;
  apptStatus: any;
  pName: any;
  pNumber: any;
  sName: any;
  sNumber: any;
  tName: any;
  tNumber: any;
  modalRef: any;
  appointmentList: any;
  event: any;
  todayDate: any;
  patientId: any;
  constructor(private _patientmanagementService: PatientmanagementService, private modalService: NgbModal, private _appointmentService: AppointmentService, private authStore: AuthenticationStore) { }

  ngOnInit() {
    this.patientId = this.rowData.PatientId;
    this.getPatientMessage(this.patientId);
    this.getpatientappointment();
    this.getpatientinsurance(this.patientId);
    this.todayDate = new Date
    // this.todayDate = moment(new Date).format('MM/dd/yyyy')
    this.getAppointmentStatus();
    // this.loadAppointments();
  }
  dateformater(date) {
    let d = new Date(date)
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }
  loadAppointments(apptObj, isCancel) {
    // $('#calendar').fullCalendar('option', 'scrollTime', moment().format("HH:mm:ss"));
    let dateform = new Date
    let dateend = new Date
    let datestart = new Date
    let params = {
      dateFrom: this.dateformater(dateform),
      facilityId: apptObj == null ? 0 : apptObj.physicianId,
      // facilityId: 0,
      // visitDateStart: this.dateformater(datestart),
      visitDateStart: moment(datestart).subtract(1, 'd').format('YYYY-MM-DD').toLocaleString(),
      // visitDateEnd: this.dateformater("2019/3/9"),
      visitDateEnd: moment(dateend).add(1, 'd').format('YYYY-MM-DD').toLocaleString(),
      userId: apptObj == null ? 0 : apptObj.userId
      // userId: 0
    }
    let tempevent, comment
    // $('#calendar').fullCalendar('removeEvents')
    // this.events = []
    this._appointmentService.getAppointmentForWeekForFacilityById(params).subscribe(resp => {
      this.appointmentList = resp
      this.actionClick(apptObj, isCancel)
      // this.appointmentList.map(appt => {
      //   comment = appt.comments == null ? '' : '- ' + appt.comments
      //   tempevent = {
      //     "id": appt.appointment_id,
      //     "title": appt.last_name + ', ' + appt.first_name + "-" + appt.reason_description + comment,
      //     "start": appt.start_time,
      //     "end": appt.end_time,
      //     "color": appt.color_code
      //   }
      //   // this.events.push(tempevent)
      // })
      // $('#calendar').fullCalendar('addEventSource', this.events)
      // this.loadBussinessHour()
    })
  }
  getPatientMessage(patientid) {
    let param = {
      // patientID: 35870
      patientID: patientid
    }
    this.patientMessage = [];
    this._patientmanagementService.GetPatientMessages(param).subscribe(res => {
      this.patientMessage = res.Results;
    });
  }

  getpatientappointment(patientid = this.patientId, pageNo?) {
    let param = {
      // 35870
      patientid: patientid,
      AppointmentStatus: this.selectedApptStatus.appointmentStatus ? this.selectedApptStatus.appointmentStatus : '',
      offset: pageNo ? pageNo : 0,
      limit: 5
    }
    this.patientAppointment = []
    this._patientmanagementService.GetPatientAppointment(param).subscribe(res => {
      
      this.patientAppointment = res.Results;
      // this.patientAppointment.appointmentstatus = this.appointmentStatus
      this.showAppointments = false;
      this.totalRecords = res.TotalItems
      this.rows = res.PageSize
    })
  }
  onAppointmentChange(event, pageNo?){
    console.log('Appointment Event',event)
    if(moment('2019-08-22T09:15:00').format('MM/DD/YYYY') >= this.todayDate){
      // appt.push(element)
    }
    let param = {
      // 35870
      patientid: this.patientId,
      AppointmentStatus: event.value ? event.value.appointmentStatus : '',
      offset: pageNo ? pageNo : 0,
      limit: 5
    }
    this.patientAppointment = []
    this._patientmanagementService.GetPatientAppointment(param).subscribe(res => {
      // this.todayDate = moment(new Date).format('MM/dd/yyyy')
    //   if(event.value.appointmentStatus == 'Scheduled'){
    //   let appt = []
    //   res.Results.forEach(element => {
    //     console.log('new date', new Date)
    //     if(new Date(element.appointmentdate) >= new Date){
    //       appt.push(element)
    //     }
    //   })
    //   this.patientAppointment = appt;
    // } else {
      this.patientAppointment = res.Results;
      this.totalRecords = res.TotalItems
    // }
      // this.patientAppointment.appointmentstatus = this.appointmentStatus
      this.showAppointments = false;
      this.rows = res.PageSize
    })
  }

  getpatientinsurance(patientid) {
    this.pName = undefined;
    this.pNumber = undefined;
    this.sName = undefined;
    this.sNumber = undefined;
    this.tName = undefined;
    this.tNumber = undefined;
    let param = {
      // 35871
      patientID: patientid
      // patientID: 35871
    }
    this.patientInsurance = ""
    this._patientmanagementService.GetPatientInsurance(param).subscribe(res => {
      if (typeof res !== 'undefined' && res.length > 0) {
        // this.showInsurance = false
        this.patientInsurance = res
        this.patientInsurance.forEach(element => {
          switch (element.order) {
            case 1: this.pName = element.insurancename;
              this.pNumber = element.insurancepolicynumber
              break;
            case 2: this.sName = element.insurancename;
              this.sNumber = element.insurancepolicynumber
              break;
            case 3: this.tName = element.insurancename;
              this.tNumber = element.insurancepolicynumber;
              break;
          }
        });
      }

    });
  }
  getAppointmentStatus() {
    this._patientmanagementService.getAppointmentStatus().subscribe(resp => {
      this.apptStatus = resp
    })
  }
  paginateAppointment(event) {
    let currentpage = event.first / event.rows;
    this.getpatientappointment(this.patientId, currentpage);
  }
  actionClick(eventObj, cancel) {
    this.event = eventObj
    let Apptobj
    this.appointmentList.map(appt => {
      if (appt.appointment_id == eventObj.Id) {
        Apptobj = appt
      }
    })
    if (!cancel){}
      // this.openEditModal(Apptobj,  true)
    else
      // this.openEditModal(this.event.id, false)
    this._patientmanagementService.getPatientById(Apptobj.patient_id).subscribe(resp => {
      sessionStorage.setItem("PatientDetail", JSON.stringify(resp))
      this.authStore.PatientDetail = resp
      // this.authStore.isViewChart = true
    })
    // this.isCancel = false
  }
  openEditModal() {  
    if(this.rowData.reminder_date === undefined){
      this.rowData.reminder_date = new Date();
    }
      
      this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
      this.modalRef.componentInstance.selectedData = {
        start: new Date(),
        end: new Date(),
        isUpdate: false,
        patientData: true,
        ApptObj:this.rowData,
      }
    // if (isCancel) {
    //   this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' })
    //   this.modalRef.componentInstance.selectedData = {
    //     isCancel,
    //     isUpdate,
    //     ApptObj,
    //   }
    // }
    this.modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.getpatientappointment()
        this.modalRef.close()
      }
    })
  }
  
}
