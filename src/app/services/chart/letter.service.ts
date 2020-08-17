import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../../core/http-wrapper.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { post } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class LetterService {
  baseChartUrl: string = environment.api.chart.base_chartApi_url;
  constructor(private _httpwrapperservice: HttpWrapperService,
    private _http: HttpClient) { }

  getReferalLetters(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'ReferralLetter/GetMrReferralLetterByPatientCustomized', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getPatientEncounterByPatientId(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientEncounters/GetPatientEncounterByPatientId', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getLetterTemplateCategory(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'LetterTemplateCategory/GetLetterTemplateCategories')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getAllSystemUsers(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'Users/GetAllSystemUsers')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getReferringPhysicianByOrganizationId(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'ReferringPhysicians/GetReferringPhysicianByRelatedOrganizationId', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getLetterTemplate(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'LetterTemplate/GetLetterTemplate')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getRelatedOrganization(): Observable<any> {
    return this._http.get(this.baseChartUrl + 'RelatedOrganizations')
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getMrReferalLetterById(param): Observable<any> {
    return this._http.get(this.baseChartUrl + 'ReferralLetter/GetMrReferralletterByID', { params: param })
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  cancelReferralLetter(param): Observable<any> {
    return this._httpwrapperservice.deleteWithBody(this.baseChartUrl + 'ReferralLetter/CancelReferralLetter', param)
      .pipe(map((response: Response) => response),
        catchError(this.handleError)
      )
  }

  getAllPractices():Observable<any> {
    return this._http.get(this.baseChartUrl + 'Practices')
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getPastHistoryForLetter(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'ReferralLetter/GetPastHistoryForLetter',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getLetterActiveCondition(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'LetterTemplate/GetLetterActiveConditions',{params:param})
    .pipe(map((response:Response) => response),
    catchError(this.handleError)
    )
  }

  getPatientExaminationOption():Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientExaminationOption/GetPatientExaminationOption')
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getPatientInvestigationsByEncounter(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientInvestigation/GetPatientInvestigationsByEncounter',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getFacility():Observable<any> {
    return this._http.get(this.baseChartUrl + 'Facilities/GetFacilities')
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getPatients(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'Patients/GetPatients',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getSalutations():Observable<any> {
    return this._http.get(this.baseChartUrl + 'Salutation/GetSalutations')
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getMedicationList(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'Medicationlist/CustomGetMedicationlists',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getFormattedProblemList(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'ProblemLists/GetFormattedProblemList',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getGroupSectionByEncounterId(param):Observable<any> {
     return this._http.get(this.baseChartUrl + 'TemplateSection/GetGroupSectionByEncounterId',{params: param})
     .pipe(map((response: Response) => response),
     catchError(this.handleError)
     )
  }

  getGroupSection(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateSection/GetTemplateGroupSections',{params: param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
 }

  getGroupFieldsByEncounterId(param):Observable<any> {
     return this._http.get(this.baseChartUrl + 'FormField/GetGroupFieldsByEncounterID',{params:param})
     .pipe(map((response: Response) => response),
     catchError(this.handleError)
     )
  }

  getAllPMHSectionByPatientId(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'TemplateSection/GetAllPMHSectionsByPatientID',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getMrFamilyMedicalHistory(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'FamilyMedicalHistory/GetFamilyMedicalhistory',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getMrSocialHistory():Observable<any> {
    return this._http.get(this.baseChartUrl + 'SocialHistory')
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getUOMswithChildTables():Observable<any> { 
    return this._http.get(this.baseChartUrl + 'UnitOfMeasure/GetUOMsWithChildTables')
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getCPTCodesPlanProcedureByEncounterId(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'CptCode/GetCPTCodesPlanProcedureByEncounterID',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getQualificationsIDByUserID(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'Qualification/GetQualificationsIDByUserID',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getCustomFormattedInsuranceByPatientId(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientInsuranceProviders/GetCustomFormattedInsurance',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getLetterPastillnessInjuriesById(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'PastIllnessInjury/GetLetterPastIllnessInjuries',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getLetterProblemList(param):Observable<any> {
     return this._http.get(this.baseChartUrl + 'ProblemLists/GetLetterProblemList',{params:param})
     .pipe(map((response: Response) => response),
     catchError(this.handleError)
     )
  }

  getLetterPlanProcedureById(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'PlanProcedures/GetLetterPlanProcedure',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getAllergiesByPatientId(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientAllergyList/GetAllergiesByPatientId',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getLetterImmunizationsByPatientId(param):Observable<any> {
    return this._http.get(this.baseChartUrl + 'PatientImmunization/GetLetterImmunizations',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getPatientEncounterFullByEncounterID(param):Observable<any> { 
    return this._http.get(this.baseChartUrl + 'PatientEncounters/GetPatientEncounterFullByEncounterId',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  AddReferalLetter(param): Observable<any> {
    return this._http.post(this.baseChartUrl + 'ReferralLetter',param)
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  getDocument(param):Observable<any> { 
    return this._http.get(this.baseChartUrl + 'ReferralLetter/GetMrReferralletterByID',{params:param})
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  updateReferalLetters(param): Observable<any> {
    return this._http.put(this.baseChartUrl + 'ReferralLetter/UpdateReferralLetter',param)
    .pipe(map((response: Response) => response),
    catchError(this.handleError)
    )
  }

  private handleError(error) {
    console.error(error);
    return Observable.throw(error || 'ChartService error');
  }

}
