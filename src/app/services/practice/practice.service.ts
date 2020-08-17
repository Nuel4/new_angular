import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class PracticeService {
    private basePracticeUrl: string = environment.api.practice.base_practiceApi_url + 'Practices';

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    getPractices(): Observable<any> {
        return this._httpwrapperservice.get(this.basePracticeUrl).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'PracticeService error');
    }
}
