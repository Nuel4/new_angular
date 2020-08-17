import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { HttpClient } from '@angular/common/http';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';

@Injectable({
  providedIn: 'root'
})
export class BillingSetupService {
  private CPTCategoreyUrl = environment.api.billing.base_billingApi_url + 'CPTCategory';
  private FacilitiesUrl = environment.api.billing.base_billingApi_url + 'Facilities';
  private CPTCodeCategoryUrl = environment.api.billing.base_billingApi_url + 'CptCode';
  private FacilityInsuranceProviderUrl = environment.api.billing.base_billingApi_url + 'FacilityInsuranceProviderBillingDetail';
  private PlaceOfServiceUrl = environment.api.billing.base_billingApi_url + 'PlaceOfService';
  private TypesOfServiceUrl = environment.api.billing.base_billingApi_url + 'TypesOfService';
  private NonProcedureUrl = environment.api.billing.base_billingApi_url + 'NonProcedureOfficeCharge';
  private CptRvuUrl = environment.api.billing.base_billingApi_url + 'CptRvu';
  private PhysicianUrl = environment.api.billing.base_billingApi_url + 'Physicians';
  private baseInsuranceProviderUrl = environment.api.billing.base_billingApi_url + 'InsuranceProviders';
  private PhysicianInsuranceIdentificationUrl = environment.api.billing.base_billingApi_url + 'PhysicianInsuranceIdentification';
  private feesScheduleUrl =  environment.api.billing.base_billingApi_url + 'FeeScheduleType';
  private RvuPaymentMethodUrl = environment.api.billing.base_billingApi_url + 'RvuPaymentMethod';
  private InsuranceCategoryUrl = environment.api.billing.base_billingApi_url + 'InsuranceCategory';
  private FeeScheduleUrl = environment.api.billing.base_billingApi_url + 'FeeSchedule';
  private superBillUrl = environment.api.billing.base_billingApi_url + 'SuperBills'
  constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) { }

  getCPTCategory(): Observable<any> {
    return this._http.get(this.CPTCategoreyUrl + '/GetCPTCategory').pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getFaciliteis():Observable<any>{
    return this._http.get(this.FacilitiesUrl + '/GetFacilities').pipe(
      map((response) => response),
      catchError(this.handleError));  
    }
    getCptCodeCategory(data):Observable<any>{
      return this._http.get(this.CPTCodeCategoryUrl + '/GetCptCodebyCategory',{params:data}).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getFacilityInsuranceProvider(data):Observable<any>{
      return this._http.get(this.FacilityInsuranceProviderUrl + '/GetInsuranceProviderBillingDetailsByFacility',{params:data}).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    postFacilityInsuranceProvider(data):Observable<any>{
      return this._http.post(this.FacilityInsuranceProviderUrl + '/PostOrUpdateFacilityInsuranceProviderBillingDetails',data).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    // updateFacilityInsuranceProvider(data){
    //   return this._http.put(this.FacilityInsuranceProviderUrl + '/UpdateFacilityInsuranceProviderBillingDetails',data).pipe(
    //     map((response) => response),
    //     catchError(this.handleError));  
    // }
    deleteFacilityInsuranceProvider(data):Observable<any>{
      return this._httpwrapperservice.deleteWithBody(this.FacilityInsuranceProviderUrl + '/DeleteFacilityInsuranceProviderBillingDetailsByFacility',data).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getPlaceOfServices():Observable<any>{
      return this._http.get(this.PlaceOfServiceUrl + '/GetPlaceOfServices').pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getTypesOfServices():Observable<any>{
      return this._http.get(this.TypesOfServiceUrl + '/GetTypeOfServices').pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getNonProcedureOfficeCharge():Observable<any>{
      return this._http.get(this.NonProcedureUrl + '/GetNonProcedureOfficeCharge').pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    saveCPTCode(data):Observable<any>{
      return this._http.post(this.CPTCodeCategoryUrl + '/InsertCptCode',data).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getCPTRVUdata(data):Observable<any>{
      return this._http.get(this.CptRvuUrl + '/GetCptRvu',{params:data}).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getCPTRVUCustomFormattedData(data):Observable<any>{
      return this._http.get(this.CptRvuUrl + '/GetCustomFormattedRVUForCPT',{params:data}).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    postCPtRuv(data):Observable<any>{
      return this._http.post(this.CptRvuUrl + '/AddCptRvu',data).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    deleteNonproceduralOfficeCharge(data):Observable<any>{
      return this._http.request('delete',this.NonProcedureUrl + '/DeleteNonProcedureOfficeCharg',{body: data}).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    postNonProceduralOfficeCharge(data):Observable<any>{
      return this._http.post(this.NonProcedureUrl + '/AddNonProcedureOfficeCharg',data).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    updateNonProcedureOfficeCharge(data):Observable<any>{
      return this._http.put(this.NonProcedureUrl + '/UpdateNonProcedureOfficeCharg',data).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    UpdateCptCode(data):Observable<any>{
      return this._http.put(this.CPTCodeCategoryUrl + '/UpdateCptCode',data ).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    UpdateCptRvu(data):Observable<any>{
      return this._http.put(this.CptRvuUrl + '/UpdateCptRvu',data ).pipe(
        map((response) => response),
        catchError(this.handleError)); 
    }
    uploadCptRvuDefaultFS(value,data):Observable<any>{
      return this._http.post(this.CptRvuUrl + '/UploadCPTRVUWithDefaultFS', value, {params:data}).pipe(
        map((response) => response),
        catchError(this.handleError)); 
    }
    deleteCptCode(data):Observable<any>{
      return this._httpwrapperservice.deleteWithBody(this.CPTCodeCategoryUrl + '/DeleteCptCode',data).pipe(
        map((response) => response),
        catchError(this.handleError)); 
    }
    getSearchPhysicianBilling(data):Observable<any>{
      return this._http.get(this.PhysicianUrl + '/SearchPhysicianBillingPaged',{params:data}).pipe(
        map((response) => response),
        catchError(this.handleError));  
    }
    getPhysiciansById(data): Observable<any> {
      return this._http.get(this.PhysicianUrl + `/${data}`).pipe(
          map((response) => response),
          catchError(this.handleError));
  }
  updatePhysician(value): Observable<any> {
    return this._http.put(this.PhysicianUrl, value).pipe(
        map((response) => response),
        catchError(this.handleError));
}
 
getCFInsurance(): Observable<any> {
  return this._httpwrapperservice.get(this.baseInsuranceProviderUrl+"/GetCustomFormattedInsuranceProvider").pipe(
      map((response) => response),
      catchError(this.handleError));
}
getPhysicianInsuranceIdentification(param):Observable<any>{
  return this._http.get(this.PhysicianInsuranceIdentificationUrl + '/GetPhysicianInsuranceIdentificationByPhysician',{params:param}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
postPhysicianInsuranceIdentification(data):Observable<any>{
  return this._http.post(this.PhysicianInsuranceIdentificationUrl + '/AddPhysicianInuranceIdentification',data).pipe(
    map((response) => response),
    catchError(this.handleError));
}
updatePhysicianInsuranceIdentification(data):Observable<any>{
  return this._http.put(this.PhysicianInsuranceIdentificationUrl + '/Updatephysicianinsuranceidentification',data).pipe(
    map((response) => response),
    catchError(this.handleError));
}
deletephysicianinsuranceidentification(data):Observable<any>{
  return this._httpwrapperservice.deleteWithBody(this.PhysicianInsuranceIdentificationUrl + '/Deletephysicianinsuranceidentification',data).pipe(
    map((response) => response),
    catchError(this.handleError)); 
}
getCustomFormattedInsuranceProvider(param):Observable<any>{
  return this._http.get(this.baseInsuranceProviderUrl + '/GetCustomFormattedInsuranceDetailProvider', {params:param}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
getInsuranceProviderById(data):Observable<any>{
  return this._http.get(this.baseInsuranceProviderUrl + `/${data}`).pipe(
    map((response) => response),
    catchError(this.handleError));
}
postInsuranceProvider(data):Observable<any>{
  return this._http.post(this.baseInsuranceProviderUrl, data).pipe(
    map((response) => response),
    catchError(this.handleError));
}
updateInsuranceProvider(data):Observable<any>{
  return this._http.put(this.baseInsuranceProviderUrl ,data).pipe(
    map((response) => response),
    catchError(this.handleError));
}
getFeesScheduleType():Observable<any>{
  return this._http.get(this.feesScheduleUrl + '/GetFeeScheduleTypes').pipe(
    map((response) => response),
    catchError(this.handleError));
}
getRVUPaymentMethod():Observable<any>{
  return this._http.get(this.RvuPaymentMethodUrl + '/GetRvuPaymentMethods').pipe(
    map((response) => response),
    catchError(this.handleError));
}
getInsuranceCategory():Observable<any>{
  return this._http.get(this.InsuranceCategoryUrl + '/GetAllInsuranceCategory').pipe(
    map((response) => response),
    catchError(this.handleError));
}
addFeeScheduleType(value):Observable<any>{
  return this._http.post(this.feesScheduleUrl +  '/AddFeeSchedule', value).pipe(
    map((response) => response),
    catchError(this.handleError));
}
bulkAddFeeScheduleType(value):Observable<any>{
  return this._http.post(this.feesScheduleUrl +  '/BulkAddFeeScheduleType', value).pipe(
    map((response) => response),
    catchError(this.handleError));
}
bulkUpdateFeeScheduleType(value):Observable<any>{
  return this._http.put(this.feesScheduleUrl +  '/BulkUpdateFeeScheduleType', value).pipe(
    map((response) => response),
    catchError(this.handleError));
}
bulkDeleteFeeScheduleType(value):Observable<any>{
  return this._http.request('delete', this.feesScheduleUrl +  '/BulkDeleteFeeScheduleType', {body: value}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
getCustomFormattedFeeSchedule(value):Observable<any>{
  return this._http.get(this.FeeScheduleUrl + '/GetCustomFormattedFeeSechedule',{params:value}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
addFeeSchedule(value):Observable<any>{
  return this._http.post(this.FeeScheduleUrl + '/AddFeeSechedule' , value).pipe(
    map((response) => response),
    catchError(this.handleError));
}
updateFeeSchedule(value):Observable<any>{
  return this._http.put(this.FeeScheduleUrl + '/UpdateFeeSechedule', value).pipe(
  map((response) => response),
  catchError(this.handleError));
}
postBillingPortal():Observable<any>{
  return this._http.get(this.superBillUrl + '/billingportal' ).pipe(
    map((response) => response),
    catchError(this.handleError));
 
}
    private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'SuperBillService error');
  }
}
