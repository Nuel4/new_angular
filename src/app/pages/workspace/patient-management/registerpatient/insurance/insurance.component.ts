import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PrimaryInsuranceComponent } from './primary-insurance/primary-insurance.component';
import { SecondaryInsuranceComponent } from './secondary-insurance/secondary-insurance.component';
import { TertiaryInsuranceComponent } from './tertiary-insurance/tertiary-insurance.component';
import { InsuranceProviderService } from '../../../../../services/billing/insuranceprovider.service';
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceComponent implements OnInit {
  _patientIdToEdit
  _showprtandchrgebut: boolean;
  @Input()
  set _showprtandchrge(val: any){
    this._showprtandchrgebut = val;
  }

  get _showprtandchrge(): any {
    return this._showprtandchrgebut;
  }

  @Input() 
  set patientIdToEdit(val: number){
    this._patientIdToEdit = val;
  }

  get patientIdToEdit(): number {
    return this._patientIdToEdit;
  }
  @Output() next = new EventEmitter();
@Output() Insurancepost = new EventEmitter();
@Output() modal = new EventEmitter();
@Output() crgslip = new EventEmitter()
childindex = 0;
_insuranceCompany: any;
  constructor(
    private router: Router,
    private IPS: InsuranceProviderService
  ) { }

  ngOnInit() {
    this.getInsurancedetails();
  }

  getInsurancedetails(){
    this.IPS.getInsuranceProviders().subscribe(
      resp => {
        this._insuranceCompany = resp
        console.log("value of insurance company: ",this._insuranceCompany)
      });
      // InsuranceProviderName
      // InsuranceProviderCode
      // InsuranceCategoryId
      // InsuranceProviderName
  }
  onNext(){
    if(this.childindex === 2){
      this.openNext()
    } else {
      this.childindex = this.childindex + 1;
    }
    // this.childindex = (this.childindex === 3) ? this.openNext() : this.childindex + 1;
  }
  handleChange(e) {
    this.childindex = e.childindex;
  }


  openNext() {
    // this.index = (this.index === 6) ? 0 : this.index + 1;
    this.next.emit();
    // this.childindex = 3;
  }
  onClose() {
    this.router.navigate(['/pages/workspace/patientmanagement']);
  }

  passdata(data){
    this.modal.emit(data);
  }
  chargeSlips(data){
    this.crgslip.emit(data)
   }
}
