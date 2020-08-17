import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { UserProfileService } from '../../../services/userprofile/userprofile.service'
import { AuthenticationStore } from '../../../authentication/authentication-store'
@Component({
  selector: 'app-cpt-disclaimer',
  templateUrl: './cpt-disclaimer.component.html',
  styleUrls: ['./cpt-disclaimer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CptDisclaimerComponent implements OnInit {
  constructor(private cptDisclaimerModal: NgbActiveModal, private router: Router, private AuthStore: AuthenticationStore, private userProfileService: UserProfileService) { }
  @Input() cptDisclaimer;
  @Input() newUser;
  @Input() password;
  @Input() appUserId;
  @Input() about;
  appUser: any;
  email: any
  userName: any;
  ngOnInit() {
  }
  toLogin() {
    this.cptDisclaimerModal.close('Close click');
    sessionStorage.setItem("token", null);
    sessionStorage.setItem("LoggedIn", null);
    sessionStorage.setItem("UserDetail", null);
    sessionStorage.setItem("TaxonomyItemDetail", null);
    sessionStorage.setItem("PatientDetail", null);
    this.AuthStore.UserDetail = null;
    this.AuthStore.LoggedIn = null;
    this.AuthStore.token = null;
    this.AuthStore.TaxonomyItemDetail = null;
    this.router.navigate(['login'], { skipLocationChange: true });
  }
  onSave() {
    let payload = {
      email: this.email,
      userName: this.userName
    }
    this.userProfileService.updateForgetPassword(payload).subscribe(response => {
      console.log('response', response)
    })
  }
  clickOk(){
    this.cptDisclaimerModal.dismiss('Cross click');
    this.cptDisclaimerModal.close('Close click');
   }
  onAccept() {
    this.userProfileService.GetApplicationUserById(this.appUserId).subscribe(
      (result) => {
        this.appUser = result
        this.appUser.EulaAccepted = true
        this.userProfileService.UpdateAppUserInfo(this.appUser).subscribe(
          (result) => {
            this.cptDisclaimerModal.close('Close click');
          }
        )
      },
      (error) => {
        console.log("error", error)
      }
    )
  }
}
