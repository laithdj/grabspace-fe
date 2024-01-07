import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseLayoutRoutingModule } from './base-layout-routing.module';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { HomeHeaderModule } from '../home-header/home-header.module';
import { HomeFooterModule } from '../home-footer/home-footer.module';


@NgModule({
  declarations: [
    BaseLayoutComponent
  ],
  imports: [
    CommonModule,
    BaseLayoutRoutingModule,
    HomeHeaderModule,
    HomeFooterModule
  ]
})
export class BaseLayoutModule { }
