import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { ImmunzScheService } from './../../../services/chart/immunzsche.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { element } from '@angular/core/src/render3/instructions';
import { PatientImmuniation } from './../../../model/Chart/Patient-Immunization.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditImmunzComponent } from './edit-immunz/edit-immunz.component';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';

declare var $: any;

@Component({
  selector: 'app-immunz-sche',
  templateUrl: './immunz-sche.component.html',
  styleUrls: ['./immunz-sche.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImmunzScheComponent implements OnInit {
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  storedPatient: any
  storeUser: any
  vaccineCols: any
  selectedCategory: any
  pmhCategories = []
  immunList: any
  VaccineList: any = []
  ImmIndex: number = 0
  VacIndex: number = 0
  ImmTotalRecords: number;
  ImmPageSize: number;
  VacTotalRecords: number;
  VacPageSize: number;
  isedit: boolean;
  PatientImmuniationID: number
  ImmuniationObj: PatientImmuniation
  selectedVaccine: any
  modalRef: any;
  isenableBtn: boolean = false;
  constructor(private modalService: NgbModal, 
    private immuScheService: ImmunzScheService,
     private router: Router,
      private toastr: ToastrService,
      private route: ActivatedRoute,
      private fb: FormBuilder) {

  }

  ngOnInit() {
    this.isedit = true
    this.storedPatient = JSON.parse(sessionStorage.getItem('PatientDetail'))
    this.storeUser = JSON.parse(sessionStorage.getItem('UserDetail'))
    this.ImmIndex = 0
    this.VacIndex = 0
    this.loadpmhCategories()
    this.getImmunization()


    if(this.route.snapshot.routeConfig.path === "immunz-sche"){
      this.isenableBtn = true;
    }
    if(this.PEValueObj){
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
  }

  onAddSchdule() {
    if (this.VaccineList.count != 0) {
      if (!this.selectedVaccine) {
        this.VaccineList.map((element) => {
          this.ImmuniationObj = {
            PatientId: this.storedPatient.PatientId,
            MrPatientEncounterId: null,
            MrImmunizationTypeId: element.mr_immunization_type_id,
            MrImmunizationBatchId: null,
            PatientDeclinedUnsureAboutPastImmunization: '0',
            Vaccine: element.mr_immunization_type,
            MonthAdministered: null,
            YearAdministered: null,
            DateAdministered: null,
            RouteId: element.route_id,
            AdministrationSite: element.admin_site,
            GivenByExternal: '',
            GivenByInternalUserId: null,
            Manufacturer: element.manufacturer,
            LotNumber: element.lot_number,
            EducationDate: null,
            Comments: '',
            DateCreated: new Date(),
            CreatedByUserId: this.storeUser.UserId,
            DateLastUpdated: new Date(),
            LastUpdatedByUserId: this.storeUser.UserId,
            TimestampStartOfAdministration: null,
            AdministeredAmount: element.admin_amount,
            AdministeredUnits: element.units,
            ManufacturerCode: '',
            ProductExpirationDate: null,
            Status: 'Due',
            EducationInformationGiven: null,
            ImmunizationInjectionOrderId: null,
            SubmittedtoImmunizationRegistry: null,
            OrderingPhysicianId: null,
            MrTemplateId: null,
            MrTemplateSectionId: null,
            MrFormFieldId: null,
            IntervalTypeId: element.interval_type_id,
            MinInterval: element.min_interval,
            MaxInterval: element.max_interval,
            Drug: '',
            Agent: '',
            IsActive: true,
            DueDate: null,
            MrImmunizationScheduleHeaderId: element.mr_immunization_schedule_header_id,
            Active: true
          }
          this.PEValueObj.push(this.ImmuniationObj);
          this.immuScheService.PosttMrPatientImmunization(this.ImmuniationObj).subscribe(resp => {
            this.showSuccess('All Immunizations are added.')
            this.getImmunization(0)
          });
        })
      } else {
        this.ImmuniationObj = {
          PatientId: this.storedPatient.PatientId,
          MrPatientEncounterId: null,
          MrImmunizationTypeId: this.selectedVaccine.mr_immunization_type_id,
          MrImmunizationBatchId: null,
          PatientDeclinedUnsureAboutPastImmunization: '0',
          Vaccine: this.selectedVaccine.mr_immunization_type,
          MonthAdministered: null,
          YearAdministered: null,
          DateAdministered: null,
          RouteId: this.selectedVaccine.route_id,
          AdministrationSite: this.selectedVaccine.admin_site,
          GivenByExternal: '',
          GivenByInternalUserId: null,
          Manufacturer: this.selectedVaccine.manufacturer,
          LotNumber: this.selectedVaccine.lot_number,
          EducationDate: null,
          Comments: '',
          DateCreated: new Date(),
          CreatedByUserId: this.storeUser.UserId,
          DateLastUpdated: new Date(),
          LastUpdatedByUserId: this.storeUser.UserId,
          TimestampStartOfAdministration: null,
          AdministeredAmount: this.selectedVaccine.admin_amount,
          AdministeredUnits: this.selectedVaccine.units,
          ManufacturerCode: '',
          ProductExpirationDate: null,
          Status: 'Due',
          EducationInformationGiven: null,
          ImmunizationInjectionOrderId: null,
          SubmittedtoImmunizationRegistry: null,
          OrderingPhysicianId: null,
          MrTemplateId: null,
          MrTemplateSectionId: null,
          MrFormFieldId: null,
          IntervalTypeId: this.selectedVaccine.interval_type_id,
          MinInterval: this.selectedVaccine.min_interval,
          MaxInterval: this.selectedVaccine.max_interval,
          Drug: '',
          Agent: '',
          IsActive: true,
          DueDate: null,
          MrImmunizationScheduleHeaderId: this.selectedVaccine.mr_immunization_schedule_header_id,
          Active: true
        }
        if(this.PEValueObj){
        this.PEValueObj.push(this.ImmuniationObj);
        }
        this.immuScheService.PosttMrPatientImmunization(this.ImmuniationObj).subscribe(resp => {
          this.showSuccess('Selected Immunizations are added.')
          this.getImmunization(0)
        });
      }
    } else {
      this.showError('Err: No Data in Vaccine Interval.')
    }

  }

  dateformater(date) {
    let d = new Date(date);
    return d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate()
  }

  paginateImm(event) {
    const index = (event.first / event.rows);
    this.ImmIndex = index
    this.getImmunization(this.ImmIndex)

  }
  paginateVac(event) {
    const index = (event.first / event.rows);
    this.VacIndex = index
    this.loadVacinne(this.VacIndex)
  }

  loadpmhCategories() {
    this.immuScheService.GetAllImmunizationSchduleHeader().subscribe(resp => {
      resp.unshift({ MrImmunizationScheduleHeader1: 'None', MrImmunizationScheduleHeaderId: 0 })
      this.pmhCategories = resp;
    });
  }

  getImmunization(index = 0) {
    let filter = {
      limit: 5,
      offset: index,
      patientid: this.storedPatient.PatientId
    }
    this.immuScheService.GetPatientImmunizationsByPatientIdWithPaged(filter).subscribe(resp => {
      this.immunList = resp.Results;
      this.ImmTotalRecords = resp.TotalItems;
      this.ImmPageSize = resp.PageSize;
    });
  }

  loadVacinne(index = 0) {
    let filter = {
      limit: 5,
      offset: index,
      headerid: this.selectedCategory ? this.selectedCategory.MrImmunizationScheduleHeaderId : 0
    }
    this.immuScheService.GetMrImmunizationScheduleIntervalByScheduleByHeaderIdWithPagination(filter).subscribe(resp => {
      this.VaccineList = resp.Results;
      this.VacTotalRecords = resp.TotalItems;
      this.VacPageSize = resp.PageSize;
    });
  }

  routeToEditImm(id, isTick = false) {
    this.modalRef = this.modalService.open(EditImmunzComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
    this.modalRef.componentInstance.PatientImmuniationID = id
    this.modalRef.componentInstance.Status = isTick
    this.modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.getImmunization()
      }
    })
  }

  showSuccess(msg) {
    this.toastr.success(msg, 'Success Message');
  }

  showError(msg) {
    this.toastr.error(msg, 'Error Message');
  }

  showWarring(msg) {
    this.toastr.warning(msg, 'Warring Message');
  }

}
