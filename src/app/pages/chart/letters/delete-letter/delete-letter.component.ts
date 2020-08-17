import { Component, OnInit, ViewEncapsulation, EventEmitter,Output, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LetterService } from '../../../../../app/services/chart/letter.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-delete-letter',
  templateUrl: './delete-letter.component.html',
  styleUrls: ['./delete-letter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DeleteLetterComponent implements OnInit {
  @Input() letterId: any;
@Output() deleteEvent: EventEmitter<any> = new EventEmitter()
  constructor(public modal: NgbActiveModal,
    private letters: LetterService,
    private toastr: ToastrService,) { }

  ngOnInit() {
  }
  
  cancelReferralLetters() {
    let param = {
      referalLetterId: this.letterId,
    }

    this.letters.getMrReferalLetterById(param).subscribe(resp => {
      let object = resp
      object.IsInactive = true
      this.letters.cancelReferralLetter(object).subscribe(resp => {
        this.deleteEvent.emit(true);
        this.modal.dismiss('');
        this.toastr.success('Deleted Letter Successfully');
      })
    })
  }
}
