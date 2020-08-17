import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CharthomeService {
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;
  private patientUrl: string = environment.api.chart.base_chartApi_url + 'Patients';
  constructor(private _httpwrapperservice: HttpWrapperService) { }
GetSmokingStatus(patientid): Observable<any>{
  return this._httpwrapperservice.get(this.baseChartUrl + "SocialHistory/GetSmokingStatus?patientId=" + patientid).pipe(
    map((response: Response) => response),
    catchError(this.handleError)
  )
}
GetPatientInsurance(patientid): Observable<any> {
  return this._httpwrapperservice.get(this.baseChartUrl + 'PatientInsuranceProviders/GetCustomFormattedInsurance?patientId=' + patientid )
  .pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
getPatient(data):Observable<any>{
  return this._httpwrapperservice.get(this.patientUrl + `/${data}`).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
updatePatient(data):Observable<any>{
  return this._httpwrapperservice.put(this.patientUrl, data).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
private handleError(error) {
  console.error(error);
  return Observable.throw(error || 'ChartService error');
}
}
