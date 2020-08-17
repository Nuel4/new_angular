import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'



@Injectable({
  providedIn: 'root'
})
export class NoriceBoardService {
  private baseurl: string = environment.api.appointment.base_appointmentApi_url;
  constructor(private httpwrapperservice: HttpWrapperService,
    private _http: HttpClient
  ) {
  }

  getCustomFormattedPatientDetailsById(params): Observable<any> {
    return this._http.get(this.baseurl + "Patients/GetCustomFormattedPatientDetailsById", { params: params }).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  getAllMessages(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPosting/GetNoticeBoardPostingWithUserNamePaged", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );

  }
  getSentMessages(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPostComment/GetSentComments", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getRecipentList(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPostAsignee/GetNoticeBoardPostAssigneeUsersByNoticeBoardPostingId", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getAllRecipients(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPostComment/GetMostFrequentUsers", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      );
  }

  getRoles(payload) {
    return this._http.get(this.baseurl + "Roles/GetRoles", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  getUsersWrtRoles(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPostComment/GetMostFrequentUsersByRole", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  getAllChats(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPostComment/GetCustomFormattedNoticeBoardCommentsByNoticeBoardPostingId", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  getPatientDocuments(payload) {
    return this._http.get(this.baseurl + "PatientFile/GetPatientDocumentByUserId", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  getDocView(payload) {
    return this._http.get(this.baseurl + "PatientFile/GetPatientFileReviewStatus", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  sendMessages(data) {
    return this._http.post(this.baseurl + "NoticeBoardPosting/AddNewNoticeBoardMessage", data)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  getNoticeBoardPostingById(payload) {
    return this._http.get(this.baseurl + "NoticeBoardPosting/GetNoticeBoardPostingById", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  markAsCompleted(payload) {
    return this._http.put(this.baseurl + "NoticeBoardPosting/MarkMessageAsCompleted", payload)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  updateMessages(payload) {
    return this._http.post(this.baseurl + "NoticeBoardPosting/SaveNoticeBoardMessage", payload)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  getCurrentUsersDetails(payload) {
    return this._http.get(this.baseurl + "Users/GetCustomFormattedUsersByUserIds", { params: payload })
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  markAsRead(payload) {
    return this._http.put(this.baseurl + "NoticeBoardPostAsignee/MarkMessageAsRead", payload)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  forwardMessages(payload) {
    return this._http.post(this.baseurl + "NoticeBoardPosting/ForwardMessage", payload)
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }

  reviewDocument(payload) {
    return this._http.post(this.baseurl + "PatientFile/ReviewPatientFile", {params: payload})
      .pipe(
        map((res: Response) => res),
        catchError(this.handleError)
      )
  }
  private handleError(error) {
    return Observable.throw(error || 'service error');
  }

  getPatient(patientId) {
    return this._http.get(this.baseurl + 'Patients/' + patientId).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }
}