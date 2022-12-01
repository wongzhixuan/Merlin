import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { UserAuthenticationPage } from './user-authentication.page';
import { canActivate } from '@angular/fire/auth-guard';
const routes: Routes = [
  {
    path: '*',
    component: UserAuthenticationPage,
  },
  {
    path: 'login',
    component: LoginComponent,

  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'recover-password',
    component: RecoverPasswordComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAuthenticationPageRoutingModule {}
