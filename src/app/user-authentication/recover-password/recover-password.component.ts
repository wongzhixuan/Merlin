/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { User } from 'src/app/modal/user';
import { FeedbackService } from 'src/app/services/feedback.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
})
export class RecoverPasswordComponent implements OnInit {
  isSubmitted = false;
  resetpwdForm: FormGroup;
  user: User = new User();
  email: string;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private auth: UserAuthService,
    private feedback: FeedbackService
  ) {}

  ngOnInit() {
    // this.resetpwdForm = this.formBuilder.group({
    //   email: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.email,
    //       Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    //     ],
    //   ],
    // });
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.email.trim() !== '' || this.email !== null ) {
      this.resetPassword();
    } else {
      this.feedback.showToast(
        'Please provide all the required fields with valid values!'
      );
      return false;
    }
  }

  async resetPassword() {
    const loading = await this.feedback.createLoading();
    await loading.present();

    const action = await this.auth
      .resetPassword(this.email)
      .then(() => {
        this.feedback.showAlert(
          'Password Reset Link Sent!',
          'Please check your email to reset your password.'
        );
      })
      .catch((e) => {
        this.feedback.showToast(
          'An error occurred while attempting to reset your password'
        );
      });
    await loading.dismiss();
  }
}
