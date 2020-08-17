import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PatientmanagementService } from "../../../../../services/workspace/patient-management.service";
import * as moment from 'moment';
import { NoticeboardmodalComponent } from '../../../noticeboard/noticeboardmodal/noticeboardmodal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit {
private patientIdToEdit;
public showprtandchrge: boolean;

@Input()
set _showprtandchrge(val: any){
  this.showprtandchrge = val;
}

get _showprtandchrge(): any {
  return this.showprtandchrge;
}

  @Input()
  set _patientIdToEdit(val: any){
    this.patientIdToEdit = val;
  }

  get _patientIdToEdit(): any {
    return this.patientIdToEdit;
  }
  @Output() next = new EventEmitter();
  @Output() crgslip = new EventEmitter();
  messageColumns: any = [];
  messageData: any = [];
  patientDetailIndex = 0;
   pageno;
   totalPages;
   totalRecords;
  constructor(
    private routes: Router,
    private modalService: NgbModal,
    private pms: PatientmanagementService
  ) { }

  ngOnInit() {  
    this.getPatientMessages();
    let event = {
      first: 0,
      rows: 10
    }
    // this.Paginator(event)

    this.messageColumns = [
      { field: 'StartDate', header: 'Date' },
      { field: 'StartTime', header: 'Time' },
      { field: 'Duration', header: 'Duration' },
      { field: 'MessageType', header: 'Message Type' },
      { field: 'Posting', header: 'Subject' },
    ];
      // this.messageData = [
      //   { StartDate: '17/01/2019', StartTime: '12:10 PM', Duration: '12:23', MessageType: '9876541234', Posting: 'abcd' },
      //   { StartDate: '22/01/2019', StartTime: '04:55 PM', Duration: '22:56', MessageType: '9876541234', Posting: 'xyz' },
      //   { StartDate: '23/12/2018', StartTime: '07:45 PM', Duration: '45:34', MessageType: '9876541234', Posting: 'pqr' },
      //   { StartDate: '17/11/2018', StartTime: '11:12 PM', Duration: '12:12', MessageType: '9876541234', Posting: 'mno' },
      //   { StartDate: '19/11/2018', StartTime: '02:46 PM', Duration: '34:45', MessageType: '9876541234', Posting: 'abcd' },
      // ]
  }

  openNext() {
    // this.index = (this.index === 6) ? 0 : this.index + 1;
    this.next.emit();
  }

  onClose() {
    this.routes.navigate(['/pages/workspace/patientmanagement']);
  }


  getPatientMessages(){
    
    let temp;
    let Param = {
      patientID: this.patientIdToEdit,
      // this.patientIdToEdit,
      offset: this.patientDetailIndex,
      limit: 10,
    }
    // this.getPatientmessages(Param)
    // this.pms.GetPatientMessages(Param).subscribe(resp => {
    //   console.log("value of results are ",resp);
    //   this.pageno = resp.CurrentPage
    //  this.totalPages = resp.TotalPages
    //  this.totalRecords = resp.TotalItems
    //   this.messageData = resp.Results
    //   for(let j=0; j<this.messageData.length; j++){
    //     // console.log(moment(this.messageData[j].StartDate).format('hh:mm A'))
    //   this.messageData[j].StartTime = moment(this.messageData[j].StartDate).format('hh:mm A')
    //   this.messageData[j].StartDate = moment(this.messageData[j].StartDate).format('DD/MM/YYYY')
    //   }
    // });
  }
  Paginator(event)
  {
    const index = (event.first / event.rows);
    this.patientDetailIndex = index
    // let temp = (event.first/event.rows)
    // console.log("value of event is",event)
    // console.log("value of temp is",temp)

    let i = 0;
    let Param = {
      patientID: this.patientIdToEdit,
      // this.patientIdToEdit,
      offset: this.patientDetailIndex,
      limit: 10,
    }
this.getPatientmessages(Param)
    // this.pms.GetPatientMessages(Param).subscribe(resp => {
    //   console.log("value of results are ",resp);
     
    //   this.messageData = resp.Results
    //   for(let j=0; j<this.messageData.length; j++)
    //   {
    //     // console.log(moment(this.messageData[j].StartDate).format('hh:mm A'))
    //   this.messageData[j].StartTime = moment(this.messageData[j].StartDate).format('hh:mm A')
    //   this.messageData[j].StartDate = moment(this.messageData[j].StartDate).format('DD/MM/YYYY')
    //   }
    // });


  }

  editmsg(columns){
  }

  getPatientmessages(Param){
    this.pms.GetPatientMessages(Param).subscribe(resp => {
      this.totalRecords = resp.TotalItems
      this.totalPages = resp.TotalPages
      this.messageData = resp.Results
      for(let j=0; j<this.messageData.length; j++)
      {
        // console.log(moment(this.messageData[j].StartDate).format('hh:mm A'))
      this.messageData[j].StartTime = moment(this.messageData[j].StartDate).format('hh:mm A')
      this.messageData[j].StartDate = moment(this.messageData[j].StartDate).format('DD/MM/YYYY')
      }
      console.warn(this.messageData)
    });
  }
  chargeSlips(data){
    this.crgslip.emit(data)
   }

   openbsmodal( data) {
    const modalRef = this.modalService.open(NoticeboardmodalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.data = data ? data : false;
      modalRef.componentInstance.IsAdd = true;
      modalRef.componentInstance.IsSent = false;

    // modalRef.componentInstance.loadEvent.subscribe((value) => {
    //   if (value) {
    //     this.getPatientmessages();
    //   }
    // })
  }
}
