import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from "rxjs"
import { map, catchError, filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class AllergiesService {
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;

  constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) { }

  GetAllergiesByPatientId(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + "PatientAllergyList/GetAllergiesByPatientId", { params : Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }

  GetMrAllergiesByDescription(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + "Allergy/GetMrAllergiesByDescription", { params : Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }

  EditAllergy(Param): Observable<any> {
    return this._http.put(this.baseChartUrl + "Allergy/UpdateAllergy", Param).pipe(
      map((res) => res),
      catchError(this.handleError)
    )
  }

  getFirstDrugAllergies(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Allergy/GetDrFirstDrugallergies',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getAllergiesByDesc(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Allergy/GetMrAllergiesbyDesc',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  patientAllergyList(param): Observable<any> {
    return this._http.post(this.baseChartUrl + 'PatientAllergyList',param)
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  updatePatientAllergy(param): Observable<any> {
    return this._http.put(this.baseChartUrl + 'PatientAllergyList/UpdatePatientAllergy',param)
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }


  private handleError(error) {
    console.error(error);
    return Observable.throw(error || "ChartService error")
  }
}
