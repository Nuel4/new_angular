import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { FieldConfig, Validator } from "../../field.interface";
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Input() group: FormGroup;
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    console.log('this.fields',this.fields)
    this.form = this.createControl();
  }

  createControl() {
    let group 
    if (this.group)
      group = this.group
    else
      group = this.fb.group({});
      
    this.fields.forEach(field => {
      const control = this.fb.control(
        field.value, this.bindValidations(field.validations)
      );
      console.log('field.name',field)
      group.addControl(field.name, control);
    });
    return group;
  }

  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }

  get value() {
    return this.form.value;
  }
}
