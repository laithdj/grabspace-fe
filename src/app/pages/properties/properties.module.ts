import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PropertyListComponent,
    PropertyDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgSelectModule,
    PropertiesRoutingModule
  ]
})
export class PropertiesModule { }
