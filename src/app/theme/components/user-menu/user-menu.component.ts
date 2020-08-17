import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router'

import { GlobalState, Global } from '../../../core';
import { AuthenticationStore } from '../../../authentication';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent implements OnInit {

  logedInUser: string;
  userPhoto: string;
  constructor(private _state: GlobalState,
    private store: AuthenticationStore,
    private router: Router) {

    this._state.subscribe(Global.LoggedIn_User, (user) => {
      this.logedInUser = user.FirstName + ' ' + user.MiddleName + ' ' + user.LastName;
      this.userPhoto = "data:image/JPEG;base64," + user.PhotoImage;
    });

    if (this.store.UserDetail != null) {
      if (this.store.UserDetail.PhotoImage != null)
        this.userPhoto = 'data:image/JPEG;base64,' + this.store.UserDetail.PhotoImage
      if (this.store.UserDetail.FirstName)
        this.logedInUser = this.store.UserDetail.FirstName + ' ' + this.store.UserDetail.MiddleName + ' ' + this.store.UserDetail.LastName;
    }
  }

  ngOnInit() {
  }
  private onSignOut() {
    sessionStorage.setItem("token", null);
    sessionStorage.setItem("LoggedIn", null);
    sessionStorage.setItem("UserDetail", null);
    sessionStorage.setItem("TaxonomyItemDetail", null);
    sessionStorage.setItem("PatientDetail", null);
    this.store.UserDetail = null;
    this.store.LoggedIn = null;
    this.store.token = null;
    this.store.TaxonomyItemDetail = null;
    this.router.navigate(['login'], {skipLocationChange: true});
  }
}
