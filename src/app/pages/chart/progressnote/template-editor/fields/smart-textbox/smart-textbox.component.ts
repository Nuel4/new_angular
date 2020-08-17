import { Component, ViewEncapsulation, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Editor } from 'primeng/primeng';
// import * as $ from 'jquery';
declare var $: any
// import * as moment from 'moment'
// import * as $ from "jquery"
import * as jQuerys from "jquery"
(window as any).$ = jQuerys.noConflict()
import Quill from 'quill';
var Link = Quill.import('formats/link');
import { PatientsSummaryService } from './../../../../../../services/patientSummary.service';
import { style } from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../field.interface';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartnoteTemplateComponent } from './smartnote-template/smartnote-template.component';
import { HttpWrapperService } from '../../../../../../../app/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { InjectorInstance } from '../../../../../../../app/app.module';
import { ProgressnoteService } from '../../../../../../../app/services/chart/progressnote.service';
import { CKEditor4 } from 'ckeditor4-angular'
import { SmartTextModalComponent } from './smart-text-modal/smart-text-modal.component'
import { sm } from '@angular/core/src/render3';
import { ToastrService } from 'ngx-toastr';

declare const CKEDITOR;
interface Handler {

}

// class MyLink extends Link  {  
//   static create(value) {  
//     const httpClient =  InjectorInstance.get<HttpClient>(HttpClient);
//     let abc: any;
//     let obj: SmartTextboxComponent = new SmartTextboxComponent(new PatientsSummaryService(httpClient), new FormBuilder())
//     let node = Link.create(value);
//     // let sanVal = Link.sanitize(value);
//     console.log(value,'value') 
//     //modified
//     node.setAttribute('href', value);
//     node.style.cursor = 'pointer'
//     node.addEventListener('click', function (event) {
//       console.log(value,obj,event)
//       // obj.linkCall(value,obj,event)
//     });
//     node.removeAttribute('tag');
//     return node;
//   }
// }
// Quill.register(MyLink);

