import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeDesktopFeatureComponent, HomeMobileFeatureComponent, MainDesktopLayoutComponent, MainMobileLayoutComponent} from '@negocio/features/feature-home'

import { DeviceRedirectComponent } from './device-redirect.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: DeviceRedirectComponent,
  },
  {
    path: 'home/mobile',
    component: MainMobileLayoutComponent,
    children: [{ path: '', component: HomeMobileFeatureComponent }],
  },
  {
    path: 'home/desktop',
    component: MainDesktopLayoutComponent,
    children: [{ path: '', component: HomeDesktopFeatureComponent }],
  },
 
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AntoShellRoutingModule {}
