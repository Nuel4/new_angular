import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { GlobalState } from '../../../core';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http'
import { fileupload, Form, FileUploadType } from '../../../model'
import { AuthenticationStore } from '../../../authentication'
import { FormService } from '../../../services/workspace/form.service'
import { FileStorageService } from '../../../services/filestorage.service'
import * as moment from 'moment'
@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileuploadComponent implements OnInit {
  files: fileupload[] = [];
  @Input()
  filepath: string;
  @Input()
  uploadType: FileUploadType;
  
  isDisabled: boolean;

  constructor(private formService: FormService,
    private fileStoreService: FileStorageService,
    private authStore: AuthenticationStore) {

  }

  ngOnInit() {
    this.isDisabled = true;
  }
  fileChange(fileList: Array<File>) {
    let data: any = [];
    for (let file of fileList) {
      console.log("value of file",file);
      let name = file.name;
      let namearr = name.split(".")
      let arrlen = namearr.length
      let cflen = arrlen -1
      let changednamearr: string;
      for(let i=0;i<cflen;i++){
        changednamearr = (changednamearr? changednamearr+".": "")+namearr[i]
      }
      changednamearr = changednamearr+"_"+ moment(new Date()).format("DDMMYYYYhhmm")+"."+namearr[arrlen-1]
      // let len = name.length;
      // let firstname =  name.substr(0,(len-4));
      // let extn = name.substr((len-4),4);
      // let changedname = firstname+moment(new Date()).format("DDMMYYYYhhmm")+extn;
      // console.log("value of changednamearr and name is",changednamearr,changedname,namearr)
      let temp = new File([file],changednamearr,{type: file.type});
      data.push(new fileupload(temp));
      console.log("value of file is",data)
    }
    this.files = data;
    this.isDisabled = false;
  }

  onUploadFiles() {
    this.isDisabled = true;
    for (let fileItem of this.files) {
      // const formData = new FormData();
      // formData.append("fileItem", fileItem.file);
      var formData = new FormData();
          formData.append('fileItem', fileItem.file);
      // console.log("value of formdata is",this.filepath,formData,fileItem.file);
      this.fileStoreService.addFile(this.filepath, formData)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            fileItem.progress = Math.round(100 * event.loaded / event.total);
          }
          else if (event.type === HttpEventType.Response) {
            fileItem.isCompleted = true;
            fileItem.message = event.body.Value.toString();
            // console.log(event.body.Value.toString());
            // upload completed successfully.
            // if(this.uploadType == FileUploadType.Practice)
                this.addFilestoDB(fileItem);

          }
        },
          (err: HttpErrorResponse) => {
            fileItem.isError = true;
            if (err.error) {
              fileItem.message = err.error.toString();
            }
            else {
              fileItem.message = err.message;
            }
            if (err.error instanceof Error) {
              // A client-side or network error occurred. Handle it accordingly.
              // console.error("file upload exception: " + err.message);
            } else {
              // The backend returned an unsuccessful response code.
              // console.error("file upload exception: " + err.message);
            }
          }
        );
    }
  }

  addFilestoDB(fileItem) {
    var newform = new Form();
    newform.FormName = fileItem.filename;
    newform.FormExtension = this.getFlieExtension(fileItem.filename);
    //newform.FormPath = "";
    newform.CreatedByUserId = this.authStore.UserDetail.UserId;
    newform.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
    newform.DateCreated = new Date();
    newform.DateLastUpdated = new Date();
    // console.log("value of form name",newform)
    this.formService.addForm(JSON.stringify(newform))
      .subscribe(result => {
        // console.log('Added new form Id: ' + result.FormId);
      });
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
}
