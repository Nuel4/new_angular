import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpWrapperService, GlobalState, Global } from '../../../core';
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { PatientDto } from './registerpatient/patientdetails/patientDetailForm.model';
import { PatientmanagementService } from '../../../services/workspace/patient-management.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddAppointmentComponent } from '../calendar/add-appointment/add-appointment.component';


@Component({
  selector: 'app-viewpatient',
  templateUrl: './patient-management.component.html',
  styleUrls: ['./patient-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientManagementComponent implements OnInit {
  validate: boolean = false;
  patientdata: PatientDto[];
  patientMasterData: any = [];
  cachedata: any = [];
  patientDetailIndex = 0;
  totalRecords: any;
  patientName: any = '';
  selectedPatientId: any;
  rows: any;
  isLoader: boolean;
  loading: boolean
  @ViewChild(DatatableComponent) tblpatient: DatatableComponent;
  expanded: any = {};
  cols: any = [];
  patientMessage: any = [];
  isDisable: boolean = false;
  totalMessage: any;
  patientInsurance: any;
  patientAppointment: any;
  order: number = 0;
  appointmentStatus: any = "";
  showInsurance: boolean = true;
  showAppointments: boolean = true;
  modalRef: any;
  apptStatus: any;
  selectedApptStatus: any = { appointmentStatus: 'Scheduled' }
  facility: any;
  user: any;
  constructor(private _patientmanagementService: PatientmanagementService, private modalService: NgbModal, private router: Router) {

  }
  ngOnInit() {
    this.isLoader = true;
    this.patientName = '';
    this.cols = [
      { field: 'Name', header: 'Patient Name' },
      { field: 'DateOfBirth', header: 'Date of birth' },
      { field: 'gender', header: 'Sex' },
      { field: 'phoneNo', header: 'Phone' },
    ]
    this.loadpatients();
  }

  loadpatients() {
    this.loading = true
    this._patientmanagementService.getPatientDetailsByPage(this.patientDetailIndex, this.patientName).subscribe(resp => {
      this.patientMasterData = resp.Results;
      this.totalRecords = resp.TotalItems;
      for (let i = 0; i < this.patientMasterData.length; i++) {
        if (this.patientMasterData[i].FirstName != null && this.patientMasterData[i].LastName != null) {
          this.patientMasterData[i].Name = this.patientMasterData[i].FirstName.concat(' ' + this.patientMasterData[i].LastName)
        }
        if (this.patientMasterData[i].PrimaryAddressLine1 != null && this.patientMasterData[i].PrimaryAddressLine2 != null) {
          this.patientMasterData[i].Address = this.patientMasterData[i].PrimaryAddressLine1.concat(' ' + this.patientMasterData[i].PrimaryAddressLine2)
        }
        if (this.patientMasterData[i].Sex == true) {
          this.patientMasterData[i].gender = "Male"
        } else {
          this.patientMasterData[i].gender = "Female"
        }
        this.patientMasterData[i].DateOfBirth = this.parseDate(this.patientMasterData[i].DateOfBirth)
        this.patientMasterData[i].phoneNo = this.patientMasterData[i].HomePhone ? this.patientMasterData[i].HomePhone : (this.patientMasterData[i].MobilePhone ? this.patientMasterData[i].MobilePhone : this.patientMasterData[i].WorkPhone)
      }
      this.isLoader = false;
      this.loading = true;
    });
  }
  updateFilter(event) {
    if (this.patientName.length >= 3) {
      this.loadpatients();
    }
    if (this.patientName.length == 0) {
      this.loadpatients();
    }
  }
  updateFilterByButton() {
    this.loadpatients();
  }
  parseDate(date) {
    let d = new Date(Date.parse(date));
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  onAddPatient(event) {
    this.router.navigate(['/pages/workspace/patientmanagement/registerpatient', 0], { skipLocationChange: true });
  }

  onEditPatient(rowData) {
    this.selectedPatientId = rowData.PatientId
    this.router.navigate(['/pages/workspace/patientmanagement/registerpatient', this.selectedPatientId], { skipLocationChange: true });

  }
  paginate(event) {
    const index = (event.first / event.rows);
    this.patientDetailIndex = index
    this.loadpatients();
  }

  getPatientMessage(patientid) {
    let param = {
      // patientID: 35870
      patientID: patientid
    }
    this.patientMessage = [];
    this._patientmanagementService.GetPatientMessages(param).subscribe(res => {
      this.patientMessage = res.Results;
    });
  }
 
  disableEdit() {
    this.isDisable = true
  }
  openmodal(rowData) {
    // start = new Date, end = new Date, isUpdate = false,
    this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
 
    this.modalRef.componentInstance.selectedData = {
      start: new Date(),
      end: new Date(),
      facility: this.facility,
      user: this.user,
      isUpdate: false,
      ApptObj: rowData,
    }
    this.modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        // this.loadAppointments()
        this.modalRef.close()
      }
    })
  }

  openEditModal(ApptObj, isCancel, isUpdate) {
    if (isUpdate) {
      this.loadFacility(ApptObj)
    }
    if (isCancel) {
      this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' })
      this.modalRef.componentInstance.selectedData = {
        isCancel,
        isUpdate,
        ApptObj,
      }
      this.modalRef.componentInstance.loadEvent.subscribe((value) => {
        if (value) {
          // this.loadAppointments()
          this.modalRef.close()
        }
      })
    }
  }

  loadFacility(ApptObj) {
    ApptObj.facility_id = ApptObj.facilityid
    this._patientmanagementService.GetCustomFormattedGenericFacilities().subscribe(resp => {
      resp.map(obj => {
        if (obj.id == ApptObj.facilityid) {
          this.facility = obj
        }
      })
      this.getUserById(ApptObj)
    })
  }

  getUserById(ApptObj) {
    this._patientmanagementService.getUserById(ApptObj.userId).subscribe(resp => {
      this.user = resp
      this.modalRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
      this.modalRef.componentInstance.selectedData = {
        start: ApptObj.StartTime,
        end: ApptObj.EndTime,
        facility: this.facility,
        user: this.user,
        isUpdate: true,
        ApptObj,
      }
      this.modalRef.componentInstance.loadEvent.subscribe((value) => {
        if (value) {
          // this.loadAppointments()
          this.modalRef.close()
        }
      })
    })
  }
}

