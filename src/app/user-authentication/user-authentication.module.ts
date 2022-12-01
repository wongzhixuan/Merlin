import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserAuthenticationPageRoutingModule } from './user-authentication-routing.module';

import { UserAuthenticationPage } from './user-authentication.page';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserAuthenticationPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    UserAuthenticationPage,
    LoginComponent,
    SignUpComponent,
    RecoverPasswordComponent,
  ],
})
export class UserAuthenticationPageModule {}
