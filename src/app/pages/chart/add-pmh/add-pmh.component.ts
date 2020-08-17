import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { AddPmhService } from '../../../services/chart/add-pmh.service'
import { ToastrService } from 'ngx-toastr';
import { FieldConfig } from '../progressnote/template-editor/field.interface';
import {FormGroup, FormBuilder} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-pmh',
  templateUrl: './add-pmh.component.html',
  styleUrls: ['./add-pmh.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddPmhComponent implements OnInit {
  @Output() loadEvent: EventEmitter<any> = new EventEmitter();
  @Output() refreshData: EventEmitter<any> = new EventEmitter();
  @Input() PEValueObj: any;
  group: FormGroup;
  field: FieldConfig;
  pmhCategories: any = [];
  selectedcity: string;
  currentDate: any;
  userDetails: any;
  pmhDate: Date;
  pmhDetails: any;
  selectedCategory: any;
  patientDetails: any;
  pmhComments: any;
  SelectedDetailsList: any;
  SelectedDetails: any;

  selectedDate: any;
  isenableCancelBtn: boolean = false;
  constructor(private datePipe: DatePipe,
    private pmhService: AddPmhService,
    private toastr: ToastrService,
    private router: Router,
    private active: ActivatedRoute,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.pmhCategories = [
      // { label: 'Select Category', value: 'null' },
      { label: 'Problem', value: '1' },
      { label: 'Surgery', value: '2' },
    ];
    this.currentDate = new Date();
    this.pmhDate = new Date();
    // this.currentDate = moment(new Date()).format('DD-MM-YYYY');
    // this.currentDate = this.datePipe.transform(this.currentDate,"dd-MM-yyyy");

    if (this.route.snapshot.routeConfig.path === "add-pmh") {
      this.isenableCancelBtn = true;
    }
    else if (this.route.snapshot.routeConfig.path === "template-editor") {
      this.isenableCancelBtn = false;
    }
    // if(this.PEValueObj){
this.PEValueObj === undefined && (this.PEValueObj = [{}])
      this.PEValueObj[0] = {
        DateEntered: this.pmhDate,
        EnteredData: '',
        Category: '',
        Description: ''
      }
    // }
    if(this.PEValueObj){
      console.log('PevalueObj :');
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
  }

  onFormDataChange() {
    this.PEValueObj[0] = {
      DateEntered: this.pmhDate,
      EnteredData: this.pmhComments ? this.pmhComments : '',
      Category: this.selectedCategory ? this.selectedCategory.value : '',
      Description: this.SelectedDetails ? this.SelectedDetails.medical_term : ''
    }
  }

  onSavePmh(date, details, comments, category) {
  }

  addPmh() {
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    this.patientDetails = JSON.parse(sessionStorage.getItem("PatientDetail"))

    let param = {
      MrPatientEncounterId: '',
      PhysicianId: '',
      Document: '',
      MrTemplateSectionId: '',
      MrFormFieldId: '',
      DateEntered: this.pmhDate,
      PatientId: this.patientDetails.PatientId,
      Description: this.SelectedDetails.medical_term,
      DateCreated: new Date(),
      CreatedByUserId: this.userDetails.UserId,
      DateLastUpdated: new Date(),
      LastUpdatedByUserId: this.userDetails.LastUpdatedByUserId,
      Category: this.selectedCategory.value,
      Active: true,
      EnteredData: this.pmhComments,
    }
    this.pmhService.postPastMedicalHistory(param).subscribe((results: any) => {
      this.refreshData.emit()
      this.showSuccess("Past Medical History is recorded successfully")
      if(this.active.snapshot.routeConfig.path === '/add-pmh'){
        this.router.navigate(['/pages/chart'], { skipLocationChange: true });
      }
      if (this.route.snapshot.routeConfig.path === 'add-pmh') {
        this.router.navigate(['/pages/chart'], { skipLocationChange: true });
        this.loadEvent.emit(true)
      }
    })

  }

  LoadDetails(SelectedDetails) {
    let Detail;
    if (!SelectedDetails) {
      Detail = {
        search: "a"
      }
    }
    else {
      Detail = {
        search: SelectedDetails
      }
    }2
    this.pmhService.SearchMedicalTerms(Detail).subscribe(resp => {
      this.SelectedDetailsList = resp
    })
  }

  pageCancel() {
    if (this.route.snapshot.routeConfig.path === 'add-pmh') {
      this.router.navigate(['/pages/chart'], { skipLocationChange: true });
    }
  }




  showSuccess(msg: string) {
    this.toastr.success(msg);
  }
}
