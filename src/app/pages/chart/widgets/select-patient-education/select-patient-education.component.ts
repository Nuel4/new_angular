import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressnoteService } from './../../../../services/chart/progressnote.service';
import { ViewPrevousResComponent } from './view-prevous-res/view-prevous-res.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';

@Component({
  selector: 'app-select-patient-education',
  templateUrl: './select-patient-education.component.html',
  styleUrls: ['./select-patient-education.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectPatientEducationComponent implements OnInit {
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  language: any = [];
  modalRef: any;
  patientEducationList: any;
  procdures: any = '';
  labtest: any = '';
  medications: any = '';
  relatedproduct: any = '';
  medical: any = '';
  selectedLanguage: any = { label: 'English', value: 'english' };
  topic: any = '';
  constructor(
    private modalService: NgbModal,
    private progressNoteService: ProgressnoteService,
    private fb: FormBuilder
  ) {
    this.language = [
      { label: 'English', value: 'english' },
      { label: 'Spanish', value: 'spanish' }
    ]
  }

  ngOnInit() {
    if(this.PEValueObj){
      this.PEValueObj[0] = {
        language: this.selectedLanguage.label,
        medical: '',
        medications: '',
        labtest: '',
        procdures: '',
        topic: '',
        relatedproduct: '',
      }
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
  }

  onFormDataChange() {
    this.PEValueObj[0] = {
      language: this.selectedLanguage.label,
      medical: this.medical,
      medications: this.medications,
      labtest: this.labtest,
      procdures: this.procdures,
      topic: this.topic,
      relatedproduct: this.relatedproduct,
    }
  }

  SearchPatientEducationResources() {
    let param = {
      medicalConditions: this.medical,
      procedures: this.procdures,
      labTests: this.labtest,
      medications: this.medications,
      relatedProducts: this.relatedproduct
    }
    this.progressNoteService.SearchPatientEducationResources(param).subscribe(resp => {
      this.patientEducationList = resp
      console.log(resp)
    })
  }

  openPrevious() {
    this.modalRef = this.modalService.open(ViewPrevousResComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
  }

}
