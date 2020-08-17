import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NavbarService } from '../../../services/navbar.service'
import { AuthenticationStore } from './../../../authentication/authentication-store';
import { PrescribeService } from './../../../services/chart/prescribe.service';
import { AppointmentService } from './../../../services/workspace/appointment.service';
import * as moment from 'moment';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-prescribe',
  templateUrl: './prescribe.component.html',
  styleUrls: ['./prescribe.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrescribeComponent implements OnInit {
  PracticeData: any
  UserData: any
  PatientData: any
  url: any;
  DbPractice: any
  Facility: any
  Physician: any
  EncounterId: any
  AppointmentId: any
  VisitId: any
  @ViewChild('iframe') iframe: ElementRef;
  ImmuInjection: any;
  routeParams: any;
  constructor(
    private nav: NavbarService,
    private PrescribeService: PrescribeService,
    private AuthStore: AuthenticationStore,
    private ApptService: AppointmentService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // alert(this.createGuid())
    this.routeParams = this.activatedRoute.snapshot.params.id
    console.log("route params", this.routeParams)
    this.PracticeData = this.AuthStore.PracticeDetail
    this.UserData = this.AuthStore.UserDetail
    this.PatientData = this.AuthStore.PatientDetail
    this.nav.hide()
    this.getPhysicianId()
    this.getPractice()
    this.getFaclityId()
    this.url = ""
    if(this.routeParams == 1){
      this.CreateNewAppointment()

    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // setTimeout(() => this.loadDrFirstUrl(), 3000)
    // this.loadDrFirstUrl()
    // this.iframe.nativeElement.src = this.url;
  }

  closePrescribe() {
    // window.close();
    let param = {
      userID: this.UserData.UserId,
      patientID: this.routeParams == 1 ? this.PatientData.PatientId : 0,
      facilityID: this.Facility.FacilityId,
      physcianID: this.Physician.PhysicianId,
      encounterId: this.routeParams == 1 ? this.EncounterId : 0,
      practiceId: this.PracticeData.PracticeId
    }
    this.PrescribeService.UpdateEPrescription(param).subscribe(resp => {
      console.log(resp)
      if(this.routeParams == 1){
        this.router.navigate(['pages/chart'], { skipLocationChange: false });
      } else {
        this.router.navigate(['pages/workspace'], { skipLocationChange: false });
    this.nav.show()
  }
    })
  }

  loadDrFirstUrl() {
    let page1 = undefined
    if(this.routeParams == 2) {
      page1 = 'message'
    } else if(this.routeParams == 3){
      page1 = 'report'
    }
    let param = {
      userID: this.UserData.UserId,
      patientID: this.routeParams == 1 ? this.PatientData.PatientId : 0,
      facilityID: this.Facility.FacilityId,
      physcianID: this.Physician.PhysicianId,
      page: page1
    }
    console.log(param)
    this.PrescribeService.getDrFirstServiceUrl(param).subscribe(resp => {
      console.log("url", resp)
      this.url = resp
      this.iframe.nativeElement.src = resp
    })
  }

  getPhysicianId() {
    this.PrescribeService.getPhysicianIDByUserId({ UserId: this.UserData.UserId }).subscribe(resp => {
      this.Physician = resp[0]
      console.log("Physician", this.Physician)
    })
  }

  getFaclityId() {
    this.PrescribeService.getFacilityByUserId({
      userId: this.UserData.UserId
    }).subscribe(resp => {
      this.Facility = resp[0]
      if(this.routeParams == 1){
        this.CreateNewAppointment()

      }
      console.log('facility', this.Facility)
      setTimeout(() => this.loadDrFirstUrl(), 3000)

    })
  }

  AddPatientEncounter() {
    let PatientEncounter = {
      PatientId: this.PatientData.PatientId,
      VisitId: this.VisitId,
      ChiefComplaintId: null,
      ChiefComplaint: "",
      AdditionalText: "",
      EncounterIndicatorId: null,
      Billed: false,
      PhysicianId: this.Physician.PhysicianId,
      FacilityId: this.Facility.FacilityId,
      TimeSpentOnConsultation: "",
      PhysicianInitials: "",
      DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CreatedByUserId: this.UserData.UserId,
      DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      LastUpdatedByUserId: this.UserData.UserId,
      AppointmentId: this.AppointmentId,
      SummaryDocument: "",
      MedicationReconciliationPerformed: false,
      DateOfMedicationReconciliation: null,
      MedicationNotPrescribed: false,
      SpecialityId: null,
      MrTemplateId: null,
      DepartmentId: null,
      CodeBasedOnTimeSpent: null,
      PresentingProblemRiskLevelId: null,
      DiagnosticProcedureOrderedRiskLevelId: null,
      ManagementOptionsSelectedRiskLevelId: null,
      LevelOfServiceCptCode: "",
      SkipLevelOfService: true,
      IsClinicalSummaryGivenToPatient: false,
      IsOfficeVisit: true,
      MrTemplateGroupId: null,
      ConsultationDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
      IsCompleted: false,
      CompletedBy: null,
      DateCompleted: null,
      Active: true
    }
    this.PrescribeService.postPatientEncounter(PatientEncounter).subscribe(resp => {
      console.log(resp)
      this.EncounterId = resp.MrPatientEncounterId
    })
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  CreateNewAppointment() {
    let isSuccess = false

    let visit = {
      PatientId: this.PatientData.PatientId,
      FacilityId: this.Facility.FacilityId,
      VisitDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CoPayAmount: "",
      PaymentMethod: "",
      CheckNumber: "",
      InsuranceVerificationDone: false,
      CreditCardVerificationDone: false,
      Comments: "Appointment created automatically when saving patient chart.",
      Billed: "",
      DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CreatedByUserId: this.UserData.UserId,
      DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      LastUpdatedByUserId: this.UserData.UserId,
      Appointments: [
        {
          VisitId: 0,
          PatientId: this.PatientData.PatientId,
          AppointmentStatus: "Completed_NoVisit",
          AppointmentReasonId: null,
          AppointmentTypeId: null,
          SendReminder: false,
          ReminderDate: "",
          SmsReminderSent: false,
          EmailReminderSent: false,
          PhoneReminderMade: false,
          PhoneReminderByUserId: "",
          Comments: "Appointment created automatically when saving patient chart.",
          CheckInTime: "",
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.UserData.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.UserData.UserId,
          ExceptionAppointments: null,
          CoPayAmount: "",
          PaymentMethod: "",
          CheckNumber: "",
          InsuranceCopayRequired: "",
          IsCopayPercentage: true,
          Confirmed: true,
          ConfirmedStatus: "",
          ConfirmedByUserId: this.UserData.UserId,
          DateConfirmed: null,
          CancelledStatus: null,
          CancelledByUserId: null,
          DateCancelled: null,
          ReferringPhysicianId: null,
          InternalReferringPhysicianId: null,
          IsSpecialistVisit: 0,
          FlagSelfPayPatient: 0,
          Deductible: 0,
          CoInsurancePatientAmount: 0,
          CoInsurancePatientPercentage: 0,
          IsWalkIn: 1,
          InsuranceCoInsuranceRequired: 0,
          InsuranceDeductibleRequired: 0,
          PriorAuthorizationNumber: "",
          AllowedVisits: 0,
          VisitsUsed: 0,
          ReferralStartDate: null,
          ReferralExpiryDate: null,
          ExternalReferenceId: "",
          DoNotBillAppointment: 1,
          CaseNumber: 0,
          RoomId: null
        }]
    }
    console.log(visit)
    this.ApptService.AddVisitAppointment(visit).subscribe(resp => {
      this.AppointmentId = resp.Value.AppointmentId
      this.VisitId = resp.Value.VisitId
      console.log("POST Appt:", this.AppointmentId)
      let calendarDate = {
        ScheduledDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
        PhysicianId: this.Physician.PhysicianId,
        ResourceId: null,
        RoomId: null,
        DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        CreatedByUserId: this.UserData.UserId,
        DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        LastUpdatedByUserId: this.UserData.UserId,
        UserId: this.UserData.UserId,
        // UserId: this.Storeduser.UserId,
        ScheduledSlots: [
          {
            AppointmentId: this.AppointmentId,
            EventDescription: "",
            StartTime: moment(new Date).format("YYYY-MM-DD HH:mm"),
            EndTime: moment(new Date).format("YYYY-MM-DD HH:mm"),
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.UserData.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.UserData.UserId,
            PhysicianId: this.Physician.PhysicianId,
            UserId: this.UserData.UserId,
            // UserId: this.Storeduser.UserId,
          }
        ]
      }
      console.log(calendarDate)
      this.ApptService.AddCalendarDateAndScheduleSlot(calendarDate).subscribe(resp => {
        if(this.routeParams == 1) {
          this.AddPatientEncounter()
        }
      })
    })
  }

  getInjectionByPatientId() {
    this.PrescribeService.getCustomFormattedInjectionsbyPatientID(this.PatientData.PatientId).subscribe(resp => {
      this.ImmuInjection = resp
      console.log(resp)
    })
  }

  getPractice() {
    this.PrescribeService.getPracticeById(this.PracticeData.PracticeId).subscribe(resp => {
      console.log('practisedata', resp)
      this.DbPractice = resp
      // this.url += this.DbPractice.DrFirstPracticeStagingPortalUrl
    })
  }
}
