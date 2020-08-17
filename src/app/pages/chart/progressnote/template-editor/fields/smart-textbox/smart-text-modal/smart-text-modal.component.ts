import { Component, OnInit, ViewEncapsulation, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
@Component({
  selector: 'app-smart-text-modal',
  templateUrl: './smart-text-modal.component.html',
  styleUrls: ['./smart-text-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SmartTextModalComponent implements OnInit {
  @Input() items
  @Input() color
  @Output() selectedItems: EventEmitter<any> = new EventEmitter();
  constructor(public modal: NgbActiveModal) { }

  ngOnInit() {
    console.log("this.values", this.items)
    console.log('this.color :', this.color);
    document.getElementsByClassName('items')[0].innerHTML = ""
    this.items.forEach((item, index) => {
      // if(this.color === "#0000F0")
      var text = item.SmartNoteTemplateItemValueText
      text = text.split('<P>')
      console.log('text.split(<span>) :', text);
      text = text[1].split('</P>')
      console.log('text[0].split(</span>) :', text);
      if (!(text[0].indexOf('</a>') === -1)) {
        text[0] = text[0].replace(new RegExp('&nbsp;"', 'g'), " ")
          .replace(new RegExp('&lt;&lt;', 'g'), '&lt;&lt;&nbsp;')
        console.log("all text", text[0])
      }
      if(this.color === 'green'){
      document.getElementsByClassName('items')[0].innerHTML += `<li style="list-style: none; display: inline-flex;"><input id="checked" #myInput class="checkBox" value='${text[0]}' type="checkbox" name="checkBox"/> ${text[0]}</li><br/>`
      document.getElementsByClassName('items')[0].innerHTML += '</ul>'
    }
    if(this.color === 'red'){
      document.getElementsByClassName('items')[0].innerHTML += `<li style="list-style: none; display: inline-flex;"><input id="radio" #myInput class="radioButton" value='${text[0]}' type="radio" name="radioButton"/> ${text[0]}</li><br/>`
      document.getElementsByClassName('items')[0].innerHTML += '</ul>' 
    }
    })

  }
  loadChecked() {
    let actualText = " ";
    var input = document.getElementById('container').getElementsByTagName('input')
    console.log('input :', input);
    for (var i = 0; i < input.length; i++) {
      // console.log("input[i].checked", input[i].checked);
      console.log('input[i] :', input[i]);
      // console.log(' input[i].name:', input[i].name);
      if (input[i]) {
        console.log('input[i] :', input[i]);
        if (input[i].checked) {
          console.log("Actual text", actualText)
          console.log(' input[i].name:', input[i].value);
          actualText = actualText + input[i].value
          console.log("Actual text", actualText)
        }
      }
    }
    this.selectedItems.emit(actualText)
    console.log("actualText", actualText);
    document.getElementsByClassName('items')[0].innerHTML = "";
    this.modal.close();
  }
}
