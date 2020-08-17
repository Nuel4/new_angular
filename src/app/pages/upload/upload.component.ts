import { Component, OnInit, ViewEncapsulation, Injectable, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import { ItemService } from '../../services/inventory/items/items.service';
import { UploadService } from '../../services/inventory/upload/upload.service';
declare var $: any;

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})

@Injectable()
export class UploadComponent implements OnInit {
  @ViewChild('myModal') private _poup: ElementRef;
  arrayBuffer: any;
  file: File;
  uploadType = 'item';
  uploadDatas: any = [];
  uploadedFiles: any[] = [];
  storeData: any;
  categoryData: any;
  constructor(private service: UploadService, private itemService: ItemService) { }

  ngOnInit() {

    // this.getInvOrderMastersData();
    this.getInvStoreData();
    this.getCategoryMatsersData();
    // this.getTaxonomyOrderStatus();
    // this.getTaxonomyOrderItemStatus();
  }


  incomingfile(event) {
    // console.log(event)
    this.file = event.target.files[0];
  }

  Upload() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.uploadDatas = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    }
    fileReader.readAsArrayBuffer(this.file);
  }

  getInvStoreData() {
    this.itemService.getInvStores().subscribe(resp => {
      console.log(resp)
      this.storeData = resp
    });
  }

  getCategoryMatsersData() {
    this.itemService.getCategoryMasters().subscribe(resp => {
      console.log(resp)
      this.categoryData = resp
    });
  }
  uploadList(datas) {
    console.log(datas)
    var tmpData = [];
    var tmpItemData = [];
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var userDetails = JSON.parse(sessionStorage.getItem("UserDetail"));
    if (this.uploadType == 'item') {
      for (var i = 0; i < datas.length; i++) {
        let data = {
          InvItemMasterName: datas[i].Name,
          InvCategoryId: +datas[i].Category,
          InvStoreId: +datas[i].Store,
          ItemCode: datas[i].Code,
          Uom: datas[i].UOM,
          CurrentQuantity: 0,
          DefaultOrderQuantity: +datas[i].DefaultOrderQuantity,
          ThresholdQuantity: +datas[i].ThresholdQuantity,
          IsActive: (datas[i].Status == 'true'),
          DateCreated: date,
          CreatedByUserId: userDetails.UserId,
          DateLastUpdated: date,
          LastUpdatedByUserId: userDetails.UserId
        }
        tmpItemData.push(data)
      }
      console.log(tmpItemData)
      this.service.uploadItems(tmpItemData).subscribe(resp => {
        console.log(resp);
        console.log('success');
      })
    } else {
      for (var i = 0; i < datas.length; i++) {
        let data = {
          // ItemName: datas[i].ItemName,
          BatchCode: datas[i].BatchCode,
          BatchNumber: datas[i].BatchNumber,
          BatchQuantity: +datas[i].BatchQuantity,
          Description: datas[i].Description,
          ExpiryDate: datas[i].ExpiryDate,
          ManufacturedDate: datas[i].ManufacturedDate,
          DateCreated: date,
          LotNumber: datas[i].LotNumber,
          CreatedByUserId: userDetails.UserId,
          DateLastUpdated: date,
          LastUpdatedByUserId: userDetails.UserId,
          Agent: datas[i].Agent,
          Comments: datas[i].Comments,
          CurrentQuantity: datas[i].CurrentQuantity,
          InvItemMasterId: datas[i].InvItemMasterId,
          InvStoreId: datas[i].InvStoreId,
          IsActive: datas[i].IsActive,
          ManufacturerName: datas[i].ManufacturerName
        }
        
        tmpData.push(data) 
      }
      console.log(tmpData)
      this.service.uploadBatch(tmpData).subscribe(resp => {
        console.log(resp);
        console.log('success');
      })
    }

  }


}
