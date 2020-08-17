import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { ProgressnoteService } from '../../../../services/chart/progressnote.service';
import { forkJoin } from "rxjs";
import { AuthenticationStore } from './../../../../authentication/authentication-store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { IcdSearchmodalComponent } from './icd-searchmodal/icd-searchmodal.component';
import { SktchPadComponent } from '../../sktch-pad/sktch-pad.component';
import { SSL_OP_ALL } from 'constants';
import {OrderListModule} from 'primeng/orderlist';
import { ToastrService } from 'ngx-toastr';
import { ProblemlistService } from '../../../../services/chart/problemlist.service'


@Component({
  selector: 'app-select-icd',
  templateUrl: './select-icd.component.html',
  styleUrls: ['./select-icd.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectIcdComponent implements OnInit {
  // post, template
  @Input() compFrom;
  @Input() SelectedPhysicianId;
  @Output() childEvent = new EventEmitter();
  @Output() DXexmitter = new EventEmitter();
  @Output() buttons = new EventEmitter();
  selectedValues: boolean = false;
  icdcodelist: any = [];
  dxcodelist: any[] = [];
  ICD: any = [];
  commonIcdCode: any[] = [];
  historicalDC: any[] = [];
  selected: any[];
  CDC: any = {};
  HDC: any = {};
  problemName: any;
  problemList: any;
  searchtype:any[] = [];
  selectedSearchType = {label: 'ICD-9 code', value: 'ICD9'};
  
  constructor(
    private progressService: ProgressnoteService,
    private authStore: AuthenticationStore,
    private modalService: NgbModal,
    private toaster: ToastrService,
    private ps: ProblemlistService
  ) {
  }

  ngOnInit() {
   this.searchtype = [
      {label: 'ICD-9',value: 'ICD9'},
      {label: 'ICD-10',value: 'ICD10'},
    ]
    if(this.compFrom === 'template'){
      this.loadCommonDiagnosisCode();
    this.loadHistoricalCode();
  }
    if (this.icdcodelist.length <= 0) {
      this.childEvent.emit({ bool: true })
    }
    else {
      if (this.icdcodelist.length <= 8) {
        this.childEvent.emit({
          bool: false,
          selectedICD: this.selected,
        })
      }
      else {

        this.icdcodelist.slice(this.icdcodelist.length - 1, 1)
        this.toaster.warning('Can Not Add more than 8 ICD Codes.')
      }
    }
  }

  dropvalues(){
    if(this.selectedValues){
      this.searchtype.push({label: 'ALL',value: 'All'})
    } else {
      this.searchtype.pop();
    }
  }

  loadCommonDiagnosisCode() {
    let param = {
      patientId: this.authStore.PatientDetail.PatientId,
      encounterId: ''
    }
    this.progressService.GetFormattedProblemList(param).subscribe(resp => {
      console.log(resp)
      this.commonIcdCode = resp
    })

  }

  loadHistoricalCode() {
    let param = {
      physicianId: 22
    }
    this.progressService.GetPhysicianCommonIcd9Code(param).subscribe(resp => {
      console.log(resp)
      this.historicalDC = resp
    })
  }

  searchIcd() {
    if(this.compFrom === 'template'){
    let param = {
      searchCategory: "ICD10",
      search: this.problemName
    }
    this.progressService.searchDrFirstProblem(param).subscribe(
      res => {
        this.problemList = res
        console.log('Problem list', this.problemList)
        const modRef = this.modalService.open(IcdSearchmodalComponent, {centered: true , windowClass: 'icdModal'})
        modRef.componentInstance.problemList = this.problemList
        modRef.componentInstance.problemName = this.problemName
        modRef.componentInstance.selectedValues = this.selectedValues
        modRef.componentInstance.compname = this.compFrom
        modRef.componentInstance.selectedProblems.subscribe(
          (value) => {
            console.log("selected problem", value)
            this.selectedValues = value[1]
            let obj = { listName: 'PL' }
            value[0].forEach(
              element => {
                for (let prop in obj) {
                  element[prop] = obj[prop]
                  console.log('PL added', element)
                  this.icdcodelist.push(element)
                }
              }
            )

          }
        )
      }
    )
  } else if(this.compFrom === 'post'){
    let temp;
    let param;
    let icd9value;
    if(this.selectedValues){
    param = {
      physicianId: this.SelectedPhysicianId,
      categoryId: 0,
      // code: 0,
      description: this.problemName,
      codeType: this.selectedSearchType.value
    }
    this.ps.SearchByCategory(param).subscribe(res =>{
      this.problemList = res
      console.log("value of problem list",this.problemList)

      // const modRef = this.modalService.open(IcdSearchmodalComponent, {centered: true , windowClass: 'icdModal'})
      // modRef.componentInstance.problemList = this.problemList
      // modRef.componentInstance.problemName = this.problemName
      // modRef.componentInstance.compname = this.compFrom
      // modRef.componentInstance.selectedValues = this.selectedValues
      // modRef.componentInstance.selectedSearchType = this.selectedSearchType
      // modRef.componentInstance.selectedProblem = this.dxcodelist;
      // modRef.componentInstance.SelectedPhysicianId = this.SelectedPhysicianId
      // modRef.componentInstance.selectedProb.subscribe( res=>{
      //   console.log("value of resp",res)
      //   this.dxcodelist = res[0]
      //   this.selectedValues = res[1]
      //   this.addinglabels()
      //   // this.DXexmitter.emit(this.dxcodelist)
      // });


      // this.dxcodelist.forEach((item)=>{
      //   param = {
      //         Icdcode: item.Code,
      //         IcdDescritpion: item.Description
      //       }
      //       this.progressService.getICDcode(param).subscribe(res=>{
      //         console.log("value of resp",res)
      //         icd9value.push(res)
      //       })
      // })
    })
} else {
  param = {
    searchCategory: this.selectedSearchType.value,
    search: this.problemName
  }
  this.ps.SearchByCodeAndDescription(param).subscribe( res =>{
    this.problemList = res;
    this.problemList.forEach((item,i)=>{
      item.indval = i
    })
    console.log("value of result for drfirst problem",this.problemList);
  // const modRef = this.modalService.open(IcdSearchmodalComponent, {centered: true , windowClass: 'icdModal'})
  // modRef.componentInstance.problemList = this.problemList
  // modRef.componentInstance.problemName = this.problemName
  // modRef.componentInstance.compname = this.compFrom
  // modRef.componentInstance.selectedValues = this.selectedValues
  // modRef.componentInstance.selectedProblem = this.dxcodelist;
  // modRef.componentInstance.SelectedPhysicianId = this.SelectedPhysicianId
  // modRef.componentInstance.selectedSearchType = this.selectedSearchType
  // modRef.componentInstance.selectedProb.subscribe( res=>{
  //   console.log("value of resp",res)
  //   this.dxcodelist = res[0]
  //   this.selectedValues = res[1]
  //   this.addinglabels()
  //   // this.DXexmitter.emit(this.dxcodelist)
  // });


  // this.dxcodelist.forEach((item)=>{
  //   param = {
  //         Icdcode: item.Code,
  //         IcdDescritpion: item.Description
  //       }
  //       this.progressService.getICDcode(param).subscribe(res=>{
  //         console.log("value of resp",res)
  //         icd9value.push(res)
  //       })
  // })
});
}
  }
  }

  selectedHDC(list, index) {
    console.log("SelectedHDC", list, "index", index)
    let obj = { listName: 'HDC' }
    // list.forEach(
    //   element => {
    //     for(let prop in obj){
    //       element[prop] = obj[prop]
    //       console.log('HDC added', element)
    //     }
    //   }
    // )
    for (let prop in obj) {
      list[prop] = obj[prop]
      console.log('HDC added', list)

    }
    this.icdcodelist.push(list)
    this.historicalDC.splice(index, 1)

    if (this.icdcodelist.length <= 0) {
      this.childEvent.emit({ bool: true })
    }
    else {
      if (this.icdcodelist.length <= 8) {
        this.childEvent.emit({
          bool: false,
          selectedICD: this.selected,
        })
      }
      else {
        this.icdcodelist.slice(this.icdcodelist.length - 1, 1)
        this.toaster.warning('Can Not Add more than 8 ICD Codes.')
      }
    }

  }
  selectedCDC(list, index) {
    console.log("SelectedCDC", list, "index", index)
    let obj = { listName: 'CDC' }
    for (let prop in obj) {
      list[prop] = obj[prop]
      console.log('CDC added', list)
    }
    this.icdcodelist.push(list)
    this.commonIcdCode.splice(index, 1)

    if (this.selected.length <= 0) {
      this.childEvent.emit({ bool: true })
    }
    else {
      if (this.icdcodelist.length <= 8) {
        this.childEvent.emit({
          bool: false,
          selectedICD: this.selected,
        })
      }
      else {
        this.icdcodelist.slice(this.icdcodelist.length - 1, 1)
        this.toaster.warning('Can Not Add more than 8 ICD Codes.')
      }
    }


  }
  removeCode(list, index) {
    console.log("value of list", list, "index", index);
    switch (list.listName) {
      case "CDC": {
        this.commonIcdCode.push(list);
        this.icdcodelist.splice(index, 1)
        break;
      }
      case "HDC": {
        this.historicalDC.push(list);
        this.icdcodelist.splice(index, 1)
        break;
      }
      case "PL": {
        this.icdcodelist.splice(index, 1)
        break;
      }
    }
  }

  ReorderLabel(event){
    console.log("after reorder event value",event,"array value",this.dxcodelist)
    this.addinglabels()
    this.DXexmitter.emit(this.dxcodelist);
  }

  SelectedSearch(){
  }
  addinglabels(){
    this.dxcodelist.forEach((item,i)=>{
      switch(i){
        case 0: item.label = "A - "
        break;
        case 1: item.label = "B - "
        break;
        case 2: item.label = "C - "
        break;
        case 3: item.label = "D - "
        break;
        case 4: item.label = "E - "
        break;
        case 5: item.label = "F - "
        break;
        case 6: item.label = "G - "
        break;
        case 7: item.label = "H - "
        break;
        case 8: item.label = "I - "
        break;
        case 9: item.label = "J - "
        break;
        case 10: item.label = "K - "
        break;
        case 11: item.label = "L - "
      }
    })
    
  }

  movedtotarget(event){
    let temp = event.items[0];
    if((this.dxcodelist.length >8)){
      this.dxcodelist.pop();
     this.problemList.push(temp);
     this.toaster.error("Cannot add more than 8 icd codes");
    } else {
      this.addinglabels();
    }
    this.DXexmitter.emit(this.dxcodelist);
  }

  MovetoSource(event){
let temp = event.items[0];
this.problemList.forEach((item)=>{
  if(item.label === temp.label){
    item.label = '';
  }
})
this.problemList.sort((a, b) => a.indval - b.indval);
console.log("value of event is",event,temp,this.problemList);
this.DXexmitter.emit(this.dxcodelist);
  }
  emitbuttons(value){
    this.buttons.emit(value);
  }
  remove(value){
    console.log("value of row is",value);
    this.dxcodelist.forEach((item,i)=>{
if(item.label === value.label){
  this.dxcodelist.splice(i,1)
}
    })
    this.addinglabels();
  }
}
