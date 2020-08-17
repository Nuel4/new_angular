import { Component, OnInit, ViewEncapsulation,ViewChild, Input, Output, EventEmitter,ElementRef } from '@angular/core';
import { AppointmentService } from './../../../../services/workspace/appointment.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any
import * as moment from 'moment';
import { Appointment } from './../../../../model/appointment.model';
import { Visit } from './../../../../model/visit.model';
import { CalendarDate } from './../../../../model/calendardate.model';
import { RefPhyComponent } from './../../../scheduling/ref-phy/ref-phy.component';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { ModelviewComponent } from './../../../../theme/components/modelview/modelview.component';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DetailsModalComponent } from './details-modal/details-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAppointmentComponent implements OnInit {
  @ViewChild('findPatient') private _selector: ElementRef;
  @ViewChild('lgModal') private _poup: ElementRef;
  @Input() selectedData;
  @Input() bookAppointment;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  isUpdate: boolean = false
  SelectedFacility: any = { id: 0 }
  isCancel: boolean = false
  facilityList: any = []
  UserList: any = []
  SelecetedUser: any = { userId: 0 }
  PatientType: any = []
  SelectedType: any = { AppointmentTypeId: 0 }
  RefOrganization: any = []
  SelectedRefOrg: any
  RefPhysician: any = []
  SelecetedRefPhy: any = { referringphysicianid: 0 }
  InternalRefPhysician: any = []
  SelecetedInternalRefPhysician: any
  Rooms: any = []
  SelecetedRoom: any = { RoomId: 0 }
  Statuslist: any = []
  SelecetedStatus: any
  cancelReasonList: any
  SelectedReason: any
  cols: any[]
  verifyTable: any[]
  isLoader: boolean = false
  businessHours: any
  apptid: any
  //form variables
  lastname: string
  firstname: string
  uniqueNumber: any
  DateOfBirth: any
  phoneno: any
  selfpayappt: boolean
  AppointmentDate: any
  startTime: any
  endTime: any
  sendReminder: boolean = true
  reminderDate: any = new Date()
  medCoPay: any = null
  comment: any = null
  RequiredCopay: any = null
  officeVisited: boolean
  enableDetailsModal: boolean = false;
  enableNoResults: boolean = false;
  Storedpatient = JSON.parse(sessionStorage.getItem('PatientDetail'))
  Storeduser = JSON.parse(sessionStorage.getItem('UserDetail'))
  calendarDate: CalendarDate
  visit: Visit
  AddApptForm: FormGroup
  availbilityException: any;
  reasonSelected: boolean = true;
  verificationDetails: any = {};
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private apptService: AppointmentService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,private router: Router,) { }

  ngOnInit() {
    console.log(this.selectedData,'this.selectedData')
    this.isUpdate = this.selectedData && this.selectedData.isUpdate
    this.isCancel = this.selectedData && this.selectedData.isCancel
    if (this.selectedData && !this.selectedData.isCancel) {
      this.AddApptForm = new FormGroup({
        lastname: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.LastName ? this.selectedData.ApptObj.LastName : this.Storedpatient ? this.Storedpatient.LastName : '' : this.Storedpatient ? this.Storedpatient.LastName : ''),
        firstname: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.FirstName ? this.selectedData.ApptObj.FirstName : this.Storedpatient ? this.Storedpatient.FirstName : '' : this.Storedpatient ? this.Storedpatient.FirstName : ''),
        uniqueNumber: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.UniqueNumber : this.Storedpatient ? this.Storedpatient.UniqueNumber : 'null'),
        DateOfBirth: new FormControl(moment(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.DateOfBirth : this.Storedpatient ? this.Storedpatient.DateOfBirth : '').format("YYYY-MM-DD")),
        phoneno: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.MobilePhone : this.Storedpatient ? this.Storedpatient.MobilePhone : ''),
        selfpayappt: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.FlagSelfPayPatient : false),
        AppointmentDate: new FormControl(new Date(this.selectedData.start ? this.selectedData.start : ''), Validators.required),
        startTime: new FormControl(new Date(this.selectedData.start ? this.selectedData.start : ''), Validators.required),
        endTime: new FormControl(new Date(this.selectedData.end ? this.selectedData.end : ''), Validators.required),
        sendReminder: new FormControl(false),
        reminderDate: new FormControl({ value: this.selectedData.isUpdate || this.selectedData.patientData ? new Date(this.selectedData.ApptObj.reminder_date) : new Date(), disabled: false }),
        medCoPay: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.co_pay_amount == null ? '' : this.selectedData.ApptObj.co_pay_amount : ''),
        comment: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.comments : ''),
        RequiredCopay: new FormControl(''),
        officeVisited: new FormControl(this.selectedData.isUpdate || this.selectedData.patientData ? this.selectedData.ApptObj.is_specialist_visit : false),
        SelecetedUser: new FormControl('', Validators.required),
        SelectedFacility: new FormControl('', Validators.required),
        SelectedType: new FormControl('', Validators.required),
        SelecetedRefPhy: new FormControl(''),
        SelecetedRoom: new FormControl(''),
        SelectedRefOrg: new FormControl(''),
        SelecetedInternalRefPhysician: new FormControl('')
      })
      this.selfpayappt = this.selectedData.isUpdate ? this.selectedData.ApptObj.FlagSelfPayPatient : false
      this.loadFacility()
      this.loadRefPhy()
      this.loadRelOrg()
      this.getAppointmentType()
    } else {
      this.loadCancelReasons()
      this.apptid = this.selectedData && this.selectedData.ApptObj
    }

    this.cols = [
      { field: 'VerificationDate', header: 'Verification Date' },
      { field: 'InsuranceProvider', header: 'Insurance Provider' },
      { field: 'Physician', header: 'Physician' },
      { field: 'Status', header: 'Status' },
      { field: 'InquiryResult', header: 'Inquiry Result' },
      { field: 'Details', header: 'Details' },
      { field: 'Print', header: 'Print' }
    ];
    this.verifyTable = [
      { VerificationDate: '2-2-2019', InsuranceProvider: 'Cigna', Physician: 'Login Test', Status: 'Rejected' }
    ];
    if (this.selectedData.isDropped) {
      this.UpdateAppointment()
    }
  }
  openDetailsModal() {
    alert();
    let payload = {
      patientName: this.AddApptForm.value.lastname + ' ' + this.AddApptForm.value.firstname,
      limit: 3,
      offset: 0
    }
    this.apptService.getPatientEligibilityVerificationforPaitent(payload).subscribe((res:any)=>{
      if(res.Results.length > 0) {
        let modalRef = this.modalService.open(DetailsModalComponent, { centered: true, size: 'lg' })
      modalRef.componentInstance.enableDetailsModal = true;
      modalRef.componentInstance.verificationDetails = res;
      modalRef.componentInstance.payload = payload;
      } else {
        let modalRef = this.modalService.open(DetailsModalComponent, { centered: true, size: 'sm' })
        modalRef.componentInstance.enableNoResults = true;
      }
    })
  }

  onSubmit() {
    if (!this.isUpdate)
      this.CreateNewAppointment()
    else
      this.UpdateAppointment()
  }
  selectionChanged(){
    if(this.SelectedReason == null){
      this.reasonSelected = true;
    } else {
      this.reasonSelected = false;
    }
  }
  disableReminderDate() {
    this.AddApptForm.controls['reminderDate'][!this.sendReminder ? 'disable' : 'enable']()
  }

  getAppointmentReasons() {
    this.apptService.GetAppointmentReasons().subscribe(resp => {
    })
  }

  getAppointmentType() {
    this.apptService.GetAppointmentType().subscribe(resp => {
      this.PatientType = resp
      // filtering the array
      this.SelectedType = this.selectedData.isUpdate ? this.PatientType.filter(item => item.AppointmentTypeId == this.selectedData.ApptObj.appointment_type_id)[0] : null
      this.AddApptForm.patchValue({ SelectedType: this.selectedData.isUpdate ? this.PatientType.filter(item => item.AppointmentTypeId == this.selectedData.ApptObj.appointment_type_id)[0] : null })
     
    })
  }

  loadFacility() {
    this.apptService.GetCustomFormattedGenericFacilities().subscribe(resp => {
      this.facilityList = resp
      this.SelectedFacility = this.selectedData.isUpdate ? this.facilityList.filter(item => item.id == this.selectedData.ApptObj.DefaultFacility) : this.selectedData.facility
      this.AddApptForm.patchValue({ SelectedFacility: this.selectedData.isUpdate ? this.facilityList.filter(item => item.id == this.selectedData.ApptObj.facility_id)[0] : this.selectedData.facility })
      
      this.loadUsers()
      this.loadRoom()
    })
  }

  getBusinessHourOfUser() {
    this.apptService.GetPhysicianFacilityWeeklySchedule(this.SelectedFacility.id, this.SelecetedUser.userid).subscribe(resp => {
      this.businessHours = resp
    })
  }

  loadRoom() {
    if(this.SelectedFacility) {
    this.apptService.GetRoomsByFacilityId(this.SelectedFacility.id).subscribe(resp => {
      this.Rooms = resp
      this.Rooms.map(item => {
        if (item.RoomId == (this.selectedData && this.selectedData.ApptObj.room_Id)) {
          this.SelecetedRoom = item
          this.AddApptForm.patchValue({ SelectedRoom: item })
        }
      })

    })
  }
  }

  loadCancelReasons() {
    this.apptService.GetAppointmentCancellationReason().subscribe(resp => {
      this.cancelReasonList = resp
    })
  }

  cancelAppointment(CApptobject) {
    let CancelingAppt
    console.log("CApptobject", CApptobject)
    console.log("this.selectedData", this.selectedData)
    this.apptService.GetAppointmentById(this.selectedData.ApptObj).subscribe(resp => {
      console.log("resp", resp[0])
      resp[0].CancelledStatus = CApptobject.Description
      resp[0].CancelledByUserId = this.Storeduser.UserId
      resp[0].AppointmentStatus = 'Cancelled'
      resp[0].DateCancelled = moment(new Date()).format("YYYY-MM-DD HH:mm")
      CancelingAppt = resp[0]
      this.apptService.UpdateAppointment(CancelingAppt).subscribe(resp => {
        this.showSuccess("Appointment Canceled Successfully.")
        this.loadEvent.emit(true)
      })
    })
  }

  getActivePhysicianUsers() {
    this.apptService.GetActivePhysicianUsers(this.SelectedFacility.id).subscribe(resp => {
    })
  }

  loadUsers() {
    if(this.SelectedFacility){
      const idSelected = this.SelectedFacility.id ? this.SelectedFacility.id : this.AddApptForm.value.SelectedFacility.id;
    this.apptService.GetActiveUsersForApptDiary(idSelected).subscribe(resp => {
      this.UserList = resp
      this.SelecetedUser = this.selectedData.isUpdate ?
        this.UserList.filter(item => item.userId == this.selectedData.ApptObj.user_id)[0] : this.selectedData.user
      this.AddApptForm.patchValue({
        SelecetedUser: this.selectedData.isUpdate ?
          this.UserList.filter(item => item.userId == this.selectedData.ApptObj.user_id)[0] : this.selectedData.user
      })
    })
  }
  }

  reLoadRoomUser(faciltiy) {
    this.SelectedFacility = faciltiy
    this.loadUsers()
    this.loadRoom()
    this.getBusinessHourOfUser()
  }

  loadRefPhy() {
    this.apptService.GetCustomFormattedReferringPhysician().subscribe(resp => {
      this.RefPhysician = resp
      this.SelecetedRefPhy = this.selectedData.isUpdate ?
        this.RefPhysician.filter(item => item.referringphysicianid == this.selectedData.ApptObj.referring_physician_id ? this.selectedData.ApptObj.referring_physician_id : {})[0] : {}
      this.AddApptForm.patchValue({
        SelecetedRefPhy: this.selectedData.isUpdate ?
          this.RefPhysician.filter(item => item.referringphysicianid == this.selectedData.ApptObj.referring_physician_id ? this.selectedData.ApptObj.referring_physician_id : {})[0] : {}
      })
    })
  }

  loadRelOrg() {
    this.apptService.GetCustomFormattedRelatedOrganization().subscribe(resp => {
      this.RefOrganization = resp
      this.SelectedRefOrg = this.selectedData.isUpdate ?
        this.RefOrganization.filter(item => item.id == this.selectedData.ApptObj.referring_physician_id ? this.selectedData.ApptObj.referring_physician_id : {})[0] : {}
      this.AddApptForm.patchValue({
        SelectedRefOrg: this.selectedData.isUpdate ?
          this.RefOrganization.filter(item => item.id == this.selectedData.ApptObj.referring_physician_id ? this.selectedData.ApptObj.referring_physician_id : {})[0] : {}
      })
    })
  }

  onApptTypeChanged() {
    this.AddApptForm.patchValue({
      endTime: new Date(moment(this.AddApptForm.value.startTime).add(this.AddApptForm.value.SelectedType.AppointmentDurations, 'minute').toLocaleString())
    })
  }


  findPatient(input_data = '') {
    // $("#lgModal").find('input[name="patientObj.lastname"]').val(input_data);
    const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.openPopUp = true;
    modalRef.componentInstance.popupData = input_data ? input_data : '';
    // $("#lgModal").modal('show');   
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      this.Storedpatient = JSON.parse(sessionStorage.getItem('PatientDetail'))
      if (value) {
        this.AddApptForm.patchValue({
          lastname: this.selectedData.isUpdate ? this.selectedData.ApptObj.LastName ? this.selectedData.ApptObj.LastName : '' : this.Storedpatient ? this.Storedpatient.LastName : '',
          firstname: this.selectedData.isUpdate ? this.selectedData.ApptObj.FirstName : this.Storedpatient ? this.Storedpatient.FirstName : '',
          uniqueNumber: this.selectedData.isUpdate ? this.selectedData.ApptObj.UniqueNumber : this.Storedpatient ? this.Storedpatient.UniqueNumber : 'null',
          DateOfBirth: moment(this.selectedData.isUpdate ? this.selectedData.ApptObj.DateOfBirth : this.Storedpatient ? this.Storedpatient.DateOfBirth : 'null').format("YYYY-MM-DD"),
          phoneno: this.selectedData.isUpdate ? this.selectedData.ApptObj.MobilePhone : this.Storedpatient ? this.Storedpatient.MobilePhone : 'null',
          selfpayappt: this.selectedData.isUpdate ? this.selectedData.ApptObj.FlagSelfPayPatient : false,
        })
      }
    })
  }

  dateformater(date) {
    let d = new Date(date);
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }

  onCancelBtn() {
    this.loadEvent.emit(true)
    this.activeModal.dismiss('Cross click')
  }

  UpdateAppointment() {
    this.isLoader = true
    let ApptID, isSuccess = false
    let visit = {
      VisitId: this.selectedData.ApptObj.visit_id,
      PatientId: this.selectedData.ApptObj.patient_id,
      FacilityId: this.AddApptForm.value.SelectedFacility.id,
      VisitDate: moment(this.selectedData.ApptObj.VisitDate).format("YYYY-MM-DD HH:mm"),
      CoPayAmount: this.AddApptForm.value.RequiredCopay,
      PaymentMethod: this.AddApptForm.value.selfpayappt ? 'Cash' : 'Other',
      CheckNumber: "",
      InsuranceVerificationDone: false,
      CreditCardVerificationDone: false,
      Comments: this.AddApptForm.value.comment,
      Billed: false,
      DateCreated: moment(this.selectedData.ApptObj.date_created).format("YYYY-MM-DD HH:mm"),
      CreatedByUserId: this.selectedData.ApptObj.confirmed_by_user_id,
      DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      LastUpdatedByUserId: this.Storeduser.UserId,
      Appointments: [
        {
          AppointmentId: this.selectedData.ApptObj.appointment_id,
          VisitId: this.selectedData.ApptObj.visit_id,
          PatientId: this.selectedData.ApptObj.patient_id,
          AppointmentStatus: this.selectedData.ApptObj.appointment_status,
          AppointmentReasonId: this.selectedData.ApptObj.appointment_reason_id,
          AppointmentTypeId: this.AddApptForm.value.SelectedType ? this.AddApptForm.value.SelectedType.AppointmentTypeId : null,
          SendReminder: this.AddApptForm.value.sendReminder,
          ReminderDate: moment(this.AddApptForm.value.reminderDate).format("YYYY-MM-DD HH:mm"),
          SmsReminderSent: false,
          EmailReminderSent: false,
          PhoneReminderMade: false,
          PhoneReminderByUserId: this.Storeduser.UserId,
          Comments: this.AddApptForm.value.comment,
          CheckInTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD HH:mm"),
          DateCreated: moment(this.selectedData.ApptObj.date_created).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.selectedData.ApptObj.confirmed_by_user_id,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.Storeduser.UserId,
          ExceptionAppointments: null,
          CoPayAmount: this.AddApptForm.value.RequiredCopay,
          PaymentMethod: this.AddApptForm.value.selfpayappt ? "Cash" : "Other",
          CheckNumber: "0000",
          InsuranceCopayRequired: this.AddApptForm.value.RequiredCopay,
          IsCopayPercentage: true,
          Confirmed: true,
          ConfirmedStatus: "Not Completed",
          ConfirmedByUserId: this.Storeduser.UserId,
          DateConfirmed: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CancelledStatus: null,
          CancelledByUserId: null,
          DateCancelled: null,
          ReferringPhysicianId: this.AddApptForm.value.SelecetedRefPhy.referringphysicianid > 0 ? this.SelecetedRefPhy.referringphysicianid : null,
          InternalReferringPhysicianId: null,
          IsSpecialistVisit: this.AddApptForm.value.officeVisited ? 1 : 0,
          FlagSelfPayPatient: this.AddApptForm.value.selfpayappt ? 1 : 0,
          Deductible: 0,
          CoInsurancePatientAmount: 0,
          CoInsurancePatientPercentage: 0,
          IsWalkIn: 1,
          InsuranceCoInsuranceRequired: 0,
          InsuranceDeductibleRequired: 0,
          PriorAuthorizationNumber: "XYZ",
          AllowedVisits: 0,
          VisitsUsed: 0,
          ReferralStartDate: null,
          ReferralExpiryDate: null,
          ExternalReferenceId: "XYZ",
          DoNotBillAppointment: 1,
          CaseNumber: 0,
          RoomId: this.AddApptForm.value.SelecetedRoom.RoomId > 0 ? this.AddApptForm.value.SelecetedRoom.RoomId : null
        }]
    }
    let slot, calendarDate
    this.apptService.UpdateVisitsAppointment(visit).subscribe(resp => {
      calendarDate = {
        ScheduledDate: moment(this.AddApptForm.value.AppointmentDate).format('YYYY-MM-DD HH:mm'),
        PhysicianId: this.AddApptForm.value.SelecetedUser.physicianId,
        ResourceId: null,
        RoomId: this.AddApptForm.value.SelecetedRoom.RoomId > 0 ? this.AddApptForm.value.SelecetedRoom.RoomId : null,
        DateCreated: this.selectedData.ApptObj.date_created,
        CreatedByUserId: this.selectedData.ApptObj.confirmed_by_user_id,
        DateLastUpdated: this.dateformater(new Date),
        LastUpdatedByUserId: this.Storeduser.UserId,
        UserId: this.AddApptForm.value.SelecetedUser.userId,
        ScheduledSlots: [
          {
            ScheduledSlotId: this.selectedData.ApptObj.scheduled_slot_id,
            CalendarDateId: this.selectedData.ApptObj.calendar_date_id,
            AppointmentId: this.selectedData.ApptObj.appointment_id,
            EventDescription: this.AddApptForm.value.comment,
            StartTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD") + " " + moment(this.AddApptForm.value.startTime).format("HH:mm"),
            EndTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD") + " " + moment(this.AddApptForm.value.endTime).format("HH:mm"),
            DateCreated: this.selectedData.ApptObj.date_created,
            CreatedByUserId: this.selectedData.ApptObj.confirmed_by_user_id,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.Storeduser.UserId,
            PhysicianId: this.AddApptForm.value.SelecetedUser.physicianId,
            UserId: this.AddApptForm.value.SelecetedUser.userId,
          }
        ]
      }
      slot = {
        ScheduledSlotId: this.selectedData.ApptObj.scheduled_slot_id,
        CalendarDateId: this.selectedData.ApptObj.calendar_date_id,
        AppointmentId: this.selectedData.ApptObj.appointment_id,
        EventDescription: this.AddApptForm.value.comment,
        StartTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD") + " " + moment(this.AddApptForm.value.startTime).format("HH:mm"),
        EndTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD") + " " + moment(this.AddApptForm.value.endTime).format("HH:mm"),
        DateCreated: this.selectedData.ApptObj.date_created,
        CreatedByUserId: this.selectedData.ApptObj.confirmed_by_user_id,
        DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        LastUpdatedByUserId: this.Storeduser.UserId,
        PhysicianId: this.AddApptForm.value.SelecetedUser.physicianId,
        UserId: this.AddApptForm.value.SelecetedUser.userId,
      }
      this.apptService.UpdateCalendarDatesSchduleSlot(calendarDate).subscribe(resp => {
        this.loadEvent.emit(true)

        this.showSuccess("Appointment Updated Successfully")
        isSuccess = true
        this.activeModal.dismiss('Cross click')
      })
    })
    if (isSuccess) {
      this.loadEvent.emit(true)

    }
    this.isLoader = false
  }

  CreateNewAppointment() {    
    this.isLoader = true

    let ApptID, isSuccess = false

    this.visit = {
      PatientId: this.Storedpatient ? this.Storedpatient.PatientId : null,
      FacilityId: this.AddApptForm.value.SelectedFacility.id,
      VisitDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CoPayAmount: this.AddApptForm.value.RequiredCopay,
      PaymentMethod: this.AddApptForm.value.selfpayappt ? 'Cash' : 'Other',
      CheckNumber: "",
      InsuranceVerificationDone: false,
      CreditCardVerificationDone: false,
      Comments: this.AddApptForm.value.comment,
      Billed: false,
      DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CreatedByUserId: this.Storeduser.UserId,
      DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      LastUpdatedByUserId: this.Storeduser.UserId,
      Appointments: [
        {
          VisitId: 0,
          PatientId: this.Storedpatient ? this.Storedpatient.PatientId : null,
          AppointmentStatus: "Scheduled",
          AppointmentReasonId: null,
          AppointmentTypeId: this.AddApptForm.value.SelectedType && this.AddApptForm.value.SelectedType.AppointmentTypeId || null,
          SendReminder: this.AddApptForm.value.sendReminder,
          ReminderDate: moment(this.AddApptForm.value.reminderDate).format("YYYY-MM-DD HH:mm"),
          SmsReminderSent: false,
          EmailReminderSent: false,
          PhoneReminderMade: false,
          PhoneReminderByUserId: this.Storeduser.UserId,
          Comments: this.AddApptForm.value.comment,
          CheckInTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD HH:mm"),
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.Storeduser.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.Storeduser.UserId,
          ExceptionAppointments: null,
          CoPayAmount: this.AddApptForm.value.RequiredCopay,
          PaymentMethod: this.AddApptForm.value.selfpayappt ? "Cash" : "Other",
          CheckNumber: "0000",
          InsuranceCopayRequired: this.AddApptForm.value.RequiredCopay,
          IsCopayPercentage: true,
          Confirmed: true,
          ConfirmedStatus: "Not Completed",
          ConfirmedByUserId: this.Storeduser.UserId,
          DateConfirmed: null,
          CancelledStatus: null,
          CancelledByUserId: null,
          DateCancelled: null,
          ReferringPhysicianId: this.AddApptForm.value.SelecetedRefPhy.referringphysicianid > 0 ? this.AddApptForm.value.SelecetedRefPhy.referringphysicianid : null,
          InternalReferringPhysicianId: null,
          IsSpecialistVisit: this.AddApptForm.value.officeVisited ? 1 : 0,
          FlagSelfPayPatient: this.AddApptForm.value.selfpayappt ? 1 : 0,
          Deductible: 0,
          CoInsurancePatientAmount: 0,
          CoInsurancePatientPercentage: 0,
          IsWalkIn: 1,
          InsuranceCoInsuranceRequired: 0,
          InsuranceDeductibleRequired: 0,
          PriorAuthorizationNumber: "XYZ",
          AllowedVisits: 0,
          VisitsUsed: 0,
          ReferralStartDate: null,
          ReferralExpiryDate: null,
          ExternalReferenceId: "XYZ",
          DoNotBillAppointment: 1,
          CaseNumber: 0,
          RoomId: this.AddApptForm.value.SelecetedRoom.RoomId > 0 ? this.AddApptForm.value.SelecetedRoom.RoomId : null
        }]
    }
    this.apptService.AddVisitAppointment(this.visit).subscribe(resp => {
      ApptID = resp.Value.AppointmentId
      this.calendarDate = {
        ScheduledDate: moment(this.AddApptForm.value.AppointmentDate).format('YYYY-MM-DD HH:mm'),
        PhysicianId: this.AddApptForm.value.SelecetedUser.physicianId,
        ResourceId: null,
        RoomId: this.AddApptForm.value.SelecetedRoom.RoomId > 0 ? this.AddApptForm.value.SelecetedRoom.RoomId : null,
        DateCreated: this.dateformater(new Date),
        CreatedByUserId: this.Storeduser.UserId,
        DateLastUpdated: this.dateformater(new Date),
        LastUpdatedByUserId: this.Storeduser.UserId,
        UserId: this.AddApptForm.value.SelecetedUser.userId,
        ScheduledSlots: [
          {
            AppointmentId: ApptID,
            EventDescription: this.AddApptForm.value.comment,
            StartTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD") + " " + moment(this.AddApptForm.value.startTime).format("HH:mm"),
            EndTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD") + " " + moment(this.AddApptForm.value.endTime).format("HH:mm"),
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.Storeduser.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.Storeduser.UserId,
            PhysicianId: this.AddApptForm.value.SelecetedUser.physicianId,
            UserId: this.AddApptForm.value.SelecetedUser.userId,
          }
        ]
      }
      this.apptService.AddCalendarDateAndScheduleSlot(this.calendarDate).subscribe(resp => {
        this.loadEvent.emit(true)
        this.showSuccess("Appointment Added Successfully")
        this.activeModal.dismiss('Cross click')
      })

      isSuccess = true
    })
    if (isSuccess) {
      this.loadEvent.emit(true)

    }
    this.isLoader = false
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
  updateEndTime() {
    this.AddApptForm.value.SelectedType = { AppointmentDurations: 15};
    this.onApptTypeChanged()
  }
  changeTab(e){
    var index = e.index;
    this.apptService.getAvailabilityException().subscribe(res => {
      this.availbilityException = res;
    })
  }
}
