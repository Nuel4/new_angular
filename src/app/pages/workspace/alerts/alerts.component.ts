import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {
  ElementRef, OnDestroy, DoCheck, OnChanges, Input, Output, EventEmitter, IterableDiffers,
  AfterViewChecked, SimpleChanges
} from '@angular/core';
import { AlertService } from '../../../services/workspace/alerts.service';
import { MypostsComponent } from '../myposts/myposts.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsmodalsComponent } from './alertsmodals/alertsmodals.component';
import { EditmodalComponent } from './editmodal/editmodal.component';
import { PostsmodalsComponent } from './postsmodals/postsmodals.component';
import { PaginatorModule } from 'primeng/paginator';
// import { MypostsService } from  '../../../services/workspace/myposts.service';
import { RouterModule, Router } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component'


@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertsComponent implements OnInit, AfterViewInit {

  @Input() wData: any;

  @Output() onSomething = new EventEmitter<string>();
  @Output() refreshPost = new EventEmitter<any>()

  EditAlertsModal: boolean = false;
  Actioncode: any;
  AssignTo: any;

  // alertList: any = [];
  newList: any = [];
  AlerttypeData: any;
  physicianList: any = [];
  Status: any = [];
  private toWorkSpace: boolean = false;
  private widgetData: any;
  actionCodeList: any = [];
  actionToList: any = [];
  AlertType: any = [];
  DoctorList: any
  currentPageURL: any;
  AlertsData: any;
  private totalRecords: number = 24;
  alerts: any;
  actionCode: any = '';
  dateFrom: any = '';
  dateTo: any = '';
  alertTypeId: any = '';
  patientName: any = '';
  refresh: boolean;
  // workspaceHead:boolean;



  // variables for my posts
  //   private mypostsdata: any;
  // private notes: any;

  constructor(private searchAlert: AlertService,
    private modalService: NgbModal,
    // private mp: MypostsService,
    private router: Router) { }



  ngAfterViewInit() {
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toWorkSpace = true;
    }

    // this.currentPageURL = this.router.url;
    // if(this.currentPageURL == "/pages/workspace/alerts"){
    //   this.workspaceHead = true;
    // }else{
    //   this.workspaceHead = false;
    // }


  }


  ngOnInit() {
    this.currentPageURL = this.router.url;
    this.Status = [
      { statusname: 'Active', statuscode: 0, patientname: "Mickey, Mouse", providername: "Test, Login", date: "00/00/0000", charts: "charts" },
      { statusname: 'Active', statuscode: 1, patientname: "Shruthi", providername: "AK", date: "00/00/0000", charts: "charts" },
      { statusname: 'Completed', statuscode: 2, patientname: "Hassan", providername: "Girisha", date: "00/00/0000", charts: "charts" },
      { statusname: 'All', statuscode: 3, patientname: "Ankur", providername: "Aditya", date: "00/00/0000", charts: "charts" },
    ];
    // if (this.currentPageURL == "/pages/workspace/alerts") {
    //   this.workspaceHead = true;
    // } else {
    //   this.workspaceHead = false;
    // }
    this.GetAlertType();
    let param = {
      first: 5,
      page: 0,
      pageCount: 24,
      rows: 5
    }
    this.paginate(param);
    this.newList = [
      { label: 'All', value: 1 },
      { label: 'New', value: 2 },
      { label: 'In-Progress', value: 3 },
      { label: 'Resolved', value: 4 },
      { label: 'Reassigned', value: 5 },

    ];

    // this.physicianList= [
    //   { label: ' ', value:1},
    //   { label: 'Physician1', value:1},
    //   { label: 'Physician2', value:2},
    //   { label: 'Physician3', value:3},

    // ];
    this.actionCodeList = [
      { label: 'All', value: 0 },
      { label: 'New ', value: 1 },
      { label: 'In-Progress', value: 2 },
      { label: 'Resolved', value: 3 },
      { label: 'Reassigned', value: 4 },

    ];
    this.actionToList = [
      { label: 'Assistant,Medical ', value: 1 },
      { label: 'Assistant,Medical', value: 1 },
      { label: 'Doctor', value: 2 },
      { label: 'Reassigned', value: 3 },

    ];
    this.Actioncode = [
      { codename: "Reassigned", id: 1 },
      { codename: "Resolved", id: 2 },
    ];

    // let param = {
    //   first: 5,
    //   page: 0,
    //   pageCount: 24,
    //   rows: 5
    // }
    // this.paginate(param);

  }
  processAlert(item) {
    if (item.RenewalRequestGuid === 'Refill Requests:') {
      this.router.navigate(['prescribe/2'])

    } else {
      this.router.navigate(['prescribe/3'])

    }

  }
  refreshData() {
    this.onSomething.emit();
    this.refreshPost.emit();
    this.refresh = true;
    let param = {
      first: 5,
      page: 0,
      pageCount: 24,
      rows: 5
    }
    this.paginate();

  }
  toOrders(rowData){
    // console.log(rowData)
this.router.navigate(['/pages/orders/home'])
  }
  editbutton(item) {
    const modalRef = this.modalService.open(EditmodalComponent);
    modalRef.componentInstance.alertContent = item
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        let param = {
          first: 5,
          page: 0,
          pageCount: 24,
          rows: 5
        }
        this.paginate(param);
      }
    })
  }
  GetAlertType() {
    this.searchAlert.getAlertType().subscribe(results => {
      this.AlertType = results
      for (let i = 0; i < this.AlertType.length; i++) {
        this.AlertType[i].value = this.AlertType[i].AlertType1;
      }
    });
  }

  //   AllAlerts(){
  //     let params={

  //     }
  //     this.searchAlert.getAllAlerts().subscribe(results => {
  // this.AlertsData = results
  // console.log("value of alerts data is: ",this.AlertsData)
  //     });
  //   }
  paginate(event?) {

    let param = {
      userId: "0",
      offset: event ? event.page : 0,
      limit: "3",
      actioncode: this.actionCode,
      datefrom: this.dateFrom,
      dateTo: this.dateTo,
      alertypeId: this.alertTypeId,
      patientname: this.patientName
    }
    this.searchAlert.getAllAlerts(param).subscribe(results => {
      this.AlertsData = results
      this.totalRecords = this.AlertsData.TotalItems;
      this.alerts = this.AlertsData.Results
      this.refresh = false;
    });
  }

  Alertstypevalue(AlertsTypeData) {
    if (AlertsTypeData == null) {
      this.alertTypeId = ' '
      // console.log("Data is nulllll")
    } else {
      this.alertTypeId = AlertsTypeData.AlertTypeId;
    }
    let param = {
      first: 5,
      page: 0,
      pageCount: 24,
      rows: 5
    }
    this.paginate(param);
  }
  actionCodeValue(actioncode) {
    if (actioncode === null || actioncode.label === 'All') {
      this.actionCode = ''
    } else {
      this.actionCode = actioncode.label

    }
    let param = {
      first: 5,
      page: 0,
      pageCount: 24,
      rows: 5
    }
    this.paginate(param);
  }
  // searchForDoctors(){
  //   this.searchAlert.getAllDoctors().subscribe(results => {
  //     this.DoctorList = results
  //     console.log("physician name is",this.DoctorList)
  //   });
  // }

  // searchAlertLists(index=0){
  //   const pages = {
  //     offset:index,
  //     limit:10
  //   }
  //   this.searchAlert.GetAlertsPaged(pages).subscribe(results => {
  //     this.alertsList = results
  //     console.log("physician name is",this.alertsList)
  //   });
  // }

  search() {
    const modalRef = this.modalService.open(AlertsmodalsComponent, { size: 'lg' });
  }
  findPatient() {
    const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.ComponentName = 'Charts';
    modalRef.componentInstance.openPopUp = true;
  }
  // Myposts(pageno){
  //   console.log("value of paginator is: ",pageno);
  //   let param = {
  //     offset: pageno,
  //     limit: "5",
  //   }
  //  this.mp.getPagedPosts(param).subscribe( result => {
  //    this.mypostsdata = result
  //  });
  // }

  // open(content) {
  //   const modalRef = this.modalService.open(PostsmodalsComponent);
  //   modalRef.componentInstance.title = content;
  // }


  // paginate(event)
  // {

  //   let param = {
  //     offset: event.page,
  //     limit: "5",
  //   }
  //  this.mp.getPagedPosts(param).subscribe( result => {
  //    this.mypostsdata = result
  //    console.log("value of mypostsdata: ",this.mypostsdata );
  //    this.totalRecords = this.mypostsdata.TotalItems;
  //    this.notes = this.mypostsdata.Results;
  //    console.log("value of results is: ",this.notes);
  //  });
  // }

  //   editalerts(item){
  //     const modalRef = this.modalService.open(AlertsmodalsComponent);
  //     modalRef.componentInstance.editmodal = true;
  // console.log("value of items is: ",item);
  //   }


}
