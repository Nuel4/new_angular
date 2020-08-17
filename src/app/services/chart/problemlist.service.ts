import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from "rxjs"
import { map, catchError, filter } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class ProblemlistService {
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;
  private physicianCommonIcd9Url: string = environment.api.profile.base_profileApi_Url + 'PhysicianCommonIcd9Code';
  private physicianCommonCptCodeUrl : string = environment.api.profile.base_profileApi_Url + 'PhysicianCommonCptCode';
  constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) { }
  
  getFormattedProblemList(Param): Observable<any> {
    return this._http.get( this.baseChartUrl + "ProblemLists/GetFormattedProblemListPaged", {params: Param}).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }
DeleteProblem(Param): Observable<any> {
  return this._httpwrapperservice.deleteWithBody(this.baseChartUrl + "ProblemLists" , Param).pipe(
    catchError(this.handleError)
  )
}

EditProblem(Param): Observable<any> {
  return this._http.put(this.baseChartUrl + 'ProblemLists/UpdateProblemList' , Param).pipe(
    map((Response)=> Response),
    catchError(this.handleError)
  )
}

GetIcdCategory(): Observable<any> {
  return this._http.get(this.baseChartUrl + 'Icd9Category/GetIcd9Category').pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
GetCPTCategory(): Observable<any> {
  return this._http.get(this.baseChartUrl + 'CPTCategory/GetCPTCategory').pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
SearchByCodeAndDescription(Param): Observable<any> {
  return this._http.get(this.baseChartUrl + 'Icd9Code/SearchDrFirstProblem', {params: Param}).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}

SearchByCategory(Param): Observable<any> {
  return this._http.get(this.baseChartUrl +  'Icd9Code/SearchIcd9Codes', {params: Param}).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
SearchCPTCodes(Param): Observable<any> {
  return this._http.get(this.baseChartUrl +  'CptCode/SearchCPTCodes', {params: Param}).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
getPrefferedCPTCode(param):Observable<any>{
  return this._http.get(this.baseChartUrl + '/CptCode/GetPreferredPhysicianCptCode', {params:param}).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
AddProblem(param): Observable<any> {
  return this._http.post(this.baseChartUrl + 'ProblemLists/BulkInsertProblemList', param).pipe(
    map((res: Response) => res),
    catchError(this.handleError)
  )
}
getPhysicianIcd9Code(param):Observable<any>{
  return this._http.get(this.physicianCommonIcd9Url + '/GetPhysicianCommonIcd9Code', {params:param}).pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
getPhysicianCPTCode(){
  return this._http.get(this.physicianCommonCptCodeUrl + '/GetPhysicianCommonCptCode').pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
addPhysicianCptCode(value):Observable<any>{
  return this._http.post(this.physicianCommonCptCodeUrl + '/AddPhysicianCommonCptCode', value).pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
deletePhysicianCptCode(value):Observable<any>{
  return this._httpwrapperservice.deleteWithBody(this.physicianCommonCptCodeUrl + "/DeletePhysicianCommonCptCode" , value).pipe(
    map((response) => response),
    catchError(this.handleError)
  )
}
postPhysicianCommonIcd9Code(value):Observable<any>{
  return this._http.post(this.physicianCommonIcd9Url + '/PostPhysicianCommonIcd9Codes', value).pipe(
    map((response) => response),
    catchError(this.handleError)
  );
}
deletePhysicianCommonIcd9Code(value):Observable<any>{
  return this._httpwrapperservice.deleteWithBody(this.physicianCommonIcd9Url + "/DeletePhysicianCommonIcd9Codes" , value).pipe(
    map((response) => response),
    catchError(this.handleError)
  )
}
  private handleError(error){
    console.error(error);
    return Observable.throw(error || "ChartService error")
  }
}
