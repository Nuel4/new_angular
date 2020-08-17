export class Appointment {
    AppointmentId?: number
    PatientId?: number
    VisitId?: number
    AppointmentStatus: string
    AppointmentReasonId: number
    AppointmentTypeId: number
    SendReminder: boolean
    ReminderDate: string
    SmsReminderSent: boolean = false
    EmailReminderSent: boolean = false
    PhoneReminderMade: boolean = false
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
    FlagSelfPayPatient: boolean
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
    DoNotBillAppointment: boolean
    CaseNumber: number
    RoomId: number
    // AppointmentId?: any;
    // PatientLastname: string;
    // PatientFirstname: string;
    // SelfPayAppt: number;
    // Facility: any;
    // User: any;
    // VisitType: any;
    // ReferringOrganizationId?: number;
    // AppointmentStartDate: string;
    // AppointmentEndDate: string;
    // ReferringPhysicianId?: number;
    // IntReferringPhysicianId?: number;
    // AppointmentRoom: string;
    // ReqCoPay: string;
    // SplOfficeVisit: boolean;
    // MedicalCopyments: string;
    // comments: string;
}