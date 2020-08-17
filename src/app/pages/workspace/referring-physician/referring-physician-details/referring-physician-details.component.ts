import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReferringPhysician } from '../../../../model/referringphysician.model'
import { GlobalState } from '../../../../core';
import { LookupService } from '../../../../services/lookup.service'
import { AuthenticationStore } from '../../../../authentication'
import { ReferringPhysicianService } from '../../../../services/workspace/referring-physician.service'
import { RelatedOrganizationService } from '../../../../services/administration/related-organization.service'
import { InputMaskModule } from 'primeng/inputmask';
import { FieldErrorDisplayComponent } from '../../field-error-display/field-error-display.component';
import { WindowRefService } from 'ng-dynamic-component/dynamic/window-ref.service';


@Component({
  selector: 'app-referring-physician-details',
  templateUrl: './referring-physician-details.component.html',
  styleUrls: ['./referring-physician-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferringPhysicianDetailsComponent implements OnInit {
  referringPhysician: ReferringPhysician;
  refPhysicianForm: any;
  stateList: any[] = [];
  formstate: any = {};
  relOrg: any = [];
  refPhy = 0;
  setReferringPhysician: ReferringPhysician;
  isLoader: boolean;
  private formSumitAttempt: boolean;


  constructor(private activeroute: ActivatedRoute,
    private router: Router,
    private refPhyService: ReferringPhysicianService,
    private relOrgService: RelatedOrganizationService,
    private authStore: AuthenticationStore,
    private state: GlobalState,
    private fb: FormBuilder,
    private lookupServ: LookupService,
    private toastr: ToastrService) {
    this.activeroute.params.subscribe(params => {
      this.refPhy = params.referringphysicianid
      this.onRouted(params.referringphysicianid);
    });
  }

  ngOnInit() {
    this.setReferringPhysician = {
      ReferringPhysicianId: 0,
      ReferringPhysicianFirstName: '',
      ReferringPhysicianLastName: undefined,
      SpecialtyDetails: '',
      RelatedOrganizationId: 0,
      RelatedOrganization: {RelatedOrganizationId: 0, RelatedOrganizationName: ''},
      MainPhone: '',
      AltPhone: '',
      MobilePhone: '',
      Fax: '',
      Email: '',
      Website: '',
      AddressLine1: undefined,
      AddressLine2: '',
      City: undefined,
      StateCode: '',
      ZipCode: '',
      ZipPlus4: '',
      DateCreated: this.dateformater(new Date()),
      CreatedByUserId: 0,
      DateLastUpdated: this.dateformater(new Date()),
      LastUpdatedByUserId: 0,
      NationalProviderIdentifier: '',
      IsActive: false
    }
    this.createForm();
    this.getState();
    this.loadrelatedorganization();
    if(this.refPhy > 0) { this.isLoader = true };
  }

  private getState() {
    this.stateList = this.lookupServ.getAllStates();
  }

  loadrelatedorganization() {
    this.relOrgService.getActiveRelatedOrganizations().subscribe(resp => {
      this.relOrg = resp;
    });
  }

  private createForm() {
    this.refPhysicianForm = this.fb.group({
      ReferringPhysicianId: [null, Validators.required],
      ReferringPhysicianFirstName: [''],
      ReferringPhysicianLastName: ['', [Validators.required]],
      SpecialtyDetails: [''],
      RelatedOrganizationId: [''],
      RelatedOrganization: [''],
      MainPhone: [''],
      AltPhone: [''],
      MobilePhone: [''],
      Fax: [''],
      Email: [''],
      Website: [''],
      AddressLine1: ['', [Validators.required]],
      AddressLine2: [''],
      City: ['', [Validators.required]],
      StateCode: [''],
      ZipCode: [''],
      ZipPlus4: [''],
      DateCreated: [''],
      CreatedByUserId: [''],
      DateLastUpdated: [''],
      LastUpdatedByUserId: [''],
      NationalProviderIdentifier: [''],
      IsActive: false
    });
  }

  onRouted(referringPhysicianId) {
    let tempstate = {};
    let temp: { RelatedOrganizationId: number, RelatedOrganizationName: string };
    if (referringPhysicianId > 0) {
      this.loadrelatedorganization()
      this.refPhyService.getReferringPhysiciansById(referringPhysicianId).subscribe(resp => {
        this.setReferringPhysician = resp            
        this.isLoader = false
        this.relOrg.forEach(item => {
          if (item.RelatedOrganizationId == resp.RelatedOrganizationId) {
            this.setReferringPhysician.RelatedOrganization = item
          }
        });
        this.stateList.forEach(item => {
          if (item.value === resp.StateCode) {
            this.formstate = item
          }
        });
      });
    }
    else {
      this.setReferringPhysician = new ReferringPhysician;
    }
  }

  // setReferringPhysician(rph: ReferringPhysician) {
  //   this.referringPhysician = <ReferringPhysician>rph;
  //   console.log(this.refPhysicianForm);
  //   // this.refPhysicianForm.setValue(this.referringPhysician);
  // }

  onSave() {
    //Edit operation
    if (this.setReferringPhysician.ReferringPhysicianId > 0) {
      this.setReferringPhysician.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      this.setReferringPhysician.DateLastUpdated = this.dateformater(new Date());
      this.setReferringPhysician.StateCode = this.formstate ? this.formstate.value : '';
      //this.setReferringPhysician.ReferringPhysicianId = this.referringPhysician.ReferringPhysicianId;
      this.setReferringPhysician.RelatedOrganizationId = this.setReferringPhysician.RelatedOrganization.RelatedOrganizationId;
      this.refPhyService.updateReferringPhysician(this.setReferringPhysician)
        .subscribe(modifidRefPhysician => {
          this.showSuccess(`Referring physician updated successfully!`);
          this.router.navigate(['/pages/workspace/referringphysician']);
        });
    }
    else {   //New operation
      if(this.setReferringPhysician.ReferringPhysicianLastName === undefined || this.setReferringPhysician.AddressLine1 === undefined || this.setReferringPhysician.City === undefined || this.setReferringPhysician.RelatedOrganization.RelatedOrganizationId === 0){
        this.toastr.error('Please fill mandatory field')
      }
      else{
      this.setReferringPhysician.ReferringPhysicianId = 0;
      this.setReferringPhysician.CreatedByUserId = this.authStore.UserDetail.UserId;
      this.setReferringPhysician.DateCreated = this.dateformater(new Date());
      this.setReferringPhysician.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      this.setReferringPhysician.DateLastUpdated = this.dateformater(new Date());
      this.setReferringPhysician.RelatedOrganizationId = this.setReferringPhysician.RelatedOrganization.RelatedOrganizationId;
      this.setReferringPhysician.StateCode = this.formstate ? this.formstate.value : '';
      const refPhysicianItem = JSON.stringify(this.setReferringPhysician);
      this.refPhyService.addReferringPhysician(refPhysicianItem)
        .subscribe(newRefPhysician => {
          this.referringPhysician = newRefPhysician;
          //this.refPhysicianForm.setValue(newRefPhysician);
          // console.log('Added new ReferringPhysician Id: ' + this.referringPhysician.ReferringPhysicianId);
          this.showSuccess(`Referring physician created successfully!`);
          this.router.navigate(['/pages/workspace/referringphysician']);
        });
    }
  }
  }

  dateformater(date) {
    let d = new Date(date);
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  }

  onClose() {
    this.refPhysicianForm.reset();
    this.router.navigate(['/pages/workspace/referringphysician']);
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

  showWarning(msg: string) {
    this.toastr.warning(msg);
  }


  //   displayFieldCss(field: string) {
  //     return {
  //       'is-invalid': this.isFieldValid(field),
  //       'has-feedback': this.isFieldValid(field)
  //     };
  //   }
  // // validation function
  // isFieldValid(field: string) {
  //     return (
  //       (!this.refPhysicianForm.get(field).valid &&
  //         this.refPhysicianForm.get(field).touched) ||
  //       (this.refPhysicianForm.get(field).untouched && this.formSumitAttempt)
  //     );
  //   }
}
