import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-refresh',
  templateUrl: './refresh.component.html',
  styleUrls: ['./refresh.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RefreshComponent implements OnInit {

  urlToChange: any;
  constructor(private router: Router,
    private activeroute: ActivatedRoute) { 
    this.activeroute.params.subscribe(params => {
      this.urlToChange = params.p1
    });
  }

  ngOnInit() {
    this.changePage();
    console.log('new url in refresh',this.urlToChange)
  }
  changePage() {
    this.router.navigate([this.urlToChange]);
  }
}
