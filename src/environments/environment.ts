// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// http://prajeen.azurewebsites.net/api/v1/
// http://prajeen.azurewebsites.net/api/v1/
// https://socratesapiservices20190204083417.azurewebsites.net/api/v1/
// http://productionyeatsehrtest-api2.azurewebsites.net/api/v1/


const base_url = 'https://productionyeatsehrtest-api2.azurewebsites.net/api/v1/'
// const base_url = 'http://192.168.1.17:7777/api/v1/'
export const environment = {
  production: false,
  api:
  {
    authentication:
    {
      base_authenticationApi_url: base_url,
    },
    chart: {
      base_chartApi_url: base_url,
      Getmrimmunizationscheduleheader: 'MrImmunizationScheduleHeader',
      GetPatientImmunization: 'PatientImmunization'
    },
    order: {
      base_orderApi_url: base_url,
    },
    workspace:
    {
      base_workspaceApi_url: base_url,
      Getpatientdetails: 'Patients',
      registerpatient: 'patientmanagement/registerpatient',
      GetAppointmentsByDate: 'Appointments/GetCustomFormattedPatientAppointments',
      GetPhysicians: 'Physicians',
      GetRefPhysicians: 'ReferringPhysicians',
      GetRefOrgs: 'RelatedOrganizations',
      GetUsers: 'Users',
      GetFacilities: 'Facilities',
      GetPhysicianWithMinimumDetails: 'Physicians/GetPhysicianWithMinimumDetails',
      getUserScheduledSlots: 'ScheduledSlots',
      GetPhysicianFacilityWeeklySchedule: 'GetPhysicianFacilityWeeklySchedule',
      GetAppointmentDetails: 'Appointments/GetAppointments',
      GetPatientCustomDetailById: 'Patients/GetCustomFormattedPatientDetailsById',
      GetSpecility: 'Speciality',
      GetPatientStatus: 'PatientStatus',
      TablePharmacy: base_url + 'TblPharmacy/',
    },
    billing:
    {
      base_billingApi_url: base_url,
      GetSupplierBillingDetails: 'SuperBills/GetSuperBillData',
    },
    administration:
    {
      base_administrationApi_url: base_url,
    },
    practice:
    {
      base_practiceApi_url: base_url,
    },
    userprofile:
    {
      base_userprofileApi_url: base_url,
    },
    appointment:
    {
      base_appointmentApi_url: base_url,
      GetAppointmentsByDate: 'Appointments/GetCustomFormattedPatientAppointments',
      GetAppointmentsByDateAndStatus: 'Appointments/GetCustomFormattedAppointmentByDateAndStatus',
      CancelAppoinntment: 'Appointments/CancelAppointment',
      CheckInAppointment: 'Appointments/CheckInAppointment',
      MarkCompletedAppointment: 'Appointments/MarkCompletedAppointment',
      // GetAppointmentForWeekForFacilityById: 'Appointments/GetAppointmentForWeekForFacilityById',
      GetAppointmentForWeekForFacilityById: 'Appointments/GetAppointmentForWeekForFacilityById',
      GetAppointmentReasons: "AppointmentReason/GetAppointmentReasons",
      GetAppointmentType: "AppointmentType/GetAppointmentType",
      GetCustomFormattedGenericFacilities: "Facilities/GetCustomFormattedGenericFacilities",
      GetCustomFormattedReferringPhysician: "ReferringPhysicians/GetCustomFormattedReferringPhysician",
      GetCustomFormattedRelatedOrganization: "RelatedOrganizations/GetCustomFormattedRelatedOrganization",
      GetRoomsByFacilityId: "Room/GetRoomsByFacilityId",
      GetPhysicianFacilityWeeklySchedule: "PhysicianFacilityWeeklySchedules/GetPhysicianFacilityWeeklySchedule",
    },
    alert:
    {
      base_alertApi_url: base_url,
      GetAlertTypes: 'AlertType/GetAlertTypes',
    },
    facilities:
    {
      base_facilitiesApi_url: base_url,
      GetFacilities: 'Facilities',
    },
    typeofappointments:
    {
      base_typeofappointmentsApi_url: base_url,
      GetPhysicians: 'Physicians',
    },
    inventory: {
      base_inventory_url: base_url,
      getStores: 'InvStores',
      getCategories: 'InvCategoryMasters',
      taxonomyItems: 'InvTaxonomyItems/',
    },
    profile:{
      base_profileApi_Url: base_url
    },
    report:{
      base_reportApi_url: base_url
    }
  }
};
