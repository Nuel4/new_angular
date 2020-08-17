import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {
  ElementRef, OnDestroy, DoCheck, OnChanges, Input, Output, EventEmitter, IterableDiffers,
  AfterViewChecked, SimpleChanges
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GridService } from '../../../services/workspace/grid.service';
declare var $: any;
import { NoticeboardmodalComponent } from './noticeboardmodal/noticeboardmodal.component';
import { NoriceBoardService } from '../../../services/workspace/noticeboard.service';
import { AuthenticationStore } from '../../../authentication';
import {Router} from '@angular/router'
import { element } from '@angular/core/src/render3/instructions';
import * as moment from 'moment';
@Component({
  selector: 'app-noticeboard',
  templateUrl: './noticeboard.component.html',
  styleUrls: ['./noticeboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoticeboardComponent implements OnInit, AfterViewInit {


  @Input() wData: any;

  @Output() onSomething = new EventEmitter<string>();

  @Output() NBModalvisibility = new EventEmitter<any>();

  // variable for modals 
  closeResult: string;
  heading: string;
  patientdata: any;
  patientname: string;
  NBMV: any;
  //declaring boolean value
  private toWorkSpace: boolean;
  private isLoader: boolean;
  private displayDialog: boolean;
  display: boolean = false;
  arrData: any = {};
  messages: any = [];
  messages_list: any = [];
  yt = '<iframe class="w-100" src="https://www.youtube.com/watch?v=wFhs7WVvuXk&start_radio=1&list=RDwFhs7WVvuXk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  // declaring vaiables
  private Status: any = [];
  //variable to store table headers
  cols: any = [];
  patient_documents: any = [];
  SelectedStatus: any;
  tab_index: number;
  //decalring variable to store WData
  private widgetData: any;
  patient = '';
  constructor(private gs: GridService,
    private modalService: NgbModal,
    private noticeBoardService: NoriceBoardService,
    private authStore: AuthenticationStore, private router: Router
  ) { }

  ngAfterViewInit() {
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toWorkSpace = true;
    }
  }


  ngOnInit() {
    var a = document.querySelector('gridster-item')
    var b = document.querySelector('gridster-item');
    this.Status = [
      // { statusname: 'Active', statuscode: 0, patientname: "Mickey, Mouse", providername: "Test, Login", date: "00/00/0000", charts: "charts" },
      { statusname: 'Active', statuscode: 1, patientname: "Shruthi", providername: "AK", date: "00/00/0000", charts: "charts" },
      { statusname: 'Completed', statuscode: 2, patientname: "Hassan", providername: "Girisha", date: "00/00/0000", charts: "charts" },
      { statusname: 'All', statuscode: 0, patientname: "Ankur", providername: "Aditya", date: "00/00/0000", charts: "charts" },
    ];

    this.cols = [
      { field: 'PatientName', header: 'Patient' },
      { field: "Name", header: "Name" },
      { field: "scan_date", header: "Scan Date" },
      { field: 'doc_date', header: 'Doc Date' },
      { field: "DmsCategoryName", header: "Category" },
      { field: "NoOfPages", header: "Pages" }
    ];

    this.getAllMessages();
    this.widgetData = JSON.parse(this.wData);
    if (this.widgetData) {
      this.toWorkSpace = true;
    }
  }

  
  refreshData() {
    this.onSomething.emit();
    if (this.tab_index === 1) {
      this.getPatientDocuments(0);
    } else {      
      this.getAllMessages(0,this.SelectedStatus && this.SelectedStatus.statusname);
    }
  }

  StatusValue(SelectedStatus) {
    this.getAllMessages(0,SelectedStatus && SelectedStatus.statusname || '');
  }

  SelectedTab(event) {
    this.tab_index = event.index;
    if (this.tab_index === 1) {
      this.getPatientDocuments(0);
    } else {      
      this.getAllMessages();
    }
  }

  SelectedRecord(data) {
    
  }



  showDialog(title: string, value: boolean) {
    this.NBModalvisibility.emit(value);
    let heading = title;
    this.display = true;
  }

  getPatientDetails() {
    if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
      $("#lgModal").modal('show');
    }
    if ((JSON.parse(sessionStorage.getItem("PatientDetail")) != null)) {
      this.patientdata = JSON.parse(sessionStorage.getItem("PatientDetail"));
      this.patientdata.DateCreated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateLastUpdated = new Date(this.patientdata.DateCreated);
      this.patientdata.DateOfBirth = new Date(this.patientdata.DateOfBirth);
      this.patientdata.FullName = this.patientdata.LastName + ", " + this.patientdata.FirstName
    }
  }

  open(content, title) {

    this.NBMV = {
      content, title
    }
    this.NBModalvisibility.emit(this.NBMV);
    // this.heading = title;
    // this.getPatientDetails();
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  openbsmodal(value, data) {
    const modalRef = this.modalService.open(NoticeboardmodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    if (value) {
      modalRef.componentInstance.IsSent = true;
      modalRef.componentInstance.IsAdd = false;
    }
    else {
      modalRef.componentInstance.data = data ? data : false;
      modalRef.componentInstance.IsAdd = true;
      modalRef.componentInstance.IsSent = false;
    }

    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.getAllMessages();
      }
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllMessages(pageNo?, status?) {
    let payload = {
      userID: this.authStore.UserDetail.UserId,
      // userID: 120,
      status: status !== "All" ? status ? status : '' : '',
      offset: pageNo ? pageNo : 0,
      limit: 5,
      version: 1,
    }
    this.noticeBoardService.getAllMessages(payload).subscribe(results => {
      this.messages = results;
      this.messages_list = this.messages.Results.map(element => ({
        ...element,
        displayDate: moment(element.StartDate).format('DD MMM YYYY HH:mm')
      }));
    });
  }
patientDetails(rowData){
this.patient = 'Patient details: ' + "\nPatient Name: " + '\nDate of birth: ' + '\nSSN: ' + '\nSex: ' + '\nCell: '
let param = {
  pPatientId: rowData.PatientId
}
this.noticeBoardService.getCustomFormattedPatientDetailsById(param).subscribe(
  (result) => {
var sex = result[0].sex == true ? 'Male' : 'Female'
var ssn = result[0].ssn == null ? '' : result[0].ssn
var cell = result[0].altphone == null ? '' : result[0].altphone
this.patient = 'Patient details: ' + "\nPatient Name: " + result[0].lastname + result[0].firstname + '\nDate of birth: ' + moment(result[0].dateofbirth).format('DD/MM/YYYY') + '\nSSN: ' + ssn + '\nSex: ' + sex + '\nCell: ' + cell
  }
)
}
chartClick(rowData){
  this.noticeBoardService.getPatient(rowData.PatientId).subscribe(
    result => {
      sessionStorage.setItem('PatientDetail', JSON.stringify(result));
      this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
      // this.authStore.ReloadPatientData()
      this.router.navigate(['/pages/chart'])
    }
  )

}
  paginate(value) {
    this.getAllMessages(value.page);
  }

  getPatientDocuments(pageNo) {
    let payload = {
      userId: this.authStore.UserDetail.UserId,
      offset: pageNo ? pageNo : 0,
      limit: 7,
    
    }
    this.noticeBoardService.getPatientDocuments(payload).subscribe((results:any) => {
      
      this.arrData = results;
      this.patient_documents = this.arrData.Results.map(item => ({
          ...item,
          scan_date: moment(item.DateCreated).format('MMM DD YYYY'),
          doc_date: item.Documentdate !== null ? moment(item.Documentdate).format('MMM DD YYYY') : ''
      }))
    })
  }

  onSelectRow(row_data) {
    this.noticeBoardService.getDocView({patientFileId:202, version: 1}).subscribe(result => {
    })
  }
  selectedPage(event) {
    let currentpage = event.first / event.rows;
    this.getPatientDocuments(currentpage)
  }
  viewDoc(rowData) {
    const modalRef = this.modalService.open(NoticeboardmodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.viewDoc = true;
    modalRef.componentInstance.docDetails = rowData;
  }
}
