import { Injectable } from '@angular/core';
import { map, catchError} from 'rxjs/operators'
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs'
import { HttpWrapperService } from '../../core/http-wrapper.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})


export class AllChartService {
    baseUrl: string = environment.api.chart.base_chartApi_url;
    constructor(private _http: HttpClient, private _httpwrapper: HttpWrapperService) { }

    getPowerBIToken(): Observable<any>{
    return this._httpwrapper.get(this.baseUrl + 'MrVital/AuthenticateAsync').pipe(
        map((Response: Response) => Response),
        catchError(this.handleError)
        )
    }
    private handleError(error){
    return Observable.throw(error || 'ChartService error')
        }
}