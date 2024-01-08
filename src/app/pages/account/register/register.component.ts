import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { UserService } from '../services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm;
  submitted: boolean;
  submitLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.initialFormValues();
  }
  initialFormValues() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      password: '',
      confirmPassword: '',
      address: '',
    }
  }

  validateRegisterForm(): boolean {
    this.errors = {};
    if (this.submitted) {
      Object.keys(this.registerForm).forEach(field => {
        if (['lastName', 'address'].indexOf(field) > -1) {
          return;
        }
        if (!this.registerForm[field]) {
          this.errors[field] = true;
        }
      })
    }
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const testEmail = expression.test(this.registerForm.email);
    if (this.registerForm.email && !testEmail) {
      this.errors.invalidEmail = true;
    }
    if (this.registerForm.password && this.registerForm.password.length < 8) {
      this.errors.invalidPassword = true;
    }
    if (this.registerForm.confirmPassword && (this.registerForm.password !== this.registerForm.confirmPassword)) {
      this.errors.invalidConfirmPassword = true;
    }
    return Object.keys(this.errors).length > 0;
  }
  onSubmitRegister(): void {
    this.submitted = true;
    const errors = this.validateRegisterForm();
    console.log('errors', errors);
    if (!errors) {
      this.submitLoading = true;
      this.userService.createUser(this.registerForm).subscribe(
        (userRes) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account created successfully.' });
          setTimeout(() => {
            this.router.navigateByUrl(`/account/login`);
            this.resetRegisterForm();
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

  resetRegisterForm() {
    this.submitLoading = false;
    this.submitted = false;
    this.errors = {};
    this.registerForm = this.initialFormValues();
  }

}
