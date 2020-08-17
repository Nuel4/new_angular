import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-tobacco-usage',
  templateUrl: './tobacco-usage.component.html',
  styleUrls: ['./tobacco-usage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TobaccoUsageComponent implements OnInit {
  @Input() SocialHistory: any;
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  someDay: any;
  everyDay: any;
  Former: any;
  NeverSmoke: string;
  statusUnknown: string;
  unknownSmoker: string;
  dailyUsage: string;
  ageStarted: string;
  ageStopped: string;
  yearsSmoked: string;
  isdisabled: boolean = false;
  smokingStatus: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log(this.SocialHistory)
    if (this.SocialHistory) {
      this.everyDay = this.someDay = this.NeverSmoke = this.Former = this.statusUnknown = this.unknownSmoker = this.SocialHistory.TobaccoUsage
      this.dailyUsage = this.SocialHistory.TobaccoUsageTimesPerDay
      this.ageStarted = this.SocialHistory.TobaccoUsageAgeStarted
      this.ageStopped = this.SocialHistory.TobaccoUsageAgeStopped
      this.yearsSmoked = this.SocialHistory.TobaccoUsageYearsSmoked        
    }
  }

  toggleDisabled(val) {
    this.isdisabled = val;
  }

  onFormReset() {
    this.everyDay = "";
    this.someDay = "";
    this.NeverSmoke = "";
    this.Former = "";
    this.statusUnknown = "";
    this.unknownSmoker = "";
    this.dailyUsage = "";
    this.ageStarted = "";
    this.ageStopped = "";
    this.yearsSmoked = "";

  }
  onFormDataChange() {
    this.PEValueObj.TobaccoUsage = this.smokingStatus ? this.smokingStatus : '';
    this.PEValueObj.TobaccoUsageTimesPerDay = this.dailyUsage ? this.dailyUsage : '';
    this.PEValueObj.TobaccoUsageAgeStarted = this.ageStarted ? this.ageStarted : '';
    this.PEValueObj.TobaccoUsageAgeStopped = this.ageStopped ? this.ageStopped : '';
    this.PEValueObj.TobaccoUsageYearsSmoked = this.yearsSmoked ? this.yearsSmoked : '';
  }
}
