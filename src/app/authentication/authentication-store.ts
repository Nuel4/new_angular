import { Injectable, Input } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationStore {

  public token: string;
  public LoggedIn: boolean = false;
  public UserDetail: any;
  public PhysicianDetail: any
  public PracticeDetail: any;
  public PatientDetail: any = {};
  public TaxonomyItemDetail: any;
  public ApplicationUserDetail :any;
  public isViewChart: boolean = false;
  public patientAccount: any;
  public SearchedPatientList : any;
  public AuthenticateAsync : any;
  constructor() {
    if (sessionStorage.getItem("token")) {
      this.token = sessionStorage.getItem("token");
    }
    if(sessionStorage.getItem('AuthenticateAsync')){
      this.AuthenticateAsync = sessionStorage.getItem("AuthenticateAsync");
    }
    if (sessionStorage.getItem("LoggedIn") == "true") {
      this.LoggedIn = true;
    }
    if (sessionStorage.getItem("UserDetail")) {
      this.UserDetail = JSON.parse(sessionStorage.getItem("UserDetail"));
    }
    if (sessionStorage.getItem("PracticeDetail")) {
      this.PracticeDetail = JSON.parse(sessionStorage.getItem("PracticeDetail"));
    }
    if (sessionStorage.getItem("PracticeDetail")) {
      this.TaxonomyItemDetail = JSON.parse(sessionStorage.getItem("TaxonomyItemDetail"));
    }
    if (sessionStorage.getItem("PatientDetail")) {
      this.PatientDetail = sessionStorage.getItem("PatientDetail") && JSON.parse(sessionStorage.getItem("PatientDetail"));
    }
    if (sessionStorage.getItem("PhysicianDetail")) {
      this.PhysicianDetail = JSON.parse(sessionStorage.getItem("PhysicianDetail"));
    }
    if (sessionStorage.getItem("ApplicationUserDetail")) {
      this.ApplicationUserDetail = JSON.parse(sessionStorage.getItem("ApplicationUserDetail"));
    }
    if(sessionStorage.getItem('SearchedPatientList')){
      this.SearchedPatientList = JSON.parse(sessionStorage.getItem('SearchedPatientList'));
    }
    
  }

  ReloadPatientData() {
    if (sessionStorage.getItem("PatientDetail")) {
      this.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
    }
  }

}

