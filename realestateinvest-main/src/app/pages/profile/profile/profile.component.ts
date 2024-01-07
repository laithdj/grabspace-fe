import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { UserService } from '../../account/services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm;
  submitted: boolean;
  submitLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  loggedInUserId: string;
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.profileForm = this.initialFormValues();
    const loggedInUser = this.authService.getUser();
    this.loggedInUserId = '';
    if (loggedInUser?.id) {
      this.loggedInUserId = loggedInUser.id;
      this.userService.getUserById(loggedInUser.id).subscribe((userData) => {
        console.log('userData', userData);
        this.profileForm = this.initialFormValues(userData);
      })
    }

  }
  initialFormValues(userData?: any) {
    return {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      email: userData?.email || '',
      contactNumber: userData?.contactNumber || '',
      address: userData?.address || '',
    }
  }

  validateProfileForm(): boolean {
    this.errors = {};
    if (this.submitted) {
      Object.keys(this.profileForm).forEach(field => {
        if (['lastName', 'address'].indexOf(field) > -1) {
          return;
        }
        if (!this.profileForm[field]) {
          this.errors[field] = true;
        }
      })
    }
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const testEmail = expression.test(this.profileForm.email);
    if (this.profileForm.email && !testEmail) {
      this.errors.invalidEmail = true;
    }
    return Object.keys(this.errors).length > 0;
  }
  onSubmitProfile(): void {
    this.submitted = true;
    const errors = this.validateProfileForm();
    console.log('errors', errors);
    if (!errors) {
      this.submitLoading = true;
      this.userService.updateUser(this.loggedInUserId, this.profileForm).subscribe(
        (userRes) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account updated successfully.' });
          setTimeout(() => {
            // this.resetProfileForm();
            this.submitLoading = false;
          }, 1000);
        },
        (userError) => {
          if (userError.error?.message) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: userError.error?.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.ERROR_MESSAGES.SOMETHING_WRONG });
          }
          this.submitLoading = false;
        },
      );
    }
  }

  resetProfileForm() {
    this.submitLoading = false;
    this.submitted = false;
    this.errors = {};
    this.profileForm = this.initialFormValues();
  }

}
