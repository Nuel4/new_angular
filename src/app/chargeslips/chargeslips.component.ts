import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from "moment";
import { SwitchView } from '@angular/common/src/directives/ng_switch';
import { InsuranceProviderService } from '../services/billing/insuranceprovider.service';

@Component({
    selector: 'app-chargeslips',
    templateUrl: './chargeslips.component.html',
    styleUrls: ['./chargeslips.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChargeslipsComponent implements OnInit {
    @Input() patientData;
    @Input() Component;
    SofDate: any;
    public Patientprint: Boolean = false;
    primaryInsurance: any;
    secondaryInsurance: any;
    constructor(private modalservice: NgbModal, private modal: NgbActiveModal, private IPS: InsuranceProviderService, ) { }

    ngOnInit() {

        switch (this.Component) {
            case "WaitingroomChargeSlip": this.ChargeslipsComponent();
                break;
            case "WaitingroomprintSlip": this.WaitingPrint();
                break;
            case "PatientChargeSlips": this.ChargeslipsComponent();
                break;
            case "PatientPrint": this.PatientPrint();
                break;
        }

        // if(this.Component === "WaitingroomChargeSlip"){
        //     this.ChargeslipsComponent();
        // } else if(this.Component === "WaitingroomprintSlip"){
        //     this.WaitingPrint();
        // } else if(this.Component === "PatientChargeSlips"){
        //     this.ChargeslipsComponent();
        // }
        this.getInsuranceProvider()

    }
    getInsuranceProvider() {

    }

    PatientPrint() {
        // this.WaitingPrint();
        // this.Patientprint = true;
        var divElements =
            `<div>
  <div>
    <label>Unique Number: ` +
            this.patientData.PatientId +
            `</label>
  </div>
  <div>
    <label>Name: ` +
            this.patientData.LastName + `, ` + this.patientData.FirstName +
            `</label>
            <label class="fleft">Physician: ` +
            this.patientData.PhysicianName +
            `</label>
  </div>
 
  <div>
    <label>Address: <br/>` +
            this.patientData.PrimaryAddressLine1 + `<br/> &nbsp;` +
            this.patientData.PrimaryAddressLine2 + `<br/> &nbsp;` +
            this.patientData.PrimaryCity + `<br/> &nbsp;` +
            this.patientData.PrimaryStateCode + `&nbsp;` + this.patientData.PrimaryZipCode + `-` + this.patientData.PrimaryZipPlus4 +
            `</label>
  </div>
  <div>
    <label>Work Phone: `+ this.patientData.WorkPhone + `<br/>Home Phone: ` + this.patientData.HomePhone + `<br/>Cell Phone: ` + this.patientData.MobilePhone +
            // if(this.patientData.WorkPhone){+this.patientData.WorkPhone+ `/` }
            // if(this.patientData.HomePhone){+this.patientData.HomePhone+ `/` }
            // if(this.patientData.MobilePhone){+this.patientData.MobilePhone+ `/` }
            // this.patientData.WorkPhone+ ` / `+
            //         this.patientData.HomePhone+ ` / ` +

            //         this.patientData.MobilePhone+` / ` +
            `<br/>Date of Birth: ` + moment(this.patientData.patientdateofbirth).format("YYYY-MM-DD") + `</label>
  </div>
  <div>Group#</div>
  <div>
    <p>I certify that there are no changes to the above information ___________________________<br>
        I certify that the above changes are correct _______________________________________<br>
        </p>
    <p> Verification(Staff use only)<br>
        Effective date ____________ Calendar year ________Plan year _______<br>
        In Network ____________Out of Network________<br>
        Co-pay ____________ Double co-pay________<br>
        Deductible ____________ Amount met to date_______<br>
        Co-ins ___________ OOP__________<br>
        Referral needed for specialist: Yes ____ No_____<br>
        Mailing address for claims (if not on list)<br>
        ___________________________________<br>
        ___________________________________<br>
        Electronic payor ID (if not on list)<br>
        Front Office initials: _______ Date Verified______</p>
  </div>
</div>`;
        var win = window.open();
        win.document.head.innerHTML = `
  <style>
  .fleft{
      float: right;
  }
    th, td {
      border: 0.5px solid black;
      padding: 15px;
      text-align: left;
    }
  </style>`;
        win.document.body.innerHTML =
            `<body>
      <center>
      </center>
      <br>` +
            divElements +
            `
    </body>`;
        win.print();
        win.close();
        this.modal.close('Close click');
    }



    WaitingPrint() {
        var divElements =
            `<div>
  <div>
    <label>Unique Number: ` +
            this.patientData.PatientId +
            `</label>
  </div>
  <div>
    <label>Date of Appointment: ` +
            moment(this.patientData.appointmentdate).format("YYYY-MM-DD") +
            `</label>
  </div>
  <div>
    <label>Appointment time: ` +
            moment(this.patientData.appointmentdate).format("hh:mm") +
            `</label>
  </div>
  <div>
    <label>Name: ` +
            this.patientData.patientname +
            `</label>
  </div>
  <div>
    <label>Physician: ` +
            this.patientData.patientId +
            `</label>
  </div>
  <div>
    <label>Address: ` +
            this.patientData.patientId +
            `</label>
  </div>
  <div>
    <label>Work / Home / Cell: ` +
            this.patientData.patientworkphone +
            `/` +
            this.patientData.patienthomephone +
            `/` +
            this.patientData.patientmobilephone +
            `</label>
  </div>
  <div>
    <label>Date of Birth: ` +
            moment(this.patientData.patientdateofbirth).format("YYYY-MM-DD") +
            `</label>
  </div>
  <div>Group#</div>
  <div>
    <p>I certify that there are no changes to the above information ___________________________<br>
        I certify that the above changes are correct _______________________________________<br>
        </p>
    <p> Verification(Staff use only)<br>
        Effective date ____________ Calendar year ________Plan year _______<br>
        In Network ____________Out of Network________<br>
        Co-pay ____________ Double co-pay________<br>
        Deductible ____________ Amount met to date_______<br>
        Co-ins ___________ OOP__________<br>
        Referral needed for specialist: Yes ____ No_____<br>
        Mailing address for claims (if not on list)<br>
        ___________________________________<br>
        ___________________________________<br>
        Electronic payor ID (if not on list)<br>
        Front Office initials: _______ Date Verified______</p>
  </div>
</div>`;
        var win = window.open();
        win.document.head.innerHTML = `
  <style>
    th, td {
      border: 0.5px solid black;
      padding: 15px;
      text-align: left;
    }
  </style>`;
        win.document.body.innerHTML =
            `<body>
      <center>
      </center>
      <br>` +
            divElements +
            `
    </body>`;
        win.print();
        win.close();
        this.modal.close('Close click');
    }

    ChargeslipsComponent() {
        // this.getInsuranceProvider()
        let payload = {
            patientId: this.patientData.PatientId
        }
        this.IPS.getInsuranceByPatientId(payload).subscribe(resp => {
            this.patientData.SofDate = this.patientData.SofDate !== null ? moment(this.patientData.SofDate).format('DD-MM-YYYY') : ''
            this.patientData.UniqueNumber = this.patientData.UniqueNumber !== null ? this.patientData.UniqueNumber : ''
            if (resp != null) {
                for (let i = 0; i < resp.length; i++) {
                    if (resp[i].Order === 1) {
                        this.primaryInsurance = resp[i].PolicyNumber;
                        this.patientData.primaryInsurance = this.primaryInsurance
                    }
                    else if (resp[i].Order === 2) {
                        this.secondaryInsurance = resp[i].PolicyNumber;
                        this.patientData.secondaryInsurance = this.secondaryInsurance
                    }
                }
            }

            //    this.patientData.push(this.primaryInsurance)

            var divElements =
                `<div id="page-container">
    <div id="pf1" class="pf w0 h0" data-page-no="1">
        <div class="pc pc1 w0 h0">
            <div class="c x0 y1 w2 h2" style="border: 1px solid black;border-right: none;">
                <div class="t m0 x1 h3 y2 ff1 fs0 fc0 sc0 ls0 ws0">CODE<span class="_ _0"> </span>DESCRIPTION<span
                        class="_ _1"> </span>FEE</div>
            </div>
            <div class="c x2 y1 w3 h2" style="border: 1px solid black;border-right: none;">
                <div class="t m0 x1 h3 y2 ff1 fs0 fc0 sc0 ls0 ws0">CODE<span class="_ _0"> </span>DESCRIPTION<span
                        class="_ _1"> </span>FEE</div>
            </div>
            <div class="c x3 y1 w2 h2" style="border: 1px solid black;border-right: none;">
                <div class="t m0 x1 h4 y3 ff1 fs1 fc0 sc0 ls0 ws0">CODE<span class="_ _2"> </span>DESCRIPTION<span
                        class="_ _3"> </span>FEE</div>
            </div>
            <div class="c x4 y1 w4 h2" style="border: 1px solid black;border-right: none;" >
                <div class="t m0 x1 h3 y2 ff1 fs0 fc0 sc0 ls0 ws0">CODE<span class="_ _0"> </span>DESCRIPTION<span
                        class="_ _1"> </span>FEE</div>
            </div>
            <div class="c x0 y4 w5 h5">
                <div class="t m0 x1 h6 y5 ff1 fs2 fc1 sc0 ls0 ws0">CONSULTS</div>
            </div>
            <div class="c x5 y4 w6 h5">
                <div class="t m0 x1 h7 y6 ff1 fs3 fc1 sc0 ls0 ws0">94010 PFT</div>
            </div>
            <div class="c x3 y4 w7 h5">
                <div class="t m0 x1 h7 y6 ff1 fs3 fc1 sc0 ls0 ws0">413.9 ANGINA, UNSPECIFIED</div>
            </div>
            <div class="c x6 y4 w4 h5">
                <div class="t m0 x1 h7 y6 ff1 fs3 fc1 sc0 ls0 ws0">455.3 HEMORRHOIDS W/O COMP</div>
            </div>
            <div class="c x0 y7 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99241 CONS FOCUSED STRAIGHT</div>
            </div>
            <div class="c x5 y7 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">94060 PFT WITH BRONCHODILATOR</div>
            </div>
            <div class="c x3 y7 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">414.00 HEART DISEASE (ASHD)</div>
            </div>
            <div class="c x6 y7 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">009.2 INFECTIOUS DIARRHEA</div>
            </div>
            <div class="c x0 y9 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99242 CONSULT EXPANDED STRAIGHT</div>
            </div>
            <div class="c x5 y9 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">J3420 B-12 INJECTION</div>
            </div>
            <div class="c x3 y9 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">424.1 AORTIC VALVE DISORDERS</div>
            </div>
            <div class="c x6 y9 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">789.0 ABDOMINAL PAIN</div>
            </div>
            <div class="c x0 ya w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99243 CONSULT DET. H&amp;E LOW</div>
            </div>
            <div class="c x5 ya w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">85651 SED RATE</div>
            </div>
            <div class="c x3 ya w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">427.9 CARDIAC DYSRHYTHMIA, UNSP</div>
            </div>
            <div class="c x6 ya w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">465.9 URI ACUTE</div>
            </div>
            <div class="c x0 yb w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99244 CONSULTATION COMP. H&amp;E MO</div>
            </div>
            <div class="c x5 yb w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">86580 MANTOUS PPD</div>
            </div>
            <div class="c x3 yb w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">427.31 ATRIAL FIBRILLATION</div>
            </div>
            <div class="c x6 yb w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">034.0 STREPT SORE THROAT</div>
            </div>
            <div class="c x0 yd w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99245 CONSULT COMP H&amp;E HIGH</div>
            </div>
            <div class="c x5 yd w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">90703 TETANUS VACCINE</div>
            </div>
            <div class="c x3 yd w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">786.50 CHEST PAIN UNSP</div>
            </div>
            <div class="c x6 yd w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">462 ACUTE PHARYNGITIS</div>
            </div>
            <div class="c x5 ye w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">90718 TETANUS AND DIPHTERIA</div>
            </div>
            <div class="c x3 ye w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">424.0 MITRAL VALVE DISORDERS</div>
            </div>
            <div class="c x6 ye w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">477.9 ALLERGIC RHINITIS, CAUSE</div>
            </div>
            <div class="c x0 yf w5 h8">
                <div class="t m0 x1 h6 y10 ff1 fs2 fc1 sc0 ls0 ws0">INITIAL/MEDICARE CON</div>
            </div>
            <div class="c x5 yf w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">90715 TDAP</div>
            </div>
            <div class="c x3 yf w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">410.91 MYOCARDIAL INFARCT ACUTE</div>
            </div>
            <div class="c x6 yf w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">473.9 UNSPECIFIED SINUSITIS (CH</div>
            </div>
            <div class="c x0 y11 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99201 INITIAL OFFICE VISIT FOCU</div>
            </div>
            <div class="c x5 y11 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">90732 PNEUMOCCOCAL VACCINE</div>
            </div>
            <div class="c x3 y11 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">423.9 DISEASE PERICARDIUM UNSP</div>
            </div>
            <div class="c x6 y11 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">492.8 OTHER EMPHYSEMA</div>
            </div>
            <div class="c x0 y12 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99202 OFFICE VISIT NEW PAT EXPA</div>
            </div>
            <div class="c x5 y12 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">90632 HEPATITIS A VACCINE</div>
            </div>
            <div class="c x3 y12 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">428.0 CONGESTIVE HEART FAILURE</div>
            </div>
            <div class="c x6 y12 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">461.9 ACUTE SINUSITIS, UNSPECIF</div>
            </div>
            <div class="c x0 y13 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99203 INITIAL OFFICE VISIT DETA</div>
            </div>
            <div class="c x5 y13 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">90746 HEPATITIS B VACCINE</div>
            </div>
            <div class="c x3 y13 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">414.9 CHRONIC ISCHEMIC HEART DI</div>
            </div>
            <div class="c x6 y13 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">487.1 INFLUENZA WITH OTHER RESP</div>
            </div>
            <div class="c x0 y14 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99204 INITIAL OV H&amp;E MODERATE</div>
            </div>
            <div class="c x5 y14 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">90662 FLU VACCINE SPLIT</div>
            </div>
            <div class="c x3 y14 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">785.1 PALPITATIONS</div>
            </div>
            <div class="c x6 y14 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">250.00 DIABETES</div>
            </div>
            <div class="c x0 y15 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99205 INITIAL OV- COMP H&amp;E HIGH</div>
            </div>
            <div class="c x5 y15 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">90663 H1N1 VAC</div>
            </div>
            <div class="c x3 y15 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">443.9 PERIPHERAL VASCULAR DISEA</div>
            </div>
            <div class="c x6 y15 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">244.9 ACQUIRED HYPOTHYROID UNSP</div>
            </div>
            <div class="c x5 y16 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">G9142 MEDICARE HIN1</div>
            </div>
            <div class="c x3 y16 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">507.00 ASPIRATION PNEUMONIA</div>
            </div>
            <div class="c x6 y16 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">599.0 URINARY TRACT INFECTION,</div>
            </div>
            <div class="c x0 y17 w5 h8">
                <div class="t m0 x1 h6 y10 ff1 fs2 fc1 sc0 ls0 ws0">F-U/MEDICARE CONSULT</div>
            </div>
            <div class="c x5 y17 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">36415 VENIPUCTURE</div>
            </div>
            <div class="c x3 y17 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">493.92 ASTHMA ACUTE EXACERBATION</div>
            </div>
            <div class="c x6 y17 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">788.41 SYMP URIN SYS FREQUENCY</div>
            </div>
            <div class="c x0 y18 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99211 F/U OV EXAM NOT REQUIRED</div>
            </div>
            <div class="c x5 y18 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">43235 EGD</div>
            </div>
            <div class="c x3 y18 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">493.90 ASTHMA NO STATUS</div>
            </div>
            <div class="c x6 y18 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">600.00 BENIGN PROSTATIC HYPERTRO</div>
            </div>
            <div class="c x0 y19 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99212 OFFICE VISIT-FOCUSED</div>
            </div>
            <div class="c x5 y19 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">43239 EGDE WITH BIOPSY</div>
            </div>
            <div class="c x3 y19 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">491.21 CHRONIC BRONCHITIS W/AC E</div>
            </div>
            <div class="c x6 y19 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">433.10 OCCLU/STEN CAROTID ART W/</div>
            </div>
            <div class="c x0 y1a w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99213 OFFICE VISIT-INTERM</div>
            </div>
            <div class="c x5 y1a w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">45330 FLEXIBLE SIGMOIDOSCOPY</div>
            </div>
            <div class="c x3 y1a w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">491.20 CHR BRONCHITIS W/O AC EXA</div>
            </div>
            <div class="c x6 y1a w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">437.9 CEREBROVASCULAR DIS UNSPE</div>
            </div>
            <div class="c x0 y1b w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99214 OFFICE VISIT HIGHEST</div>
            </div>
            <div class="c x5 y1b w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">45331 FLEXIBLE SIG W/ BIOPSY</div>
            </div>
            <div class="c x3 y1b w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">011.90 PULMONARY TUBERCULOSIS UN</div>
            </div>
            <div class="c x6 y1b w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">437.1 ISCHEMIC CEREBROVAS DISE</div>
            </div>
            <div class="c x0 y1c w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99215 F/U OV COMP H OR E HIGH</div>
            </div>
            <div class="c x5 y1c w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">45378 COLONOSCOPY</div>
            </div>
            <div class="c x3 y1c w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">466.0 ACUTE BRONCHITIS</div>
            </div>
            <div class="c x6 y1c w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">724.5 BACKACHE, UNSPECIFIED</div>
            </div>
            <div class="c x0 y1d w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">G9016 SMOKING CESSATION OXFORD</div>
            </div>
            <div class="c x5 y1d w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">45380 COLONOSCOPY WITH BIOPSY</div>
            </div>
            <div class="c x3 y1d w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">491.8 OTHER CHRONIC BRONCHITIS</div>
            </div>
            <div class="c x6 y1d w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">784.0 HEADACHE</div>
            </div>
            <div class="c x0 y1e w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">G0180 HOME HEALTH CERT</div>
            </div>
            <div class="c x5 y1e w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">93233 HOLTER MONITER INTERPITAT</div>
            </div>
            <div class="c x3 y1e w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">486 PNEUMONIA ORGANISM UNSPEC</div>
            </div>
            <div class="c x6 y1e w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">714.0 RHEUMATOID ARTHRITIS</div>
            </div>
            <div class="c x0 y1f w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">G0179 HOME HEALTH RE CERT</div>
            </div>
            <div class="c x5 y1f w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">81000 URINALYSIS</div>
            </div>
            <div class="c x3 y1f w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">496 CHRONIC AIRWAY OBSTRUCTIO</div>
            </div>
            <div class="c x6 y1f w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">401.1 HYPERTENSION</div>
            </div>
            <div class="c x0 y20 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">G8553 E PRESCRIBING</div>
            </div>
            <div class="c x5 y20 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">82270 BLOOD OCCULT</div>
            </div>
            <div class="c x3 y20 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">786.09 RESPIRATORY ABNORMALITY</div>
            </div>
            <div class="c x6 y20 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">272.0 PURE HYPERCHOLESTEROLEMIA</div>
            </div>
            <div class="c x5 y21 w6 h5">
                <div class="t m0 x1 h7 y6 ff1 fs3 fc1 sc0 ls0 ws0">90716 CHICKEN POX VACC</div>
            </div>
            <div class="c x3 y21 w7 h5">
                <div class="t m0 x1 h7 y6 ff1 fs3 fc1 sc0 ls0 ws0">494.1 BRONCHIECTASIS</div>
            </div>
            <div class="c x6 y21 w4 h5">
                <div class="t m0 x1 h7 y6 ff1 fs3 fc1 sc0 ls0 ws0">272.4 HYPERLIPODEMIA</div>
            </div>
            <div class="c x0 y22 w5 h8">
                <div class="t m0 x1 h6 y10 ff1 fs2 fc1 sc0 ls0 ws0">ANNUAL</div>
            </div>
            <div class="c x5 y22 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">93784 ABP MONITORING</div>
            </div>
            <div class="c x3 y22 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">518.3 PULMONARY EOSINOPHILIA</div>
            </div>
            <div class="c x6 y22 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">V70 GENERAL MEDICAL EXAMINATI</div>
            </div>
            <div class="c x0 y23 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99384 INITIAL PM, E&amp;M 12-17</div>
            </div>
            <div class="c x5 y23 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">84703 HCG URINE</div>
            </div>
            <div class="c x3 y23 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">518.89 OTHER DISEASES OF LUNG NE</div>
            </div>
            <div class="c x6 y23 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">V72.84 PREOP EXAM UNSP</div>
            </div>
            <div class="c x0 y24 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99385 INITIAL PM E&amp;M 18-39</div>
            </div>
            <div class="c x5 y24 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">94664 INITIAL INHALER INSTRUC</div>
            </div>
            <div class="c x3 y24 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">515 POSTINFLAM PULM FIBROSIS</div>
            </div>
            <div class="c x6 y24 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">458.9 HYPOTENSION, UNSPECIFIED</div>
            </div>
            <div class="c x0 y25 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99386 INITIAL PM E&amp;M 40-64</div>
            </div>
            <div class="c x5 y25 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">94375 FLOW VOLUME LOOP</div>
            </div>
            <div class="c x3 y25 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">490 BRONCHITIS, NOT SPECIFIED</div>
            </div>
            <div class="c x6 y25 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">276.51 DEHYDRATION</div>
            </div>
            <div class="c x0 y26 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">99387 INITAL E&amp;M PM 65 &amp; OVER</div>
            </div>
            <div class="c x5 y26 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">94200 BREATHING CAPACITY</div>
            </div>
            <div class="c x3 y26 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">135 SARCOIDOSIS</div>
            </div>
            <div class="c x6 y26 w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">077.9 CONJUNCTIVA DISEASE UNSPE</div>
            </div>
            <div class="c x0 y27 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99395 FOLLOW UP PM 18-39</div>
            </div>
            <div class="c x5 y27 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">45385 COLON/POLOP</div>
            </div>
            <div class="c x3 y27 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">724.3 SCIATICA</div>
            </div>
            <div class="c x6 y27 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">995.3 ALLERGY UNSPEC ELSEWHERE</div>
            </div>
            <div class="c x0 y28 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99396 FOLLOW UP PM 40-64</div>
            </div>
            <div class="c x5 y28 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">91065 HBT TEST</div>
            </div>
            <div class="c x3 y28 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">786.30 HEMOPTYSIS,UNSPECIFIED</div>
            </div>
            <div class="c x6 y28 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">079.99 UNSP VIRAL INF NOS</div>
            </div>
            <div class="c x0 y29 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">99397 FOLLOW UP PM 65 &amp; OVER</div>
            </div>
            <div class="c x5 y29 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">92551 AUDIOMETRY</div>
            </div>
            <div class="c x3 y29 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">786.05 SHORTNESS OF BREATH</div>
            </div>
            <div class="c x6 y29 w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">780.7 MALAISE AND FATIGUE</div>
            </div>
            <div class="c x0 y2a w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">G0438 NEW PT PREV MEDICARE</div>
            </div>
            <div class="c x5 y2a w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">92081 VISION TEST</div>
            </div>
            <div class="c x3 y2a w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">782.1 RASH AND OTHER NONSPECIFI</div>
            </div>
            <div class="c x6 y2a w4 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">100 LEPTOSPIROSIS</div>
            </div>
            <div class="c x0 y2b w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">G0439 FOLLOW UP PREV MEDICARE</div>
            </div>
            <div class="c x3 y2b w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">575.10 CHLCYST UNSP</div>
            </div>
            <div class="c x6 y2b w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">733.00 OSTEOPOROSIS, UNSPECIFIED</div>
            </div>
            <div class="c x5 y2c w6 h8">
                <div class="t m0 x1 h6 y10 ff1 fs2 fc1 sc0 ls0 ws0">DIAGNOSIS</div>
            </div>
            <div class="c x3 y2c w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">574.10 CALCULUS OF GALLBLADDER W</div>
            </div>
            <div class="c x6 y2c w4 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">278.00 OBESITY UNSP</div>
            </div>
            <div class="c x0 y2d w5 h8">
                <div class="t m0 x1 h6 y10 ff1 fs2 fc1 sc0 ls0 ws0">PROCEDURES</div>
            </div>
            <div class="c x5 y2d w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">285.9 ANEMIA, UNSPECIFIED</div>
            </div>
            <div class="c x3 y2d w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">571.40 HEPATITIS CHRONIC UNSPEC</div>
            </div>
            <div class="c x0 y2e w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">69210 REMOVAL OF IMPACTED CEREM</div>
            </div>
            <div class="c x5 y2e w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">725 POLYMYALGIA RHEUMATICA</div>
            </div>
            <div class="c x3 y2e w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">424.10 REGURGITATION</div>
            </div>
            <div class="c x0 y2f w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">93000 EKG</div>
            </div>
            <div class="c x5 y2f w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">185 MALIGNANT NEOPLASM PROSTA</div>
            </div>
            <div class="c x3 y2f w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">009.1 COLITIS, ENTERITIS GASTRO</div>
            </div>
            <div class="c x0 y30 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">93040 EKG RHYTHM STRIP</div>
            </div>
            <div class="c x5 y30 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">162.9 LUNG BRONCHUS CANCER</div>
            </div>
            <div class="c x3 y30 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">556.9 ULCERATIVE COLITIS UNSP</div>
            </div>
            <div class="c x0 y31 w5 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">94760 PULSE OXIMETRY</div>
            </div>
            <div class="c x5 y31 w6 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">153.9 COLON CANCER</div>
            </div>
            <div class="c x3 y31 w7 h8">
                <div class="t m0 x1 h7 yc ff1 fs3 fc1 sc0 ls0 ws0">530.11 REFLUX ESOPHAGITIS</div>
            </div>
            <div class="c x0 y32 w5 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">71010 CHEST X-RAY PA</div>
            </div>
            <div class="c x5 y32 w6 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">786.6 SWELLING MASS LUMP CHEST</div>
            </div>
            <div class="c x3 y32 w7 h8">
                <div class="t m0 x1 h7 y8 ff1 fs3 fc1 sc0 ls0 ws0">573.9 UNSPEC DISORDER LIVER</div>
            </div>
            <div class="c x0 y33 w5 h9">
                <div class="t m0 x1 h7 y34 ff1 fs3 fc1 sc0 ls0 ws0">71020 CHEST X RAY PA /LATERAL</div>
            </div>
            <div class="c x5 y33 w6 h9">
                <div class="t m0 x1 h7 y34 ff1 fs3 fc1 sc0 ls0 ws0">174.9 MALIGNANT NEOPLASM OF BRE</div>
            </div>
            <div class="c x3 y33 w7 h9">
                <div class="t m0 x1 h7 y34 ff1 fs3 fc1 sc0 ls0 ws0">562.1 DIVERTICULA OF COLON</div>
            </div>
            <div class="c x0 y35 w8 h2" style="border: 1px solid black;">
                <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">PATIENT NAME</div>
            </div>
            <div class="c x0 y37 w8 hb" style="border: 1px solid black;">
                <div class="t m0 x1 hc y38 ff1 fs4 fc0 sc0 ls0 ws0">` +
                this.patientData.LastName + '' + this.patientData.FirstName +
                `</div>
            </div>
            <div class="c x0 y39 w9 h2" style="border: 1px solid black;">
                <div class="t m0 x1 hd y3a ff2 fs1 fc0 sc0 ls0 ws0">INSURANCE CARRIER 1</div>
            </div>
            <div class="c x7 y39 wa h2" style="border: 1px solid black;">
                <div class="t m0 x1 hd y3a ff2 fs1 fc0 sc0 ls0 ws0">INSURANCE CARRIER 2</div>
            </div>
            <div class="c x0 y3b w9 hb" style="border: 1px solid black;">
                <div class="t m0 x1 h3 y3c ff1 fs0 fc0 sc0 ls0 ws0">` +
                this.patientData.primaryInsurance +
                `</div>
            </div>
            <div class="c x7 y3b wa hb" style="border: 1px solid black;">
                <div class="t m0 x1 h3 y3c ff1 fs0 fc0 sc0 ls0 ws0"> ` + this.patientData.secondaryInsurance + `</div>
            </div>
            <div class="c x0 y3d wb hb" style="border: 1px solid black;">
                <div class="t m0 x1 he y3e ff1 fs5 fc0 sc0 ls0 ws0">` +
                this.patientData.PhysicianName +
                `</div>
            </div>
            <div class="c x8 y35 w8 h2" style="border: 1px solid black;">
                <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">DOB</div>
            </div>
            <div class="c x8 y37 w8 hb" style="border: 1px solid black;">
                <div class="t m0 x1 hc y38 ff1 fs4 fc0 sc0 ls0 ws0"> ` +
                moment(this.patientData.DateOfBirth).format("YYYY-MM-DD") +
                `</div>
            </div>
            <div class="c x9 y37 w8 hb" style="border: 1px solid black;">
              <div class="t m0 x1 hc y38 ff1 fs4 fc0 sc0 ls0 ws0"> ` +
                this.patientData.UniqueNumber +
                `</div>
            </div>
            <div class="c x9 y35 w8 h2" style="border: 1px solid black;">
                <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">UNIQUE NUMBER</div>
            </div>
            <div class="c xa y35 w8 h2" style="border: 1px solid black;">
                <div class="t m0 x1 ha y36 ff2 fs0 fc0 sc0 ls0 ws0">DATE OF SERVICE</div>
            </div>
            <div class="c xa y37 w8 hb" style="border: 1px solid black;">
                <div class="t m0 x1 hc y38 ff1 fs4 fc0 sc0 ls0 ws0"> ` +
                this.patientData.SofDate +
                `</div>
            </div>
            <div class="c x0 y3f wb h2" style="border: 1px solid black;">
                <div class="t m0 x1 hd y3a ff2 fs1 fc0 sc0 ls0 ws0">DOCTOR NAME</div>
            </div>
        </div>
        <div class="pi" data-data='{"ctm":[1.000000,0.000000,0.000000,1.000000,0.000000,0.000000]}'></div>
    </div>
</div>`;
            var win = window.open();
            win.document.head.innerHTML = `<style>
    #sidebar {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 250px;
        padding: 0;
        margin: 0;
        overflow: auto
    }

    #page-container {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        border: 0
    }

    @media screen {
        #sidebar.opened+#page-container {
            left: 250px
        }

        #page-container {
            bottom: 0;
            right: 0;
            overflow: auto
        }

        .loading-indicator {
            display: none
        }

        .loading-indicator.active {
            display: block;
            position: absolute;
            width: 64px;
            height: 64px;
            top: 50%;
            left: 50%;
            margin-top: -32px;
            margin-left: -32px
        }

        .loading-indicator img {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0
        }
    }

    @media print {
        @page {
            margin: 0
        }

        html {
            margin: 0
        }

        body {
            margin: 0;
            -webkit-print-color-adjust: exact
        }

        #sidebar {
            display: none
        }

        #page-container {
            width: auto;
            height: auto;
            overflow: visible;
            background-color: transparent
        }

        .d {
            display: none
        }
    }

    .pf {
        position: relative;
        background-color: white;
        overflow: hidden;
        margin: 0;
        border: 0
    }

    .pc {
        position: absolute;
        border: 0;
        padding: 0;
        margin: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: block;
        transform-origin: 0 0;
        -ms-transform-origin: 0 0;
        -webkit-transform-origin: 0 0
    }

    .pc.opened {
        display: block
    }

    .bf {
        position: absolute;
        border: 0;
        margin: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none
    }

    .bi {
        position: absolute;
        border: 0;
        margin: 0;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none
    }

    @media print {
        .pf {
            margin: 0;
            box-shadow: none;
            page-break-after: always;
            page-break-inside: avoid
        }

        @-moz-document url-prefix() {
            .pf {
                overflow: visible;
                border: 1px solid #fff
            }

            .pc {
                overflow: visible
            }
        }
    }

    .c {
        position: absolute;
        border: 0;
        padding: 0;
        margin: 0;
        overflow: hidden;
        display: block
    }

    .t {
        position: absolute;
        white-space: pre;
        font-size: 1px;
        transform-origin: 0 100%;
        -ms-transform-origin: 0 100%;
        -webkit-transform-origin: 0 100%;
        unicode-bidi: bidi-override;
        -moz-font-feature-settings: "liga"0
    }

    .t:after {
        content: ''
    }

    .t:before {
        content: '';
        display: inline-block
    }

    .t span {
        position: relative;
        unicode-bidi: bidi-override
    }

    ._ {
        display: inline-block;
        color: transparent;
        z-index: -1
    }

    ::selection {
        background: rgba(127, 255, 255, 0.4)
    }

    ::-moz-selection {
        background: rgba(127, 255, 255, 0.4)
    }

    .pi {
        display: none
    }

    .d {
        position: absolute;
        transform-origin: 0 100%;
        -ms-transform-origin: 0 100%;
        -webkit-transform-origin: 0 100%
    }

    .it {
        border: 0;
        background-color: rgba(255, 255, 255, 0.0)
    }

    .ir:hover {
        cursor: pointer
    }

    @keyframes fadein {
        from {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    @-webkit-keyframes fadein {
        from {
            opacity: 0
        }

        to {
            opacity: 1
        }
    }

    @keyframes swing {
        0 {
            transform: rotate(0)
        }

        10% {
            transform: rotate(0)
        }

        90% {
            transform: rotate(720deg)
        }

        100% {
            transform: rotate(720deg)
        }
    }

    @-webkit-keyframes swing {
        0 {
            -webkit-transform: rotate(0)
        }

        10% {
            -webkit-transform: rotate(0)
        }

        90% {
            -webkit-transform: rotate(720deg)
        }

        100% {
            -webkit-transform: rotate(720deg)
        }
    }

    @media screen {
        #sidebar {
            background-color: #2f3236;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjNDAzYzNmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9IiMxZTI5MmQiPjwvcGF0aD4KPC9zdmc+")
        }

        #outline {
            font-family: Georgia, Times, "Times New Roman", serif;
            font-size: 13px;
            margin: 2em 1em
        }

        #outline ul {
            padding: 0
        }

        #outline li {
            list-style-type: none;
            margin: 1em 0
        }

        #outline li>ul {
            margin-left: 1em
        }

        #outline a,
        #outline a:visited,
        #outline a:hover,
        #outline a:active {
            line-height: 1.2;
            color: #e8e8e8;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            display: block;
            overflow: hidden;
            outline: 0
        }

        #outline a:hover {
            color: #0cf
        }

        #page-container {
            background-color: #9e9e9e;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWU5ZTllIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=");
            -webkit-transition: left 500ms;
            transition: left 500ms
        }

        .pf {
            margin: 13px auto;
            box-shadow: 1px 1px 3px 1px #333;
            border-collapse: separate
        }

        .pc.opened {
            -webkit-animation: fadein 100ms;
            animation: fadein 100ms
        }

        .loading-indicator.active {
            -webkit-animation: swing 1.5s ease-in-out .01s infinite alternate none;
            animation: swing 1.5s ease-in-out .01s infinite alternate none
        }

        .checked {
            background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goQDSYgDiGofgAAAslJREFUOMvtlM9LFGEYx7/vvOPM6ywuuyPFihWFBUsdNnA6KLIh+QPx4KWExULdHQ/9A9EfUodYmATDYg/iRewQzklFWxcEBcGgEplDkDtI6sw4PzrIbrOuedBb9MALD7zv+3m+z4/3Bf7bZS2bzQIAcrmcMDExcTeXy10DAFVVAQDksgFUVZ1ljD3yfd+0LOuFpmnvVVW9GHhkZAQcxwkNDQ2FSCQyRMgJxnVdy7KstKZpn7nwha6urqqfTqfPBAJAuVymlNLXoigOhfd5nmeiKL5TVTV+lmIKwAOA7u5u6Lped2BsbOwjY6yf4zgQQkAIAcedaPR9H67r3uYBQFEUFItFtLe332lpaVkUBOHK3t5eRtf1DwAwODiIubk5DA8PM8bYW1EU+wEgCIJqsCAIQAiB7/u253k2BQDDMJBKpa4mEon5eDx+UxAESJL0uK2t7XosFlvSdf0QAEmlUnlRFJ9Waho2Qghc1/U9z3uWz+eX+Wr+lL6SZfleEAQIggA8z6OpqSknimIvYyybSCReMsZ6TislhCAIAti2Dc/zejVNWwCAavN8339j27YbTg0AGGM3WltbP4WhlRWq6Q/btrs1TVsYHx+vNgqKoqBUKn2NRqPFxsbGJzzP05puUlpt0ukyOI6z7zjOwNTU1OLo6CgmJyf/gA3DgKIoWF1d/cIY24/FYgOU0pp0z/Ityzo8Pj5OTk9PbwHA+vp6zWghDC+VSiuRSOQgGo32UErJ38CO42wdHR09LBQK3zKZDDY2NupmFmF4R0cHVlZWlmRZ/iVJUn9FeWWcCCE4ODjYtG27Z2Zm5juAOmgdGAB2d3cBADs7O8uSJN2SZfl+WKlpmpumaT6Yn58vn/fs6XmbhmHMNjc3tzDGFI7jYJrm5vb29sDa2trPC/9aiqJUy5pOp4f6+vqeJ5PJBAB0dnZe/t8NBajx/z37Df5OGX8d13xzAAAAAElFTkSuQmCC)
        }
    }

    .ff0 {
        font-family: sans-serif;
        visibility: hidden;
    }

    @font-face {
        font-family: ff1;
        src: url(f1.woff)format("woff");
    }

    .ff1 {
        font-family: ff1;
        line-height: 0.866699;
        font-style: normal;
        font-weight: normal;
        visibility: visible;
    }

    @font-face {
        font-family: ff2;
        src: url(f2.woff)format("woff");
    }

    .ff2 {
        font-family: ff2;
        line-height: 0.824707;
        font-style: normal;
        font-weight: normal;
        visibility: visible;
    }

    .m0 {
        transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
        -ms-transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
        -webkit-transform: matrix(0.250000, 0.000000, 0.000000, 0.250000, 0, 0);
    }

    .v0 {
        vertical-align: 0.000000px;
    }

    .ls0 {
        letter-spacing: 0.000000px;
    }

    .sc_ {
        text-shadow: none;
    }

    .sc0 {
        text-shadow: -0.015em 0 transparent, 0 0.015em transparent, 0.015em 0 transparent, 0 -0.015em transparent;
    }

    @media screen and (-webkit-min-device-pixel-ratio:0) {
        .sc_ {
            -webkit-text-stroke: 0px transparent;
        }

        .sc0 {
            -webkit-text-stroke: 0.015em transparent;
            text-shadow: none;
        }
    }

    .ws0 {
        word-spacing: 0.000000px;
    }

    ._1 {
        width: 27.504000px;
    }

    ._3 {
        width: 52.716038px;
    }

    ._0 {
        width: 98.556000px;
    }

    ._2 {
        width: 107.723962px;
    }

    .fc1 {
        color: rgb(0, 0, 0);
    }

    .fc0 {
        color: rgb(0, 0, 63);
    }

    .fs3 {
        font-size: 24.832000px;
    }

    .fs1 {
        font-size: 26.740000px;
    }

    .fs0 {
        font-size: 30.560000px;
    }

    .fs4 {
        font-size: 34.380000px;
    }

    .fs2 {
        font-size: 36.288000px;
    }

    .fs5 {
        font-size: 38.200000px;
    }

    .y3a {
        bottom: 2.860000px;
    }

    .y36 {
        bottom: 3.140000px;
    }

    .y5 {
        bottom: 3.560000px;
    }

    .y10 {
        bottom: 3.620000px;
    }

    .y2 {
        bottom: 3.640000px;
    }

    .y3 {
        bottom: 3.890000px;
    }

    .y34 {
        bottom: 5.720000px;
    }

    .y6 {
        bottom: 5.950000px;
    }

    .y3e {
        bottom: 5.960000px;
    }

    .yc {
        bottom: 6.000000px;
    }

    .y8 {
        bottom: 6.010000px;
    }

    .y38 {
        bottom: 6.220000px;
    }

    .y3c {
        bottom: 6.470000px;
    }

    .y0 {
        bottom: 204.000000px;
    }

    .y3d {
        bottom: 204.240000px;
    }

    .y3f {
        bottom: 221.240000px;
    }

    .y3b {
        bottom: 238.250000px;
    }

    .y39 {
        bottom: 255.260000px;
    }

    .y37 {
        bottom: 272.270000px;
    }

    .y35 {
        bottom: 289.280000px;
    }

    .y33 {
        bottom: 299.910000px;
    }

    .y32 {
        bottom: 311.640000px;
    }

    .y31 {
        bottom: 323.660000px;
    }

    .y30 {
        bottom: 335.680000px;
    }

    .y2f {
        bottom: 347.730000px;
    }

    .y2e {
        bottom: 359.740000px;
    }

    .y2d {
        bottom: 371.760000px;
    }

    .y2c {
        bottom: 383.780000px;
    }

    .y2b {
        bottom: 395.800000px;
    }

    .y2a {
        bottom: 407.850000px;
    }

    .y29 {
        bottom: 419.870000px;
    }

    .y28 {
        bottom: 431.890000px;
    }

    .y27 {
        bottom: 443.910000px;
    }

    .y26 {
        bottom: 455.920000px;
    }

    .y25 {
        bottom: 467.940000px;
    }

    .y24 {
        bottom: 479.990000px;
    }

    .y23 {
        bottom: 492.010000px;
    }

    .y22 {
        bottom: 504.030000px;
    }

    .y21 {
        bottom: 516.670000px;
    }

    .y20 {
        bottom: 528.630000px;
    }

    .y1f {
        bottom: 540.650000px;
    }

    .y1e {
        bottom: 552.670000px;
    }

    .y1d {
        bottom: 564.720000px;
    }

    .y1c {
        bottom: 576.740000px;
    }

    .y1b {
        bottom: 588.760000px;
    }

    .y1a {
        bottom: 600.770000px;
    }

    .y19 {
        bottom: 612.790000px;
    }

    .y18 {
        bottom: 624.810000px;
    }

    .y17 {
        bottom: 636.860000px;
    }

    .y16 {
        bottom: 648.880000px;
    }

    .y15 {
        bottom: 660.900000px;
    }

    .y14 {
        bottom: 672.920000px;
    }

    .y13 {
        bottom: 684.940000px;
    }

    .y12 {
        bottom: 696.980000px;
    }

    .y11 {
        bottom: 709.000000px;
    }

    .yf {
        bottom: 721.020000px;
    }

    .ye {
        bottom: 733.040000px;
    }

    .yd {
        bottom: 745.060000px;
    }

    .yb {
        bottom: 757.080000px;
    }

    .ya {
        bottom: 769.120000px;
    }

    .y9 {
        bottom: 781.140000px;
    }

    .y7 {
        bottom: 793.160000px;
    }

    .y4 {
        bottom: 804.560000px;
    }

    .y1 {
        bottom: 816.520000px;
    }

    .h2 {
        height: 11.340000px;
    }

    .h9 {
        height: 11.740000px;
    }

    .h5 {
        height: 11.960000px;
    }

    .h8 {
        height: 12.020000px;
    }

    .hb {
        height: 17.010000px;
    }

    .h7 {
        height: 17.532750px;
    }

    .hd {
        height: 18.135674px;
    }

    .h4 {
        height: 18.879902px;
    }

    .ha {
        height: 20.726484px;
    }

    .h3 {
        height: 21.577031px;
    }

    .hc {
        height: 24.274160px;
    }

    .h6 {
        height: 25.621313px;
    }

    .he {
        height: 26.971289px;
    }

    .h1 {
        height: 624.500000px;
    }

    .h0 {
        height: 841.890000px;
    }

    .w8 {
        width: 127.560000px;
    }

    .w4 {
        width: 130.390000px;
    }

    .w3 {
        width: 141.730000px;
    }

    .w6 {
        width: 144.430000px;
    }

    .w7 {
        width: 144.940000px;
    }

    .w5 {
        width: 145.450000px;
    }

    .w2 {
        width: 147.400000px;
    }

    .wa {
        width: 195.590000px;
    }

    .wb {
        width: 204.090000px;
    }

    .w9 {
        width: 209.760000px;
    }

    .w1 {
        width: 568.000000px;
    }

    .w0 {
        width: 595.280000px;
    }

    .x1 {
        left: 0.850000px;
    }

    .x0 {
        left: 13.500000px;
    }

    .x8 {
        left: 150.090000px;
    }

    .x5 {
        left: 159.480000px;
    }

    .x2 {
        left: 161.430000px;
    }

    .x7 {
        left: 246.470000px;
    }

    .x9 {
        left: 291.830000px;
    }

    .x3 {
        left: 303.170000px;
    }

    .xa {
        left: 444.900000px;
    }

    .x6 {
        left: 448.840000px;
    }

    .x4 {
        left: 450.570000px;
    }

    @media print {
        .v0 {
            vertical-align: 0.000000pt;
        }

        .ls0 {
            letter-spacing: 0.000000pt;
        }

        .ws0 {
            word-spacing: 0.000000pt;
        }

        ._1 {
            width: 36.672000pt;
        }

        ._3 {
            width: 70.288051pt;
        }

        ._0 {
            width: 131.408000pt;
        }

        ._2 {
            width: 143.631949pt;
        }

        .fs3 {
            font-size: 33.109333pt;
        }

        .fs1 {
            font-size: 35.653333pt;
        }

        .fs0 {
            font-size: 40.746667pt;
        }

        .fs4 {
            font-size: 45.840000pt;
        }

        .fs2 {
            font-size: 48.384000pt;
        }

        .fs5 {
            font-size: 50.933333pt;
        }

        .y3a {
            bottom: 3.813333pt;
        }

        .y36 {
            bottom: 4.186667pt;
        }

        .y5 {
            bottom: 4.746667pt;
        }

        .y10 {
            bottom: 4.826667pt;
        }

        .y2 {
            bottom: 4.853333pt;
        }

        .y3 {
            bottom: 5.186667pt;
        }

        .y34 {
            bottom: 7.626667pt;
        }

        .y6 {
            bottom: 7.933333pt;
        }

        .y3e {
            bottom: 7.946667pt;
        }

        .yc {
            bottom: 8.000000pt;
        }

        .y8 {
            bottom: 8.013333pt;
        }

        .y38 {
            bottom: 8.293333pt;
        }

        .y3c {
            bottom: 8.626667pt;
        }

        .y0 {
            bottom: 272.000000pt;
        }

        .y3d {
            bottom: 272.320000pt;
        }

        .y3f {
            bottom: 294.986667pt;
        }

        .y3b {
            bottom: 317.666667pt;
        }

        .y39 {
            bottom: 340.346667pt;
        }

        .y37 {
            bottom: 363.026667pt;
        }

        .y35 {
            bottom: 385.706667pt;
        }

        .y33 {
            bottom: 399.880000pt;
        }

        .y32 {
            bottom: 415.520000pt;
        }

        .y31 {
            bottom: 431.546667pt;
        }

        .y30 {
            bottom: 447.573333pt;
        }

        .y2f {
            bottom: 463.640000pt;
        }

        .y2e {
            bottom: 479.653333pt;
        }

        .y2d {
            bottom: 495.680000pt;
        }

        .y2c {
            bottom: 511.706667pt;
        }

        .y2b {
            bottom: 527.733333pt;
        }

        .y2a {
            bottom: 543.800000pt;
        }

        .y29 {
            bottom: 559.826667pt;
        }

        .y28 {
            bottom: 575.853333pt;
        }

        .y27 {
            bottom: 591.880000pt;
        }

        .y26 {
            bottom: 607.893333pt;
        }

        .y25 {
            bottom: 623.920000pt;
        }

        .y24 {
            bottom: 639.986667pt;
        }

        .y23 {
            bottom: 656.013333pt;
        }

        .y22 {
            bottom: 672.040000pt;
        }

        .y21 {
            bottom: 688.893333pt;
        }

        .y20 {
            bottom: 704.840000pt;
        }

        .y1f {
            bottom: 720.866667pt;
        }

        .y1e {
            bottom: 736.893333pt;
        }

        .y1d {
            bottom: 752.960000pt;
        }

        .y1c {
            bottom: 768.986667pt;
        }

        .y1b {
            bottom: 785.013333pt;
        }

        .y1a {
            bottom: 801.026667pt;
        }

        .y19 {
            bottom: 817.053333pt;
        }

        .y18 {
            bottom: 833.080000pt;
        }

        .y17 {
            bottom: 849.146667pt;
        }

        .y16 {
            bottom: 865.173333pt;
        }

        .y15 {
            bottom: 881.200000pt;
        }

        .y14 {
            bottom: 897.226667pt;
        }

        .y13 {
            bottom: 913.253333pt;
        }

        .y12 {
            bottom: 929.306667pt;
        }

        .y11 {
            bottom: 945.333333pt;
        }

        .yf {
            bottom: 961.360000pt;
        }

        .ye {
            bottom: 977.386667pt;
        }

        .yd {
            bottom: 993.413333pt;
        }

        .yb {
            bottom: 1009.440000pt;
        }

        .ya {
            bottom: 1025.493333pt;
        }

        .y9 {
            bottom: 1041.520000pt;
        }

        .y7 {
            bottom: 1057.546667pt;
        }

        .y4 {
            bottom: 1072.746667pt;
        }

        .y1 {
            bottom: 1088.693333pt;
        }

        .h2 {
            height: 15.120000pt;
        }

        .h9 {
            height: 15.653333pt;
        }

        .h5 {
            height: 15.946667pt;
        }

        .h8 {
            height: 16.026667pt;
        }

        .hb {
            height: 22.680000pt;
        }

        .h7 {
            height: 23.377000pt;
        }

        .hd {
            height: 24.180898pt;
        }

        .h4 {
            height: 25.173203pt;
        }

        .ha {
            height: 27.635312pt;
        }

        .h3 {
            height: 28.769375pt;
        }

        .hc {
            height: 32.365547pt;
        }

        .h6 {
            height: 34.161750pt;
        }

        .he {
            height: 35.961719pt;
        }

        .h1 {
            height: 832.666667pt;
        }

        .h0 {
            height: 1122.520000pt;
        }

        .w8 {
            width: 170.080000pt;
        }

        .w4 {
            width: 173.853333pt;
        }

        .w3 {
            width: 188.973333pt;
        }

        .w6 {
            width: 192.573333pt;
        }

        .w7 {
            width: 193.253333pt;
        }

        .w5 {
            width: 193.933333pt;
        }

        .w2 {
            width: 196.533333pt;
        }

        .wa {
            width: 260.786667pt;
        }

        .wb {
            width: 272.120000pt;
        }

        .w9 {
            width: 279.680000pt;
        }

        .w1 {
            width: 757.333333pt;
        }

        .w0 {
            width: 793.706667pt;
        }

        .x1 {
            left: 1.133333pt;
        }

        .x0 {
            left: 18.000000pt;
        }

        .x8 {
            left: 200.120000pt;
        }

        .x5 {
            left: 212.640000pt;
        }

        .x2 {
            left: 215.240000pt;
        }

        .x7 {
            left: 328.626667pt;
        }

        .x9 {
            left: 389.106667pt;
        }

        .x3 {
            left: 404.226667pt;
        }

        .xa {
            left: 593.200000pt;
        }

        .x6 {
            left: 598.453333pt;
        }

        .x4 {
            left: 600.760000pt;
        }
    }
</style>
<script>
printdetails(){
  win.print();
}
    (function () {
        function b(a, b, e, f) {
            var c = (a.className || "").split(/\s+/g);
            "" === c[0] && c.shift();
            var d = c.indexOf(b);
            0 > d && e && c.push(b);
            0 <= d && f && c.splice(d, 1);
            a.className = c.join(" ");
            return 0 <= d
        }
        if (!("classList" in document.createElement("div"))) {
            var e = {
                add: function (a) {
                    b(this.element, a, !0, !1)
                },
                contains: function (a) {
                    return b(this.element, a, !1, !1)
                },
                remove: function (a) {
                    b(this.element, a, !1, !0)
                },
                toggle: function (a) {
                    b(this.element, a, !0, !0)
                }
            };
            Object.defineProperty(HTMLElement.prototype, "classList", {
                get: function () {
                    if (this._classList) return this._classList;
                    var a = Object.create(e, {
                        element: {
                            value: this,
                            writable: !1,
                            enumerable: !0
                        }
                    });
                    Object.defineProperty(this, "_classList", {
                        value: a,
                        writable: !1,
                        enumerable: !1
                    });
                    return a
                },
                enumerable: !0
            })
        }
    })();
</script>
`;
            win.document.body.innerHTML =
                `<body>
        <center>
        </center>
        <br>` +
                divElements +
                `
      </body>`;
            // win.print();
            // win.close();
            this.modal.close('Close click');

        })
    }

}
