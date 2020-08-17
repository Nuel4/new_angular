import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
import * as moment from "moment";
@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.group)
    console.log(this.field.value)
    const control = this.field.value.length === 0 ? this.fb.control('') : this.fb.control(new Date(this.field.value))

    this.group.addControl(this.field.name, control);
  }
}
