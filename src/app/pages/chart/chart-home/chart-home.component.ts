import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, ElementRef, AfterViewInit, OnChanges, SimpleChange, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router } from '@angular/router';
import * as $ from 'jquery';
import { GridService } from '../../../services/workspace/grid.service';
import { ModelviewComponent } from '../../../theme/components/modelview/modelview.component';
import { DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType } from 'angular-gridster2';
import { DatePipe } from '@angular/common'
import { CharthomeService } from '../../../services/chart/charthome.service'
import { NavbarService } from './../../../services/navbar.service';
import { AddAppointmentComponent } from '../../workspace/calendar/add-appointment/add-appointment.component';
import { PatientPortalComponent } from './patient-portal/patient-portal.component';
import { AuthenticationStore } from '../../../authentication/authentication-store'
@Component({
  selector: 'app-chart-home',
  templateUrl: './chart-home.component.html',
  styleUrls: ['./chart-home.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class ChartHomeComponent implements OnInit, AfterViewInit, OnChanges {
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  NBMD: string;
  NBMT: boolean;
  patientName: any = ""
  dateCreated: any = ""
  dob: any = ""
  gender: any = ""
  age: any = ""
  PatientDetail: any;
  smokingStatus: any = ""
  insurance: any;

  constructor(private nav: NavbarService, private gs: GridService, private modalService: NgbModal, private datepipe: DatePipe, private chartservive: CharthomeService,private authStore : AuthenticationStore,private router: Router) {
  }
  static itemChange(item, itemComponent) {
  }
  
  static itemResize(item, itemComponent) {
  }

  // these function are worte to make grid draggable
  static eventStart(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
  }

  static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
  }
  static overlapEvent(source: GridsterItem, target: GridsterItem, grid: GridsterComponent) {
  }
  // here ends grid draggable functions
  
  ngOnInit() {
    this.getPatientDetails();
    this.nav.show();
    this.options = { 
      itemChangeCallback: ChartHomeComponent.itemChange,
      itemResizeCallback: ChartHomeComponent.itemResize,
      colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
      rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
      // this hides the grid coloumn
      displayGrid: DisplayGrid.None,
      // this enables the draggable event on grid
      draggable: {
        delayStart: 0,
        enabled: false,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: ChartHomeComponent.eventStop,
        start: ChartHomeComponent.eventStart,
        dropOverItems: false,
        dropOverItemsCallback: ChartHomeComponent.overlapEvent,
      },
      // gridType: "fit",
  // 'fit' will fit the items in the container without scroll;
  // 'scrollVertical' will fit on width and height of the items will be the same as the width
  // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
  // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
  // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
  // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
  // fixedColWidth: 200,
  // fixed col width for gridType: 'fixed'
  // fixedRowHeight: 10,
  // fixed row height for gridType: 'fixed'
  // keepFixedHeightInMobile: false,
  // keep the height from fixed gridType in mobile layout
  // keepFixedWidthInMobile: false,
  // keep the width from fixed gridType in mobile layout
  // compactType: 'none',
  // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
  // mobileBreakpoint: 640,
  // if the screen is not wider that this, remove the grid layout and stack the items
  // minCols: 12,
  // minimum amount of columns in the grid
  // maxCols: 12,
  // maximum amount of columns in the grid
  // minRows: 4,
  // minimum amount of rows in the grid
  // maxRows: 4,
  // maximum amount of rows in the grid
  // defaultItemCols: 1,
  // default width of an item in columns
  // defaultItemRows: 1,
  // default height of an item in rows
  // maxItemCols: 50,
  // max item number of cols
  // maxItemRows: 50,
  // max item number of rows
  // minItemCols: 1,
  // min item number of columns
  // minItemRows: 1,
  // min item number of rows
  // minItemArea: 1,
  // min item area: cols * rows
  // maxItemArea: 2500,
  // max item area: cols * rows
  // margin: 10,
  // margin between grid items
  // outerMargin: true,
  // if margins will apply to the sides of the container
  // scrollSensitivity: 10,
  // margin of the dashboard where to start scrolling
  // scrollSpeed: 20,
  // how much to scroll each mouse move when in the scrollSensitivity zone
  // initCallback: undefined,
  // callback to call after grid has initialized.Arguments: gridsterComponent
  // destroyCallback: undefined,
  // callback to call after grid has destroyed.Arguments: gridsterComponent
  // itemChangeCallback: undefined,
  // callback to call for each item when is changes x, y, rows, cols.
  // Arguments: gridsterItem, gridsterItemComponent
  // itemResizeCallback: undefined,
  // callback to call for each item when width/height changes.
  // Arguments: gridsterItem, gridsterItemComponent
  // itemInitCallback: undefined,
  // callback to call for each item when is initialized and has size > 0.
  // Arguments: gridsterItem, gridsterItemComponent
  // itemRemovedCallback: undefined,
  // callback to call for each item when is removed.
  // Arguments: gridsterItem, gridsterItemComponent
  // enableEmptyCellClick: false,
  // enable empty cell click events
  // enableEmptyCellContextMenu: false,
  // enable empty cell context menu (right click) events
  // enableEmptyCellDrop: true,
  // enable empty cell drop events
  // enableEmptyCellDrag: true,
  // enable empty cell drag events
  // emptyCellClickCallback: undefined,
  // empty cell click callback
  // emptyCellContextMenuCallback: undefined,
  // empty cell context menu (right click) callback
  // emptyCellDropCallback: undefined,
  // empty cell drag drop callback. HTML5 Drag & Drop
  // emptyCellDragCallback: undefined,
  // empty cell drag and create item like excel cell selection
  // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
  // emptyCellDragMaxCols: 50,
  // limit empty cell drag max cols
  // emptyCellDragMaxRows: 50,
  // limit empty cell drag max rows
  // draggable: {
  //   delayStart: 0,
  //   // milliseconds to delay the start of resize, useful for touch interaction
  //   enabled: false,
  //   // enable/disable draggable items
  //   ignoreContentClass: 'gridster-item-content',
  //   // default content class to ignore the drag event from
  //   ignoreContent: false,
  //   // if true drag will start only from elements from `dragHandleClass`
  //   dragHandleClass: 'drag-handler',
  //   // drag event only from this class. If `ignoreContent` is true.
  //   stop: undefined,
  //   // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
  //   start: undefined
  //   // callback when dragging an item starts.
  //   // Arguments: item, gridsterItem, event
  // },
  resizable: {
    delayStart: 0,
    // milliseconds to delay the start of resize, useful for touch interaction
    enabled: false,
    // enable/disable resizable items
    handles: {
      s: false,
      e: false,
      n: false,
      w: false,
      se: false,
      ne: false,
      sw: false,
      nw: false
    }, // resizable edges of an item
    stop: undefined,
    // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
    start: undefined
    // callback when resizing an item starts.
    // Arguments: item, gridsterItem, event
  },
  // swap: true,
  // allow items to switch position if drop on top of another
  // pushItems: true,
  // push items when resizing and dragging
  // disablePushOnDrag: false,
  // disable push on drag
  // disablePushOnResize: false,
  // disable push on resize
  // pushDirections: { north: true, east: true, south: true, west: true },
  // control the directions items are pushed
  // pushResizeItems: false,
  // on resize of item will shrink adjacent items
  // displayGrid: 'none',
  // display background grid of rows and columns. Options: 'always' | 'onDrag&Resize' | 'none'
  // disableWindowResize: true,
  // disable the window on resize listener. This will stop grid to recalculate on window resize.
  // disableWarnings: false,
  // disable console log warnings about misplacement of grid items
  // scrollToNewItems: false
  // scroll to new items placed in a scrollable view
    };

    this.dashboard = [
      // { cols: 8, rows: 4, y: 0, x: 0, componentName: 'VAllAppointmentsComponent', componentHeader: 'Appointments' },
      { cols: 4, rows: 4, y: 0, x: 0, dragEnabled: true, resizeEnabled: true, componentName: 'PatientEducationComponent', componentHeader: 'Patient Education' },
      { cols: 4, rows: 4, y: 0, x: 4, dragEnabled: true, resizeEnabled: true, componentName: 'ProblemListComponent', componentHeader: 'Problem list' },
      { cols: 4, rows: 4, y: 0, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'MedicationsComponent', componentHeader: 'Medications' },
      { cols: 4, rows: 4, y: 2, x: 0, dragEnabled: true, resizeEnabled: true, componentName: 'ProgressnoteComponent', componentHeader: 'Progress Notes' },
      // { cols: 4, rows: 4, y: 2, x: 4, dragEnabled: true, resizeEnabled: true, componentName: 'PastMedicalHistoryComponent', componentHeader: 'Past Medical History' },
      { cols: 4, rows: 4, y: 2, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'AllergiesComponent', componentHeader: 'Allergies' },
      // { cols: 4, rows: 4, y: 2, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'ImmunizationsComponent', componentHeader: 'Immunizations, Vaccines, Injections' },
      // { cols: 4, rows: 4, y: 2, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'LabsComponent', componentHeader: 'Orders' },
      { cols: 4, rows: 4, y: 2, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'VitalWidgetComponent', componentHeader: 'Vitals' },
    ];
  }

  getSmokingStatus() {
    this.chartservive.GetSmokingStatus(this.PatientDetail.PatientId).subscribe(results => {
      this.smokingStatus = results.TobaccoUsage;
    })
  }
  getAge(dateString) {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    var yearNow = now.getFullYear();
    var monthNow = now.getMonth();
    var dateNow = now.getDate();

    var dob = new Date(dateString.substring(6, 10),
      dateString.substring(0, 2) - 1,
      dateString.substring(3, 5)
    );

    var yearDob = dob.getFullYear();
    var monthDob = dob.getMonth();
    var dateDob = dob.getDate();
    // var age = {};
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";


    var yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    var age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };

    if (age.years > 1) yearString = " years";
    else yearString = " year";
    if (age.months > 1) monthString = " months";
    else monthString = " month";
    if (age.days > 1) dayString = " days";
    else dayString = " day";


    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + ", " + age.months + monthString + ", and " + age.days + dayString;
    else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
      ageString = age.days + dayString;
    else if ((age.years > 0) && (age.months == 0) && (age.days == 0))
      ageString = age.years + yearString;
    else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
      ageString = age.years + yearString + " and " + age.months + monthString;
    else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " and " + age.days + dayString;
    else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
      ageString = age.years + yearString + " and " + age.days + dayString;
    else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
      ageString = age.months + monthString;
    else ageString = " ";

    return ageString;
  }

  getInsurance() {
    this.chartservive.GetPatientInsurance(this.PatientDetail.PatientId).subscribe(result => {
      //   this.insurance = result.
    })
  }
  getPatientDetails() {
    this.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"))
    if (this.PatientDetail === null) {
      // $("#lgModal").modal('show');
      const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.ComponentName = 'Charts';
      modalRef.componentInstance.openPopUp = true;
    } else {
      this.patientName = this.PatientDetail.LastName + ' , ' + this.PatientDetail.FirstName;
      // var timeDiff = Math.abs(Date.now() - new Date(PatientDetail.DateOfBirth).getTime());
      // this.dob = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
      this.dob = this.datepipe.transform(this.PatientDetail.DateOfBirth, 'MM/dd/yyyy')
      this.age = this.getAge(this.dob);
      if (this.PatientDetail.Sex = true) {
        this.gender = "M"
      } else {
        this.gender = "F"
      }
      this.getSmokingStatus();
    }

  }
  NoticeBoardModal(NBMV) {
    this.NBMD = NBMV.title;
    this.NBMT = NBMV.content;
  }
  onSomething() {
  }

  // changedOptions() {
  //     this.options.api.optionsChanged();
  // }

  removeItem(item) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    // this.dashboard.push({});
  }
  bookAppointment(){
    const modRef = this.modalService.open(AddAppointmentComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.bookAppointment = true;
    modRef.componentInstance.selectedData = {
      ApptObj : {
      LastName: this.authStore.PatientDetail.LastName,
      FirstName: this.authStore.PatientDetail.FirstName,
      DateOfBirth: this.authStore.PatientDetail.DateOfBirth,
      UniqueNumber: this.authStore.PatientDetail.UniqueNumber,
      MobilePhone : this.authStore.PatientDetail.MobilePhone,
      FlagSelfPayPatient : this.authStore.PatientDetail.FlagSelfPayPatient,
      },
      start : new Date(),
      end: new Date(),
      co_pay_amount: '',
      comments:'',
      is_specialist_visit: false,
      facility: {
        id:0
      }
    }
  }
  ngOnChanges() {
    let title = this.gs.gettitlefromNoticeBoard();
  }
  patientPortal(){
    const modRef = this.modalService.open(PatientPortalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modRef.componentInstance.portal = true;
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //     $('.dynamsoft-dialog-wrap').remove();
    //     $('.dynamsoft_waiting').remove();
    //     // $('.breadcrumb').remove();
    //     $('body > :last-child').remove();
    // }, 1000)
    // this.getPatientDetails();
  }


  public onShowDIalog(title: any, value: boolean) {
    // this.display = value;
  }


  NBModalsvalues(value: boolean) {

    // this.NBModalvalue = value;

  }
}


