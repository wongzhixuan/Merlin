import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Achievement, Badge } from 'src/app/modal/gamification';
import { UserLog } from 'src/app/modal/log';
import { CourseService } from 'src/app/services/course.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GamificationService } from 'src/app/services/gamification.service';
import { LogService } from 'src/app/services/log.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  currentSegment = 'a';
  isLoading = false;
  acList = [];
  completedList = [];
  uncompletedList = [];
  claimedList = [];
  progressWidth = [];
  userLog = null;
  constructor(
    private gamificationService: GamificationService,
    private courseService: CourseService,
    private logService: LogService,
    private userDataService: UserDataService,
    private feedbackService: FeedbackService
  ) {}

  async ngOnInit() {
    //await this.getData();
  }
  async ionViewDidEnter(){
    if(this.isLoading === false){
    await this.getData();
    }
  }

  async getData() {
    //get current log
    const USERLOG = await this.logService.getUserLog();
    // set default userLog if userLog is undefined
    if (USERLOG === undefined) {
      const log = new UserLog();
      log.videoLog = 0;
      log.readLog = 0;
      log.assignmentLog = 0;
      this.userLog = log;
    } else {
      this.userLog = USERLOG;
    }

    this.acList = [];
    // this.completedList = [];
    // this.uncompletedList = [];
    // this.claimedList = [];
    this.isLoading = true;
    const achievements = await this.gamificationService.getAchievements();
    //console.log(this.userLog);
    achievements.forEach(async (ac) => {
      let achievement = new Achievement();
      achievement.acId = ac.acId;
      achievement.id = ac.id;
      achievement.acName = ac.acName;
      achievement.acPoints = ac.acPoints;
      achievement.acStatus = ac.acStatus ? ac.acStatus : false;
      achievement.acReceiveStatus = ac.acReceiveStatus
        ? ac.acReceiveStatus
        : false;
      achievement = await this.checkProgress(achievement);
      if (achievement.acId === 3) {
        if (this.userLog.assignmentLog >= 1) {
          console.log(achievement);
          this.progressWidth[achievement.acId] = '100%';
          achievement.acStatus = true;
          await this.gamificationService
            .updateAchievementStatus(achievement.id, achievement)
            .catch((error) => console.log(error));
        } else {
          this.progressWidth[achievement.acId] = '0%';
        }
      }
      if (achievement.acId === 1) {
        if (this.userLog.videoLog === 1) {
          this.progressWidth[achievement.acId] = '33%';
        } else if (this.userLog.videoLog === 2) {
          this.progressWidth[achievement.acId] = '66%';
        } else if (this.userLog.videoLog >= 3) {
          this.progressWidth[achievement.acId] = '100%';
          achievement.acStatus = true;
          await this.gamificationService
            .updateAchievementStatus(achievement.id, achievement)
            .catch((error) => console.log(error));
        } else {
          this.progressWidth[achievement.acId] = '0%';
        }
      }
      if (achievement.acId === 2) {
        if (this.userLog.readLog === 1) {
          this.progressWidth[achievement.acId] = '33%';
        } else if (this.userLog.readLog === 2) {
          this.progressWidth[achievement.acId] = '66%';
        } else if (this.userLog.readLog >= 3) {
          this.progressWidth[achievement.acId] = '100%';
          achievement.acStatus = true;
          await this.gamificationService
            .updateAchievementStatus(achievement.id, achievement)
            .catch((error) => console.log(error));
        } else {
          this.progressWidth[achievement.acId] = '0%';
        }
      }

      this.acList.push(achievement);
    });

    // console.log(this.acList);
    // this.completedList = this.acList.filter(
    //   (el) => el.acStatus === true && el.acReceiveStatus === false
    // );
    // this.uncompletedList = this.acList.filter(
    //   (el) => el.acStatus === false && el.acReceiveStatus === false
    // );
    // this.claimedList = this.acList.filter(
    //   (el) => el.acStatus === true && el.acReceiveStatus === true
    // );
    // console.log(this.completedList, this.uncompletedList, this.claimedList);
    this.isLoading = false;
  }

  async checkProgress(achievement: Achievement): Promise<Achievement> {
    const acStatus = await this.gamificationService.getAchievementStatus();
    const filter = acStatus.filter((el) => el.id === achievement.id);
    if (filter.length > 0) {
      achievement.acStatus = filter[0].acStatus;
      achievement.acReceiveStatus = filter[0].acReceiveStatus;
    } else {
      achievement.acStatus = false;
      achievement.acReceiveStatus = false;
    }
    return achievement;
  }

  async onRefresh() {
    if (this.isLoading === false) {
      await this.getData();
    }
  }
  onChangeSegment(event) {
    this.currentSegment = event.detail.value;
  }

  async onClickAc(achievement) {
    if (
      achievement.acStatus === true &&
      achievement.acReceiveStatus === false
    ) {
      achievement.acReceiveStatus = true;
      //collect points
      await this.gamificationService.updateAchievementStatus(
        achievement.id,
        achievement
      );
      const pointsEarned = achievement.acPoints;
      const userProfile = await this.userDataService
        .getProfile()
        .pipe(first())
        .toPromise();
      if (userProfile) {
        if (userProfile.points === undefined) {
          userProfile.points = 0;
        }
        const totalPoints = userProfile.points + pointsEarned;
        await this.gamificationService.updatePoints(totalPoints);

        if (totalPoints > 0) {
          const coinBadge = '61rXhyFMEevtVYdZXfKU';
          const badgeStatus = await this.gamificationService.checkBadgeStatus(
            coinBadge
          );
          if (badgeStatus !== undefined && badgeStatus !== null) {
          } else {
            const badge = new Badge();
            badge.id = coinBadge;
            badge.badgeId = 3;
            badge.badgeStatus = true;
            await this.gamificationService
              .updateBadgeStatus(coinBadge, badge)
              .then(() => {
                this.feedbackService.showAlert(
                  'You Earned A Badge!',
                  'Congratulations! You have earned a badge by earning points.' +
                    'You can check the earned badges at the badge page.'
                );
              })
              .catch((error) => console.log(error));
          }
        }
      } else {
        console.log('error');
      }
    }
  }
}
