import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../../../app/services/inventory/order/order.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {

  labOrderSearches: any;
  enableFrame: boolean = false;
  constructor(private service: OrderService,private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getOrderSearches();
  }

  getOrderSearches() {
    this.service.getOrderSearches().subscribe((res:any)=>{
      this.labOrderSearches = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      this.enableFrame = true;
    })
  }

}
