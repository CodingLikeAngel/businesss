import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceRedirectComponent } from './device-redirect.component';
import { DesktopFeatureAboutPageComponent, MobileFeatureAboutPageComponent } from '@negocio/featured-components';

const routes: Routes = [

  {
    path: 'desktop/about',
    component: DesktopFeatureAboutPageComponent,
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
export class AboutShellRoutingDesktopModule {}