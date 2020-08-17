import { AddInvestServiceService } from './../../../services/chart/add-invest-service.service';
import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { group } from '@angular/animations';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from "rxjs";
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationStore } from '../../../../app/authentication';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldConfig } from '../progressnote/template-editor/field.interface';

declare var $: any;
@Component({
  selector: 'app-add-invest',
  templateUrl: './add-invest.component.html',
  styleUrls: ['./add-invest.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddInvestComponent implements OnInit {
  @Input() PEValueObj: any = [];
  group: FormGroup;
  field: FieldConfig;
  ParentArr: any[] = [];
  childArr: any[] = [];
  selectedValues: string[] = [];
  selectedInvestigation: any = [];
  groups: any[] = [];
  investigations: any[] = [];
  patientInvestigation: any[] = [];
  patientInvestigationClone: any[] = [];
  InvestigationName: string;
  cars: any[];
  addnote: any;
  cols: any[] = [];
  item: any[] = [];
  name: string;
  date: any;
  historicalPastResultsSelectedValue;
  data: any = [];
  tabindex: number = 0;
  GroupOption: any[] = [];
  InvestigationOption: any[];
  status: boolean = false;
  groupings: any = {};
  patientData;
  selectedPatientInvestigation = {
    CreatedByUser: "",
    CreatedByUserId: "",
    Date: new Date(),
    DateCreated: new Date(),
    DateLastUpdated: new Date(),
    Inactive: false,
    InvestigationGroupings: [],
    InvestigationId: "",
    InvestigationItems: [],
    LastUpdatedByUser: "",
    LastUpdatedByUserId: "",
    Name: "",
    PatientInvestigations: [],
    StatusName: "",
    Note: "",
    aBnormal: false,
  };
  ABnormal: boolean = false;
  groupsadd: boolean = true;
  InvestGrp: any[];
  groupId: any[];
  isEnable: boolean = true;
  investigationAdd: boolean = true;
  InvestigationItem: any[] = [];
  cities;
  OptionsList;
  investItems: any = [];
  PatientInvestigation: any[] = [];
  historicalPatientInvestigation: any[] = [];
  HistoricalPatientTableHeaders;
  HistoricalPatientTableSelectedValue;
  historicalPastResults: any[] = [];
  isenableWidgetInvestigation: boolean = false;
  editInvestigationItem: any = {};
  TextResult: any;
  NumericResult: any;
  DateResult: any;
  DateCreated: any;
  constructor(private InvestigationGrps: AddInvestServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private authStore: AuthenticationStore,
    private toaster: ToastrService,
    private fb: FormBuilder) {
  }
  ngOnInit() {
    this.patientData = JSON.parse(sessionStorage.getItem('PatientDetail'));
    this.getData();
    this.cols = [
      { field: 'Date', header: 'Date' },
      { field: 'Name', header: 'Name' },
      { field: 'StatusName', header: 'Status' },
      { field: 'Note', header: 'Note' },
    ];
    this.HistoricalPatientTableHeaders = [
      { field: 'InvestigationDate', header: 'Date' },
      { field: 'Name', header: 'Name' },
      { field: 'StatusName', header: 'Status' },
      { field: 'AdditionalNotes', header: 'Note' }
    ];

    if (this.route.snapshot.routeConfig.path === "add-vitals") {
      this.isenableWidgetInvestigation = true;
    }
    if(this.PEValueObj){
      const control = this.fb.control(this.PEValueObj)
      this.group.addControl(this.field.name, control);
    }
  }

  getData() {
    let param = {
      patientId: this.patientData.PatientId
    }

    let InvestigationGroup = this.InvestigationGrps.getInvestigationGroup();
    let PatientInvestigation = this.InvestigationGrps.getPatientInvestigation(param);
    let Option = this.InvestigationGrps.getOptionList();

    forkJoin([PatientInvestigation, Option, InvestigationGroup]).subscribe(res => {
      this.PatientInvestigation = res[0];
      this.OptionsList = res[1];
      this.InvestGrp = res[2];
      this.PatientInvestigation.forEach((item, i) => {
        item.Investigation.InvestigationDate = moment(new Date(item.InvestigationDate)).format("MM/DD/YYYY")
        item.Investigation.AdditionalNotes = item.AdditionalNotes
        item.Investigation.Abnormal = item.Abnormal
        item.Investigation.AdditionalNotes = item.AdditionalNotes
        item.indexvalue = i
        switch (item.Status) {
          case 1: item.Investigation.StatusName = "Awaiting"
            break;
          case 2: item.Investigation.StatusName = "In Review"
            break;
          case 3: item.Investigation.StatusName = "Follow Up"
            break;
          case 4: item.Investigation.StatusName = "Complete"
            break;
          case 5: item.Investigation.StatusName = "Cancelled"
            break
        }
        this.historicalPatientInvestigation.push(item.Investigation)
      })
     
    })

  }


  selectGroups(event) {
    this.isEnable = true;
    this.InvestigationItem = [];
    this.patientInvestigation = this.patientInvestigationClone;
    let temp = event.value
    let params = {
      groupId: temp.InvestigationGroupId,
    }
    this.InvestigationGrps.getInvestigationgrpId(params).subscribe(res => {
      this.groupId = res

      this.groupId.forEach((item) => {
        this.PatientInvestigation.forEach((ele) => {
          if (item.InvestigationId === ele.InvestigationId)
            item.aBnormal = ele.Abnormal
        })
      })
      this.groupsadd = false
    })
  }


  selectInvestigation(event) {
    this.isEnable = true;
    this.InvestigationItem = [];
    let temp = event.value;
    this.patientInvestigation = [];
    for (let i = 0; i < this.patientInvestigationClone.length; i++) {
      if (temp.InvestigationId === this.patientInvestigationClone[i].InvestigationId) {
        this.patientInvestigation.push(this.patientInvestigationClone[i])

      }
    }
    this.investigationAdd = false;
  }


  groupsAddPatients(values) {
    this.patientInvestigation = this.patientInvestigation.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }
    ))
    this.patientInvestigation = [...this.patientInvestigation, ...this.groupId];
    this.patientInvestigationClone = this.patientInvestigation;
    for (let i = 0; i < this.patientInvestigation.length; i++) {
      this.patientInvestigation[i].Date = moment(new Date()).format("MM/DD/YYYY");
      let temp = this.patientInvestigation[i].InvestigationGroupings;
      for (let j = 0; j < temp.length; j++) {
        switch (temp[j].Status) {
          case 0: temp[j].StatusName = "Awaiting"
            this.patientInvestigation[i].StatusName = "Awaiting"
            break;
          case 1: temp[j].StatusName = "In Review"
            this.patientInvestigation[i].StatusName = "In Review"
            break;
          case 2: temp[j].StatusName = "Follow Up"
            this.patientInvestigation[i].StatusName = "Follow Up"
            break;
          case 3: temp[j].StatusName = "Complete"
            this.patientInvestigation[i].StatusName = "Complete"
            break;
          case 4: temp[j].StatusName = "Cancelled"
            this.patientInvestigation[i].StatusName = "Cancelled"
            break;
        }
      }
      this.patientInvestigation[i].InvestigationGroupings = temp;
    }
  }

  onInvestigationRowSelect(rowData, index) {
    for (let i = 0; i < this.patientInvestigation.length; i++) {
      if (rowData.InvestigationId === this.patientInvestigation[i].InvestigationId) {
        this.patientInvestigation.splice(i, 1)
        break;
      }
    }
    this.patientInvestigation = this.patientInvestigation.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }
    ))
    if (this.patientInvestigation.length === this.patientInvestigationClone.length) {
      return;
    } else {
      for (let i = 0; i < this.patientInvestigationClone.length; i++) {
        if (rowData.InvestigationId === this.patientInvestigationClone[i].InvestigationId) {
          this.patientInvestigationClone.splice(i, 1);
          break;
        }
      }
    }
    this.patientInvestigationClone = this.patientInvestigationClone.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }
    ))
  }

  InvestigationAddPatients(values) {
    this.patientInvestigation.push(values);
    this.patientInvestigationClone.push(values);
    this.patientInvestigation = this.patientInvestigation.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }
    ))
    this.patientInvestigationClone = this.patientInvestigationClone.map((item, i) => (
      {
        ...item,
        indexvalue: i,
      }
    ))
    for (let i = 0; i < this.patientInvestigation.length; i++) {
      this.patientInvestigation[i].Date = moment(new Date()).format("MM/DD/YYYY");
      let temp = this.patientInvestigation[i].InvestigationGroupings;
      for (let j = 0; j < temp.length; j++) {
        switch (temp[j].Status) {
          case 0: temp[j].StatusName = "Awaiting"
            this.patientInvestigation[i].StatusName = "Awaiting"
            break;
          case 1: temp[j].StatusName = "Review"
            this.patientInvestigation[i].StatusName = "Review"
            break;
          case 2: temp[j].StatusName = "Follow Up"
            this.patientInvestigation[i].StatusName = "Follow Up"
            break;
          case 3: temp[j].StatusName = "Complete"
            this.patientInvestigation[i].StatusName = "Complete"
            break;
          case 4: temp[j].StatusName = "Cancelled"
            this.patientInvestigation[i].StatusName = "Cancelled"
            break;
        }
      }
      this.patientInvestigation[i].InvestigationGroupings = temp;
    }
  }

  resultsView(rowData) {
    this.selectedPatientInvestigation = rowData
    let temp: any[] = [];
    this.name = rowData.Name;
    this.date = rowData.Date;
    rowData.addnote = this.addnote
    if (this.selectedInvestigation.length === 0) {
      this.InvestigationGrps.getInvestigationItems().subscribe(res => {
        this.selectedInvestigation = res;
        this.selectedInvestigation.forEach((item) => {
          temp = [];
          if (rowData.InvestigationId === item.InvestigationId) {
            item.InvestigationLibrary.InvestigationId = item.InvestigationId
            if ((item.NormalMinVal === 0) && (item.NormalMaxVal === 0)) {
              item.InvestigationLibrary.Range = ""
            } else {
              item.InvestigationLibrary.Range = item.NormalMinVal + "-" + item.NormalMaxVal
            }
            if (item.InvestigationLibrary.FieldType === 6) {
              this.OptionsList.forEach((ele) => {
                if (item.InvestigationLibrary.OptionId === ele.InvestigationOptionId) {
                  temp.push(ele)
                }
              })
              temp.sort((a, b) => a.OrderIndex - b.OrderIndex);
            } else {
              temp = []
            }
            item.InvestigationLibrary.ResultArr = temp
            item.InvestigationLibrary.Results = ""
            item.InvestigationLibrary.AdditionalNotes = "";
            this.InvestigationItem.push(item.InvestigationLibrary)
          }
        })
        this.cities = [
          { label: "1", value: 1 },
          { label: "2", value: 2 },
          { label: "3", value: 3 },
          { label: "4", value: 4 },
        ];
        this.isEnable = false;
      })
    } else {


      this.InvestigationItem = [];
      this.selectedInvestigation.forEach((item) => {
        temp = [];
        if (rowData.InvestigationId === item.InvestigationId) {
          if ((item.NormalMinVal === 0) && (item.NormalMaxVal === 0)) {
            item.InvestigationLibrary.Range = ""
          } else {
            item.InvestigationLibrary.Range = item.NormalMinVal + "-" + item.NormalMaxVal
          }
          if (item.InvestigationLibrary.FieldType === 6) {
            this.OptionsList.forEach((ele) => {
              if (item.InvestigationLibrary.OptionId === ele.InvestigationOptionId) {
                temp.push(ele)
              }
            })
            temp.sort((a, b) => a.OrderIndex - b.OrderIndex);
          } else {
            temp = []
          }
          item.InvestigationLibrary.ResultArr = temp
          item.InvestigationLibrary.Results = ""
          this.InvestigationItem.push(item.InvestigationLibrary)
        }
      })


      this.cities = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ];
      this.isEnable = false;


    }
    // this.InvestigationItem.forEach((ele)=>{
    //   ele.FieldType = ele.FieldType.toString();
    // })
  }
  resultsInputChange() {
    // console.log(this.InvestigationItem)
    // this.InvestigationItem.push(this.TextResult);
    // this.InvestigationItem.push(this.NumericResult)
  }



  onInvestigationSave() {

    let payload: any = []
    this.groupings.InvestigationResults = []
    this.resultsView(this.selectedPatientInvestigation);
    this.patientInvestigation.forEach((item, id) => {
      payload.push({})
      payload[id].InvestigationId = item.InvestigationId;
      payload[id].MrPatientEncounterId = item.MrPatientEncounterId ? item.MrPatientEncounterId : null;
      payload[id].PhysicianId = this.authStore.PhysicianDetail.PhysicianId;
      payload[id].PatientId = this.authStore.PatientDetail.PatientId;
      payload[id].InvestigationDate = new Date();
      payload[id].Status = this.selectedPatientInvestigation.StatusName;
      if (payload[id].Status === "Awaiting") {
        payload[id].Status = 1;
      }
      else if (payload[id].Status === "In Review") {
        payload[id].Status = 2;
      }
      else if (payload[id].Status === "Follow Up") {
        payload[id].Status = 3;
      }
      else if (payload[id].Status === "Complete") {
        payload[id].Status = 4;
      }
      else if (payload[id].Status === "Cancelled") {
        payload[id].Status = 5;
      } else {
        payload[id].Status = 1
      }
      payload[id].Abnormal = this.selectedPatientInvestigation.aBnormal;
      if (payload[id].Abnormal === undefined) {
        payload[id].Abnormal = false;
      } else if (payload[id].Abnormal === true) {
        payload[id].Abnormal = true
      }
      payload[id].AdditionalNotes = this.selectedPatientInvestigation.Note;
      payload[id].DateCreated = new Date();
      payload[id].CreatedByUserId = this.authStore.UserDetail.UserId;
      payload[id].DateLastUpdated = new Date();
      payload[id].LastUpdatedByUserId = this.authStore.UserDetail.UserId;
      payload[id].TemplateSectionId = item.TemplateSectionId ? item.TemplateSectionId : null;
      payload[id].Active = item.Active ? item.Active : null;
      // payload.push(this.groupings)
      payload[id].InvestigationResults = []
      if (item.InvestigationId === this.selectedPatientInvestigation.InvestigationId) {
        this.InvestigationItem.forEach((element, i) => {
          payload[id].InvestigationResults.push({})
          // this.editInvestigationItem.PatientInvestigationId  = this.PatientInvestigation[id].PatientInvestigationId
          payload[id].InvestigationResults[i].InvestigationItemId = this.selectedInvestigation[i].InvestigationItemId;
          payload[id].InvestigationResults[i].AdditionalNotes = this.InvestigationItem[i].AdditionalNotes;

          switch (element.FieldType) {
            case 1: {
              payload[id].InvestigationResults[i].TextResult = element.Result !== undefined ? element.Result : null;
              payload[id].InvestigationResults[i].NumericResult = null;
              payload[id].InvestigationResults[i].DateResult = null
            }
              break;
            case 2: {
              payload[id].InvestigationResults[i].NumericResult = element.Result !== undefined ? element.Result : null;
              payload[id].InvestigationResults[i].DateResult = null;
              payload[id].InvestigationResults[i].TextResult = null;
            }
              break;
            case 3: {
              payload[id].InvestigationResults[i].NumericResult = element.Result !== undefined ? element.Result : null;
              payload[id].InvestigationResults[i].DateResult = null;
              payload[id].InvestigationResults[i].TextResult = null;
            }
              break;
            case 4: {
              payload[id].InvestigationResults[i].TextResult = element.Result !== undefined ? element.Result : null;
              payload[id].InvestigationResults[i].DateResult = null;
              payload[id].InvestigationResults[i].NumericResult = null;
            }
              break;
            case 5: {
              payload[id].InvestigationResults[i].DateResult = element.Result !== undefined ? element.Result : null;
              payload[id].InvestigationResults[i].TextResult = null;
              payload[id].InvestigationResults[i].NumericResult = null;
            }
              break;
            case 6: {

              payload[id].InvestigationResults[i].TextResult = element.Result !== undefined ? element.Result.Value : null;
              payload[id].InvestigationResults[i].DateResult = null;
              payload[id].InvestigationResults[i].NumericResult = null;
            }
              break;
          }
          payload[id].InvestigationResults[i].NormalMin = this.selectedInvestigation[i].NormalMinVal;
          payload[id].InvestigationResults[i].NormalMax = this.selectedInvestigation[i].NormalMaxVal;
          // console.log('qwertty',this.selectedInvestigation[id].NormalMinVal,this.selectedInvestigation[id].NormalMaxVal)
          payload[id].InvestigationResults[i].Abnormal = this.selectedPatientInvestigation.aBnormal;
          if (payload[id].InvestigationResults[i].Abnormal === undefined) {
            payload[id].InvestigationResults[i].Abnormal = false;
          } else if (payload[id].InvestigationResults[i].Abnormal === true) {
            payload[id].InvestigationResults[i].Abnormal = true
          }
          payload[id].InvestigationResults[i].LabItemName = this.InvestigationItem[i].Name;
          payload[id].InvestigationResults[i].DateCreated = new Date();
          payload[id].InvestigationResults[i].CreatedByUserId = this.authStore.UserDetail.UserId;
          payload[id].InvestigationResults[i].DateLastUpdated = new Date();
          payload[id].InvestigationResults[i].LastUpdatedByUserId = this.authStore.UserDetail.UserId;

          // payload[id].InvestigationResults.push(this.editInvestigationItem); 
          // console.log('New Object',this.editInvestigationItem)         
        });
      }
    })            
    this.PEValueObj.push(payload)
    this.InvestigationGrps.updatePatientInvestigation(payload).subscribe(res => {
      this.showAlert("Updated successfully!")
      if (this.route.snapshot.routeConfig.path !== "template-editor") {
      this.router.navigate(['/pages/chart']);
      }
    })

  }
  onInvestigationClose() {
    // if (!this.isenableWidgetInvestigation)
      this.router.navigate(['/pages/chart']);
  }

  StatusUpdate(value) {
    this.status = true;
    this.selectedPatientInvestigation.StatusName = value;
    this.groupId.forEach((item) => {
      if (this.selectedPatientInvestigation.InvestigationId === item.InvestigationId) {
        item.StatusName = value;
      }
    })
    this.patientInvestigation.forEach((item) => {
      if (this.selectedPatientInvestigation.InvestigationId === item.InvestigationId) {
        item.StatusName = value;
      }
    })
    this.patientInvestigationClone.forEach((item) => {
      if (this.selectedPatientInvestigation.InvestigationId === item.InvestigationId) {
        item.StatusName = value;
      }
    })
    this.openPrev();
  }
  openPrev() {
    this.tabindex = (this.tabindex === 1) ? 0 : this.tabindex;
  }

  setIndex(event) {
    this.tabindex = event.index;
  }

  HistoricalPatientTable(rowData) {
    this.InvestigationName = "- " + this.HistoricalPatientTableSelectedValue.Name;
    this.historicalPastResults = [];
    let result = null;
    for (let i = 0; i < this.PatientInvestigation.length; i++) {
      let temp: any = {};
      let InvestigationResults = this.PatientInvestigation[i].InvestigationResults
      if (this.HistoricalPatientTableSelectedValue.InvestigationId === this.PatientInvestigation[i].InvestigationId) {
        for (let j = 0; j < InvestigationResults.length; j++) {
          temp.Abnormal = this.PatientInvestigation[i].InvestigationResults[j].Abnormal;
          if (InvestigationResults[j].TextResult != null) {
            result = InvestigationResults[j].TextResult;
          } else if (InvestigationResults[j].NumericResult != null) {
            result = InvestigationResults[j].NumericResult;
          } else if (InvestigationResults[j].DateResult != null) {
            result = moment(new Date(InvestigationResults[j].DateResult)).format("DD/MM/YYYY");
          } else {
            result = null;
          }

          InvestigationResults[j].result = result;
          result = null;
        }
        this.PatientInvestigation[i].InvestigationResults.Abnormal = this.PatientInvestigation[i].Abnormal
        this.PatientInvestigation[i].InvestigationResults.InvestigationDate = moment(new Date(this.PatientInvestigation[i].InvestigationDate)).format("DD/MM/YYYY")
        this.historicalPastResults.push(this.PatientInvestigation[i].InvestigationResults);
        temp = null;
      }
      InvestigationResults = [];
    }
  }

  aDjustCol() {
  }
  showAlert(msg: string) {
    this.toaster.success(msg)
  }
  pageCancel() {
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
  }
}
