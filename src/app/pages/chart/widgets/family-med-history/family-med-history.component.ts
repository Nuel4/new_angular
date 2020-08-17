import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ProgressnoteService } from './../../../../services/chart/progressnote.service';
import { filter } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../../progressnote/template-editor/field.interface';

@Component({
  selector: 'app-family-med-history',
  templateUrl: './family-med-history.component.html',
  styleUrls: ['./family-med-history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FamilyMedHistoryComponent implements OnInit {
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  checked: boolean = false;
  problemList: any = [];
  selectedProblem: any;
  relationList: any = [];
  selectedRelation: any
  selectedDeceased = false
  relationEntry: any = []
  comments: any;
  age: any;
  FamilyMedicalHistory: any;
  constructor(
    private progressService: ProgressnoteService,
    private fb: FormBuilder
  ) {
    this.problemList = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.relationList = [
      { name: ' ', value: 'null' },
      { name: 'Mother', value: 'mother' },
      { name: 'Father', value: 'father' },
      { name: 'Grand Father', value: 'grandfather' },
      { name: 'Grand Mother', value: 'grandmother' },
      { name: 'Aunt', value: 'aunt' },
      { name: 'Uncle', value: 'uncle' },
      { name: 'Sister', value: 'sister' },
      { name: 'Brother', value: 'brother' },
      { name: 'Duaghter', value: 'duaghter' },
      { name: 'Son', value: 'son' },
      { name: 'Grand Son', value: 'grandson' },
      { name: 'Grand Duaghter', value: 'grandduaghter' },
      { name: 'Unspecified', value: 'unspecified' },
    ];
  }

  ngOnInit() {
    this.getFamilyMedicalHistory();
    if(this.PEValueObj) {
      this.PEValueObj[0] = {
      Relation: '',
      Deceased: this.selectedDeceased,
      Age: '',
      Comments: '',
      Problem: ''
      }
    }
  }

  onAddRelation() {
    if (this.selectedRelation)
      this.relationEntry.push({
        problem: this.selectedProblem,
        isAlive: this.selectedDeceased ? 'Deceased' : 'Alive',
        relation: this.selectedRelation,
        comment: this.comments,
        age: this.age
      })
      this.onClear()
  }

  onRemoveRelation(relation) {
    this.relationEntry = this.relationEntry.filter(item => item.relation.value !== relation.relation.value)
  }

  onSelectRelation(relation) {
    this.selectedProblem = relation.problem
    this.selectedDeceased = relation.isAlive === 'Deceased' ? true : false
    this.selectedRelation = relation.relation
    this.comments = relation.comment
    this.age = relation.age
  }

  onClear(){
    this.selectedProblem = ""
    this.selectedDeceased = false
    this.selectedRelation = ""
    this.comments = ""
    this.age = ""
  }

  deceasedChecked() {
    this.checked = true;
  }

  getFamilyMedicalHistory(){
    this.progressService.GetFamilyMedicalHistoryFieldOption().subscribe((results: any) => {
      console.log(results)
      let lifestyle,medical,mentalhealth;
      lifestyle = results[0].LifestyleOptions;
      medical = results[0].MedicalOptions;
      mentalhealth = results[0].MentalHealthOptions;
      // alert(lifestyle)
      //convert string into array
      
      lifestyle = lifestyle.split(',');
      medical = medical.split(',');
      mentalhealth = mentalhealth.split(',');

      this.FamilyMedicalHistory = lifestyle.concat(medical,mentalhealth);
      let temp = []
      // alert(JSON.stringify(this.FamilyMedicalHistory))
      this.FamilyMedicalHistory.map(item=>{
        temp.push({
          name: item
        })
      })
      this.FamilyMedicalHistory = temp
      console.log("family medical history",this.FamilyMedicalHistory)
    })
  }

  onFormDataChange() {
    this.PEValueObj[0] = {
      Relation: this.selectedRelation ? this.selectedRelation.name : '',
      Deceased: this.selectedDeceased,
      Age: this.age ? this.age : '',
      Comments: this.comments ? this.comments : '',
      Problem: this.selectedProblem ? this.selectedProblem.name : ''
    }
  }

}
