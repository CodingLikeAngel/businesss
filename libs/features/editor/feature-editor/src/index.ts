import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditableGridComponent } from '@negocio/featured-components';

const routes: Routes = [
  {
    path: '',
    component: EditableGridComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureEditorModule {}