import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { HttpWrapperService } from '../../core/http-wrapper.service'
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ProgressnoteService {
  templateType = new EventEmitter<[]>();
  private baseChartUrl: string = environment.api.chart.base_chartApi_url;
  TemplateGroups;

  constructor(private _http: HttpClient, private _httpwrapperservice: HttpWrapperService) { }

  getMrPatientEncounterByPatientId(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + "PatientEncounters/GetPatientEncounterByPatientId", { params: Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }

  getSearchIMOProblems(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + "IMO/SearchIMOProblems", { params: Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }



  searchDrFirstProblem(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + "Icd9Code/SearchDrFirstProblem", { params: Param }).pipe(
      map((res: Response) => res),
      catchError(this.handleError)
    )
  }

  getCustomFormattedFacility(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Facilities/GetCustomFormattedGenericFacilities')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )

  }
  getUserSpeciality(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Speciality/GetUserSpecialty', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getDueCheckinAppointments(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Appointments/GetDueCheckinAppointments', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getActiveMrTemplateGroup(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateGroup/GetActiveTemplateGroup')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getActivePhysicianUsers(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Users/GetActivePhysicianUsers', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getPhysicianbyUserId(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Physicians/GetPhysicianIDByUserId', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getPhysicianCommonTemplateGroups(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateGroup/GetPhysicianCommonTemplateGroups', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }
  getTemplateBuilderOption(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetOptions', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getTemplateGroupSection(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetSectionsForTemplateGroup', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  GetSectionsForTemplateGroupByEncounter(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetSectionsForTemplateGroupByEncounter', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }



  getEncounterPatient(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetEncountersForPatient', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getEncounterComplete(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetEncounterComplete', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  GetPatientEncounterFullByEncounterIDSummary(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientEncounters/GetPatientEncounterFullByEncounterIDSummary', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }


  getEncounterFormField(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetFormFieldDataAndSectionsForEncounter', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  GetFormFieldDataForEncounter(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetFormFieldDataForEncounter', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  //SmartNote api

  GetSmartNoteCategory(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetSmartNoteCategory')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  GetSmartNoteTemplateByCategoryId(smartnotetemplatecategoryId): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetSmartNoteTemplateByCategoryId', { params: smartnotetemplatecategoryId })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

GetFollowUpVistReason(): Observable<any>{
  return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetFollowUpVisitReasons')
  .pipe(map((response: Response) => response),
  catchError(this.handleError)
  )
}
GetFollowUpVisit(patientId): Observable<any> {
  return this._http.get(this.baseChartUrl + 'FollowupVisit/GetCustomFormattedFollowupVisit', {params: patientId} )
  .pipe(map((response: Response) => response),
  catchError(this.handleError)
  )
}
AddFollowupVisit(param): Observable<any> {
  return this._http.post(this.baseChartUrl + 'FollowupVisit/InsertFollowUpVisit', param)
  .pipe(map((resposnse: Response) => resposnse),
  catchError(this.handleError))
}
EditFolllowupVisit(param): Observable<any> {
  return this._http.put(this.baseChartUrl + 'FollowupVisit/UpdateFollowUpVisit', param)
  .pipe(map((resposnse: Response) => resposnse),
  catchError(this.handleError))
}
DeleteFollowupVisit(param): Observable<any> {
  return this._http.delete(this.baseChartUrl + 'FollowupVisit/DeleteFollowUpVisit', {params: param})
  .pipe(map((resposnse: Response) => resposnse),
  catchError(this.handleError))
}
  //smartNote API end

  //API's For Widget patient-education-resourse

  SearchPatientEducationResources(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/SearchPatientEducationResources', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  GetPreviousPatientEducationResources(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateBuilder/GetPreviousPatientEducationResources', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  //API's For Widget patient-education-resourse

  // API's For Widget select-icd-component.ts
  GetPhysicianCommonIcd9Code(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'PhysicianCommonIcd9Code/GetPhysicianCommonIcd9Code', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  GetFormattedProblemList(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'ProblemLists/GetFormattedProblemList', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }
  //  end of API's For Widget select-icd-component.ts

  // API's for family medical history
  GetFamilyMedicalHistoryFieldOption(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'MrFamilyMedicalHistoryFieldOption/GetAllFamilyMedicalHistoryFieldOption')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }


  getICDcode(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Icd9Code/IsExistingIcdCode', { params: Param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  deleteNote(Param): Observable<any> {
    return this._http.delete(this.baseChartUrl + 'PatientEncounters/InactivateMrPatientEncounter', { params: Param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }
  getCCD(Param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientEncounters/DownloadCCDCCR', { params: Param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }
  saveProgressNote(param): Observable<any> {
    return this._http.post(this.baseChartUrl + 'FormFieldData/SaveFormFieldData', param)
    .pipe(map((resposnse: Response) => resposnse),
    catchError(this.handleError))
  }
  private handleError(error) {
    console.error(error);
    return Observable.throw(error || "ChartService error")
  }
}
