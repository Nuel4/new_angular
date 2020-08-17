import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waitingroom',
  templateUrl: './waitingroom.component.html',
  styleUrls: ['./waitingroom.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WaitingroomComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  reset() {
    this.router.navigate(['pages']);
  }
}
