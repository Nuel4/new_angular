import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FindpatComponent } from '../../chart/findpat/findpat.component';

@Component({
  selector: 'app-v-charts',
  templateUrl: './v-charts.component.html',
  styleUrls: ['./v-charts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
