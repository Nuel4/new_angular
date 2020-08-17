import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LetterService } from '../../../../../app/services/chart/letter.service';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import { DomSanitizer } from '@angular/platform-browser';
import { container } from '@angular/core/src/render3/instructions';
import Quill from 'quill';
// var table = Quill.import('modules/table');
// Quill.register(table);


@Component({
  selector: 'app-letter-editor',
  templateUrl: './letter-editor.component.html',
  styleUrls: ['./letter-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LetterEditorComponent implements OnInit {
  @Input() rowData: any;
  @Input() newLetter: any;
  @Input() summary: any;
  @Input() header: any;
  @Input() docDetails: any;
  field: FieldConfig;
  group: FormGroup;
  quill: any;
  htmlText: any
  editorText: any = '';
  quillConfig: any;
  userDetails: any;
  constructor(private modal: NgbActiveModal,
    private letters: LetterService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,) { }

  ngOnInit() {  
    this.userDetails = JSON.parse(sessionStorage.getItem('UserDetail'))  
      if(this.rowData){
        this.getDocument();
      } else {
        this.htmlText = window.atob(this.newLetter.selectedTemplate.Document)
        // this.htmlText = `<html><head><div style="text-align:center"><h1>Mr. Doctor</h1>
        // <h2>6715 Little River Trnpk, Annandale, VA  22003</h2>
        // <h2>Phone : : Fax:</h2>
        // </div>
        // </head>
        // <body>
        // <div>
        // <p>Encounter Date: 1/1/0001  Patient Name:   Mr. Mouse Mickey  Patient DOB: 6/6/1999</p>
        // -<div id="editorData">
        // ${this.editorText}
        // </div>
        // </div>
        // <p>
        // Electronically Signed by Dr.MichaelDoctor<br>
        // Progress note Completed:   <br>
        // Time spent on consultation:<br>
        // </p>
        // </body>
        // </html>`
      }

      this.quillConfig = {
        table: true,
        // toolbar: '.toolbar', 
        // table: false,  // disable table module
          // 'better-table': {
          //   operationMenu: {
          //     items: {
          //       unmergeCells: {
          //         text: 'Another unmerge cells name'
          //       }
          //     }
          //   }
          // },   
        toolbar: {
          container: this.summary ? [] : [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
    
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
    
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
    
                ['clean']
          ],
          handlers: { //'emoji': function() {},
            "placeholder": function () {
              let value = 'hello'
              if (value) {
                const cursorPosition = this.quill.getSelection().index;
                var span = document.createElement('span')
                span.style.color = "red"
                // this.quill.insertText(cursorPosition, `<span style="color:red" onclick="alert('hello')" >Hello</span>`);
                this.quill.insertText(cursorPosition, 'link', { href: "javascript:alert('hello)" });
                // this.quill.setSelection(cursorPosition + value.length);
                // _this.testquill(this.quill);
              }
            }
          }
        },
        // autoLink: true,
    
        // mention: {
        //   allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
        //   mentionDenotationChars: ["@", "#"],
        //   source: (searchTerm, renderList, mentionChar) => {
        //     let values;
    
        //     if (mentionChar === "@") {
        //       values = this.atValues;
        //     } else {
        //       values = this.hashValues;
        //     }
    
        //     if (searchTerm.length === 0) {
        //       renderList(values, searchTerm);
        //     } else {
        //       const matches = [];
        //       for (var i = 0; i < values.length; i++)
        //         if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())) matches.push(values[i]);
        //       renderList(matches, searchTerm);
        //     }
        //   },
        // },
        // "emoji-toolbar": true,
        // "emoji-textarea": false,
        // "emoji-shortname": true,
        // keyboard: {
        //   bindings: {
        //     // shiftEnter: {
        //     //   key: 13,
        //     //   shiftKey: true,
        //     //   handler: (range, context) => {
        //     //     // Handle shift+enter
        //     //   }
        //     // },
        //     enter:{
        //       key:13,
        //       handler: (range, context)=>{
        //         return true;
        //       }
        //     }
        //   }
        // }
      }
  }
  documentDetails: any;
  getDocument() {
    let params = {referalLetterId: this.rowData.ReferralLetterId}
    this.letters.getDocument(params).subscribe((res)=>{
      this.documentDetails = res;
      this.htmlText = res.DocxNewYeats;
      let container = document.getElementById("editor");
      // container.innerHTML = this.htmlText
      var quillEditor = new Quill('#snow-container', {
        theme: 'snow',
        modules: {
          // table: true,
        }
      })
      const table = quillEditor.getModule('table');
      var delta = quillEditor.clipboard.convert(this.htmlText);
      quillEditor.updateContents(delta, 'silent');
    })
  }

  submit() {
      let payload = {
        "MrReferralLetterId": this.documentDetails ? this.documentDetails.MrReferralLetterId : 0,
        "PatientId": this.documentDetails ? this.documentDetails.PatientId : 0,
        "MrPatientEncounterId": this.documentDetails ? this.documentDetails.MrPatientEncounterId : 0,
        "Document": this.documentDetails ? this.documentDetails.Document : '',
        "DocxNewYeats": this.htmlText,
        "IncludeClinicalSummary": this.documentDetails ? this.documentDetails.IncludeClinicalSummary : true,
        "IncludeCompleteMedicalHistory": this.documentDetails ? this.documentDetails.IncludeCompleteMedicalHistory : true,
        "IncludeSummaryOfCareRecord": this.documentDetails ? this.documentDetails.IncludeSummaryOfCareRecord : true,
        "Printed": this.documentDetails ? this.documentDetails.Printed : true,
        "PrintedTimestamp": this.documentDetails ? this.documentDetails.PrintedTimestamp : new Date(),
        "DateCreated": this.documentDetails ? this.documentDetails.DateCreated : new Date(),
        "CreatedByUserId": this.documentDetails ? this.documentDetails.CreatedByUserId : 0,
        "DateLastUpdated": new Date(),
        "LastUpdatedByUserId": this.userDetails.UserId,
        "SavedMethodIdentifier": this.documentDetails ? this.documentDetails.SavedMethodIdentifier : 0,
        "FileName": this.documentDetails ? this.documentDetails.FileName : "",
        "IsInactive": this.documentDetails ? this.documentDetails.IsInactive : true,
        "LetterDate": this.newLetter ? this.newLetter.letterdate : this.documentDetails.LetterDate,
        "LetterTemplateId": this.documentDetails ? this.documentDetails.LetterTemplateId : 0,
        "LetterTemplateCategoryId": this.documentDetails ? this.documentDetails.LetterTemplateCategoryId : 0,
        "RelatedOrganisationId": this.documentDetails ? this.documentDetails.RelatedOrganisationId : 0,
        "ReferringPhysicianId": this.documentDetails ? this.documentDetails.ReferringPhysicianId : 0,
        "ProviderUserId": this.documentDetails ? this.documentDetails.ProviderUserId : 0,
        "Active": this.documentDetails ? this.documentDetails.Active : true,
      }
      if(this.rowData){
        this.letters.updateReferalLetters(payload).subscribe((res)=>{})
      } else {
        this.letters.AddReferalLetter(payload).subscribe((res)=>{})
      }
  }

  savePrint() {
    this.modal.dismiss()
    var win = window.open()
    win.document.body.innerHTML = this.htmlText;    
    win.print();
    win.close();
  }

}
