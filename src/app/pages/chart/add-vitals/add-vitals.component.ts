import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { AddVitalsService } from '../../../services/chart/add-vitals.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';

// interface Category {
//   name: string;
// }
// interface Inch {
//   name: string;
// }
// interface BMI {
//   name: string;
// }
// interface Circum {
//   name: string;
// }
// interface Method {
//   name: string;
// }
@Component({
  selector: 'app-add-vitals',
  templateUrl: './add-vitals.component.html',
  styleUrls: ['./add-vitals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddVitalsComponent implements OnInit {
  @Input() PEValueObj: any
  group: FormGroup;
  field: FieldConfig;
  weightUnit: any = [];
  addMeasure: any = ['1'];
  addMeasureCount: number = 1;
  // selectedGms: Category;
  heightUnit: any = [];
  // selectedInches: Inch;
  // status: BMI[];
  // selectedStatus: BMI;
  circumferenceUnit: any = [];
  // selectCircum: Circum;
  method: any = [];
  selectedMethod: any;
  selectedWeightUnit : any = { name: 'lbs and oz', id1: 9, id2: 11 }
  selectedHeightUnit : any = { name: 'feet and inch', id1: 18, id2: 16 };
  weight1: any;
  weight2: any;
  weight = 0;
  height = 0;
  height1: any;
  height2: any;
  bmi: any;
  selectedCircumUnit = { name: 'inches', id1: 1 };
  bmiStatus = []
  selectedBmiStatus = { name: '', id1: 0 };
  irregularHT: boolean = false;
  heartRate: any;
  diastolic: any;
  systolic: any;
  temperature: any;
  comment: any;
  respirationRate: any;
  headCircumference: any;
  measure: any[] = [];
  value: any[] = [];
  unit: any[] = [];
  unitofLength: any;
  unitofWeight: any;
  isenableFourCol: boolean = false;
  isenableCancelBtn: boolean = false;
  patientDetails = JSON.parse(sessionStorage.getItem('PatientDetail'))
  userDetails = JSON.parse(sessionStorage.getItem('UserDetail'))
  selectedLbsOz: boolean = true;
  selectedFeet: boolean=true;

  constructor(private addVitalService: AddVitalsService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder ) {

    // { field: '', header: 'Bill Date' },
    this.weightUnit = [
      { name: 'lbs and oz', id1: 9, id2: 11 },
      { name: 'lbs', id1: 9 },
      { name: 'kgs', id1: 8 },
      { name: 'grams', id1: 10 }
    ];
    this.heightUnit = [
      { name: 'feet and inch', id1: 18, id2: 16 },
      { name: 'inch', id1: 16 },
      { name: 'meter', id1: 17 },
      { name: 'centimeter', id1: 19 }
    ];
    // this.status = [{ name: '' }, { name: '1BMI' }, { name: '2BMI' }];
    this.circumferenceUnit = [
      { name: 'inches', id1: 16 },
      { name: 'centimeter', id1: 19 }
    ];
    this.bmiStatus = [{ name: '', id1: 0 },
    { name: 'Normal weight', id1: 1 },
    { name: 'Overweight', id1: 2 },
    { name: 'Obese', id1: 3 },
    { name: 'Underweight', id1: 4 }
    ]
    this.method = [
      { name: '', id1: 0 },
      { name: 'Electronic probe thermometer-mouth', id1: 1 },
      { name: 'Electronic probe thermometer-rectum', id1: 2 },
      { name: 'Electronic probe thermometer-armpit', id1: 3 },
      { name: 'Electronic thermometer Ear', id1: 4 },
      { name: 'Glass thermometer-mouth', id1: 5 },
      { name: 'Glass thermometer-armpit', id1: 6 },
      { name: 'Plastic strip thermometer-Forehead', id1: 7 },
      { name: 'Plastic strip thermometer mouth', id1: 8 }
    ];
  }
  ngOnInit() {
    this.getUnits();
    this.addVitalService.GetUnitofWeight();
    let additionalVital = []
    for (let i = 0; i < this.addMeasureCount; i++) {
      additionalVital[i] = {
        measure: this.measure[i],
        value: this.value[i],
        unit: this.unit[i]
      }
    }

    if (this.route.snapshot.routeConfig.path === "add-vitals") {
      this.isenableFourCol = true;
      this.isenableCancelBtn = true;


    }
    else if (this.route.snapshot.routeConfig.path === "template-editor")
      this.isenableCancelBtn = false;
    if(sessionStorage.getItem('PEVitals')) {
      this.PEValueObj = JSON.parse(sessionStorage.getItem('PEVitals'))
    this.weight1 = this.PEValueObj[0].Weight
    // WeightUomUnitId: this.weight1 ? this.selectedWeightUnit.id1 : this.weight1
    this.height1 = this.PEValueObj[0].Height
    // HeightUomUnitId: this.height1 ? this.selectedHeightUnit.id1 : this.height1
    this.bmi = this.PEValueObj[0].Bmi
    this.bmiStatus.map(status => {
      if (status.name === this.PEValueObj[0].BmiStatus)
        this.selectedBmiStatus = status
    })
    this.heartRate = this.PEValueObj[0].HeartRate
    this.systolic = this.PEValueObj[0].BpSystolic
    this.diastolic = this.PEValueObj[0].BpDiastolic
    this.temperature = this.PEValueObj[0].Temperature
    this.method.map(val => {
      if (val.name === this.PEValueObj[0].TemperatureMethod)
        this.selectedMethod = val
    })
    this.respirationRate = this.PEValueObj[0].RespirationRate
    this.comment = this.PEValueObj[0].Comments
    this.PEValueObj[0].DateLastUpdated = new Date()
    this.PEValueObj[0].LastUpdatedByUserId = this.userDetails.UserId
    this.irregularHT = this.PEValueObj[0].HeartRateIsRegular
    this.headCircumference = this.PEValueObj[0].HeadCircumference
    this.circumferenceUnit.map(val => {
      if (val.id1 === this.PEValueObj[0].HeadCircumferenceUnit)
        this.selectedCircumUnit = val
    })
    this.PEValueObj[0].Active = true
    this.weight2 = this.PEValueObj[0].WeightSubValue
    this.height2 = this.PEValueObj[0].HeightSubValue
    this.weightUnit.map(val => {
      if (val.id1 === this.PEValueObj[0].WeightSubUomUnitId)
        this.selectedWeightUnit = val
    })
    this.heightUnit.map(val => {
      if ((val.id2 === this.PEValueObj[0].HeightSubUomUnitId && val.id1 === this.PEValueObj[0].HeightUomUnitId) || val.id1 === this.PEValueObj[0].HeightUomUnitId )
        this.selectedHeightUnit = val
    })
  } else {
    this.PEValueObj = [{}]
  }
    if(this.PEValueObj){
      console.log('PevalueObj :');
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
    // MrVitalsAdditionalMeasures: additionalVital
  }

  onAdditionalMeasure() {
    this.addMeasureCount++
    this.addMeasure.push(this.addMeasureCount)
  }
  onRemove(index) {
    this.addMeasure.splice(index, 1)
    if(this.PEValueObj.length > 0) { this.PEValueObj[0].MrVitalsAdditionalMeasures.splice(index, 1) }
  }
  changeWeight(event){
  }
  calculateBmi(selectedWeightUnit) {
    // if(this.selectedHeightUnit == undefined){
    //   this.selectedHeightUnit = { name: 'feet and inch', id1: 1 };
    // }
    // if(this.selectedWeightUnit == undefined){
    //   this.selectedWeightUnit = { name: 'lbs and oz', id1: 1 }
    // }
    if (this.selectedWeightUnit.name == 'lbs and oz') {
      this.selectedLbsOz = true;
      this.weight2 ? this.weight = (this.weight2 / 16) + this.weight1 : this.weight = this.weight1;
      this.weight = this.weight * 0.453592

    } else if (this.selectedWeightUnit.name == 'lbs') {
      this.selectedLbsOz = false;
      this.weight = this.weight1 * 0.453592
    } else if (this.selectedWeightUnit.name == 'grams') {
      this.selectedLbsOz = false;
      this.weight = this.weight1 / 1000
    } else if (this.selectedWeightUnit.name == 'kgs') {
      this.selectedLbsOz = false;
      this.weight = this.weight1
    }
    if (this.selectedHeightUnit.name == 'inch') {
      this.selectedFeet = false;
      this.height = this.height1 * 0.0254
    } else if (this.selectedHeightUnit.name == 'feet and inch') {
      this.selectedFeet = true;
      this.height2 ? this.height = (this.height1 * 12) + this.height2 : this.height = this.height1
      this.height = this.height * 0.0254
    } else if (this.selectedHeightUnit.name == 'centimeter') {
      this.selectedFeet = false;
      this.height = this.height1 * 0.01
    } else if (this.selectedHeightUnit.name == 'meter') {
      this.selectedFeet = false;
      this.height = this.height1
    }
    this.bmi = this.weight / (this.height * this.height)
    this.bmi = Math.round(this.bmi * 10) / 10;
    if (this.bmi > 18.5) {
      if (this.bmi < 25) {
        this.selectedBmiStatus = { name: 'Normal weight', id1: 1 }
      } else if (this.bmi < 30) {
        this.selectedBmiStatus = { name: 'Overweight', id1: 2 }
      } else {
        this.selectedBmiStatus = { name: 'Obese', id1: 3 }
      }
    } else {
      this.selectedBmiStatus = { name: 'Underweight', id1: 4 }
    }
    
     this.weight1 && (this.PEValueObj[0].Weight = this.weight1,
      this.PEValueObj[0].WeightUnit1 = this.selectedWeightUnit.id1);
      this.height1 && (this.PEValueObj[0].Height = this.height1,
        this.PEValueObj[0].HeightUnit1 = this.selectedHeightUnit.id1)
      this.weight2 && (this.PEValueObj[0].WeightSubValue = this.weight2,
        this.PEValueObj[0].WeightUnit2 = this.selectedHeightUnit.id2);
      this.height2 && (this.PEValueObj[0].HeightSubValue = this.height2,
        this.PEValueObj[0].HeightUnit2 = this.selectedHeightUnit.id2);
      this.bmi && (this.PEValueObj[0].Bmi = this.bmi);
      this.selectedBmiStatus && (this.PEValueObj[0].BmiStatus = this.selectedBmiStatus.name);
      this.heartRate && (this.PEValueObj[0].HeartRate = this.heartRate);
      this.irregularHT && (this.PEValueObj[0].HeartRateIsRegular = this.irregularHT);
      this.headCircumference && (this.PEValueObj[0].HeadCircumference = this.headCircumference);
      this.diastolic && (this.PEValueObj[0].BpDiastolic = this.diastolic);
      this.systolic && (this.PEValueObj[0].BpSystolic = this.systolic);
      this.respirationRate && (this.PEValueObj[0].RespirationRate = this.respirationRate);
      this.temperature && (this.PEValueObj[0].Temperature = this.temperature,
        this.PEValueObj[0].TemperatureMethod = this.selectedMethod.name);
      this.comment && (this.PEValueObj[0].Comments = this.comment); 
      if(this.addMeasure.length > 1) {     
      for (let i = 1; i < this.addMeasureCount + 1; i++) {
        this.PEValueObj[0].MrVitalsAdditionalMeasures[i - 1] = {
          measure: this.measure[i],
          value: this.value[i],
          unit: this.unit[i],
          DateCreated: new Date(),
          CreatedByUserId: this.userDetails.UserId,
          DateLastUpdated: new Date(),
          LastUpdatedByUserId: this.userDetails.UserId
        }
      }
    }
    sessionStorage.setItem("PEVitals", JSON.stringify(this.PEValueObj))
  }
  getUnits() {
    this.addVitalService.GetUnitofLength().subscribe(
      (res) => {
        this.unitofLength = res
      }
    )
    this.addVitalService.GetUnitofWeight().subscribe(
      (res) => {
        this.unitofWeight = res
      }
    )
  }
  addVitals() {

    let additionalVital = []
    // if(this.selectedHeightUnit == undefined){
    //   this.selectedHeightUnit = { name: 'feet and inch', id1: 1 };
    // }
    // if(this.selectedWeightUnit == undefined){
    //   this.selectedWeightUnit = { name: 'lbs and oz', id1: 1 }
    // }
    // if(this.addMeasure.height1 == undefined && this.addMeasure.weight1 == undefined){
    //   this.selectedHeightUnit = undefined;
    //   this.selectedWeightUnit = undefined;
    // }
    if (!(this.measure[1] == undefined && this.value[1] == undefined && this.unit[1] == undefined)) {
      for (let i = 1; i < this.addMeasureCount + 1; i++) {
        additionalVital[i - 1] = {
          measure: this.measure[i],
          value: this.value[i],
          unit: this.unit[i],
          DateCreated: new Date(),
          CreatedByUserId: this.userDetails.UserId,
          DateLastUpdated: new Date(),
          LastUpdatedByUserId: this.userDetails.UserId
        }
      }
    }
    let param = {
      // MrVitalsId: 0,
      // MrPatientEncounterId: 0,
      PatientId: this.patientDetails.PatientId,
      Weight: this.weight1,
      WeightUomUnitId: this.weight1 ? this.selectedWeightUnit.id1 : this.weight1,
      Height: this.height1,
      HeightUomUnitId: this.height1 ? this.selectedHeightUnit.id1 : this.height1,
      Bmi: this.bmi,
      BmiStatus: this.bmi ? this.selectedBmiStatus.name : undefined,
      HeartRate: this.heartRate,
      BpSystolic: this.systolic,
      BpDiastolic: this.diastolic,
      Temperature: this.temperature,
      TemperatureMethod: this.selectedMethod ? this.selectedMethod.name : this.selectedMethod,
      RespirationRate: this.respirationRate,
      Comments: this.comment,
      ObservationsByUserId: this.userDetails.UserId,
      DateCreated: new Date(),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.UserId,
      HeartRateIsRegular: this.irregularHT,
      HeadCircumference: this.headCircumference,
      HeadCircumferenceUnit: this.headCircumference ? this.selectedCircumUnit.id1 : this.headCircumference,
      Active: true,
      WeightSubValue: this.weight2,
      HeightSubValue: this.height2,
      WeightSubUomUnitId: this.weight2 ? this.selectedWeightUnit.id2 : this.weight2,
      HeightSubUomUnitId: this.height2 ? this.selectedHeightUnit.id2 : this.height2,
      MrVitalsAdditionalMeasures: additionalVital
    }
    this.addVitalService.PostVitals(param).subscribe(
      result => {
        this.showAlert('Vitals added successfully!')
        // this.clearAddMeasures();
        if (this.route.snapshot.routeConfig.path === 'add-vitals') {
          this.router.navigate(['/pages/chart'], { skipLocationChange: true });
        }
        
      }
    )
  }
  additionMeasurePost(vitalParam) {
    let param = {
      // "VitalsAdditionalMeasureId": 0,
      VitalsId: 0,
      Measure: "string",
      Value: "string",
      Unit: "string",
      DateCreated: "2019-04-13T05:48:27.248Z",
      CreatedByUserId: 0,
      DateLastUpdated: "2019-04-13T05:48:27.248Z",
      LastUpdatedByUserId: 0,
      Vitals: vitalParam

    }
  }
  // clearAddMeasures() {
  //   // alert();
  //   // this.addMeasure = []
  //   this.temperature = "";
  //   this.selectedMethod = "";
  //   this.comment = "";
  //   this.measure = [];
  //   this.value = [];
  //   this.unit = [];
  // }

  clearAddMeasures() {
    this.weight1 = "";
    this.weight2 = "";
    this.height1 = "";
    this.height2 = "";
    this.bmi = "";
    this.selectedBmiStatus = { name: '', id1: 0 };
    this.headCircumference = "";
    this.selectedCircumUnit = { name: 'inches', id1: 1 };
    this.heartRate = "";
    this.systolic = "";
    this.diastolic = "";
    this.respirationRate = "";
    this.temperature = "";
    this.selectedMethod = "";
    this.comment = "";
    this.PEValueObj[0] = {MrVitalsAdditionalMeasures: []};
  }

  pageCancel() {
    if (this.route.snapshot.routeConfig.path === "add-vitals") {
      this.router.navigate(['/pages/chart'], { skipLocationChange: true });
    }
  }

  showAlert(msg: string) {
    this.toaster.success(msg)
  }
}
