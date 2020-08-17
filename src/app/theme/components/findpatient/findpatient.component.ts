import { Component, ViewEncapsulation, ViewChild, HostListener, Input, ElementRef } from '@angular/core';
import { ModelviewComponent } from '../../components/modelview/modelview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from '../../../services/navbar.service';

declare var $: any;

@Component({
  selector: 'app-findpatient',
  templateUrl: './findpatient.component.html',
  styleUrls: ['./findpatient.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FindpatientComponent{
  @Input() position: number = 400;

  @ViewChild('findPatient') private _selector: ElementRef;
  @ViewChild('lgModal') private _poup: ElementRef;
   public data:any = [];
  constructor(
    private modalService: NgbModal, private nav: NavbarService) {
  }

  ngAfterViewInit() {

  }

  @HostListener('click')
  _onClick(): any {
    // $("#lgModal").modal('show')
    const modalRef = this.modalService.open(ModelviewComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
    modalRef.componentInstance.openPopUp = true;
  }

}
