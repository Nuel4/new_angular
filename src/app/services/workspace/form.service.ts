import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'
import { ResponseContentType, RequestOptions } from '@angular/http';

@Injectable({
    providedIn: 'root'
})
export class FormService {
    private baseFromUrl: string = environment.api.workspace.base_workspaceApi_url + 'Forms';
private baseurl: string = environment.api.workspace.base_workspaceApi_url;
    constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) {
    }

    getAllForms(offset): Observable<any> {
        return this._httpwrapperservice.get(this.baseFromUrl + '/GetAllFormsWithPagination?offset=' + offset + '&limit=5').pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getFormsByFormName(fileName): Observable<any> {
        return this._httpwrapperservice.get(this.baseFromUrl + '/GetFormsByName?PFormName=' + fileName).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getAllFormsWithNamePagination(fileName, offset): Observable<any> {
        return this._httpwrapperservice.get(this.baseFromUrl + '/GetAllFormsWithNamePagination?pFormNane=' + fileName + '&offset=' + offset + '&limit=5').pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    addForm(form: any): Observable<any> {
        return this._httpwrapperservice.post(this.baseFromUrl, form).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addPatientDoc(filedata:any): Observable<any> {
        return this._httpwrapperservice.post(environment.api.workspace.base_workspaceApi_url + 'PatientFile/PostPatientFile' , filedata).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    deleteForm(form: any) {
        return this._httpwrapperservice.deleteWithBody(this.baseFromUrl, form).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    demodata(param): Observable<Blob> {
       const newlocal = this._http.get(this.baseurl+ 'Appointments/PatientAppointmentReport', { params: param, responseType: "blob"})
        return newlocal.map((res) =>  res)
            // catchError(this.handleError));
      }


    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'FormsService error');
    }
}
