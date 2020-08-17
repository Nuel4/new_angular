import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddInvestServiceService {

  baseurl: string = environment.api.chart.base_chartApi_url;

  constructor(private _http: HttpClient) { }
  getInvestigationGroup(): Observable<any>{
    return this._http.get(this.baseurl + "TemplateBuilder/GetInvestigationGroup").pipe
    (
      map((Response) => Response),
      catchError(this.handleError)
    );
  }
  getInvestigationgrpId(params): Observable<any>{
    return this._http.get(this.baseurl + "TemplateBuilder/GetInvestigationByGroupId",{params:params}).pipe
    (
      map((Response) => Response),
      catchError(this.handleError)
    );
  }
  getInvestigationItems(): Observable<any> {
    return this._http.get(this.baseurl + "TemplateBuilder/GetAllInvestigationItems").pipe
    (
      map((Response) => Response),
      catchError(this.handleError)
    );
  }
  
  getPatientInvestigation(params): Observable<any>{
    return this._http.get(this.baseurl + "TemplateBuilder/GetPatientInvestigationByPatientId",{params:params}).pipe
    (
      map((Response) => Response),
      catchError(this.handleError)
    );
  }
  
  getOptionList(): Observable<any> {
    return this._http.get(this.baseurl + "TemplateBuilder/GetAllInvestigationOptionList").pipe
    (
      map((Response) => Response),
      catchError(this.handleError)
    );
  }
  updatePatientInvestigation(data): Observable<any> {
    return this._http.post(this.baseurl + "PatientInvestigation/InsertPatientInvestigation", data).pipe
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
