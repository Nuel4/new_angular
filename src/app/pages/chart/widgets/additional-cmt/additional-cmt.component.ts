import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';

@Component({
  selector: 'app-additional-cmt',
  templateUrl: './additional-cmt.component.html',
  styleUrls: ['./additional-cmt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdditionalCmtComponent implements OnInit {
@Input() PEValueObj: any;
group: FormGroup;
field: FieldConfig;
privateComment: any = [];
previousComments: any;
addcmt: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if(this.PEValueObj){
      this.PEValueObj[0] = {
        addcmt: '',
        privateComment: this.privateComment.length > 0 ? true : false,
        previousComments: ''
      }
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
  }
  onFormDataChange() {
    this.PEValueObj[0] = {
      addcmt: this.addcmt ? this.addcmt : '',
      privateComment: this.privateComment.length > 0 ? true : false,
      previousComments: this.previousComments ? this.previousComments : ''
    }
  }

}
