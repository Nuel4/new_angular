import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class ImmunzScheService {
    private baseChartUrl: string = environment.api.chart.base_chartApi_url + environment.api.chart.GetPatientImmunization;

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    GetPatientImmunizationsByPatientId(PatientId): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'GetPatientImmunizationsByPatientId?patientID=' + PatientId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetMrPatientImmunizationsWithPaged(pagesObj): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'GetMrPatientImmunizationsWithPaged?offset=' + pagesObj.offset + '&limit=' + pagesObj.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetPatientImmunizationsByPatientIdWithPaged(filter): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'GetPatientImmunizationsByPatientIdWithPaged?patientID=' + filter.patientid + '&offset=' + filter.offest + '&limit=' + filter.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    PosttMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.post(this.baseChartUrl + "/PosttMrPatientImmunization", PatientImmunizationObj).pipe(
          map((Response) => Response),
          catchError(this.handleError)
        );
    }

    DeletetMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.deleteWithBody(this.baseChartUrl + "/DeletetMrPatientImmunization", PatientImmunizationObj).pipe(
          map((Response) => Response),
          catchError(this.handleError)
        );
    }

    UpdatetMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.put(this.baseChartUrl + "/UpdatetMrPatientImmunization", PatientImmunizationObj).pipe(
          map((Response) => Response),
          catchError(this.handleError)
        );
    }

    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'ChartService error');
    }
}