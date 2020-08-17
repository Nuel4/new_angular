import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ImmunzScheComponent } from './../immunz-sche.component';
import { PatientImmuniation } from './../../../../model/Chart/Patient-Immunization.model';
import { ImmunzScheService } from './../../../../services/chart/immunzsche.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImmunzBatchComponent } from '../immunz-batch/immunz-batch.component';
import { map } from 'rxjs/operators';
import * as moment from 'moment'
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ConsultationTemplateComponent } from './../../progressnote/consultation-template/consultation-template.component';
import { AppointmentService } from '../../../../services/workspace/appointment.service';
import { AuthenticationStore } from '../../../../authentication/authentication-store'
import { PrescribeService } from '../../../../services/chart/prescribe.service';

@Component({
  selector: 'app-edit-immunz',
  templateUrl: './edit-immunz.component.html',
  styleUrls: ['./edit-immunz.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditImmunzComponent implements OnInit {

  @Input() PatientImmuniationID: number
  @Input() Status: boolean
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  @Output() SavedData = new EventEmitter();
  immObj: any
  storedPatient: any
  LastName: any
  FirstName: any
  DateOfBirth: any
  Sex: any
  MobilePhone: any
  PrimaryAddressLine1: any
  isbatch: boolean
  immlist: any
  selectedimm: any
  routelist: any
  selectedRoute: any
  batchlist: any
  selectedbatchno: any
  expdate: any
  sitelist: any;
  selectedsite: any
  drug: any
  statuslist: any
  selectedstatus: any
  givenelsewhere: any = false
  elsewhere: any
  administerlist: any
  selectedAdminster: any
  dose: any
  manufacture: any
  unit: any
  modalRef: any;
  monthyear: any = new Date();
  storeUser: any;
  dateadministered: any = new Date();
  dategiven: any;
  visit : any;
  visitAppointment: any;
  ApptID: any;
  visitid: any;
  calendarDate:any;
  description: string;
  Encounter: any;
  EncounterId: any;
  departmentId: any;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private immuScheService: ImmunzScheService,private ps: PrescribeService,
    private toastr: ToastrService,private apptService: AppointmentService,private authStore: AuthenticationStore,
    private router: Router) { }

  ngOnInit() {
    this.isbatch = false
    this.storedPatient = JSON.parse(sessionStorage.getItem("PatientDetail"))
    this.storeUser = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.FirstName = this.storedPatient.FirstName
    this.LastName = this.storedPatient.LastName
    this.DateOfBirth = this.storedPatient.DateOfBirth
    this.Sex = this.storedPatient.Sex
    this.MobilePhone = this.storedPatient.MobilePhone
    this.PrimaryAddressLine1 = this.storedPatient.PrimaryAddressLine1
    this.statuslist = [
      { name: 'Due' },
      { name: 'Given' },
      { name: 'Overdue' },
      { name: 'Schedued' }
    ]

    this.getPatientImmByID()
  }




  loadImmTypeData() {
    this.immuScheService.GetMrImmunizationType().subscribe(resp => {
      this.immlist = resp
      this.immlist.map(item => {
        if (item.MrImmunizationTypeId === this.immObj.MrImmunizationTypeId) {
          this.selectedimm = item
          this.loadBatch()
          this.loadSite()
        }
      })
    });
  }

  loadRoutes() {
    this.immuScheService.GetDrugAdministrationRoutes().subscribe(resp => {
      this.routelist = resp.Result
      this.routelist.map(item => {
        if (item.DrugAdministrationRouteId === this.immObj.RouteId) {
          this.selectedRoute = item
        }
      })
    });
  }

  loadBatch() {
    this.immuScheService.GetMrImmunizationBatchByMrImmunizationTypeId(this.selectedimm.MrImmunizationTypeId).subscribe(resp => {
      this.batchlist = resp
      this.batchlist.map(item => {
        if (item.MrImmunizationBatchId === this.immObj.MrImmunizationBatchId) {
          this.selectedbatchno = item
          this.expdate = new Date(this.selectedbatchno.ExpiryDate)
        }
      })
    });
  }

  // loadPatientData() {
  //   this.immuScheService.PatientById(this.immObj.PatientId).subscribe(resp => {
  //     this.storedPatient = resp

  //   });
  // }

  loadAdminister() {
    this.immuScheService.GetPhysicianUserList().subscribe(resp => {
      this.administerlist = resp.Result
      this.administerlist.map(item => {
        if (item.physicianId === this.immObj.GivenByInternalUserId) {
          this.selectedAdminster = item
        }

      })

    });
  }

  loadSite() {
    this.immuScheService.GetMrImmunizationSite().subscribe(resp => {
      this.sitelist = resp
      this.sitelist.map(item => {
        this.immlist.map(imm => {
          if (imm.MrImmunizationTypeId === this.immObj.MrImmunizationTypeId) {
            if (item.MrImmunizationSiteId === imm.MrImmunizationSiteId)
              this.selectedsite = item
          }
        })

      })
    });
  }

  getPatientImmByID() {
    this.immuScheService.GetPatientImmunizationByPatientImmunizationId(this.PatientImmuniationID).subscribe(resp => {
      this.immObj = resp[0]
      this.dose = this.immObj.AdministeredAmount ? this.immObj.AdministeredAmount : ''
      this.manufacture = this.immObj.Manufacturer ? this.immObj.Manufacturer : ''
      this.unit = this.immObj.AdministeredUnits ? this.immObj.AdministeredUnits : ''
      this.dateadministered = this.immObj.DateAdministered ? new Date(this.immObj.DateAdministered) : new Date(this.dateadministered)
      this.drug = this.immObj.Drug ? this.immObj.Drug : ''
      this.givenelsewhere = this.immObj.GivenByExternal ? this.immObj.GivenByExternal : 'false'
      this.expdate = this.immObj.ProductExpirationDate ? new Date(this.immObj.ProductExpirationDate) : this.expdate
      this.monthyear = this.immObj.YearAdministered && this.immObj.MonthAdministered ? new Date(this.immObj.MonthAdministered + "-" + this.immObj.YearAdministered) : new Date()
      this.statuslist.map(item => {
        if (item.name === this.immObj.Status)
          this.selectedstatus = item
      })
      if (this.Status) {
        this.selectedstatus = { name: 'Given' }
      }
      this.elsewhere = this.immObj.GivenByExternal
      // this.loadPatientData()
      this.loadImmTypeData()
      this.loadRoutes()
      this.loadAdminister()
    });
  }

  onSave() {
    let Patimm = {
      MrPatientImmmunizationId: this.immObj.MrPatientImmmunizationId,
      PatientId: this.storedPatient.PatientId,
      MrPatientEncounterId: this.immObj.MrPatientEncounterId,
      MrImmunizationTypeId: this.selectedimm ? this.selectedimm.MrImmunizationTypeId : this.immObj.MrImmunizationTypeId,
      MrImmunizationBatchId: this.selectedbatchno ? this.selectedbatchno.MrImmunizationBatchId : this.immObj.MrImmunizationBatchId,
      PatientDeclinedUnsureAboutPastImmunization: "0",
      Vaccine: this.selectedimm ? this.selectedimm.Description : this.immObj.Vaccine,
      MonthAdministered: this.dategiven ? moment(this.monthyear).format('MM') : '',
      YearAdministered: this.dategiven ? moment(this.monthyear).format('YYYY') : '',
      DateAdministered: !this.dategiven ? moment(this.dateadministered).format("YYYY-MM-DD") : '',
      RouteId: this.selectedRoute ? this.selectedRoute.DrugAdministrationRouteId : this.immObj.RouteId,
      AdministrationSite: this.selectedsite ? this.selectedsite.Description : this.immObj.AdministrationSite,
      GivenByExternal: this.givenelsewhere ? this.elsewhere : '',
      GivenByInternalUserId: !this.givenelsewhere ? this.selectedAdminster.physicianId : this.immObj.GivenByInternalUserId,
      Manufacturer: this.manufacture ? this.manufacture : this.immObj.Manufacturer,
      LotNumber: this.immObj.LotNumber,
      EducationDate: this.immObj.EducationDate,
      Comments: "",
      DateCreated: this.immObj.DateCreated,
      CreatedByUserId: this.immObj.CreatedByUserId,
      DateLastUpdated: this.dateformater(new Date()),
      LastUpdatedByUserId: this.storeUser.UserId,
      TimestampStartOfAdministration: this.immObj.TimestampStartOfAdministration,
      AdministeredAmount: this.dose ? this.dose : this.immObj.AdministeredAmount,
      AdministeredUnits: this.unit ? this.unit : this.immObj.AdministeredUnits,
      ManufacturerCode: "",
      ProductExpirationDate: this.immObj.ProductExpirationDate,
      Status: this.selectedstatus ? this.selectedstatus.name : this.immObj.Status,
      EducationInformationGiven: this.immObj.EducationInformationGiven,
      ImmunizationInjectionOrderId: this.immObj.ImmunizationInjectionOrderId,
      SubmittedtoImmunizationRegistry: this.immObj.SubmittedtoImmunizationRegistry,
      OrderingPhysicianId: this.immObj.OrderingPhysicianId,
      MrTemplateId: this.immObj.MrTemplateId,
      MrTemplateSectionId: this.immObj.MrTemplateSectionId,
      MrFormFieldId: this.immObj.MrFormFieldId,
      IntervalTypeId: this.immObj.IntervalTypeId,
      MinInterval: this.immObj.MinInterval,
      MaxInterval: this.immObj.MaxInterval,
      Drug: this.drug ? this.drug : "",
      Agent: "",
      IsActive: true,
      DueDate: this.immObj.DueDate,
      MrImmunizationScheduleHeaderId: this.immObj.MrImmunizationScheduleHeaderId,
      Active: true
    }
    let chiefTemplateSectionId;
    let chiefFormFieldId;
    let planTemplateSectionId;
    let planFormFieldId;
    // Patimm.DueDate = this.due ? this.selectedbatchno.Agent : ''
    this.immuScheService.PutMrPatientImmunization(Patimm).subscribe(resp => {
      this.toastr.success("Immunization Successfully Updated")
      this.visit = {
        PatientId: this.storedPatient.PatientId,
        FacilityId: this.storeUser.PreferredFacility1,
        VisitDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
        CoPayAmount: null,
        PaymentMethod: null,
        CheckNumber: null,
        InsuranceVerificationDone: false,
        CreditCardVerificationDone: false,
        Comments: null,
        Billed: null,
        DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        CreatedByUserId: this.storeUser.UserId,
        DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
        LastUpdatedByUserId: this.storeUser.UserId,
        Appointments: [
          {
            VisitId: 0,
            PatientId: this.storedPatient.PatientId,
            AllowedVisits: null,
            AppointmentStatus: "Completed_NoVisit",
            AppointmentReasonId: 1,
            AppointmentTypeId: 1,
            CancelledByUserId: null,
            CancelledStatus: null,
            CheckInTime: null,
            CheckNumber: null,
            Comments: "Appointment created automatically when saving patient chart.",
            Confirmed: null,
            ConfirmedByUserId: null,
            ConfirmedStatus: null,
            CoInsurancePatientAmount: null,
            CoInsurancePatientPercentage: null,
            CoPayAmount: null,
            SendReminder: false,
            ReminderDate: null,
            SmsReminderSent: null,
            EmailReminderSent: null,
            PhoneReminderMade: null,
            PhoneReminderByUserId: null,
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.storeUser.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.storeUser.UserId,
            ExceptionAppointments: null,
            PaymentMethod: null,
            InsuranceCopayRequired: null,
            IsCopayPercentage: null,
            DateConfirmed: null,
            DateCancelled: null,
            ReferringPhysicianId: null,
            InternalReferringPhysicianId: null,
            IsSpecialistVisit: 0,
            FlagSelfPayPatient: 0,
            Deductible: null,
            IsWalkIn: false,
            InsuranceCoInsuranceRequired: null,
            InsuranceDeductibleRequired: null,
            PriorAuthorizationNumber: null,
            VisitsUsed: null,
            ReferralStartDate: null,
            ReferralExpiryDate: null,
            ExternalReferenceId: null,
            DoNotBillAppointment: null,
            CaseNumber: null,
            RoomId: null,
          }],
      }
      //   // pass the visit object here
      this.apptService.AddVisitAppointment(this.visit).subscribe(resp => {
        //     // store the response in apptid
        this.visitAppointment = resp
        this.ApptID = resp.Value.AppointmentId;
        this.visitid = resp.Value.VisitId;
        //     // once the response arrive create calendardate object
        this.calendarDate = {
          ScheduledDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
          PhysicianId: this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
          ResourceId: null,
          RoomId: null,
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.storeUser.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.storeUser.UserId,
          UserId: this.storeUser.UserId,
          ScheduledSlots: [
            {
              AppointmentId: this.ApptID,
              // add calender error
              EventDescription: null,
              StartTime: moment(new Date()).format("YYYY-MM-DD") + " " + moment(new Date()).format("HH:mm"),
              EndTime: moment(new Date()).format("YYYY-MM-DD") + " " + moment(new Date()).format("HH:mm"),
              DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
              CreatedByUserId: this.storeUser.UserId,
              DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
              LastUpdatedByUserId: this.storeUser.UserId,
              PhysicianId: this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
              UserId: this.storeUser.UserId,
            }
          ]
        }
  
        let AddpatientEncounter = {
          PatientId: this.storedPatient.PatientId,
          VisitId: this.visitid,
          ChiefComplaintId: null,
          ChiefComplaint: this.selectedimm.Description ? this.selectedimm.Description : 'administer',
          AdditionalText: null,
          EncounterIndicatorId: null,
          Billed: null,
          PhysicianId: this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
          FacilityId: this.storeUser.PreferredFacility1,
          TimeSpentOnConsultation: null,
          PhysicianInitials: null,
          DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          CreatedByUserId: this.storeUser.UserId,
          DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
          LastUpdatedByUserId: this.storeUser.UserId,
          AppointmentId: this.ApptID,
          SummaryDocument: null,
          MedicationReconciliationPerformed: null,
          DateOfMedicationReconciliation: null,
          MedicationNotPrescribed: null,
          SpecialityId: null,
          MrTemplateId: null,
          DepartmentId: null,
          CodeBasedOnTimeSpent: null,
          PresentingProblemRiskLevelId: null,
          DiagnosticProcedureOrderedRiskLevelId: null,
          ManagementOptionsSelectedRiskLevelId: null,
          LevelOfServiceCptCode: null,
          SkipLevelOfService: null,
          IsClinicalSummaryGivenToPatient: null,
          IsOfficeVisit: null,
          MrTemplateGroupId: this.authStore.PracticeDetail.PostChargesDefaultBillingTemplateGroupId,
          ConsultationDate: moment(new Date).format("YYYY-MM-DD HH:mm"),
          IsCompleted: false,
          CompletedBy: null,
          DateCompleted: null,
          Active: null,
        }
        this.ps.postPatientEncounter(AddpatientEncounter).subscribe(res => {
          this.Encounter = res;
          this.EncounterId = res.MrPatientEncounterId
          this.departmentId = res.DepartmentId
          
          let chiefComplaint = {
            MrPatientEncounterId: this.EncounterId, // first add patient encounter will fire once we get the result of that api we can assign encounter  to this field
            PatientId: this.storedPatient.PatientId,
            EnteredData: this.selectedimm.Description ? this.selectedimm.Description : 'administer',
            MrTemplateSectionId: chiefTemplateSectionId,
            MrFormFieldId: chiefFormFieldId,
            DateCreated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            CreatedByUserId: this.storeUser.UserId,
            DateLastUpdated: moment(new Date).format("YYYY-MM-DD HH:mm"),
            LastUpdatedByUserId: this.storeUser.UserId,
            MrTemplateChiefComplaintId: null,
            Active: null,
          }
          this.ps.postChiefComplaintment(chiefComplaint).subscribe(res => {
          })
          let emittingdata = {
            EncounterId: this.EncounterId,
            AppointmentId: this.ApptID,
          }
          this.SavedData.emit(emittingdata);
        });
        //     // pass the calendar date object into AddCalendarDateAndScheduleSlot api here it will end
        this.apptService.AddCalendarDateAndScheduleSlot(this.calendarDate).subscribe(resp => {
          //       // ApptID = resp
          //       // this.loadEvent.emit(true)
          // this.showSuccess("Appointment Added Successfully")
          //       this.activeModal.dismiss('Cross click')
        })
  
        //     isSuccess = true
      })
  
  
  
  
      this.activeModal.dismiss()
      this.loadEvent.emit(true)
      if (this.Status) {
        this.modalRef = this.modalService.open(ConsultationTemplateComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
        this.modalRef.componentInstance.selectedData = {
          
        }
        this.modalRef.componentInstance.loadEvent.subscribe((value) => {
          if (value) {
          }
        })
      }
    })
  }
    
  getBatchData() {
    this.expdate = new Date(this.selectedbatchno.ExpiryDate)
  }

  dateformater(date) {
    let d = new Date(date);
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  }

  changetobatch() {
    this.modalRef = this.modalService.open(ImmunzBatchComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
    this.modalRef.componentInstance.TypeID = this.selectedimm.MrImmunizationTypeId
    this.modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.loadImmTypeData()
        this.modalRef.close()
      }
    })
  }
  changetoedit() {
    this.activeModal.dismiss('closing')
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success Message');
  }

  showError(msg) {
    this.toastr.error(msg, 'Error Message');
  }

  showWarring(msg) {
    this.toastr.warning(msg, 'Warring Message');
  }

}
