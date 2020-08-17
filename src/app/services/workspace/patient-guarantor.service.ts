import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class PatientGuarantorService {
  private baseurl: string = environment.api.workspace.base_workspaceApi_url+"PatientGuarantor/";
private _baseurl: string = environment.api.workspace.base_workspaceApi_url

  constructor(private _http: HttpClient) { }


  GetPatientGuarantor(param): Observable<any> {
    return this._http.get(this.baseurl + 'GetPatientGurantorByPatientId', { params: param })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  putPatientGuarantor(value): Observable<any> {
    return this._http.put(this.baseurl+'PutPatientGurantor', value).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }

  postPatientGuarantor(value): Observable<any> {
    return this._http.post(this.baseurl+'PostPatientGurantor', value).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }
getRelationships(){
  return this._http.get(this._baseurl + 'Relationship/GetRelationships').pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}
