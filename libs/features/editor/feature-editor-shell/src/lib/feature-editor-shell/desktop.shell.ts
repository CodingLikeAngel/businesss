import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorDesktopFeatureComponent, MainDesktopLayoutComponent } from '@negocio/features/feature-editor';
import { DeviceRedirectComponent } from './device-redirect.component';

const routes: Routes = [
  {
    path: 'desktop',
    redirectTo: '/home',
    pathMatch: 'full',
  },

  
  {
    path: 'home',
    component: MainDesktopLayoutComponent,
    children: [{ path: '', component: EditorDesktopFeatureComponent }],
  },
    // {
    //   path: 'home/mobile',
    //   component: MainMobileLayoutComponent,
    //   children: [{ path: '', component: HomeMobileFeatureComponent }],
    // },
  {
    path: 'desktop/about',
    loadChildren: () =>
      import('@negocio/features/feature-about-shell').then((m) => m.AboutShellRoutingDesktopModule),
  },
  {
    path: 'desktop/contact',
    loadChildren: () =>
      import('@negocio/features/feature-contact-shell').then((m) => m.ContactShellRoutingDesktopModule),
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
export class AntoShellRoutingDesktopModule {}