import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'protractor';
import { AllergiesService } from '../../../services/chart/allergies.service'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { AllergiesModalComponent } from './allergies-modal/allergies-modal.component'
import { ActivatedRoute } from '@angular/router';
import { AuthenticationStore } from './../../../authentication/authentication-store';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AllergiesComponent implements OnInit {
  @Input() wData: any;
  @Output() onSomething = new EventEmitter<string>();
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  widgetData: any;
  toChart: boolean;
  patientDetails: any;
  totalRecords = 0;
  allergylist: any;
  rows: any;
  isenableControls: boolean = false;
  isenableCancelBtn: boolean = true;
cols: any = [];
  constructor(private allergiesService: AllergiesService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private authStore: AuthenticationStore,
    private fb: FormBuilder
  ) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.cols = [
      { field: '', header: 'Name' },
      { field: '', header: 'Reaction' },
      { field: '', header: 'Status' },
      { field: '', header: 'Edit' },
    ]
    this.patientDetails = this.authStore.PatientDetail;
    this.widgetData = this.wData && JSON.parse(this.wData);
    if (this.widgetData) {
      this.toChart = true;
    }
    if (this.patientDetails !== undefined) {
      let page = 0;
      this.getAllergies(page)
    }
    if(this.route.snapshot.routeConfig.path === ""){
      this.isenableControls = false;

    }
    else if(this.route.snapshot.routeConfig.path == "template-editor"){
      this.isenableControls = true;
    }
    this.widgetData = this.wData && JSON.parse(this.wData);
    this.PEValueObj = [{}]
    if(this.PEValueObj){
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }


  }
 
  getAllergies(currentpage?){
    let param = {
      patientId: this.patientDetails.PatientId,
      offset: currentpage ? currentpage : 0,
      limit: "5"
    }
    this.allergiesService.GetAllergiesByPatientId(param).subscribe(results => {
      this.totalRecords = results.TotalItems
      this.allergylist = results.Results
      this.rows = results.PageSize
    });
  }

  paginate(event) {
    // alert()
    let currentpage = event.first / event.rows;
    this.getAllergies(currentpage);
  }

  editmodal(allergyData) {
    const modRef = this.modalService.open(AllergiesModalComponent)
    modRef.componentInstance.allergyData = allergyData;
    modRef.componentInstance.PEValueObj = this.PEValueObj;
    modRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        this.getAllergies()
      }
    })
  }

  refreshData() {
    this.onSomething.emit();
    let page = 0;
    this.getAllergies(page)
  }
}
