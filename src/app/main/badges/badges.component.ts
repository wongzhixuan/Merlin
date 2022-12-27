import { Component, OnInit } from '@angular/core';
import { getMetadata } from '@firebase/storage';
import { Badge } from 'src/app/modal/gamification';
import { GamificationService } from 'src/app/services/gamification.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent implements OnInit {
  badgeList = [];
  earnedList = [];
  unEarnList = [];
  isLoading = false;
  currentSegment = 'a';
  constructor(private gamifiactionService: GamificationService) {}

  async ngOnInit() {
    this.getData();
  }

  async getData() {
    this.isLoading = true;
    this.badgeList = [];
    this.earnedList = [];
    this.unEarnList = [];
    const badges = await this.gamifiactionService.getBadges();
    const badgeStatusList = await this.gamifiactionService.getBadgeStatus();
    badges.forEach((each) => {
      const badge = new Badge();
      badge.id = each.id;
      badge.badgeId = each.badgeId;
      badge.badgeUrl = each.badgeUrl;
      badge.badgeUrlGrey = each.badgeUrlGrey;
      badge.badgeName = each.badgeName;
      badge.badgeDescription = each.badgeDescription;

      const filter = badgeStatusList.filter((el) => el.id === badge.id);
      if (filter.length > 0) {
        badge.badgeStatus = filter[0].badgeStatus;
      } else {
        badge.badgeStatus = false;
      }
      this.badgeList.push(badge);
    });
    this.earnedList = this.badgeList.filter(
      (badge) => badge.badgeStatus === true
    );
    this.unEarnList = this.badgeList.filter(
      (badge) => badge.badgeStatus === false
    );
    console.log(this.badgeList);
    this.isLoading = false;
  }
  onRefresh() {
    if(this.isLoading === false){
    this.getData();
    }
  }
  onChangeSegment(event) {
    this.currentSegment = event.detail.value;
  }
}
