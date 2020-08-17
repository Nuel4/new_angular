import { Component, OnInit, ViewEncapsulation, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ref-phy-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RefPhyDeleteModalComponent implements OnInit {
  @Output() ConfirmDelete: EventEmitter<any> = new EventEmitter()
  constructor(public modal: NgbActiveModal, ) { }

  ngOnInit() {

    console.log("DELETING")
  }
}
