import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {DropdownModule} from 'primeng/dropdown';

@Component({
    selector: 'app-widget-header',
    template: `
	<header class='widget-header d-flex justify-content-between'>
	    <h5 class="mb-0">
		    <span style="font-size:17px;font-weight:bold;vertical-align:bottom;padding-left:9px;font-family:'Muli',sans-serif !important;">{{widgetData.componentHeader}}</span>
        </h5>
        <ng-container *ngIf="widgetData.componentHeader === 'Orders'">
        <p-dropdown [options]="itemStatus" [(ngModel)]="selectedItem" optionLabel="label" (onChange)="itemChange(selectedItem)" [autoWidth]="false" [showClear]="true"></p-dropdown>
        <p-dropdown [options]="resultStatus" [(ngModel)]="selectedStatus" optionLabel="label" (onChange)="statusChange(selectedStatus)" [autoWidth]="false" [showClear]="true"></p-dropdown>
        <p-dropdown [options]="testResult" [(ngModel)]="selectedTest" optionLabel="label" (onChange)="testChange(selectedTest)" [autoWidth]="false" [showClear]="true"></p-dropdown>         
        </ng-container>
        <button pButton class="yeats-btn yeats-btn-secondary ui-button-secondary mt-1" *ngIf="widgetData.componentName === 'ImmunizationsComponent'" >Print schedule</button>
        <button pButton class="yeats-btn yeats-btn-secondary ui-button-secondary mt-1" *ngIf="widgetData.componentHeader === 'Medications'" (click)="getMedication()">Past</button>
         <button pButton class="yeats-btn yeats-btn-secondary ui-button-secondary mt-1" style="margin-right:8rem" *ngIf="widgetData.componentHeader === 'Medications'" (click)="openMedicationList()">Compare</button>
        <div>
  <div class="gridster-item-content">

        <i class="fa fa-refresh pull-right" style="padding:10px; cursor: pointer"(click)="refresh()" aria-hidden="true"></i>
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
    @Output() getMedicationlist: EventEmitter<string> = new EventEmitter<string>();
    @Output() compareMedicationList: EventEmitter<string> = new EventEmitter<string>();
    @Output() OnItemChange = new EventEmitter<string>();
    @Output() OnStatusChange = new EventEmitter<string>();
    @Output() OnTestChange = new EventEmitter<string>();
    // <span class="fa fa-upload  h6 mb-0 ml-1" (click)="refresh()"></span>
    private alerts: boolean;
    private results: any;
    selectedItem: any;
    selectedStatus: any;
    selectedTest: any;
    itemStatus = [
        {label: 'All', value: 1},
        {label: 'Incomplete', value: 2},
        {label: 'Complete', value: 3},
        {label: 'Cancelled', value: 4},
      ]
      resultStatus = [
        {label: 'All', value: 1},
        {label: 'Requested', value: 2},
        {label: 'In-progress', value: 3},
        {label: 'Final', value: 4},
        {label: 'Cancelled', value: 5}
      ]
      testResult = [
        {label: 'All', value: 1},
        {label: 'Abnormal', value: 2},
        {label: 'Normal', value: 3}
      ]
    constructor() {
    }

    ngOnInit() {
        console.log('data',this.widgetData)
    }
 

    refresh() {
        this.refreshWidget.emit();
    }

    getMedication() {
        this.getMedicationlist.emit();
    }

    openMedicationList(){
        this.compareMedicationList.emit();
    }
    itemChange(data){
        // console.log("Item change",data)
        this.OnItemChange.emit(data)
      }
      statusChange(data){
        // console.log("status change",data)
      this.OnStatusChange.emit(data)
      }
      testChange(data){
        // console.log("test change",data)
        this.OnTestChange.emit(data)
      }
}
