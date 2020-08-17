import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from "rxjs"
import { map, catchError, filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class PatientmedicalhistoryService {
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;

  constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) { }

  GetCustomFormattedPastMedicalHistory(Param): Observable<any> {
    return this._http.get( this.baseChartUrl + "MrPastMedicalHistory/GetCustomFormattedPastMedicalHistory", {params: Param}).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }
EditPastMedicalHistory(Param): Observable<any> {
  return this._http.put(this.baseChartUrl + "MrPastMedicalHistory/UpdatePastMedicalHistory", Param).pipe(
    map((Response) => Response),
    catchError(this.handleError)
  )
}
DeletePastMedicalHistory(Param): Observable<any> {
  return this._httpwrapperservice.deleteWithBody(this.baseChartUrl + "MrPastMedicalHistory/DeletePastMedicalHistory" , Param).pipe(
    catchError(this.handleError)
  )
}
GetPatientPmhDetails(Param): Observable<any> {
  return this._http.get(this.baseChartUrl + "MrPastMedicalHistory/GetPastMedicalHistorybyId?pastMedicalHistoryId=" + Param ).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}

SearchMedicalTerms(search): Observable<any> {
  return this._http.get(this.baseChartUrl + 'MrPastMedicalHistory/SearchMedicalTerms', { params: search })
    .pipe(map((response: Response) => response),
      catchError(this.handleError)
    )
}
  private handleError(error){
    console.error(error);
    return Observable.throw(error || "ChartService error")
  }
}
