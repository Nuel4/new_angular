import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages.component';
import { BlankComponent } from './blank/blank.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthenticationGuard } from './../authentication';
// import { CategoriesComponent } from './inventory/categories/categories.component';
// import { ItemsComponent } from './inventory/items/items.component';
// import { BatchesComponent } from './inventory/batches/batches.component';
// import { TrackingComponent } from './inventory/tracking/tracking.component';
// import { OrderComponent } from './inventory/orderMaster/order.component';
// import { ShippingComponent } from './inventory/shipping/shipping.component';
// import { UploadComponent } from './inventory/upload/upload.component';
// import { ShippingOrderComponent } from './inventory/shipping/shipping-order/shipping-order.component';
// import { ShippingLabelComponent } from './inventory/shipping/shipping-label/shipping-label.component';
import { RefreshComponent } from './refresh/refresh.component';
import { EditorComponent } from './form-elements/editor/editor.component';
import { AddProblemsComponent } from './chart/add-problems/add-problems.component';


export const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: '', redirectTo: 'workspace', pathMatch: 'full', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Workspace' } },
            {
                path: 'style-guide', loadChildren: 'app/pages/styleguide/style-guide.module#StyleGuideModule',
                canActivate: [AuthenticationGuard], data: { breadcrumb: 'Style Guide' }
            },
            { path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Dashboard' } },
            { path: 'workspace', loadChildren: 'app/pages/workspace/workspace.module#WorkspaceModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Workspace' } },
            { path: 'scheduling', loadChildren: 'app/pages/scheduling/scheduling.module#SchedulingModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Scheduling' } },
            { path: 'chart', loadChildren: 'app/pages/chart/chart.module#ChartModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Charts' } },
            { path: 'orders', loadChildren: 'app/pages/orders/orders.module#OrdersModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Orders' } },
            { path: 'billing', loadChildren: 'app/pages/billing/billing.module#BillingModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Billing' } },
            { path: 'practice', loadChildren: 'app/pages/practice/practice.module#PracticeModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Practice' } },
            { path: 'reports', loadChildren: 'app/pages/reports/reports.module#ReportsModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Reports' } },
            { path: 'scanning', loadChildren: 'app/pages/scanning/scanning.module#ScanningModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Scanning' } },
            { path: 'inventory', loadChildren: 'app/pages/inventory/inventory.module#InventoryModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Inventory'} },
            { path: 'help', loadChildren: 'app/pages/help/help.module#HelpModule', canActivate: [AuthenticationGuard], data: { breadcrumb: 'Help' } },
            { path: 'profile', component: ProfileComponent, data: { breadcrumb: 'Profile' } },
            { path: 'editor', component: EditorComponent, data: { breadcrumb: 'Editor' } },
            // { path: 'categories', component: CategoriesComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'Categories' } },
            // { path: 'items', component: ItemsComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'Items' } },
            // { path: 'batches', component: BatchesComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'Batches' } },
            // { path: 'tracking', component: TrackingComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'Tracking' } },
            // { path: 'orderMaster', component: OrderComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'orders' } },
            // { path: 'shipping', component: ShippingComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'shipping' } },
            // { path: 'shipping-order', component: ShippingOrderComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'shipping-order' } },
            // { path: 'shipping-label', component: ShippingLabelComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'shipping-label' } },
            // { path: 'uploads', component: UploadComponent, canActivate: [AuthenticationGuard], data: { breadcrumb: 'uploads' } },
            { path: 'refresh/:p1', component: RefreshComponent, canActivate: [AuthenticationGuard], },
            /*{ path: 'membership', loadChildren: 'app/pages/membership/membership.module#MembershipModule', data: { breadcrumb: 'Membership' } },
            { path: 'ui', loadChildren: 'app/pages/ui/ui.module#UiModule', data: { breadcrumb: 'UI' } },
            { path: 'form-elements', loadChildren: 'app/pages/form-elements/form-elements.module#FormElementsModule', data: { breadcrumb: 'Form Elements' } },
            { path: 'tables', loadChildren: 'app/pages/tables/tables.module#TablesModule', data: { breadcrumb: 'Tables' } },
            { path: 'tools', loadChildren: 'app/pages/tools/tools.module#ToolsModule', data: { breadcrumb: 'Tools' } },
            { path: 'calendar', loadChildren: 'app/pages/calendar/app-calendar.module#AppCalendarModule', data: { breadcrumb: 'Calendar' } },
            { path: 'mailbox', loadChildren: 'app/pages/mailbox/mailbox.module#MailboxModule', data: { breadcrumb: 'Mailbox' } },
            { path: 'maps', loadChildren: 'app/pages/maps/maps.module#MapsModule', data: { breadcrumb: 'Maps' } },
            { path: 'charts', loadChildren: 'app/pages/charts/charts.module#ChartsModule', data: { breadcrumb: 'Charts' } },
            { path: 'dynamic-menu', loadChildren: 'app/pages/dynamic-menu/dynamic-menu.module#DynamicMenuModule', data: { breadcrumb: 'Dynamic Menu' }  },
            { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } },
            { path: 'search', component: SearchComponent, data: { breadcrumb: 'Search' } }*/

        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
