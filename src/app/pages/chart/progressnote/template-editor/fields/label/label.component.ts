import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../../field.interface";
@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LabelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
