import { filter } from 'rxjs/operators';
import { AuthenticationStore } from './../../../authentication/authentication-store';
import { Component, OnInit, ViewEncapsulation, Output, Input, EventEmitter } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProblemlistService } from '../../../services/chart/problemlist.service'
import { Calendar } from 'fullcalendar';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-cpt-code',
  templateUrl: './select-cpt-code.component.html',
  styleUrls: ['./select-cpt-code.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectCptCodeComponent implements OnInit {
  @Input() ComponentName;
  @Output() childEvent = new EventEmitter();
  @Input() preferredCpt: boolean;
  // @Input() SelectedPhysicianId;
  categories: any;
  targetCars: any;
  selectedCategory: any;
  Icdvalue: string = 'ICD10'
  existingCode: boolean = false;
  searchCode: any;
  searchDescription: any;
  searchResult: any = [];
  selectedCodes: any = [];
  codeDate: Date[] = [];
  patientDetails: any;
  userDetail: any;
  isenableradiobtn: boolean = false;
  isenablecheckbox: boolean = true;
  postParam: any[] = []
  preferredList: any;
  physicianCptCode: any;
  copySelectedCodes: any;
  moveTarget: any = [];
  deleteList: any = [];
  constructor(public problemService: ProblemlistService, public authStore: AuthenticationStore,
    private toaster: ToastrService,
    private router: Router, private route: ActivatedRoute, private modal: NgbActiveModal) {
    this.getCategory();
    this.targetCars = [];

  }

  ngOnInit() {
    if (this.preferredCpt) {
      this.getPreferredCPTCode()
    }
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
    this.userDetail = JSON.parse(sessionStorage.getItem('UserDetail'))
    if (!(this.ComponentName === "PostCharges")) {
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
    }
  }
  getCategory() {
    this.problemService.GetCPTCategory().subscribe(
      (results: any) => {
        this.categories = results
      }
    )
  }


  SearchCptCodesbyDesc() {
    let param = {
      // searchCategory: this.Icdvalue,
      // search: this.searchCode ? this.searchCode : this.searchDescription
      pPhysicianId: 0,
      pCategoryId: this.selectedCategory ? this.selectedCategory.CptCategoryId : 0,
      pCode: this.searchCode ? this.searchCode : 0,
      pDescription: this.searchDescription ? this.searchDescription : 0,
    }
    this.problemService.SearchCPTCodes(param).subscribe(results => {
      this.searchResult = results
      if (!(this.ComponentName === "PostCharges")) {
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
    }

    )
  }
  // searchbyCategory() {
  //   let param = {
  //     // physicianId: 0,
  //     categoryId: this.selectedCategory.Icd9CategoryId,
  //     codeType: this.Icdvalue
  //   }
  //   this.problemService.SearchByCategory(param).subscribe(
  //     Result => {
  //     }
  //   )
  // }
  searchProblem() {
    if (!(this.searchCode == undefined && this.searchDescription == undefined && this.selectedCategory == undefined)) {
      if (this.searchCode == undefined && this.searchDescription == undefined) {
      } else {
      }
    }
    this.SearchCptCodesbyDesc();
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
    if (!(this.ComponentName === "PostCharges")) {
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
    } else if (this.ComponentName === "PostCharges") {
      this.childEvent.emit(this.selectedCodes)
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
    if (!(this.ComponentName === "PostCharges")) {
      if (this.selectedCodes.length <= 0) {
        this.childEvent.emit({ bool: true });
      } else {
        this.childEvent.emit({
          bool: false,
          cptCode: this.selectedCodes,
        })
      }
    } else if (this.ComponentName === "PostCharges") {
      this.childEvent.emit(this.selectedCodes)
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
      i++;
    })
    this.problemService.AddProblem(this.postParam).subscribe(
      Result => {
        this.showToaster('Problem added successfully!')
        // this.selectedCodes = [];
        if (this.route.snapshot.routeConfig.path === 'add-problems') {
          this.router.navigate(['/pages/chart'], { skipLocationChange: true });
        }
      }
    )
  }

  pageCancel() {
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
  }
  showToaster(msg: string) {
    this.toaster.success(msg)
  }
  getPreferredCPTCode() {
    let payload = {
      physicianId: this.authStore.PhysicianDetail.length > 0 ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
    }
    this.problemService.getPrefferedCPTCode(payload).subscribe(res => {
      this.selectedCodes = res;
      this.copySelectedCodes = res;
      this.getphysicianCptCode()
    })
  }
  getphysicianCptCode() {
    this.problemService.getPhysicianCPTCode().subscribe(result => {
      this.physicianCptCode = result;
    })
  }
  movetoTargetPreferredCpt(event) {
      this.selectedCodes.forEach(item => {
        if(item.CptCode1 !== event.items[0].CptCode1){
          this.selectedCodes.push(event.items[0]);
        }
        else{
          this.toaster.warning("Select another CPT code");
      }
    })
    const distinctArr = Array.from(new Set(this.selectedCodes.map(item => item.CptCode1)))
    .map(CptCode1 => {
      let objFound = this.selectedCodes.find(item => item.CptCode1 === CptCode1)
      return objFound
    })
    this.selectedCodes = distinctArr;
    this.moveTarget.push(event.items[0].CptCode1);
    this.copySelectedCodes.forEach(item => {
      this.moveTarget.forEach((ele,id) => {
        if(item.CptCode1 === ele){
          this.moveTarget.pop()
        }
        
      })
    })
    this.searchResult.push(event.items[0]);
    
  }
  deleteCPTCode(code) {
    let deleteId: any = {}

    this.selectedCodes = this.selectedCodes.filter(item => {
      return item !== code;

    })
    this.physicianCptCode.forEach(ele => {
      if (ele.CptCode === code.CptCode1) {
        deleteId.PhysicianCommonCptCodeId = ele.PhysicianCommonCptCodeId
        deleteId.DateCreated = new Date(),
          deleteId.CreatedByUserId = this.authStore.UserDetail.UserId,
          deleteId.DateLastUpdated = new Date(),
          deleteId.LastUpdatedByUserId = this.authStore.UserDetail.UserId,
          deleteId.CptCode = code.CptCode1,
          deleteId.PhysicianId = this.authStore.PhysicianDetail.length ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
          this.deleteList.push(deleteId);
      }
    })
  }
  submitCptCode() {
    let newCode: any = String;
    let payload: any = [];
    let addCptCode: any = {};
    this.moveTarget.forEach((item, i) => {
      newCode = item;
      addCptCode = {
        DateCreated: new Date(),
        CreatedByUserId: this.authStore.UserDetail.UserId,
        DateLastUpdated: new Date(),
        LastUpdatedByUserId: this.authStore.UserDetail.UserId,
        CptCode: item,
        PhysicianId: this.authStore.PhysicianDetail.length > 0 ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
      }
      payload.push(addCptCode)
    })
    if (this.moveTarget.length > 0) {
      this.problemService.addPhysicianCptCode(payload).subscribe(res => {
      })
    }
    if (this.deleteList.length > 0) {
      this.problemService.deletePhysicianCptCode(this.deleteList).subscribe(res => {
        this.toaster.success('Successfully Updated');
        this.modal.dismiss('Cross click');
        this.modal.close('Close click');
      })
    }
  }

}