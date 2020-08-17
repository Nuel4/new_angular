import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../../../app/services/inventory/order/order.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mainportal',
  templateUrl: './mainportal.component.html',
  styleUrls: ['./mainportal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainportalComponent implements OnInit {
  labMainPortal: any;
  enableFrame: boolean = false;
  constructor(private service: OrderService,private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getMainPortalOrder()
  }

  getMainPortalOrder() {
    this.service.getMainPortalOrder({banner: true}).subscribe((res:any)=>{
      this.labMainPortal = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      this.enableFrame = true;
    })
  }

}
