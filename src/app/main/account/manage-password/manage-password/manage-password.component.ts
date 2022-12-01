import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { FeedbackService } from 'src/app/services/feedback.service';
import { UserAuthService } from 'src/app/services/user-auth.service';

@Component({
  selector: 'app-manage-password',
  templateUrl: './manage-password.component.html',
  styleUrls: ['./manage-password.component.scss'],
})
export class ManagePasswordComponent implements OnInit {
  @ViewChild('pwdInput', { static: false }) input: IonInput;
  @ViewChild('pwdInput2', { static: false }) input2: IonInput;
  @ViewChild('pwdInput3', { static: false }) input3: IonInput;
  showPassword = false;
  passwordEditForm: FormGroup;
  isSubmitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private auth: UserAuthService,
    private feedback: FeedbackService,
    private location: Location
  ) {}

  get errorControl() {
    return this.passwordEditForm.controls;
  }

  get oldpassword() {
    return this.passwordEditForm.get('oldpassword');
  }

  get newpassword() {
    return this.passwordEditForm.get('newpassword');
  }

  get repeatpassword() {
    return this.passwordEditForm.get('repeatpassword');
  }

  onToggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }

  onToggleShow2() {
    this.showPassword = !this.showPassword;
    this.input2.type = this.showPassword ? 'text' : 'password';
  }

  onToggleShow3() {
    this.showPassword = !this.showPassword;
    this.input3.type = this.showPassword ? 'text' : 'password';
  }

  ngOnInit() {
    this.passwordEditForm = this.formBuilder.group(
      {
        oldpassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{6,}$'
            ),
          ],
        ],
        newpassword: [
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
      { validator: this.validateEqual('newpassword', 'repeatpassword') }
    );
  }

  async submitForm() {
    this.isSubmitted = true;
    if (!this.passwordEditForm.valid) {
      console.log('Please provide all the required values!');
      this.feedback.showToast(
        'Please provide all the required fields with valid values!'
      );
      return false;
    } else {
      const credential = await this.auth.checkPassword(this.oldpassword.value);
      if (credential) {
        this.updatePassword(this.newpassword.value);
      }
      else{
        this.feedback.showToast('Invalid Old Password');
      }
    }
  }

  async updatePassword(password: string) {
    const loading = await this.feedback.createLoading();
    await loading.present();

    const result = await this.auth.changePassword(password);
    await loading.dismiss();
    if (result != null) {
      this.feedback.showToast('Password Reset Successful!');
      this.feedback.showAlert('Password Reset Successful!','');
    } else {
      this.feedback.showToast('Password Reset Failed! Please Try Again');
      this.feedback.showAlert('Password Reset Failed', 'Please Try Again');
    }
  }

  onCancelClick() {
    this.location.back();
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
}
