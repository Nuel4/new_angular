import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-review-system',
  templateUrl: './review-system.component.html',
  styleUrls: ['./review-system.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewSystemComponent implements OnInit {
  cities2: { name: string; code: string; }[];

  constructor() {
    this.cities2 = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
   }

  ngOnInit() {
  }

}
