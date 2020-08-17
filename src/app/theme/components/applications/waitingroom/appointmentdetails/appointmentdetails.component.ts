import { Component, OnInit, ViewEncapsulation, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppointmentService } from "../../../../../services/workspace/appointment.service";
import { PatientmanagementService } from "../../../../../services/workspace/patient-management.service";
import { AppointmentlistComponent } from "../appointmentlist/appointmentlist.component";
import { CustomFormattedPatientAppointment } from "../../../../../model/custom-formatted-patient-appointment.model";
import { CustomFormattedPatient } from "../../../../../model/custom-formatted-patient.model";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { WaitingroommodalComponent } from "./waitingroommodal/waitingroommodal.component";
import { WaitingroomService } from "../../../../../services/waitingnroom/waitingroom.service";
import { AuthenticationStore } from "../../../../../../app/authentication";
import { EligibilityverificationComponent } from "../eligibilityverification/eligibilityverification.component";
import { ToastrService } from "ngx-toastr";
import { AddAppointmentComponent } from "../../../../../../app/pages/workspace/calendar/add-appointment/add-appointment.component";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-appointmentdetails",
  templateUrl: "./appointmentdetails.component.html",
  styleUrls: ["./appointmentdetails.component.scss"],
  providers: [AppointmentService],
  encapsulation: ViewEncapsulation.None
})
export class AppointmentdetailsComponent implements OnInit {
  // @ViewChild('objList') appointmentList;
  selectedRow: any;
  cachedata: any = [];
  selectedPatient = new CustomFormattedPatient();
  selectedAppointment = new CustomFormattedPatientAppointment();
  selectedTab = "Scheduled";
  result: any;
  cols: any = [];
  tabLabel: any = [];
  enableFilterInput: boolean = false;
  headerIndex: number;
  facilityList: any = [];
  selected_date: any;
  openModal: boolean = false;
  patient_documents: any = [];
  patient_documents_list: any = [];
  patient_details: any = { sex: null };
  innerTabLabel: any = [];
  payload: any;
  myQueue: boolean = false;
  enableButtons: boolean = true;
  selectedPatientId: any;
  tabIndex: any = { index: 0 };
  rooms: any = [];
  patientMessage: any = [];
  patientInsurance: any;
  showInsurance: boolean = true;
  patientAppointment: any;
  showAppointments: boolean = true;
  enableEdit: boolean = true;
  enableAppt: boolean = false;
  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private patientManagementService: PatientmanagementService,
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private waitingRoomService: WaitingroomService,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private authStore: AuthenticationStore
  ) {}
  ngOnInit() {
    this.getDuePatentList();
    this.getFacilityList();
    this.selected_date = moment(new Date()).format("MM/DD/YYYY");
    (this.innerTabLabel = [
      { name: "Patient Info" },
      { name: "Insurance" },
      { name: "Appointments" },
      { name: "Messages" }
    ]),
      (this.tabLabel = [
        { name: "Due Patient lists" },
        { name: "Current Patient lists" },
        { name: "Completed Patient Lists" },
        { name: "All Progress Notes" }
      ]),
      (this.cols = [
        { field: "patientname", header: "Patient Name", filter: true },
        { field: "username", header: "User", filter: true },
        { field: "appointmentstarttime", header: "Appt Time", filter: true },
        { field: "appointmenttype", header: "Type", filter: true },
        { field: "eligibility", header: "Eligibility" },
        { field: "check_in", header: "Check In" },
        { field: "Patient", header: "Co-pay Required" },
        { field: "User", header: "Co-pay Due" },
        { field: "scan_date", header: "Co-pay Paid" },
        { field: "doc_date", header: "$Bal" },
        { field: "account_summary", header: "Account Summary" },
        { field: "note", header: "Note" }
      ]);
    // this.facilityList = [
    //   {facilityName: 'All', value: 1},
    //   {facilityName: 'Grace clinic', value: 2},
    //   {facilityName: 'Happy Dent Clinic', value: 3},
    //   {facilityName: 'Test Facility', value: 4},
    // ]

    // console.log(this.selected_date === moment(new Date()).format('MM/DD/YYYY'));
  }
  reset() {
    // this.router.navigate(['pages']);
    this.activeModal.dismiss("Cross click");
  }
  onDateSelection() {
    if (
      moment(this.selected_date).format("MM/DD/YYYY") !==
      moment(new Date()).format("MM/DD/YYYY")
    ) {
      this.enableButtons = true;
      this.enableAppt = true;
    }
    if (
      moment(this.selected_date).format("MM/DD/YYYY") ===
      moment(new Date()).format("MM/DD/YYYY")
    ) {
      this.enableButtons = false;
      this.enableAppt = false;
    }
    this.getDuePatentList(this.selected_date);
  }

  OnRowSelected(select: any) {
    this.selectedAppointment = select[0];
    this.patientManagementService
      .getPatientCustomDetailById(this.selectedAppointment.patientId)
      .subscribe(resp => {
        this.cachedata = [...resp];
        this.selectedPatient = resp[0];
      });
    console.log(this.selectedPatient);
  }
  OnAppointmentTabSelection(selectedTab: string) {
    this.selectedTab = selectedTab;
    // this.appointmentList.ApplyFilter(this.selectedTab);
  }

  OnCancelClick() {
    this.appointmentService
      .CancelAppointment(
        this.selectedAppointment.appointmentid,
        "Cancelled by patient",
        1
      )
      .subscribe(resp => {
        this.cachedata = [...resp];
        this.result = resp;
      });
  }
  OnCheckIn() {
    this.appointmentService
      .CheckInAppointment(this.selectedAppointment.appointmentid, 1)
      .subscribe(resp => {
        this.cachedata = [...resp];
        this.result = resp;
      });
  }

  openForms(modalType, rowData) {
    if (modalType === "documnets") {
      const modalRef = this.modalService.open(WaitingroommodalComponent, {
        centered: true,
        size: "lg",
        windowClass: "modelStyle"
      });
      modalRef.componentInstance.name = "true";
      modalRef.componentInstance.openDocumentModal = true;
      modalRef.componentInstance.patientData = rowData;
    }
    if (modalType === "copay") {
      const modalRef = this.modalService.open(WaitingroommodalComponent, {
        centered: true,
        size: "lg",
        windowClass: "modelStyle"
      });
      modalRef.componentInstance.name = "true";
      modalRef.componentInstance.openCopayModal = true;
      modalRef.componentInstance.patientData = rowData;
    }
    if (modalType === "account_summary") {
      console.log("row data ", rowData);
      const modalRef = this.modalService.open(WaitingroommodalComponent, {
        centered: true,
        size: "lg",
        windowClass: "modelStyle"
      });
      modalRef.componentInstance.name = "true";
      modalRef.componentInstance.openAccountSummaryModal = true;
      modalRef.componentInstance.patientData = rowData;
    }
  }

  openSmModal(modalType, rowData) {
    const modalRef = this.modalService.open(WaitingroommodalComponent, {
      centered: true,
      size: "sm",
      windowClass: "modelStyle"
    });
    modalRef.componentInstance.name = "true";
    if (modalType === "forms") {
      modalRef.componentInstance.openFormsModal = true;
      modalRef.componentInstance.patientData = rowData;
    }
    if (modalType === "cancel_appt") {
      modalRef.componentInstance.openCancelApptModal = true;
      modalRef.componentInstance.apptId = rowData.appointmentid;
    }

    modalRef.componentInstance.loadEvent.subscribe(value => {
      if (value) {
        this.getDuePatentList(this.selected_date);
      }
    });
  }

  getRooms() {
    this.waitingRoomService.getRooms().subscribe((results: any) => {
      this.rooms = results;
    });
  }

  SelectedTab(event) {
    this.headerIndex = null;
    this.tabIndex = event;
    switch (event.index) {
      case 0:
        {
          (this.cols = [
            { field: "patientname", header: "Patient Name", filter: true },
            { field: "username", header: "User", filter: true },
            {
              field: "appointmentstarttime",
              header: "Appt Time",
              filter: true
            },
            { field: "appointmenttype", header: "Type", filter: true },
            { field: "eligibility", header: "Eligibility" },
            { field: "check_in", header: "Check In" },
            { field: "insurancecopayamount", header: "Co-pay Required" },
            { field: "insurancecopayamount", header: "Co-pay Due" },
            { field: "copayamount", header: "Co-pay Paid" },
            { field: "doc_date", header: "$Bal" },
            { field: "account_summary", header: "Account Summary" },
            { field: "note", header: "Note" }
          ]),
            (this.patient_documents_list = []);
          console.log(this.patient_documents);
          this.patient_documents.forEach(item => {
            console.log(item);
            if (item.appointmentstatus === "Scheduled") {
              this.patient_documents_list.push(item);
              console.log(this.patient_documents_list);
            }
          });
        }
        break;
      case 1:
        {
          (this.cols = [
            { field: "patientname", header: "Patient Name", filter: true },
            { field: "username", header: "User", filter: true },
            {
              field: "appointmentstarttime",
              header: "Appt Time",
              filter: true
            },
            { field: "appointmenttype", header: "Type", filter: true },
            { field: "room_name", header: "Room Names", filter: true },
            { field: "charts", header: "Chart" },
            { field: "insurancecopayamount", header: "Co-pay Due" },
            { field: "copayamount", header: "Co-pay Paid" },
            { field: "doc_date", header: "$Bal" },
            { field: "account_summary", header: "Account Summary" },
            { field: "NoOfPages", header: "Note" }
          ]),
            this.getRooms();
          this.patient_documents_list = [];
          this.patient_documents.map(item => {
            if (item.appointmentstatus === "Arrived") {
              this.patient_documents_list.push(item);
            }
          });
        }
        break;
      case 2:
        {
          (this.cols = [
            { field: "patientname", header: "Patient Name", filter: true },
            { field: "username", header: "User", filter: true },
            {
              field: "appointmentstarttime",
              header: "Appt Time",
              filter: true
            },
            { field: "check_in", header: "Check In Time", filter: true },
            { field: "appointmenttype", header: "Type", filter: true },
            { field: "Patient", header: "Co-pay" },
            { field: "doc_date", header: "$Bal" },
            { field: "account_summary", header: "Account Summary" },
            { field: "NoOfPages", header: "Note" }
          ]),
            (this.patient_documents_list = []);
          this.patient_documents.map(item => {
            if (item.appointmentstatus === "Completed") {
              this.patient_documents_list.push(item);
            }
          });
        }
        break;
      case 3: {
        (this.cols = [
          { field: "patientname", header: "Patient Name", filter: true },
          { field: "username", header: "User", filter: true },
          { field: "doc_date", header: "Type", filter: true },
          { field: "account_summary", header: "Account Summary" },
          { field: "NoOfPages", header: "Chart" }
        ]),
          this.getNovisitAppointments();
      }
    }
  }

  filterTableData(event, filter_type) {
    console.log(event, filter_type);
  }
  openFilter(index) {
    this.headerIndex = index;
    this.enableFilterInput = true;
  }

  getDuePatentList(selected_date?, facility_id?) {
    this.payload = {
      pAppointmentStartDateTime: selected_date
        ? moment(selected_date).format("YYYY-MM-DD 00:00")
        : moment(new Date()).format("YYYY-MM-DD 00:00"),
      sortEnumerator: 2,
      facilityId: facility_id ? facility_id : ""
    };
    this.patient_documents_list = [];
    if (this.myQueue) {
      this.waitingRoomService
        .getPhysicianId({ userId: this.authStore.UserDetail.UserId })
        .subscribe((results: any) => {
          this.payload.physicianId = results[0].PhysicianId;
          this.waitingRoomService
            .getDuePatentList(this.payload)
            .subscribe(results => {
              this.patient_documents = results;
              this.SelectedTab(this.tabIndex);
            });
        });
    } else {
      this.waitingRoomService
        .getDuePatentList(this.payload)
        .subscribe(results => {
          this.patient_documents = results;
          this.SelectedTab(this.tabIndex);
        });
    }
  }

  viewCharts(rowData?, check?) {
    if (check) {
      this.markAppCompleted(rowData);
    }
    this.activeModal.dismiss("Cross click");
    this.router.navigate(["/pages/chart"]);
  }

  getFacilityList() {
    this.appointmentService
      .GetCustomFormattedGenericFacilities()
      .subscribe(resp => {
        this.facilityList = resp;
      });
  }

  onFacilityChange(selectedFacility) {
    this.getDuePatentList(
      this.selected_date,
      selectedFacility ? selectedFacility.id : ""
    );
  }

  selecteRow: any = {};
  onExpand(_rowData) {
    this.selecteRow = {
      PatientId: _rowData.patientId,
      Name: _rowData.patientname,
      DateOfBirth: _rowData.patientdateofbirth,
      gender: _rowData.sex === true ? "Male" : "Female",
      phoneNo: _rowData.patientmobilephone,
      Address: _rowData.Address,
      Email1: _rowData.Email1,
      PhotoImage: _rowData.PatientImage
    };
    // console.log(_rowData)
    // this.getPatientMessage(_rowData.patientId);
    // this.getpatientappointment(_rowData);
    // this.getpatientinsurance(_rowData.patientId);
  }

  getPatientMessage(patientid) {
    let param = {
      // patientID: 35870
      patientID: patientid
    };
    this.patientMessage = [];
    this.patientManagementService.GetPatientMessages(param).subscribe(res => {
      this.patientMessage = res.Results;
    });
  }

  getpatientinsurance(patientid) {
    let param = {
      // 35871
      patientID: patientid
      // patientID: 35871
    };
    this.patientInsurance = null;
    this.patientManagementService.GetPatientInsurance(param).subscribe(res => {
      if (typeof res !== "undefined" && res.length > 0) {
        this.showInsurance = false;
        this.patientInsurance = res;
        console.log("insurance", this.patientInsurance);
      }
    });
  }
  getpatientappointment(rowData) {
    let param = {
      // 35870
      patientid: rowData.patientId
    };
    this.patientAppointment = null;
    this.patientManagementService
      .GetPatientAppointment(param)
      .subscribe(res => {
        if (typeof res !== "undefined" && res.length > 0) {
          this.patientAppointment = res;
          this.patientAppointment.appointmentstatus = rowData.appointmentStatus;
          this.showAppointments = false;
          console.log("appointment", this.patientAppointment);
        }
      });
  }

  onSelectedRow(_rowData) {
    console.log(_rowData);
    this.patient_details = _rowData;
    let date = this.datepipe.transform(
      _rowData.patientdateofbirth,
      "MM/dd/yyyy"
    );
    this.getAge(date);
    this.enableEdit = false;
    if (
      moment(this.selected_date).format("MM/DD/YYYY") ===
      moment(new Date()).format("MM/DD/YYYY")
    ) {
      this.enableButtons = false;
    } else {
      this.enableButtons = true;
    }
  }

  getAge(dateString) {
    console.log(dateString);
    let now = new Date();
    var yearNow = now.getFullYear();

    var dob = new Date(
      dateString.substring(6, 10),
      dateString.substring(0, 2) - 1,
      dateString.substring(3, 5)
    );

    var yearDob = dob.getFullYear();
    var yearAge = yearNow - yearDob;
    this.patient_details.age = yearAge;
  }

  getNovisitAppointments() {
    let payload = {
      Datetime: this.selected_date
        ? moment(this.selected_date).format("YYYY-MM-DD 00:00")
        : moment(new Date()).format("YYYY-MM-DD 00:00"),
      offset: 0,
      limit: 5
    };
    this.patient_documents_list = [];
    this.waitingRoomService
      .getNovisitAppointments(payload)
      .subscribe((results: any) => {
        this.patient_documents_list = results.Results;
      });
  }

  toggleButton(_rowData) {
    this.payload.physicianId = _rowData.physicianId;
    this.getDuePatentList(this.selected_date);
    // this.waitingRoomService.getAccountSummary(this.payload).subscribe(result=> {

    // })
  }

  onToggleQueue(toggle) {
    this.myQueue = toggle;
    this.getDuePatentList(this.selected_date);
  }

  verifyEligibility(rowData) {
    let payload = {
      appointmentId: rowData.appointmentid,
      patientId: rowData.patientId,
      physicianId: rowData.physicianId,
      insuranceOrder: 1,
      userId: rowData.userId,
      verificationDate: moment(new Date()).format("MM-DD-YYYY")
      // AppointmentStartTime: rowData.appointmentstarttime
    };
    this.appointmentService.eligibilityVerification(payload).subscribe(res => {
      const modalRef = this.modalService.open(
        EligibilityverificationComponent,
        { centered: true, size: "lg", windowClass: "modelStyle" }
      );
      modalRef.componentInstance.name = "true";
      modalRef.componentInstance.patientData = rowData;
    });
  }

  markAppCompleted(patient_details) {
    this.appointmentService
      .GetAppointmentById(patient_details.appointmentid)
      .subscribe((results: any) => {
        let payload = results[0];
        payload.AppointmentStatus = "Completed";
        payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
        payload.DateLastUpdated = moment(new Date()).format("YYYY-MM-DD");
        this.appointmentService.UpdateAppointment(payload).subscribe(result => {
          // this.toastr.success('added copay successfully');
          this.getDuePatentList(this.selected_date);
        });
      });
  }
  retuenApptToCheckIn(patient_details) {
    this.appointmentService
      .GetAppointmentById(patient_details.appointmentid)
      .subscribe((results: any) => {
        let payload = results[0];
        payload.AppointmentStatus = "Scheduled";
        payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
        payload.DateLastUpdated = moment(new Date()).format("YYYY-MM-DD");
        this.appointmentService.UpdateAppointment(payload).subscribe(result => {
          // this.toastr.success('added copay successfully');
          this.getDuePatentList(this.selected_date);
        });
      });
  }

  checkInAppt(patient_details) {
    this.appointmentService
      .GetAppointmentById(patient_details.appointmentid)
      .subscribe((results: any) => {
        let payload = results[0];
        payload.AppointmentStatus = "Arrived";
        payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
        payload.DateLastUpdated = moment(new Date()).format("YYYY-MM-DD");
        this.appointmentService.UpdateAppointment(payload).subscribe(result => {
          // this.toastr.success('added copay successfully');
          this.getDuePatentList(this.selected_date);
        });
      });
  }

  opneEditPatient(rowData) {
    this.selectedPatientId = rowData.patientId;
    this.router.navigate(
      [
        "/pages/workspace/patientmanagement/registerpatient",
        this.selectedPatientId
      ],
      { skipLocationChange: true }
    );
    this.activeModal.dismiss("Cross click");
  }
  openAddEditAppt(start = new Date(), end = new Date(), isUpdate = false) {
    let modalRef = this.modalService.open(AddAppointmentComponent, {
      centered: true,
      size: "lg",
      windowClass: "modelStyle"
    });
    modalRef.componentInstance.selectedData = {
      start,
      end,
      // facility: this.selectedFacility,
      // user: this.selectedUser,
      isUpdate,
      ApptObj: {}
    };
    modalRef.componentInstance.loadEvent.subscribe(value => {
      if (value) {
        this.getDuePatentList();
        modalRef.close();
      }
    });
  }
  selectedRoom: any;
  updateRoomAppt(_rowData) {
    this.appointmentService
      .GetAppointmentById(_rowData.appointmentid)
      .subscribe((results: any) => {
        let payload = results[0];
        payload.RoomId = this.selectedRoom.RoomId;
        //  payload.roomName = this.selectedRoom.RoomName;
        payload.DateLastUpdated = moment(new Date(), "YYYY-MM-DD");
        payload.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
        this.appointmentService.UpdateAppointment(payload).subscribe(result => {
          this.getDuePatentList(this.selected_date);
        });
      });
  }
}
