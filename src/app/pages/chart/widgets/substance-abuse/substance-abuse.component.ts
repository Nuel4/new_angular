import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';

@Component({
  selector: 'app-substance-abuse',
  templateUrl: './substance-abuse.component.html',
  styleUrls: ['./substance-abuse.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SubstanceAbuseComponent implements OnInit {
  @Input() SocialHistory: any;
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  substancevalue: any;
  route: any = [];
  usedDays: string;
  WeeklyExpenditure: string;
  POValue: string;
  IMValue: string;
  IVValue: string;
  lastUsedDate: string;
  ageOfFirstUse: string;
  Comments: string;
  RouteValue: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    if (this.SocialHistory) {
      this.substancevalue = this.SocialHistory.SubstanceAbuse
      this.usedDays = this.SocialHistory.SubstanceAbuseDaysPerWeek
      this.WeeklyExpenditure = this.SocialHistory.SubstanceAbuseRoute
      this.WeeklyExpenditure = this.SocialHistory.SubstanceAbuseWeeklyExpense
      this.lastUsedDate = this.SocialHistory.SubstanceAbuseLastUseMonth
      this.ageOfFirstUse = this.SocialHistory.SubstanceAbuseAgeFirstUsed
      this.Comments = this.SocialHistory.SubstanceAbuseComments
    }
  }

  onFormReset() {
    this.substancevalue= "";
    this.usedDays= "";
    this.WeeklyExpenditure= "";
    this.IMValue= "";
    this.POValue= "";
    this.IVValue= "";
    this.lastUsedDate= "";
    this.ageOfFirstUse= "";
    this.Comments= "";
  }

  onFormDataChange() {
    this.PEValueObj.SubstanceAbuse = this.substancevalue ? this.substancevalue : '';
    this.PEValueObj.SubstanceAbuseDaysPerWeek = this.usedDays ? this.usedDays : '';
    this.PEValueObj.SubstanceAbuseRoute = this.RouteValue ? this.RouteValue : '';
    this.PEValueObj.SubstanceAbuseWeeklyExpense = this.WeeklyExpenditure ? this.WeeklyExpenditure : '';
    this.PEValueObj.SubstanceAbuseLastUseYear = this.lastUsedDate ? this.lastUsedDate : '';
    this.PEValueObj.SubstanceAbuseAgeFirstUsed = this.ageOfFirstUse ? this.ageOfFirstUse : '';
    this.PEValueObj.SubstanceAbuseComments = this.Comments ? this.Comments : '';
  }
}
