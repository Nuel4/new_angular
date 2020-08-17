import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, SimpleChanges, OnChanges, HostListener } from '@angular/core';
import { malevalues36, femalevalues36 } from '../percentile36';
import { femalevalues20, malevalues20 } from '../percentile20';
import { Chart } from 'chart.js'
import { AuthenticationStore } from '../../../../authentication';
import * as jsPDF from 'jspdf'
@Component({
  selector: 'app-patient-weight-chart',
  templateUrl: './patient-weight-chart.component.html',
  styleUrls: ['./patient-weight-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientWeightChartComponent implements OnInit, OnChanges {
  chartValue: any;
  @Input() graphdata;
  @Input() graphtype;
  LineChart = [];
  data: any = [];
  value: any = [];
  lineChartData: any;
  ticksY2 = [];
  ticksValue: any;
  xValue: any;
  xTicks: any;
  percentileData: any = [];
  LineChart1: any;
  LineChart2: any;
  plugin1: any;
  gender: string;
  axisPlugin: any;
  constructor(private authStore: AuthenticationStore) {

  }
  ngOnInit() {
    this.axisPlugin = {
      beforeInit: function (chart) {
        let value = []
        chart.data.datasets.forEach(element => {
          element.data.forEach(item => {
            value.push(item.y)
          });
        })
        chart.options.scales.yAxes[1].ticks.suggestedMin = Math.min.apply(this, value);
        chart.options.scales.yAxes[1].ticks.suggestedMax = Math.max.apply(this, value);
      }
    }
    this.plugin1 = {
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
  }

  ngOnChanges() {
    this.data = [];
    this.value = [];
    switch (this.graphtype) {
      case "month": {
        if (this.authStore.PatientDetail.Sex) {
          this.gender = 'Male'
          this.percentileData = malevalues36
        } else {
          this.gender = 'Female'
          this.percentileData = femalevalues36
        }
        this.xTicks = {
          // suggestedMin: 50,
          // suggestedMax: 100,
          max: 36,
          min: 0,
          stepSize: 12
        }
        break;
      };
      case "year": {
        if (this.authStore.PatientDetail.Sex) {
          this.gender = 'Male'
          this.percentileData = malevalues20
        } else {
          this.gender = 'Female'
          this.percentileData = femalevalues20
        }
        this.xTicks = {
          // suggestedMin: 50,
          // suggestedMax: 100,
          max: 20,
          min: 2,
          stepSize: 5
        }
        break;
      };
    }
    this.percentileData.forEach((item, index) => {
      item.values.forEach(element => {
        let axis = {
          x: element.age,
          y: element.weightlbs
        }
        this.data.push(axis)
      });
      let data = {
        label: item.name,
        borderColor: item.color,
        backgroundColor: item.color,
        pointHoverRadius: 0,
        pointRadius: 0,
        fill: false,
        data: this.data,
        radius: 0,
        yAxisID: 'y-axis-1',
        xAxisID: 'x-axis-1',
      }
      this.value.push(data);
      this.data = [];
    })
    if(this.graphdata){
    this.graphdata.forEach(element => {
      if (element.Weight) {
        var diff = (new Date(element.DateCreated).getTime() - new Date(this.authStore.PatientDetail.DateOfBirth).getTime()) / 1000;
        diff = diff / (60 * 60 * 24 * 7 * 4);
        diff = Math.round(diff * 10) / 10;
        switch (this.graphtype) {
          case "month": {
            if (diff <= 36) {
              this.xValue = diff;
              let axis = {
                x: this.xValue,
                y: element.Weight
              }
              this.data.push(axis)
            }
            break;
          };
          case "year": {
            diff = diff / 12;
            diff = Math.round(diff * 10) / 10;
            if (diff >= 2) {
              this.xValue = diff;
              let axis = {
                x: this.xValue,
                y: element.Weight
              }
              this.data.push(axis)
            }
            break;
          };
        }
      }
    });
    let data = {
      label: "Patient:" + " " + this.authStore.PatientDetail.LastName + " " + this.authStore.PatientDetail.MiddleName + " " + this.authStore.PatientDetail.FirstName + "   " + "Gender:" + " " + this.gender,
      borderColor: "blue",
      backgroundColor: "blue",
      fill: false,
      data: this.data,
      // radius: 0,
      yAxisID: 'y-axis-1',
      xAxisID: 'x-axis-1',
    }
    this.value.push(data);
    }
    if (this.graphtype == "month") {
      this.createChart1();

    } else {
      this.createChart2();
    }
  }

  createChart1() {
    $(() => {
      this.LineChart1 = new Chart('weightChart1', {
        type: 'line',
        plugins: [this.plugin1, this.axisPlugin],
        data: {
          datasets: this.value
        },
        options: {
          showAllTooltips: true,
          tooltips: {
            onlyShowForDatasetIndex: [7],
            custom: function (tooltip) {
              if (!tooltip) return;
              // disable displaying the color box;
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
            text: 'Weight chart with 0 to 36 months percentile data'
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Age [months]'
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              id: 'x-axis-1',
              ticks: this.xTicks,
              // grid line settings
              //  gridLines: {
              //   drawOnChartArea: true, // only want the grid lines for one axis to show up
              // },
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Weight [Lbs]'
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'y-axis-1',
              ticks: {
                // suggestedMin: 50,
                // suggestedMax: 100,
                // max: 100,
                // min: 0,
                // stepSize: 10
              },
              // grid line settings
              //  gridLines: {
              //   drawOnChartArea: true, // only want the grid lines for one axis to show up
              // },
            }, {
              scaleLabel: {
                display: true,
                labelString: 'Weight [Kg]'
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              id: 'y-axis-2',
              ticks: {
                //     autoSkip: false,
                // max: 100,
                // min: 0,
                // stepSize: 
              },
              afterTickToLabelConversion: (q) => {
                q.ticks.forEach((item, index) => {
                  var newTick = Math.round(parseInt(item) * 0.45359237)
                  q.ticks[index] = newTick.toString();
                })
              },
              // grid line settings
              // gridLines: {
              //   drawOnChartArea: true, // only want the grid lines for one axis to show up
              // },
            }],
          }
        }
      })
    })
  }

  createChart2() {
    $(() => {
      this.LineChart2 = new Chart('weightChart2', {
        type: 'line',
        plugins: [this.plugin1, this.axisPlugin],
        data: {
          datasets: this.value
        },
        options: {
          showAllTooltips: true,
          tooltips: {
            onlyShowForDatasetIndex: [7],
            custom: function (tooltip) {
              if (!tooltip) return;
              // disable displaying the color box;
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
            filter: function (tooltipItem) {
              return tooltipItem.datasetIndex !== 0 && tooltipItem.datasetIndex !== 1 && tooltipItem.datasetIndex !== 2 && tooltipItem.datasetIndex !== 3 && tooltipItem.datasetIndex !== 4 && tooltipItem.datasetIndex !== 5 && tooltipItem.datasetIndex !== 6;
            }
          },
          title: {
            display: true,
            text: 'Weight chart with 2 to 20 years percentile data'
          },
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Age [years]'
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              id: 'x-axis-1',
              ticks: this.xTicks,
              // grid line settings
              //  gridLines: {
              //   drawOnChartArea: true, // only want the grid lines for one axis to show up
              // },
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Weight [Lbs]'
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'y-axis-1',
              ticks: {
                // suggestedMin: 50,
                // suggestedMax: 100,
                // max: 100,
                // min: 0,
                // stepSize: 10
              },
              // grid line settings
              //  gridLines: {
              //   drawOnChartArea: true, // only want the grid lines for one axis to show up
              // },
            }, {
              scaleLabel: {
                display: true,
                labelString: 'Weight [kg]'
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              id: 'y-axis-2',
              ticks: {
                //     autoSkip: false,
                // max: 100,
                // min: 0,
                // stepSize: 
              },
              afterTickToLabelConversion: (q) => {
                q.ticks.forEach((item, index) => {
                  var newTick = Math.round(parseInt(item) * 0.45359237)
                  q.ticks[index] = newTick.toString();
                })
              },
              // grid line settings
              // gridLines: {
              //   drawOnChartArea: true, // only want the grid lines for one axis to show up
              // },
            }],
          }
        }
      })
    })
  }
  saveChart(chartName) {
    var canvas = <HTMLCanvasElement>document.getElementById(chartName);
    var dataUrl = canvas.toDataURL(); //attempt to save base64 string to server using this var  
    var windowContent = '<!DOCTYPE html>';
    windowContent += '<html>'
    windowContent += '<head><title>Patient Weight Chart</title></head>';
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
