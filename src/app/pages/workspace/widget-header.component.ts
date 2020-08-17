import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-widget-header',
    template: `
	<header class='widget-header d-flex justify-content-between'>
	    <h5 class="mb-0">
		    <span style="font-size:16px;font-weight:bold;vertical-align:bottom;padding-left:9px;font-family:'Muli',sans-serif;">{{widgetData.componentHeader}}</span>
        </h5>
        <div>
  <div class="gridster-item-content">

        <i class="fa fa-refresh pull-right" style="padding:10px;"(click)="refresh()" aria-hidden="true"></i>
       
       </div>
        </div>
	</header>
    `,
    styles: [`
        .widget-header {
            height:32px;
            background:#104886;
            color:#FFFFFF;
        }
        `
    ]
})
export class WidgetHeaderComponent implements OnInit {
    @Input() widgetData: any;
    @Output() refreshWidget: EventEmitter<string> = new EventEmitter<string>();
    // <span class="fa fa-upload  h6 mb-0 ml-1" (click)="refresh()"></span>
    private alerts: boolean;
    private results: any;
    constructor() {
    }

    ngOnInit() {

        if (this.widgetData.componentHeader === "Alerts") {
            this.alerts = true;
        }
    }


    refresh() {
        this.refreshWidget.emit();
    }
}
