import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PatientmanagementService } from '../../../services/workspace/patient-management.service';
declare var $: any;
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
// import * as $ from "jquery";
// import * as jQuery from "jquery";
// (window as any).$ = (window as any).jQuery = jQuery;
import 'fullcalendar-scheduler';
interface Facilities {
  name: string;
}
interface Users {
  name: string;
}
@Component({
  selector: 'app-chkavl',
  templateUrl: './chkavl.component.html',
  styleUrls: ['./chkavl.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChkavlComponent implements OnInit {
  facility: any;
  selectedfacility: any;
  User: any;
  selectedUser: any = { UserId: 1 };
  Speciality: any;
  selectedSpeciality: any = { SpecialityId: 0 }
  selectedFacilityList: any = [];
  cols: any[];
  itemLists: any = [];
  dateValue: any = new Date()
  //calendar
  id: any
  title: string
  startdate: any
  enddate: any
  ResourceID: number = 0
  Color: any
  event: any
  events: any = [
    {
      "id": 1,
      "resourceId": "2",
      "title": "Long Event",
      "start": "2019-02-25",
      "end": "2019-02-25",
      "color": 'green',
    },
    {
      "id": 2,
      "resourceId": "1",
      "title": "Repeating Event",
      "start": "2019-02-25T16:00:00+00:00"
    },
    {
      "id": 3,
      "resourceId": "2",
      "title": "Repeating Event",
      "start": "2019-02-25T16:00:00+00:00",
      "color": 'green'
    },
    {
      "id": 4,
      "resourceId": "2",
      "title": "Conference",
      "start": "2019-02-25",
      "end": "2019-02-25",
      "color": 'green'
    },
    {
      "id": 5,
      "resourceId": "3",
      "title": "Meeting",
      "start": "2019-02-25T10:30:00+00:00",
      "end": "2019-02-25T12:30:00+00:00",
      "color": 'red'
    },
    {
      "id": 6,
      "resourceId": "1",
      "title": "Lunch",
      "start": "2019-02-25T12:00:00+00:00"
    },
    {
      "id": 7,
      "resourceId": "2",
      "title": "Birthday Party",
      "start": "2019-02-25T07:00:00+00:00",
      "color": 'green'
    },
    {
      "id": 8,
      "resourceId": "3",
      "title": "Click for Google",
      "start": "2019-02-25",
      "color": 'red'
    }
  ]
  doctorList: any = [

    { id: "1", title: 'Dr. A' },
    { id: "2", title: 'Dr. B' },
    { id: "3", title: 'Dr. C' },
  ]
  isCancel = false
  isExpenaded = false
  businessHour: any = []
  constructor(private _patientmanagementService: PatientmanagementService,
    private toastr: ToastrService, ) {
  }

  ngOnInit() {
    // this.getFacilityList();
    // this.getUsers();
    this.cols = [
      { field: 'user', header: 'User' },
      { field: 'facility', header: 'Facility' }

    ];
    this.itemLists = [];
    this.getspecility()
    // console.log(this.itemLists);
  }

  SelectedFacility(selectedFacility) {
    // console.log("Selected facility is: ", selectedFacility.FacilityId);    
    let params = {
      FacilityId: selectedFacility.FacilityId
    }
    this._patientmanagementService.getPhyminDtFacID(params).subscribe(resp => {
      this.User = resp;
      if (this.User.length === 0) {
        this.showInfo("No records found");
      }
      for (let i = 0; i < this.User.length; i++) {
        this.User[i].FullName = this.User[i].lastname + ", " + this.User[i].firstname;
      }
      // console.log("Phy Min List", this.User)
    });
  }
  // selectedFacility
  LoadFacility(selectedFacility?) {
    console.log("no facility 111")
   
    let Facility;
    // console.log("selectfaclity", selectedFacility)
    if (!selectedFacility) {
      console.log("no facility")
      this.selectedfacility = ""
      Facility = {
        pFacilityName: "a"
      }
    } else {
      Facility = {
        pFacilityName: selectedFacility
      }
    }
    // console.log("Drowdown clicked", event);
    // console.log("value of facility name is: ", Facility);
    this._patientmanagementService.getFacilitieswithFacilitiesName(Facility).subscribe(resp => {
      this.selectedFacilityList = resp
      // if(this.selectedfacility === null){
        this.selectedUser = undefined
        this.User = [];
      // }
      // console.log(this.selectedFacilityList)
    });

  }

  // getFacilityList() {
  //   console.log('Facility Lists');
  //   this._patientmanagementService.getFacilityDetails().subscribe(resp => {
  //     this.facility = resp;
  //     //  console.log('Facility Lists');
  //     // console.log(this.facilityList);
  //   });
  // }
  // getUsers() {
  //   console.log('USER Lists 1');
  //   this._patientmanagementService.getUsers().subscribe(resp => {
  //     console.log('Users')
  //     console.log(resp)
  //     this.User = resp;
  //     // console.log('USER LISTs 2');
  //     //  console.log(this.usersList);
  //   });
  // }

  showInfo(msg: string) {
    this.toastr.info(msg);
  }

  getspecility() {
    this._patientmanagementService.getAllSpecilities().subscribe(resp => {
      this.Speciality = resp;
      // console.log('speciality', this.Speciality);
      //  console.log(this.usersList);
    });
  }

  findavailability() {
    let params = {
      userID: this.selectedUser ? this.selectedUser.userid : 0,
      facilityID: this.selectedfacility ? this.selectedfacility.FacilityId : 0,
      specialityID: this.selectedSpeciality ? this.selectedSpeciality.SpecialityId : 0,
      date: this.dateValue,
      dayOfWeek: this.weekAndDay(this.dateValue, 'day'),
      weekofMonth: this.weekAndDay(this.dateValue, 'week')
    }
    // console.log(params)
    this._patientmanagementService.getSearchUser(params).subscribe(resp => {
      this.itemLists = resp;
      // console.log('search result', this.itemLists);
    });
  }

  weekAndDay(date, opt) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'],
      prefixes = ['First Week', 'Second Week', 'Third Week', 'Fourth Week', 'Fifth Week'];
    if (opt == 'week')
      return prefixes[Math.floor(date.getDate() / 7)];
    if (opt == 'day')
      return days[date.getDay()];
  }

  onRowExpanded(event) {
    this.isExpenaded = false
    // console.log("onrowexpand", event)
    setTimeout(() => {
      this.isExpenaded = true
    }, 5)
  }
}
