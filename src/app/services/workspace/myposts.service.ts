import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators'
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'
import { RequestOptions } from '@angular/http';
import { HttpWrapperService } from '../../core/http-wrapper.service'


@Injectable({
  providedIn: 'root'
})
export class MypostsService {
  headers={
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
}
  private baseurl: string = environment.api.appointment.base_appointmentApi_url + "MyPost/";
  constructor(
    private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient
  ) { }

  getPagedPosts(Param): Observable<any> {
    return this._http.get(this.baseurl + "GetMyPostsByUserPaged", { params: Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    );
  }

  Mypost(savePost): Observable<any> {
    return this._http.post(this.baseurl + "PostMyPost", savePost).pipe(
      map((Response) => Response),
      catchError(this.handleError)
    );
  }
  deletePost(removeItem): Observable<any> {
  //   let body = JSON.stringify(
  //     {
  //       "MyPostsId": removeItem
  //   }
  // );
  // let options = new RequestOptions({
  //   headers: new Headers({ 'Content-Type': 'application/json' });,
  //   body : body
  // });
    return this._httpwrapperservice.deleteWithBody(this.baseurl + "DeleteMyPost", removeItem).pipe(
      catchError(this.handleError)
    );
  }
  updatePost(updateItem): Observable<any> {
    return this._http.put(this.baseurl + "UpdateMyPost", updateItem).pipe(
      map((Response) => Response),
      catchError(this.handleError)
    )
  }
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'service error');
  }
}
