import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';

@Component({
  selector: 'app-alcohol-usage',
  templateUrl: './alcohol-usage.component.html',
  styleUrls: ['./alcohol-usage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlcoholUsageComponent implements OnInit {
  @Input() SocialHistory: any;
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  no_label: string[] = [];
  current: string[] = [];
  past: string[] = [];
  alcoholusage: string;
  detailUsage: string;
  patientAlcoholUsage: string;
  drinksPerWeek: string;
  isdisabled: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    console.log('alert',this.SocialHistory)
    if (this.SocialHistory) {
      this.alcoholusage = this.SocialHistory.AlcoholUsage
      this.detailUsage = this.SocialHistory.AlcoholUsageTypeOfAlcohol
      this.drinksPerWeek = this.SocialHistory.AlcoholUsageDrinksPerWeek
      this.patientAlcoholUsage = this.SocialHistory.AlcoholUsagePatientToTrackViaPortal
    }
  }

  toggleDisabled(val) {
    this.isdisabled = val;
  }

  onFormReset() {
    this.alcoholusage = "";
    this.detailUsage = "";
    this.drinksPerWeek = "";
    this.patientAlcoholUsage = "";
  }
  onFormDataChange() {
    this.PEValueObj.AlcoholUsage = this.alcoholusage;
    this.PEValueObj.AlcoholUsageDrinksPerWeek = this.drinksPerWeek ? this.drinksPerWeek : '';
    this.PEValueObj.AlcoholUsagePatientToTrackViaPortal = this.patientAlcoholUsage.length > 0 ? true : false;
    this.PEValueObj.AlcoholUsageTypeOfAlcohol = this.detailUsage ? this.detailUsage : '';
  }
}

