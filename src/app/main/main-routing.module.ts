import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ManagePasswordComponent } from './account/manage-password/manage-password/manage-password.component';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    //component: MainPage
    redirectTo: 'tabs/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'account',
    //component: AccountComponent,
    children: [
      { path: '', component: AccountComponent },
      { path: 'manage-password', component: ManagePasswordComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
