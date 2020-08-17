import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LabOrderService {
  private labOrderUrl: string = environment.api.order.base_orderApi_url + 'LabOrder';
  private labOrderItemUrl: string = environment.api.order.base_orderApi_url + 'LabOrderItemResult';
  private laborataryUrl: string = environment.api.order.base_orderApi_url + 'Laboratory';
  private userUrl: string = environment.api.order.base_orderApi_url + 'Users';
  private cptCodeUrl: string = environment.api.order.base_orderApi_url + 'CptCode';
  private labOrderDocumentUrl : string = environment.api.order.base_orderApi_url + 'LabOrderDocument';
  private laboratoryUrl : string = environment.api.order.base_orderApi_url +'Laboratory'
  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient) { }

  getCustomOrders(data): Observable<any> {
    return this._http.get(this.labOrderUrl + '/GetCustomOrders', {params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getLabOrderItemResults(data):Observable<any>{
    return this._http.get(this.labOrderItemUrl + '/GetMrLabOrderItemResultwithDescription', {params: data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getLaboratory():Observable<any>{
    return this._http.get(this.laborataryUrl + '/GetLaboratories' ).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getUserDetails(data):Observable<any>{
    return this._http.get(this.userUrl + '/GetUserDetailsByLabOrderItemResult', {params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getUserDetailsByLabOrderItem(data):Observable<any>{
    return this._http.get(this.userUrl + '/GetUserDetailsByLabOrderItem',{params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getCptDetailsByLabOrder(data):Observable<any>{
    return this._http.get(this.cptCodeUrl + '/GetCPTDetailsByLabOrderItem', {params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getMrLabOrderItemResultDetails(data):Observable<any>{
    return this._http.get(this.labOrderItemUrl + '/GetLabOrderItemResult', {params:data}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  postLabOrderItemResults(value):Observable<any>{
    return this._http.post(this.labOrderItemUrl + '/PutLabOrderItemResult', value).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getLabOrderDocumnet(value):Observable<any>{
    return this._http.get(this.labOrderDocumentUrl + '/GetLabOrderDocument',{params:value}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getLaboratoryForOrder(value):Observable<any>{
    return this._http.get(this.laborataryUrl + '/GetLaboratoryforOrder',{params:value}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  getLabOrderReport(value):Observable<any>{
    return this._http.get(this.labOrderUrl + '/GetLabOrderReport',{params:value}).pipe(
      map((response) => response),
      catchError(this.handleError));
  }
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'SuperBillService error');
  }
}
