import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-sketchpad-modal',
  templateUrl: './sketchpad-modal.component.html',
  styleUrls: ['./sketchpad-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SketchpadModalComponent implements OnInit {
  @Input() imageUrl: any;
  @Input() imageName: any;
  @Input() ComponentName;
  @Input() rowdata;
  @Output() OnSign  = new EventEmitter();
  constructor(private activeModal: NgbActiveModal,
    ) { }
    
  ngOnInit() {
    console.log(this.imageUrl,this.ComponentName,this.rowdata)
  }

  sendsign(){
    this.OnSign.emit()
  }
  emitSign(){
    this.OnSign.emit(true)
  }
  SaveIma(data){
    console.log("value of data is",data);
  }

}
