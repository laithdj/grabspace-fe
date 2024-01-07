import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { AddEditPropertyComponent } from './add-edit-property/add-edit-property.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StepsModule } from 'primeng/steps';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GeneralComponent } from './add-edit-property/general/general.component';
import { PropertyImagesComponent } from './add-edit-property/property-images/property-images.component';
import { DetailComponent } from './add-edit-property/detail/detail.component';
import { SellerDetailsComponent } from './add-edit-property/seller-details/seller-details.component';

@NgModule({
  declarations: [
    ProfileComponent,
    MyPropertiesComponent,
    AddEditPropertyComponent,
    GeneralComponent,
    PropertyImagesComponent,
    DetailComponent,
    SellerDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToastModule,
    StepsModule,
    ConfirmDialogModule,
    ProfileRoutingModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class ProfileModule { }
