import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { fabric } from 'fabric';
import { AuthenticationStore } from '../../../../../app/authentication';
import { fileupload, Document } from '../../../../../app/model';
import { FileStorageService } from '../../../../../app/services/filestorage.service';
import { FormService } from '../../../../../app/services/workspace/form.service';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-draw-on-image',
  templateUrl: './draw-on-image.component.html',
  styleUrls: ['./draw-on-image.component.css']
})
export class DrawOnImageComponent implements OnInit {
  @Input() public src?: string;
  @Input() public saveBtnText = 'Save';
  @Input() public cancelBtnText = 'Cancel';
  @Input() public loadingText = 'Loading…';
  @Input() public errorText = 'Error loading %@';
  @Input() public loadingTemplate?: TemplateRef<any>;
  @Input() public errorTemplate?: TemplateRef<any>;
@Input() imageName;
@Input() ComponentName;
@Input() rowdata;
  @Output() public onSave: EventEmitter<Blob> = new EventEmitter<Blob>();
  @Output() public onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() OnSign = new EventEmitter();
  
  
  filePath = 'documents\\' + this.authStore.PracticeDetail.PracticeId;
  public currentTool: string = 'brush';
  public currentSize: string = 'small';
  public currentColor: string = 'black';

  public canUndo: boolean = false;
  public canRedo: boolean = false;

  public isLoading = true;
  public hasError = false;
  public errorMessage = '';
private patientdata;
  private canvas?: any;
  private stack: any[] = [];

  convertCanvas;

  files: File;
  fileArr: any;

  constructor(
    private fileStoreService: FileStorageService,
    private authStore: AuthenticationStore,
    private formService: FormService,
    private toaster: ToastrService,
  ) {
  }

