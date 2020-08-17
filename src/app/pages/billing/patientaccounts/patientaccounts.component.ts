import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InsuranceProviderService } from '../../../services/billing/insuranceprovider.service';

@Component({
  selector: 'app-patientaccounts',
  templateUrl: './patientaccounts.component.html',
  styleUrls: ['./patientaccounts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientaccountsComponent implements OnInit {


private  InsuranceProvider: any [];
  constructor(private insProvider : InsuranceProviderService) {
   
  }

  ngOnInit() {
    
  }

}
