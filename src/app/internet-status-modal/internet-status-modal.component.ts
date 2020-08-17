import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-internet-status-modal',
  templateUrl: './internet-status-modal.component.html',
  styleUrls: ['./internet-status-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InternetStatusModalComponent implements OnInit {

  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
  }

}
