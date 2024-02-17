import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { BookingFormComponent } from '@pages/booking-form/booking-form.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyListComponent
  },
  {
    path: ':id',
    component: PropertyDetailComponent
  },
  {
    path: ':id/booking-form',
    component: BookingFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertiesRoutingModule { }
