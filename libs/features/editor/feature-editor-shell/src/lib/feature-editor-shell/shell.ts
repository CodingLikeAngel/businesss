import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EditorDesktopFeatureComponent, EditorMobileFeatureComponent, MainDesktopLayoutComponent, MainMobileLayoutComponent} from '@negocio/features/feature-editor'

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
    children: [{ path: '', component: EditorMobileFeatureComponent }],
  },
  {
    path: 'home/desktop',
    component: MainDesktopLayoutComponent,
    children: [{ path: '', component: EditorDesktopFeatureComponent }],
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
