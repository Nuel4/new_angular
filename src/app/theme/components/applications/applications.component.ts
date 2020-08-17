import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-applications',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./applications.component.scss'],
    templateUrl: './applications.component.html'
})
export class ApplicationsComponent implements OnInit {

    constructor(private router: Router) {}

    ngOnInit() {

    }

  goWaitingRoom() {
    this.router.navigate(['waitingroom']);
  }

  gopatientAction() {
    console.log('let go to patient action')
    this.router.navigate(['patientaction']);
  }


}
