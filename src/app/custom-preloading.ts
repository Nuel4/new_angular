import { Observable } from 'rxjs/Observable';
import { PreloadingStrategy, Route } from '@angular/router';
import { of } from 'rxjs';
export class CustomPreloading implements PreloadingStrategy {
  preload(route: Route, preload: Function): Observable<any> {
    if (route.data && route.data.preload) {
        // console.log("Router ", route)

        console.log("Router True", route)
      return preload();
    } else {
        console.log("Router false", route)
      return of(null);
    }
  }
}