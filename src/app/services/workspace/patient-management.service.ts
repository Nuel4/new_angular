import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class PatientmanagementService {
  private baseurl: string = environment.api.workspace.base_workspaceApi_url;
  public serviceDataForPatLastName: string;
  constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) { }

  getAllPatientDetails(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.Getpatientdetails)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getPatientDetailsByPage(index, patientName): Observable<any> {
    return this._httpwrapperservice.get(this.baseurl + 'Patients/' + 'GetAllPatientsWithFiltersByName?pName=' + patientName + '&offset=' + index + '&limit=10').pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  getPatientById(patientId: any): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + 'Patients/' + patientId)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  GetCustomFormattedGenericFacilities(): Observable<any> {
    return this._httpwrapperservice.get(this.baseurl + environment.api.appointment.GetCustomFormattedGenericFacilities)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }


  postPatientRegisterDetails(patientDetailsData): Observable<any> {
    console.log("value of post patients are",patientDetailsData)
    // return this._httpwrapperservice.post(, form).pipe(
    return this._http.post(this.baseurl + 'Patients', patientDetailsData).pipe(
      map((response) => response),
      catchError(this.handleError));
  }


  postUserSchedule(userScheduleObj): Observable<any> {
    return this._http.post(this.baseurl + "PhysicianFacilityWeeklySchedules", userScheduleObj).pipe(
      map((Response) => Response),
      catchError(this.handleError)
    );
    // return this._httpwrapperservice.post(this.baseurl+"PhysicianFacilityWeeklySchedules", usrsch).pipe(
    //   map((Response) => Response),
    //      catchError(this.handleError));
  }


  getCFmaritalStatus(): Observable<any> {
    return this._http.get(this.baseurl + "MaritalStatus/GetCustomFormattedMaritalStatus").pipe(
      map((Response) => Response),
      catchError(this.handleError)
    );
  }

  getAppointmentStatus(): Observable<any> {
    return this._http.get(this.baseurl + "Appointments/GetAppointmentStatus").pipe(
      map((Response) => Response),
      catchError(this.handleError)
    );
  }

  updatePatient(form: any): Observable<any> {
    // return this._httpwrapperservice.put(this.baseurl + 'Patients', form).pipe(
      console.log("value of form data is",form)
    return this._http.put(this.baseurl + "Patients", form).pipe(
      map((response) => response),
      catchError(this.handleError));
  }

  getAllPatientsWithFilters(patientSearchObj: any): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + 'Patients/GetAllPatientsWithFilters?'
        + "lastname=" + patientSearchObj.lastname
        + "&firstname=" + patientSearchObj.firstname
        + "&ssn=" + patientSearchObj.ssn
        + "&phone=" + patientSearchObj.phone
        + "&status=" + patientSearchObj.status)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  GetAllPatientsPagedWithFilters(patientSearchObj: any): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + 'Patients/GetAllPatientsPagedWithFilters?'
        + "offset=" + patientSearchObj.offset
        + "&limit=" + patientSearchObj.limit
        + "&lastname=" + patientSearchObj.lastname
        + "&firstname=" + patientSearchObj.firstname
        + "&ssn=" + patientSearchObj.ssn
        + "&phone=" + patientSearchObj.phone
        + "&status=" + patientSearchObj.status)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  GetPatientsEdit(patientSearchObj: any): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + 'Patients/GetPatientsEdit?'
        + "offset=" + patientSearchObj.offset
        + "&limit=" + patientSearchObj.limit
        + "&lastname=" + patientSearchObj.lastname
        + "&firstname=" + patientSearchObj.firstname
        + "&ssn=" + patientSearchObj.ssn
        + "&phoneNo=" + patientSearchObj.phone
        + "&status=" + patientSearchObj.status
        + "Dob=" + patientSearchObj.dob
        + "visitDate=" + patientSearchObj.visitDate
        + "isWildCardSearch=" + true)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }


  getPatientCustomDetailById(pPatientId: number): Observable<any> {
    return this._httpwrapperservice
      .get(
        this.baseurl +
        environment.api.workspace.GetPatientCustomDetailById +
        '?pPatientId=' +
        pPatientId
      )
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getFacilityDetails(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + 'Facilities/GetFacilities')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getFacilitywithPagination(values): Observable<any> {
    return this._http.get(this.baseurl + 'Facilities/GetFacilitiesWithPagination', { params: values }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getRefPhysicians(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetRefPhysicians)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getRefOrgs(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetRefOrgs)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetUsers)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getUserById(id): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetUsers + "/" + id)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getReferringPhysicians(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/ReferringPhysicians')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getReferringPhysicianByOrganization(id): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/ReferringPhysicians/GetReferringPhysicianByReferringOrganization?pRefOrgId=' + id)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getDefaultPhysicianByFacility(id): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Physicians/GetPhysicianWithMinimumDetailsByFacilityId?facilityId=' + id)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getSalutations(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Salutation' + '/GetSalutations')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getPatientStatus(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/PatientStatus' + '/GetAllPatientStatus')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getRelatedOrganization(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/RelatedOrganizations')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getEthnicity(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Ethnicity/GetEthnicities')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getCFEthnicity(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Ethnicity/GetCustomFormattedEthnicities')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getLanguage(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Language/GetLangauages')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getCFLanguage(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Language/GetCustomFormattedLanguages')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }


  getRace(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + '/Race/GetRaces')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }
  getAppointmentsByWeek(pStartDate: any, pEndDate: any): Observable<any> {
    return this._httpwrapperservice
      .get(
        this.baseurl +
        environment.api.workspace.GetAppointmentDetails +
        '?pAppointmentStartDate=' +
        pStartDate +
        '&pAppointmentEndDate=' +
        pEndDate
      )
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getFacilitieswithFacilitiesName(pFacilityName): Observable<any> {
    return this._http.get(this.baseurl + 'Facilities/GetFacilitiesByName', { params: pFacilityName }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getPhysicianFacilityWeeklySchedules(Params): Observable<any> {
    return this._http.get(this.baseurl + "PhysicianFacilityWeeklySchedules/GetPhysicianFacilityWeeklySchedule", { params: Params }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getUserScheduleSlots(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.getUserScheduledSlots)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }


  getPhyminDtFacID(facilityId): Observable<any> {
    console.log("value of param",facilityId)
    // return this._http.get(this.baseurl + "Users/GetActiveUsersForApptDiary", { params: facilityId })
      return this._http.get(this.baseurl+"/Physicians/GetPhysicianWithMinimumDetailsByFacilityId", {params: facilityId})
      .pipe(map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getSearchUser(params): Observable<any> {
    return this._httpwrapperservice.get(this.baseurl + "Users/SearchUser?userID=" + params.userID + "&facilityID=" + params.facilityID + "&specialityID=" + params.specialityID + "&date=" + params.date + "&dayOfWeek=" + params.dayOfWeek + "&weekOfMonth=" + params.weekofMonth)
      // return this._httpwrapperservice.get(this.baseurl+"/Physicians/GetPhysicianWithMinimumDetailsByparams.FacilityId", {params: facilityId})
      .pipe(map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  // Specility APIs start //
  getAllSpecilities(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetSpecility + '/GetSpecialities')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getAllSpecilitiesByUserID(userid: any): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetSpecility + '/GetUserSpecialty?pUserId=' + userid)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  // Specility APIs end //

  //Patient Status//

  GetAllPatientStatus(): Observable<any> {
    return this._httpwrapperservice
      .get(this.baseurl + environment.api.workspace.GetPatientStatus + '/GetAllPatientStatus')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  GetPatientMessages(param): Observable<any> {
    return this._http.get(this.baseurl + 'NoticeBoardPosting/GetNoticeBoardPostingByPatientId', { params: param })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  GetPatientAppointment(param): Observable<any> {
    return this._http.get(this.baseurl + 'Appointments/GetCustomFormattedPatientAppointmentsByPatientIdPaged', { params: param })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }


  GetPatientInsurance(param): Observable<any> {
    return this._http.get(this.baseurl + 'PatientInsuranceProviders/GetCustomFormattedInsurance', { params: param })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }


  getCFReligion() {
    return this._http.get(this.baseurl + 'Religion/GetCustomFormattedReligions')
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }
  postPatientLogin(param): Observable<any> {
    return this._http.post(this.baseurl + 'PatientLogin/PostPatientLogin', param)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}
