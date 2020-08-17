import { Injectable } from '@angular/core';
import { VAllAppointmentsComponent } from './v-all-appointments/v-all-appointments.component';
import { UserscheduleComponent } from './userschedule/userschedule.component';
import { NoticeboardComponent } from './noticeboard/noticeboard.component';
import { AlertsComponent } from './alerts/alerts.component';
import { MypostsComponent } from './myposts/myposts.component';
import { CalendarComponent } from './calendar/calendar.component';

@Injectable()
// register your component
export class DynamicComponentService {
    getComponent(componentName: string) {
        if (componentName === 'CalendarComponent') {
            return CalendarComponent
        }
         else if (componentName === 'NoticeboardComponent') {
            return NoticeboardComponent
        }
        else if (componentName === 'AlertsComponent') {
            return AlertsComponent
        }
        else if (componentName === 'MypostsComponent') {
            return MypostsComponent
        }
    }
}
