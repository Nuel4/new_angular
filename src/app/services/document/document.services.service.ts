import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpWrapperService } from '../../core/http-wrapper.service'

@Injectable({
  providedIn: 'root'
})
export class DocumentServicesService {
  private baseurl: string = environment.api.appointment.base_appointmentApi_url;
  constructor(private _http: HttpClient, private _hws: HttpWrapperService) { }


  getPatientFile(payload) {
    return this._http.get(this.baseurl + 'PatientFile/GetPatientFileByPatientFileId', {params:payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }
  deleteDoc(payload) {

    return this._hws.deleteWithBody(this.baseurl + 'PatientEncounterPatientFile/DeletePatientEncounterPatientFilesForPatientDocument', payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  updatePatientFile(payload) {
    console.log("value getting updated",payload);
    return this._http.put(this.baseurl + 'PatientFile/UpdatePatientFile', payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  

  getPatientEncounteFile(payload) {
    return this._http.get(this.baseurl + 'PatientEncounterPatientFile/GetPatientEncounterPatientFile', {params:payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getScanReviews(payload) {
    return this._http.get(this.baseurl + 'PatientFile/GetPatientDocumentByPatientIdForScanReview',{params:payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  getAttachFiles(payload) {
    return this._http.get(this.baseurl + 'PatientEncounters/GetPatientEncounterByPatientId',{params:payload})
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );  
  }

  insertEncounter(payload) {
    return this._http.post(this.baseurl + 'PatientEncounterPatientFile/PostPatientEncounterPatientFile',payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    ); 
  }

  updateEncounter(payload) {
    return this._http.put(this.baseurl + 'PatientFile/UpdatePatientFile',payload)
    .pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    ); 
  }


  updateReviewStatus(param) {
    return this._http.get(this.baseurl+"PatientFile/ReviewPatientFile", {params: param}).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    ); 
  }
  private handleError(error) {
    return Observable.throw(error || 'service error');
  }
}
