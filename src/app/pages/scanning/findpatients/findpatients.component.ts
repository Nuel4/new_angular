// <reference types="dwt" />
/// <reference types="dwt" />
/// <reference types="dwt/addon.pdf" />
/// <reference types="jquery" />

import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { HttpEventType, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationStore } from '../../../authentication';
import { FileStorageService } from '../../../services/filestorage.service';
import { FormService } from '../../../services/workspace/form.service';
import {ToastrService} from 'ngx-toastr';
import { fileupload, Document } from '../../../model';
import {ModelviewComponent} from '../../../theme/components/modelview/modelview.component'
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { moment } from 'fullcalendar';
import {DocumentActionsComponent} from '../../chart/documents/document-actions/document-actions.component'
import { ScanModalComponent } from '../scan-modal/scan-modal.component';
@Component({
  selector: 'app-findpatients',
  templateUrl: './findpatients.component.html',
  styleUrls: ['./findpatients.component.scss']
})
export class FindpatientsComponent implements OnInit {
	imageType = 'png';
	patientDetails: any;
	fileName: any;
	documentDate: any;
	patientData: any;
	constructor(private authStore: AuthenticationStore, private newFileStoreService: FileStorageService, private formService: FormService, private toaster:ToastrService, private modalService: NgbModal){
	}
	ngOnInit() {
		Dynamsoft.WebTwainEnv.Trial = false;
		Dynamsoft.WebTwainEnv.ResourcesPath = "https://yeatsclinicalweb.z13.web.core.windows.net/src/Resources/Scanner/Resources"
		Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width:584, Height:512}];
	  Dynamsoft.WebTwainEnv.ProductKey = 'f0068WQAAAF97XlVlw8+wbDxMx823KlyfQFimYjDOkSMWtRAbqmCMsluvx6FPD2K8BiFhkIpDfaFk/D8VEnwwjIawj2GTZd0=';
	  Dynamsoft.WebTwainEnv.Load();
	  Dynamsoft.WebTwainEnv.RegisterEvent("OnWebTwainReady", () => { this.Dynamsoft_OnReady() });
	  this.pageonload();
	  this.getPatientDetails();
	  /**
	   * we use a separate express server (NodeJS) to handle the upload, here we stitch up the url to receive our upload (POSTs)
	   */
	  // let strhttp = "http://";
	  // if ("https:" == document.location.protocol)
	  //   strhttp = "https://";
	  // this.uploadUrl = strhttp + this.httpServer + ":" + this.httpPort + "/upload";
	}
	attachEncounter(){
		
		if(this.patientData){
			const modalRef = this.modalService.open(DocumentActionsComponent, {
				centered: true,
				size: "lg"
			  });
			  modalRef.componentInstance.name = "true";
			  modalRef.componentInstance.IsAttachFile = true;
			  modalRef.componentInstance.patientData = this.patientData;
			//   modalRef.componentInstance.resetTable.subscribe((resp) => {
			// 	console.log("value of resp", resp);
			// 	// this.docTable = resp
			// 	// this.selectRow = null;
			// 	if (resp) {
			// 	  this.showToaster("File attached successfully!")
			// 	}
			//   });
		} else {
			this.showError("Please save the scanned file!")
		}
	}
	getPatientDetails(){
	if (JSON.parse(sessionStorage.getItem("PatientDetail")) === null) {
		// $("#lgModal").modal('show');
		const modalRef = this.modalService.open(ModelviewComponent,{centered: true, size: 'lg', windowClass: 'modelStyle',})
		modalRef.componentInstance.name = 'true';
		modalRef.componentInstance.openPopUp = true;
		modalRef.componentInstance.ComponentName = 'post'
		modalRef.componentInstance.patientdatapost.subscribe(res => {
		  this.patientDetails = res
		  this.patientDetails.DateCreated = new Date(this.patientDetails.DateCreated);
		  this.patientDetails.DateLastUpdated = new Date(this.patientDetails.DateCreated);
		  this.patientDetails.DateOfBirth =moment(new Date(this.patientDetails.DateOfBirth)).format('MM/DD/YYYY') ;
		  this.patientDetails.FullName = this.patientDetails.LastName + ", " + this.patientDetails.FirstName
		  console.log("patient data is: ");
		  console.log(this.patientDetails);
		})
	  } else {
		this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"));
		this.patientDetails.DateCreated = new Date(this.patientDetails.DateCreated);
		this.patientDetails.DateLastUpdated = new Date(this.patientDetails.DateCreated);
		this.patientDetails.DateOfBirth =moment(new Date(this.patientDetails.DateOfBirth)).format('MM/DD/YYYY') ;
		this.patientDetails.FullName = this.patientDetails.LastName + ", " + this.patientDetails.FirstName
	  }
	}
	title = 'Using Dynamic Web TWAIN in Angular Project';
	DWObject: WebTwain;
	_strTempStr: string = '';
	DWTSourceCount: number;
	httpPort = 2018;
	httpServer = location.hostname;
	re: RegExp = /^\d+$/;
	uploadUrl: string;
	EnumDWT_ConvertMode: any;
	_iLeft = 0;
	_iTop = 0;
	_iRight = 0;
	_iBottom = 0;
	appendMessage(strMessage: string): void {
	  this._strTempStr += strMessage;
	  let _divMessageContainer: HTMLElement = document.getElementById("DWTemessage");
	  if (_divMessageContainer) {
		_divMessageContainer.innerHTML = this._strTempStr;
		_divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
	  }
	}
	clearmessages(): void {
	  this._strTempStr = '';
	  let _divMessageContainer: HTMLElement = document.getElementById("DWTemessage");
	  _divMessageContainer.innerHTML = this._strTempStr;
	}
	checkIfImagesInBuffer(): boolean {
	  if (this.DWObject.HowManyImagesInBuffer == 0) {
		this.appendMessage("There is no image in buffer.<br />")
		return false;
	  }
	  else
		return true;
	}
	checkErrorStringWithErrorCode(errorCode: number, errorString: string, responseString?: string): boolean {
	  if (errorCode == 0) {
		this.appendMessage("<span style='color:#cE5E04'><strong>" + errorString + "</strong></span><br />");
		return true;
	  }
	  if (errorCode == -2115) //Cancel file dialog
		return true;
	  else {
		if (errorCode == -2003) {
		  let ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
		  ErrorMessageWin.document.writeln(responseString);
		}
		this.appendMessage("<span style='color:#cE5E04'><strong>" + errorString + "</strong></span><br />");
		return false;
	  }
	}
	checkErrorString(): boolean {
	  return this.checkErrorStringWithErrorCode(this.DWObject.ErrorCode, this.DWObject.ErrorString);
	}
	updatePageInfo(): void {
	  let DW_TotalImage: HTMLInputElement = <HTMLInputElement>document.getElementById("DW_TotalImage");
	  let DW_CurrentImage: HTMLInputElement = <HTMLInputElement>document.getElementById("DW_CurrentImage");
	  if (DW_TotalImage)
		DW_TotalImage.value = (this.DWObject.HowManyImagesInBuffer).toString();
	  if (DW_CurrentImage)
		DW_CurrentImage.value = (this.DWObject.CurrentImageIndexInBuffer + 1).toString();
	}
	/** 
	 * Dynamic Web TWAIN Events handlers 
	 * */
	Dynamsoft_OnTopImageInTheViewChanged = (index: number) => {
	  this._iLeft = 0;
	  this._iTop = 0;
	  this._iRight = 0;
	  this._iBottom = 0;
	  this.DWObject.CurrentImageIndexInBuffer = index;
	  this.updatePageInfo();
	}
	Dynamsoft_OnImageAreaSelected = (index: number, left: number, top: number, right: number, bottom: number) => {
	  this._iLeft = left;
	  this._iTop = top;
	  this._iRight = right;
	  this._iBottom = bottom;
	}
	Dynamsoft_OnMouseClick = (index: number) => {
	  this.updatePageInfo();
	}
	Dynamsoft_OnPostTransfer = () => {
	  this.updatePageInfo();
	}
  
	Dynamsoft_OnPostLoadfunction = (path, name, type) => {
	  this.updatePageInfo();
	}
	Dynamsoft_OnPostAllTransfers = () => {
	  this.DWObject.CloseSource();
	  this.updatePageInfo();
	  this.checkErrorString();
	}
	Dynamsoft_OnMouseRightClick = (index) => {
	}
	Dynamsoft_OnImageAreaDeselected = (index) => {
	  this._iLeft = 0;
	  this._iTop = 0;
	  this._iRight = 0;
	  this._iBottom = 0;
	}
	Dynamsoft_OnMouseDoubleClick = () => {
	}
	Dynamsoft_OnGetFilePath = (bSave: boolean, count: number, index: number, path: string, name: string) => {
	}
	/**
	 * events for page elements
	 */
	source_onchange(): void {
	  if (document.getElementById("divTwainType"))
		document.getElementById("divTwainType").style.display = "";
	  if (document.getElementById("source")) {
		let cIndex = (<HTMLSelectElement>document.getElementById("source")).selectedIndex;
		if (Dynamsoft.Lib.env.bMac) {
		  if (cIndex >= this.DWTSourceCount) {
			if (document.getElementById("lblShowUI"))
			  document.getElementById("lblShowUI").style.display = "";
			if (document.getElementById("ShowUI"))
			  document.getElementById("ShowUI").style.display = "";
		  } else {
			if (document.getElementById("lblShowUI"))
			  document.getElementById("lblShowUI").style.display = "none";
			if (document.getElementById("ShowUI"))
			  document.getElementById("ShowUI").style.display = "none";
		  }
		}
		else
		  if (this.DWObject)
			this.DWObject.SelectSourceByIndex(cIndex);
	  }
	}
	initDllForChangeImageSize(): void {
	  let vInterpolationMethod = <HTMLSelectElement>document.getElementById("InterpolationMethod");
	  vInterpolationMethod.options.length = 0;
	  vInterpolationMethod.options.add(new Option("NearestNeighbor", "1"));
	  vInterpolationMethod.options.add(new Option("Bilinear", "2"));
	  vInterpolationMethod.options.add(new Option("Bicubic", "3"));
	}
	showtblLoadImage_onclick(): boolean {
	  switch (document.getElementById("tblLoadImage").style.visibility) {
		case "hidden": document.getElementById("tblLoadImage").style.visibility = "visible";
		  document.getElementById("Resolution").style.visibility = "hidden";
		  break;
		case "visible":
		  document.getElementById("tblLoadImage").style.visibility = "hidden";
		  document.getElementById("Resolution").style.visibility = "visible";
		  break;
		default: break;
	  }
	  return false;
	}
	closetblLoadImage_onclick(): boolean {
	  document.getElementById("tblLoadImage").style.visibility = "hidden";
	  document.getElementById("Resolution").style.visibility = "visible";
	  return false;
	}
	/**
	 * main entry for initializing dwt related settings
	 */
	Dynamsoft_OnReady(): void {
	  if (typeof (EnumDWT_ConvertMode) != "undefined") {
		this.EnumDWT_ConvertMode = EnumDWT_ConvertMode;
	  }
	  else if (typeof (EnumDWT_ConverMode) != "undefined") {
		this.EnumDWT_ConvertMode = EnumDWT_ConverMode;
	  }
	  let liNoScanner = document.getElementById("pNoScanner");
	  this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
	  // If the ErrorCode is 0, it means everything is fine for the control. It is fully loaded.
	  if (this.DWObject) {
		if (this.DWObject.ErrorCode == 0) {
		  this.DWObject.LogLevel = 0;
		  this.DWObject.IfAllowLocalCache = true;
		  this.DWObject.ImageCaptureDriverType = 3;
		  this.DWObject.RegisterEvent("OnMouseClick", this.Dynamsoft_OnMouseClick);
		  this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", this.Dynamsoft_OnTopImageInTheViewChanged);
		  let twainsource = <HTMLSelectElement>document.getElementById("source");
		  if (!twainsource) {
			twainsource = <HTMLSelectElement>document.getElementById("webcamsource");
		  }
  
		  let vCount = this.DWObject.SourceCount;
		  this.DWTSourceCount = vCount;
		  let vTWAINCount = 0;
  
		  if (twainsource) {
			twainsource.options.length = 0;
			for (let i = 0; i < vCount; i++) {
			  if (Dynamsoft.Lib.env.bMac) {
				twainsource.options.add(new Option("ICA_" + this.DWObject.GetSourceNameItems(i), i.toString()));
			  }
			  else {
				twainsource.options.add(new Option(this.DWObject.GetSourceNameItems(i), i.toString()));
			  }
			}
  
			if (Dynamsoft.Lib.env.bMac) {
			  this.DWObject.CloseSourceManager();
			  this.DWObject.ImageCaptureDriverType = 0;
			  this.DWObject.OpenSourceManager();
			  vTWAINCount = this.DWObject.SourceCount;
  
			  for (let j = vCount; j < vCount + vTWAINCount; j++) {
				twainsource.options.add(new Option(this.DWObject.GetSourceNameItems(j - vCount), j.toString()));
			  }
			}
		  }
  
		  // If source list need to be displayed, fill in the source items.
		  if ((vCount + vTWAINCount) == 0) {
			if (liNoScanner) {
			  if (Dynamsoft.Lib.env.bWin) {
  
				liNoScanner.style.display = "block";
				liNoScanner.style.textAlign = "center";
			  }
			  else
				liNoScanner.style.display = "none";
			}
		  }
  
		  if ((vCount + vTWAINCount) > 0) {
			this.source_onchange();
		  }
  
		  if (Dynamsoft.Lib.env.bWin)
			this.DWObject.MouseShape = false;
  
		  let btnScan = <HTMLInputElement>document.getElementById("btnScan");
		  if (btnScan) {
			if ((vCount + vTWAINCount) == 0)
			  btnScan.disabled = true;
			else {
			  btnScan.disabled = false;
			  btnScan.style.color = "#fff";
			  btnScan.style.backgroundColor = "#50a8e1";
			  btnScan.style.cursor = "pointer";
			}
		  }
  
		  if (!Dynamsoft.Lib.env.bWin && vCount > 0) {
			if (document.getElementById("lblShowUI"))
			  document.getElementById("lblShowUI").style.display = "none";
			if (document.getElementById("ShowUI"))
			  document.getElementById("ShowUI").style.display = "none";
		  }
		  else {
			if (document.getElementById("lblShowUI"))
			  document.getElementById("lblShowUI").style.display = "";
			if (document.getElementById("ShowUI"))
			  document.getElementById("ShowUI").style.display = "";
		  }
  
		  this.initDllForChangeImageSize();
  
		  for (let i = 0; i < document.links.length; i++) {
			if (document.links[i].className == "ShowtblLoadImage") {
			  document.links[i].onclick = this.showtblLoadImage_onclick;
			}
			if (document.links[i].className == "ClosetblLoadImage") {
			  document.links[i].onclick = this.closetblLoadImage_onclick;
			}
		  }
		  if ((vCount + vTWAINCount) == 0) {
			if (Dynamsoft.Lib.env.bWin) {
  
			  if (document.getElementById("aNoScanner") && window['bDWTOnlineDemo']) {
				if (document.getElementById("div_ScanImage").style.display == "")
				  this.showtblLoadImage_onclick();
			  }
			  if (document.getElementById("Resolution"))
				document.getElementById("Resolution").style.display = "none";
  
			}
  
		  }
		  else {
			let divBlank = document.getElementById("divBlank");
			if (divBlank)
			  divBlank.style.display = "none";
		  }
		  this.updatePageInfo();
  
		  this.DWObject.RegisterEvent("OnPostTransfer", this.Dynamsoft_OnPostTransfer);
		  this.DWObject.RegisterEvent("OnPostLoad", this.Dynamsoft_OnPostLoadfunction);
		  this.DWObject.RegisterEvent("OnPostAllTransfers", this.Dynamsoft_OnPostAllTransfers);
		  this.DWObject.RegisterEvent("OnImageAreaSelected", this.Dynamsoft_OnImageAreaSelected);
		  this.DWObject.RegisterEvent("OnImageAreaDeSelected", this.Dynamsoft_OnImageAreaDeselected);
		  this.DWObject.RegisterEvent("OnGetFilePath", this.Dynamsoft_OnGetFilePath);
		}
	  }
	}
	/**
	 * edit features
	 */
	btnShowImageEditor_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.ShowImageEditor();
	}
	btnRotateRight_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.RotateRight(this.DWObject.CurrentImageIndexInBuffer);
	  this.appendMessage('<strong>Rotate right: </strong>');
	  if (this.checkErrorString()) {
		return;
	  }
	}
	btnRotateLeft_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.RotateLeft(this.DWObject.CurrentImageIndexInBuffer);
	  this.appendMessage('<strong>Rotate left: </strong>');
	  if (this.checkErrorString()) {
		return;
	  }
	}
	btnRotate180_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, 180, true);
	  this.appendMessage('<strong>Rotate 180: </strong>');
	  if (this.checkErrorString()) {
		return;
	  }
	}
	btnMirror_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer);
	  this.appendMessage('<strong>Mirror: </strong>');
	  if (this.checkErrorString()) {
		return;
	  }
	}
	btnFlip_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer);
	  this.appendMessage('<strong>Flip: </strong>');
	  if (this.checkErrorString()) {
		return;
	  }
	}
	btnCrop_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  if (this._iLeft != 0 || this._iTop != 0 || this._iRight != 0 || this._iBottom != 0) {
		this.DWObject.Crop(
		  this.DWObject.CurrentImageIndexInBuffer,
		  this._iLeft, this._iTop, this._iRight, this._iBottom
		);
		this._iLeft = 0;
		this._iTop = 0;
		this._iRight = 0;
		this._iBottom = 0;
		this.appendMessage('<strong>Crop: </strong>');
		if (this.checkErrorString()) {
		  return;
		}
		return;
	  } else {
		this.appendMessage("<strong>Crop: </strong>failed. Please first select the area you'd like to crop.<br />");
	  }
	}
	btnChangeImageSize_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  switch (document.getElementById("ImgSizeEditor").style.visibility) {
		case "visible": document.getElementById("ImgSizeEditor").style.visibility = "hidden"; break;
		case "hidden": document.getElementById("ImgSizeEditor").style.visibility = "visible"; break;
		default: break;
	  }
	  let iWidth = this.DWObject.GetImageWidth(this.DWObject.CurrentImageIndexInBuffer);
	  if (iWidth != -1)
		(<HTMLInputElement>document.getElementById("img_width")).value = iWidth.toString();
	  let iHeight = this.DWObject.GetImageHeight(this.DWObject.CurrentImageIndexInBuffer);
	  if (iHeight != -1)
		(<HTMLInputElement>document.getElementById("img_height")).value = iHeight.toString();
	}
	btnCancelChange_onclick(): void {
	  document.getElementById("ImgSizeEditor").style.visibility = "hidden";
	}
	btnChangeImageSizeOK_onclick(): void {
	  document.getElementById("img_height").className = "";
	  document.getElementById("img_width").className = "";
	  if (!this.re.test((<HTMLInputElement>document.getElementById("img_height")).value)) {
		document.getElementById("img_height").className += " invalid";
		document.getElementById("img_height").focus();
		this.appendMessage("Please input a valid <strong>height</strong>.<br />");
		return;
	  }
	  if (!this.re.test((<HTMLInputElement>document.getElementById("img_width")).value)) {
		document.getElementById("img_width").className += " invalid";
		document.getElementById("img_width").focus();
		this.appendMessage("Please input a valid <strong>width</strong>.<br />");
		return;
	  }
	  this.DWObject.ChangeImageSize(
		this.DWObject.CurrentImageIndexInBuffer,
		parseInt((<HTMLInputElement>document.getElementById("img_width")).value),
		parseInt((<HTMLInputElement>document.getElementById("img_height")).value),
		(<HTMLSelectElement>document.getElementById("InterpolationMethod")).selectedIndex + 1
	  );
	  this.appendMessage('<strong>Change Image Size: </strong>');
	  if (this.checkErrorString()) {
		document.getElementById("ImgSizeEditor").style.visibility = "hidden";
		return;
	  }
	}
	/** 
	 * navigation
	 */
	btnFirstImage_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.CurrentImageIndexInBuffer = 0;
	  this.updatePageInfo();
	}
  
	btnPreImage_wheel(): void {
	  if (this.DWObject.HowManyImagesInBuffer != 0)
		this.btnPreImage_onclick()
	}
  
	btnNextImage_wheel(): void {
	  if (this.DWObject.HowManyImagesInBuffer != 0)
		this.btnNextImage_onclick()
	}
  
	btnPreImage_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  else if (this.DWObject.CurrentImageIndexInBuffer == 0) {
		return;
	  }
	  this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer - 1;
	  this.updatePageInfo();
	}
	btnNextImage_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  else if (this.DWObject.CurrentImageIndexInBuffer == this.DWObject.HowManyImagesInBuffer - 1) {
		return;
	  }
	  this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer + 1;
	  this.updatePageInfo();
	}
	btnLastImage_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.CurrentImageIndexInBuffer = this.DWObject.HowManyImagesInBuffer - 1;
	  this.updatePageInfo();
	}
	btnRemoveCurrentImage_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.RemoveAllSelectedImages();
	  if (this.DWObject.HowManyImagesInBuffer == 0) {
		(<HTMLInputElement>document.getElementById("DW_TotalImage")).value = this.DWObject.HowManyImagesInBuffer.toString();
		(<HTMLInputElement>document.getElementById("DW_CurrentImage")).value = "";
		return;
	  }
	  else {
		this.updatePageInfo();
	  }
	}
	btnRemoveAllImages_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  this.DWObject.RemoveAllImages();
	  (<HTMLInputElement>document.getElementById("DW_TotalImage")).value = "0";
	  (<HTMLInputElement>document.getElementById("DW_CurrentImage")).value = "";
	}
	setlPreviewMode(): void {
	  let varNum: number = (<HTMLSelectElement>document.getElementById("DW_PreviewMode")).selectedIndex + 1;
	  let btnCrop = <HTMLImageElement>document.getElementById("btnCrop");
	  if (btnCrop) {
		let tmpstr = btnCrop.src;
		if (varNum > 1) {
		  tmpstr = tmpstr.replace('Crop.', 'Crop_gray.');
		  btnCrop.src = tmpstr;
		  btnCrop.onclick = () => { };
		}
		else {
		  tmpstr = tmpstr.replace('Crop_gray.', 'Crop.');
		  btnCrop.src = tmpstr;
		  btnCrop.onclick = () => { this.btnCrop_onclick(); };
		}
	  }
  
	  this.DWObject.SetViewMode(varNum, varNum);
	  if (Dynamsoft.Lib.env.bMac || Dynamsoft.Lib.env.bLinux) {
		return;
	  }
	  else if ((<HTMLSelectElement>document.getElementById("DW_PreviewMode")).selectedIndex != 0) {
		this.DWObject.MouseShape = true;
	  }
	  else {
		this.DWObject.MouseShape = false;
	  }
	}
	/**
	 * save image
	 */
	saveUploadImage(type: string): void {
	  if (type == 'local') {
		this.btnSave_onclick();
	  } else if (type == 'server') {
		this.btnUpload_onclick()
	  }
	}
	btnSave_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  let strimgType_save;
	  strimgType_save = this.imageType
  
	  // let NM_imgType_save = <HTMLSelectElement><unknown>document.getElementsByName("ImageType");
	  // for (i = 0; i < 5; i++) {
	  //   if (NM_imgType_save.item(i).checked == true) {
	  //     strimgType_save = NM_imgType_save.item(i).value;
	  //     break;
	  //   }
	  // }
	  this.DWObject.IfShowFileDialog = true;
	  let _txtFileNameforSave = <HTMLInputElement>document.getElementById("txt_fileName");
	  if (_txtFileNameforSave)
		_txtFileNameforSave.className = "";
	  let bSave = false;
  
	  let strFilePath = _txtFileNameforSave.value + "." + strimgType_save;
  
	  let OnSuccess = () => {
		this.appendMessage('<strong>Save Image: </strong>');
		this.checkErrorStringWithErrorCode(0, "Successful.");
	  };
  
	  let OnFailure = (errorCode, errorString) => {
		this.checkErrorStringWithErrorCode(errorCode, errorString);
	  };
  
	  let _chkMultiPageTIFF_save = <HTMLInputElement>document.getElementById("MultiPageTIFF");
	  let _chkMultiPagePDF_save = <HTMLInputElement>document.getElementById("MultiPagePDF");
	  let vAsyn = false;
	  if (strimgType_save == "tif" && _chkMultiPageTIFF_save && _chkMultiPageTIFF_save.checked) {
		vAsyn = true;
		if ((this.DWObject.SelectedImagesCount == 1) || (this.DWObject.SelectedImagesCount == this.DWObject.HowManyImagesInBuffer)) {
		  bSave = this.DWObject.SaveAllAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
		}
		else {
		  bSave = this.DWObject.SaveSelectedImagesAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
		}
	  }
	  else if (strimgType_save == "pdf" && _chkMultiPagePDF_save.checked) {
		vAsyn = true;
		if ((this.DWObject.SelectedImagesCount == 1) || (this.DWObject.SelectedImagesCount == this.DWObject.HowManyImagesInBuffer)) {
		  bSave = this.DWObject.SaveAllAsPDF(strFilePath, OnSuccess, OnFailure);
		}
		else {
		  bSave = this.DWObject.SaveSelectedImagesAsMultiPagePDF(strFilePath, OnSuccess, OnFailure);
		}
	  }
	  else {
		switch (this.imageType) {
		  case 'bmp': bSave = this.DWObject.SaveAsBMP(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
		  case 'jpg': bSave = this.DWObject.SaveAsJPEG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
		  case 'tif': bSave = this.DWObject.SaveAsTIFF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
		  case 'png': bSave = this.DWObject.SaveAsPNG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
		  case 'pdf': bSave = this.DWObject.SaveAsPDF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
		}
	  }
  
	  if (vAsyn == false) {
		if (bSave)
		  this.appendMessage('<strong>Save Image: </strong>');
		if (this.checkErrorString()) {
		  return;
		}
	  }
	}
	/**
	 * upload
	 */
	btnUpload_onclick(): void {
	  if (!this.checkIfImagesInBuffer()) {
		return;
	  }
	  let i, strHTTPServer, strActionPage, strImageType;
  
	//   let _txtFileName = <HTMLInputElement>document.getElementById("txt_fileName");
	  console.log("tesxt", this.fileName)
	  if (this.fileName === null || this.fileName === undefined)
	  {
		  this.showError('Please provide File name!');
		  this.toaster.error('Please provide File name!');
		  return;
	  }
	  console.log("Comming out")
		// _txtFileName.className = "";
	  switch (this.imageType) {
		case 'bmp': strImageType = 0;
		  break;
		case 'jpg': strImageType = 1;
		  break;
		case 'tif': strImageType = 2;
		  break;
		case 'png': strImageType = 3;
		  break;
		case 'pdf': strImageType = 4;
		  break;
	  }
	  console.log("StrImage type",strImageType )
	  // let imageType = <HTMLSelectElement>document.getElementsByName("ImageType");
	  // for (i = 0; i < 5; i++) {
	  //   if (imageType.item(i).checked == true) {
	  //     strImageType = i;
	  //     break;
	  //   }
	  // }
  
	  let fileName = this.fileName;
	  let replaceStr = "<";
	  fileName = fileName.replace(new RegExp(replaceStr, 'gm'), '&lt;');
	  let uploadfilename = fileName + "_" + Date.now() +  "." + this.imageType;
  
	  let _chkMultiPageTIFF_save = <HTMLInputElement>document.getElementById("MultiPageTIFF");
	  let _chkMultiPagePDF_save = <HTMLInputElement>document.getElementById("MultiPagePDF");
	  let _aryIndicesToUpload = [];
	  let _EnumDWT_ImageTypeToUpload = 1;
	  // console.log("EnumDWT", EnumDWT_ImageType)
	  if (strImageType == 2 && _chkMultiPageTIFF_save.checked) {
		_EnumDWT_ImageTypeToUpload = 2;
		if ((this.DWObject.SelectedImagesCount == 1) || (this.DWObject.SelectedImagesCount == this.DWObject.HowManyImagesInBuffer)) {
		  for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++)
			_aryIndicesToUpload.push(i);
		}
		else {
		  for (let i = 0; i < this.DWObject.SelectedImagesCount; i++)
			_aryIndicesToUpload.push(this.DWObject.GetSelectedImageIndex(i));
			console.log("GetSelectedImageIndex", this.DWObject.GetSelectedImageIndex(i))
		}
	  }
	  else if (strImageType == 4 && _chkMultiPagePDF_save.checked) {
		_EnumDWT_ImageTypeToUpload = 4;
		if ((this.DWObject.SelectedImagesCount == 1) || (this.DWObject.SelectedImagesCount == this.DWObject.HowManyImagesInBuffer)) {
		  for (let i = 0; i < this.DWObject.HowManyImagesInBuffer; i++)
			_aryIndicesToUpload.push(i);
		}
		else {
		  for (let i = 0; i < this.DWObject.SelectedImagesCount; i++)
			_aryIndicesToUpload.push(this.DWObject.GetSelectedImageIndex(i));
			console.log("GetSelectedImageIndex", this.DWObject.GetSelectedImageIndex(i))
		}
	  }
	  else {
		_EnumDWT_ImageTypeToUpload = <EnumDWT_ImageType>strImageType;
  
		_aryIndicesToUpload.push(this.DWObject.CurrentImageIndexInBuffer);
		console.log("CurrentImageIndexInBuffer", this.DWObject.CurrentImageIndexInBuffer)
	  }
	  /**
	   * the upload method is called here
	   */
	  // console.log(" _aryIndicesToUpload",  _aryIndicesToUpload)
	  // console.log(" _aryIndicesToUpload",  _aryIndicesToUpload)
	  // console.log(" EnumDWT_UploadDataFormat",  EnumDWT_UploadDataFormat)
	  let modalRef = this.modalService.open(ScanModalComponent, {centered: true, size: 'sm'})
	  modalRef.componentInstance.upload.subscribe( value => {
if(value){		
	let blob = this.DWObject.ConvertToBlob (
			_aryIndicesToUpload, 
			_EnumDWT_ImageTypeToUpload, 
			(result) => {
			  console.log(result);
			  var file = new File([result],(uploadfilename), {type: 'contentType', lastModified: Date.now()});
			  var formData = new FormData();
				formData.append('file', file);
			   this.newFileStoreService.addFile("Scanned document",formData).subscribe(event => {
				if (event.type === HttpEventType.UploadProgress) {
				  
				}
				else if (event.type === HttpEventType.Response) {
					this.addDoc(uploadfilename)
				} 
			   });
			  if (this.DWObject.SelectedImagesCount == this.DWObject.HowManyImagesInBuffer)
				   this.DWObject.SelectedImagesCount = 1;
		 }, 
			(errorCode, errorString) => {
			  alert("ErrorCode: "+errorCode +"\r"+"ErrorString:"+ errorString);
				 this.checkErrorStringWithErrorCode(errorCode, errorString);
		 });
		 console.log("blob", blob)}
	  })

	  // this.DWObject.ClearAllHTTPFormField();
	  // this.DWObject.SetHTTPFormField('filename', uploadfilename);
	  // this.DWObject.HTTPUpload(
	  //   this.uploadUrl,
	  //   _aryIndicesToUpload,
	  //   _EnumDWT_ImageTypeToUpload,
	  //   EnumDWT_UploadDataFormat.Binary,
	  //   () => {
	  //     if (this.DWObject.SelectedImagesCount == this.DWObject.HowManyImagesInBuffer)
	  //       this.DWObject.SelectedImagesCount = 1;
	  //     this.appendMessage(uploadfilename + ' was <strong>uploaded successfully!</strong><br />');
	  //   },
	  //   (errcode, errstr, httppostresponsestring) => {
	  //     this.checkErrorStringWithErrorCode(errcode, errstr, httppostresponsestring);
	  //   }
	  // );
	}
  
	addDoc(uploadfilename){
	  let patientdata = JSON.parse(sessionStorage.getItem('PatientDetail'));
  
	  var newform = new Document();
	  newform.Name = uploadfilename;
	newform.Extension = this.imageType;
	newform.Path = uploadfilename;
	newform.CreatedByUserId = this.authStore.UserDetail.UserId;
	newform.LastUpdatedByUserId = this.authStore.UserDetail.UserId;
	newform.DateCreated = new Date();
	newform.DateLastUpdated = new Date();
	newform.PatientId = patientdata.PatientId;
	newform.SavedMethodIdentifier = 1;
	newform.ReviewStatus =1;
	newform.DocumentDate =this.documentDate ? this.documentDate : new Date();
	newform.IsInactive = false;
	newform.DmsCategoryId = 1;
	newform.UserId = this.authStore.UserDetail.UserId;    
  
	this.formService.addPatientDoc(newform).subscribe(event => {  
		console.log("error", event)
		this.patientData = event;
		this.appendMessage(uploadfilename + ' was <strong>uploaded successfully!</strong><br />');
		this.showToaster('Scanned document uploaded successfully!')
	},
	error => {
		console.log("error", error)
		this.appendMessage(error.message);
		this.toaster.error(error.message)
	});
  }
  showToaster(msg: string){
	this.toaster.success(msg)
  }
  showError(msg: string){
this.toaster.error(msg)
  }
	/**
	 * Acquire Image
	 */
	acquireImage(): void {
	  let cIndex = (<HTMLSelectElement>document.getElementById("source")).selectedIndex;
	  if (cIndex < 0)
		return;
	  if (Dynamsoft.Lib.env.bMac) {
		this.DWObject.CloseSourceManager();
		this.DWObject.ImageCaptureDriverType = 3;
		this.DWObject.OpenSourceManager();
		if (cIndex >= this.DWTSourceCount) {
		  cIndex = cIndex - this.DWTSourceCount;
		  this.DWObject.CloseSourceManager();
		  this.DWObject.ImageCaptureDriverType = 0;
		  this.DWObject.OpenSourceManager();
		}
	  }
  
	  this.DWObject.SelectSourceByIndex(cIndex);
	  this.DWObject.CloseSource();
	  this.DWObject.OpenSource();
	  this.DWObject.IfShowUI = (<HTMLInputElement>document.getElementById("ShowUI")).checked;
  
	  let i;
	  for (i = 0; i < 3; i++) {
		if ((<HTMLInputElement>document.getElementsByName("PixelType").item(i)).checked == true)
		  this.DWObject.PixelType = i;
	  }
	  if (this.DWObject.ErrorCode != 0) {
		this.appendMessage('<strong>Error setting PixelType value: </strong>');
		this.appendMessage("<span style='color:#cE5E04'><strong>" + this.DWObject.ErrorString + "</strong></span><br />");
	  }
	  this.DWObject.Resolution = parseInt((<HTMLInputElement>document.getElementById("Resolution")).value);
	  if (this.DWObject.ErrorCode != 0) {
		this.appendMessage('<strong>Error setting Resolution value: </strong>');
		this.appendMessage("<span style='color:#cE5E04'><strong>" + this.DWObject.ErrorString + "</strong></span><br />");
	  }
  
	  let bADFChecked = (<HTMLInputElement>document.getElementById("ADF")).checked;
	  this.DWObject.IfFeederEnabled = bADFChecked;
	  if (bADFChecked == true && this.DWObject.ErrorCode != 0) {
		this.appendMessage('<strong>Error setting ADF value: </strong>');
		this.appendMessage("<span style='color:#cE5E04'><strong>" + this.DWObject.ErrorString + "</strong></span><br />");
	  }
  
	  let bDuplexChecked = (<HTMLInputElement>document.getElementById("Duplex")).checked;
	  this.DWObject.IfDuplexEnabled = bDuplexChecked;
	  if (bDuplexChecked == true && this.DWObject.ErrorCode != 0) {
		this.appendMessage('<strong>Error setting Duplex value: </strong>');
		this.appendMessage("<span style='color:#cE5E04'><strong>" + this.DWObject.ErrorString + "</strong></span><br />");
	  }
	  if (Dynamsoft.Lib.env.bWin || (!Dynamsoft.Lib.env.bWin && this.DWObject.ImageCaptureDriverType == 0))
		this.appendMessage("Pixel Type: " + this.DWObject.PixelType + "<br />Resolution: " + this.DWObject.Resolution + "<br />");
	  this.DWObject.IfDisableSourceAfterAcquire = true;
	  this.DWObject.AcquireImage();
	}
	/**
	 * load image
	 */
	btnLoadImagesOrPDFs_onclick() {
	  let OnPDFSuccess = () => {
		this.appendMessage("Loaded an image successfully.<br/>");
		this.updatePageInfo();
	  };
  
	  let OnPDFFailure = (errorCode, errorString) => {
		this.checkErrorStringWithErrorCode(errorCode, errorString);
	  };
  
	  let funLoadImagesOrPDFs = () => {
		this.DWObject.IfShowFileDialog = true;
		this.DWObject.Addon.PDF.SetResolution(200);
		this.DWObject.Addon.PDF.SetConvertMode(this.EnumDWT_ConvertMode.CM_RENDERALL);
		this.DWObject.LoadImageEx("", EnumDWT_ImageType.IT_ALL, OnPDFSuccess, OnPDFFailure);
  
	  };
	  let strhttp = "http:";
	  if ("https:" == document.location.protocol)
		strhttp = "https:";
	  this.DWObject.IfSSL = Dynamsoft.Lib.detect.ssl;
	  let _strPort = location.port == "" ? 80 : location.port;
	  if (Dynamsoft.Lib.detect.ssl == true)
		_strPort = location.port == "" ? 443 : location.port;
	  this.DWObject.HTTPPort = _strPort;
	  let OnFailure = (errorCode, errorString) => {
		this.appendMessage(errorString);
	  };
	  if (Dynamsoft.Lib.env.bMac)
		this.DWObject.Addon.PDF.Download(strhttp + "//demo.dynamsoft.com/DWT/Resources/addon/MacPdf.zip", funLoadImagesOrPDFs, OnFailure);
	  else if (Dynamsoft.Lib.env.bLinux)
		this.DWObject.Addon.PDF.Download(strhttp + "//demo.dynamsoft.com/DWT/Resources/addon/LinuxPdf.zip", funLoadImagesOrPDFs, OnFailure);
	  else
		this.DWObject.Addon.PDF.Download(strhttp + "//demo.dynamsoft.com/DWT/Resources/addon/Pdf.zip", funLoadImagesOrPDFs, OnFailure);
  
	}
  
  
	pageonload() {
	  this.InitMessageBody();
	  this.initCustomScan();
	  let twainsource = <HTMLSelectElement>document.getElementById("source");
	  if (typeof (twainsource) != "undefined") {
		twainsource.options.length = 0;
		twainsource.options.add(new Option("Looking for devices.Please wait.", "0"));
		twainsource.options[0].selected = true;
	  }
	  if (typeof ($) != "undefined") {
		$("ul.PCollapse li>div").click(function () {
		  if ($(this).next().css("display") == "none") {
			$(".divType").next().hide(10);
			$(".divType").children(".mark_arrow").removeClass("expanded");
			$(".divType").children(".mark_arrow").addClass("collapsed");
			$(this).next().show(10);
			$(this).children(".mark_arrow").removeClass("collapsed");
			$(this).children(".mark_arrow").addClass("expanded");
		  }
		});
		$('#imgTypetiff').on('click', function () {
		  let _chkMultiPageTIFF = <HTMLInputElement>document.getElementById("MultiPageTIFF");
		  _chkMultiPageTIFF.disabled = false;
		  _chkMultiPageTIFF.checked = false;
  
		  let _chkMultiPagePDF = <HTMLInputElement>document.getElementById("MultiPagePDF");
		  _chkMultiPagePDF.checked = false;
		  _chkMultiPagePDF.disabled = true;
		});
  
		$('#imgTypepdf').on('click', function () {
		  let _chkMultiPageTIFF = <HTMLInputElement>document.getElementById("MultiPageTIFF");
		  _chkMultiPageTIFF.checked = false;
		  _chkMultiPageTIFF.disabled = true;
  
		  let _chkMultiPagePDF = <HTMLInputElement>document.getElementById("MultiPagePDF");
		  _chkMultiPagePDF.disabled = false;
		  _chkMultiPagePDF.checked = false;
		});
		let commonFun = function () {
		  let _chkMultiPageTIFF = <HTMLInputElement>document.getElementById("MultiPageTIFF");
		  _chkMultiPageTIFF.checked = false;
		  _chkMultiPageTIFF.disabled = true;
  
		  let _chkMultiPagePDF = <HTMLInputElement>document.getElementById("MultiPagePDF");
		  _chkMultiPagePDF.checked = false;
		  _chkMultiPagePDF.disabled = true;
		}
		$('#imgTypejpeg').on('click', commonFun);
		$('#imgTypepng').on('click', commonFun);
		$('#imgTypebmp').on('click', commonFun);
	  }
	  this.initiateInputs();
	  this.setDefaultValue();
	}
  
	InitMessageBody() {
  
	  let MessageBody = <HTMLDivElement>document.getElementById("divNoteMessage");
	  if (typeof (MessageBody) != "undefined") {
		let ObjString = "<div><p style='margin: 0; color: #444; font-family: OpenSans-Semibold, Arial, sans-serif, Verdana, Helvetica;'>Platform & Browser Support: </p>Internet Explorer 6 or above (32 bit/64 bit), any version of Chrome (32 bit/64 bit), any version of Firefox on Windows; Safari, Chrome and Firefox on Mac OS X 10.6 or later; Chrome and Firefox v27 or above (64 bit) on Ubuntu 10-16, Debian 8, or Fedora 19+";
		ObjString += ".</div>";
		MessageBody.style.display = "";
		MessageBody.innerHTML = ObjString;
	  }
	}
  
	initCustomScan() {
	  let ObjString = "";
	  ObjString += "<ul id='divTwainType' style='list-style: none; margin:0; padding-left:0'> ";
	  ObjString += "<li style='margin-top: 3px;'>";
	  ObjString += "<label id ='lblShowUI' for = 'ShowUI' style='display: inline-block;margin: 0 15px 0 0;font-size: 12px;'><input type='checkbox' id='ShowUI' style='width: 15px;height: 15px;vertical-align: middle;' />Show UI&nbsp;</label>";
	  ObjString += "<label for = 'ADF' style='display: inline-block;margin: 0 15px 0 0;font-size: 12px;'><input type='checkbox' id='ADF' style='width: 15px;height: 15px;vertical-align: middle;' />AutoFeeder&nbsp;</label>";
	  ObjString += "<label for = 'Duplex' style='display: inline-block;margin: 0;font-size: 12px;'><input type='checkbox' id='Duplex' style='width: 15px;height: 15px;vertical-align: middle;'/>Duplex</label></li>";
	  ObjString += "<li style='margin-top: 8px;'>Pixel Type:";
	  ObjString += "<label for='BW' style='display: inline-block;margin: 0 15px 0 5px;font-size: 12px;'><input type='radio' id='BW' name='PixelType' style='width: 15px;height: 15px;vertical-align: middle;'/>B&amp;W </label>";
	  ObjString += "<label for='Gray'style='display: inline-block;margin: 0 15px 0 0;font-size: 12px;'><input type='radio' id='Gray' name='PixelType' style='width: 15px;height: 15px;vertical-align: middle;'/>Gray</label>";
	  ObjString += "<label for='RGB'style='display: inline-block;margin: 0;font-size: 12px;'><input type='radio' id='RGB' name='PixelType' style='width: 15px;height: 15px;vertical-align: middle;'/>Color</label></li>";
	  ObjString += "<li style='margin-top: 8px;'>";
	  ObjString += "<span>Resolution:</span><select size='1' id='Resolution' style='margin-left: 3px;width: 192px;height: 26px;'><option value = ''></option></select></li>";
	  ObjString += "</ul>";
  
	  if (document.getElementById("divProductDetail"))
		document.getElementById("divProductDetail").innerHTML = ObjString;
	  let vResolution = <HTMLSelectElement>document.getElementById("Resolution");
	  if (vResolution) {
		vResolution.options.length = 0;
		vResolution.options.add(new Option("100", "100"));
		vResolution.options.add(new Option("150", "150"));
		vResolution.options.add(new Option("200", "200"));
		vResolution.options.add(new Option("300", "300"));
		vResolution.options[3].selected = true;
	  }
  
	}
  
	initiateInputs() {
	  let allinputs = document.getElementsByTagName("input");
	  for (let i = 0; i < allinputs.length; i++) {
		if (allinputs[i].type == "checkbox") {
		  allinputs[i].checked = false;
		}
		else if (allinputs[i].type == "text") {
		  allinputs[i].value = "";
		}
	  }
	  if (Dynamsoft.Lib.env.bIE == true && Dynamsoft.Lib.env.bWin64 == true) {
		let o = document.getElementById("samplesource64bit");
		if (o)
		  o.style.display = "inline";
  
		o = document.getElementById("samplesource32bit");
		if (o)
		  o.style.display = "none";
	  }
	}
  
	setDefaultValue() {
	  let vGray = <HTMLInputElement>document.getElementById("Gray");
	  if (vGray)
		vGray.checked = true;
  
	  let varImgTypepng2 = <HTMLInputElement>document.getElementById("imgTypepng2");
	  if (varImgTypepng2)
		varImgTypepng2.checked = true;
	  let varImgTypepng = <HTMLInputElement>document.getElementById("imgTypepng");
	  if (varImgTypepng)
		varImgTypepng.checked = true;
	//   let _strDefaultSaveImageName = "";
	  let _txtFileNameforSave = <HTMLInputElement>document.getElementById("txt_fileNameforSave");
	//   if (_txtFileNameforSave)
	// 	_txtFileNameforSave.value = _strDefaultSaveImageName;
	  let _txtFileName = <HTMLInputElement>document.getElementById("txt_fileName");
	//   if (_txtFileName)
	// 	_txtFileName.value = _strDefaultSaveImageName;
	  let _chkMultiPageTIFF_save = <HTMLInputElement>document.getElementById("MultiPageTIFF_save");
	  if (_chkMultiPageTIFF_save)
		_chkMultiPageTIFF_save.disabled = true;
	  let _chkMultiPagePDF_save = <HTMLInputElement>document.getElementById("MultiPagePDF_save");
	  if (_chkMultiPagePDF_save)
		_chkMultiPagePDF_save.disabled = true;
	  let _chkMultiPageTIFF = <HTMLInputElement>document.getElementById("MultiPageTIFF");
	  if (_chkMultiPageTIFF)
		_chkMultiPageTIFF.disabled = true;
	  let _chkMultiPagePDF = <HTMLInputElement>document.getElementById("MultiPagePDF");
	  if (_chkMultiPagePDF)
		_chkMultiPagePDF.disabled = true;
	}
  }
  