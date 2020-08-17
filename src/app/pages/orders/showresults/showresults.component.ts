import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { LabOrderService } from '../../../services/orders/lab-order.service';
import { AuthenticationStore } from '../../../authentication/authentication-store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment';
import { ViewLabOrderModalComponent } from './view-lab-order-modal/view-lab-order-modal.component';
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-showresults',
    templateUrl: './showresults.component.html',
    styleUrls: ['./showresults.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShowresultsComponent implements OnInit {
    @Output() patientDetails: EventEmitter<any> = new EventEmitter();
    cols: any[];
    labOrder: any = {};
    column: any = [];
    labOrderItems: any = [];
    orderItem: any;
    MrLabOrderItemsDetails: any;
    Storedpatient: any;
    labOrderDocument: any = {};
    laboratoryOrder: any;
    labOrderReport: any = [];
    itemResultName: any;
    testResult: any;
    testResultValueText: any;
    unitOfMeasure: any;
    range: any;
    fileUrl: any;
    constructor(private orderService: LabOrderService, public authStore: AuthenticationStore, private modalService: NgbModal, private modal: NgbActiveModal, private toaster: ToastrService,private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.cols = [
            { field: 'OrderDate', header: 'Date' },
            { field: 'PatientName', header: 'Patient Name' },
            { field: 'LabOrderItemName', header: 'Test Name' },
            { field: 'LabOrderItemStatus', header: 'Status' },
        ];
        this.column = [
            { field: 'ItemResultName', header: 'Description' },
            { field: 'Comments', header: 'Comments' }
        ]
        this.getCustomOrder(0);
    }
    getCustomOrder(pgno) {
        let payload = {
            phyId:  this.authStore.PhysicianDetail.length > 0 ? this.authStore.PhysicianDetail[0].PhysicianId : this.authStore.PhysicianDetail.PhysicianId,
            offset: pgno,
            limit: 5
        }
        this.orderService.getCustomOrders(payload).subscribe(res => {
            this.labOrder = res;
            this.labOrder.Results.forEach(item => {
                item.OrderDate = moment(item.OrderDate).format('DD-MM-YYYY')
            })
        })
    }
    getLabOrderItemResults(rowData) {
        this.orderItem = rowData
        let payload = {
            LabOrderItemID: rowData.OrderItemID
        }
        this.orderService.getLabOrderItemResults(payload).subscribe(res => {
            this.labOrderItems = [res];
            this.MrLabOrderItemsDetails = res;
        })
    }
    viewLabOrder(rowData) {
        const modRef = this.modalService.open(ViewLabOrderModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
        modRef.componentInstance.viewModal = true;
        modRef.componentInstance.rowData = rowData;
        modRef.componentInstance.labOrderItem = this.orderItem;
        modRef.componentInstance.mrLabOrderDetails = this.MrLabOrderItemsDetails;
        modRef.componentInstance.customOrder = this.labOrder.Results;
        modRef.componentInstance.loadEvent.subscribe((value) => {
            if (value) {
                this.getLabOrderItemResults(this.orderItem)
            }
        })
    }
    onClickElectronic(rowData) {
        const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
        modalRef.componentInstance.name = 'true';
        modalRef.componentInstance.openPopUp = true;
        modalRef.componentInstance.patientData = rowData ? rowData : '';
    }
    onClickMatched(rowData) {
        const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
        modalRef.componentInstance.name = 'true';
        modalRef.componentInstance.openPopUp = true;
        modalRef.componentInstance.patientData = rowData ? rowData : '';
    }
    selectedPage(event) {
        let currentpage = event.first / event.rows;
        this.getCustomOrder(currentpage)
    }

    embdeonReport(rowData) {
        let payload = {
            laborderdocumentId: rowData.EmdeonReportId
        }
        this.orderService.getLabOrderDocumnet(payload).subscribe(res => {
            this.labOrderDocument = res;
            // let contentType = 'application/html';
            // var sliceSize = 512;
            // var byteCharacters = window.atob(this.labOrderDocument.DocumentData); //method which converts base64 to binary
            // var byteArrays = [];
            // for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            //     var slice = byteCharacters.slice(offset, offset + sliceSize);
            //     var byteNumbers = new Array(slice.length);
            //     for (var i = 0; i < slice.length; i++) {
            //         byteNumbers[i] = slice.charCodeAt(i);
            //     }
            //     var byteArray = new Uint8Array(byteNumbers);
            //     byteArrays.push(byteArray);
            // }
            // var blob = new Blob(byteArrays, {
            //     type: contentType
            // });
            // var blobURL = URL.createObjectURL(blob);
            // window.open(blobURL);
            var a = document.createElement("a");
            document.body.appendChild(a);
            // a.style = "display: none";
          var sliceSize = 512;
          var byteCharacters = window.atob(this.labOrderDocument.DocumentData); //method which converts base64 to binary
          var byteArrays = [];
          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }  
              const blob = new Blob(byteArrays, { type: 'application/pdf' });
              this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
                a.href = window.URL.createObjectURL(blob);
                a.download = 'fileName.html'; 
                a.click();
                window.URL.revokeObjectURL(window.URL.createObjectURL(blob));
        })
    }
    printReport(rowData) {
        let payload = {
            orderId: rowData.LabOrderId
        }
        this.orderService.getLaboratoryForOrder(payload).subscribe(resp => {
            this.laboratoryOrder = resp
            this.orderService.getLabOrderReport(payload).subscribe(res => {
                this.labOrderReport = res;
                this.itemResultName = this.labOrderReport[1] !== undefined ? this.labOrderReport[1].ItemResultName : '';
                this.testResult = this.labOrderReport[1] !== undefined ? this.labOrderReport[1].TestResult : '';
                this.testResultValueText = this.labOrderReport[1] !== undefined ? this.labOrderReport[1].TestResultValueText : '';
                this.range = this.labOrderReport[1] !== undefined ? this.labOrderReport[1].NormalMinVal + `-` + this.labOrderReport[1].NormalMaxVal: '0-0'
                this.unitOfMeasure = this.labOrderReport[1] !== undefined ? this.labOrderReport[1].UnitOfMeasure : '';
                var divElements = `
                <div id="page-container">
                <div id="pf1" class="pf w0 h0" data-page-no="1">
                <div class="pc pc1 w0 h0">
                <div class="c x0 y1 w2 h2" style="border: 1px solid black;">
                <div class="t m0 x15 h3 y22 ff1 fs0 fc0 sc0 ls0 ws0">LABORATARY REPORT</div>
                </div>
            
            <div class="c x0 y4 w5 h5" style="border: 1px solid black;">
                <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">REFERRING PHYSICIAN/ACCOUNT</div>
            </div>
            <div class="c x0 y7 w5 hb" style="border: 1px solid black;">
                <div class="t m0 x1 ha y33 ff2 fs0 fc0 sc0 ls0 ws0">`+ this.labOrderReport[0].PracticeName + `<br/> <br/>` + this.labOrderReport[0].PhysicianFirstName + this.labOrderReport[0].PhysicianLastName + `<br/><br/>` + this.labOrderReport[0].AddressLine1 + `<br/> <br/>` + this.labOrderReport[0].StateCode + `<br/> <br/>` + this.labOrderReport[0].ZipCode + `</div>
            </div>
            <div class="c x5 y4 w6 h5"  style="border: 1px solid black;">
                <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">LAB INFORMATION</div>
            </div>
            <div class="c x5 y7 w6 hb" style="border: 1px solid black;">
                <div class="t m0 x1 ha y33 ff2 fs0 fc0 sc0 ls0 ws0">`+ this.laboratoryOrder[0].LabName + `</div>
            </div>
            <div class="c x3 y4 w7 h5" style="border: 1px solid black;border-bottom:none">
            <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">ACCESSION INFORMATION</div>
            </div>
            <div class="c x3 y3 w7 hc" style="border: 1px solid black;">
                <div class="t m0 x1 ha y34 ff2 fs0 fc0 sc0 ls0 ws0">`+ this.labOrderReport[0].ItemResultAlias + `</div>
            </div>
            <div class="c x3 y2 w7 h5" style="border: 1px solid black;border-bottom:none">
            <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">PATIENT INFORMATION</div>
        </div>
        <div class="c x3 y5 w7 hc" style="border: 1px solid black;border-top:none">
            <div class="t m0 x1 ha y34 ff2 fs0 fc0 sc0 ls0 ws0">ID#:`+ this.labOrderReport[0].PatientId + `</div>
        </div>
         
        <div class="c x0 y11 w5 h5">
            <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">TEST NAME</div>
         </div>
   
    <div class="c x10 y11 w6 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">ABNORMAL</div>
    </div>
    
    <div class="c x11 y12 w7 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"> RESULT</div>
    </div>
    <div class="c x12 y12 w7 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">RANGE</div>
    </div>
    <div class="c x13 y12 w7 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">UNITS</div>
    </div>
      
    <div class="c x0 y13 w5 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">***`+ this.labOrderReport[0].ItemResultName + `***<br/>
    </div>
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>
    `+ this.labOrderReport[0].ItemResultName + `</div>
    </div>
    <div class="c x10 y13 w6 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>
    </div>
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>`+ this.labOrderReport[0].TestResult + `</div>
    </div>
    <div class="c x11 y13 w7 h5">
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/></div>
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>`+ this.labOrderReport[0].TestResultValueText + `</div>
    </div>
    <div class="c x12 y13 w7 h5">
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">`+this.labOrderReport[0].NormalMinVal +'-' + this.labOrderReport[0].NormalMaxVal+`</div>
    </div>
    <div class="c x13 y13 w7 h5">
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">`+ this.labOrderReport[0].UnitOfMeasure + `</div>
    </div>
    <div class="c x0 y14 w5 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">***`+ this.itemResultName + `***<br/>
    </div>
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>
    `+ this.itemResultName + `</div>
    </div>
    <div class="c x10 y14 w6 h5">
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>
    </div>
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>`+ this.testResult + `</div>
    </div>
    <div class="c x11 y14 w7 h5">
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/></div>
        <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0"><br/>`+ this.testResultValueText + `</div>
    </div>
    <div class="c x12 y14 w7 h5">
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">`+this.range +`</div>
    </div>
    <div class="c x13 y14 w7 h5">
    <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">`+ this.unitOfMeasure + `</div>
    </div>
      <div class="c x0 y9 w8 h5" style="border: 1px solid black;border-bottom:none">
            <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">REPORT DELIVERY</div>
     </div>
        <div class="c x0 y6 w8 hd" style="border: 1px solid black;">
        <div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ this.laboratoryOrder[0].Website + `</div>
        </div>
        <div class="c x6 y9 w8 h8"  style="border: 1px solid black;">
        <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">DATE COLLECTED</div>
            </div>
            <div class="c x6 y6 w8 hd" style="border: 1px solid black;border-top:none">
            <div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ moment(this.laboratoryOrder[0].DateLastUpdated).format('DD-MM-YYYY') + `</div>
            </div>
            <div class="c x2 y9 w8 h8"  style="border: 1px solid black;border-left:none">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">DATE RECEIVED</div>
                </div>
            <div class="c x2 y6 w8 hd" style="border: 1px solid black;border-top:none;border-left:none">
            <div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ moment(this.laboratoryOrder[0].DateLastUpdated).format('DD-MM-YYYY') + `</div>
            </div>
            <div class="c x4 y9 w8 h8"  style="border: 1px solid black;border-left:none">
            <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">DATE REPORTED</div>
        </div>
        <div class="c x4 y6 w8 hd" style="border: 1px solid black;border-top:none;border-left:none">
        <div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ moment(this.laboratoryOrder[0].DateLastUpdated).format('DD-MM-YYYY') + `</div>
        </div>
        <div class="c x7 y9 w4 h8"  style="border: 1px solid black;">
        <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">SEX</div>
    </div>
    <div class="c x7 y6 w4 hd" style="border: 1px solid black;border-top:none;>
    <div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ this.labOrderReport[0].Sex + `</div>
    </div>
    <div class="c x8 y9 w8 h8"  style="border: 1px solid black;">
    <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">DATE OF BIRTH</div>
</div>
<div class="c x8 y6 w8 hd" style="border: 1px solid black;border-top:none;">
<div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ moment(this.labOrderReport[0].DateOfBirth).format('DD-MM-YYYY') + `</div>
</div>
<div class="c x9 y9 w4 h8"  style="border: 1px solid black;">
<div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">AGE</div>
</div>
<div class="c x9 y6 w4 hd" style="border: 1px solid black;border-top:none;>
<div class="t m0 x1 h7 y18 ff1 fs3 fc1 sc0 ls0 ws0">`+ this.labOrderReport[0].Age + `</div>
</div>


        </div>
        <div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div>
        </div>
        </div>`;
                var win = window.open();
                win.document.head.innerHTML = `<style>
        #sidebar {
            position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 250px;
      padding: 0;
      margin: 0;
      overflow: auto
    }

    #page-container {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
      border: 0
    }

    @media screen {
        #sidebar.opened+#page-container {
            left: 250px
        }

        #page-container {
            bottom: 0;
            right: 0;
          overflow: auto
        }
        
      .loading-indicator {
          display: none
        }

        .loading-indicator.active {
          display: block;
          position: absolute;
          width: 64px;
          height: 64px;
          top: 50%;
          left: 50%;
          margin-top: -32px;
          margin-left: -32px
        }
        
        .loading-indicator img {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0
        }
  }
  
  @media print {
      @page {
          margin: 0
        }
        
        html {
            margin: 0
      }
      
      body {
          margin: 0;
          -webkit-print-color-adjust: exact
        }

        #sidebar {
            display: none
        }
        
      #page-container {
          width: auto;
          height: auto;
          overflow: visible;
          background-color: transparent
        }
        
        .d {
            display: none
        }
  }
  
  .pf {
      position: relative;
      background-color: white;
      overflow: hidden;
      margin: 0;
      border: 0
    }
    
    .pc {
      position: absolute;
      border: 0;
      padding: 0;
      margin: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      display: block;
      transform-origin: 0 0;
      -ms-transform-origin: 0 0;
      -webkit-transform-origin: 0 0
    }
    
    .pc.opened {
        display: block
    }
    
    .bf {
        position: absolute;
        border: 0;
        margin: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none
    }
    
    .bi {
        position: absolute;
        border: 0;
      margin: 0;
      -ms-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none
  }
  
  @media print {
      .pf {
          margin: 0;
          box-shadow: none;
          page-break-after: always;
          page-break-inside: avoid
        }
        
      @-moz-document url-prefix() {
          .pf {
              overflow: visible;
              border: 1px solid #fff
            }
            
            .pc {
              overflow: visible
            }
        }
    }
    
    .c {
        position: absolute;
        border: 0;
        padding: 0;
      margin: 0;
      overflow: hidden;
      display: block
    }
    
    .t {
        position: absolute;
        white-space: pre;
      font-size: 1px;
      transform-origin: 0 100%;
      -ms-transform-origin: 0 100%;
      -webkit-transform-origin: 0 100%;
      unicode-bidi: bidi-override;
      -moz-font-feature-settings: "liga"0
    }
    
    .t:after {
        content: ''
  }
  
  .t:before {
      content: '';
      display: inline-block
    }

    .t span {
        position: relative;
        unicode-bidi: bidi-override
    }
    
    ._ {
        display: inline-block;
        color: transparent;
        z-index: -1
    }
    
    ::selection {
      background: rgba(127, 255, 255, 0.4)
    }
    
    ::-moz-selection {
        background: rgba(127, 255, 255, 0.4)
    }
    
    .pi {
        display: none
    }
    
    .d {
        position: absolute;
        transform-origin: 0 100%;
        -ms-transform-origin: 0 100%;
        -webkit-transform-origin: 0 100%
    }
    
    .it {
      border: 0;
      background-color: rgba(255, 255, 255, 0.0)
    }
    
    .ir:hover {
        cursor: pointer
    }
    
    @keyframes fadein {
        from {
            opacity: 0
        }
        
      to {
          opacity: 1
        }
    }

    @-webkit-keyframes fadein {
        from {
            opacity: 0
        }
        
        to {
          opacity: 1
      }
    }
    
  @keyframes swing {
      0 {
          transform: rotate(0)
        }
        
        10% {
            transform: rotate(0)
        }
        
        90% {
          transform: rotate(720deg)
        }
        
        100% {
            transform: rotate(720deg)
        }
    }
    
    @-webkit-keyframes swing {
        0 {
            -webkit-transform: rotate(0)
        }
        
        10% {
            -webkit-transform: rotate(0)
      }
      
      90% {
          -webkit-transform: rotate(720deg)
      }

      100% {
          -webkit-transform: rotate(720deg)
        }
    }
    
    @media screen {
        #sidebar {
            background-color: #2f3236;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+")
        }

        #outline {
            font-family: Georgia, Times, "Times New Roman", serif;
            font-size: 13px;
            margin: 2em 1em
      }
      
      #outline ul {
          padding: 0
      }
      
      #outline li {
          list-style-type: none;
          margin: 1em 0
        }
        
        #outline li>ul {
            margin-left: 1em
        }
        
        #outline a,
        #outline a:visited,
        #outline a:hover,
        #outline a:active {
            line-height: 1.2;
            color: #e8e8e8;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            display: block;
            overflow: hidden;
            outline: 0
        }
        
        #outline a:hover {
            color: #0cf
        }

        #page-container {
          background-color: #9e9e9e;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=");
          -webkit-transition: left 500ms;
          transition: left 500ms
        }
        
        .pf {
            margin: 13px auto;
            box-shadow: 1px 1px 3px 1px #333;
            border-collapse: separate
        }
        
        .pc.opened {
            -webkit-animation: fadein 100ms;
          animation: fadein 100ms
        }

        .loading-indicator.active {
            -webkit-animation: swing 1.5s ease-in-out .01s infinite alternate none;
          animation: swing 1.5s ease-in-out .01s infinite alternate none
        }
        
      .checked {
          background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goQDSYgDiGofgAAAslJREFUOMvtlM9LFGEYx7/vvOPM6ywuuyPFihWFBUsdNnA6KLIh+QPx4KWExULdHQ/9A9EfUodYmATDYg/iRewQzklFWxcEBcGgEplDkDtI6sw4PzrIbrOuedBb9MALD7zv+3m+z4/3Bf7bZS2bzQIAcrmcMDExcTeXy10DAFVVAQDksgFUVZ1ljD3yfd+0LOuFpmnvVVW9GHhkZAQcxwkNDQ2FSCQyRMgJxnVdy7KstKZpn7nwha6urqqfTqfPBAJAuVymlNLXoigOhfd5nmeiKL5TVTV+lmIKwAOA7u5u6Lped2BsbOwjY6yf4zgQQkAIAcedaPR9H67r3uYBQFEUFItFtLe332lpaVkUBOHK3t5eRtf1DwAwODiIubk5DA8PM8bYW1EU+wEgCIJqsCAIQAiB7/u253k2BQDDMJBKpa4mEon5eDx+UxAESJL0uK2t7XosFlvSdf0QAEmlUnlRFJ9Waho2Qghc1/U9z3uWz+eX+Wr+lL6SZfleEAQIggA8z6OpqSknimIvYyybSCReMsZ6TislhCAIAti2Dc/zejVNWwCAavN8339j27YbTg0AGGM3WltbP4WhlRWq6Q/btrs1TVsYHx+vNgqKoqBUKn2NRqPFxsbGJzzP05puUlpt0ukyOI6z7zjOwNTU1OLo6CgmJyf/gA3DgKIoWF1d/cIY24/FYgOU0pp0z/Ityzo8Pj5OTk9PbwHA+vp6zWghDC+VSiuRSOQgGo32UErJ38CO42wdHR09LBQK3zKZDDY2NupmFmF4R0cHVlZWlmRZ/iVJUn9FeWWcCCE4ODjYtG27Z2Zm5juAOmgdGAB2d3cBADs7O8uSJN2SZfl+WKlpmpumaT6Yn58vn/fs6XmbhmHMNjc3tzDGFI7jYJrm5vb29sDa2trPC/9aiqJUy5pOp4f6+vqeJ5PJBAB0dnZe/t8NBajx/z37Df5OGX8d13xzAAAAAElFTkSuQmCC)
        }
  }
  
  .ff0 {
      font-family: sans-serif;
      visibility: hidden;
    }

  @font-face {
      font-family: ff1;
      src: url(f1.woff)format("woff");
    }
    
    .ff1 {
      font-family: ff1;
      line-height: 0.866699;
      font-style: normal;
      font-weight: normal;
      visibility: visible;
    }

    @font-face {
        font-family: ff2;
        src: url(f2.woff)format("woff");
    }
    
    .ff2 {
        font-family: ff2;
        line-height: 0.824707;
      font-style: normal;
      font-weight: normal;
      visibility: visible;
    }
    
    .m0 {
        transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
        -ms-transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
        -webkit-transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
    }
    
    .v0 {
        vertical-align: 0.000000px;
    }
    
    .ls0 {
        letter-spacing: 0.000000px;
    }
    
    .sc_ {
        text-shadow: none;
    }
    
    .sc0 {
        text-shadow: -0.015em 0 transparent, 0 0.015em transparent, 0.015em 0 transparent, 0 -0.015em transparent;
    }
    
    @media screen and (-webkit-min-device-pixel-ratio:0) {
        .sc_ {
            -webkit-text-stroke: 0px transparent;
        }
        
        .sc0 {
            -webkit-text-stroke: 0.015em transparent;
          text-shadow: none;
        }
  }
  
  .ws0 {
      word-spacing: 0.000000px;
    }
    
    ._1 {
        width: 27.504000px;
    }
    
    ._3 {
        width: 52.716038px;
    }
    
    ._0 {
        width: 98.556000px;
    }
    
  ._2 {
      width: 107.723962px;
    }
    
    .fc1 {
        color: rgb(0, 0, 0);
    }
    
    .fc0 {
        color: rgb(0, 0, 0);
    }
    
    .fs3 {
        font-size: 24.832000px;
  }
  
  .fs1 {
      font-size: 26.740000px;
    }
    
    .fs0 {
        font-size: 30.560000px;
    }
    
  .fs4 {
      font-size: 34.380000px;
  }
  
  .fs2 {
      font-size: 36.288000px;
  }

  .fs5 {
      font-size: 38.200000px;
  }

  .y3a {
      bottom: 2.860000px;
    }

  .y36 {
      bottom: 0px;
  }

  .y5 {
      bottom: 682px;
  }

  .y10 {
      bottom: 400.620000px;
  }
  
  .y2 {
      bottom: 733.640000px;
  }

  .y3 {
      bottom: 733px;
  }

  .y34 {
      bottom: 34.720000px;
  }

  .y6 {
      bottom: 608.0px;
  }

  .y3e {
      bottom: 5.960000px;
  }

  .yc {
      bottom: 6.000000px;
  }

  .y8 {
      bottom: 6.010000px;
  }

  .y38 {
      bottom: 6.220000px;
  }
  
  .y3c {
      bottom: 6.470000px;
  }
  
  .y0 {
      bottom: 204.000000px;
  }
  
  .y3d {
      bottom: 204.240000px;
    }

  .y3f {
      bottom: 221.240000px;
    }

  .y3b {
      bottom: 238.250000px;
    }

  .y39 {
      bottom: 255.260000px;
  }
  
  .y37 {
      bottom: 272.270000px;
    }

  .y35 {
      bottom: 289.280000px;
  }

  .y33 {
      bottom: 84px;
  }

  .y32 {
      bottom: 311.640000px;
  }
  
  .y31 {
      bottom: 323.660000px;
  }
  
  .y30 {
      bottom: 335.680000px;
  }

  .y2f {
      bottom: 347.730000px;
  }
  
  .y2e {
      bottom: 359.740000px;
    }

    .y2d {
      bottom: 371.760000px;
  }

  .y2c {
      bottom: 383.780000px;
    }

  .y2b {
      bottom: 395.800000px;
  }
  
  .y2a {
      bottom: 407.850000px;
  }
  
  .y29 {
      bottom: 419.870000px;
  }
  
  .y28 {
      bottom: 431.890000px;
    }

  .y27 {
      bottom: 443.910000px;
    }

  .y26 {
      bottom: 455.920000px;
  }
  
  .y25 {
      bottom: 467.940000px;
    }
    
  .y24 {
      bottom: 479.990000px;
    }
    
  .y23 {
      bottom: 492.010000px;
    }
    
  .y22 {
      bottom: 3.640000px;
    }
    
    .y21 {
        bottom: 516.670000px;
    }
    
    .y20 {
        bottom: 528.630000px;
    }
    
  .y1f {
      bottom: 540.650000px;
    }

    .y1e {
        bottom: 552.670000px;
  }
  
  .y1d {
      bottom: 564.720000px;
    }
    
  .y1c {
      bottom: 576.740000px;
    }
    
    .y1b {
        bottom: 588.760000px;
    }
    
  .y1a {
      bottom: 600.770000px;
  }
  
  .y19 {
      bottom: 612.790000px;
    }
    
    .y18 {
      bottom:40.010000px;
    }
    
    .y17 {
      bottom: 636.860000px;
    }

    .y16 {
        bottom: 648.880000px;
  }
  
  .y15 {
      bottom: 660.900000px;
    }
    
    .y14 {
        bottom: 524.94px;
    }

  .y13 {
      bottom: 548.94px;
    }
    
    .y12 {
      bottom: 569.62px;
  }

  .y11 {
      bottom: 569.62px;
    }

    .yf {
      bottom: 721.020000px;
  }
  
  .ye {
      bottom: 733.040000px;
    }

  .yd {
      bottom: 745.060000px;
  }

  .yb {
      bottom: 757.080000px;
  }
  
  .ya {
      bottom: 769.120000px;
  }
  
  .y9 {
      bottom:656.140000px;
    }
    
    .y7 {
        bottom: 684.160000px;
  }
  
  .y4 {
      bottom: 784.560000px;
  }
  
  .y1 {
      bottom: 816.520000px;
    }

  .h2 {
      height: 13.340000px;
  }
  
  .h9 {
      height: 11.740000px;
    }
    
    .h5 {
        height: 11.960000px;
    }
    
    .h8 {
        height: 12.020000px;
    }
    
    .hb {
        height: 100px;
    }
    
    .h7 {
        height: 17.532750px;
    }
    
    .hd {
        height: 47px;
    }
    
    .h4 {
        height: 18.879902px;
    }
    
    .ha {
        height: 40.726484px;
    }
    
    .h3 {
        height: 21.577031px;
    }
    
    .hc {
        height: 50.274160px;
    }
    
    .h6 {
        height: 25.621313px;
    }
    
    .he {
        height: 26.971289px;
    }
    
    .h1 {
        height: 624.500000px;
    }

    .h0 {
        height: 841.890000px;
    }
    .h11{
        height:500px;
    }
    .w8 {
        width: 87px;
  }
  
  .w4 {
      width: 34.390000px;
  }
  
  .w3 {
      width: 141.730000px;
  }

  .w6 {
      width: 164.430000px;
  }

  .w7 {
      width: 164.940000px;
  }

  .w5 {
      width: 165.450000px;
    }

  .w2 {
      width: 547.400000px;
  }

  .wa {
      width: 195.590000px;
  }
  
  .wb {
      width: 204.090000px;
  }

  .w9 {
      width: 209.760000px;
  }
  
  .w1 {
      width: 568.000000px;
  }

  .w0 {
      width: 595.280000px;
  }

  .x1 {
      left: 0.850000px;
  }

  .x0 {
      left: 13.500000px;
    }
  .x15{
      left: 235.85px;
  }
  .x8 {
      left: 428.090000px;
    }
  .x10{
    left :199px;
}
.x12{
    left : 387px
}
.x13{
    left:517px;
}
.x11{
    left : 284px;
}
  .x5 {
      left: 202.480000px;
  }

  .x2 {
      left: 201.43px;
    }

  .x7 {
      left: 385.470000px;
    }

  .x9 {
      left: 524.830000px;
  }

  .x3 {
      left: 396.170000px;
    }

    .xa {
      left: 444.900000px;
  }
  
  .x6 {
      left: 112.84px;
  }
  
  .x4 {
      left: 289.57px;
    }
    
  @media print {
      .v0 {
          vertical-align: 0.000000pt;
      }
      
      .ls0 {
          letter-spacing: 0.000000pt;
      }
      
      .ws0 {
          word-spacing: 0.000000pt;
      }
      
      ._1 {
          width: 36.672000pt;
      }
      
      ._3 {
          width: 70.288051pt;
      }
      
      ._0 {
          width: 131.408000pt;
        }

      ._2 {
          width: 143.631949pt;
      }
      
      .fs3 {
          font-size: 33.109333pt;
      }
      
      .fs1 {
          font-size: 35.653333pt;
        }

      .fs0 {
          font-size: 40.746667pt;
      }

      .fs4 {
          font-size: 45.840000pt;
        }

        .fs2 {
          font-size: 48.384000pt;
        }

        .fs5 {
            font-size: 50.933333pt;
        }

        .y3a {
            bottom: 3.813333pt;
      }
      
      .y36 {
          bottom: 4.186667pt;
      }
      
      .y5 {
          bottom: 4.746667pt;
        }
        
        .y10 {
            bottom: 4.826667pt;
        }

      .y2 {
          bottom: 4.853333pt;
      }
      
      .y3 {
          bottom: 5.186667pt;
      }
      
      .y34 {
          bottom: 7.626667pt;
        }
        
        .y6 {
            bottom: 7.933333pt;
        }
        
      .y3e {
          bottom: 7.946667pt;
        }
        
        .yc {
          bottom: 8.000000pt;
        }

        .y8 {
            bottom: 8.013333pt;
      }
      
      .y38 {
          bottom: 8.293333pt;
        }
        
        .y3c {
          bottom: 8.626667pt;
        }
        
      .y0 {
          bottom: 272.000000pt;
      }
      
      .y3d {
          bottom: 272.320000pt;
        }
        
        .y3f {
            bottom: 294.986667pt;
        }
        
        .y3b {
            bottom: 317.666667pt;
        }
        
        .y39 {
            bottom: 340.346667pt;
        }
        
        .y37 {
            bottom: 363.026667pt;
        }
        
        .y35 {
            bottom: 185.706667pt;
        }

        .y33 {
            bottom: 399.880000pt;
        }
        
        .y32 {
            bottom: 415.520000pt;
        }
        
        .y31 {
            bottom: 431.546667pt;
        }
        
        .y30 {
            bottom: 447.573333pt;
        }
        
        .y2f {
            bottom: 463.640000pt;
        }

        .y2e {
          bottom: 479.653333pt;
        }
        
        .y2d {
            bottom: 495.680000pt;
        }
        
        .y2c {
            bottom: 511.706667pt;
        }
        
        .y2b {
            bottom: 527.733333pt;
        }
        
        .y2a {
            bottom: 543.800000pt;
        }
        
        .y29 {
            bottom: 559.826667pt;
        }
        
        .y28 {
            bottom: 575.853333pt;
        }
        
    
      .y27 {
          bottom: 591.880000pt;
      }

      .y26 {
          bottom: 607.893333pt;
      }

      .y25 {
          bottom: 623.920000pt;
      }

      .y24 {
          bottom: 639.986667pt;
      }

      .y23 {
          bottom: 656.013333pt;
      }

      .y22 {
          bottom: 672.040000pt;
      }

      .y21 {
          bottom: 688.893333pt;
      }

      .y20 {
          bottom: 704.840000pt;
      }

      .y1f {
          bottom: 720.866667pt;
      }

      .y1e {
          bottom: 736.893333pt;
      }

      .y1d {
          bottom: 752.960000pt;
      }

      .y1c {
          bottom: 768.986667pt;
      }

      .y1b {
          bottom: 785.013333pt;
      }

      .y1a {
          bottom: 801.026667pt;
      }

      .y19 {
          bottom: 817.053333pt;
      }

      .y18 {
          bottom: 833.080000pt;
      }

      .y17 {
          bottom: 849.146667pt;
      }

      .y16 {
          bottom: 865.173333pt;
      }

      .y15 {
          bottom: 881.200000pt;
      }

      .y14 {
          bottom: 897.226667pt;
      }

      .y13 {
          bottom: 913.253333pt;
      }

      .y12 {
          bottom: 929.306667pt;
      }

      .y11 {
          bottom: 945.333333pt;
      }

      .yf {
          bottom: 961.360000pt;
      }

      .ye {
          bottom: 977.386667pt;
      }

      .yd {
          bottom: 993.413333pt;
      }

      .yb {
          bottom: 1009.440000pt;
      }

      .ya {
          bottom: 1025.493333pt;
      }

      .y9 {
          bottom: 1041.520000pt;
      }

      .y7 {
          bottom: 1037.546667pt;
      }

      .y4 {
          bottom: 1048.746667pt;
      }

      .y1 {
          bottom: 1088.693333pt;
      }

      .h2 {
          height: 17.120000pt;
      }

      .h9 {
          height: 15.653333pt;
      }

      .h5 {
          height: 15.946667pt;
      }

      .h8 {
          height: 16.026667pt;
      }

      .hb {
          height: 22.680000pt;
      }

      .h7 {
          height: 23.377000pt;
      }

      .hd {
          height: 24.180898pt;
      }

      .h4 {
          height: 25.173203pt;
      }

      .ha {
          height: 37.635312pt;
      }

      .h3 {
          height: 28.769375pt;
      }

      .hc {
          height: 52.365547pt;
      }

      .h6 {
          height: 34.161750pt;
      }

      .he {
          height: 35.961719pt;
      }

      .h1 {
          height: 832.666667pt;
      }

      .h0 {
          height: 1122.520000pt;
      }
      
      .w8 {
          width: 170.080000pt;
      }

      .w4 {
          width: 173.853333pt;
      }

      .w3 {
          width: 188.973333pt;
      }

      .w6 {
          width: 192.573333pt;
      }

      .w7 {
          width: 193.253333pt;
      }

      .w5 {
          width: 193.933333pt;
      }

      .w2 {
          width: 296.533333pt;
      }

      .wa {
          width: 260.786667pt;
      }

      .wb {
          width: 272.120000pt;
      }

      .w9 {
          width: 279.680000pt;
      }

      .w1 {
          width: 757.333333pt;
      }

      .w0 {
          width: 793.706667pt;
      }

      .x1 {
          left: 1.133333pt;
      }

      .x0 {
          left: 18.000000pt;
      }

      .x8 {
          left: 200.120000pt;
      }
      

      .x5 {
          left: 212.640000pt;
      }

      .x2 {
          left: 215.240000pt;
      }

      .x7 {
          left: 328.626667pt;
      }

      .x9 {
          left: 389.106667pt;
      }

      .x3 {
          left: 404.226667pt;
      }

      .xa {
          left: 593.200000pt;
      }

      .x6 {
          left: 548.453333pt;
      }

      .x4 {
          left: 600.760000pt;
      }
  }
  </style>`
                win.document.body.innerHTML =
                    `<body>
<center>
</center>
<br>` +
                    divElements +
                    `
</body>`;
            })
        })
    }
}
