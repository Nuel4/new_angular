import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { PaymentsService } from '../../../../services/billing/payments.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DeleteModalComponent implements OnInit {
  @Input() insuranceData;
  @Input() paymentData;
  @Input() writeOff;
  @Output() loadEvent: EventEmitter<any> = new EventEmitter()
@Input() openDeleteModal;
@Input() openReversalModal;
@Input() ReverseAmount;
@Input() changeReversalAmt;
@Input() reversalId;
  deletedInsurance: any;
  deletedPayments: any;
  userDetails: any;
  isPartialReversal: boolean = false;
  reversalReason: any;
  ReversedPayment: any;
  Index: number;
  constructor(private modal: NgbActiveModal,
    private paymentservice: PaymentsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
  }


  deleteInsurance() {
    if (this.insuranceData) {
      let param = {
        InsurancePaymentId: this.insuranceData.InsurancePaymentId,
      }

      this.paymentservice.deleteInsurancePayments(param).subscribe((results: any) => {
        this.deletedInsurance = results;
        console.log("deleted Insurance:", this.deletedInsurance)
        this.loadEvent.emit(true);
        this.modal.close('Close click')
        this.showSuccess("Insurance Deleted Successfully")

      })
    }

    else if (this.paymentData) {
      console.log("selected row for delete:", this.paymentData)
      let param = {
        PatientPaymentId: this.paymentData.PatientPaymentId,
      }

      this.paymentservice.deletePatientPayments(param).subscribe((results: any) => {
        this.deletedPayments = results;
        switch (this.deletedPayments.Value) {
          case "Success":
            console.log("deleted Payments:", this.deletedPayments)
            this.loadEvent.emit(true);
            this.modal.close('Close click')
            this.showSuccess("Patient payments Deleted Successfully")
            break;
          case "Referenced":
              this.modal.close('Close click')
            this.toastr.error("Patient Payment is already in use cannot be deleted.", "Error:")
            break;
          case "Failed":
              this.modal.close('Close click')
            this.toastr.error("Something went wrong could'nt able to delete.", "Error:")
            break;
        }
      })
    }
  }

 

  ValidateAmt(){
    if(this.changeReversalAmt <=0 && this.ReverseAmount >0 ){
      this.toastr.error("Please enter a value greater than 0");
    }
    else if(this.ReverseAmount == 0 && this.changeReversalAmt<0){
      this.toastr.error("Please enter 0 as maximum reversible amount is 0");
    }
    else if(this.changeReversalAmt > this.ReverseAmount ){
      this.toastr.error("Reversal amount entered cannot exceed the maximum reversible amount");
    }
    else if(this.ReverseAmount >= this.changeReversalAmt ){
      this.isPartialReversal = true;
    }
   }

   getReversedPayment(){
    this.userDetails = JSON.parse(sessionStorage.getItem("UserDetail"))
    let param = {
      paymentTransactionId: this.reversalId,
      userId:this.userDetails.UserId,
      reversalAmount:this.ReverseAmount,
      isPartialReversal:this.isPartialReversal,
      reversalMessage:this.reversalReason,
    }
    this.paymentservice.getReversePayment(param).subscribe((results : any) => {
      this.ReversedPayment = results;
      console.log("reversed payment amount:",this.ReversedPayment )
      this.loadEvent.emit(true);
      this.modal.close('Close click')
      this.toastr.success("Amount Reversed Successfully");
      
      
    })
  }

  showSuccess(msg: string) {
    this.toastr.success(msg);
  }

}
