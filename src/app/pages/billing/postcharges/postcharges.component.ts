import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from "rxjs";
import { PhysicianService } from '../../../services/practice/physician.service'
import { SuperBillService } from '../../../services/billing/superbill.service'
import { AppointmentService } from '../../../services/workspace/appointment.service'
import { AuthenticationStore } from '../../../authentication';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule, } from '@angular/forms';
import { PatientmanagementService } from '../../../services/workspace/patient-management.service';
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component';
import { PostBillsService } from '../../../services/billing/postbills.services';
import { FacilityComponent } from '../../practice/facility/facility.component';
import * as moment from 'moment';
import { PostchargesModalComponent } from './postcharges-modal/postcharges-modal.component';
import { LetterService } from '../../../services/chart/letter.service'
import { ToastrService } from 'ngx-toastr';
import { PrescribeService } from '../../../services/chart/prescribe.service';
declare var $: any;

@Component({
  selector: 'app-postcharges',
  templateUrl: './postcharges.component.html',
  styleUrls: ['./postcharges.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostchargesComponent implements OnInit {

  @Input() position: number = 400;

  // @ViewChild('findPatient') private _selector: ElementRef;
  // @ViewChild('lgModal') private _poup: ElementRef;


  // declaring boolean variables
  private ShowPatientname: boolean = false;
  private DeletedAppointments: boolean = false;


  // declaring variables for table headers
  cols: any[];
  // this is a dummy variable for table data
  PostChargeBills: any[];
  enouterid = 0;
  // declaring array variable
  patientdata: any = [];
  public data: any = [];
  // postBill: any = { pPhysicianUserId: "" };
  physicianList: any = [];
  dateFrom = new Date();
  dateTo = new Date();
  pstCharg: any = {
    pAppointmentStartDateTime: this.dateFrom,
    pAppointmentEndDateTime: this.dateTo,
    pDisplayDeletedApptOnly: this.DeletedAppointments,
    pPhysicianId: 0,
    pPatientId: 0
  }
  public UserDetail;
public getPractice;
  public TemplateSections
  // array to store super bills
  Superbillsfork: any = [];
  superbillsnormal: any = [];


  // public settings = {
  //   selectMode: 'single',  //single|multi
  //   hideHeader: false,
  //   hideSubHeader: false,
  //   noDataMessage: 'No data found',
  //   columns: {
  //     date: {
  //       title: 'Date',
  //       type: 'number'
  //     },
  //     time: {
  //       title: 'Appointment Time',
  //       type: 'string'
  //     },
  //     patientName: {
  //       title: 'Patient Name',
  //       type: 'string'
  //     },
  //     Status: {
  //       title: 'Account Number',
  //       type: 'string'
  //     },
  //     physicianName: {
  //       title: 'Physician',
  //       type: 'string'
  //     },
  //     FacilityId: {
  //       title: 'Deactivation',
  //       type: 'number'
  //     }
  //   },
  //   pager: {
  //     display: true,
  //     perPage: 10
  //   }
  // };


  // declaring form
  PostChargesForm: FormGroup;


  // declaring array to hold list of physicians name
  public usersList: any = [];
  selectedPhysician: any;
  DateFrom = new Date();
  DateTo = new Date();
  patientDetails: any;

  constructor(private phyServ: PhysicianService,
    private pbs: PostBillsService,
    private superBillServ: SuperBillService,
    private appointmentServ: AppointmentService,
    private authStore: AuthenticationStore,
    private fb: FormBuilder,
    protected localStorage: LocalStorage,
    private _patientmanagementService: PatientmanagementService,
    private modalService: NgbModal,
    private ls: LetterService,
    private toastr: ToastrService,
    private pres: PrescribeService ) {
  }

  ngOnInit() {
    // this.getPatientDetails();
    this.getPractice = JSON.parse(sessionStorage.getItem("PracticeDetail"));
    this.UserDetail = JSON.parse(sessionStorage.getItem("UserDetail"));
    // this.dateFrom = moment(new Date()).format("YYYY-MM-DD HH:mm");
    // this.dateTo = moment(new Date()).format("YYYY-MM-DD HH:mm");
    // if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
      // $("#lgModal").modal('show');
      // const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      // modalRef.componentInstance.name = 'true';
      // modalRef.componentInstance.openPopUp = true;
      this.getTemplateGroupSections();
      this.GetPT();
    // }
    // else {
    //   // ((JSON.parse(sessionStorage.getItem("PatientDetail")) != null)) {
    //   this.GetPT();
    // }
    // $("#lgModal").modal('show')

    // if(JSON.parse(sessionStorage.getItem("PatientDetail")) === null){
    //   $("#lgModal").modal('show');
    // }
    // this.createForm();

    this.getData((data) => {
      this.data = data;
      console.log("value of data")
      console.log(this.data)
    });
    this.cols = [
      { field: 'date', header: 'Date' },
      { field: 'time', header: 'Appointment Time' },
      { field: 'patientName', header: 'Patient Name' },
      { field: 'ssn', header: 'Account Number' },
      { field: 'physicianName', header: 'Physician' },
    ];
    this.PostChargeBills = [
      { Date: 'car1', Time: '2019', PTName: 'br1', AccNo: 'red', Physician: 'Test, Login' },
      { Date: 'car2', Time: '2018', PTName: 'br2', AccNo: 'greed', Physician: 'Test, Login' },
      { Date: 'car3', Time: '2017', PTName: 'br3', AccNo: 'blue', Physician: 'Test, Login' },
      { Date: 'car4', Time: '2016', PTName: 'br4', AccNo: 'orange', Physician: 'Test, Login' },
    ];
    this.pstCharg = {
      pAppointmentStartDateTime: this.dateFrom,
      pAppointmentEndDateTime: this.dateTo,
      pDisplayDeletedApptOnly: this.DeletedAppointments,
      pPhysicianId: 0,
      pPatientId: 0
    };
    this.postBills();
    // this.GetPT();
  }
  // getting patient from session storage
  GetPT() {
    if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
      // $("#lgModal").modal('show');
      const modalRef = this.modalService.open(ModelviewComponent,{centered: true, size: 'lg', windowClass: 'modelStyle',})
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.openPopUp = true;
      modalRef.componentInstance.ComponentName = 'post'
      modalRef.componentInstance.patientdatapost.subscribe(res => {
        this.patientDetails = res
        this.patientDetails.DateCreated = new Date(this.patientDetails.DateCreated);
        this.patientDetails.DateLastUpdated = new Date(this.patientDetails.DateCreated);
        this.patientDetails.DateOfBirth = new Date(this.patientDetails.DateOfBirth);
        this.patientDetails.FullName = this.patientDetails.LastName + ", " + this.patientDetails.FirstName
        console.log("patient data is: ");
        console.log(this.patientDetails);

        this.ShowPatientname = true;
        let facilityId = this.patientDetails.DefaultFacility;
        this.pstCharg = {
          pAppointmentStartDateTime: this.dateFrom,
          pAppointmentEndDateTime: this.dateTo,
          pDisplayDeletedApptOnly: this.DeletedAppointments,
          pPhysicianId: 0,
          pPatientId: this.patientDetails.PatientId
        }
        console.log("Patient's default facility is: ", this.patientDetails.DefaultFacility);
        let phyId = {
          facilityId: facilityId,
        }
        this.pbs.getPhyminbyFacID(phyId).subscribe(resp => {
          this.usersList = resp
          for (let i = 0; i < this.usersList.length; i++) {
            let FN = this.usersList[i].firstname
            let LN = this.usersList[i].lastname
            let FullN = LN + ", " + FN
            this.usersList[i].FullName = FullN
            // this.usersList[i].date = moment(this.usersList[i].date).format('MM-DD-YYYY')
          }
          console.log("user lists are")
          console.log(this.usersList)
        });
      })
    }
    if ((JSON.parse(sessionStorage.getItem("PatientDetail")) != null)) {
    // while((sessionStorage.getItem("PatientDetails")) != null){
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"));
    this.patientDetails.DateCreated = new Date(this.patientDetails.DateCreated);
    this.patientDetails.DateLastUpdated = new Date(this.patientDetails.DateCreated);
    this.patientDetails.DateOfBirth = new Date(this.patientDetails.DateOfBirth);
    this.patientDetails.FullName = this.patientDetails.LastName + ", " + this.patientDetails.FirstName
    console.log("patient data is: ");
    console.log(this.patientDetails);
    this.ShowPatientname = true;
    let facilityId = this.patientDetails.DefaultFacility;
    this.pstCharg = {
      pAppointmentStartDateTime: this.dateFrom,
      pAppointmentEndDateTime: this.dateTo,
      pDisplayDeletedApptOnly: this.DeletedAppointments,
      pPhysicianId: 0,
      pPatientId: this.patientDetails.PatientId
    }
    let phyId = {
      facilityId: facilityId,
    }
    console.log("Patient's default facility is: ", this.patientDetails.DefaultFacility,facilityId);
    this.pbs.getPhyminbyFacID(phyId).subscribe(resp => {
      this.usersList = resp
      for (let i = 0; i < this.usersList.length; i++) {
        let FN = this.usersList[i].firstname
        let LN = this.usersList[i].lastname
        let FullN = LN + ", " + FN
        this.usersList[i].FullName = FullN
        // this.usersList[i].date = moment(this.usersList[i].date).format('MM-DD-YYYY')
      }
      console.log("user lists are")
      console.log(this.usersList)
    });
    // this.getPhysicianminDetails(phyId);

  }
  }

  //  getPhysicianminDetails(phyId)
  //  {

  //    return this.pbs.getPhyminbyFacID(phyId).subscribe(resp =>
  //     {
  //       this.usersList = resp
  //       console.log("user lists are")
  //       console.log(this.usersList)
  //       for(let i=0;i<this.usersList.length;i++)
  //       {
  // let FN = this.usersList[i].firstname
  // let LN = this.usersList[i].lastname
  // let FullN = LN + ", " + FN
  // this.usersList[i].FullName = FullN
  //       }
  //     });

  // DefaultFacility
  // }


  // createForm(){
  //   this.PostChargesForm = this.fb.group({
  //     DateFrom: null,
  //     DateTo: null,
  //     userProvider: null,
  //   });
  // }
  public getData(data) {

    //this.ngProgress.start()    
    let physicians = this.phyServ.getPhysicianWithMinimumDetails();
    let superBills = this.superBillServ.getSuperBillData();
    forkJoin([physicians, superBills]).subscribe(results => {
      this.physicianList = results[0];
      this.Superbillsfork = results[1];
      data(results[1]);
      console.log("value of forkjoin 0 is: ", this.physicianList)
      console.log("value of superbills inside forkjoin is:", this.Superbillsfork)
    });
    this.superBillServ.getSuperBills().subscribe(resp => {
      this.superbillsnormal = resp
      console.log("value of getsuperbills is: ")
      console.log(this.superbillsnormal)
      //this.ngProgress.done()

      //this.data = resp;

    });

  }

  getTemplateGroupSections(){
    let params = {
      templateGroupId: this.getPractice.PostChargesDefaultBillingTemplateGroupId
    }

    this.ls.getGroupSection(params).subscribe(res=>{
      this.TemplateSections = res
      console.log("value of template sections is",this.TemplateSections)
    })

  }
  postBills() {
    this.pstCharg.pAppointmentStartDateTime = moment(this.dateFrom).format("YYYY-MM-DD HH:mm");
    this.pstCharg.pAppointmentEndDateTime = moment(this.dateTo).format("YYYY-MM-DD HH:mm");
    this.pstCharg.pPatientId = this.patientDetails? this.patientDetails.PatientId: null;
    this.pstCharg.pPhysicianId = this.selectedPhysician?this.selectedPhysician.physicianid: this.patientDetails.DefaultPhysician? this.patientDetails.DefaultPhysician : 0 ;
   this.pstCharg.pDisplayDeletedApptOnly = this.DeletedAppointments,
   console.log("value of params in post bills is",this.pstCharg)
    this.appointmentServ.postAppointmentsToBeBilled(this.pstCharg).subscribe(resp => {
      
      //this.ngProgress.done()
      this.data = resp;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].date = moment(this.data[i].date).format('MM-DD-YYYY')
        this.data[i].time = moment(this.data[i].time).format('MM-DD-YYYY')
      }
      console.log("value of appointments to be billed",resp)
    });

  }

  // loading physician name details
  // getUsers() {
  //   // console.log('USER Lists 1');
  //   this.pbs.getPhysicianMinimumDetails().subscribe(resp => {
  //     this.usersList = resp;
  //     console.log('USER LISTs 2',this.usersList);
  //     // console.log(this.usersList);
  //   });
  // }


  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  showPostCharges(value?){
    console.log("value of row data",value);
    if(this.patientDetails){
      const modRef = this.modalService.open(PostchargesModalComponent, {size:'lg', centered: true});
      modRef.componentInstance.patientDetails = this.patientDetails;
      modRef.componentInstance.usersList = this.usersList;
      modRef.componentInstance.enouterid = this.enouterid
      modRef.componentInstance.TemplateSections = this.TemplateSections
      modRef.componentInstance.getPractice = this.getPractice;
      modRef.componentInstance.billsdata = value
      modRef.componentInstance.SavedData.subscribe(resp=>{
        console.log("value of resopnse",resp);
        if(resp){
        let isicdparam = {
          encounterId: resp.EncounterId,
          patientId: this.patientDetails.PatientId
        }
        let perparam = {pEncounterId: resp.EncounterId};
        let CFADparam = {appointmentId: resp.AppointmentId};
        let SICparam = {encounterId: resp.EncounterId};
this.pres.getPatientEcnounter(perparam).subscribe(response => {console.log("value of getPatientEncounter response",response)});
 this.superBillServ.getAppointmentDetailsbyid(CFADparam).subscribe(response => {console.log("value of getPatientEncounter response",response)});
this.pres.GetSelectedIcdCodes(SICparam).subscribe(response => {console.log("value of getPatientEncounter response",response)});
 this.pres.getAdditionalBillDet(SICparam).subscribe(response => {console.log("value of getPatientEncounter response",response)});
 this.superBillServ.isICD(isicdparam).subscribe(response => {console.log("value of getPatientEncounter response",response)});
      }
      })
      modRef.componentInstance.loadEvent.subscribe((load) => {
if(load){
  this.postBills();
}
      })
  }
  else {
    this.toastr.error("Please select a Patient First");
  }
}

  public onRowSelect(event) {
    // console.log(event);
  }

  public onUserRowSelect(event) {
    //console.log(event);   //this select return only one page rows
  }

  public onRowHover(event) {
    //console.log(event); 
  }
  showBills() {

  }

  // to clear all the data and once again initialize it from starting
  ClearData() {
    this.DateFrom = null;
    this.DateTo = null;
    this.selectedPhysician = " ";
    this.DeletedAppointments = false;
  }

  Deactivateappointments(rowData){
    console.log("value of rowdata",rowData)
    let params = {
      pAppointmentId: rowData.appointmentId,
      pDoNotBill: true,
      pUpdatedByUserId: this.UserDetail.UserId
    }

    console.log("value of params",params)
    this.appointmentServ.UpdateAppointmentInfo(params).subscribe(resp=>{
      console.log("value of Update Appointment Info response is",resp)
        this.postBills();
    })
  }
}
