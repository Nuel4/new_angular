import { Injectable } from '@angular/core';
import { map, catchError} from 'rxjs/operators'
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs'
import { HttpWrapperService } from '../../core/http-wrapper.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AddVitalsService {
baseUrl: string = environment.api.chart.base_chartApi_url;
  constructor(private _http: HttpClient, private _httpwrapper: HttpWrapperService) { }
  PostVitals(param): Observable<any> {
    return this._http.post(this.baseUrl + "MrVital/PostVitals" , param)
    .pipe(map((Response: Response) => Response),
    catchError(this.handleError))
  }
  AdditionalVitalMeasure(param): Observable<any> {
    return this._http.post(this.baseUrl + "VitalsAdditionalMeasure", param).pipe(
      map((Response: Response) => Response),
      catchError(this.handleError)
    )
  }
  GetUnitofWeight(): Observable<any> {
    return this._http.get(this.baseUrl + "UomWeightUnit/GetVitalsUOWs").pipe(
      map((Response: Response) => Response),
      catchError(this.handleError)
    )
  } 
  
  GetUnitofLength(): Observable<any> {
    return this._http.get(this.baseUrl + "UomLengthUnit/GetVitalsUOLs").pipe(
      map((Response: Response) => Response),
      catchError(this.handleError)
    )
  }
  private handleError(error){
console.log(error);
return Observable.throw(error || 'ChartService error')
  }
}
