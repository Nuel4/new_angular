import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../../../model/Workspace/patient.model'
import { HttpWrapperService, GlobalState, Global } from '../../../../core';
import { PatientmanagementService } from '../../../../services/workspace/patient-management.service'
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ResponseContentType } from '@angular/http';
import { NgbModal, NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GuarantormodalComponent } from './guarantormodal/guarantormodal.component';
import { TablePharmacyService } from '../../../../services/workspace/table-pharmacy.service';
import { PatientGuarantorService } from '../../../../services/workspace/patient-guarantor.service';
import { ChargeslipsComponent } from '../../../../chargeslips/chargeslips.component';
import { PhysicianService } from '../../../../services/practice/physician.service'
import { forkJoin } from "rxjs";



@Component({
  selector: 'app-registerpatient',
  templateUrl: './registerpatient.component.html',
  styleUrls: ['./registerpatient.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterpatientComponent implements OnInit {

  patient: Patient;
  public showprtandchrge: boolean;
  index = 0;
  patientDetailsData: any = [];
  registeredPatientId: any = [];
  selectedPatientId: any;
  selectedPatientDetails: any = [];
  patientLanguage: any = [];
  isNew: boolean = true;
  displayguarantormodal: boolean = false;
  patientSalutation: any = [];
  passdatatomodal: any = [];
  _showPharmaciesDeleteData: any = [];
  ImportedGuarantor;
  guarantorvalue: boolean = false;
  Phywithmindet;

  constructor(private activeroute: ActivatedRoute,
    private httpWrapServ: HttpWrapperService,
    private patientMngServ: PatientmanagementService,
    private toastr: ToastrService,
    private routes: Router,
    private modalService: NgbModal,
    private tblp: TablePharmacyService,
    private pgs: PatientGuarantorService,
    private phc: PhysicianService,
  ) {

  }

  ngOnInit() {
    this.activeroute.params.subscribe(params => {
      this.selectedPatientId = params.selectedPatientId
      if (this.selectedPatientId === "0") {
        this.isNew = true;
        this.showprtandchrge = false;
        console.log("value of patientidis:", this.selectedPatientId);
      } else {
        this.getPatientvalues();
        console.log("value of patientidis:", this.selectedPatientId);
      }
    });
    this.getvaluesfromapis();
    // this.getLanguage();
    // this.getSalutation();
    console.log("value of selectedPatientId: ", this.selectedPatientId)
  }

  getvaluesfromapis() {
    let Language = this.patientMngServ.getCFLanguage();
    let salutation = this.patientMngServ.getSalutations();
    forkJoin([Language, salutation]).subscribe(resp => {
      resp[0].map(item => {
        this.patientLanguage.push({
          label: item.name,
          value: item.id
        })
      })
      console.log("value of patient language is:", this.patientLanguage)
      resp[1].map(item => {
        this.patientSalutation.push({
          label: item.SalutationCode,
          value: item.SalutationId
        })
      })
    });
  }
    
  getPatientvalues() {
    this.patientMngServ.getPatientById(this.selectedPatientId).subscribe(resp => {
      this.patientDetailsData = resp
      console.log("value of patient data in register patient", this.patientDetailsData)
      this.phc.getPhysicianWithMinimumDetails().subscribe(res => {
        this.Phywithmindet = res
        console.log("value of physician minimum details", this.Phywithmindet)
        this.Phywithmindet.forEach((item) => {
          if (this.patientDetailsData.DefaultPhysician === item.physicianid) {
            this.patientDetailsData['PhysicianName'] = item.lastname + ", " + item.firstname;
            return;
          } else { this.patientDetailsData['PhysicianName'] = ""}
        })
      })
      this.isNew = false
      this.showprtandchrge = true

    })
  }
  onRouted(patientId: number) {
    if (patientId > 0) {
      this.patientMngServ.getPatientById(patientId).subscribe((resp: Patient) => {
        this.setPatient(resp);
      });
    } else {
      this.setPatient(new Patient());
    }

  }
  setPatient(p: Patient) {
    this.patient = <Patient>p;
    console.log(this.patient);

  }
  openNext() {
    this.index = (this.index === 6) ? 0 : this.index + 1;
  }

  openfirstNext(data) {
    console.log("data", data)
    if (this.isNew === true) {
      this.showerror('Please save the existing Patient Details and Click Next');
      // return
      console.log("is new")
    } else {
      if (data === true) {
        console.log("Index1", this.index)
        this.index = this.index + 1;
        console.log("Index2", this.index)
      } else {
      this.showerror('Please fill the mandatory Patient Details and Click Next');
      }
      // if (data === true) {
      //   console.log("Index1", this.index)
      //   this.index = this.index + 2;
      //   console.log("Index2", this.index)
      // }
    }
  }

  openPrev() {
    this.index = (this.index === 0) ? 6 : this.index - 1;
  }
  handleChange(e) {
    this.index = e.index;
  }

  submitPatient(data) {
    console.log('component Array', data);
    this.patientDetailsData = data;
    console.log(' complete save', this.patientDetailsData)
    if (this.patientDetailsData.PatientId > 0) {
      console.log(' b4 calling put api', this.patientDetailsData)
      this.patientMngServ.updatePatient(this.patientDetailsData).subscribe(resp => {
        console.log("value of resp on updated is", resp)
        this.patientDetailsData = resp
        if (this.guarantorvalue === true) {

          if (this.ImportedGuarantor.PatientGuarantorId > 0) {
            console.log("value of imported Guarantor", this.ImportedGuarantor)
            this.pgs.putPatientGuarantor(this.ImportedGuarantor).subscribe(resp => {
              console.log("value of resp is", resp)
              this.showSuccess('Updated guarantor Data Successfully')
            })
          } else {
            this.pgs.postPatientGuarantor(this.ImportedGuarantor).subscribe(resp => {
              console.log("value of resp is", resp)
            })

          }
        }
        this.showSuccess('Updated Patient Data Successfully')
      })
    } else {

      console.log('b4 calling post api values', this.patientDetailsData)
      this.patientMngServ.postPatientRegisterDetails(this.patientDetailsData).subscribe(resp => {
        console.log('registeration success')
        console.log('response from register', resp)
        this.patientDetailsData = resp

        this.registeredPatientId = resp.PatientId
        this.selectedPatientId = resp.PatientId
        // this.patientid.emit(this.selectedPatientId)
        this.isNew = false
        this.showprtandchrge = true;
        this.showSuccess('Registered Successfully');
        console.log("patient id", this.selectedPatientId)

        if (this.guarantorvalue === true) {
          if (this.ImportedGuarantor.PatientGuarantorId > 0) {
            this.pgs.putPatientGuarantor(this.ImportedGuarantor).subscribe(resp => {
              console.log("value of resp is", resp)
              this.showSuccess('Updated guarantor Data Successfully')
            });
          } else {
            this.pgs.postPatientGuarantor(this.ImportedGuarantor).subscribe(resp => {
              console.log("value of resp is", resp)
            });

          }
        }

        this.showSuccess('Updated Patient Data Successfully')
      });

    }

  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

  showerror(msg) {
    this.toastr.error(msg);
  }
  onClose() {
    this.routes.navigate(['/pages/workspace/patientmanagement']);
  }

  submitInsurance(data) {
    console.log("value of insurance data in registerpatient is: ", data);
  }

  getSalutation() {
    this.patientMngServ.getSalutations().subscribe(resp => {
      console.log('salutation', resp);
      if (resp) {
        resp.map(item => {
          this.patientSalutation.push({
            label: item.SalutationCode,
            value: item.SalutationId
          })
        })
      }
      console.log('after initialization salutation', this.patientSalutation);
      // this.patientSalutation = resp;
    });
  }

  getLanguage() {
    this.patientMngServ.getCFLanguage().subscribe(resp => {
      console.log("updating language: ", resp)
      if (resp) {
        resp.map(item => {
          this.patientLanguage.push({
            label: item.name,
            value: item.id
          })
        })
      }
      // console.log('language', resp);
      // this.patientLanguage = resp;
    });
  }


  displaymodal(data) {
    if (data === "Pd") {
      data = "Patientdetails"
    }
    const modalRef = this.modalService.open(GuarantormodalComponent);
    this.passdatatomodal = {
      componentname: data,
      salutationdata: this.patientSalutation,
      languages: this.patientLanguage,
      patientId: this.selectedPatientId
    }
    modalRef.componentInstance.data = this.passdatatomodal;
    modalRef.componentInstance.PassGuarantor.subscribe((resp) => {
      this.ImportedGuarantor = resp
      this.guarantorvalue = true;
      if(resp.api) {
        delete resp['api'];
        this.pgs.postPatientGuarantor(this.ImportedGuarantor).subscribe(resp => {
          console.log("value of resp is", resp)
        });
      } else {
        delete resp['api'];
        this.pgs.putPatientGuarantor(this.ImportedGuarantor).subscribe(resp => {
          console.log("value of update", resp)
        })
      }
      
    })
    // modalRef.componentInstance.patientSalutation = this.passdatatomodal;
  }

  chargeSlips(data) {
    console.log('this.patientDetailsData', this.patientDetailsData)
    const modalRef = this.modalService.open(ChargeslipsComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
    modalRef.componentInstance.patientData = this.patientDetailsData;
    modalRef.componentInstance.Component = data
  }
}
