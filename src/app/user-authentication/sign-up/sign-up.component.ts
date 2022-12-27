/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { Badge } from 'src/app/modal/gamification';
import { User } from 'src/app/modal/user';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GamificationService } from 'src/app/services/gamification.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  showPassword = false;
  user: User = new User();
  isSubmitted = false;
  registerForm: FormGroup;
  next = false;
  @ViewChild('pwdInput', { static: false }) input: IonInput;
  @ViewChild('pwdInput2', { static: false }) input2: IonInput;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private auth: UserAuthService,
    private feedback: FeedbackService,
    private userData: UserDataService,
    private gamificationService: GamificationService
  ) {}

  ngOnInit() {
    this.next = false;
    this.registerForm = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
          ],
        ],
        username: ['', [Validators.required]],
        role: ['Student', [Validators.required]],
        tnc: [false, [Validators.requiredTrue]],
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
        repeatpassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,}$'
            ),
          ],
        ],
      },
      { validator: this.validateEqual('password', 'repeatpassword') }
    );
  }

  get errorControl() {
    return this.registerForm.controls;
  }

  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get role() {
    return this.registerForm.get('role');
  }

  get tnc() {
    return this.registerForm.get('tnc');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get repeatpassword() {
    return this.registerForm.get('repeatpassword');
  }

  submitForm() {
    this.isSubmitted = true;
    if (!this.registerForm.valid) {
      console.log('Please provide all the required values!');
      this.feedback.showToast(
        'Please provide all the required fields with valid values!'
      );
      return false;
    } else {
      this.register();
    }
  }
  onFirstSubmit() {
    this.isSubmitted = true;
    if (this.email.invalid || this.username.invalid || this.tnc.invalid) {
      console.log('Please provide all the required values!');
      this.feedback.showToast(
        'Please provide all the required fields with valid values!'
      );
      return false;
    } else {
      this.next = true;
      this.isSubmitted = false;
      this.registerForm.get('role').disable();
    }
  }

  async register() {
    const loading = await this.feedback.createLoading();
    await loading.present();

    const credential = await this.auth.register(this.registerForm.value);
    await loading.dismiss();

    if (credential) {
      this.user.username = this.username.value;
      this.user.role = this.role.value;
      this.user.gender = '';
      this.user.countryflag = '';
      this.user.nationality = '';
      this.user.school = '';
      this.user.points = 0;
      this.userData.createProfile(this.user);

      const user = this.auth.getUser();
      this.user.userId = user.uid;
      this.auth.updateUserProfile(this.user);

      const badge = new Badge();
      badge.badgeId = 1;
      badge.badgeStatus = true;
      badge.id = 'l1xpleGUpACeK4Nyp1GK';
      this.gamificationService.updateBadgeStatus(badge.id, badge);

      console.log(this.user);
      this.router.navigateByUrl('/main', { replaceUrl: true });
    } else {
      this.feedback.showToast('Register Failed! Please Try Again');
      this.feedback.showAlert('Register Failed', 'Please Try Again');
    }
  }

  onLoginClick() {
    this.router.navigate(['/auth/login']);
  }

  private validateEqual(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onToggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
  onToggleShow2() {
    this.showPassword = !this.showPassword;
    this.input2.type = this.showPassword ? 'text' : 'password';
  }
}
