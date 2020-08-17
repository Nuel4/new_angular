import { Component, OnInit, ViewEncapsulation , Input } from '@angular/core';

@Component({
  selector: 'app-error-field-display',
  templateUrl: './error-field-display.component.html',
  styleUrls: ['./error-field-display.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ErrorFieldDisplayComponent implements OnInit {
  @Input() errorMsg: string;
  @Input() displayError: boolean;
  constructor() { }

  ngOnInit() {
  }

}
