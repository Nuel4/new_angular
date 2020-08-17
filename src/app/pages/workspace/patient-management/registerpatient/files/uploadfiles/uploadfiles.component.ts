import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { fileupload, Document } from '../../../../../../model';
import { FileStorageService } from '../../../../../../services/filestorage.service';
import { DocumentServicesService } from '../../../../../../services/document/document.services.service';
import { WaitingroomService } from '../../../../../../services/waitingnroom/waitingroom.service';
import { AuthenticationStore } from '../../../../../../authentication';
import { PatientmanagementService } from '../../../../../../services/workspace/patient-management.service';
import { FormService } from '../../../../../../services/workspace/form.service';


@Component({
  selector: 'app-uploadfiles',
  templateUrl: './uploadfiles.component.html',
  styleUrls: ['./uploadfiles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadfilesComponent implements OnInit {
@Input() PatientId;
@Input() categories;
  
  files: fileupload[] = [];
  // files: any;
  cols : any[];
  
  selectedCategory;
    review_cols: any = [];
    attach_cols: any =[];
    fileArr: any;
    isDisabled: boolean;
showStatusLoad: boolean;
showStatusComp: boolean

  constructor(
    public activeModal: NgbActiveModal,
    private documentServices: DocumentServicesService,
    private toastr: ToastrService,
    private waitingRoomService: WaitingroomService,
    private authStore: AuthenticationStore,
    private patMngServ: PatientmanagementService,
    private fileStoreService: FileStorageService,
    private formService: FormService,
  ) { }

  ngOnInit() {
     this.cols = [
      { field:'name' , header:'Name'},
      { field:'dob' , header:'DOB'},
      { field:'ssn' , header:'SSN'},
      { field:'chartwindow' , header:'Chart Window'}
    ];

    this.review_cols = [
      { field:'Name' , header:'Document Name'},
      { field:'dateCreated' , header:'Document Scanned'},
      { field:'documentDate' , header:'Document Date'},
      { field:'DmsCategoryName' , header:'Dms Category'},
      { field:'NoOfPages' , header:'Pages In Scan'},
      { field:'EncounterId' , header:'Encounter'}
    ];
    this.attach_cols = [
      { field:'name' , header:'Date'},
      { field:'dob' , header:'Details'},
      { field:'ssn' , header:'Physician'},
      { field:'chartwindow' , header:'Summary'},
    ]
  }

 

  onUpload() {
    if(this.selectedCategory != null){
      this.showStatusLoad = true;
      this.showStatusComp = false
    console.log(this.files)
    this.isDisabled = true;
    let fileItem = this.files;
    for(let fileItem of this.files){
      const formData = new FormData();
      formData.append("fileItem", fileItem.file);      
      this.fileStoreService.addFile('docsUpload',formData)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            fileItem.progress = Math.round(100 * event.loaded / event.total);
          } 
          else if (event.type === HttpEventType.Response) {
            fileItem.isCompleted = true;
            fileItem.message = event.body.Value.toString();
            this.addDoc()
          }
        },
          (err: HttpErrorResponse) => {
            fileItem.isError = true;
            if (err) {
              this.toastr.error('File already exists')
            }
          })
    }
  } else {
this.showError("Please select a DMS category");
return;
  }
  }

 


  fileChange(fileList: Array<File>) {
    console.log("value fo file list is",fileList)
        let data: any = [];
        for (let file of fileList) {
          console.log("value of file",file);
          let name = file.name;
          let namearr = name.split(".")
          let arrlen = namearr.length
          let cflen = arrlen -1
          console.log('cflen',cflen)
          let changednamearr: string;
          for(let i=0;i<cflen;i++){
            changednamearr = (changednamearr? changednamearr+".": "")+namearr[i]
          }
          changednamearr = changednamearr+"_"+moment(new Date()).format("DDMMYYYYhhmm")+"."+namearr[arrlen-1]
          let temp = new File([file],changednamearr,{type: file.type});
          data.push(new fileupload(temp));
          console.log("value of file is",data)
        }
            this.files = data;
        console.log("value of files is",this.files)
        
        console.log("value of files is",this.files[0])
      }
      addDoc() {
        let fileItem = this.files[0];
        for (let fileItem of this.files) {
          var newform = new Document();
        newform.Name = fileItem.filename;
        newform.Extension = this.getFlieExtension(fileItem.filename);
        newform.Path = fileItem.filename;
        newform.CreatedByUserId = this.authStore.UserDetail.UserId;
        newform.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
        newform.DateCreated = new Date();
        newform.DateLastUpdated = new Date();
        // newform.FileData =  null;
        newform.SavedMethodIdentifier = 1;
        newform.ReviewStatus =1;
        newform.DocumentDate = new Date();
        newform.IsInactive = false;
        newform.DmsCategoryId = this.selectedCategory.DmsCategoryId;
        newform.UserId = this.authStore.UserDetail.UserId;
        newform.PatientId = this.PatientId;
        console.log("value of params is",newform);
        this.formService.addPatientDoc(newform)
        .subscribe(event => {
          console.log("value of HttpEventType is",HttpEventType.UploadProgress,event.type)
          if (event.type === HttpEventType.UploadProgress) {
            fileItem.progress = Math.round(100 * event.loaded / event.total);
          }
          this.toastr.success('Successfully added');
          this.activeModal.dismiss('Cross click');
          this.activeModal.close('Close click');
        })
        }
      }
  getFlieExtension(filename): string {
    try {
      let ext = filename.substr(filename.lastIndexOf('.'), filename.length);
      return ext.toLowerCase();
    }
    catch{
      return "";
    }
  }

  showError(msg){
    this.toastr.error(msg);
  }

}