@Component({
  selector: 'app-smart-textbox',
  templateUrl: './smart-textbox.component.html',
  styleUrls: ['./smart-textbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SmartTextboxComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  quill: any;
  htmlText: any;
  editorInstance: any;
  patientDetails: any;
  EncounterList: any;
  newlink: any
  smartNote: any;
  arr: any = [];
  uniqueArray: any = [];
  index: number = 0;
  result: any = [];
  oldLink: any
  demoText = "<p>Bala</p>"
  @ViewChild('editor') editorWindow: ElementRef
  constructor(
    private patientsummaryService: PatientsSummaryService,
    private fb: FormBuilder,
    private modelService?: NgbModal,
    private progressService?: ProgressnoteService,
    private toaster?: ToastrService
  ) {
  }
  ngOnInit() {


  }

  ngAfterViewInit() {
    this.LoadSmartNoteCategory();
    this.getMrPatientEncounterByPatientId();
  }

  editorInitialize(fieldName, htmlText) {
    console.log("this.editorWindow.nativeElement", this.editorWindow.nativeElement);
    console.log("Get element ID", document.getElementById(fieldName));
    var toolbar = [
      { name: 'document', items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
      { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
      // { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
      // { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
      // '/',
      // { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
      // { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
      // { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
      // { name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
      // '/',
      // { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
      // { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
      // { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
      // { name: 'about', items: [ 'About' ] }
    ];
    var editor = CKEDITOR.replace(document.getElementById(fieldName),
      {
        toolbarGroups: [
          //   {
          //   "name": "basicstyles",
          //   "groups": ["basicstyles"]
          // },
          {
            "name": "links",
            "groups": ["links"]
          },
          // {
          //   "name": "paragraph",
          //   "groups": ["list", "blocks"]
          // },
          // {
          //   "name": "document",
          //   "groups": ["mode"]
          // },
          // // {
          // //   "name": "insert",
          // //   "groups": ["insert"]
          // // },
          // {
          //   "name": "styles",
          //   "groups": ["styles"]
          // },
          // {
          //   "name": "about",
          //   "groups": ["about"]
          // }
        ],
        removePlugins: 'elementspath',
        resize_enabled: false,
        width: 700,
        height: 310
      });
    CKEDITOR.instances[this.field.name].setData(htmlText)
    editor.on('contentDom', () => {
      var editable = editor.editable();
      editable.attachListener(editable, 'click', (evt) => {
        console.log("evt", evt)
        this.oldLink = evt.data.$.toElement
        if (evt.data.$.toElement.localName === "a") {
          var color = evt.data.$.toElement.attributes[2].value
          color = color.split(":")
          console.log("clolor", color, "exact", color[1])
          var a = evt.data.$.toElement.href
          a = a.split(":")
          a = a[0].replace("%3", "")
          this.linkCall(a, color[1])
          //  CKEDITOR.instances.editor1.openDialog('placeholderDialog');
        } else {
          // CKEDITOR.instances.editor1.openDialog('placeholderDialog'); 
          // CKEDITOR.instances.editor1.insertText('This is overall getting better with significantly less pain and stiffness compared to last evaluation.');
        }
      }, null, null, 15);
    });


  }

  openSmartLoadModel() {
    let modelref = this.modelService.open(SmartnoteTemplateComponent, { centered: true, size: 'lg' })
    modelref.componentInstance.GetSmartNote.subscribe((data) => {
      console.log("data", data)
      this.smartNote = data.data;
      console.log("data.data", data.data)
      let htmlText = window.atob(data.data.Document)
      htmlText = htmlText
        .replace(new RegExp('<!--', 'g'), "")
        .replace(new RegExp('-->', 'g'), "")
        .replace(new RegExp('{InlineUIContainer}', 'g'), "")
        .replace(new RegExp('{/InlineUIContainer}', 'g'), "")
        .replace(new RegExp('&nbsp;', 'g'), "")
        .replace(new RegExp('""', 'g'), '"')
        .replace(new RegExp('&lt;&lt;', 'g'), '&lt;&lt;&nbsp;')
      // .replace(new RegExp('Tag', 'g'), "title")
      console.log(htmlText, 'htmlText')
      const control = this.fb.control(
        htmlText)
      console.log(this.group)
      this.group.setControl(this.field.name, control)
      CKEDITOR.instances[this.field.name].setData(htmlText)


    })
  }

  LoadSmartNoteCategory() {
    console.log('this.index :', this.index);
    if (this.index === 0) {
      console.log("load")
      this.progressService.GetSmartNoteCategory().subscribe(resp => {
        console.log("resp[0]", resp[0])
        console.log("resp", resp)
        this.index++
        return this.LoadSmartNotetemplateByCategoryId(resp[0])
      })
    }

  }

  LoadSmartNotetemplateByCategoryId(Category) {
    // Category.forEach((item, index) => {
    this.progressService.GetSmartNoteTemplateByCategoryId({ smartnotetemplatecategoryId: Category.SmartNoteTemplateCategoryId }).subscribe(resp => {
      console.log("Response", this.index, "data", resp)
      let htmlText = window.atob(resp[0].Document);
      htmlText = htmlText
        .replace(new RegExp('<!--', 'g'), "")
        .replace(new RegExp('-->', 'g'), "")
        .replace(new RegExp('{InlineUIContainer}', 'g'), "")
        .replace(new RegExp('{/InlineUIContainer}', 'g'), "")
        .replace(new RegExp('&nbsp;', 'g'), "")
        .replace(new RegExp('""', 'g'), '"')
        .replace(new RegExp('&lt;&lt;', 'g'), '&lt;&lt;&nbsp;')
      console.log("HTML text", htmlText)
      const control = this.fb.control(
        htmlText)
      console.log(this.group)
      console.log('this.field.name :', this.field.name);
      // CKEDITOR.instances[this.field.name].setData(htmlText)
      this.group.setControl(this.field.name, control)
      this.editorInitialize(this.field.name, htmlText)
    })
    console.log("HTML all", this.htmlText)
    // })
  }


  linkCall(value, color) {
    // let templateId = value.split(':')   
    // console.log(document.getElementsByClassName('ql-tooltip')) 
    // document.getElementsByClassName('ql-tooltip')[0].innerHTML = `<p>Loading...</p>`;
    // this.smartNote = JSON.parse(sessionStorage.getItem('smartNote'));

    let param = { smartNoteTemplateItemId: value }
    this.patientsummaryService.getSmartValue(param).subscribe((res) => {
      console.log("smart value", res)
      // #0000F0 -blue
      // #FF0000FF - red
      // #228B22 - green
      if (res.length > 0) {
        if (color === 'green' || color === 'red') {
          this.result = res;
          let modRef = this.modelService.open(SmartTextModalComponent, { centered: true, size: 'sm', backdrop: 'static' })
          modRef.componentInstance.items = this.result
          modRef.componentInstance.color = color
          modRef.componentInstance.selectedItems.subscribe(value => {
            console.log("Emitted value", value)
            // CKEDITOR.instances.editor.insertText('abcd');
            // CKEDITOR.instances.editor.insertText("Hello world")
            this.oldLink.remove()
            CKEDITOR.instances[this.field.name].insertHtml(value)
            let text = CKEDITOR.instances[this.field.name].getData()
            console.log('this.htmlText :', text);
            const control = this.fb.control(text)
            this.group.setControl(this.field.name, control)
          })
        } else if (color === 'blue') {
          this.result.forEach(item => {
            CKEDITOR.instances[this.field.name].insertHtml(item.SmartNoteTemplateItemValueText)
          })
          this.oldLink.remove()
        }
        // }
      } else {
        this.showError('No data found')
      }
    })
  }

  onCheck(text, val, event) {
    this.arr.push(val)
    this.arr.forEach((item, i) => {
      if (this.uniqueArray.indexOf(this.arr[i]) === -1) {
        this.uniqueArray.push(item);
      }
    });
    console.log(this.uniqueArray);
  }

  onSaveChanges(text, event) {

    // sessionStorage.setItem('quillData',this.htmlText)
    const control = this.fb.control(this.htmlText)
    this.group.setControl(name, control)

  }

  getMrPatientEncounterByPatientId(event?) {
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let param = {
      patientId: this.patientDetails.PatientId,
      offset: 0,
      limit: 10,
    }
    this.patientsummaryService.getPatientEncounterByPatientId(param).subscribe((results: any) => {
      console.log("EncounterList are:", results)
      this.EncounterList = results.Results[0].chief_complaint;
    })
  }
  onChange(event: CKEditor4.EventInfo) {
    console.log("event.editor.getData()", event.editor.getData());
  }
  showSuccess(msg: string) {
    this.toaster.success(msg)
  }
  showError(msg: string) {
    this.toaster.error(msg)
  }
}