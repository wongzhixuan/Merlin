import { Component, Input, OnInit } from '@angular/core';
import { UserAuthService } from '../services/user-auth.service';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-sidemenu-header',
  templateUrl: './sidemenu-header.component.html',
  styleUrls: ['./sidemenu-header.component.scss'],
})
export class SidemenuHeaderComponent implements OnInit {
  @Input() isLoaded = false;
  @Input() userProfile = null;
  @Input() user = null;
  avatarImg = 'assets/images/user.png';
  constructor(private userDataService: UserDataService, private authService: UserAuthService) {}

  ngOnInit() {
    if (this.authService.getUser() !== null) {
      this.userDataService.getProfile().subscribe((data) => {
        this.userProfile = data;
        this.isLoaded = true;
      });
    }
  }
}
