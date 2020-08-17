import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap'
import {PatientActionService} from '../../../services/chart/patient-action.service'
import {ImmunzScheService} from '../../../services/chart/immunzsche.service'
@Component({
  selector: 'app-scan-modal',
  templateUrl: './scan-modal.component.html',
  styleUrls: ['./scan-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScanModalComponent implements OnInit {
category: any;
selectedCategory: any;
userRoles: any;
selectedUserRoles: any;
users: any;
selectedUsers: any;
@Output() upload: EventEmitter<any> = new EventEmitter()
  constructor(private activeModal: NgbActiveModal, private patientService: PatientActionService, private immunzscheService: ImmunzScheService) { }

  ngOnInit() {
    this.getCategory();
    this.getUserList();
  }
getCategory(){
  this.patientService.getDmsCategory().subscribe(result => {
    console.log("DMS",result);
    this.category = result
  })
}
getUserList(){
  console.log("userLIst");
  this.immunzscheService.GetPhysicianUserList().subscribe(result => {
    console.log("users",result);
    this.users = result.Result
  })
}
saveScan(){
  this.upload.emit(true)
}
}
