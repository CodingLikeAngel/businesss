import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactFeatureComponent } from '../features/contacto/pages/desktop/contact-feature.component';
import { AboutFeatureComponent } from '../features/about/about-feature.component';
import { TattooHomeFeatureComponent } from '../../tattoo/tattoo-home-feature.component';
import { HomeDesktopFeatureComponent } from '../features/home/pages/desktop/home-feature.component';
import { HomeMobileFeatureComponent } from '../features/home/pages/mobile/home-feature.component';
import { MainDesktopLayoutComponent } from '../features/main-layout/desktop/main-desktop-layout.component';
import { MainMobileLayoutComponent } from '../features/main-layout/mobile/main-mobile-layout.component';
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
    path: 'contact',
    component: DeviceRedirectComponent,
  },
  {
    path: 'contact/mobile',
    component: MainMobileLayoutComponent,
    children: [{ path: '', component: ContactFeatureComponent }],
  },
  {
    path: 'contact/desktop',
    component: MainDesktopLayoutComponent,
    children: [{ path: '', component: ContactFeatureComponent }],
  },
  {
    path: 'about',
    component: DeviceRedirectComponent,
  },
  {
    path: 'about/mobile',
    component: MainMobileLayoutComponent,
    children: [{ path: '', component: AboutFeatureComponent }],
  },
  {
    path: 'about/desktop',
    component: MainDesktopLayoutComponent,
    children: [{ path: '', component: AboutFeatureComponent }],
  },
  {
    path: 'tattoo',
    component: TattooHomeFeatureComponent,
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
