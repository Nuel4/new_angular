import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable} from 'rxjs'
import { map, catchError, filter} from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;
  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient) { }

  CustomGetMedicationlists(payload): Observable<any>{
    return this._http.get(this.baseChartUrl + 'Medicationlist/CustomGetMedicationlistsPaged',{params: payload})
    .pipe(map((response: Response) => response),
   catchError(this.handleError)
    )
  }
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'ChartService error');
  }
}
