import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from "rxjs"
import { map, catchError, filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LabOrdersService {
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;
  constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) { }
  
  GetCustomOrdersForPatientsPaged(Param): Observable<any> {
    return this._http.get( this.baseChartUrl + "LabOrder/GetCustomOrdersForPatientsPaged", {params: Param}).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }
  private handleError(error){
    console.error(error);
    return Observable.throw(error || "ChartService error")
  }
}
