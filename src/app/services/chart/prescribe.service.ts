import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
@Injectable({
    providedIn: 'root'
})
export class PrescribeService {
 
    private baseChartUrl: string = environment.api.chart.base_chartApi_url;
    constructor(private _http: HttpClient, private _httpwrapperservice: HttpWrapperService) { }

    getPracticeById(Param): Observable<any> {
        return this._http.get(this.baseChartUrl + "Practices/" + Param).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    getFacilityByUserId(Param): Observable<any> {
        return this._http.get(this.baseChartUrl + "Facilities/GetFacilitiesByuserId", { params: Param }).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    getCustomFormattedInjectionsbyPatientID(Param): Observable<any> {
        return this._http.get(this.baseChartUrl + "ImmunizationInjection/GetCustomFormattedInjectionsbyPatientID", { params: Param }).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    getDrFirstServiceUrl(Param): Observable<any> {
        return this._http.get(this.baseChartUrl + "DrFirstService/DoDrFirst", { params: Param }).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    UpdateEPrescription(Param): Observable<any> {
        return this._http.post(this.baseChartUrl + "DrFirstService/UpdateEPrescription", Param ).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    getPhysicianIDByUserId(Param): Observable<any> {
        return this._http.get(this.baseChartUrl + "Physicians/GetPhysicianIDByUserId", { params: Param }).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }



    postChiefComplaintment(Param): Observable<any> {
        return this._http.post(this.baseChartUrl + "ChiefComplaints", Param ).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    getPatientEcnounter(Params): Observable<any>{
        return this._http.get(this.baseChartUrl+'PatientEncounters/GetPatientEncounterDetails', {params: Params}).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }


    postPatientEncounter(Param): Observable<any> {
        return this._http.post(this.baseChartUrl + "PatientEncounters/AddPatientEncounter", Param ).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }
    postPlan(Param): Observable<any> {
        return this._http.post(this.baseChartUrl + "PlanProcedures", Param ).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    GetSelectedIcdCodes(Params): Observable<any>{
        return this._http.get(this.baseChartUrl+'Icd9Code/GetSelectedIcdCodes', {params: Params}).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }



    AddorGetBillingSections(Params): Observable<any>{
        return this._http.get(this.baseChartUrl+'TemplateSection/AddOrGetBillingSections', {params: Params}).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    getAdditionalBillDet(Params): Observable<any> {
        return this._http.get(this.baseChartUrl+'AdditionalBillingDetail/GetAdditionalBillingDetailsbyEnocunterId', {params: Params}).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    AddBillDet(Params): Observable<any>{
        return this._http.post(this.baseChartUrl+'AdditionalBillingDetail/AddAdditionalBillingDetails', Params).pipe(
            map((res: Response) => res),
            catchError(this.handleError)
        )
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || "ChartService error")
    }
}