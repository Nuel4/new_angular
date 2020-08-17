import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ShippingService } from '../../../../services/inventory/shipping/shipping.service';
import { OrderService } from '../../../../services/inventory/order/order.service';

@Component({
  selector: 'app-shipping-label',
  templateUrl: './shipping-label.component.html',
  styleUrls: ['./shipping-label.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShippingLabelComponent implements OnInit {

  itemLists: any = [];
  labelType: any = [];
  heightParam: any = [];
  widthParam: any = [];
  itemHeaders: any[];
  selectedItemsToCreateLabel: any[];
  barCodeText: any;
  noofcolumns: any[] = [];
  remainderColumns: number[] = []
  noOfLables: any;
  rowsofLables: number;
  remainderLables: number;
  barCodeResponse: any = [];
  public data;

  constructor(private service: ShippingService, private orderService: OrderService) {
  }

  ngOnInit() {

    this.labelType = [
      { name: 'Code11', code: 'Code11' },
      { name: 'Code128', code: 'Code128' },
      { name: 'Code128A', code: 'Code128A' },
      { name: 'Code128B', code: 'Code128B' },
      { name: 'Code128C', code: 'Code128C' },
      { name: 'Code39', code: 'Code39' },
      { name: 'Code93', code: 'Code93' },
      { name: 'EAN13', code: 'EAN13' },
      { name: 'EAN8', code: 'EAN8' }
    ];

    this.itemLists = [
      { InvItemMasterName: 'Item 100', ItemCode: 'ITM1', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '28-11-2018' },
      { InvItemMasterName: 'Item 200', ItemCode: 'ITM2', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '26-11-2018' },
      { InvItemMasterName: 'Item 300', ItemCode: 'ITM3', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '22-11-2018' },
      { InvItemMasterName: 'Item 400', ItemCode: 'ITM4', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '12-11-2018' },
      { InvItemMasterName: 'Item 500', ItemCode: 'ITM5', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '09-11-2018' },
      { InvItemMasterName: 'Item 600', ItemCode: 'ITM6', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '07-11-2018' },
      { InvItemMasterName: 'Item 700', ItemCode: 'ITM7', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '02-11-2018' },
      { InvItemMasterName: 'Item 800', ItemCode: 'ITM8', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '27-10-2018' },
      { InvItemMasterName: 'Item 900', ItemCode: 'ITM9', LotNumber: '1234', BatchNumber: '1234', ManufacturedDate: '22-10-2018' },
    ]
    this.itemHeaders = [
      { field: 'InvItemMasterName', header: 'Item Master Name' },
      { field: 'ItemCode', header: 'Item Code' },
      { field: 'LotNumber', header: 'Lot Number' },
      { field: 'BatchNumber', header: 'Batch Number' },
      { field: 'ManufacturedDate', header: 'Manufactured Date' }
    ]

    this.heightParameter()
    this.widthParameter()
  }

  onAddToShip(LabelType, height, width, Lables, columns, data) {
    console.log('LabelType', LabelType)
    console.log('height', height)
    console.log('width', width)
    console.log('Lables', Lables)
    console.log('columns', columns)
    this.noOfLables = Lables;
    this.noofcolumns = [];
    console.log('data', data)
    this.selectedItemsToCreateLabel = data;
    console.log('selected', this.selectedItemsToCreateLabel);
    this.barCodeResponse = [];

    for (let i = 0; i < this.selectedItemsToCreateLabel.length; i++) {
      const dateMan = this.selectedItemsToCreateLabel[i].ManufacturedDate.split('-')
      this.barCodeText = this.selectedItemsToCreateLabel[i].ItemCode + this.selectedItemsToCreateLabel[i].LotNumber
        + this.selectedItemsToCreateLabel[i].BatchNumber + dateMan[1] + dateMan[2];
      this.service.getLabelLinkForSelectedItems(this.barCodeText, height, width).subscribe(resp => {
        console.log('res', resp);
        this.barCodeResponse.push(resp.BarCodeBase64String);
        console.log('respBar', this.barCodeResponse)
        if (this.barCodeResponse.length === this.selectedItemsToCreateLabel.length) {
          this.barCodePrint();
          console.log('itemlength', this.selectedItemsToCreateLabel.length)
          console.log('responselength', this.barCodeResponse.length)
        }
      })
    }
  }

  barCodePrint() {
    console.log('barcodeResponse', this.barCodeResponse)
    for (let i = 0; i < this.barCodeResponse.length; i++) {
      for (let j = 0; j < this.noOfLables; j++) {
        this.noofcolumns.push(this.barCodeResponse[i]);
      }
    }
    console.log('finalBarCode', this.noofcolumns)
  }


  heightParameter() {
    for (let i = 25; i <= 600; i = i + 25) {
      this.heightParam.push(i);
    }
    console.log('height', this.heightParam)
  }
  widthParameter() {
    for (let i = 25; i <= 1200; i = i + 25) {
      this.widthParam.push(i);
    }
    console.log('width', this.widthParam)
  }
}
