import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonMenu, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { UserAuthService } from './services/user-auth.service';
import { Router } from '@angular/router';
import { FeedbackService } from './services/feedback.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserDataService } from './services/user-data.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public appPages = [
    { title: 'Profile', url: 'main/account', icon: 'person-circle' },
    { title: 'Chat', url: 'main/tabs/chat', icon: 'chatbubble-ellipses' },
    { title: 'Assignments', url: 'main/tabs/assignments', icon: 'heart' },
    //{ title: 'Calendar', url: 'tabs/calendar', icon: 'calendar' },
    { title: 'Achievements', url: 'main/tabs/achievements', icon: 'trash' },
    //{ title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  userProfile = null;
  isLoaded = false;
  user = null;
  constructor(
    private authService: UserAuthService,
    private router: Router,
    private feedback: FeedbackService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userDataService: UserDataService
  ) {
    this.initializeApp();

  }
  ngOnInit(): void {

  }

  async onLogOutClick() {
    const loading = await this.feedback.createLoading();
    await loading.present();
    await this.authService.logout();
    if (this.authService.getUser() == null) {
      this.router.navigateByUrl('/', { replaceUrl: true });
      await loading.dismiss();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  onMenuOpen(){
    this.user = this.authService.getUser();
    this.userDataService.getProfile().subscribe((data) => {
      this.userProfile = data;
      this.isLoaded = true;
    });
  }
}
