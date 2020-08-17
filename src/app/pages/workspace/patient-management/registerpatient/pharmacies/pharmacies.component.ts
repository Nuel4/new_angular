import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TablePharmacyService } from '../../../../../services/workspace/table-pharmacy.service';
import { ToastrService } from 'ngx-toastr';
import { getViewData } from '@angular/core/src/render3/instructions';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { forkJoin } from "rxjs";
import * as moment from 'moment';

@Component({
  selector: 'app-pharmacies',
  templateUrl: './pharmacies.component.html',
  styleUrls: ['./pharmacies.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PharmaciesComponent implements OnInit {
  patientId;
  public showprtandchrge: boolean;

  @Input()
  set _showprtandchrge(val: any){
    this.showprtandchrge = val;
  }

  get _showprtandchrge(): any {
    return this.showprtandchrge;
  }

  @Input()
  set _patientIdToEdit(val: any){
    this.patientId = val;
  }

  get _patientIdToEdit(): any {
    return this.patientId;
  }

  
  @Output() next = new EventEmitter();
  @Output() crgslip = new EventEmitter()

  showPharmaciesDelete: any[];
  showPharmaciesDeleteData: any[];
  showPharmaciesDeleteDataClone: any[];
  showPatientPharmacy: any = {
    CreatedByuserId: "",
    DateCreated: "",
    DateLastUpdated: "",
    LastUpdatedByUserId: "",
    Order: "",
    PatientId: "",
    PharmacyId: "",
    PharmacyNcpdp: "",
  };
  showPharmaciesView: any[];
  showPharmaciesViewData: any = [];
  pharmaciesZip = "";
  pharmaciesPhone = "";
  pharmaciesStreet = "";
  pharmaciesCity = "";
  pharmaciesStateCode = "";
  pharmaciesName = "mcl";
  tbltotalitems;
  tbltotalpages;
  wildCardSearch: boolean = true;
  msg: string
  UserDetail;
  PatientData;
  display: boolean = false;
  Dialogvalue:any = {};
  addPharmacy: any[] = [];
  constructor(
    private routes: Router,
    private tblp: TablePharmacyService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.UserDetail = JSON.parse(sessionStorage.getItem('UserDetail'));
    this.PatientData = JSON.parse(sessionStorage.getItem('PatientDetail'));
    this.showPharmaciesDelete = [
      { field: 'PharmacyStoreName', header: 'Pharmacy' },
      { field: 'PharmacyAddress1', header: 'Address' },
      { field: 'PharmacyTelephone1', header: 'Phone' },
      { field: 'PharmacyFax', header: 'Fax' },
      { field: 'PharmacyCity', header: 'City' },
    ],
      this.showPharmaciesView = [
        { field: 'PharmacyStoreName', header: 'Pharmacy' },
        { field: 'PharmacyAddress1', header: 'Address' },
        { field: 'PharmacyTelephone1', header: 'Phone' },
        { field: 'PharmacyFax', header: 'Fax' },
        { field: 'PharmacyCity', header: 'City' },
      ]

      
      this.FindPharmacy()
    this.getpatientpharmacy();
  }

  
  openNext() {
    this.next.emit();
  }
  onClose() {
    this.routes.navigate(['/pages/workspace/patientmanagement']);
  }
  FindPharmacy(){
    let Pharmacyparams = {
pharmacyzip: this.pharmaciesZip,
phone: this.pharmaciesPhone,
streetName: this.pharmaciesStreet,
city: this.pharmaciesCity,
stateCode: this.pharmaciesStateCode,
pharmacy: this.pharmaciesName,
IsWildCardSearch: this.wildCardSearch
    }
    console.log("value of params: ",Pharmacyparams)
    this.tblp.getTblPharmacyPagedwithFilters(Pharmacyparams).subscribe(
      resp => {
this.showPharmaciesViewData = resp
console.log("value of temp is :",this.showPharmaciesViewData);
console.log("value of showpharmaciesviewdta is :",this.showPharmaciesViewData)
      });
    // this.getPharmacydetails(Pharmacyparams);
  }

  // getPharmacydetails(Pharmacyparams){

  
  // }
  adddetails(rowData){
    let temp = rowData;
    let addPharm;
    console.log("value of add event",temp);
    // if(this.showPharmaciesDeleteData != null){
    //   this.showPharmaciesDeleteData.pop();
    // }
//     this.showPharmaciesDeleteData.forEach((item)=>{
//       if(rowData.PharmacyId === item.PharmacyId){
// this.showerror("Pharmacy Already Exist")
// return;
//       }else{
//         this.showPharmaciesDeleteData.push(rowData)
//         this.showSuccess("Pharmacy Added successfully")
//       }
//     })

    // this.showPharmaciesDeleteData.push(temp);
    for (let i=0;i<this.showPharmaciesDeleteData.length;i++){
      if(rowData.PharmacyNcpdp === this.showPharmaciesDeleteData[i].PharmacyNcpdp){
addPharm = true;
break;
      }
      addPharm = false;
    }
    if(addPharm === true){
    this.showerror("Pharmacy Already Exist");
      } else{
                this.showPharmaciesDeleteData.push(rowData);
                this.addPharmacy.push(rowData);
                this.showSuccess("Pharmacy Added successfully");
              }
    this.showPatientPharmacy.PharmacyId = temp.PharmacyId
    this.showPatientPharmacy.NewcropPharmacyNcpdp = temp.PharmacyNcpdp
    console.log("value of pharmacy table is :",this.showPharmaciesDeleteData);
    console.log("value of post data is:",this.showPatientPharmacy)
  }
  viewdetails(rowData){
    console.log("value of view event",rowData);
  }


  deletedetails(rowData){
    console.log("value of row data",rowData);
    for(let i=0;i<this.showPharmaciesDeleteDataClone.length;i++){
      if(rowData.PharmacyNcpdp === this.showPharmaciesDeleteDataClone[i].PharmacyNcpdp){
let temp = {
  PatientPreferredPharmacyId: rowData.PatientPreferredPharmacyId,
  // PatientId: rowData.PatientId,
  // PharmacyId: rowData.PharmacyID,
  // NewcropPharmacyNcpdp: rowData.PharmacyNCPDP,
  // Order: rowData.Order,
  // DateCreated: moment(new Date()).format("DD/MM/YYYY"),
  // CreatedByUserId: rowData.CreatedByuserId,
  // DateLastUpdated: moment(new Date()).format("DD/MM/YYYY"),
  // LastUpdatedByUserId: this.UserDetail.UserId
}
console.log("value of temp",temp)
this.tblp.deletePPP(temp).subscribe(resp =>{
  console.log("value of resp");
  this.showPharmaciesDeleteDataClone.splice(i,1);
  for(let j=0;j<this.showPharmaciesDeleteData.length;j++){
    if(rowData.PharmacyNcpdp === this.showPharmaciesDeleteData[j].PharmacyNcpdp){
      this.showPharmaciesDeleteData.splice(i,1)
    }
  }
  this.showSuccess("Pharmacy Data Removed successfully")
})
      } else {
        for(let k=0;k<this.addPharmacy.length;k++){
          if(rowData.PharmacyNcpdp === this.addPharmacy[k].PharmacyNcpdp){
            this.addPharmacy.splice(k,1);
          }
        }
        for(let j=0;j<this.showPharmaciesDeleteData.length;j++){
          if(rowData.PharmacyNcpdp === this.showPharmaciesDeleteData[j].PharmacyNcpdp){
            this.showPharmaciesDeleteData.splice(i,1)
            this.showSuccess("Pharmacy Data Removed successfully")
            break;
          }
        }
    
      }
     
    }
  }


  getpatientpharmacy(){
    let params = {
      patientId: this.patientId
    }
    this.tblp.getCFPatientPreferredPharmacy(params).subscribe(resp =>{
        this.showPharmaciesDeleteData = resp
        this.showPharmaciesDeleteDataClone = resp
      console.log("value of resp", this.showPharmaciesDeleteData);
    })
  }


  onCompleteSave(){
    let temp: any = {};
    let temp1: any[] = [];
    console.log("value of save pharmacy is",this.addPharmacy);
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    this.showPatientPharmacy.LastUpdatedByUserId = this.UserDetail.UserId
    this.showPatientPharmacy.Order = 0
    this.showPatientPharmacy.DateLastUpdated = date
    this.showPatientPharmacy.PatientId = this.patientId
// for(let i=0; i<this.showPharmaciesDeleteData.length;i++){
//   for(let j=0;j<this.showPharmaciesDeleteDataClone.length;j++){
//     if(this.showPharmaciesDeleteData[i].PharmacyNcpdp === this.showPharmaciesDeleteDataClone[j].PharmacyNcpdp){

//     } else {
// temp = {
//    // PatientPreferredPharmacyId: ,
//    PatientId: this.patientId,
//    // PharmacyId: this.showPharmaciesDeleteData[0].PharmacyId,
//    PharmacyId: null,
//    NewcropPharmacyNcpdp: this.showPharmaciesDeleteData[0].PharmacyNcpdp,
//    Order: 1,
//    DateCreated: date,
//    CreatedByUserId: this.UserDetail.UserId,
//    DateLastUpdated: date,
//    LastUpdatedByUserId: this.UserDetail.UserId,
//  };
//  temp1.push(temp);
// }
//     }
//   }
this.addPharmacy.forEach((item) =>{
  temp = {
       // PatientPreferredPharmacyId: ,
       PatientId: this.patientId,
       // PharmacyId: this.showPharmaciesDeleteData[0].PharmacyId,
       PharmacyId: null,
       NewcropPharmacyNcpdp: item.PharmacyNcpdp,
       Order: 1,
       DateCreated: date,
       CreatedByUserId: this.UserDetail.UserId,
       DateLastUpdated: date,
       LastUpdatedByUserId: this.UserDetail.UserId,
     }
     temp1.push(temp)
})
      console.log("value of temp is:",temp1);
      this.tblp.PostpatientpreferredPharmacy(temp1).subscribe( resp => {
        this.msg = "Pharmacy details are saved successfully"
        this.showSuccess(this.msg)
      });
    console.log("value of pharmacy is",this.showPharmaciesDeleteData)
  }
  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
  showerror(msg){
    this.toastr.error(msg);
  }

showDialog(rowData) {
  console.log("value of rowdata is",rowData);
  this.display = true;
  this.Dialogvalue = rowData;
}
chargeSlips(data){
  this.crgslip.emit(data)
 }
}