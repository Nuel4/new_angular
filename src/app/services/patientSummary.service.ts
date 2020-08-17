import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../core/http-wrapper.service'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class PatientsSummaryService {
    private baseUrl: string = environment.api.workspace.base_workspaceApi_url;

    constructor(
         private _http: HttpClient,
         private _httpwrapperservice?: HttpWrapperService,) { }

  //  getAllergiesByPatientId(param): Observable<any>{
  //    return this._http.get(this.baseUrl + 'PatientAllergyList/GetAllergiesByPatientId',{params: param})
  //    .pipe(map((response: Response) => response),
  //    catchError(this.handleError)
  //    )
  //  }

  getPatientEncounterByPatientId(param): Observable<any>{
    return this._http.get(this.baseUrl + 'PatientEncounters/GetPatientEncounterByPatientId',{params:param})
    .pipe(map((response : Response) => response),
    catchError(this.handleError)
    )
  }

  getTemplatePatientEncounterSection(param): Observable<any>{
    return this._http.get(this.baseUrl + 'TemplateSection/GetTemplatePatientEncounterSections',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getSmartValue(param): Observable<any> {
    return this._http.request('get',this.baseUrl + 'TemplateBuilder/GetSmartNoteTemplateItemValuesByItemId',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }
  
   private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'ChartService error');
  }
   
}