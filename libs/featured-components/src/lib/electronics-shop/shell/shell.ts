import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { DeviceResolver, DeviceGuard } from '@negocio/shared-components';
import { HomeDesktopFeatureComponent } from '../features/home/pages/desktop/home-feature.component';
import { HomeMobileFeatureComponent } from '../features/home/pages/mobile/home-feature.component';
import { AboutFeatureComponent, ContactFeatureComponent, TattooHomeFeatureComponent } from '@negocio/featured-components';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    resolve: { _: DeviceResolver }, // solo queremos que se ejecute
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'desktop',
        component: HomeDesktopFeatureComponent
      },
      {
        path: 'mobile',
        component: HomeMobileFeatureComponent
      },
      {
        path: '**',
        redirectTo: '', // El resolver lo redirige dinámicamente
        pathMatch: 'full'
      }
    ]
  },  
  {
    path: 'contact',
    component: ContactFeatureComponent,
  },
  {
    path: 'about',
    component: AboutFeatureComponent,
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
export class ElectronicsShopShellRoutingModule {}