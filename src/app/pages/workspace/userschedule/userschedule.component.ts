import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, Input, NgModule, CUSTOM_ELEMENTS_SCHEMA,Output,EventEmitter } from '@angular/core';
import { AuthenticationStore } from '../../../authentication';
import { RouterModule, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
// import { FormGroup, ReactiveFormsModule, FormControl, FormBuilder, AbstractControl, Validators, FormsModule, } from '@angular/forms';
import { PatientmanagementService } from '../../../services/workspace/patient-management.service';
import { SelectItem } from 'primeng/api';
import { UserSchedule } from "../../../model/Workspace/UserSchedule.model";
import * as moment from 'moment';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { userscheduleform } from './userscheduleform.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-userschedule',
  templateUrl: './userschedule.component.html',
  styleUrls: ['./userschedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserscheduleComponent implements OnInit {
  @Output() loadEvent: EventEmitter<any> = new EventEmitter() 
  // declaring arrays
  // array to hold all the physician lists
  public phyList: any = [];
  // Array to hold list of all the facility details
  public facilityList: any = [];
  // variable to hold the Facility Details of selected Facility oly one
  public selectedFacility: any;
  // variable to hold the Result of facility details Search by name
  public selectedFacilityList: any = [];
  // variable to hold the Result of facility details Search
  public FacilityListsresult: any = [];
  // variable to hold the schedule list 
  public schList: any = [];
  // variable to hold the lists of time slots
  public timeSlotList: any = [];
  // variable to hold the users lists
  public usersList: any = [];
  // vairable to hold the temp lists
  public tempList: any = [];
  public data: any = [];
  public facPhyList: any = [];
  // array variable with pagination
  public isNew: boolean;
  public faclistpag: any = [];
  userScheduleSlots: any = { createdUserId: '', userId: '', calUserId: '' };
  public Params: any;
  sunFrom: Date;
  sunTo: Date;
  sunLunchFrom: Date;
  sunLunchTo: Date;
  todayDate: Date;
  // Declaring value for Selected week of month
  private selectedWeek: any;
  testParam: any = [];
  public tDate: Date;
  public usrFacId;
  public PhysicianId;
  Weeknumber: any = [];
  // private formSumitAttempt: boolean;
  Dialogvalue: any;
  Week: boolean = true;
SelWeek;
  // declaring form
  // public UserScheduleForm: FormGroup;

  //dummy variable
  display: boolean = false;
  disablecheckbox: boolean = true
  usrsch: UserSchedule[] = [];
  userschedule: any = {};
  selectedUser: any = {};
  

  // Declaring checkboxes
  public Sun: boolean = true;
  public Mon: boolean = true;
  public Tue: Boolean = true;
  public Wed: Boolean = true;
  public Thu: Boolean = true;
  public Fri: Boolean = true;
  public Sat: Boolean = true;
  public Phy: Boolean = true;
  public weekdrop: Boolean = true;
  facilityData: any = {};
  facilitySelected: any = {};
  weekSelected: any = {};
  daysOfWeek1: any = ["Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"];

  constructor(private _patientmanagementService: PatientmanagementService,
    private modal: NgbActiveModal,
    private router: Router,
    private toastr: ToastrService,private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.setweekno();
    this.userschedule = {
      selectedWeek: null,
      userProviderId: null,
      selectedFacility: null,
    }
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    for (let i = 0; i < this.daysOfWeek1.length; i++) {
      let obj = new UserSchedule();
      obj.DayOfWeek = this.daysOfWeek1[i];
      obj.active = false;
      this.usrsch.push(obj);
    }
    this.selectedWeek = "NW";
    this.facilityData = JSON.parse(sessionStorage.getItem('UserDetail'));
    this.getFacilityList();
  }

  setweekno() {
    this.Weeknumber.push({
      label: "All Weeks",
      value: "All Weeks"
    });
    this.Weeknumber.push({
      label: "First Week",
      value: "First Week"
    });
    this.Weeknumber.push({
      label: "Second Week",
      value: "Second Week"
    });
    this.Weeknumber.push({
      label: "Third Week",
      value: "Third Week"
    });
    this.Weeknumber.push({
      label: "Fourth Week",
      value: "Fourth Week"
    });
    this.Weeknumber.push({
      label: "Fifth Week",
      value: "Fifth Week"
    });
    this.Weeknumber.push({
      label: "Sixth Week",
      value: "Sixth Week"
    });
  }
  //getting all the facilityLists
  getFacilityList() {      
    this._patientmanagementService.getFacilityDetails().subscribe(resp => {
      this.facilityList = resp
      this.facilityList.forEach((item)=>{
        if(item.FacilityId === this.facilityData.PreferredFacility1){
          this.facilitySelected = item;
          this.SelectFacility(item);
        }
      })
    });
  }


  SelectFacility(selectedFacility) {
    let temp
    this.usrFacId = selectedFacility.FacilityId;
    temp = {
      FacilityID: selectedFacility.FacilityId
    };
    
    this._patientmanagementService.getPhyminDtFacID(temp).subscribe(resp => {
      this.usersList = resp.map(item => ({
        ...item,
        fullName: item.lastname + ' ,' + item.firstname
      }));
      this.usersList.forEach((element)=>{
        if(element.userid === this.facilityData.UserId){
          this.selectedUser = element;
          this.weekSelected = {
            label: "All Weeks",
            value: "All Weeks"
          };
          this.PhySelect(true);
        }
      })
      this.Phy = false;
      if (this.usersList.length === 0) {
        this.showInfo("No records found");
      }
    });
    this.Sun = true;
    if (this.weekdrop === false) {
      let Params = {
        pFacilityId: this.usrFacId,
        pUserId: this.PhysicianId,
        weekOfMonth: this.SelWeek
      }
      this.UserScheduleTimings(Params);
    }
  }
  // selectedFacility
  LoadFacility(selectedFacility) {
    let Facility;
    if (!selectedFacility) {
      Facility = {
        pFacilityName: "a"
      }
    } else {
      Facility = {
        pFacilityName: selectedFacility
      }
    }
    this.getFacilities(Facility);
  }
  getFacilities(Facility) {
    this._patientmanagementService.getFacilitieswithFacilitiesName(Facility).subscribe(resp => {
      this.selectedFacilityList = resp
      this.setweekno()
      if(this.userschedule.selectedFacility === null){
        this.usersList = [];
        // this.Weeknumber = [];
        this.userschedule.selectedWeek = null
        this.Phy = true;
        this.Week = true;
      }
    });
  }


  handleClick(userFacilityId) {
    this.usrFacId = userFacilityId;
    this.usersList = [];
    this._patientmanagementService.getPhyminDtFacID(this.usrFacId).subscribe(resp => {
      this.usersList = resp;
      this.Phy = false;
      for (let i = 0; i < this.usersList.length; i++) {
        this.usersList[i].FullName = this.usersList[i].lastname + ", " + this.usersList[i].firstname;
      }
    });
    this.Sun = true;
    if (this.weekdrop === false) {
      this.Params = {
        pFacilityId: userFacilityId.FacilityId,
        pUserId: this.PhysicianId
      }
      this.UserScheduleTimings(this.Params);
    }
  }



  onCancel() {
    console.log( this.router.url)
    if( this.router.url === '/pages/profile'){
      this.modal.close();
    } else {
      this.router.navigate(['/pages/workspace']);
    }
  }

  // function for onchange of physician value
  PhySelect(val) {
    this.PhysicianId = this.selectedUser.userid;
    if(!val){
    let Params = {
      pFacilityId: this.usrFacId,
      pUserId: this.PhysicianId,
      weekOfMonth: this.SelWeek
    }
    this.UserScheduleTimings(Params);    
  } else {
    this.Selectedweekchange(this.weekSelected);
  }
    // this.weekdrop = false;
    this.Week = false;
    
  }


  UserScheduleTimings(Params) {
    let selwek;
    return this._patientmanagementService.getPhysicianFacilityWeeklySchedules(Params).subscribe(result => {
      this.usrsch = result;
      if (this.usrsch.length === 0) {  
        this.isNew = true;
        for (let i = 0; i < this.daysOfWeek1.length; i++) {
          let obj = new UserSchedule();
          obj.DayOfWeek = this.daysOfWeek1[i];
          obj.active = false;

          obj.StartTime = new Date(1970, 1, 1, 8, 0);
          obj.EndTime = new Date(1970, 1, 1, 17, 0);
          obj.LunchBreakStartTime = new Date(1970, 1, 1, 12, 30);
          obj.LunchBreakEndTime = new Date(1970, 1, 1, 13, 30);
          this.usrsch.push(obj);
        }
      } else {
        this.isNew = false;
        let tempo = this.usrsch
        let unuseddays: any[] = [];
        this.usersList.forEach((item)=>{
          if(item.fullName === this.usrsch[0].WeekOfMonth){
            this.userschedule.selectedWeek = item
            selwek = item
          }
        })
        
        this.userschedule = {
          selectedWeek: selwek,
          userProviderId: this.PhysicianId,
          selectedFacility: this.usrFacId,
        }
        this.userschedule.selectedWeek =  selwek;
        for (let i = 0; i < this.usrsch.length; i++) {
          this.usrsch[i].active = true;
          let hours = new Date("1970-01-01T00:00:00").getHours();
          let years = new Date("1970-01-01T00:00:00").getFullYear();

          let StartTimehours = new Date(this.usrsch[i].StartTime).getHours();
          let StartTimeyears = new Date(this.usrsch[i].StartTime).getFullYear();


          if (StartTimeyears === years) {
            if (StartTimehours === hours) {
              this.usrsch[i].StartTime = new Date("1970-01-01T08:00:00");
              this.usrsch[i].EndTime = new Date("1970-01-01T08:00:00");
              this.usrsch[i].LunchBreakStartTime = new Date("1970-01-01T08:00:00");
              this.usrsch[i].LunchBreakEndTime = new Date("1970-01-01T08:00:00");
              this.usrsch[i].active = true;
            }
          }
          this.usrsch.map(item => {
            item.StartTime = new Date(item.StartTime);
            item.EndTime = new Date(item.EndTime);
            item.LunchBreakStartTime = new Date(item.LunchBreakStartTime);
            item.LunchBreakEndTime = new Date(item.LunchBreakEndTime);
          })
        }
      }
    });
  }


  saveUserSchedule() {
    for(let i=0;i<this.usrsch.length;i++){
  }
    let userdetails = JSON.parse(sessionStorage.getItem("UserDetail"));
    let userId = userdetails.UserId;
    // to convert the values inside UserSchedule model
    const userScheduleObj = JSON.parse(JSON.stringify(this.usrsch));
    // to convert the date & time using moment js
    userScheduleObj.map(item => {
      item.StartTime = moment(item.StartTime).format('YYYY-MM-DDTHH:mm:ss');
      item.EndTime = moment(item.EndTime).format('YYYY-MM-DDTHH:mm:ss');
      item.LunchBreakStartTime = moment(item.LunchBreakStartTime).format('YYYY-MM-DDTHH:mm:ss');
      item.LunchBreakEndTime = moment(item.LunchBreakEndTime).format('YYYY-MM-DDTHH:mm:ss');
    })

    // to add validations 
    for (let i = 0; i < userScheduleObj.length; i++) {
      //start time should not be lesser than End time
      if (userScheduleObj[i].active === false) {
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].EndTime = "1970-01-01T01:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:30:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:31:00"; 
      }


      if (userScheduleObj[i].StartTime >= userScheduleObj[i].EndTime) {
        this.Dialogvalue = "Please enter Correct Login and Logoff timings on: " + userScheduleObj[i].DayOfWeek;
        this.showDialog(this.Dialogvalue);
        return;
      }

      // Lunch Start time should not be Lesser than Lunch end time
      if (userScheduleObj[i].LunchBreakStartTime >= userScheduleObj[i].LunchBreakEndTime) {
        this.Dialogvalue = "Please enter Correct break Timings on: " + userScheduleObj[i].DayOfWeek;
        this.showDialog(this.Dialogvalue);
        return;
      }

      
      // adding information regarding who changed the values value to model
      userScheduleObj[i].LastUpdatedByUserId = userId;
      userScheduleObj[i].WeekOfMonth = this.userschedule.selectedWeek ? this.userschedule.selectedWeek: this.weekSelected.label;       
      userScheduleObj[i].UserId = this.PhysicianId;
      userScheduleObj[i].DateLastUpdated = new Date().toLocaleString();
      
    }
    if (this.isNew === true) {
      for (let i = 0; i < userScheduleObj.length; i++) {
        userScheduleObj[i].DateCreated = new Date().toLocaleString();
        userScheduleObj[i].CreatedByUserId = userScheduleObj[i].LastUpdatedByUserId
        userScheduleObj[i].FacilityId = this.usrFacId
        userScheduleObj[i].User = null
        // userScheduleObj[i].UserId = this.PhysicianId

      }
    }

    this._patientmanagementService.postUserSchedule(userScheduleObj).subscribe(resp => {
      let message = resp;
      this.Selectedweekchange(this.weekSelected);
      this.showSuccess("Saved Schedule Successfully")
    });
  }

  // toaster messages
  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

  showInfo(msg: string) {
    this.toastr.info(msg);
  }


  showDialog(message) {
    this.display = true;
    this.Dialogvalue = message;
  }

  Selectedweekchange(event) {
    this.SelWeek = event.value.value ? event.value.value : event.value;
    console.log(event,'event');
    this.userschedule.selectedWeek = this.SelWeek
    let Params = {
      pFacilityId: this.usrFacId,
      pUserId: this.PhysicianId,
      weekOfMonth: this.SelWeek
    }
     this.UserScheduleTimings(Params);
    this.weekdrop = false;
    this.disablecheckbox = false;
    this.userschedule.selectedWeek = event.value;
  }

  First(userScheduleObj){
    if (this.isNew === true) {
      for(let i=7;i<14;i++){
        userScheduleObj[i].WeekOfMonth = "Second Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
          userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
          userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
          userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=14;i<21;i++){
        userScheduleObj[i].WeekOfMonth = "Third Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=21;i<28;i++){
        userScheduleObj[i].WeekOfMonth = "Fourth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=28;i<35;i++){
        userScheduleObj[i].WeekOfMonth = "Fifth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=35;i<42;i++){
        userScheduleObj[i].WeekOfMonth = "Sixth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      return userScheduleObj;
    } else {}
  }
  Second(userScheduleObj){
    if (this.isNew === true) {
      // for(let i = 0;i<7;i++){
      //   userScheduleObj[i].WeekOfMonth = "First Week"
      //   userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
      //   userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
      //   userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
      //   userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      // }
      for(let i=7;i<14;i++){
        userScheduleObj[i].WeekOfMonth = "First Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=14;i<21;i++){
        userScheduleObj[i].WeekOfMonth = "Third Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=21;i<28;i++){
        userScheduleObj[i].WeekOfMonth = "Fourth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=28;i<35;i++){
        userScheduleObj[i].WeekOfMonth = "Fifth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=35;i<42;i++){
        userScheduleObj[i].WeekOfMonth = "Sixth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      return userScheduleObj;
    } else {}
  }
  Third(userScheduleObj){
    if (this.isNew === true) {
      // for(let i = 0;i<7;i++){
      //   userScheduleObj[i].WeekOfMonth = "First Week"
      // }
      for(let i=7;i<14;i++){
        userScheduleObj[i].WeekOfMonth = "Second Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=14;i<21;i++){
        userScheduleObj[i].WeekOfMonth = "First Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=21;i<28;i++){
        userScheduleObj[i].WeekOfMonth = "Fourth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=28;i<35;i++){
        userScheduleObj[i].WeekOfMonth = "Fifth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=35;i<42;i++){
        userScheduleObj[i].WeekOfMonth = "Sixth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      return userScheduleObj;
    } else {}
  }
  Forth(userScheduleObj){
    if (this.isNew === true) {
      // for(let i = 0;i<7;i++){
      //   userScheduleObj[i].WeekOfMonth = "First Week"
      // }
      for(let i=7;i<14;i++){
        userScheduleObj[i].WeekOfMonth = "Second Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=14;i<21;i++){
        userScheduleObj[i].WeekOfMonth = "Third Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=21;i<28;i++){
        userScheduleObj[i].WeekOfMonth = "First Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=28;i<35;i++){
        userScheduleObj[i].WeekOfMonth = "Fifth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=35;i<42;i++){
        userScheduleObj[i].WeekOfMonth = "Sixth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      return userScheduleObj
    } else {}
  }
  Fifth(userScheduleObj){
    if (this.isNew === true) {
      // for(let i = 0;i<7;i++){
      //   userScheduleObj[i].WeekOfMonth = "First Week"
      // }
      for(let i=7;i<14;i++){
        userScheduleObj[i].WeekOfMonth = "Second Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=14;i<21;i++){
        userScheduleObj[i].WeekOfMonth = "Third Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=21;i<28;i++){
        userScheduleObj[i].WeekOfMonth = "Fourth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=28;i<35;i++){
        userScheduleObj[i].WeekOfMonth = "First Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=35;i<42;i++){
        userScheduleObj[i].WeekOfMonth = "Sixth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      return userScheduleObj;
    } else {}
  }
  Sixth(userScheduleObj){
    if (this.isNew === true) {
      // for(let i = 0;i<7;i++){
      //   userScheduleObj[i].WeekOfMonth = "First Week"
      // }
      for(let i=7;i<14;i++){
        userScheduleObj[i].WeekOfMonth = "Second Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=14;i<21;i++){
        userScheduleObj[i].WeekOfMonth = "Third Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=21;i<28;i++){
        userScheduleObj[i].WeekOfMonth = "Fourth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=28;i<35;i++){
        userScheduleObj[i].WeekOfMonth = "Fifth Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      for(let i=35;i<42;i++){
        userScheduleObj[i].WeekOfMonth = "First Week"
        userScheduleObj[i].EndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakEndTime = "1970-01-01T00:00:00";
        userScheduleObj[i].LunchBreakStartTime = "1970-01-01T00:00:00";
        userScheduleObj[i].StartTime = "1970-01-01T00:00:00";
      }
      return userScheduleObj;
    } else {}
  }
}
