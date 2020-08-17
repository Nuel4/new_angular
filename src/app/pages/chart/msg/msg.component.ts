import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoriceBoardService } from '../../../../app/services/workspace/noticeboard.service';
import { AuthenticationStore } from '../../../../app/authentication';
import { ToastrService } from 'ngx-toastr';
import * as moment from "moment";
import { NoticeboardmodalComponent } from '../../workspace/noticeboard/noticeboardmodal/noticeboardmodal.component';
import { PatientmanagementService } from '../../../../app/services/workspace/patient-management.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-msg',
  templateUrl: './msg.component.html',
  styleUrls: ['./msg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MsgComponent implements OnInit {
 cols: any[];
 filters = {
  recipient: "",
  from_date: "",
  to_date: ""
};
sentMsgList: any = [];
messagesSent: any = [];
messages_list: any = [];
recipientList: any = [];
  constructor(public activeModal: NgbActiveModal,
    private noticeBoardService: NoriceBoardService,
    private authStore: AuthenticationStore,
    private modalService: NgbModal,
    private patientManagementService: PatientmanagementService,
    private toastr: ToastrService,
    private route: Router) { }

  ngOnInit() {
    this.cols = [
      // { field:'recipients' , header:'Recipients'},
      { field: "displayDate", header: "Date Sent" },
      { field: "Posting", header: "Message" }
    ];    
    this.getAllRecipients();
    this.getSentComments();
  }

  onDoubleClick(type){
    if(type === 'add_problem') {
      this.route.navigate(['/pages/chart/add-problems'])
    } else if(type === 'add_allergy') {
      this.route.navigate(['/pages/chart/add-allergy'])
    } else if(type === 'add_vaitals') {
      this.route.navigate(['/pages/chart/add-vitals'])
    }
  }
  getAllRecipients() {
    let payload = {
      loggedInUserId: this.authStore.UserDetail.UserId,
      version: 1
    };
    this.noticeBoardService.getAllRecipients(payload).subscribe(result => {
      this.sentMsgList = result;
    });
  }
  // getSentComments(pageNo?) {
  //   let payload = {
  //     senderUserID: this.authStore.UserDetail.UserId,
  //     recipientUserID: this.filters.recipient,
  //     dateSentfrom:
  //       this.filters.from_date &&
  //       moment(this.filters.from_date).format("YYYY-MM-DD"),
  //     DatesentTo:
  //       this.filters.to_date &&
  //       moment(this.filters.to_date).format("YYYY-MM-DD"),
  //     offset: pageNo ? pageNo : 0,
  //     limit: 10,
  //     version: 1
  //   };
  //   this.noticeBoardService.getSentMessages(payload).subscribe(results => {
  //     this.messagesSent = results;
  //     this.messages_list = this.messagesSent.Results.map(element => ({
  //       ...element,
  //       displayDate: element.DateCreated && moment(element.DateCreated).format("DD MMM YYYY HH:mm")
  //     }));
  //   });
  // }
  getSentComments(pageNo?) {
    const patientData = JSON.parse(sessionStorage.getItem("PatientDetail"));
    let payload ={
      patientID : patientData.PatientId,
      offset: pageNo ? pageNo : 0,
      limit: 10
    }
this.patientManagementService.GetPatientMessages(payload).subscribe((results:any)=>{
  this.messagesSent = results;
      this.messages_list = this.messagesSent.Results.map(element => ({
        ...element,
        displayDate: element.StartDate && moment(element.StartDate).format("DD MMM YYYY HH:mm")
      }));
})
  }
  paginate(value) {
    this.getSentComments(value.page);
  }

  onMouseOver(row_data) {
    if (row_data) {
      let payload = {
        NoticeBoardPostingId: row_data.NoticeBoardPostingId,
        version: 1
      };
      this.noticeBoardService.getRecipentList(payload).subscribe(results => {
        this.recipientList = results;
      });
    } else {
      this.recipientList = [];
    }
  }

  openbsmodal(value, data) {
    setTimeout(()=>{
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
        this.getSentComments();
      }
    })

  },300)
  }

  closeMessages(){
    this.route.navigate(["/pages/chart"]);
  }
}
