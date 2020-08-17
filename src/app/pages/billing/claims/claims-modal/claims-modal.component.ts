import { LookupService } from './../../../../services/lookup.service';
import { ClaimService } from './../../../../services/billing/claims.service';
import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
import * as moment from 'moment';
import { AuthenticationStore } from './../../../../authentication/authentication-store';
@Component({
  selector: 'app-claims-modal',
  templateUrl: './claims-modal.component.html',
  styleUrls: ['./claims-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClaimsModalComponent implements OnInit {
  @Input() IsDelete;
  @Input() isContent;
  @Input() claimBody;
  @Input() viewBill;
  @Input() claimId;
  @Input() physicianInformation;
  @Input() reSubmit;
  @Input() physicianlist;
  @Input() commentInfo;
  @Input() remitAdvice;
  @Input() BillId;
  @Input() physicianId;
  @Input() facilityId;
  @Input() downloadRemmitance;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter()
  public superBillData: any = [];
  physicianList: any = [];

  physicianFirstName: any;
  physicianLastName: any;
  physicianNPI: any;
  facilityDetails: any = [];
  statesList: any[];
  facilityFirstName: any;
  facilityAddLine1: any;
  facilityAddLine2: any;
  city: any;
  StateCode: any;
  zipcode: any;
  zipPlus: any;
  MainPhone: any;
  FacilityNpi: any;
  selectedState: any;
  practiceDetails: any;
  practiceName: any;
  practiceAddLine1: any;
  practiceAddLine2: any;
  practiceCity: any;
  practiceState: any;
  practiceZipcode: AuthenticationStore;
  practiceZipcode4: any;
  practiceMainPhone: any;
  taxId: any;
  practiceNPI: any;
  physicianDetailById: any = {};
  praDetails: boolean = false;
  totrec: 0;
  totalPage :0;
  rows: any;
  constructor(private modal: NgbActiveModal,
    private claimService: ClaimService, private lookupService: LookupService, public authStore: AuthenticationStore, private toaster: ToastrService) { }
  cols: any[];
  ngOnInit() {
    this.cols = [
      { field: 'superbillId', header: 'Bill' },
      { field: 'createdDate', header: 'Created Date' },
      { field: 'insuranceProviderName', header: 'Insurance Provider' },
      { field: 'insuranceType', header: 'Insurance Type' },
      { field: 'patientName', header: 'Patient' },
      { field: 'physicianName', header: 'Physician' },
      { field: 'amount', header: 'Total Charge' }
    ];
    if (this.viewBill) {
      this.getClaimsList(0);
    }
    if (this.physicianInformation) {
      this.getPhysicianbyId();
      this.getPracticeDetails();
     
      this.getStates();
    }
    if (this.commentInfo) {
    }
  }
  getClaimsList(pgno) {
    let payload = {
      claimId: this.claimId ? this.claimId : 0,
      offset:pgno,
      limit:3
    }
    this.claimService.getCustomFormattedSuperBills(payload).subscribe(res => {
      this.superBillData = res.Results;
      this.totrec = res.TotalItems;
      this.totalPage = res.TotalPages;
      this.rows = res.PageSize;
      this.superBillData.forEach((item, index) => {
        this.superBillData[index].createdDate = moment(this.superBillData[index].createdDate).format("DD-MM-YYYY")
      })
    })
  }
  deleteApprovedRemittance() {
    this.loadEvent.emit(true);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
  getPhysicians() {
    let payload = {
      superBillId: this.BillId
    }
    this.claimService.getPhysiciansInfo(payload).subscribe(res => {
      this.physicianList = res[0];
      // this.physicianList.forEach( (item,index) =>{
      //   if(item.physicianId === this.physicianId){
      //     this.physicianFirstName = this.physicianList[index].physicianFirstName;
      //     this.physicianLastName  = this.physicianList[index].physicianLastName;
      //     this.physicianNPI = this.physicianList[index].physicianNationalProviderIdentifier
      //   }
      // })

    })
  }
  getPhysicianbyId() {
    this.claimService.getPhysiciansById(this.physicianId).subscribe(res => {
      this.physicianDetailById = res;
    })
  }
  getFacilityDetails() {
    let payload = {
      facilityId: this.facilityId ? this.facilityId : 0
    }
    this.claimService.getFacilities(payload).subscribe(res => {
      this.facilityDetails = res[0];
      this.statesList.map(code => {
        if (code.value === this.facilityDetails.StateCode)
          this.StateCode = code
      })
      // this.facilityDetails.forEach((item,index) => {
      //   if(item.FacilityId == this.facilityId){
      //     this.facilityFirstName = this.facilityDetails[index].FacilityName;
      //     this.facilityAddLine1 = this.facilityDetails[index].AddressLine1;
      //     this.facilityAddLine2 = this.facilityDetails[index].AddressLine2;
      //     this.city =  this.facilityDetails[index].City;
      //     this.zipcode =this.facilityDetails[index].ZipCode;
      //     this.zipPlus = this.facilityDetails[index].ZipPlus4;
      //     this.MainPhone = this.facilityDetails[index].MainPhone;
      //     this.FacilityNpi = this.facilityDetails[index].FacilityNpi;
      //   }

      // })
    })
  }
  getPracticeDetails() {

    this.claimService.getPractices(this.authStore.PracticeDetail.PracticeId).subscribe(res => {
      this.practiceDetails = res[0];
      this.praDetails = true;
      // this.practiceDetails = this.practiceDetails[0];
      // this.statesList.map(code => {
      //   if(code.value === this.practiceDetails.StateCode ){
      //     this.practiceState = code;
      //   }
      // })
      // this.practiceDetails.forEach((item,index) => {
      // this.practiceName = this.practiceDetails.PracticeName;
      // this.practiceAddLine1 = this.practiceDetails.AddressLine1;
      // this.practiceAddLine2 = this.practiceDetails.AddressLine2;
      // this.practiceCity = this.practiceDetails.City;
      // // this.practiceState = this.practiceDetails.StateCode;
      // this.practiceZipcode = this.practiceDetails. ZipCode;
      // this.practiceZipcode4 = this.practiceDetails.ZipPlus4;
      // this.practiceMainPhone = this.practiceDetails.MainPhone;
      // this.taxId = this.practiceDetails.Fax;
      // this.practiceNPI = this.practiceDetails.OrganizationNationalProviderIdentifier;
      this.statesList.map(code => {
        if (code.value === this.practiceDetails.StateCode) {
          this.practiceState = code;
        }
      })
      // })
      this.getFacilityDetails();
      this.getPhysicians();

    })
  }
  updatePracticeInfo() {
    this.practiceDetails.StateCode = this.practiceState.value;
    this.claimService.updatePhyPracticeInfo(this.practiceDetails).subscribe(res => {
      this.updateFacilityInfo();
      this.updatePhysicianInformation();
      this.showAlert("Updated successfully!");
      this.modal.close('Close click')
    })
  }
  updateFacilityInfo() {
    this.facilityDetails.StateCode = this.StateCode.value
    this.claimService.updateFacilityInfo(this.facilityDetails).subscribe(res => {
    })
  }
  updatePhysicianInformation(){
    
    let payload = {
      physicianId: this.physicianList.physicianId ? this.physicianList.physicianId : 0,
      physicianNPI: this.physicianList.physicianNationalProviderIdentifier ? this.physicianList.physicianNationalProviderIdentifier: '',
      LastUpdatedByUserId:  this.authStore.UserDetail.UserId ? this.authStore.UserDetail.UserId : '',
      DateLastUpdated: moment(new Date()).format('YYYY-MM-DD'),
      physicianLastName: this.physicianList.physicianLastName ? this.physicianList.physicianLastName:'',
      physicianFirstName: this.physicianList.physicianFirstName ? this.physicianList.physicianFirstName:''
    }
    this.claimService.updatePhysicianInformation(payload).subscribe(res => {
    })
  }
  // updatePhysicianInfo() {
  //   this.updatePhysicianInformation();

  //   this.physicianDetailById.NationalProviderIdentifier = this.physicianList.physicianNationalProviderIdentifier;
  //   this.claimService.updatePhysicianInfo(this.physicianDetailById).subscribe(res => {
  //   })
  // }
  getStates() {
    this.statesList = this.lookupService.getAllStates();
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.getClaimsList(currentpage)
  }
  showAlert(msg: string) {
    this.toaster.success(msg)
  }
}
