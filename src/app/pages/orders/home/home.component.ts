import { Component, OnInit, ViewEncapsulation, Injectable } from '@angular/core';
import { OrderService } from '../../../services/inventory/order/order.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class HomeComponent implements OnInit {
lab: boolean = true;
immunization: boolean = false;
enableFrame: boolean = false;
labOrderStatus: any;
  constructor(private service: OrderService,private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.getLabOrderStatus();
  }
toggle1(event){
  console.log(event);
  event.collapsed
  this.immunization = event.collapsed;
}
toggle2(event){
  console.log(event);
  event.collapsed
  this.lab = event.collapsed;
}
getLabOrderStatus() {
  this.service.getLabOrderStatus().subscribe((res:any)=>{
    this.labOrderStatus = this.sanitizer.bypassSecurityTrustResourceUrl(res);
    this.enableFrame = true;
  })
}
}
