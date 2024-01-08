import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
  declarations: [
    HomeHeaderComponent
  ],
  imports: [
    CommonModule,
    TooltipModule,
    RouterModule
  ],
  exports: [
    HomeHeaderComponent
  ]
})
export class HomeHeaderModule { }
