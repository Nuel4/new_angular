import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { forkJoin } from "rxjs";
import { AuthenticationStore } from '../../../authentication';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { InsuranceProviderService } from '../../../services/billing/insuranceprovider.service'
import { PhysicianService } from '../../../services/practice/physician.service'
import { ClaimService } from '../../../services/billing/claims.service';
import { tick } from '@angular/core/src/render3';

@Component({
  selector: 'app-claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClaimsComponent implements OnInit {
  public indexValue: any;
  index: number = 0;
  emptyArr: any[] = [];
  constructor(private physicianServ: PhysicianService,
    private insuranceProServ: InsuranceProviderService,
    public authStore: AuthenticationStore, private claimService: ClaimService,
    protected localStorage: LocalStorage) { }

  ngOnInit() {
  }
  handleChange(e) {
    this.emptyArr = [];
    this.indexValue = e.index;
    if (this.indexValue === 3) {
      // this.claimService.getAfterDeleteApproveRemittance().subscribe(res => {
      //   console.log(res);
      // })
    }


  }


}
