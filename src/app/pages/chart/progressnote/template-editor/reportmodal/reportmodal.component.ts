import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { AllChartService } from '../../../../../../app/services/chart/all-chart.service';
import * as pbi from 'powerbi-client';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProgressnoteService } from '../../../../../../app/services/chart/progressnote.service';

@Component({
  selector: 'app-reportmodal',
  templateUrl: './reportmodal.component.html',
  styleUrls: ['./reportmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportmodalComponent implements OnInit {
  public screenHeight:number;  
  @ViewChild('reportContainer') reportContainer: ElementRef;
  @Input() deleteModal: boolean;
  @Input() audit: boolean;
  @Input() rowData: any;
  @Input() header: any;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  constructor(private allChartService: AllChartService,
    public activeModal: NgbActiveModal,
    private progressService: ProgressnoteService,) { }

  ngOnInit() {
    if(this.audit) {
    this.screenHeight = (window.screen.height);
    this.getToken(); 
    }
  }

  getToken() {
    this.allChartService.getPowerBIToken().subscribe((res) => {
      this.showReport(res);
    })
  }

  showReport(data) {
    let embedUrl = 'https://app.powerbi.com/view?r=eyJrIjoiN2JlMzY4OTUtZDRmNS00ZmU5LWFhMWMtM2MwMGQ3NzRlNGYwIiwidCI6ImVhNWNlMTk0LWZjY2EtNGJmYy1hZmM1LTk5MGExMGRlNGFkOSIsImMiOjF9';
    let embedReportId = '0a63fb99-26f1-43a5-a38e-ad49923da754';  
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

deleteProgressNote() {
  let payload = {
    status: false,
    encounterId: this.rowData.mr_patient_encounter_id
  }
   this.progressService.deleteNote(payload).subscribe((item)=>{
    this.loadEvent.emit(true);
    this.activeModal.dismiss('Cross click');
   })
}
reportPrint:any;
print() {
let reportContainer = document.getElementById('reportContainer');
let powerbi = new pbi.service.Service(pbi.factories.hpmFactory,pbi.factories.wpmpFactory,pbi.factories.routerFactory);
this.reportPrint = powerbi.get(reportContainer);
this.reportPrint.print().catch(error => {  
    console.log(error);
});
}
}
