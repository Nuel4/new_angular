import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import * as pbi from 'powerbi-client';
import { AllChartService } from '../../../../app/services/chart/all-chart.service';
import { Permissions } from 'powerbi-models';
import { HttpClient } from '@angular/common/http';
import { HttpWrapperService } from '../../../../app/core';

interface IEmbedConfigurationBase  {}
@Component({
  selector: 'app-all-chart-pt',
  templateUrl: './all-chart-pt.component.html',
  styleUrls: ['./all-chart-pt.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllChartPtComponent implements OnInit {
  public screenHeight:number;  
  @ViewChild('reportContainer') reportContainer: ElementRef;
  POWERBI:any = {}
  constructor(private allChartService: AllChartService,
    private _httpwrapper: HttpWrapperService) { 
   
  }

  ngOnInit() {
    this.screenHeight = (window.screen.height);
    this.getToken()
  }

  getToken() {
    this.allChartService.getPowerBIToken().subscribe((res) => {
      this.showReport(res);
    })
  }

  showReport(data) {
    let embedUrl = 'https://app.powerbi.com/view?r=eyJrIjoiZTFiNTg2MTYtNDc5NC00MGMzLWE5MGUtY2Y4NTJhNTc1NjI0IiwidCI6ImVhNWNlMTk0LWZjY2EtNGJmYy1hZmM1LTk5MGExMGRlNGFkOSIsImMiOjF9';
    let embedReportId = '5701901b-b573-4745-ab1b-e370072f48e5';  
    let config = {  
        type: 'report', 
        accessToken: data.access_token,  
        embedUrl: embedUrl,  
        id: embedReportId,  
    };  
    let reportContainer = this.reportContainer.nativeElement;  
    let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);  
    let report: any = powerbi.embed(reportContainer, config);  
    report.off("loaded"); 
    report.on("loaded", () => { 
    });  
    report.on("error", () => {  
        this.getToken();  
    });  
}

}
