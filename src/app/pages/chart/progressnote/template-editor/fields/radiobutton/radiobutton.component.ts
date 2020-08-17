import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RadiobuttonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.group)
    let control;
    this.field.options.forEach(opt => {
      control = this.fb.control(opt.value)
      this.group.addControl(opt.MrFormFieldId, control);
      this.field.value.map(val => {
        if (val.MrFormFieldId === opt.MrFormFieldId) {
          control = this.fb.control(val.ValueOption)
          this.group.setControl(opt.MrFormFieldId, control);
        }
      })
    });
  }

}
