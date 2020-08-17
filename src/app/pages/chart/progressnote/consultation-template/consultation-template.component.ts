import { registerLocaleData } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProgressnoteService } from './../../../../services/chart/progressnote.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment' 
import {AuthenticationStore} from '../../../../authentication/authentication-store'
import {AppointmentService} from '../../../../services/workspace/appointment.service'
@Component({
  selector: 'app-consultation-template',
  templateUrl: './consultation-template.component.html',
  styleUrls: ['./consultation-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultationTemplateComponent implements OnInit {
  TemplateList: any;
  GenericFacilityList: any;
  Identifier: any = [];
  PhysicianList: any;
  userDetails: any;
  preferredTemplateList: any = [];
  patientDetails: any;
  newVisit: any = true
  followVisit: any = 'Follow-up Visit';
  selectedPreTemplate: any = {};
  getSectionId: any = [];
  selectedTemplate: any = {};
  selectedFacility: any;
  selectedAppointment: any;
  filteredTemplate: any = [];
  name: any;
  appointmentList: any;
  consultationDate = new Date();
  physician: any;
  cols = [
    {
      header: 'Appointment date',
      field: 'scheduleddate'
    },
    {
      header: 'Start date',
      field: 'StartTime'
    },
    {
      header: 'End date',
      field: 'EndTime'
    },
    {
      header: 'Physician name',
      field: 'PhysicianName'
    }
  ]
  appointmentChosen: boolean = false
  constructor(
    private progressService: ProgressnoteService,
    private activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private authStore: AuthenticationStore
  ) { }

  ngOnInit() {
    this.patientDetails = this.authStore.PatientDetail
    this.userDetails = this.authStore.UserDetail
    this.physician  = this.authStore.PhysicianDetail
    console.log('this.authStore.PhysicianDetail :', this.authStore.PhysicianDetail);
    // this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    // this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.getDueCheckinAppointmentList()
  }

  getActiveTemplateGroup() {
    this.progressService.getActiveMrTemplateGroup().subscribe((results: any) => {
      this.TemplateList = results;
      console.log("the template lists", this.TemplateList)
      this.visitTypeSelect('New Visit')
    })
  }
  visitTypeSelect(type) {
    this.filteredTemplate = [];
    this.TemplateList.forEach((value) => {
      if (value.VisitType === type) {
        this.filteredTemplate.push(value);
      }
    })
    console.log(this.filteredTemplate)
  }
  getCustomFormattedGenericFacilities() {
    this.progressService.getCustomFormattedFacility().subscribe((results: any) => {
      this.GenericFacilityList = results;
      this.selectedFacility = results[0]
      console.log("generic facility list:", this.GenericFacilityList)
    })
  }

  getPhysicianbyUserId() {
    let param = {
      userId: this.userDetails.UserId
    }
    this.progressService.getPhysicianbyUserId(param).subscribe((results: any) => {
      this.PhysicianList = results;
      console.log("physician:", this.PhysicianList)
      this.getPhysicianCommonTempGroups();
    })
  }

  getUserSpecialityList() {
    let param = {
      pUserId: this.userDetails.userId
    }
    this.progressService.getUserSpeciality(param).subscribe((results: any) => {
      console.log("user speciality list:", results)
    })
  }

  getDueCheckinAppointmentList() {

    let param = {
      patientID: this.patientDetails.PatientId
    }
    this.progressService.getDueCheckinAppointments(param).subscribe((results: any) => {
      console.log("Checkin appointments list:", results)
      if (results.length === 0) {
        this.name = 'newAppointment'
        this.getActiveTemplateGroup()
        this.getCustomFormattedGenericFacilities()
        this.getPhysicianbyUserId()
      } else {
        this.name = 'existingAppointment'
        this.appointmentList = results   
      this.appointmentList.forEach((item) => {
        item.scheduleddate = moment(item.scheduleddate).format('DD/MM/YYYY')
        item.StartTime = moment(item.StartTime).format('hh:mm a')
        item.EndTime = moment(item.EndTime).format('hh:mm a')
      })   }
    })
  }

  getPhysicianCommonTempGroups() {
    let param = {
      physicianId: this.PhysicianList[0].PhysicianId
    }
    this.progressService.getPhysicianCommonTemplateGroups(param).subscribe((results: any) => {
      this.preferredTemplateList = results;
      this.selectedPreTemplate = results[0]
      this.progressService.templateType.emit(this.preferredTemplateList)
    })
  }

  loadTemplates() {
    sessionStorage.setItem("ProgressnoteFacility", JSON.stringify(this.selectedFacility))
sessionStorage.setItem("ConsultationDate", JSON.stringify(this.consultationDate))
    let MrTemplateGroupId = this.selectedTemplate.MrTemplateGroupId !== undefined ? this.selectedTemplate.MrTemplateGroupId : this.selectedPreTemplate.MrTemplateGroupId
    this.router.navigateByUrl('/pages/refresh', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/pages/chart/template-editor'], { queryParams: { Id: MrTemplateGroupId } })
      // this.selectButton();
    })
  }
  loadClick(){
    if(this.appointmentChosen){
      this.activeModal.dismiss();
this.loadTemplates()
    }else {
      this.CreateNewAppointment()
    }
  }

  selectButton() {
    console.log('dropdown selected', this.selectedTemplate)
    let param = {
      templateGroupId: this.selectedTemplate.MrTemplateGroupId !== undefined ? this.selectedTemplate.MrTemplateGroupId : this.selectedPreTemplate.MrTemplateGroupId
    }
    this.progressService.getTemplateGroupSection(param).subscribe(res => {
      var tempList: any = []
      this.Identifier = res;
      this.Identifier.forEach((value) => {

        this.getSectionId.push(value.MrTemplateSectionId)
        tempList.push(value)
      })
      this.progressService.templateType.next(tempList)
      console.log('bbbb', this.progressService.templateType)
      console.log('temporary group id', res)
    })
  }

  templateChanged(changedVal) {
    if (changedVal === 'Preferred')
      this.selectedTemplate = []
    else if (changedVal === 'Template')
      this.selectedPreTemplate = []
  }
  onRowSelect(event) {
    console.log("selectedAppointment", this.selectedAppointment)
    sessionStorage.setItem("Appointment", JSON.stringify(this.selectedAppointment))
    this.name = 'newAppointment'
    this.appointmentChosen = true
    this.getActiveTemplateGroup()
    this.getCustomFormattedGenericFacilities()
    this.getPhysicianbyUserId()
  }
  newAppointment() {
    this.name = 'newAppointment'
    this.appointmentChosen = false
    this.getActiveTemplateGroup()
    this.getCustomFormattedGenericFacilities()
    this.getPhysicianbyUserId()
  }
  CreateNewAppointment() {   
console.log('this.physician :', this.physician);
    let ApptID, isSuccess = false

    let visit = {
      PatientId: this.patientDetails ? this.patientDetails.PatientId : null,
      FacilityId: this.selectedFacility? this.selectedFacility.id : null, 
      VisitDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
      // CoPayAmount: this.AddApptForm.value.RequiredCopay,
      // PaymentMethod: this.AddApptForm.value.selfpayappt ? 'Cash' : 'Other',
      CheckNumber: "",
      InsuranceVerificationDone: false,
      CreditCardVerificationDone: false,
      // Comments: this.AddApptForm.value.comment,
      Billed: false,
      DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
      LastUpdatedByUserId: this.userDetails.UserId,
      Appointments: [
        {
          VisitId: 0,
          PatientId: this.patientDetails ? this.patientDetails.PatientId : null,
          AppointmentStatus: "Scheduled",
          AppointmentReasonId: null,
          AppointmentTypeId: null,
          // SendReminder: this.AddApptForm.value.sendReminder,
          // ReminderDate: moment(this.AddApptForm.value.reminderDate).format("YYYY-MM-DD HH:mm"),
          SmsReminderSent: false,
          EmailReminderSent: false,
          PhoneReminderMade: false,
          // PhoneReminderByUserId: this.Storeduser.UserId,
          // Comments: this.AddApptForm.value.comment,
          // CheckInTime: moment(this.AddApptForm.value.AppointmentDate).format("YYYY-MM-DD HH:mm"),
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.userDetails.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.userDetails.UserId,
          ExceptionAppointments: null,
          // CoPayAmount: this.AddApptForm.value.RequiredCopay,
          // PaymentMethod: this.AddApptForm.value.selfpayappt ? "Cash" : "Other",
          CheckNumber: "0000",
          // InsuranceCopayRequired: this.AddApptForm.value.RequiredCopay,
          IsCopayPercentage: true,
          Confirmed: true,
          ConfirmedStatus: "Not Completed",
          ConfirmedByUserId: this.userDetails.UserId,
          DateConfirmed: null,
          CancelledStatus: null,
          CancelledByUserId: null,
          DateCancelled: null,
          ReferringPhysicianId: this.physician.PhysicianId,
          InternalReferringPhysicianId: null,
          IsSpecialistVisit: 0,
          FlagSelfPayPatient: 0,
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
          // RoomId: this.AddApptForm.value.SelecetedRoom.RoomId > 0 ? this.AddApptForm.value.SelecetedRoom.RoomId : null
        }]
    }
    this.appointmentService.AddVisitAppointment(visit).subscribe(resp => {
      let endTime = moment(this.consultationDate).add(30, 'minutes')
      ApptID = resp.Value.AppointmentId
      console.log('appointmentService:', resp);
      this.selectedAppointment = resp.Value
      sessionStorage.setItem("Appointment", JSON.stringify(this.selectedAppointment))
      let calendarDate = {
        ScheduledDate: this.dateformater(new Date),
        PhysicianId: this.physician.PhysicianId,
        ResourceId: null,
        // RoomId: this.AddApptForm.value.SelecetedRoom.RoomId > 0 ? this.AddApptForm.value.SelecetedRoom.RoomId : null,
        DateCreated: this.dateformater(new Date),
        CreatedByUserId: this.userDetails.UserId,
        DateLastUpdated: this.dateformater(new Date),
        LastUpdatedByUserId: this.userDetails.UserId,
        UserId: this.userDetails.UserId,
        ScheduledSlots: [
          {
            AppointmentId: ApptID,
            // EventDescription: this.AddApptForm.value.comment,
            StartTime: moment(this.consultationDate).format("YYYY-MM-DD") + " " + moment(this.consultationDate).format("HH:mm"),
            EndTime: moment(endTime).format("YYYY-MM-DD") + " " + moment(endTime).format("HH:mm"),
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.userDetails.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.userDetails.UserId,
            PhysicianId: this.physician.PhysicianId,
            UserId: this.userDetails.UserId,
          }
        ]
      }
      this.appointmentService.AddCalendarDateAndScheduleSlot(calendarDate).subscribe(resp => {
        this.activeModal.dismiss();
       this.loadTemplates()
        // this.loadEvent.emit(true)
        // this.showSuccess("Appointment Added Successfully")
        // this.activeModal.dismiss('Cross click')
      })
    })
  }
  dateformater(date) {
    let d = new Date(date);
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  }
}

