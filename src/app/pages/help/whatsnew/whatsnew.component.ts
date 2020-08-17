import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-whatsnew',
  templateUrl: './whatsnew.component.html',
  styleUrls: ['./whatsnew.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhatsnewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  onSubmit(){
    this.router.navigate(['/pages/workspace'], { skipLocationChange: true })
  }
}
