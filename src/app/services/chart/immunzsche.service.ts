import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators'


@Injectable({
    providedIn: 'root'
})
export class ImmunzScheService {
    private baseChartUrl: string = environment.api.chart.base_chartApi_url;
    private patientEncounterUrl: string = environment.api.chart.base_chartApi_url;

    constructor(private _httpwrapperservice: HttpWrapperService) {
    }

    //Patients

    PatientById(Patientid): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'Patients/' + Patientid).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetAllImmunizationSchduleHeader(): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + environment.api.chart.Getmrimmunizationscheduleheader).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetMrImmunizationScheduleIntervalByScheduleByHeaderIdWithPagination(filter): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationScheduleInterval/GetMrImmunizationScheduleIntervalByScheduleByHeaderIdWithPagination?pheaderId=' + filter.headerid + '&offset=' + filter.offset + '&limit=' + filter.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    //PatientImmunization//

    GetPatientImmunizationsByPatientId(PatientId): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'PatientImmunization/GetPatientImmunizationsByPatientId?patientID=' + PatientId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetPatientImmunizationByPatientImmunizationId(PatientImmunizationId): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'PatientImmunization/GetPatientImmunizationByPatientImmunizationId?pPatientImmunizationId=' + PatientImmunizationId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetMrPatientImmunizationsWithPaged(pagesObj): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'PatientImmunization/GetMrPatientImmunizationsWithPaged?offset=' + pagesObj.offset + '&limit=' + pagesObj.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetPatientImmunizationsByPatientIdWithPaged(filter): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'PatientImmunization/GetPatientImmunizationsByPatientIdWithPaged?patientID=' + filter.patientid + '&offset=' + filter.offset + '&limit=' + filter.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    PosttMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.post(this.baseChartUrl + "PatientImmunization/PostMrPatientImmunization", PatientImmunizationObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        );
    }

    PutMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.put(this.baseChartUrl + "PatientImmunization/UpdatetMrPatientImmunization", PatientImmunizationObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        );
    }

    DeletetMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.deleteWithBody(this.baseChartUrl + "PatientImmunization/DeletetMrPatientImmunization", PatientImmunizationObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        );
    }

    UpdatetMrPatientImmunization(PatientImmunizationObj): Observable<any> {
        return this._httpwrapperservice.put(this.baseChartUrl + "PatientImmunization/UpdatetMrPatientImmunization", PatientImmunizationObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        );
    }

    //MrImmunizationType//

    GetMrImmunizationType(): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationType/GetMrImmunizationType').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetMrImmunizationTypeByMrImmunizationTypeID(ImmTypeId): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationType/GetMrImmunizationTypeByMrImmunizationTypeID?pMrImmunizationTypeID=' + ImmTypeId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    //MrImmunizationScheduleHeader//

    GetMrImmunizationScheduleHeader(): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationScheduleHeader').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    //MrImmunizationBatch//

    GetMrImmunizationBatchByMrImmunizationTypeId(ImmTypeId): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationBatch/GetMrImmunizationBatchByMrImmunizationTypeId?PMrImmunizationTyeId=' + ImmTypeId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    GetMrImmunizationBatchByMrImmunizationTypeIdPaged(ImmTypeObj): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationBatch/GetMrImmunizationBatchByMrImmunizationTypeIdPaged?PMrImmunizationTyeId=' + ImmTypeObj.PMrImmunizationTyeId + '&offset=' + ImmTypeObj.offset + '&limit=' + ImmTypeObj.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetMrImmunizationBatchByMrImmunizationBatchId(ImmBatchId): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationBatch/GetMrImmunizationBatchByMrImmunizationBatchId?pMrBatchId=' + ImmBatchId).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    InsertMrImmunizationBatch(ImmunizationBatchObj): Observable<any> {
        return this._httpwrapperservice.post(this.baseChartUrl + "MrImmunizationBatch/InsertMrImmunizationBatch", ImmunizationBatchObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        )
    }

    UpdateMrImmunizationBatch(ImmunizationBatchObj): Observable<any> {
        return this._httpwrapperservice.put(this.baseChartUrl + "MrImmunizationBatch/UpdateMrImmunizationBatch", ImmunizationBatchObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        )
    }

    DeleteMrImmunizationBatch(ImmunizationBatchObj): Observable<any> {
        return this._httpwrapperservice.deleteWithBody(this.baseChartUrl + "MrImmunizationBatch/DeleteMrImmunizationBatch", ImmunizationBatchObj).pipe(
            map((Response) => Response),
            catchError(this.handleError)
        )
    }
    //DrugAdministrationRoute//

    GetDrugAdministrationRoutes(): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'DrugAdministrationRoute/GetDrugAdministrationRoutes').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    GetDrugAdministrationRoutesPaged(paged): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'DrugAdministrationRoute/GetDrugAdministrationRoutesPaged?offset=' + paged.offset + '&limit=' + paged.limit).pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    //MrImmunizationSite

    GetMrImmunizationSite(): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'MrImmunizationSite/GetMrImmunizationSite').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    //Physicians

    GetPhysicianUserList(): Observable<any> {
        return this._httpwrapperservice.get(this.baseChartUrl + 'Physicians/GetPhysicianUserList').pipe(
            map((response) => response),
            catchError(this.handleError));
    }

    //Patient Encounter
    insertPatientEncounter(value): Observable<any>{
        return this._httpwrapperservice.post(this.patientEncounterUrl + '/InsertPatientEncounter',value).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    addPatientEncounter(data):Observable<any>{
        return this._httpwrapperservice.post(this.patientEncounterUrl + 'PatientEncounters/AddPatientEncounter',data).pipe(
            map((response) => response),
            catchError(this.handleError));
    }
    updatePatientEncounter(data):Observable<any>{
        return this._httpwrapperservice.put(this.patientEncounterUrl + 'PatientEncounters/UpdatePatientEncounter', data).pipe(
            map(result => result),
            catchError(this.handleError)
        )
    }
    private handleError(error) {
        console.error(error);
        return Observable.throw(error || 'ChartService error');
    }
}