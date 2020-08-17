import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GraphsService {

  baseurl: string = environment.api.chart.base_chartApi_url;

  constructor(private _http: HttpClient) { }

getvitalheightandweight(params): Observable<any>{
  return this._http.get(this.baseurl + "MrVital/GetVitalsHeightWeight", {params: params}).pipe
  (
  // return this._http.get(this.baseurl + "MrVital/GetVitalsHeightWeight", param).pipe(
    map((Response) => Response),
    catchError(this.handleError)
  );
}
getMrVitalsHeightWeightPaged(params): Observable<any>{
  return this._http.get(this.baseurl + "MrVital/GetMrVitalsHeightWeightPaged", {params: params}).pipe(
    map((Response) => Response),
    catchError(this.handleError)
  )
}
getVitalsbyEncounter(params): Observable<any>{
  return this._http.get(this.baseurl + "MrVital/GetVitalsByEncounterDate", {params: params}).pipe
  (
  // return this._http.get(this.baseurl + "MrVital/GetVitalsHeightWeight", param).pipe(
    map((Response) => Response),
    catchError(this.handleError)
  );
}

getLaborderItemsbyPatientId(patientId): Observable<any>{
  return this._http.get(this.baseurl + "LabOrderItem/GetLabOrderItemByPatientId?patientId=" + patientId).pipe
  (
    map((Response) => Response),
    catchError(this.handleError)
  );
}

getVitalsHeightWeightForGraph(param): Observable<any>{
  return this._http.get(this.baseurl + "MrVital/GetVitalsHeightWeightForGraph?patientId="+ param).pipe
  (
    map((Response) => Response),
    catchError(this.handleError)
  );
}
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'ChartService error');
  }
}
