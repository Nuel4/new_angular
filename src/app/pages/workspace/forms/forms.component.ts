import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http'
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { GlobalState } from '../../../core';
import { AuthenticationStore } from '../../../authentication'
import { FileUploadType } from '../../../model'
import { FormService } from '../../../services/workspace/form.service'
import { FileStorageService } from '../../../services/filestorage.service'
import { FormsDeleteModalComponent } from './forms-delete-modal/forms-delete-modal.component';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormsComponent implements OnInit {
  modalRef: NgbModalRef;
  cachedata: any = [];
  filePath: string;
  uploadType: FileUploadType;
  fileUrl: string;
  formsHead: any = [];
  formsData: any = []
  totalRecords: number;
  fileNameSearch: any = '';
  index = 0;
  closeEnable: false;
  isLoader: boolean;

  @ViewChild(DatatableComponent) tblforms: DatatableComponent;
  constructor(private formService: FormService,
    private fileStorageService: FileStorageService,
    private authStore: AuthenticationStore,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal) {

  }
  ngOnInit() {
    this.formsHead = [
      { field: 'FormName', header: 'File Name' },
    ]
    this.isLoader = true;
    this.loadforms();
    this.filePath = 'PracticeUploads\\' + this.authStore.PracticeDetail.PracticeId;
    this.uploadType = FileUploadType.Practice;
  }
  loadforms() {
    console.log('index', this.index)
    this.formService.getAllFormsWithNamePagination(this.fileNameSearch, this.index).subscribe(resp => {
      this.formsData = resp.Results;
      this.totalRecords = resp.TotalItems
      console.log('data form', this.formsData)
      this.isLoader = false

    });
  }
  updateFilter(event) {
    if (this.fileNameSearch.length >= 3) {
      console.log('fileName', this.fileNameSearch)
      this.loadforms();
    }
    if (this.fileNameSearch.length == 0) {
      console.log('filename', this.fileNameSearch)
      this.loadforms();
    }
  }
  updateFilterByButton(event) {
    console.log('button event', event)
    this.loadforms();
  }

  onAddFile(modalContent) {
    this.modalRef = this.modalService.open(modalContent, { container: '.app', backdrop: 'static', size: 'lg' });
    this.modalRef.result.then((result) => {
      console.log('When user closes' + result);
    }, (reason) => {
      console.log('Backdrop click' + reason);
    });
  }
  onDownload(file) {
    const filename = this.filePath + '\\' + file.FormName;
    console.log("value of file",file,filename,encodeURI(filename));
    this.fileStorageService.downloadFile(encodeURI(filename)).subscribe(resp => {
      console.log('Download file uri: ' + resp.Value);
      window.open(resp.Value, '_blank');
    });
  }


  onDelete(file) {
    this.formService.deleteForm(JSON.stringify(file)).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        this.removeFromcloudStorage(file);
      }
    });
  }

  openDeleteModal(file) {
    this.modalRef = this.modalService.open(FormsDeleteModalComponent, { centered: true, windowClass: 'modelStyle' })
    this.modalRef.componentInstance.ConfirmFormDelete.subscribe((value) => {
      if (value) {
        this.onDelete(file)
        // this.modalRef.close()
      }
    })
  }
  

  removeFromcloudStorage(filename) {
    const fullfilename = JSON.stringify(this.filePath + '\\' + filename.FormName);
    this.fileStorageService.deleteFile(fullfilename).subscribe(event => {
      if (event.type === HttpEventType.Response) {
        console.log('file deleted from blob storage filename: ' + filename.FormName);
        this.loadforms();
        this.showSuccess(filename.FormName + ' deleted successfully!');
      }
    });
  }

  public onModelClose() {
    this.modalRef.close();
    this.loadforms();
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
  paginate(event) {
    console.log('page', event)
    this.index = (event.first / event.rows);
    console.log('Item Paged Index is ', this.index);
    this.loadforms()
  }

}
