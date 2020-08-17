import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';



@Injectable({
    providedIn: 'root'
})

export class SuperBillService {
    private baseSuperBillUrl: string = environment.api.billing.base_billingApi_url + 'SuperBills';
    private PatientEncounterUrl: string = environment.api.billing.base_billingApi_url + 'PatientEncounters';
    private BillHeaderUrl: string = environment.api.billing.base_billingApi_url + 'BillHeaders';
    private Billernotes: string = environment.api.billing.base_billingApi_url + 'BillersNotes';
    private baseurl: string = environment.api.billing.base_billingApi_url;

    constructor(private _httpwrapperservice: HttpWrapperService,
        private _http: HttpClient) {
    }

    getBillerNotes(Param): Observable<any> {
        return this._http.get(this.Billernotes+'/GetBillersNoteByEncounterId', {params: Param}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getSuperBills(): Observable<any> {
        return this._httpwrapperservice.get(this.baseSuperBillUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getSuperBillData(): Observable<any> {
        return this._httpwrapperservice.get(this.baseSuperBillUrl + '/GetSuperBillData').pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getSuperBillbyID(pSuperBillId): Observable<any> {
        return this._http.get(this.baseSuperBillUrl + '/GetSuperBillData', {params: pSuperBillId}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getEncounterCptCodes(pEnCounterID): Observable<any> {
        return this._http.get(this.PatientEncounterUrl + '/GetEncounterCptCodes', {params: pEnCounterID}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    


    getPstBillingDetails(showBillParam: any): Observable<any> {
        return this._http.get(this.baseSuperBillUrl + '/GetPstBillingDetails', { params: showBillParam }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getBillHeaderDetails(pEnCounterID): Observable<any> {
        return this._http.get(this.BillHeaderUrl + '/GetBillHeaderByEncouner', {params: pEnCounterID}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    
    archieveSuperBills(Params): Observable<any> {
        return this._http.post(this.baseSuperBillUrl+"/ArchiveSuperbill", Params).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    DeleteSuperBills(Params): Observable<any> {
        return this._http.post(this.baseSuperBillUrl,{},{params: Params}).pipe(
        // return this._http.post(this.baseSuperBillUrl+"/DeleteSuperbillById",{params:Params} ).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    unArchieveSuperBills(Params): Observable<any> {
        return this._http.post(this.baseSuperBillUrl+"/UnArchiveSuperbill", Params).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getAppointmentDetailsbyid(Params): Observable<any> {
        return this._http.get(this.baseSuperBillUrl+"/GetAppointmentDetailsByAppointmentId",{params: Params} ).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getModifierCodes(): Observable<any> {
        return this._http.get(this.baseurl+"Modifier/GetModifierCodes" ).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    isICD(Params): Observable<any> {
        return this._http.get(this.baseSuperBillUrl+"/IsICD10Effective", {params: Params} ).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'SuperBillService error');
    }
}
