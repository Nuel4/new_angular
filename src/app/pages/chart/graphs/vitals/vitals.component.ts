import { Component, OnInit, ViewEncapsulation, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AuthenticationStore } from '../../../../authentication/authentication-store';
import { GraphsService } from '../../../../services/chart/graphs.service';


@Component({
  selector: 'app-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VitalsComponent implements OnChanges {
  val1;
  @Input() rawdata;
  @Input() 
  // @Input() wData: any;
  // @Output() onSomething = new EventEmitter<string>();
  // widgetData: any;
  // toChart: boolean;
set _val1(val: number){
  this.val1 = val
}

get _val1(): number {
return this.val1;
}

private firsttime: boolean = false;
cols: any[];
  vitalsvalue: any[] = [];
  days;
  months;
  years;
  patientData;
  constructor(private graphService : GraphsService,private authStore: AuthenticationStore) { }

  ngOnChanges(changes: SimpleChanges): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
    
  //   // if(this.firsttime){
  //     for (let propName in changes) {  
  //      let change = changes[propName];
      
  //      let curVal  = JSON.stringify(change.currentValue);
  //      let prevVal = JSON.stringify(change.previousValue);
  //      let changeLog = `${propName}: currentValue = ${curVal}, previousValue = ${prevVal}`;
       
  
  //      if (propName === '_val1') {
  //       this.vitalsvalue = [];
  //       this.patientData = JSON.parse(sessionStorage.getItem('PatientDetail'));
  //       // this.vitalsvalue = this.rawdata
  //       if(this.val1 === "Option 1"){
  //       for(let i=0;i<this.rawdata.length;i++){
  //         this.CalDate(this.rawdata[i].DateLastUpdated, this.patientData.DateOfBirth)
  //         this.months = this.months + (this.years * 12);
  //         this.months = this.months + (this.days / 30);
  //         if(this.months<=36){
  //         this.vitalsvalue.push(this.rawdata[i]);
  //       }
  //       }
  //     } else if(this.val1 === "Option 2"){
  //       this.vitalsvalue = [];
  //       for(let i=0;i<this.rawdata.length;i++){
  //         this.CalDate(this.rawdata[i].DateLastUpdated, this.patientData.DateOfBirth)
  //         this.months = this.months + (this.years * 12);
  //         this.months = this.months + (this.days / 30);
  //         if(this.months>=24){
  //           this.vitalsvalue.push(this.rawdata[i]);
  //       }
  //       }
  //     }
     
  //   }
  // }
  // //  }
  //  console.log("value of vitalsvalue is",this.vitalsvalue);
  //  this.firsttime = true;
    }

  
  ngOnInit() {
    // if (this.widgetData) {
    //   this.toChart = true;
    // }
    console.log('rawdata',this.rawdata)
    this.patientData = JSON.parse(sessionStorage.getItem('PatientDetail'));
    this.cols = [
      { field: 'DateLastUpdated', header: 'Date' },
      { field: 'Weight', header: 'Weight' },
      { field: 'WeightSubValue', header: 'Weight Sub' },
      { field: 'unit', header: 'Unit' },
      { field: 'Height', header: 'Height' },
      { field: 'HeightSubValue', header: 'Height Sub' },
      { field: 'unit', header: 'Unit' },
      { field: 'HeadCircumference', header: 'Head Circumference' },
      { field: 'unit', header: 'Unit' },
      { field: 'Bmi', header: 'BMI' },
      { field: 'HeartRate', header: 'Heart Rate' },
      { field: 'BpSystolic', header: 'BP-Sys' },
      { field: 'BpDiastolic', header: 'BP-Dia' },
      { field: 'Temperature', header: 'Temparature' },
      { field: 'TemperatureMethod', header: 'Method' },
      { field: 'RespirationRate', header: 'Respiration Rate' }
  ];
  this.graphService.getVitalsHeightWeightForGraph(this.authStore.PatientDetail.PatientId).subscribe((result: any) => {
    console.log('Vitals Result',result)
    this.vitalsvalue = result
  
    for(let i=0;i<this.vitalsvalue.length;i++){
      // this.vitalsvalue[i].DateCreated = new Date(this.rawdata[i].DateCreated).getDate("DD-mm-yyyy");
      this.vitalsvalue[i].unit = "inch";
      this.vitalsvalue[i].DateLastUpdated = moment(this.vitalsvalue[i].DateLastUpdated).format("YYYY-MM-DD");
      // console.log("value of date after formatiing is",this.vitalsvalue[i].DateLastUpdated);
    }
    // [ 
    //   { date:'1-22-2019', weight:'45.00', weight_sub:'12.00' , unit:'Kgs' , height:'133.00', head_circumference:'230.00' , bmi:'7.55', heart_rate:'13' , bp_sys:'89' , bp_dia:'150' , temparature:'120.8', method:'Electronic thermometer' , respiration_rate:'23.87'}
    // ];
  })
    if(this.val1 === "Option 1"){
      for(let i=0;i<this.rawdata.length;i++){
        this.CalDate(this.rawdata[i].DateLastUpdated, this.patientData.DateOfBirth)
        this.months = this.months + (this.years * 12);
        this.months = this.months + (this.days / 30);
        if(this.months<=36){
        this.vitalsvalue.push(this.rawdata[i]);
      }
      }
    } else if(this.val1 === "Option 2"){
      this.vitalsvalue = [];
      for(let i=0;i<this.rawdata.length;i++){
        this.CalDate(this.rawdata[i].DateLastUpdated, this.patientData.DateOfBirth)
        this.months = this.months + (this.years * 12);
        this.months = this.months + (this.days / 30);
        if(this.months>=24){
          this.vitalsvalue.push(this.rawdata[i]);
      }
      }
    }
    console.log("value of vitals in ngonit",this.vitalsvalue)

  }
  CalDate(date1, date2) {
    var diff = Math.floor(new Date(date1).getTime() - new Date(date2).getTime());
    var secs = Math.floor(diff / 1000);
    var mins = Math.floor(secs / 60);
    var hours = Math.floor(mins / 60);
    this.days = Math.floor(hours / 24);
    this.months = Math.floor(this.days / 31);
    this.years = Math.floor(this.months / 12);
    this.months = Math.floor(this.months % 12);
    this.days = Math.floor(this.days % 31);
    hours = Math.floor(hours % 24);
    mins = Math.floor(mins % 60);
    secs = Math.floor(secs % 60);
    var message = "";
    if (this.days <= 0) {
      message += secs + " sec ";
      message += mins + " min ";
      message += hours + " hours ";
    } else {
      message += this.days + " days ";
      if (this.months > 0 || this.years > 0) {
        message += this.months + " months ";
      }
      if (this.years > 0) {
        message += this.years + " years ago";
      }
    }
    
    // console.log("value of message is",message,"type of month is",this.months);
    // return message
  }
}
