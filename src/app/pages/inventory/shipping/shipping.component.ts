import { Component, OnInit, ViewEncapsulation, Injectable, ViewChild, ElementRef } from '@angular/core';
import { ShippingService } from '../../../services/inventory/shipping/shipping.service';
import { OrderService } from '../../../services/inventory/order/order.service';
declare var $: any;
@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss'],
    encapsulation: ViewEncapsulation.None
})

@Injectable()
export class ShippingComponent implements OnInit {
    isLoader: boolean = true;
    constructor(private service: ShippingService, private orderService: OrderService) { }

    ngOnInit() {

    }
}