import { Component, OnInit, ViewEncapsulation, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-forms-delete-modal',
  templateUrl: './forms-delete-modal.component.html',
  styleUrls: ['./forms-delete-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsDeleteModalComponent implements OnInit {

  @Output() ConfirmFormDelete: EventEmitter<any> = new EventEmitter()
  constructor(public modal: NgbActiveModal, ) { }

  ngOnInit() {
  }

}
