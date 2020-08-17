import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../core/http-wrapper.service'
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';



@Injectable({
    providedIn: 'root'
})
export class FileStorageService {
    private baseFilestorageUrl: string = environment.api.workspace.base_workspaceApi_url + 'Filestorage';

    constructor(private _httpwrapperservice: HttpWrapperService, private _http: HttpClient) {
        
    }

    addSktchpad(Params,blob): Observable<any>{        
        console.log("value of temp is",blob);
        // http://productionyeatsehrtest-api2.azurewebsites.net/api/v1/Filestorage/AddSketchPad?file=blob&filename=ash&contenType=png;
        // this._httpwrapperservice.postWithProgress(this.baseFilestorageUrl +'/AddSketchPad' +'?file='+Params.file+'&filename='+Params.filename+'&contenType='+Params.contentype).pipe(
           return this._http.post(this.baseFilestorageUrl +'/AddSketchPad' +'?filename='+Params.filename+'&contenType='+Params.contentype,blob).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    addFile(filepath: any, filedata: any): Observable<any> {
        return this._httpwrapperservice.postWithProgress(this.baseFilestorageUrl + '?filepath='+ filepath , filedata).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    
    addSketchPad(filepath: any, filedata: any): Observable<any> {
        return this._httpwrapperservice.postWithProgress(this.baseFilestorageUrl + '?filepath='+ filepath , filedata).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    downloadFile(filename: any): Observable<any> {
        return this._httpwrapperservice.get(this.baseFilestorageUrl + '/GetFileUri?filename=' + filename).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    deleteFile(filename: any) {
        return this._httpwrapperservice.deleteWithBody(this.baseFilestorageUrl, filename).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'FileStorageService error');
    }
}
