import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datepicker-popup',
  templateUrl: './datepicker-popup.component.html',
  styleUrls: ['./datepicker-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerPopupComponent implements OnInit {
  @Input() isDatepicker
  gotoDate: any
  currUrl: string
  @Output() loadDate: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router, private activeModal: NgbActiveModal,private modalService: NgbModal) { }

  ngOnInit() {
    this.currUrl = this.router.url
    this.gotoDate = new Date()
  }

  processReq(){   
    this.loadDate.emit({
      bool:true
    })
  }

  closeModal(){
    this.activeModal.dismiss("closing")
  }

  moveToDate() {
    this.loadDate.emit({
      value: this.gotoDate,
      bool: true
    })
  }



}