  public ngOnInit(): void {
     console.log("value of inputs is",this.ComponentName,this.src,this.rowdata)
    //  Signature
    // Sketch Pad
    this.patientdata = JSON.parse(sessionStorage.getItem('PatientDetail'));
      const canvas = new fabric.Canvas('canvas', {
          hoverCursor: 'pointer',
          isDrawingMode: true,
      });
      if (this.src !== undefined) {
          let isFirstTry = true;
          const imgEl = new Image();
          imgEl.setAttribute('crossOrigin', 'anonymous');
          imgEl.src = this.src;
        //   imgEl.width = 400;
        //   imgEl.height = 400;
          imgEl.onerror = () => {
              if (isFirstTry) {
                  imgEl.src = 'http://cors-anywhere.herokuapp.com/' + this.src;
                  isFirstTry = false;
              } else {
                  this.isLoading = false;
                  this.hasError = true;
                  this.errorMessage = this.errorText.replace('%@', this.src as string);
              }
          };
          if(this.ComponentName === "Signature"){
              canvas.setWidth(600);
              canvas.setHeight(400);
          imgEl.onload = () => {
              this.isLoading = false;
              const fabricImg = new fabric.Image(imgEl);
              canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas),
            //     ((img: HTMLImageElement) => {
            //       if (img !== null) {
            //           canvas.setWidth(img.width);
            //           canvas.setHeight(img.height);
                      
            //       }
            //   }),
               {
                      crossOrigin: 'anonymous',
                      originX: 'left',
                      originY: 'top',
                      scaleX: canvas.width / fabricImg.width,
                    scaleY: canvas.height / fabricImg.height
                  });
          };
        } else if(this.ComponentName === "Sketch Pad"){
            canvas.setWidth(600);
              canvas.setHeight(400);
            imgEl.onload = () => {
                this.isLoading = false;
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
                    // canvas.setBackgroundImage(fabricImg, canvas.renderAll.bind(canvas),
                    // //     ((img: HTMLImageElement) => {
                    // //       if (img !== null) {
                    // //           canvas.setWidth(img.width);
                    // //           canvas.setHeight(img.height);
                              
                    // //       }
                    // //   }),
                    //    {
                    //           crossOrigin: 'anonymous',
                    //           originX: 'left',
                    //           originY: 'top',
                    //           scaleX: canvas.width / fabricImg.width,
                    //         scaleY: canvas.height / fabricImg.height
                    //       });
            };
        }
      }
    
      canvas.on('path:created', (e) => {
          this.stack = [];
          this.setUndoRedo();
      });

      this.canvas = canvas;
      this.selectTool(this.currentTool);
      this.selectColor(this.currentColor);
      this.selectDrawingSize(this.currentSize);
  }

  // Tools

  public selectTool(tool: string) {
      this.currentTool = tool;
  }

  public selectDrawingSize(size: string) {
      this.currentSize = size;
      if (this.canvas !== null && this.canvas !== undefined) {
          if (size === 'small') {
              this.canvas.freeDrawingBrush.width = 5;
          } else if (size === 'medium') {
              this.canvas.freeDrawingBrush.width = 10;
          } else if (size === 'large') {
              this.canvas.freeDrawingBrush.width = 20;
          }
      }
  }

  public selectColor(color: string) {
      this.currentColor = color;
      if (this.canvas !== null && this.canvas !== undefined) {
          if (color === 'black') {
              this.canvas.freeDrawingBrush.color = '#000';
          } else if (color === 'white') {
              this.canvas.freeDrawingBrush.color = '#fff';
          } else if (color === 'yellow') {
              this.canvas.freeDrawingBrush.color = '#ffeb3b';
          } else if (color === 'red') {
              this.canvas.freeDrawingBrush.color = '#f44336';
          } else if (color === 'blue') {
              this.canvas.freeDrawingBrush.color = '#2196f3';
          } else if (color === 'green') {
              this.canvas.freeDrawingBrush.color = '#4caf50';
          }
      }
  }

  // Actions

  public undo() {
      if (this.canUndo) {
          const lastId = this.canvas.getObjects().length - 1;
          const lastObj = this.canvas.getObjects()[lastId];
          this.stack.push(lastObj);
          this.canvas.remove(lastObj);
          this.setUndoRedo();
      }
  }

  public redo() {
      if (this.canRedo) {
          const firstInStack = this.stack.splice(-1, 1)[0];
          if (firstInStack !== null && firstInStack !== undefined) {
              this.canvas.insertAt(firstInStack, this.canvas.getObjects().length - 1);
          }
          this.setUndoRedo();
      }
  }

  public clearCanvas() {
      if (this.canvas !== null && this.canvas !== undefined) {
          this.canvas.remove(...this.canvas.getObjects());
          this.setUndoRedo();
      }
  }


  public saveImage() {
      let filename = (this.patientdata.LastName+","+this.patientdata.FirstName+"_"+moment(new Date()).format("DDMMYYYYHHMMSS"))+".png";
      let signname
      if(this.ComponentName === "Signature"){
         let name = this.rowdata.Name;
         let namearr = name.split(".")
      let arrlen = namearr.length
      let cflen = arrlen -1
      let changednamearr: string;
      for(let i=0;i<cflen;i++){
        changednamearr = (changednamearr? changednamearr+".": "")+namearr[i]
      }
      signname = changednamearr+"_Signatured"+"."+namearr[arrlen-1]
      }
//   let signname = (this.patientdata.LastName+","+this.patientdata.FirstName+"_"+moment(new Date()).format("DDMMYYYYHHMMSS"))+"_Signatured.png"
      this.canvas.getElement().toBlob((data: Blob) => {    
        if(this.ComponentName === 'Sketch Pad'){      
          var file = new File([data],(filename), {type: 'contentType', lastModified: Date.now()});
        } else if(this.ComponentName === 'Signature'){
            var file = new File([data],(signname), {type: 'contentType', lastModified: Date.now()});
        }
          var formData = new FormData();
            formData.append('file', file);
            console.log("value of formdata is",this.filePath,formData,file);
            if(this.ComponentName === 'Sketch Pad'){
           this.fileStoreService.addFile(this.filePath,formData).subscribe(event => {
            if (event.type === HttpEventType.UploadProgress) {
              
            }
            else if (event.type === HttpEventType.Response) {
                this.addDoc(filename,signname)
            } 
           });
        } else if(this.ComponentName === 'Signature'){
            this.fileStoreService.addFile(this.filePath,formData).subscribe(event => {
                if (event.type === HttpEventType.UploadProgress) {
                  
                }
                else if (event.type === HttpEventType.Response) {
                    this.addDoc(filename,signname)
                } 
               });
        }
      });
  }


  addDoc(filename?,signname?){
      var newform = new Document();
      if(this.ComponentName === 'Sketch Pad'){
      newform.Name = filename
      newform.Path = filename
      newform.SavedMethodIdentifier = 3;
    } else if(this.ComponentName === 'Signature'){
        newform.Name = signname
        newform.Path = signname
        newform.SavedMethodIdentifier = 4;
    }
    newform.Extension = ".png";
    newform.CreatedByUserId = this.authStore.UserDetail.UserId;
    newform.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
    newform.DateCreated = new Date();
    newform.DateLastUpdated = new Date();
    newform.PatientId = this.patientdata.PatientId;
    
    newform.ReviewStatus =1;
    newform.DocumentDate = new Date();
    newform.IsInactive = false;
    newform.DmsCategoryId = 1;
    newform.UserId = this.authStore.UserDetail.UserId;    
console.log("value of new firn us",newform)

    this.formService.addPatientDoc(newform).subscribe(event => {        
        this.showToaster('Image Saved successfully!')
        if(this.ComponentName === 'Signature'){
        this.OnSign.emit();
        }
    });

  }
  showToaster(msg: string){
    this.toaster.success(msg)
  }

  public cancel() {
      this.onCancel.emit();
  }

  private setUndoRedo() {
      this.canUndo = this.canvas.getObjects().length > 0;
      this.canRedo = this.stack.length > 0;
  }
 

showData(){
      let demo = {
        wrSelectedDate: new Date(),
        sortEnumerator: 85,
        facilityId: 25,
        physicianId: 22,
        status: false
      }
      let fileName;

      this.formService.demodata(demo).subscribe(res => {             
        var newBlob = new Blob([res], { type: res.type });
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(res);
        var link = document.createElement('a');
            link.href = data;
            link.download = "receipt.pdf";
            link.click();          
        this.showToaster('Image Saved successfully!')
    });
  }
}