import { Injectable } from '@angular/core';
import { PatientEducationComponent } from './patient-education/patient-education.component';
import { MedicationsComponent } from './medications/medications.component';
import { AddAllergyComponent } from './add-allergy/add-allergy.component';
import { AddPmhComponent } from './add-pmh/add-pmh.component';
import { AddProblemsComponent } from './add-problems/add-problems.component';
import { ProgressnoteComponent } from './progressnote/progressnote.component';
import { ProblemListComponent } from './problem-list/problem-list.component';
import { PastMedicalHistoryComponent } from './past-medical-history/past-medical-history.component';
import { AllergiesComponent } from './allergies/allergies.component';
import { ImmunizationsComponent } from './immunizations/immunizations.component';
import { LabsComponent } from './labs/labs.component';
// import { VitalsComponent } from './graphs/vitals/vitals.component';
import { VitalWidgetComponent } from './vital-widget/vital-widget.component';

@Injectable()
export class DynamicComponentService {
    getComponent(componentName: string) {
        if (componentName === 'PatientEducationComponent') {
            return PatientEducationComponent
        }
         else if (componentName === 'MedicationsComponent') {
            return MedicationsComponent
        }
        else if (componentName === 'AllergiesComponent') {
            return AllergiesComponent
        }
        // else if (componentName === 'PastMedicalHistoryComponent') {
        //     return PastMedicalHistoryComponent
        // }
        else if (componentName === 'ProblemListComponent') {
            return ProblemListComponent
        }
        // else if (componentName === 'ImmunizationsComponent') {
        //     return ImmunizationsComponent
        // }
        else if (componentName === 'ProgressnoteComponent') {
            return ProgressnoteComponent
        }
        
        // else if (componentName === 'LabsComponent') {
        //     return LabsComponent
        // }
        else if (componentName === 'VitalWidgetComponent') {
            return VitalWidgetComponent
        }
    }
}