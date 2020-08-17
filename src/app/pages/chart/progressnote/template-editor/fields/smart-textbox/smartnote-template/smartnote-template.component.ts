import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Output } from '@angular/core';
import { ProgressnoteService } from './../../../../../../../services/chart/progressnote.service';

@Component({
  selector: 'app-smartnote-template',
  templateUrl: './smartnote-template.component.html',
  styleUrls: ['./smartnote-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SmartnoteTemplateComponent implements OnInit {
  @Output() GetSmartNote: EventEmitter<any> = new EventEmitter();
  SMCategoryList: any;
  selectedCategory: any;
  SMTemplateList: any
  selectedTemplate: any
  constructor(
    private activeModal: NgbActiveModal,
    private progressService: ProgressnoteService,
  ) { }

  ngOnInit() {
    this.LoadSmartNoteCategory()
  }

  LoadSmartNoteCategory() {
    this.progressService.GetSmartNoteCategory().subscribe(resp => {
      console.log(resp)
      this.SMCategoryList = resp
      this.selectedCategory = this.SMCategoryList[0]
      this.LoadSmartNotetemplateByCategoryId(this.SMCategoryList[0])
    })
  }

  LoadSmartNotetemplateByCategoryId(CategoryId) {
    this.progressService.GetSmartNoteTemplateByCategoryId({ smartnotetemplatecategoryId: CategoryId.SmartNoteTemplateCategoryId }).subscribe(resp => {
      console.log(resp)
      this.SMTemplateList = resp
    })
  }

  onOkay() {
    if (this.selectedTemplate)
      this.GetSmartNote.emit({ data: this.selectedTemplate })
    this.activeModal.close('closing')
  }


}
