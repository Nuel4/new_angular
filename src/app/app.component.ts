/// <reference types="dwt" />
/// <reference types="dwt/addon.pdf" />
import { Component, ViewEncapsulation, OnInit , HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { ConnectionService } from 'ng-connection-service';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {InternetStatusModalComponent} from './internet-status-modal/internet-status-modal.component'
import { AuthenticationStore } from './authentication/authentication-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  // @HostListener('window:beforeunload') goToPage() {
  //   sessionStorage.setItem("token", null);
  //   sessionStorage.setItem("LoggedIn", null);
  //   sessionStorage.setItem("UserDetail", null);
  //   sessionStorage.setItem("TaxonomyItemDetail", null);
  //   sessionStorage.setItem("PatientDetail", null);
  //   sessionStorage.setItem("PhysicianDetail", null);
  //   sessionStorage.setItem("PracticeDetail", null);
  //   this.store.UserDetail = null;
  //   this.store.LoggedIn = null;
  //   this.store.token = null;
  //   this.store.TaxonomyItemDetail = null;
  //   this.router.navigate(['']);
  // }
  public settings: Settings;
  status = 'ONLINE';
  isConnected = true;
  display: boolean = false;
  show: boolean = false;
  modalRef: any;
  constructor(public appSettings: AppSettings, private router: Router, 
    private connectionService: ConnectionService, private modal: NgbModal, private store : AuthenticationStore,
    ) {
    this.settings = this.appSettings.settings;
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.modalRef.dismiss()
        // this.modalRef.componentInstance.close = true;
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      }
      else {
        this.status = "OFFLINE";
       this.modalRef =  this.modal.open(InternetStatusModalComponent, { centered: true, size: 'sm', windowClass: 'connection-class' })
        this.display = true
      }
    })
    // this.translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    // this.translate.use('en');
    // window.onpopstate = function () {
    //   history.pushState(null, null, router.routerState.snapshot.url);
    // };
  }
ngOnInit(){
  Dynamsoft.WebTwainEnv.AutoLoad = false;
  // alert()
//   this.router.routeReuseStrategy.shouldReuseRoute = function(){
//     return false;
// } 
    // this.router.navigate(['']);
    // sessionStorage.setItem("token", null);
    // sessionStorage.setItem("LoggedIn", null);
    // sessionStorage.setItem("UserDetail", null);
    // sessionStorage.setItem("TaxonomyItemDetail", null);
    // sessionStorage.setItem("PatientDetail", null);
    // sessionStorage.setItem("PhysicianDetail", null);
    // sessionStorage.setItem("PracticeDetail", null);
    // this.store.UserDetail = null;
    // this.store.LoggedIn = null;
    // this.store.token = null;
    // this.store.TaxonomyItemDetail = null;
    // this.router.navigate(['login']);
}
  hideAlert() {
    this.display = false
  }

  /* These following methods used for theme preview, you can remove this methods */

  // ngOnInit() { 
  //     var demo = this.getParameterByName('demo');
  //     this.setLayout(demo);
  // }

  // private getParameterByName(name) {
  //     var url = window.location.href;
  //     name = name.replace(/[\[\]]/g, "\\$&");
  //     var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  //         results = regex.exec(url);
  //     if (!results) return null;
  //     if (!results[2]) return '';
  //     return decodeURIComponent(results[2].replace(/\+/g, " "));
  // }

  // private setLayout(demo){
  //      switch (demo) {
  //         case "vertical-default":
  //             this.settings.theme.menu = 'vertical';
  //             this.settings.theme.menuType = 'default';
  //             break;
  //         case "vertical-compact":
  //             this.settings.theme.menu = 'vertical';
  //             this.settings.theme.menuType = 'compact';
  //             break;
  //         case "vertical-mini":
  //             this.settings.theme.menu = 'vertical';
  //             this.settings.theme.menuType = 'mini';
  //             break;
  //         case "horizontal-default":
  //             this.settings.theme.menu = 'horizontal';
  //             this.settings.theme.menuType = 'default';
  //             break;
  //         case "horizontal-compact":
  //             this.settings.theme.menu = 'horizontal';
  //             this.settings.theme.menuType = 'compact';
  //             break;
  //         case "horizontal-mini":
  //             this.settings.theme.menu = 'horizontal';
  //             this.settings.theme.menuType = 'mini';
  //             break;
  //         default:
  //             this.settings.theme.menu = 'vertical';
  //             this.settings.theme.menuType = 'default';
  //     }
  //     this.router.navigate(['/']);
  // }

}
