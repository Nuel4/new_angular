import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LetterService } from '../../../services/chart/letter.service';
import * as moment from 'moment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteLetterComponent } from './delete-letter/delete-letter.component';
import { HttpEventType } from '@angular/common/http'
import { LetterEditorComponent } from './letter-editor/letter-editor.component';
@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LettersComponent implements OnInit {
  cols: any[];
  patientDetails: any;
  referalLetter: any[];
  // modalRef: NgbModalRef;

  constructor(private router: Router,
    private letters: LetterService,
    private modalService: NgbModal) {


  }
  addnewletter(event) {
    this.router.navigate(['/pages/chart/add-letter'], { skipLocationChange: true });
  }
  ngOnInit() {
    // this.carService.getCarsSmall().then(cars => this.values= cars);

    this.cols = [
      { field: 'letterDate', header: 'LetterDate' },
      { field: 'LetterTemplateName', header: 'Template' },
      { field: 'LetterTemplateCategoryName', header: 'Category' },
      { field: 'ReferringPhysicianName', header: 'Send To' },
      { field: 'ProviderUsername', header: 'Provider' },
      { field: 'printed', header: 'Printed' },
      { field: 'created', header: 'Created' },
    ];

    this.getReferalLetter();
  }

  getReferalLetter() {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let parameter = {
      patientId: this.patientDetails.PatientId,
    }
    this.letters.getReferalLetters(parameter).subscribe((results: any) => {
      this.referalLetter = results.map(item => ({
        ...item,
        letterDate: item.LetterDate ? moment(item.LetterDate).format('MM-DD-YYYY') : '',
        printed: item.PrintedTimestamp ? moment(item.PrintedTimestamp).format('MM-DD-YYYY') : '',
        created: item.DateCreated ? moment(item.DateCreated).format('MM-DD-YYYY') : ''
      }))

    })

  }

  // onDelet(letter) {
  //   this.letters.deleteForm(JSON.stringify(letter)).subscribe(event => {
  //     if (event.type === HttpEventType.Response) {

  //       this.removeFromcloudStorage(file);
  //     }
  //   });
  // }

  openDeleteModal(LettersId) {
    let modalRef = this.modalService.open(DeleteLetterComponent , { centered: true,windowClass:'delete-class'})
    modalRef.componentInstance.letterId = LettersId;
    modalRef.componentInstance.deleteEvent.subscribe((value) => {
      if (value) {
        // this.cancelReferralLetters(LettersId)        
        this.getReferalLetter();
        // this.modalRef.close()
      }
    })
  }
  onClose(){
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
  }
  
  openEditor(rowData) {
    let modalRef = this.modalService.open(LetterEditorComponent , { centered: true,size:'lg'})
    modalRef.componentInstance.rowData = rowData;
    modalRef.componentInstance.header = 'Letter Editor'
    // modalRef.componentInstance.editEvent.subscribe((value) => {
    //   if (value) {
    //     // this.cancelReferralLetters(LettersId)        
    //     this.getReferalLetter();
    //     // this.modalRef.close()
    //   }
    // })
  }

}
