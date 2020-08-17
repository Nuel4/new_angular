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
export class ClaimService {
    private basePhysiciansUrl: string = environment.api.billing.base_billingApi_url + 'Physicians';
    private claimsFormattedUrl = environment.api.billing.base_billingApi_url + 'Claims';
    private billTransactionsUrl = environment.api.billing.base_billingApi_url + 'BillTransactions';
    private superBillsUrl = environment.api.billing.base_billingApi_url + 'SuperBills';
    private billHeadersUrl = environment.api.billing.base_billingApi_url + 'BillHeaders';
    private SuperbillClaimTrackerUrl = environment.api.billing.base_billingApi_url + 'SuperbillClaimTracker';
    private FacilityUrl = environment.api.billing.base_billingApi_url + 'Facilities';
    private practiceUrl = environment.api.billing.base_billingApi_url;
    private physicianUrl = environment.api.billing.base_billingApi_url + 'Physicians';
    private superBillClaimUrl = environment.api.billing.base_billingApi_url + 'SuperbillClaim';
    private autoPostUrl = environment.api.billing.base_billingApi_url + 'ClaimRemittanceAdviceHeader';

    constructor(private _httpwrapperservice: HttpWrapperService,
        private _http: HttpClient) {
    }

    getPhysicians(): Observable<any> {
        return this._httpwrapperservice.get(this.basePhysiciansUrl + '/GetPhysicianWithMinimumDetails').pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getClaimSubmissionsWithFilters(data): Observable<any> {
        return this._http.get(this.claimsFormattedUrl + '/GetClaimSubmissionsWithFilters', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getCustomFormattedSuperBills(data): Observable<any> {
        return this._http.get(this.superBillsUrl + '/GetCustomFormattedSuperBillClaims', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getRejectClaimSubmissionsWithFilters(data): Observable<any> {
        return this._http.get(this.claimsFormattedUrl + '/GetClaimRejectedWithFilters', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    GetClaimRemittanceAdvice(data): Observable<any> {
        return this._http.get(this.claimsFormattedUrl + '/GetClaimRemittanceAdviceWithFilters', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getApproveRemittanceAdvice(data): Observable<any> {
        return this._http.get(this.claimsFormattedUrl + '/GetClaimApproveRemittanceAdvice', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    deleteApproveRemitance(data): Observable<any> {
        return this._http.post(this.billTransactionsUrl + '/RemovePaymentIdFromBillTransaction', '', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    approveRemittance(data): Observable<any> {
        return this._http.get(this.superBillsUrl + '/GetSuperbillStatusUsingBillHeaderId', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getBillTransactionsApproved(data): Observable<any> {
        return this._http.get(this.billTransactionsUrl + '/GetBillTransactionsToBeApprovedForRA', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getAfterDeleteApproveRemittance(): Observable<any> {
        return this._httpwrapperservice.get(this.billHeadersUrl + "/GetBillHeadersToBeApprovedForRA").pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    setWorkedRemittanceClaims(data): Observable<any> {
        return this._http.put(this.SuperbillClaimTrackerUrl + "/SetWorkedRemittanClaim", {}, { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));

    }
    getFacilities(data): Observable<any> {
        return this._http.get(this.FacilityUrl + "/GetFacilitiesById", { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getPractices(params) {
        return this._http.get(this.practiceUrl + "Practices/", params).pipe(
            map((response) => response),
            catchError(this.handleError));

    }
    getPhysiciansById(data): Observable<any> {
        return this._http.get(this.physicianUrl + `/${data}`).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    updatePhyPracticeInfo(value): Observable<any> {
        return this._http.put(this.practiceUrl + "practices/", value).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    updateFacilityInfo(value): Observable<any> {
        return this._http.put(this.FacilityUrl + "/UpdateFacility", value).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    updatePhysicianInfo(value): Observable<any> {
        return this._http.put(this.physicianUrl, value).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    updatePhysicianInformation(data): Observable<any> {
        return this._http.put(this.physicianUrl + '/UpdatePhysicianInfo', '', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getPhysiciansInfo(data): Observable<any> {
        return this._http.get(this.physicianUrl + "/GetPhysicianInfo", { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    getSuperBillIdClaim(data): Observable<any> {
        return this._http.get(this.superBillClaimUrl + '/GetSuperBillClaimBySuperBillId', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    viewRemittanceAdvice(data): Observable<any> {
        return this._http.get(this.claimsFormattedUrl + '/ViewRemittanceAdviceClaim', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    downloadRemmitance(data): Observable<any> {
        return this._http.post(this.claimsFormattedUrl + '/DownloadRemittanceAdvice', '', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    downloadRejectedClaims(data): Observable<any> {
        return this._http.post(this.claimsFormattedUrl + '/DownloadRejectedClaim', '', { params: data }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    autoPostRemittanceAdvice(data): Observable<any> {
        return this._http.get(this.autoPostUrl + '/AutoPostRA',{ params: data} ).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    approveRemittanceAdvice(data): Observable<any>{
        return this._http.post(this.autoPostUrl + '/ApproveAllocateRA','',{params:data}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'SuperBillService error');
    }
}
