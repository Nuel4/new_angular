import { Component, ViewEncapsulation } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Editor } from 'primeng/primeng';
import { PatientsSummaryService } from '../../../services/patientSummary.service'
// import * as $ from 'jquery';
declare var $: any
// import * as moment from 'moment'
// import * as $ from "jquery"
import * as jQuerys from "jquery"
(window as any).$ = jQuerys.noConflict()


import Quill from 'quill';

var Link = Quill.import('formats/link');
class MyLink extends Link {
  static create(value) {
    let pr: PatientsSummaryService
    let obj: EditorComponent = new EditorComponent(pr)
    let node = super.create(value);
    // value = this.sanitize(value);
    // alert(value) 
    //modified
    node.setAttribute('href', "#");
    node.style.cursor = 'pointer'
    node.addEventListener('click', function (event) {
      obj.linkCall(value)
    });
    node.removeAttribute('target');
    return node;
  }
}
Quill.register(MyLink);

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent {
  @ViewChild(Editor) editorComponent: Editor;
  public ckeditorContent: string;
  public config: any;
  document: string;
  toolbarOptions: any
  // DWObject: WebTwain;
  module: any
  quill: any;
  htmlText: any = `<div><p class="Normal p_E2968D9D"><span class="s_E2968D9D">Patient Called the office and&nbsp; </span><!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="1" Width="130" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
  <HyperlinkButton CommandParameter="189:HyperLink:1:&lt;&lt;spoke to&gt;&gt;" Content="&lt;&lt;spoke to&gt;&gt;" FontSize="16" Height="20" Tag="189:HyperLink:1:&lt;&lt;spoke to&gt;&gt;" Width="130" Canvas.Left="239.607971191406" Canvas.Top="2">
    <HyperlinkButton.Foreground>
      <SolidColorBrush Color="#FF0000FF" />
    </HyperlinkButton.Foreground>
  </HyperlinkButton>
</telerik:InlineUIContainer>--><!--{/InlineUIContainer}--><span class="s_E2968D9D"> left message on voice page and the message was taken by spoke to </span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">Emy</span><span class="s_E2968D9D">, regarding</span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">The appointment was canceled due to </span><!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="2" Width="170" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
  <HyperlinkButton CommandParameter="193:CheckBoxList:2:&lt;&lt;CancelReason&gt;&gt;" Content="&lt;&lt;CancelReason&gt;&gt;" FontSize="16" Height="20" Tag="193:CheckBoxList:1:&lt;&lt;CancelReason&gt;&gt;" Width="170" Canvas.Left="313.373321533203" Canvas.Top="109.000732421875">
    <HyperlinkButton.Foreground>
      <SolidColorBrush Color="#FF0000FF" />
    </HyperlinkButton.Foreground>
  </HyperlinkButton>
</telerik:InlineUIContainer>--><!--{/InlineUIContainer}--><span class="s_E2968D9D"></span></p><p class="Normal p_E2968D9D"><!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="3" Width="200" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
  <HyperlinkButton CommandParameter="203:HyperLink:3:&lt;&lt;Call complaints&gt;&gt;" Content="&lt;&lt;Call complaints&gt;&gt;" FontSize="16" Height="20" Tag="203:HyperLink:1:&lt;&lt;Call complaints&gt;&gt;" Width="200" Canvas.Left="2" Canvas.Top="147.277191162109">
    <HyperlinkButton.Foreground>
      <SolidColorBrush Color="#FF0000FF" />
    </HyperlinkButton.Foreground>
  </HyperlinkButton>
</telerik:InlineUIContainer>--><!--{/InlineUIContainer}--><span class="s_E2968D9D"></span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">Diagnostic and Lab Orders:</span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">Scheduling:</span></p><p class="Normal p_E2968D9D"><!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="4" Width="190" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
  <HyperlinkButton CommandParameter="204:HyperLink:4:&lt;&lt;Emergency room&gt;&gt;" Content="&lt;&lt;Emergency room&gt;&gt;" FontSize="16" Height="20" Tag="204:HyperLink:1:&lt;&lt;Emergency room&gt;&gt;" Width="190" Canvas.Left="2" Canvas.Top="351.087829589844">
    <HyperlinkButton.Foreground>
      <SolidColorBrush Color="#FF0000FF" />
    </HyperlinkButton.Foreground>
  </HyperlinkButton>
</telerik:InlineUIContainer>--><!--{/InlineUIContainer}--><span class="s_E2968D9D"></span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p><p class="Normal p_E2968D9D"><!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="5" Width="150" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
  <HyperlinkButton CommandParameter="222:HyperLink:5:&lt;&lt;*Follow-up&gt;&gt;" Content="&lt;&lt;*Follow-up&gt;&gt;" FontSize="16" Height="20" Tag="222:HyperLink:1:&lt;&lt;*Follow-up&gt;&gt;" Width="150" Canvas.Left="2" Canvas.Top="417.449951171875">
    <HyperlinkButton.Foreground>
      <SolidColorBrush Color="#FF0000FF" />
    </HyperlinkButton.Foreground>
  </HyperlinkButton>
</telerik:InlineUIContainer>--><!--{/InlineUIContainer}--><span class="s_E2968D9D"></span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p><p class="Normal p_E2968D9D"><!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="6" Width="340" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
  <HyperlinkButton CommandParameter="223:HyperLink:6:&lt;&lt;Phone Call Lab Result Details&gt;&gt;" Content="&lt;&lt;Phone Call Lab Result Details&gt;&gt;" FontSize="16" Height="20" Tag="223:HyperLink:1:&lt;&lt;Phone Call Lab Result Details&gt;&gt;" Width="340" Canvas.Left="2" Canvas.Top="483.812072753906">
    <HyperlinkButton.Foreground>
      <SolidColorBrush Color="#FF0000FF" />
    </HyperlinkButton.Foreground>
  </HyperlinkButton>
</telerik:InlineUIContainer>--><!--{/InlineUIContainer}--><span class="s_E2968D9D"></span></p><p class="Normal p_E2968D9D"><span class="s_E2968D9D">&nbsp;</span></p></div>`
  html2 = `<div><p class="Normal ">
  <!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="1" Width="150" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
    <HyperlinkButton CommandParameter="21:CheckBoxList:1:&lt;&lt;comma pick&gt;&gt;" Content="&lt;&lt;comma pick&gt;&gt;" FontSize="16" Height="20" Tag="21:CheckBoxList:1:&lt;&lt;comma pick&gt;&gt;" Width="150" Canvas.Left="95" Canvas.Top="95">
      <HyperlinkButton.Foreground>
        <SolidColorBrush Color="#FF008000" />
      </HyperlinkButton.Foreground>
    </HyperlinkButton>
  </telerik:InlineUIContainer>-->
  <!--{/InlineUIContainer}-->
  <!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="2" Width="160" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
    <HyperlinkButton CommandParameter="22:RadioButtonList:2:&lt;&lt;radio comma&gt;&gt;" Content="&lt;&lt;radio comma&gt;&gt;" FontSize="16" Height="20" Tag="22:RadioButtonList:2:&lt;&lt;radio comma&gt;&gt;" Width="160" Canvas.Left="245" Canvas.Top="95">
      <HyperlinkButton.Foreground>
        <SolidColorBrush Color="#FFFF0000" />
      </HyperlinkButton.Foreground>
    </HyperlinkButton>
  </telerik:InlineUIContainer>-->
  <!--{/InlineUIContainer}-->
  <!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="3" Width="190" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
    <HyperlinkButton CommandParameter="19:CheckBoxList:3:&lt;&lt;space picklist&gt;&gt;" Content="&lt;&lt;space picklist&gt;&gt;" FontSize="16" Height="20" Tag="19:CheckBoxList:3:&lt;&lt;space picklist&gt;&gt;" Width="190" Canvas.Left="405" Canvas.Top="95">
      <HyperlinkButton.Foreground>
        <SolidColorBrush Color="#FF008000" />
      </HyperlinkButton.Foreground>
    </HyperlinkButton>
  </telerik:InlineUIContainer>-->
  <!--{/InlineUIContainer}-->
  <!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="4" Width="210" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
    <HyperlinkButton CommandParameter="20:CheckBoxList:4:&lt;&lt;newline picklist&gt;&gt;" Content="&lt;&lt;newline picklist&gt;&gt;" FontSize="16" Height="20" Tag="20:CheckBoxList:4:&lt;&lt;newline picklist&gt;&gt;" Width="210" Canvas.Left="95" Canvas.Top="115">
      <HyperlinkButton.Foreground>
        <SolidColorBrush Color="#FF008000" />
      </HyperlinkButton.Foreground>
    </HyperlinkButton>
  </telerik:InlineUIContainer>-->
  <!--{/InlineUIContainer}-->
  <!--{InlineUIContainer}<telerik:InlineUIContainer xmlns="http://schemas.microsoft.com/client/2007" xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" Height="20" OriginalProperties="{x:Null}" RevisionInfo="{x:Null}" Style="{x:Null}" StyleName="" Tag="1" Width="140" xmlns:telerik="http://schemas.telerik.com/2008/xaml/presentation">
    <HyperlinkButton CommandParameter="55:HyperLink:1:&lt;&lt;Testankur&gt;&gt;" Content="&lt;&lt;Testankur&gt;&gt;" FontSize="16" Height="20" Tag="55:HyperLink:1:&lt;&lt;Testankur&gt;&gt;" Width="140" Canvas.Left="305" Canvas.Top="115">
      <HyperlinkButton.Foreground>
        <SolidColorBrush Color="#FF0000FF" />
      </HyperlinkButton.Foreground>
    </HyperlinkButton>
  </telerik:InlineUIContainer>-->
  <!--{/InlineUIContainer}-->
</p></div>`
  quillConfig = {
    // toolbar: '.toolbar',
    toolbar: {
      container: [
        ['placeholder'],
        // ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        // ['code-block'],
        // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        // [{ 'direction': 'rtl' },{ 'direction': 'lt' }],                         // text direction

        // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        // [{ 'font': [] }],
        // [{ 'align': [] }],

        // ['clean'],                                         // remove formatting button

        // // ['link'],
        // ['link'], ['image'], ['video'] , 
        // ['emoji'], 
        // ['hello']
      ],
      handlers: { //'emoji': function() {},
        "placeholder": function () {
          console.log('selection 1', this.quill)
          let value = 'hello'
          if (value) {
            const cursorPosition = this.quill.getSelection().index;
            var span = document.createElement('span')
            span.style.color = "red"
            // this.quill.insertText(cursorPosition, `<span style="color:red" onclick="alert('hello')" >Hello</span>`);
            this.quill.insertText(cursorPosition, 'hello');
            // this.quill.setSelection(cursorPosition + value.length);
            // _this.testquill(this.quill);
          }
        }
      }
    },
  }
  editorInstance: any;
  patientDetails: any;
  EncounterList: any;
  newlink: any
  constructor(private patientsummaryService: PatientsSummaryService) {
    this.ckeditorContent = '<div>Hey we are testing CKEditor</div>';
    this.config = {
      uiColor: '#F0F3F4',
      height: '350',
      extraPlugins: 'divarea'
    };
  }



  RadToHtml = () => {
    // alert()
    this.htmlText = `<div>
    <p>
        <span>Patient Called the office and </span>
        <a href="189:HyperLink:1:&lt;&lt;spoke to&gt;&gt;" FontSize=" 16" Height="20"
            Tag="189:HyperLink:1:&lt;&lt;spoke to&gt;&gt;" Width="130" style="color:#FF0000FF">&lt;&lt;spoke
            to&gt;&gt;</a>
        <span> left message on voice page and the message
            was taken by spoke to </span>
    </p>
    <p> <span>Emy </span> <span>, regarding </span> </p> <br />
    <p> <span>The appointment was canceled due to </span> <a
            href="193:CheckBoxList:2:&lt;&lt;CancelReason&gt;&gt;"  FontSize=" 16" Height="20"
            Tag="193:CheckBoxList:1:&lt;&lt;CancelReason&gt;&gt;" Width="170"
            style="color:#FF008000">&lt;&lt;CancelReason&gt;&gt;</a> </p>
    <p> <a href="203:HyperLink:3:&lt;&lt;Call complaints&gt;&gt;" FontSize=" 16" Height="20"
            Tag="203:HyperLink:1:&lt;&lt;Call complaints&gt;&gt;" Width="200" style="color:#FF0000FF">&lt;&lt;Call
            complaints&gt;&gt;</a> </p> <br /> <br />
    <p> <span>Diagnostic and Lab Orders: </span> </p> <br />
    <p> <span>Scheduling: </span> </p>
    <p> <a href="204:HyperLink:4:&lt;&lt;Emergency room&gt;&gt;" FontSize=" 16" Height="20"
            Tag="204:HyperLink:1:&lt;&lt;Emergency room&gt;&gt;" Width="190"
            style="color:#FF0000FF">&lt;&lt;Emergency room&gt;&gt;</a> </p> <br />
    <p> <a href="222:HyperLink:5:&lt;&lt;*Follow-up&gt;&gt;" FontSize=" 16" Height="20"
            Tag="222:HyperLink:1:&lt;&lt;*Follow-up&gt;&gt;" Width="150"
            style="color:#FF0000FF">&lt;&lt;*Follow-up&gt;&gt;</a> </p> <br />
    <p> <a href="223:HyperLink:6:&lt;&lt;Phone Call Lab Result Details&gt;&gt;" FontSize=" 16" Height="20"
            Tag="223:HyperLink:1:&lt;&lt;Phone Call Lab Result Details&gt;&gt;" Width="340"
            style="color:#FF0000FF">&lt;&lt;Phone Call Lab Result Details&gt;&gt;</a>
    </p>
</div>`
    this.htmlText = this.htmlText
      .replace(new RegExp('<!--', 'g'), "")
      .replace(new RegExp('-->', 'g'), "")
      .replace(new RegExp('{InlineUIContainer}', 'g'), "")
      .replace(new RegExp('{/InlineUIContainer}', 'g'), "")
      .replace(new RegExp('&nbsp;', 'g'), "")
    let doc = new DOMParser().parseFromString(this.htmlText, "text/xml");
    // alert(doc.getElementsByTagName('telerik:InlineUIContainer')[0].innerHTML)
    let el = doc.getElementsByTagName('telerik:InlineUIContainer')
    for (let index = 0; index < el.length; index++) {
      console.log(el[index].innerHTML)
      var hy = el[index].getElementsByTagName('HyperlinkButton')[0]

      var x = document.createElement("a");
      var t = document.createTextNode(hy.getAttribute('Content'));
      x.setAttribute("href", hy.getAttribute('CommandParameter'));
      x.style.color = hy.getElementsByTagName('SolidColorBrush')[0].getAttribute('Color')
      x.appendChild(t);
      el[index].removeChild(hy)
      el[index].appendChild(x)
    }
    console.log(doc.getElementsByTagName('div')[0].innerHTML)
    this.htmlText = doc.getElementsByTagName('div')[0].innerHTML

  }

  public linkCall(val) {
    // alert(val)
    let arr = val.split(":")
    // alert(arr[2])
    document.getElementsByClassName('ql-tooltip')[0].innerHTML = `<input type='checkbox'>List1<br> <input type='checkbox'>List2<br> <input type='checkbox'>List3`
  }
  ngAfterViewInit() {
    this.RadToHtml()
    // this.quill = this.editorComponent.quill;
    // console.log("quill", this.quill)

    // this.quill.options.modules.toolbar = this.toolbarOptions
    // console.log("quill", this.quill)
  }

  testquill(quill) {
    quill.insertText(quill.getSelection().index, "hello world test");
  }

  ngOnInit(): void {
    console.log(Quill.registor);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button
      ['omega']
    ];
    this.module = {
      toolbar: this.toolbarOptions
    }
    this.document = "<div>Hello World!</div><div>PrimeNG <b>Editor</b> Rocks</div><div><br></div>"
    // this.quill.editor.addEventListener('click', (ev) => {
    // console.log(ev)
    // let image = Parchment.find(ev.target);

    // if (image instanceof ImageBlot) {
    //   this.quill.setSelection(image.offset(this.quill.scroll), 1, 'user');
    // }
    // })
  }
  clickEvent(event) {
    // this.editorInstance = event
    // $(".ql-editor").bind("keydown keypress mousemove", function() {
    //   alert("Current position: + $(this).caret().start);
    // });
    // console.log('position', $(".ql-editor").caretPosition())
    console.log('Editor instance', event)
    console.log('Editor instance', event.selectionStart)
    console.log('Editor instance', event.toElement)
    console.log('selection 5', this.quill.getSelection())

    // console.log('Editor instance', event, $('#test')) 
    // $('#test').popover('show'
    //  content: ''
    // )

    // console.log('popover after 2 seconds', $('[data-toggle="popover"]').popover());
    // $('[data-toggle="popover"]')[0].popover()
    // $('#test').fu_popover({content:'Hello World!'});
    // const NAME = 'popover';
    // console.log('Jquery inside angular ', NAME, $.fn[NAME], JSON.stringify($.fn))
    // this.getMrPatientEncounterByPatientId();
  }
  contentChanged(event) {
    console.log('COntent chnaged', event)
    // this.getMrPatientEncounterByPatientId(event);
    console.log('first', this.htmlText.slice(0, event.range.index))
    console.log('last', this.htmlText.slice(event.range.index, this.htmlText.length))
    // if(this.EncounterList){
    // }
  }

  editorCreated = (quill: any) => {
    this.quill = quill;
    console.log(this.quill)
  }
  getMrPatientEncounterByPatientId(event) {

    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      patientId: this.patientDetails.PatientId,
      offset: 0,
      limit: 10,

    }
    this.patientsummaryService.getPatientEncounterByPatientId(param).subscribe((results: any) => {
      // this.EncounterList = results;
      console.log("EncounterList are:", results)
      this.EncounterList = results.Results[0].chief_complaint;
      // this.htmlText = this.htmlText.slice(0, event.range.index) + this.EncounterList + this.htmlText.slice(event.range.index, this.htmlText.length)

    })
  }

  onChange(event: any) {
    setTimeout(() => {
      this.ckeditorContent = event;
    });
  }

  onReady(event: any) { }
  onFocus(event: any) {
    console.log("editor is focused");
  }
  onBlur(event: any) {
  }
}
