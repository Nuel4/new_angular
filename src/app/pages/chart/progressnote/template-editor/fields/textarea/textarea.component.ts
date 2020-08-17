import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TextareaComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.group)

    // alert(this.field.value)
    const control = this.fb.control(
      this.field.value)

    this.group.addControl(this.field.name, control);

  }

}
