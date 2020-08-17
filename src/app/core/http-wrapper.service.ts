import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


import { GlobalState } from '../core';
// import { AuthenticationStore } from '../authentication';


@Injectable()
export class HttpWrapperService {
    // TODO Busy indicator service & error handling to be implemted here globaly
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    // headers = new HttpHeaders().append('Authorization', 'Bearer '+this.authStore.token).append('Content-Type', 'application/json');
    constructor(private _http: HttpClient) {
    }

    get(url: string,param?: any): Observable<any> {
        return this._http.get(url, { headers: this.headers, params:param }).pipe(
            map((response: Response) => {
                // this._spinner.hide();
                return <any>response;
            })
            , catchError(this.handleError)
        );
    }

    post(url: string, model: any, headers?: any): Observable<any> {
        return this._http.post(url, model, { headers: headers ? headers : this.headers }).pipe(
            map((response) => response),
            catchError(this.handleError)
            );
    }

    putWithQueryParam(url: string): Observable<any> {
        return this._http.put(url, { headers: this.headers }).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    put(url: string, model: any): Observable<any> {
        if (model) {
            return this._http.put(url, model, { headers: this.headers }).pipe(
                map((response) => response),
                catchError(this.handleError))
        } else {
            return this._http.put(url, { headers: this.headers }).pipe(
                map((response) => response),
                catchError(this.handleError))

        }


    }

    delete(url: string): Observable<any> {
        return this._http.delete(url).pipe(
            map((response) => response),
            catchError(this.handleError));

    }

    deleteWithBody(url: string, model: any): Observable<any> {
        const req = new HttpRequest('DELETE', url, { headers: this.headers });
        const newReq = req.clone({ body: model });

        return this._http.request(newReq).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    postWithProgress(url: string, model: any): Observable<any> {
        const req = new HttpRequest('POST', url, model, {
            reportProgress: true,
        });
        return this._http.request(req);
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}
