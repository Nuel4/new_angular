import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DocumentServicesService } from '../../../../services/document/document.services.service';
import { ToastrService } from 'ngx-toastr';
import { WaitingroomService } from '../../../../services/waitingnroom/waitingroom.service';
import { AuthenticationStore } from '../../../../../app/authentication';
import * as moment from 'moment';
import { PatientmanagementService } from '../../../../../app/services/workspace/patient-management.service';
import { fileupload, Document } from '../../../../../app/model';
import { FileStorageService } from '../../../../../app/services/filestorage.service';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormService } from '../../../../../app/services/workspace/form.service';
import { RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { DrawOnImageComponent } from '../../sktch-pad/sketchpad/draw-on-image.component';
import { fabric } from 'fabric';


@Component({
  selector: 'app-document-actions',
  templateUrl: './document-actions.component.html',
  styleUrls: ['./document-actions.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DocumentActionsComponent implements OnInit {
  files: fileupload[] = [];
  // dmsCategories: any = [];
  @Input() rowData;
  @Input() patientData: any = {};
  @Input() IsEdit: boolean;
  @Input() IsReviewScan: boolean;
  @Input() IsAttachFile: boolean;
  @Input() IsTransfer: boolean;
  @Input() IsViewDoc: boolean;
  @Input() FileReview;
  @Input() DocumentUrl;
  @Input() dmsCategories;
  @Input() selectedRow;
  @Input() IsSign;
  @Input() filepath;
  @Output() resetTable: EventEmitter<any> = new EventEmitter();
  categories: any[];
  cols: any[];
  uploadedFiles: any[] = [];
  encounterRow;
  pdfSource: SafeResourceUrl;
  selectedCategory: any;
  docName: any;
  updateData: any;
  rowDetails: any;
  patientDeatils: any = {
    limit: 10,
    lastname: '',
    firstname: '',
    ssn: '',
    phone: '',
    status: ''
  };
  src = '../../../../../assets/img/document/Blank.png';;
  imageName= 'Blank';
  public currentTool: string = 'brush';
  public currentSize: string = 'small';
  public currentColor: string = 'black';
 canvas: any;
  Index;
  patientList: any = {};
  review_cols: any = [];
  attach_files: any = {};
  attach_file_Results;
  attach_cols: any = [];
  scanList: any = [];
  fileArr: any;
  isDisabled: boolean;
  transferDoc: boolean = true;
  currentURL: any;
  public canUndo: boolean = false;
  public canRedo: boolean = false;
  private stack: any[] = [];

  // filePath = 'SignatureUploads\\' + this.authStore.PracticeDetail.PracticeId;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private documentServices: DocumentServicesService,
    private toastr: ToastrService,
    private waitingRoomService: WaitingroomService,
    private authStore: AuthenticationStore,
    private patMngServ: PatientmanagementService,
    private fileStoreService: FileStorageService,
    private formService: FormService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    console.log("value of rowData",this.rowData)
if(this.IsSign){
  this.src
  this.imageName = 'Blank';
    const canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      isDrawingMode: true,
  });

  let isFirstTry = true;
  const imgEl = new Image();
  imgEl.setAttribute('crossOrigin', 'anonymous');
  imgEl.src = this.src;
  imgEl.onerror = () => {
      if (isFirstTry) {
          imgEl.src = 'http://cors-anywhere.herokuapp.com/' + this.src;
          isFirstTry = false;
      }
  };
  imgEl.onload = () => {
      const fabricImg = new fabric.Image(imgEl);
      canvas.setBackgroundImage(fabricImg, ((img: HTMLImageElement) => {
          if (img !== null) {
              canvas.setWidth(img.width);
              canvas.setHeight(img.height);
          }
      }), {
              crossOrigin: 'anonymous',
              originX: 'left',
              originY: 'top'
          });
  };

  canvas.on('path:created', (e) => {
    this.stack = [];
    this.setUndoRedo();
});
// this.selectTool(this.currentTool);
// this.selectColor(this.currentColor);
// this.selectDrawingSize(this.currentSize);
this.canvas = canvas
  this.selectDrawingSize();
}

    this.categories = [
      { name: 'General' },
      { name: 'Letters' },
      { name: 'ER notes' },
      { name: 'Office Visits' }
    ];

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'dob', header: 'DOB' },
      { field: 'ssn', header: 'SSN' },
    ];

    this.review_cols = [
      { field: 'Name', header: 'Document Name' },
      { field: 'dateCreated', header: 'Document Scanned' },
      { field: 'documentDate', header: 'Document Date' },
      { field: 'DmsCategoryName', header: 'Dms Category' },
      { field: 'NoOfPages', header: 'Pages In Scan' },
      { field: 'EncounterId', header: 'Encounter' }
    ];
    this.attach_cols = [
      { field: 'date_created', header: 'Date' },
      { field: 'chief_complaint', header: 'Details' },
      { field: 'physician', header: 'Physician' },
      { field: 'is_clinical_summary_given_to_patient', header: 'Summary' },
    ]
    if (this.IsEdit) {
      this.docName = this.patientData.Name;
    }
    if (this.IsReviewScan) { this.getScanReviews(); }
    if (this.IsAttachFile) {
      this.getAttachFiles();
    }
    if (this.IsTransfer) {

    }

    if(this.IsViewDoc){
    this.pdfSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.DocumentUrl.Value);
    // this.pdfSource = decodeURI(this.DocumentUrl.Value);
    console.log("value of pdf is",this.DocumentUrl.Value)
    // this.pdfSource = this.pdfSource.toString();
    // bypassSecurityTrustUrl(this.DocumentUrl.Value);
    // this.sanitizer.bypassSecurityTrustResourceUrl(this.DocumentUrl.Value);
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
      let changednamearr: string;
      for(let i=0;i<cflen;i++){
        changednamearr = (changednamearr? changednamearr+".": "")+namearr[i]
      }
      changednamearr = changednamearr+"_"+moment(new Date()).format("DDMMYYYYhhmm")+"."+namearr[arrlen-1]
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
    console.log("value of files is",this.files)
    // this.files.forEach((item)=>{
    //   let name = item.filename;
    //   let len = name.length
    //   let firstname = name.substr(0,(len-4));
    //   let extn = name.substr((len-4),4);
    //   let changedname = firstname+moment(new Date()).format("DDMMYYYYhh:mm")+extn;
    //   item.filename = changedname
    //   item['cfFile'] = new File([item.file],changedname,{type: item.file.type})
    //   // let obj = item.file;
    //   // let obj1;
    //   // obj1.name = changedname;
    //   // obj1.lastModified = obj.lastModified
    //   // obj1.lastModifiedDate = new Date(); 
    //   // obj1.size = obj.size;
    //   // obj1.webkitRelativePath = obj.webkitRelativePath
    // })
    console.log("value of files is",this.files)
    this.isDisabled = false;
  }


  onUpload() {
    this.isDisabled = true;
    console.log("value of files",this.files)
    for (let fileItem of this.files) {
      const formData = new FormData();
      formData.append("fileItem", fileItem.file);
      console.log("value of parameter for blob storage is",formData)
      this.fileStoreService.addFile(this.filepath, formData)
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
  }

  addDoc() {
    let patientdata = JSON.parse(sessionStorage.getItem("PatientDetail"))
    for (let fileItem of this.files) {
      var newform = new Document();
      newform.PatientId = patientdata.PatientId;
      newform.Name = fileItem.filename;
      newform.Extension = this.getFlieExtension(fileItem.filename);
      newform.Path = fileItem.filename;
      newform.CreatedByUserId = this.authStore.UserDetail.UserId;
      newform.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      newform.DateCreated = new Date();
      newform.DateLastUpdated = new Date();
      newform.SavedMethodIdentifier = 1;
      newform.ReviewStatus = 1;
      newform.DocumentDate = new Date();
      newform.IsInactive = false;
      newform.DmsCategoryId = 1;
      newform.UserId = this.authStore.UserDetail.UserId;
      console.log("value of new form is",newform)
      this.formService.addPatientDoc(newform)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            fileItem.progress = Math.round(100 * event.loaded / event.total);
          }
        })
    }
  }

  getFlieExtension(filename): string {
    try {
      let ext = filename.substr(filename.lastIndexOf('.'), filename.length);
      console.log('extension file',ext)
      return ext.toLowerCase();
    }
    catch{
      return "";
    }
  }
  onClear(){
    this.patientDeatils.lastname = "";
    this.patientDeatils.firstname = "";
    this.patientDeatils.ssn = "";
  }
  getPatientFileUpdate() {
    this.documentServices.getPatientFile({ patientFileId: this.patientData.patientId }).subscribe((result: any) => {
      this.updateData = result;
    })
  }


  // update file code is here
  updateEditedFile() {
    let payload = {
      PatientFileId: this.selectedRow.PatientFileId,
      PatientId: this.selectedRow.PatientId,
      Name: this.docName,
      Extension: this.selectedRow.Extension,
      DateCreated: this.selectedRow.DateCreated,
      CreatedByUserId: this.selectedRow.CreatedByUserId,
      DateLastUpdated: moment(new Date()).format('YYYY-MM-DD'),
      LastUpdatedByUserId: this.authStore.UserDetail.UserId,
      SavedMethodIdentifier: this.selectedRow.SavedMethodIdentifier,
      IsInactive: this.selectedRow.IsInactive,
      DmsCategoryId: this.selectedCategory.DmsCategoryId,
      ReviewStatus: this.selectedRow.ReviewedStatus,
      NoOfPages: this.selectedRow.NoOfPages,
      DocumentDate: this.selectedRow.Documentdate
    }
    this.documentServices.updatePatientFile(payload).subscribe((result: any) => {
      this.resetTable.emit(true);
      this.toastr.success('Updated Successfully')
    })
  }

  getPatientFile() {
    this.documentServices.getPatientFile({ patientFileId: this.patientData.patientId }).subscribe((result: any) => {
      result.IsInactive = false;
      this.documentServices.updatePatientFile(result).subscribe((result: any) => {

        let payload = {
          patientFileId: this.patientData,
          patientEncounterId: this.patientData,
        }
        this.documentServices.getPatientEncounteFile(payload).subscribe((elements: any) => {
        })
      })
    })
  }

  canceloper(){
    this.resetTable.emit(false);
  }

  deleteDoc() {
    let pay1 = {};
    let temp = {
      patientFileId: this.patientData.PatientFileId
    }
    this.documentServices.getPatientFile(temp).subscribe((result: any) => {
      console.log("value of getPatient File",result)
      result[0].IsInactive = true;
      pay1 = result[0];
      this.documentServices.updatePatientFile(pay1).subscribe((res: any) => {
console.log("value of update patient file",res)
// if(this.patientData.EncounterId){
        let payload = {
          patientFileId: this.patientData.PatientFileId,
          patientEncounterId: this.patientData.EncounterId,
        }
        this.documentServices.getPatientEncounteFile(payload).subscribe((elements: any) => {
          if (elements.length === 0) {
            this.resetTable.emit(true);
            this.toastr.success('Deleted Successfully')
          } else {
            this.documentServices.deleteDoc(elements).subscribe(results => {
              this.resetTable.emit(true);
              this.toastr.success('Deleted Successfully')
            })

          }
        })
      // } else {
      //   this.toastr.success('Deleted Successfully')
      // }
      })
    })
  }


  findPatient(pageNo?) {
    this.patientDeatils.offset = pageNo ? pageNo : 0;
    this.patientList = [];
    this.patMngServ.GetAllPatientsPagedWithFilters(this.patientDeatils).subscribe((resp: any) => {
      this.patientList = resp;

    });
  }
  paginate(event) {
    this.findPatient(event.index);
  }

  onSelectRow(rowData) {
    this.rowDetails = rowData;
    this.transferDoc = false;
  }
  updateList() {
    this.patientData.patientId = this.rowDetails.PatientId;
    this.documentServices.updatePatientFile(this.patientData).subscribe((result: any) => {
      this.resetTable.emit(true)
      this.toastr.success('Updated Successfully')
    })
  }

  onRowSelect(event) {
    this.encounterRow = event.data;
    console.log("value of encounter row is",this.encounterRow);
  }
  getScanReviews() {
    this.documentServices.getScanReviews({ patientId: this.patientData.patientId ? this.patientData.patientId : this.patientData.PatientId }).subscribe((results: any) => {
      this.scanList = results.map(item => ({
        ...item,
        documentDate: moment(item.DocumentDate).format('MM-DD-YYYY'),
        dateCreated: moment(item.DateCreated).format('MM-DD-YYYY')
      }));

    })
  }

  getAttachFiles(pageNo?) {
    let payload = {
      patientId: this.patientData ? this.patientData.PatientId : '',
      offset: pageNo ? pageNo : 0,
      limit: 10
    }
    this.documentServices.getAttachFiles(payload).subscribe((results: any) => {
      this.attach_files = results;
      this.attach_file_Results = this.attach_files.Results
      this.attach_file_Results.forEach((item,i)=>{
        item.date_created = moment(new Date(item.date_created)).format("MM/DD/YYYY")
        item.indexvalue = i
      })
      
      this.attach_files.Results = this.attach_file_Results;
      console.log("value of results are",this.attach_files)
    })
  }

  paginateAttach(event) {
    this.getAttachFiles(event.page);
  }

  // uploadFiles() {
  //   let payload = {
  //     "PatientId": this.patientData.patientId,
  //     "Name": "string",
  //     "Extension": "string",
  //     "DateCreated": "2019-04-04T21:38:51.831Z",
  //     "CreatedByUserId": 0,
  //     "DateLastUpdated": "2019-04-04T21:38:51.831Z",
  //     "LastUpdatedByUserId": 0,
  //     "Path": "string",
  //     "FileData": "string",
  //     "SavedMethodIdentifier": 1,
  //     "IsInactive": false,
  //     "DmsCategoryId": 0,
  //     "UserId": this.authStore.UserDetail.UserId,
  //     "ReviewStatus": 1,
  //     "NoOfPages": 0,
  //     "DocumentDate": "2019-04-04T21:38:51.831Z",
  //     "MrPatientEncounterId": 0,
  //   }
  // }

  paginateencounter(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.getAttachFiles(this.Index);
  }

  getencounter(){

  }
  selectEncounter(rowData){
    console.log("value of encounter",this.patientData,rowData,this.encounterRow)
    let body={
      MrPatientEncounterId: this.encounterRow.mr_patient_encounter_id,
      PatientFileId: this.patientData.PatientFileId,
      Active: true,
    }
    // this.patientData.EncounterId = this.encounterRow.mr_patient_encounter_id
    this.patientData.DateLastUpdated = new Date();
    this.patientData.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
    this.patientData.EncounterId = this.encounterRow.mr_patient_encounter_id;
    this.patientData.ReviewStatus = this.patientData.ReviewedStatus;
    this.documentServices.insertEncounter(body).subscribe(res=>{
      console.log("value of res",res,this.patientData)
      this.documentServices.updatePatientFile(this.patientData).subscribe(res=>{
        console.log("value of res",res)
        this.resetTable.emit(true);
        this.toastr.success("Encounter id added to File Successfully")
      })
    })

  }

  resetTab(event) {
    this.resetTable.emit(true);
  }
  openCharts(row) {
    sessionStorage.setItem('PatientDetail', JSON.stringify(row));
    this.authStore.PatientDetail = JSON.parse(sessionStorage.getItem("PatientDetail"));
    this.authStore.ReloadPatientData()
    this.router.navigate(["/pages/chart"]);
  }

  onreview(){
    console.log("value of review",this.patientData,this.FileReview,this.DocumentUrl);
    let param = {
      patientFileId: this.patientData.PatientFileId,
      reviewStatus: 2
    }
    this.documentServices.updateReviewStatus(param).subscribe(res=>{
      console.log("value of res",res)
      this.resetTable.emit(true);
      this.toastr.success("File has been reviewed successfully")
    })

  }

  setUndoRedo() {
    this.canUndo = this.canvas.getObjects().length > 0;
    this.canRedo = this.stack.length > 0;
}

selectDrawingSize(){
  this.canvas.freeDrawingBrush.width = 5;
}
clearCanvas(){
    if (this.canvas !== null && this.canvas !== undefined) {
      this.canvas.remove(...this.canvas.getObjects());
      this.setUndoRedo();
  }
  }
  onsignsave(){
console.log("value of sign save button is",this.patientData)
  }
}
