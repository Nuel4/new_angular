import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-review-scan',
  templateUrl: './review-scan.component.html',
  styleUrls: ['./review-scan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewScanComponent implements OnInit {
  values: any[];
  cols: any[];

  isdisabled: boolean = true;
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.cols = [
      { field: 'documentname', header: 'Document Name' },
      { field: 'datescanned', header: 'Date Scanned' },
      { field: 'documentdate', header: 'Document Date' },
      { field: 'dmscategory', header: 'Dms Category' },
      { field: 'pagesinscan', header: 'Pages In Scan' },
      { field: 'encounter', header: 'Encounter' },
    ]

    this.values = [
      {
        documentname: 'Work_23456789.pdf',
        datescanned: '02/04/2015',
        documentdate: '12/02/2015',
        dmscategory: 'specialist notes',
        pagesinscan: '1',
        encounter: 'aaa'
      }
    ];

  }
  onRowSelect(event) {
    this.isdisabled = false;
  }

}
