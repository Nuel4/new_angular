import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { PatientManagementComponent } from './patient-management.component';
import { element } from '@angular/core/src/render3/instructions';

describe('PatientManagementComponent', () => {
    let comp: PatientManagementComponent;
    let fixture: ComponentFixture<PatientManagementComponent>
    let de: DebugElement
    let el: HTMLElement

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PatientManagementComponent
            ],
            imports: [
                BrowserModule
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PatientManagementComponent);

            comp = fixture.componentInstance

            de = fixture.debugElement.query(By.css('form'));
            el = de.nativeElement;
        })
    }))

    it('check patient management page', aysnc(() => {
        element(by.buttonText('Add New Patient')).click()
    }))
})

