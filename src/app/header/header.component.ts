/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Input } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  coinIcon = '../../assets/icon/coin.png';
  isLoading = true;
  //points = 0;
  @Input() back = false;
  @Input() title = null;
  userProfile = null;
  constructor(private userDataService: UserDataService) { }

  async ngOnInit() {
    this.userDataService.getProfile().subscribe((data) => {
      this.userProfile = data;
      this.isLoading = false;
    });
  }



}
