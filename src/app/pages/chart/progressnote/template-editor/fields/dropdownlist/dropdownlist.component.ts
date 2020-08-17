import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: 'app-dropdownlist',
  templateUrl: './dropdownlist.component.html',
  styleUrls: ['./dropdownlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownlistComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.group)

    console.log(this.field)
    const control = this.fb.control(
      this.field.value.ValueOption)

    this.group.addControl(this.field.name, control);
  }
}
