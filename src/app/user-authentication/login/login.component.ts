/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, MenuController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { User } from 'src/app/modal/user';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword = false;
  user: User = new User();
  isSubmitted = false;

  @ViewChild('pwdInput', { static: false }) input: IonInput;

  // form controls
  loginForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private auth: UserAuthService,
    private feedback: FeedbackService,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,}$'
          ),
        ],
      ],
      role: ['Student', [Validators.required]],
    });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get role() {
    return this.loginForm.get('role');
  }

  onToggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!');
      this.feedback.showToast(
        'Please provide all the required fields with valid values!'
      );
      return false;
    } else {
      this.user = this.loginForm.value;
      this.login();
    }
  }

  async login() {
    const loading = await this.feedback.createLoading();
    await loading.present();

    const credential = await this.auth.login(this.loginForm.value);
    await loading.dismiss();

    if (credential) {
      this.router.navigateByUrl('/main', { replaceUrl: true });
    } else {
      this.feedback.showToast('Login Failed! Please Try Again');
      this.feedback.showAlert('Login Failed', 'Please Try Again');
    }
  }

  onSignUpClick() {
    this.router.navigate(['/auth/sign-up']);
  }

  onPasswordRecoveryClick() {
    this.router.navigate(['/auth/recover-password']);
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(false);
  }
}
