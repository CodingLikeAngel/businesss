// AboutShellRoutingMobileModule
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeviceRedirectComponent } from './device-redirect.component';
import { FeatureContactDesktopPageComponent, FeatureContactMobilePageComponent } from '@negocio/featured-components';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'mobile', // Redirect to mobile about page
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: DeviceRedirectComponent,
  },
  {
    path: 'mobile',
    component: FeatureContactMobilePageComponent,
  },
  {
    path: 'desktop',
    component: FeatureContactDesktopPageComponent,
  },
  {
    path: '**',
    redirectTo: 'mobile',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactShellRoutingMobileModule {}