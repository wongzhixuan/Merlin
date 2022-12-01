import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from '../account/account.component';
import { AchievementsComponent } from '../achievements/achievements.component';
import { AssignmentsComponent } from '../assignments/assignments.component';
import { ChatComponent } from '../chat/chat.component';
import { CoursesComponent } from '../courses/courses.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        children: [
          {
            path: '',
            component: DashboardComponent
          },
          {
            path: 'courses',
            children: [
              {
                path: '',
                component: CoursesComponent
              }
            ]
          }
        ],
      },
      {
        path: 'chat',
        children: [
          {
            path: '',
            component: ChatComponent
          },
        ],
      },
      {
        path: 'assignments',
        children: [
          {
            path: '',
            component: AssignmentsComponent
          },
        ],
      },
      {
        path: 'achievements',
        children: [
          {
            path: '',
            component: AchievementsComponent
          },
        ],
      },
      // {
      //   path: 'account',
      //   children: [
      //     {
      //       path: '',
      //       component: AccountComponent
      //     }
      //   ]
      // }
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
