import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'app-style-guide',
    templateUrl: './style-guide.component.html',
    styles: ['.style-guide{border:1px solid #ededed;} .style-guide thead td{background:#f7f7f7;} .style-guide pre{ white-space: nowrap; } ' +
    '.fs1 .pbs{font-size: 24px;}' +
    '.fs1{padding-bottom: 14px; border-bottom: 1px solid #ededed; margin-bottom: 5px;} .fs1 p{margin-top:8px;}']
})
export class StyleGuideComponent implements OnInit {

    cities: any = [];
    selectedCity: any ;
    maskVal = 12345678
    checked: boolean;
    constructor(
    ) {
        this.checked = false;
     }

    ngOnInit() {
        this.cities = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];
    }

}
