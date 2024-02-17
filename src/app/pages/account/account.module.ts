import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BookingFormComponent } from '@pages/booking-form/booking-form.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    BookingFormComponent

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    AccountRoutingModule,
    ToastModule,
  ],
  providers: [MessageService]
})
export class AccountModule { }
