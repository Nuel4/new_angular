import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class PatientemployerService {

  private baseurl: string = environment.api.appointment.base_appointmentApi_url+"PatientEmployer/";


  constructor(
    private _http: HttpClient
  ) { }


  getallPatientEmployers(): Observable<any>
  {
    return this._http.get(this.baseurl+"GetPatientEmployers")
    .pipe(
      map((res: Response) => res),
      tap(res => console.log(res)),
      catchError(this.handleError)
    );
  }

  getPatientEmployersbyId(PatientId): Observable<any>
  {
    return this._http.get(this.baseurl+"GetPatientEmployersbyPatientId", {params: PatientId})
    .pipe(
      map((res: Response) => res),
      tap(res => console.log(res)),
      catchError(this.handleError)
    );
  }
  postPatientEmployer(Patientdata): Observable<any>
  {
    return this._http.post(this.baseurl+"PostPatientEmployer", Patientdata)
    .pipe(
      map((res: Response) => res),
      tap(res => console.log(res)),
      catchError(this.handleError)
    );
  }

  updatePatientEmployer(Patientdata): Observable<any>
  {
    return this._http.put(this.baseurl+"PutPatientEmployer", Patientdata)
    .pipe(
      map((res: Response) => res),
      tap(res => console.log(res)),
      catchError(this.handleError)
    );
  }

  deletePatientEmployer(Patientdata): Observable<any>
  {
    return this._http.delete(this.baseurl+"DeletetPatientEmployer", Patientdata)
    // .pipe(
    //   map((res: Response) => res),
    //   tap(res => console.log(res)),
    //   catchError(this.handleError)
    // );
  }

  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}
