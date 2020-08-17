import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { ToastModule } from 'primeng/toast';
import { CptDisclaimerComponent } from './cpt-disclaimer/cpt-disclaimer.component';



export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    ToastModule
  ],
  declarations: [LoginComponent],
  entryComponents: [    
  ]
})

export class LoginModule { }