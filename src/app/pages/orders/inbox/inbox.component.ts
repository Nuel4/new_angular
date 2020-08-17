import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../../../app/services/inventory/order/order.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InboxComponent implements OnInit {

  labOrderInbox: any;
  enableFrame: boolean = false;
  constructor(private service: OrderService,private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getOrderInbox();
  }

  getOrderInbox() {
    this.service.getOrderInbox().subscribe((res:any)=>{
      this.labOrderInbox = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      this.enableFrame = true;
    })
  }

}
