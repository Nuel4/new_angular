import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import { ToastrService} from 'ngx-toastr'
import { ProgressnoteService } from '../../../../../services/chart/progressnote.service';
import { ProblemlistService } from '../../../../../services/chart/problemlist.service'
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-icd-searchmodal',
  templateUrl: './icd-searchmodal.component.html',
  styleUrls: ['./icd-searchmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IcdSearchmodalComponent implements OnInit {
@Input() problemList; 
@Input() compname;
@Input() problemName;
@Input() selectedValues;
@Input() selectedProblem: any[];
@Input() selectedSearchType;
@Input() SelectedPhysicianId;
@Output() selectedProb = new EventEmitter<any>();
  constructor(private modal: NgbActiveModal, private toaster: ToastrService, private progressService: ProgressnoteService, private ps: ProblemlistService ) { }
Icdvalue = "ICD10";
searchtype: any[] = [];


  ngOnInit() {
    this.searchtype = [
      {label: 'ICD-9',value: 'ICD9'},
      {label: 'ICD-10',value: 'ICD10'},
    ]
    if(this.selectedProblem.length >= 8){
      this.toaster.error("Cannot add more than 8 icd codes");
    }
    console.log("problem list", this.problemList)
  }

  dropvalues(){
    if(this.selectedValues){
      this.searchtype.push({label: 'ALL',value: 'All'})
    } else {
      this.searchtype.pop();
    }
  }


  searchIcd(){
    if(this.compname === 'template'){
    let param = {
      searchCategory: this.Icdvalue,
      search: this.problemName
    }
    this.progressService.searchDrFirstProblem(param).subscribe(
      res => {
this.problemList = res
console.log('Problem list', this.problemList)
// const modRef = this.modalService.open(IcdSearchmodalComponent, {size:'lg', centered: true})
// modRef.componentInstance.problemList = this.problemList
      }
    )
    } else if(this.compname === 'post'){
      let param;
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
        });
      }else {
        param = {
          searchCategory: this.selectedSearchType.value,
          search: this.problemName
        }
        this.ps.SearchByCodeAndDescription(param).subscribe( res =>{
          console.log("value of response of dr first is",res)
          this.problemList = res
        });}}}

  saveProblem(){
let temp = [this.selectedProblem,this.selectedValues]
this.selectedProb.emit(temp)
this.modal.dismiss();
  }

  movealltarget(event){
    let temp = event.items[0];
    console.log("value of event",event.items[0],"value of target array",this.selectedProblem)
  }

  movedtotarget(event){
    let temp = event.items[0];
    console.log("value of event",event.items[0],"value of target array",this.selectedProblem)
    if((this.selectedProblem.length >8)){
      this.selectedProblem.pop();
     this.problemList.push(temp);
     this.toaster.error("Cannot add more than 8 icd codes");
    }
  }

}
