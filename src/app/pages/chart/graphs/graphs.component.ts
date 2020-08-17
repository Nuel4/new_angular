import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GraphsService } from '../../../services/chart/graphs.service'
import { AuthenticationStore } from '../../../authentication';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphsComponent implements OnInit {
  LineChart = [];
  barChart = [];
  data: any = [];
  data1: any = [];
  value: any = [];
  lineChartData: any;
  ticksY2 = [];
  ticksValue: any;
  header: MenuItem[];
  activeItem: MenuItem;
  graphData: any;
  labReports: any;
  graphType = "month"
  labReportsTab = false;
  constructor(private graphService: GraphsService, private authStore: AuthenticationStore) {
  }
  ngOnInit() {
    this.header = [
      { label: 'Patient Weight Chart' },
      { label: 'Patient Height Chart' },
      { label: 'Head Circumference' },
      { label: 'BMI Chart' },
    ];
    this.graphService.getVitalsHeightWeightForGraph(this.authStore.PatientDetail.PatientId).subscribe((result: any) => {
      this.graphData = result;
    })
    this.graphService.getLaborderItemsbyPatientId(this.authStore.PatientDetail.PatientId).subscribe((result: any) => {
      this.labReports = result
      console.log("labReports", this.labReports)
    })
  }
  tabChange(event){
// console.log(event.index);
if(event.index === 4){
  this.labReportsTab = true
} else {
  this.labReportsTab = false
}
  }
}
