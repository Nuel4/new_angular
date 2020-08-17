import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { PowerBIReportsService } from '../../../services/reports/power-bi-reports.service';
import * as pbi from 'powerbi-client';
import { AuthenticationStore } from '../../../authentication/authentication-store';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http'


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentsComponent implements OnInit {
  public screenHeight: number;
  @ViewChild('reportContainer') reportContainer: ElementRef;
  report: any = [];
  reportDefinition: any = [];
  selectedReport: any;
  access_token: string;
  reportCate: any;
  reportName: any = [];
  reportShow: boolean = false;
  selectedValue: any = {};
  filterName: any = {};
  url: string;
  group: any;
  constructor(private powerbiServices: PowerBIReportsService, public authStore: AuthenticationStore, private _http: HttpClient) { }

  ngOnInit() {
    this.screenHeight = (window.screen.height);
    this.getAuthenthicateAsync();
    this.reportCategories()
  }
  getAuthenthicateAsync() {
    this.powerbiServices.getAuthenticateAsync().subscribe(res => {
      if (res.access_token !== null) {
        this.authStore.AuthenticateAsync = res.access_token;
        this.access_token = res.access_token;
        sessionStorage.setItem('AuthenticateAsync', res.access_token);
        this.getAllReports()
      }
    })
  }
  getAllReports() {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.access_token
    }
    this.url = "https://api.powerbi.com/v1.0/myorg/groups"
    this._http.get(this.url, {
      headers: headers
    }).subscribe((resp: any) => {
      this.filterName = resp.value.filter(item => item.name == "Yeats")
      this._http.get(this.url + '/' + this.filterName[0].id + '/reports', {
        headers: headers
      }).subscribe((response: any) => {
        this.report = response.value;
        this.reportDefinitions()
      }, error => {
        console.log("error", error)

      })
      this.group = resp.value;
    }, error => {
      console.log("error", error)

    })
  }
  showReports(event) {
    this.report.forEach(item => {
      if (event.ReportName === item.name) {
        let url = this.url + this.filterName[0].id + '/datasets/' + item.datasetId + '/Default.SetAllConnections';
        let payload = {
          url: url
        }
        this.powerbiServices.getMultiTenancy(payload).subscribe(res => {
          let embedUrl = item.embedUrl
          let embedReportId = item.id
          let config = {
            type: 'report',
            accessToken: this.access_token,
            embedUrl: embedUrl,
            id: embedReportId,
          };
          let reportContainer = this.reportContainer.nativeElement;
          let powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
          powerbi.reset(reportContainer);
          let report: any = powerbi.embed(reportContainer, config);
          report.off("loaded");
          report.on("loaded", () => {
          });
          report.on("error", () => {
            this.getAuthenthicateAsync();
          });
        })
      }
    })
  }
  reportDefinitions() {
    this.powerbiServices.getReportDefinitions().subscribe(res => {
      this.reportDefinition = res;
      this.reportDefinition.forEach(item => {
        this.report.forEach(ele => {
          if (item.ReportName === ele.name) {

          }
        })
      })
    })
  }
  reportCategories() {
    this.powerbiServices.getReportCategories().subscribe(res => {
      this.reportCate = res;
    })
  }
  categoryNameSelection(item) {
    this.reportShow = true;
    this.reportName = []
    item.ReportDefinitions.forEach(item => {
      this.reportName.push(item);
    })
  }
}
