// AboutShellRoutingMobileModule
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesktopFeatureAboutPageComponent, MobileFeatureAboutPageComponent } from '@negocio/features/feature-about';
import { DeviceRedirectComponent } from './device-redirect.component';

const routes: Routes = [

  {
    path: '',
    component: DeviceRedirectComponent,
  },
  {
    path: 'desktop',
    component: DesktopFeatureAboutPageComponent,
  },
  {
    path: 'mobile',
    component: MobileFeatureAboutPageComponent, // Assuming you have a mobile component
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
export class AboutShellRoutingMobileModule {}