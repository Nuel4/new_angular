import { AuthenticationStore } from './../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProblemlistService } from '../../../services/chart/problemlist.service'
import { Calendar } from 'fullcalendar';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { EventEmitter } from 'events';
@Component({
  selector: 'app-add-problems',
  templateUrl: './add-problems.component.html',
  styleUrls: ['./add-problems.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProblemsComponent implements OnInit {
  @Output() childEvent = new EventEmitter();
  @Input() PEValueObj: any = [];
  @Input() preferredIcd: boolean;
  group: FormGroup;
  field: FieldConfig;
  categories: any;
  targetCars: any;
  selectedCategory: any;
  Icdvalue: string = 'ICD10'
  existingCode: boolean = false;
  searchCode: any;
  searchDescription: any;
  searchResult: any = [];
  selectedCodes: any[] = [];
  codeDate: Date[] = [];
  patientDetails: any;
  userDetail: any;
  postParam: any[] = []
  addProblem: boolean = true;
  profile: boolean = false;
  physicianIcd9Code: any;
  copySelectedCodes: any;
  copySearchResult: any;
  event: any;
  deleteList: any = [];
  moveTarget: any = [];
  constructor(public problemService: ProblemlistService, public authStore: AuthenticationStore, private modal: NgbActiveModal,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder, ) {
    this.getCategory();
    this.targetCars = [];
    // this.categories = [
    //   { name: 'Blood Disease' },
    //   { name: 'Circulatory System' },
    //   { name: 'Congenital Anomalies' },
    //   { name: 'Digestive System' },
    //   { name: 'Endocrine, Nutritional & Metabolic Disorders' },
    //   { name: 'Genitourinary System' },
    //   { name: 'Infectious & Parasitic Diseases' },
    //   { name: 'Injuries & Adverse Effects' },
    //   { name: 'Mental Disorders' },
    //   { name: 'Musculoskeletal & Connective Tissue' },
    //   { name: 'Neoplasms' },
    //   { name: 'Nervous System & Sense Organ Disorders' },
    //   { name: 'Perinatal (Infant)' },
    //   { name: 'Pregnancy, Childbirth' },
    //   { name: 'Respiratory System' },
    //   { name: 'Signs & Symptoms' },
    //   { name: 'Skin, Substaneous Tissue' },
    //   { name: 'Supplemental Classification' }
    // ];
  }

  ngOnInit() {
    if (this.preferredIcd) {
      this.searchbyCategory()
    }
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
    this.userDetail = JSON.parse(sessionStorage.getItem('UserDetail'))
    if (this.searchResult.length <= 0) {
      this.childEvent.emit({ bool: true })
    } else if (this.selectedCodes.length <= 0) {
      this.childEvent.emit({ bool: true })
    } else {
      this.childEvent.emit(
        {
          bool: false,
          cptCode: this.selectedCodes,
        }
      )
    }
    if (this.PEValueObj) {
      // this.PEValueObj = {}
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }

  }
  // icdChange(){
  //   if(this.ICD9 == false){
  //     this.ICD10 = true
  //   } 
  //   if(this.ICD9 == true){
  //     this.ICD10 = false
  //   }
  // }
  getCategory() {
    this.problemService.GetIcdCategory().subscribe(
      (results: any) => {
        this.categories = results
      }
    )
  }
  searchbyCodeandDesc() {
    let param = {
      searchCategory: this.Icdvalue,
      search: this.searchCode ? this.searchCode : this.searchDescription
    }
    this.problemService.SearchByCodeAndDescription(param).subscribe(results => {
      this.searchResult = results
      if (this.searchResult.length <= 0) {
        this.childEvent.emit({ bool: true })
      } else if (this.selectedCodes.length <= 0) {
        this.childEvent.emit({ bool: true })
      }
      else {
        this.childEvent.emit({
          bool: false,
          cptCode: this.selectedCodes,
        })

      }

    }

    )
  }
  onSearchPhysicianIcd9Code(event) {
    this.event = event;
    let param = {
      physicianId: 0,
      categoryId: this.selectedCategory ? this.selectedCategory.Icd9CategoryId : 0,
      code: this.searchCode ? this.searchCode : '',
      description: this.searchDescription ? this.searchDescription : '',
      codeType: ''
    }
    this.problemService.SearchByCategory(param).subscribe(
      Result => {
        this.copySearchResult = Result;
      }
    )
    this.getPhysicianIcd9Code();
  }
  searchbyCategory() {
    let param = {
      physicianId: this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
      categoryId: this.selectedCategory ? this.selectedCategory.Icd9CategoryId : 0,
      code: this.searchCode ? this.searchCode : '',
      description: this.searchDescription ? this.searchDescription : '',
      codeType: ''
    }
    this.problemService.SearchByCategory(param).subscribe(
      Result => {
        this.selectedCodes = Result;
        this.copySelectedCodes = Result;
      }
    )
    this.getPhysicianIcd9Code();
  }
  searchProblem() {
    if (!(this.searchCode == undefined && this.searchDescription == undefined && this.selectedCategory == undefined)) {
      if (this.searchCode == undefined && this.searchDescription == undefined) {
        this.searchbyCategory();
      } else {

        this.searchbyCodeandDesc();
      }
    }
  }
  movetoTarget(event) {
    let obj = { calendar: true }
    event.items.forEach(
      element => {
        for (let prop in obj) {
          element[prop] = obj[prop]
        }
      }
    )
    if (this.searchResult.length <= 0) {
      this.childEvent.emit({ bool: true });
    } else {
      this.childEvent.emit(
        {
          bool: false,
          cptCode: this.selectedCodes,
        }
      )
    }
  }
  movetoSource(event) {
    let obj = { calendar: false }
    event.items.forEach(
      element => {
        for (let prop in obj) {
          element[prop] = obj[prop]
        }
      }
    )
    if (this.selectedCodes.length <= 0) {
      this.childEvent.emit({ bool: true });
    } else {
      this.childEvent.emit({
        bool: false,
        cptCode: this.selectedCodes,
      })
    }
  }
  fixUTCDate(date) {
    if (date) {
      date.setTime(new Date(new Date(date.getTime() - (date.getTimezoneOffset() * 60 *
        1000)).toUTCString()));
    }
    return date
  }
  saveProblem() {
    let i = 0
    this.selectedCodes.forEach(element => {
      this.postParam[i] = {
        // MrProblemListId: 0,
        PatientId: this.patientDetails.PatientId,
        MrPatientEncounterId: null,
        PhysicianId: 22,
        Status: 'Active',
        IsIcd10: this.Icdvalue == 'ICD10' ? true : false,
        DateDiagnosed: this.fixUTCDate(this.codeDate[i]),
        DateModified: new Date(),
        DateCreated: new Date(),
        CreatedByUserId: this.userDetail.UserId,
        DateLastUpdated: new Date(),
        LastUpdatedByUserId: this.userDetail.UserId,
        // RcopiaProblemId: "string",
        // RcopiaXml: "string",
        Code: element.Code,
        CodeDescription: element.Description,
        Active: true
      }
      this.PEValueObj.push(this.postParam[i]);
      i++;
    })
    this.problemService.AddProblem(this.postParam).subscribe(
      Result => {
        this.showToaster('Problem added successfully!')
        this.selectedCodes = [];
        if (this.route.snapshot.routeConfig.path === 'add-problems') {
          this.router.navigate(['/pages/chart'], { skipLocationChange: true });
        }
      }
    )
  }
  getPhysicianIcd9Code() {
    let payload = {
      physicianId: this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
    }
    this.problemService.getPhysicianIcd9Code(payload).subscribe(res => {
      this.physicianIcd9Code = res;
      if (this.event) {
        this.copySearchResult.forEach(item => {
          this.physicianIcd9Code.forEach(ele => {
            if (ele.Code === item.Code) {
              this.searchResult.push(item)
            }
          })
        })
      }
      // else{
      //   let param = {
      //     physicianId:this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
      //     categoryId: this.selectedCategory ? this.selectedCategory.Icd9CategoryId : 0,
      //     code: this.searchCode ? this.searchCode : '',
      //     description:this.searchDescription ? this.searchDescription :'',
      //     codeType: ''
      //   }
      //   this.problemService.SearchByCategory(param).subscribe(
      //     Result => {
      //       this.copySelectedCodes = Result;
      //       this.copySelectedCodes.forEach(item => {
      //         this.physicianIcd9Code.forEach(ele => {
      //           if(ele.Code === item.Code){
      //             this.selectedCodes.push(item);
      //           }
      //         })
      //       })
      //     }
      //   )
      // }
    })
  }
  movetoTargetPreferredIcd(event) {  
    this.selectedCodes.forEach(item => {
    if(item.Code !== event.items[0].Code){
      this.selectedCodes.push(event.items[0]);
    }
    else{
      this.toaster.warning("Select another CPT code");
  }
})
const distinctArr = Array.from(new Set(this.selectedCodes.map(item => item.Code)))
.map(Code => {
  let objFound = this.selectedCodes.find(item => item.Code === Code)
  return objFound
})
this.selectedCodes = distinctArr;
this.moveTarget.push(event.items[0].Code);
this.copySelectedCodes.forEach(item => {
  this.moveTarget.forEach((ele,id) => {
    if(item.Code === ele){
      this.moveTarget.pop()
    }
    
  })
})
this.searchResult.push(event.items[0]);
  }
  clearData() {
    this.searchCode = " ";
    this.searchDescription = " ";
    this.selectedCategory = "";
    this.searchResult = [];
  }
  deleteIcd9Code(code) {
    let deleteId: any = {}
    this.selectedCodes = this.selectedCodes.filter(item => {
      return item !== code;

    })
    this.physicianIcd9Code.forEach(ele => {
      if (ele.Code === code.Code) {
        deleteId.PhysicianCommonCptCodeId = ele.PhysicianCommonIcd9CodeId
        deleteId.DateCreated = ele.DateCreated,
          deleteId.CreatedByUserId = this.authStore.UserDetail.UserId,
          deleteId.DateLastUpdated = ele.DateLastUpdated,
          deleteId.LastUpdatedByUserId = this.authStore.UserDetail.UserId,
          deleteId.OtherCode = ele.OtherCode,
          deleteId.Code = ele.Code,
          deleteId.Description = ele.Description,
          deleteId.PhysicianId = this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
          this.deleteList.push(deleteId);
      }
    })
  }
  submitIcd9Code() {
    let payload: any = [];
    let addCptCode: any = {};
    this.moveTarget.forEach((item, i) => {
      addCptCode = {
        DateCreated: new Date(),
        CreatedByUserId: this.authStore.UserDetail.UserId,
        DateLastUpdated: new Date(),
        LastUpdatedByUserId: this.authStore.UserDetail.UserId,
        Code: item,
        OtherCode: null,
        Description: item.Description,
        PhysicianId: this.authStore.PhysicianDetail.length > 0 ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
      }
      payload.push(addCptCode)
    })
    if (payload.length > 0) {
      this.problemService.postPhysicianCommonIcd9Code(payload).subscribe(res => {
        this.toaster.success('Successfully Added');
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');

      })
    }
    if (this.deleteList.length > 0) {
      this.problemService.deletePhysicianCommonIcd9Code(this.deleteList).subscribe(res => {
        this.toaster.success('Successfully Updated');
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
      })
    }
  }
  pageCancel() {
    if(!this.preferredIcd){
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
    }
    if(this.preferredIcd){
      this.modal.dismiss('Cross click');
      this.modal.close('Close click');
    }
  }
  showToaster(msg: string) {
    this.toaster.success(msg)
  }
}

