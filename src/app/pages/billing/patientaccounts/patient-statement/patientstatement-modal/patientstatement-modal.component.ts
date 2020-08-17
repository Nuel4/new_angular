import { Component, OnInit, ViewEncapsulation,Input,Output,EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-patientstatement-modal',
  templateUrl: './patientstatement-modal.component.html',
  styleUrls: ['./patientstatement-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientstatementModalComponent implements OnInit {
@Input() artypes;
@Input() InsuranceCategoryNameList;
@Input() insuraceProviderList;
@Input() InsuranceProvider;
@Input() physician;
@Input() physicianList;
@Input() printStatement;
@Output() loadEvent: EventEmitter<any> = new EventEmitter();
sourceCars: any = [];
selectedArtypes: any = [];
selectedInsuranceProvider: any = [];
selectedPhysician: any = [];
insuranceCategoryName: any = {};
lastPatientaDate: any;
patientBalance: any;
dataRange: any;
paymants: any;
date: boolean = false;
  constructor(private modal: NgbActiveModal,private toaster: ToastrService) { }

  ngOnInit() {
    
  }
  onSelect(){
    this.loadEvent.emit(this.selectedArtypes);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
  selectInsuranceProvider(){
    this.loadEvent.emit(this.selectedInsuranceProvider);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
  getselectedPhysician(){
    this.loadEvent.emit(this.selectedPhysician);
    this.modal.dismiss('Cross click');
    this.modal.close('Close click');
  }
  selectedButton(){
    alert()
    this.date = true;
  }
}
