import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { AuthenticationGuard } from './authentication'
import { AppointmentdetailsComponent } from './theme/components/applications/waitingroom/appointmentdetails/appointmentdetails.component';
import { PrescribeComponent } from './pages/chart/prescribe/prescribe.component'
export const routes: Routes = [

  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule' },
  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule', canActivate: [AuthenticationGuard] },
  // { path: 'waitingroom', component: AppointmentdetailsComponent, data: { breadcrumb: 'waitingroom' } },
  { path: 'prescribe/:id', component: PrescribeComponent, canActivate: [AuthenticationGuard] },
  { path: '**', redirectTo: 'pages/workspace', canActivate: [AuthenticationGuard] }
  //{ path: 'register', loadChildren: 'app/pages/register/register.module#RegisterModule' },
  //{ path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
  // onSameUrlNavigation: "reload"
  useHash: true
});
