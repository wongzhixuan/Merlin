import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard, canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { TabsPage } from './main/tabs/tabs.page';

const redirectUnautorhizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToMain = () => redirectLoggedInTo(['main']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./user-authentication/user-authentication.module').then( m => m.UserAuthenticationPageModule),
    ...canActivate(redirectLoggedInToMain),
  },
  {
    path: 'main',
    loadChildren: () => import('./main/main.module').then( m => m.MainPageModule),
    ...canActivate(redirectUnautorhizedToLogin),
  },
  // {
  //   path:'main/tabs',
  //   loadChildren: () => import('./main/tabs/tabs.module').then(m=>m.TabsPageModule),
  //   ...canActivate(redirectUnautorhizedToLogin)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
