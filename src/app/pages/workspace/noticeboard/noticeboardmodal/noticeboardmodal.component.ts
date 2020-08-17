import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NoriceBoardService } from "../../../../services/workspace/noticeboard.service";
import { AuthenticationStore } from "../../../../authentication";
import * as moment from "moment";
import { ModelviewComponent } from "../../../../theme/components/modelview/modelview.component";
import { ToastrService } from "ngx-toastr";
import { FileStorageService } from "../../../../../app/services/filestorage.service";
declare var $: any;
@Component({
  selector: "app-noticeboardmodal",
  templateUrl: "./noticeboardmodal.component.html",
  styleUrls: ["./noticeboardmodal.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class NoticeboardmodalComponent implements OnInit {
  @Input() name: boolean;
  @Input() IsAdd: boolean;
  @Input() IsSent: boolean;
  @Input() docDetails: any;
  @Input() viewDoc: boolean;
  @Input() data: any;
  @ViewChild('lgModal') private _poup: ElementRef;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  // display: boolean = false;
  sentMsgList: any = [];
  roleList: any = [];
  // visible: boolean = false;
  cols: any = [];
  Messages: any;
  users: any;
  usersAssign: any = [];
  messagesSent: any = [];
  messages_list: any = [];
  recipientList: any = [];
  uploadedFiles: any = [];
  filters = {
    recipient: "",
    from_date: "",
    to_date: ""
  };
  from_date = "";
  to_date = "";
  send_reply: string = '';
  subject_data: string = '';
  start_date: any;
  end_date:any;
  selectedRole: any;
  chatList: any = [];
  roleUsersEnabled: boolean = false;
  date:any = new Date();
  current_assignees: any = [];
  customUsers: any = [];
  patient_id: number;
  patient_req: boolean;
  patientDetails: any = {};
  enablePatientDetails: boolean = false;
  postingDetails: any;
  customUserIds: any = [];
  readStatusObj: any;
  assign_patient: any;
  constructor(
    public activeModal: NgbActiveModal,
    private noticeBoardService: NoriceBoardService,
    private authStore: AuthenticationStore,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private fileStorage: FileStorageService,
  ) {}

  ngOnInit() {
    this.cols = [
      // { field: '', header: 'Recipients' },
      { field: "displayDate", header: "Date Sent" },
      { field: "Comment", header: "Message" }
    ];
    this.users = [
    ];
    this.usersAssign = [];
    this.Messages = [{ vin: "item", year: "year", brand: "hellon" }];
    this.start_date = moment(new Date).format('MM/DD/YYYY HH:mm A');
    this.end_date = moment(this.date.setMinutes( this.date.getMinutes() + 61 )).format('MM/DD/YYYY HH:mm A')
    if(this.IsAdd) {
      this.getRoles();
     if(this.data) {
       this.getChatList();
       this.getNoticeBoardPostingId();
    }
    } else if(this.viewDoc) {
      this.getDocUrl();
    } else {
      this.getAllRecipients();
      this.getSentComments();
    }

    this.patient_id = JSON.parse(sessionStorage.getItem("PatientDetail")) && JSON.parse(sessionStorage.getItem("PatientDetail")).PatientId;
    
  }

  getSentComments(pageNo?) {
    let payload = {
      senderUserID: this.authStore.UserDetail.UserId,
      recipientUserID: this.filters.recipient,
      dateSentfrom:
        this.filters.from_date &&
        moment(this.filters.from_date).format("YYYY-MM-DD"),
      DatesentTo:
        this.filters.to_date &&
        moment(this.filters.to_date).format("YYYY-MM-DD"),
      offset: pageNo ? pageNo : 0,
      limit: 10,
      version: 1
    };
    this.noticeBoardService.getSentMessages(payload).subscribe(results => {
      this.messagesSent = results;
      this.messages_list = this.messagesSent.Results.map(element => ({
        ...element,
        displayDate: element.DateCreated && moment(element.DateCreated).format("DD MMM YYYY HH:mm")
      }));
    });
  }
  paginate(value) {
    this.getSentComments(value.page);
  }

  filter(input_value, type) {
    if (type === "recipient") {
      this.filters.recipient = input_value && input_value.userId || 0;
    } else if (type === "from_date") {
      // this.filters.from_date = input_value;
      if(this.to_date !== '') {
        if(input_value < this.to_date) {
          this.filters.from_date = input_value;
        } else {          
          this.showWarning(`Start date should be less than end date`);
          this.from_date = '';
        }
      } else {
        this.filters.from_date = input_value;
      }
    } else if (type === "to_date") {
      // this.filters.to_date = input_value;
      if(this.from_date !== '') {
        if(input_value > this.from_date) {
          this.filters.to_date = input_value;
        } else {          
          this.showWarning(`End date should be greater than start date`);
          this.to_date = '';
        }
      } else {        
        this.filters.to_date = input_value;
      }
    }
    this.getSentComments();
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

  getAllRecipients() {
    let payload = {
      loggedInUserId: this.authStore.UserDetail.UserId,
      version: 1
    };
    this.noticeBoardService.getAllRecipients(payload).subscribe(result => {
      this.sentMsgList = result;
    });
  }

  getRoles() {
    this.roleList = [];
    this.selectedRole = null;
    this.noticeBoardService.getRoles({ version: 1 }).subscribe(result => {
      this.roleList = result;
      this.onRoleChange(false);
    });
  }

  onRoleChange(values) {
    let payload = {
      loggedInUserId: this.authStore.UserDetail.UserId,
      roleId: values ? values.RoleId : 0,
      version: 1,
    }
    this.noticeBoardService.getUsersWrtRoles(payload).subscribe(result => {
      this.users = result;
    });
  }

  // findPatient(input_data) {
  //   $("#lgModal").modal('show');
  //   $("#lgModal").find('input[name="patientObj.lastname"]').val(input_data);
  // }

  findPatient(input_data) {
      // $("#lgModal").find('input[name="patientObj.lastname"]').val(input_data);
    const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.openPopUp = true;
    modalRef.componentInstance.popupData = input_data ? input_data : '';
    // $("#lgModal").modal('show');   
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.enablePatientDetails = true;
        this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
      }
    }) 
  }

  getChatList() {
    let payload = {
      NoticeBoardPostingId: this.data.NoticeBoardPostingId,
      version: 1,
    }
    this.noticeBoardService.getAllChats(payload).subscribe(result => {
      this.chatList = result;
    })
  }

  enableRoleUsers(_boolean) {
    this.roleUsersEnabled = _boolean;
  }

  onChangeDate(input_date) {
      this.end_date = '';
      this.start_date = moment(input_date).format('MM/DD/YYYY HH:mm A');
      let date = input_date.setMinutes(input_date.getMinutes() + 61);
      this.end_date = moment(date).format('MM/DD/YYYY HH:mm A'); 
  }

  showWarning(msg: string) {
    this.toastr.warning(msg);
  }

  sendMessages() {
    let userData = [];
this.usersAssign.forEach((item)=> (
  userData.push(item.userId)
))
userData.push(this.authStore.UserDetail.UserId);
    

// let params = {}
//   params = {senderid: this.authStore.UserDetail.UserId,userids: userData}


if(this.data) {
  this.customUsers[0].NoticeBoardPostAsignees.forEach((item,index)=>{    
    // if(item.UserId === this.authStore.UserDetail.UserId){
      this.customUsers[0].NoticeBoardPostAsignees[index]= {...item, DateLastUpdated: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'), LastUpdatedByUserId: this.authStore.UserDetail.UserId}; 
    // }
  })
  this.customUsers[0].NoticeBoardPostComments = [{
    "NoticeBoardPostingId": this.customUsers[0].NoticeBoardPostingId,
    "Comment": this.send_reply,
    "DateCreated": new Date(),
    "CreatedByUserId": this.authStore.UserDetail.UserId,
    "DateLastUpdated": new Date(),
    "LastUpdatedByUserId": this.authStore.UserDetail.UserId  
    }];
    this.customUsers[0].userids = userData;
    this.customUsers[0].senderid = this.authStore.UserDetail.UserId;
    this.noticeBoardService.updateMessages(this.customUsers[0]).subscribe(result=> {
    this.loadEvent.emit(true);
    this.showSuccess("Reply Sent Successfully")
    this.activeModal.dismiss('Cross click');
  })
} else {  
let data = {      
  "PostedByUser": this.authStore.UserDetail.Username,
  "MessageType": this.patient_req ? 'PatientReq' : "Message",
  "Posting": this.subject_data,
  "StartDate": this.start_date,
  "EndDate": this.end_date,
  "DateCreated": new Date(),
  "Status": "Active",
  "CreatedByUserId": this.authStore.UserDetail.UserId,
  "DateLastUpdated": new Date(),
  "LastUpdatedByUserId": this.authStore.UserDetail.UserId,
  "PatientId": this.patient_id ? this.patient_id : null,
  "DisplayOnChart": false,
  "MrPatientEncounterId": null,
  "Active": true,
  "NoticeBoardPostComments": [
{

"NoticeBoardPostingId": 0,
"Comment": this.send_reply,
"DateCreated": new Date(),
"CreatedByUserId": this.authStore.UserDetail.UserId,
"DateLastUpdated": new Date(),
"LastUpdatedByUserId": this.authStore.UserDetail.UserId,
}],
'senderid': this.authStore.UserDetail.UserId,
'userids': userData

 }
  this.noticeBoardService.sendMessages(data).subscribe(result => {
    this.loadEvent.emit(true);
    this.showSuccess("Message Sent Successfully")
    this.activeModal.dismiss('Cross click');
  })
}
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

  getNoticeBoardPostingId() {    
    let payload = {
      noticeBoardPostingID: this.data.NoticeBoardPostingId,
      version: 1,
    }
    this.noticeBoardService.getNoticeBoardPostingById(payload).subscribe(results => {
      this.customUsers = results;
      this.customUsers[0].NoticeBoardPostAsignees.forEach(item => {
        this.customUserIds.push(item.UserId);        
        if(item.UserId === this.authStore.UserDetail.UserId) {
          this.readStatusObj = item;
          this.readStatusObj.ReadStatus = 'Read';
          this.readStatusObj.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
          this.readStatusObj.DateLastUpdated = new Date();
          if(this.data.ReadStatus === 'Unread') {
            this.noticeBoardService.markAsRead(this.readStatusObj).subscribe(reuslt => {})
          }
        }
      })
      this.noticeBoardService.getCurrentUsersDetails({userids: this.customUserIds}).subscribe(results => {
        this.current_assignees = results;
      })
    })
  }

  markAsCompleted() {
    let payload = {
      noticeBoardPostingID: this.data.NoticeBoardPostingId,
      version: 1,
    }
    this.noticeBoardService.getNoticeBoardPostingById(payload).subscribe(result => {
        this.postingDetails = result[0];
        this.postingDetails.Status = 'Completed';
        this.postingDetails.Active = false;
        this.postingDetails.senderid = this.authStore.UserDetail.UserId;
        this.postingDetails.NoticeBoardPostComments = [{
          "NoticeBoardPostingId": result[0].NoticeBoardPostingId,
         "Comment": "Mark as completed by " + this.authStore.UserDetail.FirstName + ' ' + this.authStore.UserDetail.LastName,
         "DateCreated": new Date(),
         "CreatedByUserId": this.authStore.UserDetail.UserId,
         "DateLastUpdated": new Date(),
         "LastUpdatedByUserId": this.authStore.UserDetail.UserId
          }]
        this.noticeBoardService.markAsCompleted(this.postingDetails).subscribe(result=> {
          this.loadEvent.emit(true);
          this.showSuccess("Marked As Completed Successfully")
          this.activeModal.dismiss('Cross click');
        })
    })
  }

  closeModal() {
    if(this.data.ReadStatus === 'Unread') {
      this.loadEvent.emit(true);
      this.activeModal.dismiss('Cross click');
    } else {
      this.activeModal.dismiss('Cross click');
    }
  }

  forwardMessages() {
    let userData = [];
    this.usersAssign.forEach((item)=> (
    userData.push(item.userId)
    ))
    userData.push(this.authStore.UserDetail.UserId);
    this.chatList.push({
      "NoticeBoardPostingId": 0,
      "Comment": this.send_reply,
      "DateCreated": new Date(),
      "CreatedByUserId": this.authStore.UserDetail.UserId,
      "DateLastUpdated": new Date(),
      "LastUpdatedByUserId": this.authStore.UserDetail.UserId,
      })
    let payload =  {
      "PostedByUser": this.authStore.UserDetail.Username,
      "MessageType": this.patient_req ? 'PatientReq' : "Message",
      "Posting": "FW:" + this.customUsers[0].Posting,
      "StartDate": this.start_date,
      "EndDate": this.end_date,
      "DateCreated": new Date(),
      "Status": "Active",
      "CreatedByUserId": this.authStore.UserDetail.UserId,
      "DateLastUpdated": new Date(),
      "LastUpdatedByUserId": this.authStore.UserDetail.UserId,
      "PatientId": this.patient_id ? this.patient_id : null,
      "DisplayOnChart": false,
      "MrPatientEncounterId": null,
      "Active": true,
      "userids": userData,
      "senderid":this.authStore.UserDetail.UserId,
      "NoticeBoardPostComments": this.chatList,
      // "NoticeBoardPostingComments": [{
      // "NoticeBoardPostingId": 0,
      // "Comment": this.send_reply,
      // "DateCreated": new Date(),
      // "CreatedByUserId": this.authStore.UserDetail.UserId,
      // "DateLastUpdated": new Date(),
      // "LastUpdatedByUserId": this.authStore.UserDetail.UserId,
      // }]
      // "version": 1
  }
    this.noticeBoardService.forwardMessages(payload).subscribe(result => {
      this.loadEvent.emit(true);
      this.showSuccess("Message Forwarded Successfully");
      this.activeModal.dismiss('Cross click');
    })
  }

  docResult: any;
  getDocUrl() {
    let fileName: string = 'Scanned document\\' + this.docDetails.Name
    this.fileStorage.downloadFile(encodeURI(fileName)).subscribe((res)=>{
      this.docResult = res.Value;
    })
  }

  reviewDoc() {
    let payload = {
      patientFileId: this.docDetails.PatientFileId,
      reviewStatus: 2
    }
    this.noticeBoardService.reviewDocument(payload).subscribe((res)=>{})
  }
}
