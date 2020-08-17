import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GraphsService } from '../../../../services/chart/graphs.service';
import * as jsPDF from 'jspdf'

@Component({
  selector: 'app-lab-results-chart',
  templateUrl: './lab-results-chart.component.html',
  styleUrls: ['./lab-results-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LabResultsChartComponent implements OnInit {
 ngOnInit(){

 }
 saveChart(chartName) {
  var canvas = <HTMLCanvasElement>document.getElementById(chartName);
  var dataUrl = canvas.toDataURL(); //attempt to save base64 string to server using this var  
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Lab Results Chart</title></head>';
    windowContent += '<body>'
    windowContent += '<img src="' + dataUrl + '" alt="No data">';
    windowContent += '</body>';
    windowContent += '</html>';
    var printWin = window.open();
    printWin.document.write(windowContent);
    setTimeout(()=>{
      printWin.print();
    printWin.close();},50)
}
}
