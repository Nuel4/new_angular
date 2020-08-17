import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WaitingroomService } from '../../../../../services/waitingnroom/waitingroom.service'
import { UploadfilesComponent } from './uploadfiles/uploadfiles.component';
import { AuthenticationStore } from '../../../../../../app/authentication';
import { FileStorageService } from '../../../../../../app/services/filestorage.service';
import { ToastrService } from 'ngx-toastr';
import { NoriceBoardService } from '../../../../../../app/services/workspace/noticeboard.service';
import { DocumentServicesService } from '../../../../../../app/services/document/document.services.service';
import { DocumentActionsComponent } from '../../../../../../app/pages/chart/documents/document-actions/document-actions.component';
import { LetterEditorComponent } from '../../../../../../app/pages/chart/letters/letter-editor/letter-editor.component';
import { SketchpadModalComponent } from '../../../../../../app/pages/chart/sktch-pad/sketchpad-modal/sketchpad-modal.component';
import * as moment from 'moment';
import { fileupload, Document } from '../../../../../../app/model';
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilesComponent implements OnInit {
  files: fileupload[] = [];
  Patientid;
  showprtandchrge: boolean;
  @Input()
  set _showprtandchrge(val: any){
    this.showprtandchrge = val;
  }

  get _showprtandchrge(): any {
    return this.showprtandchrge;
  }

  @Input() 
  set _patientIdToEdit(val: any){
    this.Patientid = val;
  }

  get _patientIdToEdit(): any {
    return this.Patientid;
  }
  @Output() next = new EventEmitter();
  @Output() crgslip = new EventEmitter();
  documents: any[];

  cols: any[];
  documentList:any = [];
  selectRow;
  
  patientDetails: any;
  filters: any = {};
  Index: number;
  TotalRecords: any;
  PageSize: any;
  selectedRow: any;
  dmsCategoryList: any;
  docTable;
  FileReview;
  DocumentUrl;
  
  constructor(
    private routes: Router,
    private modalService: NgbModal,
    private authStore: AuthenticationStore,
    private fss: FileStorageService,
    private activeModal: NgbActiveModal,
    private nbs: NoriceBoardService,
    private toastr: ToastrService,
    private dss: DocumentServicesService,
    private waitingroomServices: WaitingroomService
  ) { }

  ngOnInit() {
    this.getDocumentList();
    this.documents = [
      {
        Sign: 'sign',
        docName: 'docName',
        displayDate: 'fileType',
        DateCreated: 'dateCreated',
        Documentdate: 'docDate',
        DmsCategoryName: 'dmsCategory',
        ReviewedStatus: 'reviewedStatus',
        Encounter: 'encounter'
      }
    ]
    this.cols = [
      { field: "Sign", header: "Sign" },
      { field: "Comment", header: "View" },
      { field: "Name", header: "Document Name", filter: true },
      { field: "Extension", header: "File Type", filter: true },
      { field: "DateCreated", header: "Date Created", filter: true },
      { field: "Documentdate", header: "Document Date", filter: true },
      { field: "DmsCategoryName", header: "Dms Category", filter: true },
      { field: "ReviewedStatus", header: "Reviewed Status", filter: true },
      { field: "Encounter", header: "Encounter" }
    ];

    this.getDmsCategory();
    // this.filesColumns = [
    //   { field: 'fileName', header: 'File Name' },
    //   { field: 'added', header: 'Added' },
    //   { field: 'fileType', header: 'File Type' },
    //   { field: 'dms', header: 'DMS' },
    //   { field: '', header: 'View' },
    //   { field: '', header: 'Cancel' },
    // ],
    //   this.filesData = [
    //     { added: '17/01/2019', Time: '12:10 PM', fileName: 'test_image1', fileType: 'jpeg', dms: 'abcd' },
    //     { added: '22/01/2019', Time: '04:55 PM', fileName: 'test_image2', fileType: 'png', dms: 'xyz' },
    //     { added: '23/12/2018', Time: '07:45 PM', fileName: 'test_image3', fileType: 'svg', dms: 'pqr' },
    //     { added: '17/11/2018', Time: '11:12 PM', fileName: 'test_image4', fileType: 'jpeg', dms: 'mno' },
    //     { added: '19/11/2018', Time: '02:46 PM', fileName: 'test_image5', fileType: 'png', dms: 'abcd' },
    //   ]
  }

  paginate(event) {
    console.log('page', event)
    const index = (event.first / event.rows);
    this.Index = index
    console.log('Item Paged Index is ', this.Index);
    this.getDocumentList(this.Index)
  }

  pdfSrc: any;
  opendocmodal(type, rowData) {
    let param;
    // this.isLoader = true;
    // if (type === 'edit') {
    //   const modalRef = this.modalService.open(DocumentActionsComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    //   modalRef.componentInstance.name = 'true';
    //   modalRef.componentInstance.IsEdit = true;
    //   modalRef.componentInstance.patientData = this.selectedRow;
    //   modalRef.componentInstance.selectedRow = this.selectedRow;
    //   modalRef.componentInstance.dmsCategories = this.dmsCategoryList
    //   modalRef.componentInstance.resetTable.subscribe((resp) => {
    //     if (resp) { this.getDocumentList(); }
    //   });
    // }
    // if (type === 'transfer') {
    //   const modalRef = this.modalService.open(DocumentActionsComponent, { centered: true, size: 'lg' });
    //   modalRef.componentInstance.name = 'true';
    //   modalRef.componentInstance.IsTransfer = true;
    //   modalRef.componentInstance.patientData = this.selectedRow;
    //   modalRef.componentInstance.resetTable.subscribe((resp) => {
    //     if (resp) {
    //       this.getDocumentList();
    //     }
    //   });
    // }
    // if (type === 'delete') {
    //   const modalRef = this.modalService.open(DocumentActionsComponent, { size: 'sm', windowClass: 'modelStyle' });
    //   modalRef.componentInstance.name = 'true';
    //   modalRef.componentInstance.selectedRow = this.selectedRow;
    //   modalRef.componentInstance.patientData = this.selectedRow;
    //   modalRef.componentInstance.IsDelete = true;
    //   modalRef.componentInstance.resetTable.subscribe((resp) => {
    //     console.log("value of resp", resp);
    //     // this.docTable = resp
    //     // this.selectRow = null;
    //     if (resp) {
    //       this.getDocumentList();
    //     }
    //   });
    // }
    // if (type === 'upload') {
    //   const modalRef = this.modalService.open(DocumentActionsComponent, { centered: true, size: 'lg' });
    //   modalRef.componentInstance.name = 'true';
    //   modalRef.componentInstance.IsUpload = true;
    //   modalRef.componentInstance.filepath = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
    //   modalRef.componentInstance.resetTable.subscribe((resp) => {
    //     if (resp) {
    //       this.getDocumentList();
    //     }
    //   });
    // }
    // if (type === "review_scans") {
    //   const modalRef = this.modalService.open(DocumentActionsComponent, {
    //     centered: true,
    //     size: "lg"
    //   });
    //   modalRef.componentInstance.name = "true";
    //   modalRef.componentInstance.IsReviewScan = true;
    //   modalRef.componentInstance.patientData = this.selectedRow;
    // }
    // if (type === "attach_file") {
    //   if (this.selectRow) {
    //     const modalRef = this.modalService.open(DocumentActionsComponent, {
    //       centered: true,
    //       size: "lg"
    //     });
    //     modalRef.componentInstance.name = "true";
    //     modalRef.componentInstance.IsAttachFile = true;
    //     modalRef.componentInstance.patientData = this.selectedRow;
    //     modalRef.componentInstance.resetTable.subscribe((resp) => {
    //       if (resp) {
    //         this.getDocumentList();
    //       }
    //     })
    //   } else {
    //     this.toastr.error("Please select atleast one file")
    //   }
    // }
    if (type === "view") {
      console.log("value of doctab", rowData);
      this.selectRow = rowData
      this.selectedRow = rowData
      console.log("value of doctab", rowData, this.selectRow);
      let filePath: string = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
      let filename: string = rowData.SavedMethodIdentifier === 2 ? 'Scanned document' + '\\' + this.selectRow.Name : filePath + '\\' + this.selectRow.Name;
      param = {
        patientFileId: this.selectRow.PatientFileId
      }
      this.nbs.getDocView(param).subscribe(res => {
        this.FileReview = res
        this.fss.downloadFile(encodeURI(filename)).subscribe(res => {
          this.DocumentUrl = res;
          this.pdfSrc = this.DocumentUrl.Value
          if ((this.selectedRow.SavedMethodIdentifier === 4) || (this.selectedRow.SavedMethodIdentifier === 1)) {
            const modalRef = this.modalService.open(DocumentActionsComponent, {
              centered: true,
              size: "lg"
            });
            modalRef.componentInstance.name = "true";
            modalRef.componentInstance.IsViewDoc = true;
            modalRef.componentInstance.patientData = this.selectedRow;
            modalRef.componentInstance.rowData = this.selectedRow;
            modalRef.componentInstance.FileReview = this.FileReview;
            modalRef.componentInstance.DocumentUrl = this.DocumentUrl;
            modalRef.componentInstance.resetTable.subscribe((resp) => {
              if (resp) {
                this.getDocumentList();
              }
            });
          } else if (this.selectedRow.SavedMethodIdentifier === 3) {
            const modalRef = this.modalService.open(DocumentActionsComponent, {
              centered: true,
              size: "sm"
            });
            modalRef.componentInstance.name = "true";
            modalRef.componentInstance.IsViewDoc = true;
            modalRef.componentInstance.patientData = this.selectedRow;
            modalRef.componentInstance.rowData = this.selectedRow;
            modalRef.componentInstance.FileReview = this.FileReview;
            modalRef.componentInstance.DocumentUrl = this.DocumentUrl;
            modalRef.componentInstance.resetTable.subscribe((resp) => {
              if (resp) {
                this.getDocumentList();
              }
            });
          }

        })
      })

    }
    if (type === "fileEncounter") {
      this.selectRow = rowData
      this.selectedRow = rowData
      if (this.selectRow.NoOfEncounters > 1) {
        param = {
          patientFileId: this.selectRow.PatientFileId,
          patientEncounterId: this.selectRow.EncounterId
        }
        this.dss.getPatientEncounteFile(param).subscribe(res => {
          setTimeout(() => {
            // this.isLoader=false;
          }, 3000);
        })
      }      
    let modalRef = this.modalService.open(LetterEditorComponent , { centered: true,size:'lg'})
    modalRef.componentInstance.summary = true;
    modalRef.componentInstance.header = 'View Document'
    }

    if (type === "signature") {
      this.selectRow = rowData
      this.selectedRow = rowData
      console.log("value of rowData", rowData)
      let filePath: string = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
      let filename: string = filePath + '\\' + this.selectRow.Name;
      param = {
        patientFileId: this.selectRow.PatientFileId
      }
      this.nbs.getDocView(param).subscribe(res => {
        this.FileReview = res
        this.fss.downloadFile(encodeURI(filename)).subscribe(res => {
          this.DocumentUrl = res;
          const modalRef = this.modalService.open(SketchpadModalComponent, {
            centered: true, size: 'lg', windowClass: 'modelStyle'
          });
          modalRef.componentInstance.ComponentName = "Signature";
          modalRef.componentInstance.imageName = "Signature";
          modalRef.componentInstance.imageUrl = this.DocumentUrl.Value;
          modalRef.componentInstance.rowdata = rowData
          modalRef.componentInstance.OnSign.subscribe((resp) => {
            if(resp){
              this.getDocumentList();
            }
            // this.isLoader = true;
          });
        })
      });

      // const modalRef = this.modalService.open(SketchpadModalComponent, {
      //   centered: true, size: 'lg', windowClass: 'modelStyle'
      // });
      // modalRef.componentInstance.ComponentName = "Signature";
      // modalRef.componentInstance.imageName = "Signature";
      // modalRef.componentInstance.imageUrl = '../../../../assets/img/document/Blank.jpg';


    }

  }



  getDocumentList(index?) {
    this.documentList = [];
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))
    let payload = {
      patientId: this.Patientid,
      offset:index ? index : 0,
      limit: 10,
      documentName: this.filters.documentName ? this.filters.documentName : "",
      dmsCategoryId: this.filters.selectedCategory
        ? this.filters.selectedCategory.DmsCategoryId
        : ""
    }
    console.log("value of payload is",payload);
    this.waitingroomServices.getDocumentList(payload).subscribe((results:any) => {
      this.documentList = results;
      // this.TotalRecords = results.TotalItems;
      // this.PageSize = results.PageSize;
      console.log('document',this.documentList)
    })
  }

  openbsmodal(){
    const modalRef = this.modalService.open(UploadfilesComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.PatientId = this.Patientid;
    modalRef.componentInstance.categories = this.dmsCategoryList;
  }

  getDmsCategory(){
    this.waitingroomServices.getDmsCategory().subscribe((results:any) =>{
      this.dmsCategoryList = results;
      console.log('dmsCategoryList:',this.dmsCategoryList)
      })
  }
  
  onRowSelect(event){
console.log("value of selected row is",event) 

}
  openNext() {
    // this.index = (this.index === 6) ? 0 : this.index + 1;
    this.next.emit();
  }
  onClose() {
    this.routes.navigate(['/pages/workspace/patientmanagement']);
  }

  ScanFiles(){
    this.routes.navigate(['/pages/scanning/findpatients']);
  }
  chargeSlips(data){
    this.crgslip.emit(data)
   }
}
