import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class InsuranceProviderService {
    private baseurl: string = environment.api.appointment.base_appointmentApi_url;
    private baseInsuranceProviderUrl: string = environment.api.billing.base_billingApi_url + 'InsuranceProviders';
    private basePtInsuranceProviderUrl: string = environment.api.billing.base_billingApi_url + 'PatientInsuranceProviders';
    private baseInsuranceCategoryUrl: string = environment.api.billing.base_billingApi_url + 'InsuranceCategory';
    private baseCptFeeScheduleUrl: string = environment.api.billing.base_billingApi_url + 'CptFeeSchedule';
    private baseFeeSchedule: string = environment.api.billing.base_billingApi_url + 'FeeSchedule';
    constructor(private _httpwrapperservice: HttpWrapperService,
        private _http: HttpClient) {
    }

    
    getCFInsurance(): Observable<any> {
        return this._httpwrapperservice.get(this.baseInsuranceProviderUrl+"/GetCustomFormattedInsuranceProvider").pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInsuranceProviders(): Observable<any> {
        return this._httpwrapperservice.get(this.baseInsuranceProviderUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInsurancebyPtId(pPatientId): Observable<any>{
        return this._http.get(this.basePtInsuranceProviderUrl + '/GetPatientInsuranceProviderByPatientId', {params: pPatientId}).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

getCFIbyPTandSBI(Param): Observable <any>{
    return this._http.get(this.basePtInsuranceProviderUrl + '/GetCustomFormattedInsuranceByPatientIdSuperBillId',{params: Param}).pipe(
        map((response) => response),
        catchError(this.handleError)
    );
}
    getInsuranceCategories(): Observable <any>{
        return this._http.get(this.baseInsuranceCategoryUrl + '/GetAllInsuranceCategory').pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }
   addInsuranceCategory(value):Observable<any>{
    return this._http.post(this.baseInsuranceCategoryUrl + '/AddInsuranceCategory',value).pipe(
        map((response) => response),
        catchError(this.handleError)
    );
   }
   
   deleteInsuranceCategory(value):Observable<any>{
       return this._http.request('delete',this.baseInsuranceCategoryUrl + '/RemoveInsuranceCategory',{body:value}).pipe(
        map((response) => response),
        catchError(this.handleError)
    );
   }
   updateInsuranceCategory(value):Observable<any>{
       return this._http.put(this.baseInsuranceCategoryUrl + '/UpdateInsuranceCategory',value).pipe(
        map((response) => response),
        catchError(this.handleError)
    );
   }
   updateInsuranceProvider(value):Observable<any>{
    return this._http.post(this.baseInsuranceProviderUrl + '/UpdateInsuranceProviders',value).pipe(
        map((response) => response),
        catchError(this.handleError)
    );
   }
    postpatientinsuranceproviders(value): Observable<any> {
        return this._http.post(this.basePtInsuranceProviderUrl + "/PostPatientInsuranceProvider", value).pipe(
          map((Response) => Response),
          catchError(this.handleError)
        );
        // return this._httpwrapperservice.post(this.baseurl+"PhysicianFacilityWeeklySchedules", usrsch).pipe(
        //   map((Response) => Response),
        //      catchError(this.handleError));
      }

      putpatientinsuranceproviders(value): Observable<any> { 
        console.log("value of primaryInsuranceForm clicking enter button pi is: ",value)
          return this._http.put(this.baseurl+"PatientInsuranceProviders/UpdatePatientInsuranceProvider", value).pipe(
            map((Response) => Response),
            catchError(this.handleError)
          );
      }

      getInsuranceByPatientId(params): Observable <any>{
        return this._http.get(this.baseurl + 'PatientInsuranceProviders/GetPatientInsuranceProviderforPatient', {params: params}).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
    }

    getPatientEncounterCPT(params): Observable <any>{
        return this._http.get(this.baseurl + 'PatientEnounterCPTDiagnosisAssociations/GetPatientEncounterCptDiagnosisAssociationsByPatientEncounterId', {params: params}).pipe(
            map((response) => response),
            catchError(this.handleError)
        );
        }

        getCFBillingCPTDiagnosisAssociation(params): Observable <any>{
            return this._http.get(this.baseurl + 'PatientEnounterCPTDiagnosisAssociations/GetCustomFormattedBillingCPTDiagnosisAssociationByEncounterId', {params: params}).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
            }

        putPatientEncounterCPT(Params): Observable <any>{
                return this._http.put(this.baseurl+"PatientEnounterCPTDiagnosisAssociations/UpdatePatientEncounterCptDiagnosisAssociations",Params).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
            }

            getInsuranceprovider(): Observable <any>{
                return this._http.get(this.baseurl+"InsuranceProviders/GetCustomFormattedInsurancepProviderByCode").pipe(
                map((response) => response),
                catchError(this.handleError)
            );
            }


            getCFPhysician(): Observable <any>{
                return this._http.get(this.baseurl+"Physicians/GetCustomFormattedPhysicians").pipe(
                map((response) => response),
                catchError(this.handleError)
            );
            }
            getCptFeesSchedule(data): Observable <any>{
                return this._http.get(this.baseCptFeeScheduleUrl + '/GetCPTFeeScheduleByFeeScheduleId',{params:data}).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );
            }
            getOrCreateDefaultFS(value):Observable<any>{
                return this._http.get(this.baseFeeSchedule + '/GetOrCreateDefaultFS', {params:value}).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );
            }

            getCustomFormattedCPT(value):Observable<any>{
                return this._http.get(this.baseCptFeeScheduleUrl + '/GetCustomFormattedCPTFeeScheule', {params:value}).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );
            }
            addCPTFeeSchedule(value):Observable<any>{
                return this._http.post(this.baseCptFeeScheduleUrl + '/AddCPTFeeSchedule', value).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );
            }
            updateCPTFeeSchedule(value):Observable<any>{
                return this._http.put(this.baseCptFeeScheduleUrl + '/UpdateCPTFeeSchedule', value).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );  
            }
            getCustomFormattedInsuranceProviderCategory(value):Observable<any>{
                return this._http.get(this.baseInsuranceProviderUrl + '/GetCustomFormattedInsuranceProviderForCategory', {params:value}).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );  
            }
            getCustomFormattedGrouped(value):Observable<any>{
                return this._http.get(this.baseInsuranceProviderUrl + '/GetCustomFormattedInsuranceProviderGrouped', {params:value}).pipe(
                    map((response) => response),
                    catchError(this.handleError)
                );  
            }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'InsuranceProviderService error');
    }

    
}



