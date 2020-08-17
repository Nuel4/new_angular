import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationStore } from './../../../../../authentication/authentication-store';
import { ProgressnoteService } from './../../../../../services/chart/progressnote.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-prevous-res',
  templateUrl: './view-prevous-res.component.html',
  styleUrls: ['./view-prevous-res.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewPrevousResComponent implements OnInit {

  previousRes: any;
  constructor(
    private route: ActivatedRoute,
    private authStore: AuthenticationStore,
    private modalService: NgbModal,
    private progressNoteService: ProgressnoteService
    ) { }

  ngOnInit() {
    this.GetPreviousPatientEducationResources()
  }
  GetPreviousPatientEducationResources(){
    let param ={
      patientEncounterId: ''
    }
    this.progressNoteService.GetPreviousPatientEducationResources(param).subscribe(resp=>{
      this.previousRes = resp
    })
  }

}