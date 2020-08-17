import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Chart } from 'chart.js'
import { AuthenticationStore } from '../../../../authentication';
import * as moment from 'moment'
import * as jsPDF from 'jspdf'
@Component({
  selector: 'app-blood-pressure-chart',
  templateUrl: './blood-pressure-chart.component.html',
  styleUrls: ['./blood-pressure-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class BloodPressureChartComponent implements OnInit {
  @Input() graphdata;
  @Input() graphtype;
  LineChart: any;
  value = [];
  fillBetweenLinesPlugin: any;
  xValue: any;
  data1 = [];
  data2 = [];
  xTicks: any;
  showTooltip: any;
  constructor(private authStore: AuthenticationStore) {

  }
  ngOnInit() {
    this.showTooltip = {
      // Chart.pluginService.register({ 
      beforeRender: function (chart) {
        if (chart.config.options.showAllTooltips) {
          // create an array of tooltips
          // we can't use the chart tooltip because there is only one tooltip per chart
          chart.pluginTooltips = [];
          chart.config.data.datasets.forEach(function (dataset, i) {
            chart.config.options.tooltips.onlyShowForDatasetIndex.forEach((data) => {
              if (data === i) {
                chart.getDatasetMeta(data).data.forEach(function (sector, j) {
                  chart.pluginTooltips.push(new Chart.Tooltip({
                    _chart: chart.chart,
                    _chartInstance: chart,
                    _data: chart.data,
                    _options: chart.options.tooltips,
                    _active: [sector]
                  }, chart));
                });
              }
            })
          });
          // turn off normal tooltips
          chart.options.tooltips.enabled = false;
        }
      },
      afterDraw: function (chart, easing) {
        if (chart.config.options.showAllTooltips) {
          // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
          if (!chart.allTooltipsOnce) {
            if (easing !== 1)
              return;
            chart.allTooltipsOnce = true;
          }
          // turn on tooltips
          chart.options.tooltips.enabled = true;
          chart.options.tooltips.displayColors = false;
          Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
            tooltip.initialize();
            tooltip.update();
            // we don't actually need this since we are not animating tooltips
            tooltip.pivot();
            tooltip.transition(easing).draw();
          });
          chart.options.tooltips.enabled = false;
        }
      }
    }
    this.fillBetweenLinesPlugin = {
      afterDatasetsDraw: function (chart) {
        var ctx = chart.chart.ctx;
        var xaxis = chart.scales['x-axis-0'];
        var yaxis = chart.scales['y-axis-0'];
        var datasets = chart.data.datasets;
        ctx.save();
        for (var d = 0; d < datasets.length; d++) {
          var dataset = datasets[d];
          if (dataset.fillBetweenSet == undefined) {
            continue;
          }
          // get meta for both data sets
          var meta1 = chart.getDatasetMeta(d);
          var meta2 = chart.getDatasetMeta(dataset.fillBetweenSet);
          // do not draw fill if one of the datasets is hidden
          if (meta1.hidden || meta2.hidden) continue;
          // create fill areas in pairs
          for (var p = 0; p < meta1.data.length - 1; p++) {
            // if null skip
            if (dataset.data[p] == null || dataset.data[p + 1] == null) continue;
            ctx.beginPath();
            // trace line 1
            var curr = meta1.data[p];
            var next = meta1.data[p + 1];
            ctx.moveTo(curr._view.x, curr._view.y);
            ctx.lineTo(curr._view.x, curr._view.y);
            if (curr._view.steppedLine === true) {
              ctx.lineTo(next._view.x, curr._view.y);
              ctx.lineTo(next._view.x, next._view.y);
            }
            else if (next._view.tension === 0) {
              ctx.lineTo(next._view.x, next._view.y);
            }
            else {
              ctx.bezierCurveTo(
                curr._view.controlPointNextX,
                curr._view.controlPointNextY,
                next._view.controlPointPreviousX,
                next._view.controlPointPreviousY,
                next._view.x,
                next._view.y
              );
            }
            // connect dataset1 to dataset2
            var curr = meta2.data[p + 1];
            var next = meta2.data[p];
            ctx.lineTo(curr._view.x, curr._view.y);
            // trace BACKWORDS set2 to complete the box
            if (curr._view.steppedLine === true) {
              ctx.lineTo(curr._view.x, next._view.y);
              ctx.lineTo(next._view.x, next._view.y);
            }
            else if (next._view.tension === 0) {
              ctx.lineTo(next._view.x, next._view.y);
            }
            else {
              // reverse bezier
              ctx.bezierCurveTo(
                curr._view.controlPointPreviousX,
                curr._view.controlPointPreviousY,
                next._view.controlPointNextX,
                next._view.controlPointNextY,
                next._view.x,
                next._view.y
              );
            }
            // close the loop and fill with shading
            ctx.closePath();
            ctx.fillStyle = dataset.fillBetweenColor || "rgba(0,0,0,0.1)";
            ctx.fill();
          } // end for p loop
        }
      } // end afterDatasetsDraw
    }; // end fillBetweenLinesPlugin
  }
  ngOnChanges() {
    this.data1 = [];
    this.data2 = [];
    this.value = [];
    this.xTicks = {
      // suggestedMin: 50,
      // suggestedMax: 100,
      max: 36,
      min: 0,
      stepSize: 12
    }
    if(this.graphdata){
    this.graphdata.forEach(element => {
      if (element.BpSystolic) {
        var diff = (new Date(element.DateCreated).getTime() - new Date(this.authStore.PatientDetail.DateOfBirth).getTime()) / 1000;
        diff = diff / (60 * 60 * 24 * 7 * 4);
        diff = Math.round(diff * 10) / 10;
        this.xValue = new Date(element.DateCreated);
        let axis1 = {
          x: this.xValue,
          y: element.BpSystolic
        }
        let axis2 = {
          x: this.xValue,
          y: element.BpDiastolic
        }
        this.data1.push(axis1)
        this.data2.push(axis2)
      }

    });
    let data1 = {
      label: "Systolic",
      borderColor: "#DF3939",
      backgroundColor: "#DF3939",
      fill: false,
      data: this.data1,
      yAxisID: 'y-axis-1',
      xAxisID: 'x-axis-1',
      fillBetweenSet: 1,
      fillBetweenColor: "rgba(255,255,0,0.3)"
    }
    let data2 = {
      label: "Diastolic",
      borderColor: "#0A3682",
      backgroundColor: "#0A3682",
      fill: false,
      data: this.data2,
      yAxisID: 'y-axis-1',
      xAxisID: 'x-axis-1',
      fillBetweenSet: 1,
      fillBetweenColor: "rgba(5,5,255, 0.2)"
    }
    this.value.push(data1);
    this.value.push(data2);
    this.LineChart = new Chart('bloodPressure', {
      plugins: [this.fillBetweenLinesPlugin],
      type: 'line',
      data: {
        datasets: this.value
      },
      options: {
        showAllTooltips: true,
        tooltips: {
          custom: function (tooltip) {
            if (!tooltip) return;
            tooltip.displayColors = false;
          },
          callbacks: {
            title: function (tooltipItems, data) {
              return '';
            },
            label: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label
              var data = tooltipItem.yLabel;
              data = Math.round(data * 10) / 10;
              return data;
            }
          },
          mode: 'point',
          intersect: false
        },
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
          display: true,
          text: 'Blood pressure chart'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Years'
            },
            display: true,
            id: 'x-axis-1',
            type: "time",
            time: {
              unit: "week",

              displayFormats: {
                week: "ll"
              }
            },
            position: "bottom"
            // grid line settings
            //  gridLines: {
            //   drawOnChartArea: true, // only want the grid lines for one axis to show up
            // },
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'SYSTOLIC/DIASTOLIC(mm Hg)'
            },
            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
            display: true,
            position: 'left',
            id: 'y-axis-1',
            ticks: {
            },
          },
          ],
        }
      }
    })
  }
}

  saveChart(chartName) {
    var canvas = <HTMLCanvasElement>document.getElementById(chartName);
    var dataUrl = canvas.toDataURL(); //attempt to save base64 string to server using this var  
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Blood Pressure Chart</title></head>';
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
