import { Component, OnInit, ViewEncapsulation, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-sub-section',
  templateUrl: './sub-section.component.html',
  styleUrls: ['./sub-section.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubSectionComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @Input() PEValueObj: any;
  field: FieldConfig;
  group: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.field.collections.forEach((item)=>{
      const control = this.fb.control(item.collections)
      this.group.addControl(item.name, control);
    })            
  }

  get value() {
    return this.form.value;
  }

}
