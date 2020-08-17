import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';
import { ProgressnoteService } from '../../../services/chart/progressnote.service'
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportmodalComponent } from './template-editor/reportmodal/reportmodal.component';
import * as jsPDF from 'jspdf'
import { LetterEditorComponent } from '../letters/letter-editor/letter-editor.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-progressnote',
  templateUrl: './progressnote.component.html',
  styleUrls: ['./progressnote.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressnoteComponent implements OnInit {
  @Input() wData: any
  @Output() onSomething = new EventEmitter<string>();
  toChart: boolean;
  widgetData: any;
  patientDetails: any;
  progressNoteList: any = {};
  TemplateList: any;
  isLoader: boolean = false;
  totalRecords = 0;
  row = 0;
  GenericFacilityList: any;
  userDetails: any;
  physicianUsersList: any = [];
  preferredTemplateList: any;
  fileUrl: any;
cols: any = [];
  constructor(
    private progressService: ProgressnoteService,
    private router: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.cols = [
      { field: '', header: 'Consultation date' },
      { field: 'chief_complaint', header: 'Details' },
      { field: 'physician', header: 'Physician' },
      { field: 'DateLastUpdated', header: 'Summary' },
      { field: 'DateLastUpdated', header: 'Provided' },
      { field: 'DateLastUpdated', header: 'Scan' },
      { field: 'DateLastUpdated', header: 'CCD' },
      { field: 'DateLastUpdated', header: 'Audit' },
      { field: 'DateLastUpdated', header: 'Delete' },
      { field: 'DateLastUpdated', header: 'Report' }
    ]
    if (this.wData) {
      this.widgetData = JSON.parse(this.wData);
      if (this.widgetData) {
        this.toChart = true;
      }

    }
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
    if (this.patientDetails !== undefined) {
      this.getProgressnoteList();
    }
  }

  auditReport() {
    const modalRef = this.modalService.open(ReportmodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.audit = true;
    modalRef.componentInstance.header = 'Audit Report'
  }
  refreshData() {
    this.onSomething.emit();
  }

  routeToTemplate(rowData) {
    console.log(rowData)
    this.router.navigate(['/pages/chart/template-editor'], { queryParams: { Id: rowData.mr_template_group_id, EncounterId: rowData.mr_patient_encounter_id } })
  }

  getProgressnoteList(pageNo?) {
    let param = {
      patientId: this.patientDetails.PatientId,
      offset: pageNo ? pageNo : 0,
      limit: this.wData ? 5 : 10
    }
    this.progressService.getMrPatientEncounterByPatientId(param).subscribe(
      Result => {
        console.log("Progress note list", Result)
        this.progressNoteList = Result;
        // this.totalRecords = ;        
      }
    )
  }
  paginate(event) {
    const index = (event.first / event.rows);

    this.getProgressnoteList(index)
  }

  deleteNote(data) {
    const modalRef = this.modalService.open(ReportmodalComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.deleteModal = true;
    modalRef.componentInstance.rowData = data;
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.getProgressnoteList();
      }
    })
  }

  openSummary(rowData) {
      let modalRef = this.modalService.open(LetterEditorComponent , { centered: true,size:'lg'})
      modalRef.componentInstance.summary = true;
      modalRef.componentInstance.header = 'View Document'
      // modalRef.componentInstance.editEvent.subscribe((value) => {
      //   if (value) {
      //     // this.cancelReferralLetters(LettersId)        
      //     this.getReferalLetter();
      //     // this.modalRef.close()
      //   }
      // })
    
  //   const elementToPrint = document.getElementById('abcd')
  //   const pdf = new jsPDF('p', 'pt', 'a4');
  //   pdf.addHTML(elementToPrint, () => {
  //   doc.save('web.pdf');
  //   });
  }

  downloadHtml(rowData) {
    let payload = {
      id: '',
      pcseId: rowData.mr_patient_encounter_id,
      pid: this.patientDetails.PatientId
    }
    this.progressService.getCCD(payload).subscribe((res)=>{
    var a = document.createElement("a");
    document.body.appendChild(a);
    // a.style = "display: none";
  var sliceSize = 512;
  var byteCharacters = window.atob(res.bytes); //method which converts base64 to binary
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


}
