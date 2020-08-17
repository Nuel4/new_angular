import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { GraphsService } from '../../../services/chart/graphs.service'
import * as moment from 'moment'
@Component({
  selector: 'app-vital-widget',
  templateUrl: './vital-widget.component.html',
  styleUrls: ['./vital-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VitalWidgetComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  widgetData: any;
  toChart: boolean;
  cols: any = [];
  patientDetails: any;
  totalRecords: any;
  vitalsList: any = [];
  rows: any;
  constructor(private graphService: GraphsService) { }

  ngOnInit() {
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    this.cols = [
      { field: 'DateLastUpdated', header: 'Date' },
      { field: 'Weight', header: 'Weight' },
      { field: 'WeightSubUomUnit', header: 'Weight Sub' },
      { field: 'WeightUomUnit', header: 'Unit' },
      { field: 'Height', header: 'Height' },
      { field: 'HeightSubUomUnit', header: 'Height Sub' },
      { field: 'HeightUomUnit', header: 'Unit' },
      { field: 'HeadCircumference', header: 'Head Circumference' },
      { field: 'HeadCircumferenceUnit', header: 'Unit' },
      { field: 'Bmi', header: 'BMI' },
      { field: 'HeartRate', header: 'Heart Rate' },
      { field: 'BpSystolic', header: 'BP-Sys' },
      { field: 'BpDiastolic', header: 'BP-Dia' },
      { field: 'Temperature', header: 'Temparature' },
      { field: 'TemperatureMethod', header: 'Method' },
      { field: 'RespirationRate', header: 'Respiration Rate' }
    ];
    this.patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
    this.getVitalsList();
  }
  paginate(event) {
    let currentpage = event.first / event.rows;
    this.getVitalsList(currentpage);
  }
  refreshData() {
    this.onSomething.emit();
    let page = 0;
    this.getVitalsList(page)
  }

  getVitalsList(currentpage?) {
    let param = {
      patientid: this.patientDetails.PatientId,
      offset: currentpage ? currentpage : 0,
      limit: "3"
    }
    this.graphService.getMrVitalsHeightWeightPaged(param).subscribe(results => {
      this.totalRecords = results.TotalItems
      results.Results.forEach((item) => {
        item.DateLastUpdated = moment(new Date(item.DateLastUpdated)).format("MM/DD/YYYY")
        switch (item.HeadCircumferenceUnit) {
          case 19:
            item.HeadCircumferenceUnit = 'centimeter(cm)';
            break;
          case 16:
            item.HeadCircumferenceUnit = 'Inches(in)'
            break;
          default:
            item.HeadCircumferenceUnit = '';
            break;
        }
      });
      this.rows = results.PageSize
      this.vitalsList = results.Results
    });
  }
}
