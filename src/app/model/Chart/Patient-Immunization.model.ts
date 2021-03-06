export class PatientImmuniation {
    PatientId: number
    MrPatientEncounterId: number
    MrImmunizationTypeId: number
    MrImmunizationBatchId: number
    PatientDeclinedUnsureAboutPastImmunization: any
    Vaccine: string
    MonthAdministered: number
    YearAdministered: number
    DateAdministered: string
    RouteId: number
    AdministrationSite: string
    GivenByExternal: string
    GivenByInternalUserId: number
    Manufacturer: string
    LotNumber: string
    EducationDate: string
    Comments: string
    DateCreated: Date
    CreatedByUserId: number
    DateLastUpdated: Date
    LastUpdatedByUserId: number
    TimestampStartOfAdministration: string
    AdministeredAmount: string
    AdministeredUnits: string
    ManufacturerCode: string
    ProductExpirationDate: string
    Status: string
    EducationInformationGiven: boolean
    ImmunizationInjectionOrderId: number
    SubmittedtoImmunizationRegistry: boolean
    OrderingPhysicianId: number
    MrTemplateId: number
    MrTemplateSectionId: number
    MrFormFieldId: number
    IntervalTypeId: number
    MinInterval: string
    MaxInterval: string
    Drug: string
    Agent: string
    IsActive: boolean
    DueDate: string
    MrImmunizationScheduleHeaderId: number
    Active: boolean
  }