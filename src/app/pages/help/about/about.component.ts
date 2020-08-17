import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../../../services/help/help.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CptDisclaimerComponent } from '../../login/cpt-disclaimer/cpt-disclaimer.component';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent implements OnInit {
  practiceLicense: any;
  constructor(private route: Router,private modalService: NgbModal, private modal: NgbActiveModal,private helpService: HelpService) { }

  ngOnInit() {
    this.getPractice()
  }
  onSubmit(){
    this.route.navigate(['/pages/workspace'],{skipLocationChange:true});
  }
  getPractice(){
    this.helpService.getPracticeLicense().subscribe(res =>{
      this.practiceLicense=res;
    })
  }
  eulaPopup(){
    const modRef = this.modalService.open(CptDisclaimerComponent,{ windowClass: "modelStyle",size:'lg' });
    modRef.componentInstance.newUser = true;
    modRef.componentInstance.about =  true;
  }
}
