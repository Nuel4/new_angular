import { Component, OnInit, ViewEncapsulation, ViewChild, DebugNode } from '@angular/core';
import { GlobalState } from '../../../core';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { ToastrService } from 'ngx-toastr';
import { ReferringPhysicianService } from '../../../services/workspace/referring-physician.service'
import { RelatedOrganizationService } from '../../../services/administration/related-organization.service'
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule, } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefPhyDeleteModalComponent } from './ref-phy-delete-modal/delete-modal.component';

@Component({
  selector: 'app-referring-physician',
  templateUrl: './referring-physician-list.component.html',
  styleUrls: ['./referring-physician-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReferringPhysicianListComponent implements OnInit {

  data: any = [];
  cachedata: any = [];
  Index = 0;
  relOrg: any = [];
  cacheFilteRelOrgData: any = [];
  //ReferringPhysicianForm: FormGroup;
  RelOrgId = 0
  selectedrelorgid: any = { RelatedOrganizationId: 0 }
  Name: string = ''
  isLoader: boolean;
  RefPhysician: any[];
  TotalRecords: number;
  PageSize: number;
  patientName : string;
  // getting the value of referring physician Organization
  SelectedOrg: number;
  @ViewChild(DatatableComponent) tblrefPhysician: DatatableComponent;
  modalRef: any;

  constructor(private refPhyService: ReferringPhysicianService,
    private relOrgService: RelatedOrganizationService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal) {

    this.RefPhysician = [
      { field: 'ReferringPhysicianFirstName', header: 'Name' },
      { field: 'AddressLine1', header: 'Address' },
      { field: 'MainPhone', header: 'Main Phone' },
      { field: 'Email', header: 'Email' },
    ]
  }

  ngOnInit() {
    this.isLoader = true
    //this.createForm();
    this.loadReferringPhysician(this.Index);
    this.loadRelatedOrganization();
  }


  // createForm(){
  // 	this.ReferringPhysicianForm = this.fb.group({
  // 		RelOrgId: [""],
  // 		UserName: [""]
  // 	});
  // }

  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.loadReferringPhysician(this.Index)
  }

  loadReferringPhysician(index) {
    let filter = {
      offset: index,
      limit: 10,
      orderby: '',
      name: '',
      relorgid: 0
    }
    filter.name = this.Name
    filter.relorgid = this.selectedrelorgid.RelatedOrganizationId
    this.refPhyService.getReferringPhysicianPagedwithNameFilter(filter).subscribe(resp => {
      this.cachedata = [...resp.Results];
      this.cacheFilteRelOrgData = [...resp.Results];
      this.data = resp.Results;
      this.TotalRecords = resp.TotalItems;
      this.PageSize = resp.PageSize;
      this.isLoader = false
    });
  }
  updateFilter(event) {
    if (this.Name.length >= 3) {
      this.loadReferringPhysician(0);
    }
    if (this.Name.length == 0) {
      this.loadReferringPhysician(0);
    }
  }
  loadRelatedOrganization() {
    this.relOrgService.getActiveRelatedOrganizations().subscribe(resp => {
      resp.unshift({ RelatedOrganizationId: 0, RelatedOrganizationName: "All" })
      this.relOrg = resp;
    });
  }

  onAddreferringphysician(event) {
    this.router.navigate(['/pages/workspace/referringphysiciandetails', 0], { skipLocationChange: true });
  }

  onEditReferringPhysician(rowData) {

    this.router.navigate(['/pages/workspace/referringphysiciandetails', rowData.ReferringPhysicianId], { skipLocationChange: true });
  }

  onDelete(refphy) {
    this.refPhyService.deleteReferringPhysician(JSON.stringify(refphy)).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        this.loadReferringPhysician(this.Index);
        this.showSuccess(`Referring physician ${refphy.ReferringPhysicianLastName}, ${refphy.ReferringPhysicianFirstName} deleted successfully!`)
      }
    });

  }

  openDeleteModal(refphy) {
    this.modalRef = this.modalService.open(RefPhyDeleteModalComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' })
    this.modalRef.componentInstance.ConfirmDelete.subscribe((value) => {
      if (value) {
        this.onDelete(refphy)
        // this.modalRef.close()
      }
    })
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
}
