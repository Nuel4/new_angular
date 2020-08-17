import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrderService } from '../../../../app/services/inventory/order/order.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelviewComponent } from '../../../../app/theme/components/modelview/modelview.component';
import { Router } from '@angular/router';
import { AuthenticationStore } from '../../../authentication/authentication-store'
@Component({
  selector: 'app-neworder',
  templateUrl: './neworder.component.html',
  styleUrls: ['./neworder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NeworderComponent implements OnInit {
  labNewOrderStatus: any;
  enableFrame: boolean = false;
  constructor(private service: OrderService,private sanitizer: DomSanitizer,
    private modalService: NgbModal,private router: Router,public authStore: AuthenticationStore) { }

  ngOnInit() {
    const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.openPopUp = true;
    modalRef.componentInstance.popupData = '';
    modalRef.componentInstance.newOrder.subscribe((value) => {
      if(value){
        this.getNewOrder(value)
      }})
  }

  getNewOrder(value) {
    this.service.getNewOrder(value).subscribe((res:any)=>{
      this.labNewOrderStatus = this.sanitizer.bypassSecurityTrustResourceUrl(res);
      this.enableFrame = true;
    })
  }

}
