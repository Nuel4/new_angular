import { Component, Input, OnInit, ComponentFactoryResolver, Output, EventEmitter } from '@angular/core';
import { DynamicComponentService } from './dynamic-component.service';
// import { EventEmitter } from 'events';
// import { GridsterComponent } from 'angular-gridster2';

@Component({
    selector: 'app-dashboard-widget',
    template: `<ndc-dynamic [ndcDynamicComponent]='component' [ndcDynamicInputs]="wData" [ndcDynamicOutputs]="outputs"></ndc-dynamic>`,
})
export class DashboardWidgetComponent implements OnInit {
    component: any;
    @Input() item: any;
    @Output() NBModaldata = new EventEmitter<any>();
    NBMV: any;
    wData: any;
    outputs = {
        onSomething: (type) => this.changedData(type),
        NBModalvisibility: (NBMV) => this.valueexported(NBMV),
    }
    constructor(private _componentFactoryResolver: ComponentFactoryResolver, private dynamicComponentService: DynamicComponentService) {

    }

    ngOnInit() {
        this.renderComponents();
    }

    changedData(type) {
        this.item = {
            cols: 2, rows: 2, y: 4, x: 4,
            // componentName: 'VAllAppointmentsComponent', componentHeader: 'Appointments' 
        };
    }
    valueexported(NBMV) {
        this.NBMV = NBMV;
        this.NBModaldata.emit(this.NBMV);
    }

    renderComponents() {
        this.wData = { 'wData': JSON.stringify(this.item) }
        this.component = this.dynamicComponentService.getComponent(this.item.componentName);
    }
}
