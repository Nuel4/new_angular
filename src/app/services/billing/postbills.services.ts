import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PostBillsService {
    private basePostBillUrl: string = environment.api.billing.base_billingApi_url + 'Physicians';
    private baseUrl =  environment.api.facilities.base_facilitiesApi_url;
        constructor(private _http: HttpClient) {}

    getPhyminbyFacID(facilityId){
        console.log("value of facility id is",facilityId)
      return  this._http.get(this.basePostBillUrl + '/GetPhysicianWithMinimumDetailsByFacilityId', {params: facilityId}).pipe(
            map((response) => response),
            catchError(this.handleError));
      }

  
    getFacilityList(): Observable<any> {
        return this._http.get(this.baseUrl + 'Facilities/GetFacilities')
        .pipe(map((response) => response),
        catchError(this.handleError)
        );
    }

    getCustomFormattedInsuranceByPatientId(param): Observable<any> {
        return this._http.get(this.baseUrl + 'PatientInsuranceProviders/GetCustomFormattedInsuranceByPatientIdSuperBillId',{params:param})
        .pipe(map((response) => response),
        catchError(this.handleError)
        );
    }

    getPOSByAllFacility(): Observable<any> {
        return this._http.get(this.baseUrl + 'PlaceOfService/GetPOSByAllFacility')
        .pipe(map((response) => response),
        catchError(this.handleError)
        );
    }
   
    getPatientARTypeInfo(param): Observable<any> {
        return this._http.get(this.baseUrl + 'SuperBills/GetPatientARTypeInfo',{params:param})
        .pipe(map((response) => response),
        catchError(this.handleError)
        );
    }

    getCptCode(param): Observable<any> {
        return this._http.get(this.baseUrl + 'CptCode/GetCptCode',{params:param})
        .pipe(map((response) => response),
        catchError(this.handleError)
        );
    }

    GetRvuvalues(value,para): Observable<any> {
return this._http.post(this.baseUrl + 'PatientEnounterCPTDiagnosisAssociations/GetRVUValues', value, {params: para})
        // return this._http.get(this.baseUrl + 'PatientEnounterCPTDiagnosisAssociations/GetRVUValues',{params: param})
        .pipe(map((response) => response),
        catchError(this.handleError)
        );
    }

    SavePostBilling(param): Observable<any> {
        return this._http.post(this.baseUrl + 'SuperBills/SavePostBilling',param)
                .pipe(map((response) => response),
                catchError(this.handleError)
                );
            }


    handleError(error){
        console.error(error);
        return Observable.throw(error || 'PostBill error');
    }
}