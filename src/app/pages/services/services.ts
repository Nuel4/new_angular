import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Broadcaster } from '../../broadcast/broadcaster';


@Injectable()
export class Services {

  constructor(private broadcaster: Broadcaster) {

  }
     senPatient() {
       this.broadcaster.broadcast('MyEvent', 'some message');
     }

}
