import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GoogleMapsComponent {
  lat: 45.421530;
  lng = -75.697193;
  zoom = 7;
}
