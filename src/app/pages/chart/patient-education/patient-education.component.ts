import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { PatienteducationService } from '../../../services/chart/patienteducation.service'
import { from } from 'rxjs';
import { Session } from 'protractor';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationStore } from './../../../authentication/authentication-store';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';
import { LetterEditorComponent } from '../letters/letter-editor/letter-editor.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-patient-education',
  templateUrl: './patient-education.component.html',
  styleUrls: ['./patient-education.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientEducationComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  toChart: boolean;
  widgetData: any;
  patientEducationList: any;
  patientDetails: any;
  totalRecords = 0;
  rows: any;
  isenableControls: boolean = false;
cols: any = [];
  constructor(private patientService: PatienteducationService,
    private route: ActivatedRoute,
    private authStore: AuthenticationStore,
    private modalService: NgbModal,
    private fb: FormBuilder) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.cols = [
      { field: '', header: 'Document' },
      { field: '', header: 'Email' },
      { field: '', header: 'Date Email sentDocument' },
      { field: '', header: 'Print' },
      { field: '', header: 'Date printed' },
      { field: '', header: 'Patient portal' },
      { field: '', header: 'Action' },
    ]
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.patientDetails = this.authStore.PatientDetail
    if (this.patientDetails !== undefined) {
      let page = 0
      this.getPatientEducation(page);
    }

  }

  getPatientEducation(currentpage) {
    let param = {
      patientId: this.patientDetails.PatientId,
      offset: currentpage,
      limit: "4"
    }
    this.patientService.GetFormattedPatientEducation(param).subscribe(results => {
      this.patientEducationList = results.Results
      this.totalRecords = results.TotalItems
      this.rows = results.PageSize
    })
  }

  refreshData() {
    this.onSomething.emit();
    let currentpage = 0;
    this.getPatientEducation(currentpage)
  }
  paginate(event) {
    let currentpage = event.first / event.rows;
    this.getPatientEducation(currentpage);
  }

  openDoc(rowData) {
  let contentType = 'application/pdf';
  var sliceSize = 512;
  var byteCharacters = window.atob(rowData.MrPatientEducationResource.File); //method which converts base64 to binary
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
  var blob = new Blob(byteArrays, {
    type: contentType
  });
  var blobURL = URL.createObjectURL(blob);
  window.open(blobURL);
  }
}
