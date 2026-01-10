import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceRedirectComponent } from './device-redirect.component';
import { FeatureContactDesktopPageComponent, FeatureContactMobilePageComponent } from '@negocio/features/feature-contact';

const routes: Routes = [
  {
    path: '',
    component: DeviceRedirectComponent,
  },
  {
    path: 'desktop',
    component: FeatureContactDesktopPageComponent,
  },
  {
    path: 'mobile',
    component: FeatureContactMobilePageComponent, // Assuming you have a mobile component
  },
  {
    path: '**',
    redirectTo: 'desktop',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactShellRoutingDesktopModule {}