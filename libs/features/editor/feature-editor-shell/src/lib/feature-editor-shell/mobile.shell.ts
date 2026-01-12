import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EditorMobileFeatureComponent , MainMobileLayoutComponent} from '@negocio/features/feature-editor'
import { DeviceRedirectComponent } from './device-redirect.component';


const routes: Routes = [
  {
    path: 'mobile',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // {
  //   path: 'home',
  //   component: DeviceRedirectComponent,
  // },
  {
    path: 'home',
    component: MainMobileLayoutComponent,
    children: [{ path: '', component: EditorMobileFeatureComponent }],
  },
  // {
  //   path: 'home/desktop',
  //   component: MainDesktopLayoutComponent,
  //   children: [{ path: '', component: HomeDesktopFeatureComponent }],
  // },
  {
    path: 'about',
    loadChildren: () =>
      import('@negocio/features/feature-about-shell').then((m) => m.AboutShellRoutingMobileModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('@negocio/features/feature-contact-shell').then((m) => m.ContactShellRoutingMobileModule),
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
export class AntoShellRoutingMobileModule {}
