import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientAccountsService {
  private PatientAccountActivitiesUrl  = environment.api.billing.base_billingApi_url + 'PatientAccountActivities';
  private PatientPaymentsUrl =  environment .api.billing.base_billingApi_url + 'PatientPayments';
  private PatientAccountSummaryUrl = environment.api.billing.base_billingApi_url + 'PatientAccountSummary';
  private PatientInsuranceProvidersUrl = environment.api.billing.base_billingApi_url + 'PatientInsuranceProviders';
  private PatientBillingFileUrl = environment.api.billing.base_billingApi_url + 'PatientBillingFile';
  private patientUrl = environment.api.billing.base_billingApi_url;
  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient) { }

    getPatientSummaryByCharge(data):Observable<any> {
      return this._http.get(this.PatientAccountActivitiesUrl + '/GetPatientSummaryByCharge', {params:data}).pipe(
          map((response) => response),
          catchError(this.handleError));
  }
  getPatientPayment(data):Observable<any> {
    return this._http.get(this.PatientPaymentsUrl + '/GetPatientPaymentByPatientId', {params:data}).pipe(
        map((response) => response),
        catchError(this.handleError));
}
getPatientAccountSummary(data):Observable<any> {
  return this._http.get(this.PatientAccountSummaryUrl + '/GetPatientAccountSummaryByPatientId', {params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
}
getCustomFormattedPatientInsurance(data):Observable<any>{
  return this._http.get(this.PatientInsuranceProvidersUrl + '/GetCustomFormattedInsurance', {params:data}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
getPastStatement(data):Observable<any>{
  return this._http.get(this.PatientBillingFileUrl + '/GetPatientBillingFilesWithoutDataByPatientId', {params:data}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
CheckActivityRecordsExists(data):Observable<any>{
  return this._http.get(this.PatientBillingFileUrl + '/CheckActivityRecordsExists', {params:data}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
getPatientAccountBasicSummaryByCharge(data):Observable<any>{
  return this._http.get(this.PatientAccountActivitiesUrl + '/GetPatientAccountBasicSummaryByCharge', {params:data}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
getPatientStatements(data):Observable<any>{
  return this._http.post(this.PatientAccountSummaryUrl + '/GetPatientStatements',data).pipe(
  map((response) => response),
    catchError(this.handleError));
}
getPatients(params) {
  return this._http.get(this.patientUrl + "Patients/"+ params).pipe(
      map((response) => response),
      catchError(this.handleError));

}
    private handleError(error) {
      console.error(error);
      return Observable.throw(error || 'SuperBillService error');
  }
}
