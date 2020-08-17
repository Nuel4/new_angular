import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../../../app/services/inventory/order/order.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  labOrderAdmin: any;
  enableFrame: boolean = false;
  radioValue: any = 'Test Code Preference';
  constructor(private service: OrderService,private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getAdminOrder()
  }

  getAdminOrder() {
    if(this.radioValue === 'Test Code Preference') {
    this.service.getTestCode().subscribe((res:any)=>{
      this.labOrderAdmin = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      this.enableFrame = true;
    })
  } else {
    this.service.getICD9Code().subscribe((res:any)=>{
      this.labOrderAdmin = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      this.enableFrame = true;
    })
  }
  }

}
