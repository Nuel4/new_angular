import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationStore } from '../../authentication/authentication-store'
@Injectable({
  providedIn: 'root'
})
export class PowerBIReportsService {
  public Token: any;
  private MrVitalUrl: string = environment.api.report.base_reportApi_url + 'MrVital';
  private coreDomainUrl: string = environment.api.report.base_reportApi_url + 'CoreDomain'

  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient, public authStore: AuthenticationStore) { }

  getAuthenticateAsync(): Observable<any> {
    return this._http.get(this.MrVitalUrl + '/AuthenticateAsync').pipe(
      map((response) => (response)),
      catchError(this.handleError));
  }

  getReportDefinitions():Observable<any>{
    return this._http.get(this.coreDomainUrl + '/GetReportDefinitions').pipe(
    map((response) => (response)),
    catchError(this.handleError));
  }
  getReportCategories():Observable<any>{
    return this._http.get(this.coreDomainUrl + '/GetReportCategories').pipe(
      map((response) => (response)),
      catchError(this.handleError));
  }
  getMultiTenancy(data):Observable<any>{
    return this._http.get(this.MrVitalUrl + '/MultiTenancy', {params:data} ).pipe(
      map((response) => (response)),
      catchError(this.handleError));
  }
  private handleError(error) {
    console.error(error);
    return throwError(error || 'SuperBillService error');
  }

}
