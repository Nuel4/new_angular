import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CalendarModule} from 'primeng/calendar';
import {InputMaskModule} from 'primeng/inputmask';

import {
    StyleGuideComponent,
} from './style-guide.component';
import { DropdownModule, CheckboxModule } from 'primeng/primeng';


export const routes = [
    { path: '', component: StyleGuideComponent, pathMatch: 'full' },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CalendarModule,
        DropdownModule,
        InputMaskModule,
        CheckboxModule
    ],
    declarations: [
        StyleGuideComponent
    ],
    entryComponents: [
        StyleGuideComponent
    ],
    providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StyleGuideModule { }
