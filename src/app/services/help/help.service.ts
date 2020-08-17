import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private coreDomainUrl: string = environment.api.report.base_reportApi_url + 'CoreDomain';
  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient) { }

  getCategories(): Observable<any> {
    return this._http.get(this.coreDomainUrl + '/GetCategories').pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  getSupportVideos():Observable<any>{
    return this._http.get(this.coreDomainUrl + '/GetSupportVideos').pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  getPracticeLicense():Observable<any>{
    return this._http.get(this.coreDomainUrl + '/GetPracticeLicense').pipe(
      map((response) => response),
      catchError(this.handleError)
    )
  }
  getSupportvideosByCategoryId(data):Observable<any>{
    return this._http.get(this.coreDomainUrl + '/GetSupportVideosByCategoryId',{params:data}).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
 
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'SuperBillService error');
  }
}
