import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationStore } from '../../../../../authentication';
import { WaitingroomService } from '../../../../../services/waitingnroom/waitingroom.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-billers-note',
  templateUrl: './billers-note.component.html',
  styleUrls: ['./billers-note.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillersNoteComponent implements OnInit {
  @Input() openBillersModal: boolean;
  @Input() openPastModal: boolean;
  @Input() patientData: any;
  @Input() paymentType: any;
  @Input() billersNote: boolean;
  check_box: boolean = false;
  billersNoteList: any = [];
  pastStaetments: any = [];
  cols: any = [];
  headerIndex: any;
  billers_notes: any = {};
  Index : number;
  enable_update: boolean = false;
  enableFilterInput: boolean = false;
  updatedHistory: any;
  constructor(public activeModal: NgbActiveModal,
    private waitingRoomService: WaitingroomService,
    private authStore: AuthenticationStore,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if (this.openBillersModal) {
      this.getBillersNotesList(this.Index);
      this.cols = [
        { field: "DateLastUpdated", header: 'Date', filter: true },
        { field: "NoteType", header: "Note Type", filter: true },
        { field: "Note", header: "Notes" },
        { field: "edit", header: 'Edit' },
        { field: "delete", header: "Delete" },
      ];
    }
    if (this.openPastModal) {
      this.cols = [
        { field: '', header: 'Date' },
        { field: "displayDate", header: "File Name" },
        { field: "Comment", header: "Print" },
        { field: 'edit', header: 'Email' },
      ];
      this.getPastStatements();
    }
  }
  openFilter(index) {
    this.headerIndex = index;
    this.enableFilterInput = true;
  }

  clearNotes() {
    this.billers_notes={};
    this.enable_update = false;
  }
  // onPagination(event) {
  //   this.getBillersNotesList(event.first / event.rows)
  // }
  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.getBillersNotesList(this.Index)
  }
  getBillersNotesList(index?) {
    let paylod = {
      patientId: this.patientData.PatientId ? this.patientData.PatientId : this.patientData.patientId,
      offset: index ? index : 0,
      limit: 4,
    }
    this.waitingRoomService.getBillersNotesList(paylod).subscribe((results: any) => {
      this.billersNoteList = results;
      this.billersNoteList.Results.forEach(element => {
        element.DateLastUpdated = moment(element.DateLastUpdated).format('DD/MM/YYYY')
      });
      console.log("billerNoteList:", this.billersNoteList);
    })
  }

  onPageChange(_event) {
    this.getBillersNotesList(_event.index);
  }

  onChecked(value) {
    this.check_box = value;
  }
  saveNote(){
  if(this.billers_notes.text){
    this.saveBillerNote();
  }
  else{    
    this.toastr.error("Biller's Note Cannot be Empty");
  }
}
  saveBillerNote() {
    console.log(this.billers_notes.text)
    let payload = [{
      "BillersNoteId": 0,
      "PatientId": this.patientData.PatientId,
      "Note": this.billers_notes.text,
      "UpdateHistory": moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + ':' + (this.patientData.patientname ? this.patientData.patientname : this.patientData.LastName + " " + this.patientData.FirstName),
      "DateCreated": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      "NoteType": this.paymentType ? this.paymentType : "Payment",
      "PaymentNoteType": null,
      "PaymentTypeId": null,
      "TransactionId": null,
      "CreatedByUserId": this.authStore.UserDetail.UserId,
      "DateLastUpdated": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      "LastUpdatedByUserId": this.authStore.UserDetail.UserId,
      "FlagShowOnPatientStatement": this.check_box,
      "MrPatientEncounterCptDiagnosisAssociationId": null,

    }]
    this.waitingRoomService.addBillersNote(payload).subscribe(result => {
      console.log("added billers note data:",result);
      this.toastr.success(" Biller's Note added Successfully");
      // this.activeModal.dismiss('Cross click');
      this.getBillersNotesList();
      this.clearNotes();
    })
  }

  updateBillerNote() {
    let payload = {
      "BillersNoteId": this.billers_notes.BillersNoteId,
      "PatientId": this.billers_notes.PatientId,
      "Note": this.billers_notes.text,
      "UpdateHistory": this.billers_notes.UpdateHistory,
      "DateCreated": this.billers_notes.DateCreated,
      "NoteType": this.billers_notes.NoteType,
      "PaymentNoteType": this.billers_notes.PaymentNoteType,
      "PaymentTypeId": this.billers_notes.PaymentTypeId,
      "TransactionId": this.billers_notes.TransactionId,
      "CreatedByUserId": this.billers_notes.CreatedByUserId,
      "DateLastUpdated": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      "LastUpdatedByUserId": this.authStore.UserDetail.UserId,
      "FlagShowOnPatientStatement": this.check_box,
      "MrPatientEncounterCptDiagnosisAssociationId": this.billers_notes.MrPatientEncounterCptDiagnosisAssociationId
    }
    this.waitingRoomService.updateBillersNote([payload]).subscribe(result => {
      this.toastr.success("Updated Biller's Note Successfully");
      // this.activeModal.dismiss('Cross click');
      this.getBillersNotesList();
      this.clearNotes();
    })
  }

  onSelectedRowEdit(row_data) {
    this.billers_notes = row_data
    this.billers_notes.text = row_data.Note;
    this.updatedHistory = row_data.UpdateHistory;
    this.enable_update = true;
  }


  onSelectedRowDelete(row_data) {
    this.waitingRoomService.deleteBillersNote({ BillersNoteId: row_data.BillersNoteId }).subscribe(result => {
      console.log("deleted record:", result)
      // if(result.value == 'success'){
      this.toastr.success("Biller's Note Deleted Successfully");
      this.getBillersNotesList();
      this.clearNotes();
      // }
      // else{
      //   this.toastr.error("Billars note deletion failed");
      // }
     
    })
  }

  getPastStatements(pageNo?) {
    let payload = {
      patientid: this.patientData.PatientId ? this.patientData.PatientId : this.patientData.patientId,
      limit: 10,
      offset: pageNo ? pageNo : 0,

    }
    this.waitingRoomService.getPastStatements(payload).subscribe((results: any) => {
      this.pastStaetments = results.Results;
    })
  }

  onPastPageChange(event) {
    this.getPastStatements(event.index);
  }

}
