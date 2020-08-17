
import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private coreDomainUrl : string = environment.api.profile.base_profileApi_Url + 'CoreDomain';
  private salutationUrl : string = environment.api.profile.base_profileApi_Url + 'Salutation';
  private physicianUrl: string = environment.api.profile.base_profileApi_Url + 'Physicians';
  private usersUrl : string = environment.api.profile.base_profileApi_Url + 'Users';
  private specialityUrl : string = environment.api.profile.base_profileApi_Url + 'Speciality';
  private cdsMessageTypeUrl : string = environment.api.profile.base_profileApi_Url + 'CdsMessageType';
  private qualificationUrl :  string = environment.api.profile.base_profileApi_Url + 'Qualification';
  private templateGroupUrl : string = environment.api.profile.base_profileApi_Url + 'TemplateGroup';
  private facilityUrl : string = environment.api.profile.base_profileApi_Url + 'Facilities';
  private cdsMessageTypeUserPreferenceUrl : string = environment.api.profile.base_profileApi_Url + 'CdsMessageTypeUserPreference';
  private physicianCommonCptCodeUrl : string = environment.api.profile.base_profileApi_Url + 'PhysicianCommonCptCode';
  private baseUrl : string = environment.api.profile.base_profileApi_Url;
  constructor(private _http: HttpClient) { }

  getApplicationUser(value): Observable<any> {
    return this._http.get(this.coreDomainUrl + '/GetApplicationUserById',{params:value}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getSalutations(): Observable<any> {
    return this._http.get(this.salutationUrl + '/GetSalutations').pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getUsersWithChildTables(param):Observable<any>{
    return this._http.get(this.usersUrl + '/GetUsersWithChildTables', {params:param}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getUsersByPhyscianId(param):Observable<any>{
    return this._http.get(this.physicianUrl + '/GetUsersByPhysicianId', {params:param}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getPhysicianIdByUserId(param):Observable<any>{
    return this._http.get(this.physicianUrl + '/GetPhysicianIDByUserId', {params:param}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  updatePhysician(value):Observable<any>{
    return this._http.put(this.physicianUrl, value).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getSpeciality(){
    return this._http.get(this.specialityUrl + '/GetSpecialities').pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getCdsMessageType(){
    return this._http.get(this.cdsMessageTypeUrl + '/GetCdsMessageType').pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getCdsMessageTypePreferences(param):Observable<any>{
    return this._http.get(this.cdsMessageTypeUserPreferenceUrl + '/GetCdsMessageTypeUserPreference', {params:param}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getQualification(){
    return this._http.get(this.qualificationUrl + '/GetQualifications').pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getActiveTemplateGroup(){
    return this._http.get(this.templateGroupUrl + '/GetActiveTemplateGroup').pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  getFacilities(){
    return this._http.get(this.facilityUrl + '/GetFacilities').pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  getPhysicianCommonTemplateGroup(param):Observable<any>{
    return this._http.get(this.templateGroupUrl + '/GetPhysicianCommonTemplateGroups',{params:param}).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  updateSalteHash(param):Observable<any>{
    return this._http.request('put', this.coreDomainUrl + '/UpdateSaltedHash',{params:param}).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  getUsers(data):Observable<any>{
    return this._http.get(this.usersUrl + `/${data}` ).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getPhysicianUsers(data):Observable<any>{
    return this._http.get(this.physicianUrl + '/GetPhysicianUsers',{params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  updateUsers(value):Observable<any>{
    return this._http.put(this.baseUrl + 'Users' ,value).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  getFacilitiesByName(data):Observable<any>{
    return this._http.get(this.facilityUrl + '/GetFacilitiesByName',{params:data}).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'UserProfileService error');
}
}
