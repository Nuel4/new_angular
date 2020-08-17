import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'
import { HttpWrapperService } from '../../core/http-wrapper.service'


@Injectable({
  providedIn: 'root'
})
export class TablePharmacyService {
  private baseurl: string = environment.api.workspace.TablePharmacy;
  private PatientPreferredPharmacy: string = environment.api.workspace.base_workspaceApi_url+"PatientPreferredPharmacy/"; 
  constructor(private _http: HttpClient,private _httpwrapperservice: HttpWrapperService) { }

  getTblPharmacyPagedwithFilters(Pharmacyparams): Observable<any>
  {
    return this._http.get(this.baseurl+'GetTblPharmaciesPagedWithFilters', {params: Pharmacyparams})    
    .pipe(
      map((response) => response),
      catchError(this.handleError));
}
  

  getCFPatientPreferredPharmacy(Params): Observable<any> {
    return this._http.get(this.PatientPreferredPharmacy+"GetCusotmerFormattedPatientPreferredPharmacy",{params: Params}).pipe(
      map((response) => response),
      catchError(this.handleError));
}
  
deletePPP(Params): Observable<any> {
  let url = this.PatientPreferredPharmacy+"DeletePatientPreferredPharmacy";
  return this._httpwrapperservice.deleteWithBody(url,Params).pipe(
  // return this._http.delete()
  // return this._http.delete(this.PatientPreferredPharmacy+"DeletePatientPreferredPharmacy",{params: Params}).pipe(
    map((response) => response),
    catchError(this.handleError));
}
  PostpatientpreferredPharmacy(value): Observable<any>
  {
    console.log("value of the showPatientPharmacy is:",value)
return this._http.post(this.PatientPreferredPharmacy+"PostPatientPreferredPharmacy", value).pipe(
  map((response) => response),
  catchError(this.handleError));
}
  
putPatientPreferredPharmacy(value): Observable<any>{
  return this._http.put(this.PatientPreferredPharmacy+"PutPatientPreferredPharmacy", value).pipe(
    map((response) => response),
    catchError(this.handleError));
}

  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'TablePharmacyService error');
}
}
