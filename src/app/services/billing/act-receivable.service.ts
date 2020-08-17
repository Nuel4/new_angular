import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ActReceivableService {
  private Baseurl: string = environment.api.billing.base_billingApi_url;
  constructor( private _http: HttpClient)
   { }

   //ARWorklist API Integration

   getPatientARWorkList(params):Observable<any> {
     return this._http.get(this.Baseurl + "SuperBills/GetPatientsARWorklist",{params:params}).pipe(
       map((response) => response),
       catchError(this.handleError)
     )
   }

   getActiveUsersForApptDairy(params):Observable<any> {
     return this._http.get(this.Baseurl + "Users/GetActiveUsersForApptDiary",{params:params}).pipe(
       map((response) => response),
       catchError(this.handleError)
     )
   }

   getAlertTypeByAlertType(params):Observable<any> {
     return this._http.get(this.Baseurl + "AlertType/GetAlertTypeByAlertType",{params:params}).pipe(
       map((response) => response),
       catchError(this.handleError)
     )
   }

   getCustomFormattedPatientDetailsById(params):Observable<any> {
    return this._http.get(this.Baseurl + "Patients/GetCustomFormattedPatientDetailsById",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }


  saveAlert(params):Observable<any> {
    return this._http.post(this.Baseurl + "Alert/PostAlert",params).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  checkEmailAndAccess(params):Observable<any> {
    return this._http.get(this.Baseurl + "MessageEmail/CheckEmailAndAccess",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  sendMailSinglePatient(params):Observable<any> {
    return this._http.get(this.Baseurl + "MessageEmail/SendMailSinglePatient",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  UpdateLastStatementDate(params):Observable<any> {
     return this._http.put(this.Baseurl + "PatientBillingFile/UpdateLastStatementDatePAS",{params:params}).pipe(
       map((response) => response),
       catchError(this.handleError)
     )
  }

  getPatients(params):Observable<any> {
    return this._http.get(this.Baseurl + "Patients/GetPatients",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  getPatientAccountSummary(params):Observable<any>{
    return this._http.get(this.Baseurl + "PatientAccountSummary/GetPatientAccountSummaryByPatientId",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  getcustomFormattedInsurance(params):Observable<any>{
    return this._http.get(this.Baseurl + "PatientInsuranceProviders/GetCustomFormattedInsurance",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }

  getPatientPayment(params): Observable<any> {
   return this._http.get(this.Baseurl + "PatientPayments/GetPatientPaymentByPatientId",{params:params}).pipe(
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

getPatientCustomFormattedBillsItems(params):Observable<any> {
  return this._http.get(this.Baseurl + "BillTransactions/GetPatientCustomFormattedBillItems",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
  )
}


GetClaimsFile(params):Observable<any> {
  return this._http.get(this.Baseurl + "SuperBills/GetClaimsFile",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
  )
}


//  addPatientBillingFiles(params):Observable<any> {
//    return this._http.post(this.Baseurl + "PatientBillingFile/AddPatientBillingFiles",params).pipe(
//      map((response) => response),
//      catchError(this.handleError)
//    )
//  }

   //Patient collections API integration
   getPatientsCollections(params):Observable<any> {
    return this._http.get(this.Baseurl + "SuperBills/GetPatientsCollections",{params:params}).pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }



   private handleError(error) {
    return Observable.throw(error || 'Patient Payment Error');
}
}
