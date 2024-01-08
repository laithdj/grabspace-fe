import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/core/constants';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm;
  submitted: boolean;
  submitLoading: boolean;
  errors: any = {};
  ERROR_MESSAGES = CONSTANTS.ERROR_MESSAGES;
  constructor(
    private router: Router,
    // private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.initialFormValues();
  }
  initialFormValues() {
    return {
      email: '',
      password: '',
      rememberMe: false
    }
  }
  validateLoginForm(): boolean {
    this.errors = {};
    if (this.submitted) {
      Object.keys(this.loginForm).forEach(field => {
        if (['rememberMe'].indexOf(field) > -1) {
          return;
        }
        if (!this.loginForm[field]) {
          this.errors[field] = true;
        }
      })
    }
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const testEmail = expression.test(this.loginForm.email);
    if (this.loginForm.email && !testEmail) {
      this.errors.invalidEmail = true;
    }
    return Object.keys(this.errors).length > 0;
  }
  onSubmitLogin(): void {
    this.submitted = true;
    const errors = this.validateLoginForm();
    console.log('errors', errors);
    if (!errors) {
      this.submitLoading = true;
      const loginData = {
        email: this.loginForm.email,
        password: this.loginForm.password
      };
      this.authService.login(loginData).subscribe(
        (loginRes) => {
          console.log('loginRes', loginRes);
          const fullName = `${loginRes.user.lastName ? [loginRes.user.firstName, loginRes.user.lastName].join(' ') : loginRes.user.firstName}`
          this.authService.createToken({
            id: loginRes.user.id,
            firstName: loginRes.user.firstName,
            lastName: loginRes.user.lastName,
            fullName,
            role: loginRes.user.role,
            email: loginRes.user.email
          }, loginRes.tokens?.access, loginRes.tokens?.refresh);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: `Welcome Back! ${fullName}` });
          setTimeout(() => {
            this.router.navigateByUrl(`/profile/my-properties`);
            this.resetLoginForm();
            this.submitLoading = false;
          }, 1000);
        },
        (loginError) => {
          console.log('loginError', loginError);
          if (loginError.error?.message) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: loginError.error?.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: this.ERROR_MESSAGES.SOMETHING_WRONG });
          }
          this.submitLoading = false;
        },
      );
    }
  }

  resetLoginForm() {
    this.submitLoading = false;
    this.submitted = false;
    this.errors = {};
    this.loginForm = this.initialFormValues();
  }

}
