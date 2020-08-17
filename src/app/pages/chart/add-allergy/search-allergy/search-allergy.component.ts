import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AllergiesService } from '../../../../services/chart/allergies.service';
@Component({
  selector: 'app-search-allergy',
  templateUrl: './search-allergy.component.html',
  styleUrls: ['./search-allergy.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchAllergyComponent implements OnInit {
  drugAllergies: any;
  foodAllergies: any;

  constructor(
    private activeModal: NgbActiveModal,
    private Allergies: AllergiesService,
  ) { }
  // foodAllergies: any = [];
  allergyHead: any = [];
  allergyValue: any;
  totalrecords: any;
  selectedAllergy: any;
  drugHead: any = [];
  searchDescription: any;
  @Input() desc: any;
  @Output() loadAllergy: EventEmitter<any> = new EventEmitter();
  ngOnInit() {
    if(this.desc){
      this.searchDescription = this.desc
    }
    
    this.getFirstDrugAllergy();
    this.getMrAllergiesByDesc();
  
    this.allergyHead = [
      { field: 'Description', header: 'Food or Environmental Allergies' }
    ]
    this.drugHead = [
      { field: 'Description', header: 'Drug Allergies' }
    ]

   
  }
  onRowSelectFood() {
    // this.allergyValue = event.data.name;
    this.loadAllergy.emit(this.selectedAllergy);
    this.activeModal.dismiss('')
  }
  onRowSelectDrug(event) {
    // this.allergyValue = event.data.name;
    this.loadAllergy.emit(this.selectedAllergy);
    this.activeModal.dismiss('')
  }

  onClearAllergy(){
    this.searchDescription = " ";
  }


  getFirstDrugAllergy(){
    let param = {
      desc: this.searchDescription,
    }

    this.Allergies.getFirstDrugAllergies(param).subscribe((results: any) => {
      this.drugAllergies = results;
    })
  }

  getMrAllergiesByDesc(){
    let param = {
      desc: this.searchDescription,
      pOffset: 0,
      pLimit: 5,
    }
     
    this.Allergies.getAllergiesByDesc(param).subscribe((results: any) => {
      this.foodAllergies = results;
      this.totalrecords = results.TotalItems;
    })
  }
}
