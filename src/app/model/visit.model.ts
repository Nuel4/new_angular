import { Appointment } from './appointment.model';
export class Visit {
  VisitId?: number
  PatientId: number
  FacilityId: number
  VisitDate: string
  CoPayAmount: number
  PaymentMethod: string
  CheckNumber: string
  InsuranceVerificationDone: boolean
  CreditCardVerificationDone: boolean
  Comments: string
  Billed: boolean
  DateCreated: string
  CreatedByUserId: number
  DateLastUpdated: string
  LastUpdatedByUserId: number
  Appointments: [{
    AppointmentId?: number
    PatientId?: number
    VisitId?: number
    AppointmentStatus: string
    AppointmentReasonId: number
    AppointmentTypeId: number
    SendReminder: boolean
    ReminderDate: string
    SmsReminderSent: boolean
    EmailReminderSent: boolean
    PhoneReminderMade: boolean
    PhoneReminderByUserId?: number
    Comments: string
    CheckInTime: string
    DateCreated: string
    CreatedByUserId: number
    DateLastUpdated: string
    LastUpdatedByUserId: number
    ExceptionAppointments: string
    CoPayAmount: number
    PaymentMethod: string
    CheckNumber: string
    InsuranceCopayRequired: number
    IsCopayPercentage: boolean
    Confirmed: boolean
    ConfirmedStatus: string
    ConfirmedByUserId: number
    DateConfirmed: string
    CancelledStatus: string
    CancelledByUserId: number
    DateCancelled: string
    ReferringPhysicianId: number
    InternalReferringPhysicianId: number
    IsSpecialistVisit: number
    FlagSelfPayPatient: number
    Deductible: number
    CoInsurancePatientAmount: number
    CoInsurancePatientPercentage: number
    IsWalkIn: any
    InsuranceCoInsuranceRequired: number
    InsuranceDeductibleRequired: number
    PriorAuthorizationNumber: string
    AllowedVisits: number
    VisitsUsed: number
    ReferralStartDate: string
    ReferralExpiryDate: string
    ExternalReferenceId: string
    DoNotBillAppointment: number
    CaseNumber: number
    RoomId: number
  }]
}
