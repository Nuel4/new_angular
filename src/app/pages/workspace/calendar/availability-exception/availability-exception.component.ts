import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { AppointmentService } from '../../../../services/workspace/appointment.service';
import { AuthenticationStore } from '../../../../authentication/authentication-store';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-availability-exception',
  templateUrl: './availability-exception.component.html',
  styleUrls: ['./availability-exception.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AvailabilityExceptionComponent implements OnInit {
  @Input() selectedData: any;
  userList: any;
  selectedUser: any ={};
  dateFrom: any;
  dateTo: any;
  allDay: boolean = false;
  exceptionType: any;
  selectedType: any;
  startTime: any;
  endTime: any;
  recurrence: any;
  modes: any;
  monthly: boolean = false;
  yearly: boolean = false;
  countries: any = [];
  filterDate: boolean = true;
  number = [
    {},
    { name: 'First', value: 1 },
    { name: 'Second', value: 2 },
    { name: 'Third', value: 3 },
    { name: 'Fourth', value: 4 },
    { name: 'Last', value: -1 }
  ]
  weekDays = [
    { name: 'Day', value: 0 },
    { name: 'Monday', value: 2 },
    { name: 'Tuesday', value: 4 },
    { name: 'Wednesday', value: 8 },
    { name: 'Thursday', value: 16 },
    { name: 'Friday', value: 32 },
    { name: 'Saturday', value: 64 },
    { name: 'Sunday', value: 1 }
  ]
  checkEndDate: boolean = false;
  cols = [

    { header: "Type", field: "type" },
    { header: "From", field: "FromDateTime" },
    { header: "To", field: "ToDateTime" },
    { header: "Start", field: "StartTime" },
    { header: "End", field: "EndTime" },
    { header: "Reason", field: "Reason" },
    { header: "Recurring", field: "recuring" },

  ]
  userDetail: any = [];
  availbilityException: SelectItem[];
  availbilityException1: any = [];
  startDate: any;
  experienceForUser: any = [];
  daily: any;
  weekly: any;
  noneRadio: boolean = true;
  none: any = {};
  filterFromDate: any;
  filterEndDate: any;
  year = [
    {},
    { name: "January", value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ]
  originalForUser: any = [];
  selectedModes: any;
  selcetedButtonValues: any;
  reason: any;
  dailyRadio: any = {};
  weeklyRadio: any = {};
  monthlyRadio: any = {};
  yearlyRadio: any = {};
  selectedException: any;
  update: boolean = false;
  save: boolean = true;
  recDetails: any = {};
  yearlyMonth: any = {};
  everyYearly: any = {};
  yearlyDaysEvery: any;
  thebutton: any = {};
  theNumberweeks: any = {};
  theweeksDays: any = {};
  monthlyDay: any;
  monthlyRadioDays: any = {};
  monthlyTheLabel: any;
  monthlyNumber: any = {};
  monthlyWeeks: any = {};
  theMonthDays: any = {};
  everyDaily: any;
  dailyButton: any = {};
  weeks: any;
  Monday: any;
  Tuesday: any;
  Wednesday: any;
  Thursday: any;
  Friday: any;
  Saturday: any;
  Sunday: any;
  patternType: any;
  theYears: any = {};
  months: any;
  addRecurringDetails: any;
  selectedDay:any = [];
  dayCount = 0;
  addUseravail: any = {};
  recId: any;
  requiredDate: boolean = false;
  result: any;
  constructor(private modal: NgbActiveModal,private datePipe: DatePipe, private apptService: AppointmentService, public authStore: AuthenticationStore, private toastr: ToastrService) { }

  ngOnInit() {
    // this.datePipe.transform(this.currentDate,"dd-MM-yyyy")
    this.patternType = 0;
    this.dateFrom = new Date(this.selectedData.start)
    this.dateTo = new Date(this.selectedData.end)
     this.startTime = new Date(this.selectedData.start);
    this.endTime = new Date(this.selectedData.end);
    this.exceptionType = [
      { label: 'Holiday', color: 'black' },
      { label: 'Leave', color: 'bisque' },
      { label: 'Lunch', color: 'pink' }
    ]
    this.modes = [
      { value: 'Holiday', icon: 'fa fa-fw fa-square' },
      { value: 'Italic', icon: 'fa fa-fw fa-square' },
      { value: 'Underline', icon: 'fa fa-fw fa-square' },
      { value: 'Underline', icon: 'fa fa-fw fa-square' }
    ],
      this.filterFromDate = new Date();
    this.filterEndDate = new Date();
    this.getAvailabiltyException()
    this.GetActiveUsersForApptDiary()
    this.getExperienceForUsers()
  }
  
  getAvailabiltyException() {
    this.availbilityException1 = []
    this.apptService.getAvailabilityException().subscribe(res => {
      this.availbilityException = res.map((item) => ({
        label: item.Description,
        value: item.TypeId,
        styleClass: ('#' + ('000000' + (item.Colour & 0xFFFFFF).toString(16)).slice(-6))
      }));

      this.availbilityException.map(e => {
        this.availbilityException1.push({
          name: 'USA',
          flag: 'usa.png',
          styles: e.styleClass,
          TypeId: e.value
        })
      })
      
    })
  }
  GetActiveUsersForApptDiary() {
    if (this.selectedData.facility) {
      this.apptService.GetActiveUsersForApptDiary(this.selectedData.facility.id).subscribe(res => {
        this.userDetail = res
      })
    }
  }
  onFilter(){
    this.filterDate = false;
    this.experienceForUser = []
    this.originalForUser.map(item => {
      item.FromDateTime = new Date(item.FromDateTime)
      if( this.filterFromDate <= item.FromDateTime && this.filterEndDate >= item.FromDateTime){
        item.FromDateTime = moment(item.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(item);
      }
    })
  }
  getExperienceForUsers(value?) {
    let payload:any = {}
    payload.userId = this.selectedUser ? this.selectedUser.userId  : 0;    
    if(value !== 'include'){
      payload.startDate= this.dateFrom ? moment(this.dateFrom).format('DD-MM-YYYY') : ''
    }
    this.apptService.getExperienceforUser(payload).subscribe(res => {
      this.originalForUser = res;
      this.experienceForUser = res;
      this.experienceForUser.forEach(item => {
        
        item.type = item.ExceptionType.Description;
        item.ToDateTime = moment(item.ToDateTime).format('MM-DD-YYYY');
        item.FromDateTime = moment(item.FromDateTime).format('MM-DD-YYYY');
        item.StartTime = moment(item.RecurringDetails.StartTime).format('h:mm A');
        item.EndTime = moment(item.RecurringDetails.EndTime).format('h:mm A');
        item.Colour = ('#' + ('000000' + (item.ExceptionType.Colour & 0xFFFFFF).toString(16)).slice(-6))
        switch (item.RecurringDetails && item.RecurringDetails.PatternType) {
          case null: item.recuring = '';

            break;
          case 0:
            item.recuring = 'None';
            break;
          case 1:
            item.recuring = 'Daily';
            break;
          case 2: item.recuring = 'Weekly';

            break;
          case 3: item.recuring = 'Monthly';

            break;
          case 4: item.recuring = 'Yearly';

            break;
        }

      })
      if(value === 'include'){
      this.experienceForUser = []
    this.originalForUser.forEach(element => {
      element.FromDateTime = new Date(element.FromDateTime)
      if((this.selectedModes === undefined) && !(this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
     else if((this.selectedModes === undefined) && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
      else{
      this.selectedModes.forEach(item => {
        if ((element.ExceptionTypeId === item.TypeId) || (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)) {
          element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
          this.experienceForUser.push(element);
        }
       else if((element.ExceptionTypeId === item.TypeId) && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)) {
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element);
      }
      })
    }
    })
    
  }
  else if(value !== 'include'){
    this.experienceForUser = []
    this.originalForUser.forEach(element => {
      element.FromDateTime = new Date(element.FromDateTime)
      if((this.selectedModes === undefined) && !(this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
      else if((this.selectedModes === undefined) && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
      else if((this.selectedModes === undefined) || (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
      else{
      this.selectedModes.forEach(item => {
        if ((element.ExceptionTypeId === item.TypeId) && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)) {
          element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
          this.experienceForUser.push(element);
        }
       
      })
    }
    })
    
  }
    })
  }
  deleteUserAvailability(rowData) {
    let payload = {
      ExceptionId: rowData.ExceptionId
    }
    this.apptService.deleteExperienceForUser(payload).subscribe(res => {
      this.showSuccess('Deleted Successfully');
      this.getExperienceForUsers()
    })
  }
  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
  dailyChange() {
    this.dailyButton = 0
    this.daily = true;
    this.checkEndDate = true;
    this.weekly = false;
    this.monthly = false;
    this.yearly = false;
    this.requiredDate = true;
  }
  weeklyChange() {
    this.checkEndDate = true;
    this.weekly = true;
    this.daily = false;
    this.monthly = false;
    this.yearly = false;
    this.requiredDate = true;
  }
  monthlyChange() {
    this.monthlyRadioDays = 0;
    this.checkEndDate = true;
    this.daily = false;
    this.weekly = false;
    this.monthly = true;
    this.yearly = false;
    this.requiredDate = true;
  }
  yearlyChange() {
    this.everyYearly = 0
    this.checkEndDate = true;
    this.daily = false;
    this.weekly = false;
    this.monthly = false;
    this.yearly = true;
    this.requiredDate = true;
  }
  noneChange() {
    this.checkEndDate = false;
    this.daily = false;
    this.weekly = false;
    this.monthly = false;
    this.yearly = false;
    this.none = true;
    this.requiredDate = false;
  }
  colorFilter() {
    this.experienceForUser = []
    this.originalForUser.forEach(element => {
      element.FromDateTime = new Date(element.FromDateTime)
      if(this.selectedModes.length === 0 && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
      else{
      this.selectedModes.forEach(item => {
        if (element.ExceptionTypeId === item.TypeId || (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)) {
          element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
          this.experienceForUser.push(element);
        }
       
      })
    }
    })
    // this.experienceForUser = []
    // this.originalForUser.map(item => {
    //   item.FromDateTime = new Date(item.FromDateTime)
    //   if( this.filterFromDate <= item.FromDateTime && this.filterEndDate >= item.FromDateTime){
    //     item.FromDateTime = moment(item.FromDateTime).format('MM-DD-YYYY')
    //     this.experienceForUser.push(item);
    //   }
    // })
  }
  addUserAvailability() {
  
    this.recDetails = {
      PatternType: parseInt(this.patternType),
      StartTime: moment(this.startTime).format('h:mm A') !== 'Invalid date' ? moment(this.startTime).format('h:mm A') : this.startTime,
      EndTime: moment(this.endTime).format('h:mm A') !== 'Invalid date' ? moment(this.endTime).format('h:mm A') : this.endTime,
      DateCreated: new Date(),
      CreatedByUserId: this.authStore.UserDetail.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
    }
    if (this.patternType == 4) {
      if (this.everyYearly == 0) {
        this.recDetails.MonthOfYear = this.yearlyMonth.value;
        this.recDetails.DayOfMonth = this.yearlyDaysEvery;
        this.recDetails.PatternInterval = 0;
        this.recDetails.PatternDays = 0;
        this.recDetails.DayOrdinal = null;
      }
      else {
        this.recDetails.DayOfMonth = null;
        this.recDetails.MonthOfYear = this.theYears.value;
        this.recDetails.PatternDays = this.theweeksDays.value;
        this.recDetails.DayOrdinal = this.theNumberweeks.value;
        this.recDetails.PatternInterval = 0;
      }
    }
    else if (this.patternType == 3) {
      if (this.monthlyRadioDays == 0) {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = this.monthlyDay,
          this.recDetails.DayOrdinal = null,
          this.recDetails.PatternInterval = this.months,
          this.recDetails.PatternDays = 0;
      }
      else {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = null,
          this.recDetails.DayOrdinal = this.monthlyNumber.value,
          this.recDetails.PatternInterval = this.theMonthDays,
          this.recDetails.PatternDays = this.monthlyWeeks.value;
      }
    }
    else if (this.patternType == 2) {
      this.recDetails.MonthOfYear = null,
        this.recDetails.DayOfMonth = null,
        this.recDetails.DayOrdinal = null,
        this.recDetails.PatternInterval = this.weeks,
        this.recDetails.PatternDays = this.dayCount;
    }
    else if (this.patternType == 1) {
      if (this.dailyButton == 0) {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = null,
          this.recDetails.DayOrdinal = null,
          this.recDetails.PatternInterval = this.everyDaily,
          this.recDetails.PatternDays = 0;
      }
      else {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = null,
          this.recDetails.DayOrdinal = null,
          this.recDetails.PatternInterval = 1,
          this.recDetails.PatternDays = 62;
      }
    }
   if(this.patternType !== 0){
      if((moment(this.dateTo).format('MM/DD/YYYY')) === (moment(new Date()).format("MM/DD/YYYY"))){
        this.toastr.error('Please select mandatory field')
      }
      else {
        this.apptService.postRecurringDetails(this.recDetails).subscribe(res => {
          this.addRecurringDetails = res;
          this.postExperienceForUser()
        })
      }
    }
    else {
      this.apptService.postRecurringDetails(this.recDetails).subscribe(res => {
        this.addRecurringDetails = res;
        this.postExperienceForUser()
      })
    }
  }
  dayChange(monday) {
    // var mon = this.Monday ? parseInt(this.Monday[0]): 0;
    // var tue = this.Tuesday ? parseInt(this.Tuesday[0]):0;
    // var wed = this.Wednesday ? parseInt(this.Wednesday[0]):0;
    // var thu = this.Thursday ? parseInt(this.Thursday[0]):0;
    // var fri = this.Friday ? parseInt(this.Friday[0]):0;
    // var sat = this.Saturday ? parseInt(this.Saturday[0]):0;
    // var sun = this.Sunday ? parseInt(this.Sunday[0]):0;
    // this.dayCount = mon + tue + wed + thu + fri + sat + sun;
    console.log('daycount',monday,event)
    let day = 0;
    monday.forEach(element => {
      day = parseInt(element) + day
    })
    this.dayCount = day;
    
    // var sum = 0

    // if(event){
    //   var arr = []
    //   arr.push(value);
      // for(let i= 0; i < arr.length; i++ ){
      //   arr[i] = value;
      // }
      // arr.forEach(ele => {
      //   if(ele !== value){
      //     this.dayCount = this.dayCount + value;
      //   }  
      // })

    // }
  }
  postExperienceForUser() {
    if(this.selectedType === undefined || this.selectedUser === undefined){
      this.toastr.error('Please select mandatory field')
    }
     
      else {
    let payload = {
      UserId: this.selectedUser.userId,
      ExceptionTypeId: this.selectedType,
      Reason: this.reason ? this.reason : '',
      FromDateTime: moment(this.dateFrom).format('MM-DD-YYYY'),
      ToDateTime: moment(this.dateTo).format('MM-DD-YYYY'),
      AllDayEvent: this.allDay,
      Active: true,
      DateCreated: new Date(),
      CreatedByUserId: this.authStore.UserDetail.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
      RecurringDetailsId: this.addRecurringDetails.RecurringDetailsId
    }
    this.apptService.postExperienceFOrUser(payload).subscribe(res => {
      this.addUseravail = res;
      this.showSuccess('Successfully added');
      this.patternType = 0;
      this.none = true;
      this.getExperienceForUsers();
    })
  }
  }
  userSelection(event){
    this.checkEndDate = false;
    this.patternType =0;
    this.none = true;
    this.save = true;
    this.update = false;
    this.daily = false;
    this.weekly = false;
    this.monthly = false;
    this.yearly = false;
    this.reason = null;
    this.checkEndDate = false;
    this.selectedType ={};
    this.allDay = false;
    // this.selectedUser = {};
    this.dateFrom =moment(this.selectedData.start).format("MM/DD/YYYY");
    this.dateTo = moment(this.selectedData.end).format("MM/DD/YYYY");
    this.startTime = moment(this.selectedData.start).format('h:mm A');
    this.endTime = moment(this.selectedData.end).format('h:mm A');
    this.getExperienceForUsers()
  // this.experienceForUser = []
  // this.originalForUser.map(item => {
  //   item.FromDateTime = new Date(item.FromDateTime)
  //   if( this.filterFromDate <= item.FromDateTime && this.filterEndDate >= item.FromDateTime){
  //     item.FromDateTime = moment(item.FromDateTime).format('MM-DD-YYYY')
  //     this.experienceForUser.push(item);
  //   }
  // })
  }
  everyYearlyChange() {

  }
  filterByDate() {
    this.experienceForUser = []
    this.originalForUser.forEach(element => {
      element.FromDateTime = new Date(element.FromDateTime)
      if(this.selectedModes.length === 0 && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)){
        element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
        this.experienceForUser.push(element)
      }
      else{
      this.selectedModes.forEach(item => {
        if (element.ExceptionTypeId === item.TypeId && (this.filterFromDate <= element.FromDateTime && this.filterEndDate >= element.FromDateTime)) {
          element.FromDateTime = moment(element.FromDateTime).format('MM-DD-YYYY')
          this.experienceForUser.push(element);
        }
       
      })
    }
    })
  }
  
  onRowSelect(event) {
    let payload = {
      exceptionId: event.data.ExceptionId
    }
    this.apptService.GetExceptionsForUserByExceptionId(payload).subscribe(res => {        
       this.result = res.days.split(', ');
       this.selectedDay = [];
      this.result.forEach((item)=>{
        if(item === 'Saturday'){
         this.selectedDay.push('64')
       }
        if(item === 'Monday'){
          this.selectedDay.push('2')
        }
         if(item === 'Tuesday'){
          this.selectedDay.push('4')
        }
         if(item === 'Wednesday'){
          this.selectedDay.push('8')
        }
         if(item === 'Thursday'){
          this.selectedDay.push('16')
        }
         if(item === 'Friday'){
          this.selectedDay.push('32')
        }         
        if(item === 'Sunday'){
          this.selectedDay.push('1')
        }
        console.log(this.selectedDay,'selectedDay')
      })
      this.recId = event.data;
      this.save = false;
      this.update = true;
      this.selectedData=event.data.ExceptionTypeId;
      this.dateFrom=new Date(event.data.FromDateTime);
      this.dateTo= new Date(event.data.ToDateTime);
      this.startTime=new Date(event.data.RecurringDetails.StartTime);
      this.endTime=new Date(event.data.RecurringDetails.EndTime);
      this.allDay=event.data.AllDayEvent;
      this.reason=event.data.Reason;
      this.userDetail.forEach(item => {
        if(event.data.UserId === item.userId){
          this.selectedUser=item
        }
      })
      this.availbilityException.forEach(element => {
        if (event.data.ExceptionTypeId === element.value) {
          this.selectedType = element.value
        }
      });
    this.patternType = event.data.RecurringDetails.PatternType;
    if(this.patternType === 0){
      this.checkEndDate = false;
      this.daily = false;
      this.weekly = false;
      this.monthly = false;
      this.yearly = false;
      this.none = true;
      this.requiredDate = false;
    }
    else if(this.patternType === 1){
      this.checkEndDate = true;
      this.daily = true;
      this.weekly = false;
      this.monthly = false;
      this.yearly = false;
      this.none = false;
      this.requiredDate = true;
      if(event.data.RecurringDetails.DayOrdinal === null){
        this.dailyButton=0
      this.everyDaily = event.data.RecurringDetails.PatternInterval;
    }
      else if(event.data.RecurringDetails.PatternDays === 62){
        this.dailyButton=1
      }
    }
    else if(this.patternType === 2){
      this.checkEndDate = true;
      this.daily = false;
      this.weekly = true;
      this.monthly = false;
      this.yearly = false;
      this.none = false;
      this.weeks=event.data.RecurringDetails.PatternInterval;
      this.requiredDate = true;
      // this.selectedDay = this.dayCount
    }
    else if(this.patternType === 3){
      this.monthly = true;
      this.checkEndDate = true;
      this.daily = false;
      this.weekly = false;
      this.yearly = false;
      this.none = false;
      this.requiredDate = true;
      if(event.data.RecurringDetails.DayOrdinal === null){
        this.monthlyRadioDays=0;
        this.months = event.data.RecurringDetails.PatternInterval;
        this.monthlyDay = event.data.RecurringDetails.DayOfMonth;
      }
      else{
        this.monthlyRadioDays=1
        this.number.forEach(ele => {
          if (event.data.RecurringDetails.DayOrdinal === ele.value) {
            this.monthlyNumber = ele;
            
          }
        })
        this.theMonthDays = event.data.RecurringDetails.PatternInterval;
        this.weekDays.forEach(ele => {
          if (event.data.RecurringDetails.PatternDays === ele.value) {
            this.monthlyWeeks = ele
          }
        })
      }
      
    }
    else if(this.patternType === 4){
      this.yearly = true;
      this.daily = false;
      this.weekly = false;
      this.monthly = false;
      this.checkEndDate = true;
      this.requiredDate = false;
      if(event.data.RecurringDetails.DayOrdinal === null){
        this.everyYearly = 0;
        this.year.forEach(item => {
          if(event.data.RecurringDetails.DayOfMonth === item.value){
            this.yearlyMonth = item;
          
          }
        })
        this.yearlyDaysEvery=event.data.RecurringDetails.MonthOfYear;
      }
     else{
       this.everyYearly=1;
      this.year.forEach(item => {
        if(event.data.RecurringDetails.MonthOfYear === item.value){
          this.theYears = item
          
        }
      })
      this.weekDays.forEach(key => {
        if(event.data.RecurringDetails.PatternDays === key.value){
          this.theweeksDays = key
        }
      })
      
      this.number.forEach(el => {
        if(event.data.RecurringDetails.DayOrdinal === el.value){
          this.theNumberweeks = el
        }
      })
     }
    }
  })
    
  }
  updateRecurringDetails(){
    if(this.monthlyRadioDays || this.dailyButton || this.everyYearly){
      if(this.dateTo === (new Date(this.selectedData.end)) || this.selectedType === undefined || this.selectedUser === undefined){
        this.toastr.error('Please select mandatory field')
      }
    }
    this.recDetails = {
      PatternType: parseInt(this.patternType),
      StartTime: moment(this.startTime).format('h:mm A'),
      EndTime:moment(this.endTime).format('h:mm A'),
      DateCreated:this.recId.DateCreated,
      CreatedByUserId: this.recId.CreatedByUserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
    }
    if (this.patternType == 4) {
      if (this.everyYearly == 0) {
        this.recDetails.MonthOfYear = this.yearlyMonth.value;
        this.recDetails.DayOfMonth = this.yearlyDaysEvery;
        this.recDetails.PatternInterval = 0;
        this.recDetails.PatternDays = 0;
        this.recDetails.DayOrdinal = null;
      }
      else {
        this.recDetails.DayOfMonth = null;
        this.recDetails.MonthOfYear = this.theYears.value;
        this.recDetails.PatternDays = this.theweeksDays.value;
        this.recDetails.DayOrdinal = this.theNumberweeks.value;
        this.recDetails.PatternInterval = 0;
      }
    }
    else if (this.patternType == 3) {
      if (this.monthlyRadioDays == 0) {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = this.monthlyDay,
          this.recDetails.DayOrdinal = null,
          this.recDetails.PatternInterval = this.months,
          this.recDetails.PatternDays = 0;
      }
      else {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = null,
          this.recDetails.DayOrdinal = this.monthlyNumber.value,
          this.recDetails.PatternInterval = this.theMonthDays,
          this.recDetails.PatternDays = this.monthlyWeeks.value;
      }
    }
    else if (this.patternType == 2) {
      this.recDetails.MonthOfYear = null,
        this.recDetails.DayOfMonth = null,
        this.recDetails.DayOrdinal = null,
        this.recDetails.PatternInterval = this.weeks,
        this.recDetails.PatternDays = this.dayCount;
    }
    else if (this.patternType == 1) {
      if (this.dailyButton == 0) {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = null,
          this.recDetails.DayOrdinal = null,
          this.recDetails.PatternInterval = this.everyDaily,
          this.recDetails.PatternDays = 0;
      }
      else {
        this.recDetails.MonthOfYear = null,
          this.recDetails.DayOfMonth = null,
          this.recDetails.DayOrdinal = null,
          this.recDetails.PatternInterval = 1,
          this.recDetails.PatternDays = 62;
      }
    }

    this.apptService.putRecurringDetails(this.recDetails).subscribe(res => {
      this.updateUserAvailability();
    })
  }
  updateUserAvailability() {
    let payload = {
      ExceptionId: this.recId.ExceptionId,
      UserId: this.selectedUser.userId,
      ExceptionTypeId:this.selectedType,
      RecurringDetailsId:this.recId.RecurringDetailsId,
      Reason:this.reason,
      FromDateTime:moment(this.dateFrom).format('MM-DD-YYYY'),
      ToDateTime:moment(this.dateTo).format('MM-DD-YYYY'),
      AllDayEvent:this.allDay,
      Active:true,
      DateCreated:this.recId.DateCreated,
      CreatedByUserId:this.recId.CreatedByUserId,
      DateLastUpdated:new Date(),
      LastUpdatedByUserId:this.authStore.UserDetail.UserId,
      RecurringDetails:this.recDetails
    }
    console.log(payload,'payload')
    this.apptService.updateExperienceForUser(payload).subscribe(res => {
      this.showSuccess('Successfully Updated');
      this.getExperienceForUsers()
    })
  }
  clearButton(){
    this.patternType =0;
    this.none = true;
    this.save = true;
    this.update = false;
    this.daily = false;
    this.weekly = false;
    this.monthly = false;
    this.yearly = false;
    this.reason = null;
    this.checkEndDate = false;
    this.selectedType ={};
    this.allDay = false;
    // this.selectedUser = {};
    this.dateFrom =moment(this.selectedData.start).format("MM/DD/YYYY");
    this.dateTo = moment(this.selectedData.end).format("MM/DD/YYYY");
    this.startTime = moment(this.selectedData.start).format('h:mm A');
    this.endTime = moment(this.selectedData.end).format('h:mm A');
  }
}
