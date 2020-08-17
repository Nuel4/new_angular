import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import {environment} from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { CustomFormattedPatientAppointment } from '../../model/custom-formatted-patient-appointment.model';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class WaitingroomService {
  selectedAppointment: CustomFormattedPatientAppointment;
  appointments: CustomFormattedPatientAppointment[];
  private baseurl: string = environment.api.appointment.base_appointmentApi_url;
  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient) {}

  getAppointmentsByDate(pDate: Date, pSlot: Number): Observable<any> {
    return this._httpwrapperservice
      .get(
        this.baseurl +
          environment.api.appointment.GetAppointmentsByDate +
          '?pAppointmentStartDateTime=' +
          pDate +
          '&sortEnumerator=' +
          pSlot
      )
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getDuePatentList(payload) {
    return this._http.get(this.baseurl + 'Appointments/GetCustomFormattedPatientAppointments', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getAccountSummary(payload) {
    return this._http.get(this.baseurl + 'PatientAccountSummary/GetPatientAccountSummaryByPatientId', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getNovisitAppointments(payload){
    return this._http.get(this.baseurl + 'Appointments/GetCustomFormattedPatientNovisitAppointmentsByPatientID', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getBillersNotesList(payload) {    
    return this._http.get(this.baseurl + 'BillersNotes/GetBillersNotesListByPatientId', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getPatientPayments(payload) {    
    return this._http.get(this.baseurl + 'PatientPayments/GetPatientPaymentByPatientId', {params:payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  } 

  addBillersNote(payload) {
    return this._http.post(this.baseurl + 'BillersNotes/InsertBillerNote', payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  updateBillersNote(payload) {
    return this._http.put(this.baseurl + 'BillersNotes/UpdateBillerNote', payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  deleteBillersNote(payload) {
    return this._httpwrapperservice.deleteWithBody(this.baseurl + "BillersNotes/DeleteBillerNote", payload).pipe(
      catchError(this.handleError)
    );
  }


  getPastStatements(payload) {
    return this._http.get(this.baseurl + 'PatientBillingFile/GetPatientBillingFilesWithoutDataByPatientId', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getPhysicianId(payload) {
    return this._http.get(this.baseurl + 'Physicians/GetPhysicianIDByUserId', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  addCopay(payload) {
    return this._http.put(this.baseurl + 'Appointments',  payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getDmsCategory() {    
    return this._http.get(this.baseurl + 'DmsCategory/GetDmsCategories')
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getDocumentList(payload) {
    return this._http.get(this.baseurl + 'PatientFile/GetPatientDocumentByPatientIdPaged', {params: payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getRooms() {
    return this._http.get(this.baseurl + 'Room/GetRooms')
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}
