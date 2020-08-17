import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillingSetupService } from '../../../services/billing/billing-setup.service';
import { AuthenticationStore } from '../../../authentication/authentication-store';
import { DomSanitizer } from '@angular/platform-browser';
// import { file } from '../../../../assets/file/demo.html';
@Component({
  selector: 'app-billingportal',
  templateUrl: './billingportal.component.html',
  styleUrls: ['./billingportal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingportalComponent implements OnInit {
  billingPortal: any;
  enableFrame: boolean = false;
  // iframeDoc: any = file;

  constructor(private billingServices: BillingSetupService,public authStore: AuthenticationStore,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.postBillingPortal();
  }
  postBillingPortal(){
    let payload = {
      SwitchUserID: this.authStore.PracticeDetail.GediSiteid,
      UserPass: this.authStore.PracticeDetail.GediSiteidPassword,
    }
    this.billingServices.postBillingPortal().subscribe(res => {
      this.billingPortal = res.result; 
      this.enableFrame = true;
    })
  }
}
