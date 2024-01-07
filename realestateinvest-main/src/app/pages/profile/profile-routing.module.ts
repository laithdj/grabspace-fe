import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { AddEditPropertyComponent } from './add-edit-property/add-edit-property.component';
import { GeneralComponent } from './add-edit-property/general/general.component';
import { PropertyImagesComponent } from './add-edit-property/property-images/property-images.component';
import { DetailComponent } from './add-edit-property/detail/detail.component';
import { SellerDetailsComponent } from './add-edit-property/seller-details/seller-details.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'my-properties',
    component: MyPropertiesComponent
  },
  {
    path: 'add-property',
    component: AddEditPropertyComponent,
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: GeneralComponent
      },
      {
        path: 'images',
        component: PropertyImagesComponent
      },
      {
        path: 'details',
        component: DetailComponent
      },
      {
        path: 'seller-details',
        component: SellerDetailsComponent
      }
    ]
  },
  {
    path: 'edit-property/:id',
    component: AddEditPropertyComponent,
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: GeneralComponent
      },
      {
        path: 'images',
        component: PropertyImagesComponent
      },
      {
        path: 'details',
        component: DetailComponent
      },
      {
        path: 'seller-details',
        component: SellerDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
