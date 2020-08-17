import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'
import { CalendarDate } from './../../model/calendardate.model';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private baseurl: string = environment.api.appointment.base_appointmentApi_url;
  constructor(private httpwrapperservice: HttpWrapperService,
    private _http: HttpClient
  ) {
  }

  getAppointmentsByDate(pDate: any, pSlot: Number): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetAppointmentsByDate +
      '?pAppointmentStartDateTime=' + pDate + '&sortEnumerator=' + pSlot)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  getExceptions(prams): Observable<any> {
    return this._http.get(this.baseurl + 'UserAvailException/GetExceptionsForUser',{params: prams})
    .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  getAppointmentForWeekForFacilityById(params): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetAppointmentForWeekForFacilityById +
      '?dateFrom=' + params.dateFrom + '&facilityId=' + params.facilityId + '&visitDateStart=' + params.visitDateStart + '&visitDateEnd=' + params.visitDateEnd + '&userId=' + params.userId)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetAppointmentReasons(): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetAppointmentReasons)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetFacilitiesByuserId(userId): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + "Facilities/GetFacilitiesByuserId?userId=" + userId)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetAppointmentType(): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetAppointmentType)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetCustomFormattedGenericFacilities(): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetCustomFormattedGenericFacilities)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetPhysicianFacilityWeeklySchedule(facilityid, userid): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetPhysicianFacilityWeeklySchedule + '?pFacilityId=' + facilityid + '&pUserId=' + userid)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetRoomsByFacilityId(facilityid): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetRoomsByFacilityId + '?facilityId=' + facilityid)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetActivePhysicianUsers(facilityID): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + "Users/GetActivePhysicianUsers?pFacilityID=" + facilityID)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetActiveUsersForApptDiary(facilityID): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + "Users/GetActiveUsersForApptDiary?FacilityID=" + facilityID)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetUserScheduleForDay(facilityID, userID, dayofweek): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + "Users/GetUserScheduleForDay?pFacilityId=" + facilityID + "&UserId=" + userID + '&pDayOfWeek=' + dayofweek)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetAppointmentCancellationReason(): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + "AppointmentCancellationReason/GetAppointmentCancellationReason")
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }
  GetAppointmentById(apptid): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + "Appointments/GetAppointmentById?appointmentId=" + apptid)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetCustomFormattedReferringPhysician(): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetCustomFormattedReferringPhysician)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  GetCustomFormattedRelatedOrganization(): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetCustomFormattedRelatedOrganization)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  getAppointmentsByDateAndStatus(pDate: any, pStatus: string, pFacilityId: number): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetAppointmentsByDateAndStatus +
      '?pAppointmentStartDateTime=' + pDate + '&pStatus=' + pStatus + '&pFacilityId=' + pFacilityId)
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  CancelAppointment(pAppointmentId: number, pCancelComments: string, pUpatedByUserId: number): Observable<any> {
    return this.httpwrapperservice.put(this.baseurl + environment.api.appointment.CancelAppoinntment +
      '?pAppointmentId=' + pAppointmentId + '&pCancelComments=' + pCancelComments + '&pUpatedByUserId=' + pUpatedByUserId,'')
      .pipe(
        map((res: Response) => res),
        tap(res => console.log(res)),
        catchError(this.handleError)
      );
  }

  CheckInAppointment(pAppointmentId: Number, pUpatedByUserId: number): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.CheckInAppointment +
      '?pAppointmentId=' + pAppointmentId + '&pUpatedByUserId=' + pUpatedByUserId)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  MarkCompletedAppointment(pAppointmentId: Number, pCheckNumber: string, pCopyAmount: number,
    pdeductibleAmount: number, pInsuranceCopyamount: number, pPaymentMethod: string, pIsSelfPay: boolean,
    pUpatedByUserId: number): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.MarkCompletedAppointment +
      '?pAppointmentId=' + pAppointmentId + '&pCheckNumber=' + pCheckNumber + '&pCopyAmount=' + pCopyAmount +
      '&pdeductibleAmount=' + pdeductibleAmount + '&pInsuranceCopyamount=' + pInsuranceCopyamount + '&pPaymentMethod=' + pPaymentMethod +
      '&pIsSelfPay=' + pIsSelfPay + '&pUpatedByUserId=' + pUpatedByUserId)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  postAppointmentsToBeBilled(pstCharg): Observable<any> {
    console.log("value of appointment params is",pstCharg)
    return this._http.get(this.baseurl + 'Appointments/GetAppointmentsToBeBilled', {params: pstCharg}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  getAllAppointmnet(): Observable<any> {
    return this._http.get(this.baseurl + 'Appointments').pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  AddVisitAppointment(visitAppt: any): Observable<any> {
    return this._http.post(this.baseurl + 'Visits/AddVisitAppointment', visitAppt).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  AddAppointment(Appt: any): Observable<any> {
    return this._http.post(this.baseurl + 'Appointments', Appt).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  AddCalendarDateAndScheduleSlot(calendarSlot: any): Observable<any> {
    return this._http.post(this.baseurl + 'CalendarDates/AddCalendarDateAndScheduleSlot', calendarSlot).pipe(
      map((response) => 'response')
    );

    // catchError(this.handleError));
  }

  UpdateAppointment(Appt: any): Observable<any> {
    return this.httpwrapperservice.put(this.baseurl + 'Appointments', Appt).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  UpdateVisitsAppointment(Visit: any): Observable<any> {
    return this.httpwrapperservice.put(this.baseurl + 'Visits', Visit).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  UpdateCalendarDatesSchduleSlot(Slot: any): Observable<any> {
    return this.httpwrapperservice.put(this.baseurl + 'CalendarDates', Slot).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  UpdateScheduledSlots(SchuduleSlot: any): Observable<any> {
    return this.httpwrapperservice.put(this.baseurl + 'ScheduledSlots', SchuduleSlot).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  GetUserDtlsByViewModeProc(WeeklySche): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + 'Users/GetUserDtlsByViewModeProc?facilityID=' + WeeklySche.facilityID + '&userID=' + WeeklySche.userID + '&dayOfWeek=' + WeeklySche.dayOfWeek + '&weekOfMonth=' + WeeklySche.weekOfMonth + '&schedulerView=' + WeeklySche.schedulerView).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  GetAllPatientAppointments(params): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + 'Appointments/GetAllPatientAppointments?facilityid=' + params.facilityid + '&visitdate=' + params.visitdate).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  GetAllPatientAppointmentsPaged(params): Observable<any> {
    return this.httpwrapperservice.get(this.baseurl + 'Appointments/GetAllPatientAppointmentsPaged?offset=' + params.offset + '&limit=' + params.limit + '&facilityid=' + params.facilityid + '&visitdate=' + params.visitdate).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

AddVisit(body): Observable<any> {
  return this._http.post(this.baseurl + 'Visits/InsertVisits',body).pipe(
    map((response) => response),
    catchError(this.handleError));
}

getAllVisits(Params): Observable<any> {
  return this._http.get(this.baseurl+'Visits/GetAllVisit',{params: Params}).pipe(
    map((response) => response),
    catchError(this.handleError));
}

UpdateAppointmentInfo(Params): Observable<any>{
  return this._http.post(this.baseurl+'Appointments/UpdateAppointmentDoNotBillInfo',{},{params: Params})
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
getAvailabilityException():Observable<any>{
  return this._http.get(this.baseurl+'AvailExceptionType/GetAvailExceptionType')
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
getExperienceforUser(param):Observable<any>{
  return this._http.get(this.baseurl +'UserAvailException/GetExceptionsForUser',{params:param})
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
deleteExperienceForUser(param):Observable<any>{
  return this.httpwrapperservice.deleteWithBody(this.baseurl + 'UserAvailException/DeleteUserAvailException', param)
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
postExperienceFOrUser(param):Observable<any>{
  return this._http.post(this.baseurl + 'UserAvailException/AddUserAvailException',param)
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
postRecurringDetails(param):Observable<any>{
  return this._http.post(this.baseurl + 'RecurringDetail/AddRecurringDetail',param)
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
putRecurringDetails(param):Observable<any>{
  return this._http.put(this.baseurl + 'RecurringDetail/UpdateRecurringDetail',param)
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
updateExperienceForUser(param):Observable<any>{
  return this._http.put(this.baseurl + 'UserAvailException/UpdateUserAvailException',param)
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
GetExceptionsForUserByExceptionId(param):Observable<any>{
  return this._http.get(this.baseurl + 'UserAvailException/GetExceptionsForUserByExceptionId', {params:param})
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
getPatientEligibilityVerificationforPaitent(param):Observable<any>{
  return this._http.get(this.baseurl +'PatientEligibilityVerification/GetPatientEligibilityVerificationforPaitent',{params:param})
  .pipe(
    map((response) => response),
    catchError(this.handleError));
}
GetCustomFormattedInsuranceByOrder(param): Observable<any>{
  return this._http.get(this.baseurl + 'PatientInsuranceProviders/GetCustomFormattedInsuranceByOrder', {params: param})
  .pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
eligibilityVerification(param): Observable<any>{
  return this.httpwrapperservice.get(this.baseurl + 'PatientEligibilityVerification/TestWSRelay',param)
  .pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
verifyPatientEligibility(param): Observable<any>{
  return this.httpwrapperservice.get(this.baseurl + 'PatientEligibilityVerification/EligibilityVerificationWebServiceCall',param)
  .pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}
