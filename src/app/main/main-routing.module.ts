import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ManagePasswordComponent } from './account/manage-password/manage-password/manage-password.component';
import { BadgesComponent } from './badges/badges.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { UserDetailsComponent } from './leaderboard/user-details/user-details.component';

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
  {
    path: 'badges',
    //component: AccountComponent,
    children: [
      { path: '', component: BadgesComponent },
      //{ path: 'manage-password', component: ManagePasswordComponent },
    ],
  },
  {
    path: 'leaderboard',
    //component: AccountComponent,
    children: [
      { path: '', component: LeaderboardComponent },
      { path: 'user-details', component: UserDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
