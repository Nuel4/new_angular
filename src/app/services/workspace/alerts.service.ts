import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private baseurl: string = environment.api.appointment.base_appointmentApi_url;
  constructor(private httpwrapperservice: HttpWrapperService,
    private _http: HttpClient
  ) {
  }
  // getAppointmentsByDate(pDate: any, pSlot: Number): Observable<any> {
  //   return this.httpwrapperservice.get(this.baseurl + environment.api.appointment.GetAppointmentsByDate +
  //     '?pAppointmentStartDateTime=' + pDate + '&sortEnumerator=' + pSlot)
  //     .pipe(
  //       map((res: Response) => res),
  //       tap(res => console.log(res)),
  //       catchError(this.handleError)
  //     );
  // }
  public getAlertType(): Observable<any> {
    return this._http.get(this.baseurl + "AlertType/GetAlertTypes")
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getAllAlerts(Param): Observable<any> {
    return this._http.get(this.baseurl + "Alert/GetAlertsWithPagedFilter", { params: Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }
  public getAllDoctors(): Observable<any> {
    return this._http.get(this.baseurl + "Users/GetAllDoctors")
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  public getAlerts(): Observable<any> {
    return this._http.get(this.baseurl + "Alert/GetAlerts")
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  public GetAlertsWithPagedFilter(pages): Observable<any> {
    return this._http.get(this.baseurl + "Alert/GetAlertsWithPagedFilter", { params: pages })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );


  }

  public GetUsersWithRoles(): Observable<any> {
    return this._http.get(this.baseurl + "Users/GetSystemUsers").pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  public EditAlerts(param): Observable<any> {
    return this._http.put(this.baseurl + "Alert/PutAlert", param).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }
  public GetUserDetails(param): Observable<any> {
    return this._http.get(this.baseurl + "Users/" + param).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}