import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { ChatComponent } from './main/chat/chat.component';
import { AssignmentsComponent } from './main/assignments/assignments.component';
import { AchievementsComponent } from './main/achievements/achievements.component';
import { SidemenuHeaderComponent } from './sidemenu-header/sidemenu-header.component';
import { AccountComponent } from './main/account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchableSelectableComponent } from './custom-inputs/searchable-selectable/searchable-selectable.component';
import { HttpClientModule } from '@angular/common/http';
import { ManagePasswordComponent } from './main/account/manage-password/manage-password/manage-password.component';
import { SwiperModule } from 'swiper/angular';
import { CoursesComponent } from './main/courses/courses.component';
import { AssignmentDetailsComponent } from './main/assignments/assignment-details/assignment-details.component';
import { LeaderboardComponent } from './main/leaderboard/leaderboard.component';
import { BadgesComponent } from './main/badges/badges.component';
import { UserDetailsComponent } from './main/leaderboard/user-details/user-details.component';

@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    ChatComponent,
    AssignmentsComponent,
    AchievementsComponent,
    SidemenuHeaderComponent,
    AccountComponent,
    ManagePasswordComponent,
    CoursesComponent,
    AssignmentDetailsComponent,
    LeaderboardComponent,
    BadgesComponent,
    UserDetailsComponent
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule,SearchableSelectableComponent, HttpClientModule, SwiperModule],
  exports: [
    HeaderComponent,
    DashboardComponent,
    ChatComponent,
    AssignmentsComponent,
    AchievementsComponent,
    SidemenuHeaderComponent,
    AccountComponent,
    ManagePasswordComponent,
    CoursesComponent,
    AssignmentDetailsComponent,
    LeaderboardComponent,
    BadgesComponent,
    UserDetailsComponent
  ],
})
export class SharedModule {}
