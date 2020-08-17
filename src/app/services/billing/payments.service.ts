import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { ObserveOnMessage } from 'rxjs/internal/operators/observeOn';


@Injectable({
    providedIn: 'root'
})
export class PaymentsService {
    private basePaymentUrl: string = environment.api.billing.base_billingApi_url + 'PatientPayments';
    private insurancePaymentUrl: string = environment.api.billing.base_billingApi_url + 'InsurancePayments';
    private Baseurl: string = environment.api.billing.base_billingApi_url;
    private  nonProcedureUrl: string = environment.api.billing.base_billingApi_url + 'NonProcedureOfficeCharge';
    constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient){
       
    }


    getPatientPayment(): Observable<any> {
        return this._httpwrapperservice.get(this.basePaymentUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    getInsurancePayment() : Observable<any> {
        return this._httpwrapperservice.get(this.insurancePaymentUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
        }

        getFinancilaCode(params): Observable<any> {
            return this._http.get(this.Baseurl+"FinancialCode/GetFinancialCode",{params: params}).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

        getCustomFormattedInsurance(params): Observable<any> {
            return this._http.get(this.Baseurl+"PatientInsuranceProviders/GetCustomFormattedInsurance",{params: params}).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

        getPatientAccountSummary(params): Observable<any> {
            return this._http.get(this.Baseurl+"PatientAccountSummary/GetPatientAccountSummaryByPatientId",{params: params}).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

      getInsurancePaymentCustomData(data):Observable<any>{
          return this._http.get(this.Baseurl + '/InsurancePayments/GetInsurancePaymentCustomData',{params:data}).pipe(
            map((response) => response),
            catchError(this.handleError));
      }

        SaveInsurancePayments(params): Observable<any> {
            return this._http.post(this.Baseurl+"InsurancePayments", params).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

        getInsurancePaymentByInsuranceProviderIdandStatus(params): Observable<any> {
            return this._http.get(this.Baseurl+"InsurancePayments/GetCustomFormattedInsurancePaymentByInsuranceProviderIdAndStatus", {params: params}).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

        getInsurancePaymentsByProviderId(params): Observable<any> {
            return this._http.get(this.Baseurl + "InsurancePayments/GetInsurancePaymentById", {params: params}).pipe(
                map((response) => response),
                catchError(this.handleError));
        }



        UpdateInsurancePayments(params):Observable<any>{
            return this._http.put(this.Baseurl + "InsurancePayments" , params).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }

        deleteInsurancePayments(params):Observable<any>{
            console.log(params)
            return this._http.request('delete',this.Baseurl + "InsurancePayments",{body:params}).pipe(
            map((response) => response),
            catchError(this.handleError)
            );
        }

        GetFinancialType(): Observable<any> {
            return this._http.get(this.Baseurl + "FinancialType/GetFinancialType").pipe(
                map((response) => response),
                catchError(this.handleError));
        } 


        getFinancialcode(params):Observable<any> {
            return this._http.get(this.Baseurl + "FinancialCode/GetFinancialCode",{params:params}).pipe(
                map((response) => response),
                catchError(this.handleError)
            )
        }

      getPatientCustomFormattedBills(params):Observable<any> {
          return this._http.get(this.Baseurl + "BillHeaders/GetPatientCustomFormattedBills",{params:params}).pipe(
              map((response) => response),
              catchError(this.handleError)
          )
      }
      postBillHeaders(value):Observable<any>{
          return this._http.post(this.Baseurl + '/BillHeaders',value).pipe(
            map((response) => response),
            catchError(this.handleError)
        )
      }

      postBillTransactions(value):Observable<any>{
          return this._http.post(this.Baseurl + '/BillTransactions', value).pipe(
            map((response) => response),
            catchError(this.handleError)
        )
      }
      getPatientCustomFormattedBillsItems(params):Observable<any> {
          return this._http.get(this.Baseurl + "BillTransactions/GetPatientCustomFormattedBillItems",{params:params}).pipe(
              map((response) => response),
              catchError(this.handleError)
          )
      }

      

// patient payments api integration

         getPatientPaymentCustomData(params): Observable<any> {
            return this._http.get(this.Baseurl + "PatientPayments/GetPatientPaymentCustomData",{params:params}).pipe(
                map((response) => response),
                catchError(this.handleError));
            }

         getpatientPaymentsInPatientPayments(params): Observable<any> {
             return this._http.get(this.Baseurl + "PatientPayments/GetPatientPaymentById",{params:params}).pipe(
                 map((response) => response),
                 catchError(this.handleError)
             );
         }

         

         getCustomFormattedPhysician(): Observable<any> {
            return this._http.get(this.Baseurl + "Physicians/GetCustomFormattedPhysicians").pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }

        getPatientGuarantor(params): Observable<any> {
            return this._http.get(this.Baseurl + "PatientGuarantor/GetPatientGuarantorData",{params:params}).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }

        SavePatientPayments(params): Observable<any> {
            return this._http.post(this.Baseurl+"PatientPayments/AddPatientPayment", params).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

         updatePatientPaymentById(data): Observable<any> {
            return this._http.put(this.Baseurl + "PatientPayments/UpdatePatientPayment",data).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }



        deletePatientPayments(params):Observable<any>{
            return this._http.request('delete',this.Baseurl + "PatientPayments",{body:params}).pipe(
            map((response) => response),
            catchError(this.handleError)
            );
        }

        
//write-off api integration
   
GetPatientCustomFormattedAdjWrite(params): Observable<any> {
           return this._http.get(this.Baseurl + "BillHeaders/GetPatientCustomFormattedAdjWriteOffBills",{params:params}).pipe(
           map((response) => response),
           catchError(this.handleError)
       );
   }
 
GetPatientCustomFormattedAdjWriteItems(params): Observable<any> {
    return this._http.get(this.Baseurl + "BillHeaders/GetPatientCustomFormattedAdjWriteOffBillItems",{params:params}).pipe(
    map((response) => response),
    catchError(this.handleError)
   );
}






// reversals api integration
        GetPaymentTransactionCustomData(params): Observable<any> {
            return this._http.get(this.Baseurl+"PaymentTransaction/GetPaymentTransactionCustomData",{params: params}).pipe(
                map((response) => response),
                catchError(this.handleError));
        }

        getReversePayment(params): Observable<any> {
            return this._http.get(this.Baseurl + "PaymentTransaction/ReversePayment" , {params:params}).pipe(
                map((response) => response),
                catchError(this.handleError)
            );

        }

        GetRequiredPatientAmountData(params): Observable<any> {
            return this._http.get(this.Baseurl + "PaymentTransaction/GetRequiredPatientAmountCustomData" , {params:params}).pipe(
                map((response) => response),
                catchError(this.handleError)
            );

        }

        updateBillHeader(value):Observable<any>{
            return this._http.put(this.Baseurl + '/BillHeaders', value).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }
        updateSuperBill(value):Observable<any>{
            return this._http.put(this.Baseurl + '/SuperBills',value).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }
        updateInsurancePayments(value):Observable<any>{
            return this._http.put(this.Baseurl + '/InsurancePayments',value).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }
        getCustomFormattedNonProcedureOfficeCharge(value):Observable<any>{
            return this._http.get(this.nonProcedureUrl + '/GetCustomFormattedPatientNonProdecureOfficeChargeEdit', {params:value}).pipe(
                map((response) => response),
                catchError(this.handleError)
            );
        }
    private handleError(error) {
        return Observable.throw(error || 'Patient Payment Error');
    }
}
