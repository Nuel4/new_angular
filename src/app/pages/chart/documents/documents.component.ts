import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentActionsComponent } from './document-actions/document-actions.component';
import { WaitingroomService } from '../../../../app/services/waitingnroom/waitingroom.service';
import { FileStorageService } from '../../../../app/services/filestorage.service';
import { AuthenticationStore } from '../../../authentication';
import { NoriceBoardService } from '../../../../app/services/workspace/noticeboard.service';
import { DocumentServicesService } from '../../../../app/services/document/document.services.service';
import { ToastrService } from 'ngx-toastr';
import { SketchpadModalComponent } from '../sktch-pad/sketchpad-modal/sketchpad-modal.component';
import { LetterEditorComponent } from '../letters/letter-editor/letter-editor.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements OnInit {
  @ViewChild('pdfViewer') pdfViewer

  documents: any[];

  cols: any[];
  documentList: any;
  transferdoc: boolean = true;
  isdisabled: boolean = false;
  patientDetails: any;
  filters: any = {};
  Index: number;
  TotalRecords: any;
  PageSize: any;
  selectedRow: any;
  dmsCategoryList: any;
  selectRow;
  docTable;
  viewDocument;
  public displayPdf = true;
  DocumentUrl;
  FileReview;
  filePath: string;
  Signature;
  patientData;
  inputChanges: any;
  Results: any=[];
  // isLoader: boolean = true;
  constructor(private router: Router,
    private modalService: NgbModal,
    private authStore: AuthenticationStore,
    private fss: FileStorageService,
    private activeModal: NgbActiveModal,
    private nbs: NoriceBoardService,
    private toastr: ToastrService,
    private dss: DocumentServicesService,
    private waitingroomServices: WaitingroomService) { }

  ngOnInit() {
    this.patientData = JSON.parse(sessionStorage.getItem("PatientDetail"));
    this.getDocumentList();
    this.filePath = 'docsUpload\\' + this.authStore.PracticeDetail.PracticeId;
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
      { field: "Sign", header: "Signature" },
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
    this.getSign();
  }
  getSign() {
    let patient = JSON.parse(sessionStorage.getItem('PatientDetail'));
    let ptname = patient.LastName + "," + patient.FirstName + "_" + "Signature.png";
    let flpathe = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
    let filename = flpathe + '\\' + ptname;
    this.fss.downloadFile(encodeURI(filename)).subscribe(res => {
      this.Signature = res
    });
  }
  onUpload(event) {
    this.router.navigate(['/pages/chart/upload-document'], { skipLocationChange: true });
  }
  onreviewScan(event) {
    this.router.navigate(['/pages/chart/review-scan'], { skipLocationChange: true });
  }
  onRowSelect(event) {
    this.selectedRow = event.data;
    this.isdisabled = true;
    if (event.data.ReviewedStatus === 2) {
      this.transferdoc = false;
    } else {
      this.transferdoc = true;
    }

    this.isdisabled = false;
    if (event.data.ReviewedStatus === 2) {
      this.transferdoc = false;
    } else { this.transferdoc = false; }
  }

  pdfSrc: any;
  openbsmodal(type, rowData) {
    let param;
    // this.isLoader = true;
    if (type === 'edit') {
      const modalRef = this.modalService.open(DocumentActionsComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.IsEdit = true;
      modalRef.componentInstance.patientData = this.selectedRow;
      modalRef.componentInstance.selectedRow = this.selectedRow;
      modalRef.componentInstance.dmsCategories = this.dmsCategoryList
      modalRef.componentInstance.resetTable.subscribe((resp) => {
        if (resp) { this.getDocumentList(); }
      });
    }
    if (type === 'transfer') {
      const modalRef = this.modalService.open(DocumentActionsComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.IsTransfer = true;
      modalRef.componentInstance.patientData = this.selectedRow;
      modalRef.componentInstance.resetTable.subscribe((resp) => {
        if (resp) {
          this.getDocumentList();
        }
      });
    }
    if (type === 'delete') {
      const modalRef = this.modalService.open(DocumentActionsComponent, { size: 'sm', windowClass: 'modelStyle' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.selectedRow = this.selectedRow;
      modalRef.componentInstance.patientData = this.selectedRow;
      modalRef.componentInstance.IsDelete = true;
      modalRef.componentInstance.resetTable.subscribe((resp) => {
        console.log("value of resp", resp);
        // this.docTable = resp
        // this.selectRow = null;
        if (resp) {
          this.getDocumentList();
        }
      });
    }
    if (type === 'upload') {
      const modalRef = this.modalService.open(DocumentActionsComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.name = 'true';
      modalRef.componentInstance.IsUpload = true;
      modalRef.componentInstance.filepath = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
      modalRef.componentInstance.resetTable.subscribe((resp) => {
        if (resp) {
          this.getDocumentList();
        }
      });
    }
    if (type === "review_scans") {
      const modalRef = this.modalService.open(DocumentActionsComponent, {
        centered: true,
        size: "lg"
      });
      modalRef.componentInstance.name = "true";
      modalRef.componentInstance.IsReviewScan = true;
      modalRef.componentInstance.patientData = this.selectedRow;
    }
    if (type === "attach_file") {
      if (this.selectRow) {
        const modalRef = this.modalService.open(DocumentActionsComponent, {
          centered: true,
          size: "lg"
        });
        modalRef.componentInstance.name = "true";
        modalRef.componentInstance.IsAttachFile = true;
        modalRef.componentInstance.patientData = this.selectedRow;
        modalRef.componentInstance.resetTable.subscribe((resp) => {
          if (resp) {
            this.getDocumentList();
          }
        })
      } else {
        this.toastr.error("Please select atleast one file")
      }
    }
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


  showsign(doctab) {
    let filePath: string = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
    let name = this.patientData.LastName + "," + this.patientData.FirstName + "_Signature.png";
    let filename: string = filePath + '\\' + name;
    this.fss.downloadFile(encodeURI(filename)).subscribe(res => {
      this.Signature = res
    });
  }
  onSelectRow(rowData) {
    this.selectedRow = rowData;
    this.isdisabled = true;
    if (rowData.ReviewedStatus === 2) {
      this.transferdoc = false;
    } else {
      this.transferdoc = true;
    }
  }

  paginate(event) {
    const index = (event.first / event.rows);
    this.Index = index
    this.getDocumentList(this.Index)
  }
  
  getDocumentList(index?) {
    this.documentList = [];
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"));
    let payload = {
      patientId: this.patientDetails.PatientId,
      offset: index ? index : 0,
      limit: 10,
      documentName: this.filters.documentName ? this.filters.documentName : "",
      dmsCategoryId: this.filters.selectedCategory
      ? this.filters.selectedCategory.DmsCategoryId
      : ""
    }
    this.waitingroomServices.getDocumentList(payload).subscribe((results: any) => {
      this.documentList = results;
      this.Results = this.documentList.Results
     
    });
    if(this.Results){
    this.Results.forEach(item => {
      if(this.inputChanges !== item.Name){
        this.toastr.warning('Unknown File Name');
      }
      })
    }
  }
  
  inputText(event){
    this.inputChanges = event;
     
  }
  getDmsCategory() {
    let result;
    this.waitingroomServices.getDmsCategory().subscribe((results: any) => {
      this.dmsCategoryList = results;
    })
  }
  onCancel(){
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
  }
  onDownload(rowData, view) {
    this.viewDocument = rowData
    let filename = 'docsUpload' + '\\' + this.viewDocument.Name;
    let param = {
      patientFileId: this.viewDocument.PatientFileId
    }
    this.nbs.getDocView(param).subscribe(res => {
      this.FileReview = res
      this.fss.downloadFile(encodeURI(filename)).subscribe(res => {
        this.DocumentUrl = res;
        const modalRef = this.modalService.open(view, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      })
    })
  }
  updateCat(rowData, DocTab) {
    // this.isLoader = true;
    let Result = rowData;
    this.dmsCategoryList.forEach((item) => {
      if (item.DmsCategoryId === Result.DmsCategoryName.DmsCategoryId) {
        Result.dmsCategoryId = item.DmsCategoryId;
        Result.DmsCategoryName = item.CategoryName;
      }
    })
    this.dss.updatePatientFile(Result).subscribe(res => {
      this.toastr.success("Updated Successfully");
      this.getDocumentList();
    })
  }

}
