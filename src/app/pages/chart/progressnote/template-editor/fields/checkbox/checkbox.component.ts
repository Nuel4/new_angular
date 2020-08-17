import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FieldConfig } from "../../field.interface";

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.group)
    console.log(this.field.value)
    let control
    this.field.options.forEach(opt => {
      control = this.fb.control([]);
      this.group.addControl(opt.MrFormFieldValueId, control);
      this.field.value.map(val => {
        // console.log(opt.MrFormFieldValueId === val.MrFormFieldValueId)
        if (opt.MrFormFieldValueId === val.MrFormFieldValueId) {
          // console.log(opt.MrFormFieldValueId + " - " + val.ValueOption)
          control = this.fb.control([val.ValueOption])
          // this.group.addControl(opt.MrFormFieldValueId, control);
          this.group.setControl(opt.MrFormFieldValueId, control);
        }
      })
    });
  }

  checkboxEvent(event) {
    console.log(event)
    const control = this.fb.control(event)
            this.group.setControl(this.field.name, control)
  }

}
