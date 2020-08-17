import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PatientmanagementService } from './../../../../services/workspace/patient-management.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationStore } from './../../../../authentication/authentication-store';
import * as moment from 'moment';
import { EligibilityverificationComponent } from '../waitingroom/eligibilityverification/eligibilityverification.component';
import { WaitingroommodalComponent } from '../waitingroom/appointmentdetails/waitingroommodal/waitingroommodal.component';
import { Router } from '@angular/router';
import { AppointmentService } from './../../../../services/workspace/appointment.service';
import { AddAppointmentComponent } from './../../../../pages/workspace/calendar/add-appointment/add-appointment.component';
import { PatientActionService } from './../../../../services/chart/patient-action.service';
import { filter } from 'rxjs/operators';
import { PatientreminderComponent } from './patientreminder/patientreminder.component';

@Component({
  selector: 'app-patientaction',
  templateUrl: './patientaction.component.html',
  styleUrls: ['./patientaction.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientactionComponent implements OnInit {

  // @ViewChild('objList') appointmentList;
  selectedRow: any;
  cachedata: any = [];
  selectedPatient
  selectedAppointment
  selectedTab = 'Scheduled';
  result: any;
  cols: any = [];
  tabLabel: any = [];
  enableFilterInput: boolean = false;
  headerIndex: number;
  facilityList: any = [];
  selected_date: any;
  openModal: boolean = false;
  patient_documents: any = [];
  patient_documents_list: any = [];
  patient_details: any = { sex: null };
  innerTabLabel: any = [];
  payload: any;
  myQueue: boolean = false;
  enableButtons: boolean = false;
  selectedPatientId: any;
  tabIndex: any = { index: 0 };
  rooms: any = [];
  patientMessage: any = [];
  patientInsurance: any;
  showInsurance: boolean = true;
  patientAppointment: any;
  showAppointments: boolean = true;
  ConfirmationList: any
  selectedConfirmation: any
  StatusList: any;
  selectedStatus: any = { name: 'Open', value: 'open' }
  reminderList: any;
  isToolTipVisible: false
  isReasonToolTipVisible: any;
  isNoteToolTipVisible: any;
  constructor(private router: Router, private appointmentService: AppointmentService,
    private patientManagementService: PatientmanagementService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private patientAction: PatientActionService,
    private toastr: ToastrService,
    private authStore: AuthenticationStore, ) {
  }
  ngOnInit() {
    this.getCustomFormattedPatientAppointments();
    this.selected_date = moment(new Date()).format('MM/DD/YYYY');
    this.ConfirmationList = [
      { name: 'All' },
      { name: 'Confirmed' },
      { name: 'NO Response' },
      { name: 'Left Msg on Answering Machine' },
      { name: 'Left Msg - Family Member' },
      { name: 'Disconnected' },
      { name: 'Wrong Number' },
      { name: 'Cancelled' },
      { name: 'Line Busy' },
      { name: 'Not Completed' }
    ]
    this.StatusList = [
      { name: 'Open', value: 'open' },
      { name: 'Close', value: 'close' },
    ]
    this.innerTabLabel = [
      { name: 'Patient Info' },
      { name: 'Insurance' },
      { name: 'Appointments' },
      { name: 'Messages' },
    ]
    this.tabLabel = [
      { name: 'Schedule Confirmation Calls' },
      { name: 'Patient Reminders' },
    ]
    this.cols = [
      { field: 'patientname', header: 'Patient Name', filter: true },
      { field: "username", header: "User", filter: true },
      { field: "appointmentstarttime", header: "Appt Time", filter: true },
      { field: 'appointmenttype', header: 'Type', filter: true },
      { field: "eligibility", header: "Eligibility" },
      { field: "account_summary", header: "Status" },
      { field: "note", header: "Bal" }
    ];
    // this.facilityList = [
    //   {facilityName: 'All', value: 1},
    //   {facilityName: 'Grace clinic', value: 2},
    //   {facilityName: 'Happy Dent Clinic', value: 3},
    //   {facilityName: 'Test Facility', value: 4},
    // ]

    // console.log(this.selected_date === moment(new Date()).format('MM/DD/YYYY'));
    if (moment(this.selected_date).format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY')) {
      this.enableButtons = false;
    } else {
      this.enableButtons = true;
    }
  }
  reset() {
    // this.router.navigate(['pages']);    
    this.activeModal.dismiss('Cross click');
  }
  onDateSelection() {
    // this.appointmentList.OnDateSelectionChanged(this.selectedDate, this.selectedTab)
    // if (moment(this.selected_date).format('MM/DD/YYYY') !== moment(new Date()).format('MM/DD/YYYY')) {
    //   this.enableButtons = true;
    // }
    // console.log(this.selected_date, moment(new Date()).format('MM/DD/YYYY'))
    // if (moment(this.selected_date).format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY')) {
    //   this.enableButtons = false;
    // }
    this.getCustomFormattedPatientAppointments(this.selected_date);
  }

  OnRowSelected(select: any) {

    this.selectedAppointment = select[0];
    this.patientManagementService.getPatientCustomDetailById(this.selectedAppointment.patientId).subscribe(resp => {
      this.cachedata = [...resp]
      this.selectedPatient = resp[0]
    });
    console.log(this.selectedPatient);
  }

  OnAppointmentTabSelection(selectedTab: string) {
    this.selectedTab = selectedTab;
    // this.appointmentList.ApplyFilter(this.selectedTab);
  }

  getReminders() {
    this.patient_documents_list = []
    let followUp = {
      status: this.selectedStatus.value
    }
    this.patientAction.getPatientReminders(followUp).subscribe((results: any) => {
      if (results.length !== 0)
        results.map(item => {
          item.patientname = item.FirstName + " " + item.LastName
          this.patient_documents_list.push(item)
        })
      // this.patient_documents_list = results;
    })
  }

  CloseReminder(data) {
    let Data
    this.patientAction.getFollowUpCallListById({ followUpListId: data.FollowUpCallListId }).subscribe(resp => {
      Data = resp
      Data.FollowUpCallStatus = 'close'
      this.patientAction.putFollowUpCallList(Data).subscribe(resp => {
        console.log(resp)
        this.getReminders()
        this.toastr.success("Reminder Closed Successfully", "SUCCESS")
      })
    })
  }

  getFilterdData() {
    this.patient_documents_list = this.patient_documents
    if (this.selectedConfirmation.name !== 'All') {
      this.patient_documents_list = this.patient_documents_list.filter(item => item.confirmedstatus === this.selectedConfirmation.name)
    }
  }

  toggleTooltip(type, bool) {
    switch (type) {
      case 'reason':
        this.isReasonToolTipVisible = bool
        break
      case 'notes':
        this.isNoteToolTipVisible = bool
        break
    }
    this.isToolTipVisible = bool
  }

  openReminderModal(data) {
    console.log(data)
    const modalRef = this.modalService.open(PatientreminderComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' });
    modalRef.componentInstance.selectedData = {
      FollowUpCallListId: data.FollowUpCallListId,
      name: data.patientname,
      notes: data.Notes,
      reason: data.CallReason
    };
    modalRef.componentInstance.loadReminder.subscribe((value) => {
      console.log('edit', value)
      if (value) {
        this.getReminders()
        modalRef.dismiss("")
        this.toastr.success("Successfully Note Updated.", "SUCCESS")
      }
    })
  }

  SelectedTab(event) {
    this.headerIndex = null;
    this.tabIndex = event;
    switch (event.index) {
      case 0: {
        this.cols = [
          { field: 'patientname', header: 'Patient Name', filter: true },
          { field: "username", header: "User", filter: true },
          { field: "appointmentstarttime", header: "Appt Time", filter: true },
          { field: 'appointmenttype', header: 'Type', filter: true },
          { field: "eligibility", header: "Eligibility" },
          { field: "confirmedstatus", header: "Status" },
          { field: "copayamount", header: "Bal" }
        ],
          this.patient_documents_list = [];
        this.patient_documents.map((item) => {
          // if (item.appointmentstatus === 'Scheduled') {
          this.patient_documents_list.push(item);
          // }
        })
      }
        break;
      case 1: {
        this.cols = [
          { field: 'patientname', header: 'Name', filter: true },
          { field: 'AltPhone', header: 'Cell Phone', filter: true },
          { field: 'HomePhone', header: 'Home Phone', filter: true },
          { field: 'WorkPhone', header: 'Work Phone', filter: true },
          { field: 'Reason', header: 'Reason', filter: true },
          { field: 'Note', header: 'Note', filter: true },
          { field: 'Done', header: 'Done', filter: true },
        ],

          this.patient_documents_list = [];
        this.getReminders();
        // this.patient_documents.map((item) => {
        //   // if (item.appointmentstatus === 'Arrived') {
        //   this.patient_documents_list.push(item);
        //   // }
        // })
      }
    }
  }

  filterTableData(event, filter_type) {
    console.log(event, filter_type)
  }
  openFilter(index) {
    this.headerIndex = index;
    this.enableFilterInput = true;
  }


  getCustomFormattedPatientAppointments(selected_date?, facility_id?) {
    this.payload = {
      pAppointmentStartDateTime: selected_date ? moment(selected_date).format('YYYY-MM-DD 00:00') : moment(new Date()).format('YYYY-MM-DD 00:00'),
      sortEnumerator: 1,
      status: true
    }
    this.patient_documents_list = [];
    if (this.myQueue) {
      this.patientAction.getPhysicianId({ userId: this.authStore.UserDetail.UserId }).subscribe((results: any) => {
        this.payload.physicianId = results[0].PhysicianId;
        this.patientAction.getCustomFormattedPatientAppointments(this.payload).subscribe(results => {
          this.patient_documents = results;
          this.SelectedTab(this.tabIndex);
        })
      })
    } else {
      this.patientAction.getCustomFormattedPatientAppointments(this.payload).subscribe(results => {
        this.patient_documents = results;
        this.SelectedTab(this.tabIndex);
      })
    }
  }

  viewCharts() {
    this.activeModal.dismiss('Cross click');
    this.router.navigate(['/pages/chart']);
  }

  getFacilityList() {
    this.appointmentService.GetCustomFormattedGenericFacilities().subscribe(resp => {
      this.facilityList = resp
    })
  }

  onFacilityChange(selectedFacility) {
    this.getCustomFormattedPatientAppointments(this.selected_date, selectedFacility ? selectedFacility.id : '');
  }


  onExpand(_rowData) {
    console.log(_rowData)
    this.getPatientMessage(_rowData.patientId);
    this.getpatientappointment(_rowData);
    this.getpatientinsurance(_rowData.patientId);
  }

  getPatientMessage(patientid) {
    let param = {
      // patientID: 35870
      patientID: patientid
    }
    this.patientMessage = [];
    this.patientManagementService.GetPatientMessages(param).subscribe(res => {
      this.patientMessage = res.Results;
    });
  }

  getpatientinsurance(patientid) {
    let param = {
      // 35871
      patientID: patientid
      // patientID: 35871
    }
    this.patientInsurance = null
    this.patientManagementService.GetPatientInsurance(param).subscribe(res => {
      if (typeof res !== 'undefined' && res.length > 0) {
        this.showInsurance = false
        this.patientInsurance = res
        console.log("insurance", this.patientInsurance)
      }

    });
  }
  getpatientappointment(rowData) {
    let param = {
      // 35870
      patientid: rowData.patientId
    }
    this.patientAppointment = null
    this.patientManagementService.GetPatientAppointment(param).subscribe(res => {
      if (typeof res !== 'undefined' && res.length > 0) {

        this.patientAppointment = res;
        this.patientAppointment.appointmentstatus = rowData.appointmentStatus
        this.showAppointments = false;
        console.log("appointment", this.patientAppointment)
      }
    })
  }


  onSelectedRow(_rowData) {
    this.patient_details = _rowData;
  }

  getNovisitAppointments() {
    let payload = {
      Datetime: this.selected_date ? moment(this.selected_date).format('YYYY-MM-DD 00:00') : moment(new Date()).format('YYYY-MM-DD 00:00'),
      offset: 0,
      limit: 5,
    }
    this.patient_documents_list = [];
    this.patientAction.getNovisitAppointments(payload).subscribe((results: any) => {
      this.patient_documents_list = results.Results;
    })
  }


  toggleButton(_rowData) {
    this.payload.physicianId = _rowData.physicianId;
    this.getCustomFormattedPatientAppointments(this.selected_date);
    // this.patientAction.getAccountSummary(this.payload).subscribe(result=> {

    // })
  }

  onToggleQueue(toggle) {
    this.myQueue = toggle;
    this.getCustomFormattedPatientAppointments(this.selected_date);
  }

  verifyEligibility(rowData) {
    const modalRef = this.modalService.open(EligibilityverificationComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.patientData = rowData;
  }

  markAppCompleted(patient_details) {
    this.appointmentService.GetAppointmentById(patient_details.appointmentid).subscribe((results: any) => {
      let payload = results[0];
      payload.AppointmentStatus = 'Completed'
      payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      payload.DateLastUpdated = moment(new Date()).format('YYYY-MM-DD')
      this.appointmentService.UpdateAppointment(payload).subscribe(result => {
        // this.toastr.success('added copay successfully');
        this.getCustomFormattedPatientAppointments(this.selected_date);
      })
    })
  }
  retuenApptToCheckIn(patient_details) {
    this.appointmentService.GetAppointmentById(patient_details.appointmentid).subscribe((results: any) => {
      let payload = results[0];
      payload.AppointmentStatus = 'Scheduled'
      payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      payload.DateLastUpdated = moment(new Date()).format('YYYY-MM-DD')
      this.appointmentService.UpdateAppointment(payload).subscribe(result => {
        // this.toastr.success('added copay successfully');
        this.getCustomFormattedPatientAppointments(this.selected_date);
      })
    })
  }

  checkInAppt(patient_details) {
    this.appointmentService.GetAppointmentById(patient_details.appointmentid).subscribe((results: any) => {
      let payload = results[0];
      payload.AppointmentStatus = 'Arrived'
      payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      payload.DateLastUpdated = moment(new Date()).format('YYYY-MM-DD')
      this.appointmentService.UpdateAppointment(payload).subscribe(result => {
        // this.toastr.success('added copay successfully');
        this.getCustomFormattedPatientAppointments(this.selected_date);
      })
    })
  }

  opneEditPatient(rowData) {
    this.selectedPatientId = rowData.patientId;
    this.router.navigate(['/pages/workspace/patientmanagement/registerpatient', this.selectedPatientId], { skipLocationChange: true });
    this.activeModal.dismiss('Cross click')
  }
  openAddEditAppt() {
    this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
  }
  selectedRoom: any;
  updateRoomAppt(_rowData) {
    this.appointmentService.GetAppointmentById(_rowData.appointmentid).subscribe((results: any) => {
      let payload = results[0];
      payload.RoomId = this.selectedRoom.RoomId;
      //  payload.roomName = this.selectedRoom.RoomName;
      payload.DateLastUpdated = moment(new Date(), 'YYYY-MM-DD');
      payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      this.appointmentService.UpdateAppointment(payload).subscribe(result => {
        this.getCustomFormattedPatientAppointments(this.selected_date);
      })
    })
  }


}
