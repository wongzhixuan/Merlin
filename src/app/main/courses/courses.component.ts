import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LessonData } from 'src/app/modal/course';
import { Badge } from 'src/app/modal/gamification';
import { UserLog } from 'src/app/modal/log';
import { CourseService } from 'src/app/services/course.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GamificationService } from 'src/app/services/gamification.service';
import { LogService } from 'src/app/services/log.service';
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  defaultToolImg = '../../../assets/icon/tools.png';
  isLoaded = false;
  title = null;
  currentCourse = null;
  myCourses = [];
  allCourses = [];
  isAllCourses = false;
  isEnrolledCourses = false;
  isCourseDetails = false;
  displayLessonDetails = [false];
  lessonList = [];
  nolesson = false;
  unenrolled = false;
  enrolledCourses = [];
  lessonProgress = null;
  totalProgress = 0;
  currentProgress = 0;
  userLog = null;
  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private courseService: CourseService,
    private location: Location,
    private gamificationService: GamificationService,
    private logService: LogService
  ) {}

  async ngOnInit() {
    if (history.state.mycourses === true) {
      this.title = 'My Courses';
      this.myCourses = this.courseService.getMyCourseList();
      this.isEnrolledCourses = true;
    }

    if (history.state.all === true) {
      this.title = 'All Courses';
      this.allCourses = this.courseService.getAllCourseList();
      this.isAllCourses = true;
    }

    if (history.state.course === true) {
      this.currentCourse = this.courseService.getCurrentCourse();
      this.title = 'Details';
      this.isCourseDetails = true;
      this.enrolledCourses = this.courseService.getEnrollListData();
    }

    if (
      !history.state.course &&
      !history.state.all &&
      !history.state.mycourses
    ) {
      this.location.back();
    }
    if (this.currentCourse !== null) {
      if (this.isCourseDetails === true) {


        this.lessonList = await this.courseService.getLessons(
          this.currentCourse.id
        );

        this.currentCourse.lessons = this.lessonList;
        console.log(this.currentCourse, this.lessonList);
        if (this.lessonList.length > 0) {
          this.nolesson = false;
        } else {
          this.nolesson = true;
        }
      }

      // check enrollment
      this.unenrolled = !this.enrolledCourses.some(
        (data) => data.courseId === this.currentCourse.courseId
      );
      if(!this.unenrolled){
        this.courseService.updateRecentVisit(this.currentCourse.courseId, this.currentCourse.id);
      }
      this.checkLessonProgress();

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
    }
  }

  async checkLessonProgress() {
    this.totalProgress = 0;
    this.currentProgress = 0;
    // check lesson progress
    if (this.currentCourse !== null) {
      this.lessonProgress = await this.courseService.getLessonProgress(
        this.currentCourse.id
      );
      for (const [index, element] of this.currentCourse.lessons.entries()) {
        const find = this.lessonProgress.filter(
          (each) => each.lessonId === element.lessonId
        );
        if (element.materials.length > 0) {
          for (const [j, mat] of element.materials.entries()) {
            this.totalProgress += 1;
            this.currentCourse.lessons[index].materials[j].status = false;
            if (find.length > 0) {
              if (
                find[0].materials.some(
                  (mat2) =>
                    mat2.materialId === mat.materialId && mat2.status === true
                )
              ) {
                this.currentCourse.lessons[index].materials[j].status = true;
                this.currentProgress += 1;
              }
            }
          }
        }
      }
    }
  }

  async onCardClick(cardData?) {
    if (cardData !== null) {
      this.currentCourse = cardData;
      this.title = 'Details';
      this.isCourseDetails = true;
      this.isAllCourses = false;
      this.isEnrolledCourses = false;
      if (this.currentCourse !== null && this.isCourseDetails === true) {
        this.lessonList = await this.courseService.getLessons(
          this.currentCourse.id
        );

        this.currentCourse.lessons = this.lessonList;
        if (this.lessonList.length > 0) {
          this.nolesson = false;
        } else {
          this.nolesson = true;
        }
      }
      console.log(this.currentCourse);
    }
  }

  onLessonClick(index) {
    this.displayLessonDetails[index] = !this.displayLessonDetails[index];
  }

  async onLessonMaterialClick(material, materialIndex, lessonIndex) {
    const currentLesson = this.currentCourse.lessons[lessonIndex];
    const currentMaterial = currentLesson.materials[materialIndex];
    if (currentMaterial.status === false) {
      currentMaterial.status = true;
      this.currentProgress += 1;
      this.courseService.updateLessonProgress(
        this.currentCourse.id,
        currentLesson.lessonId,
        currentLesson.materials
      );
      const progress = this.currentProgress / this.totalProgress;
      this.courseService.updateCourseProgress(progress, this.currentCourse.id);

      if (progress === 1) {
        //check badge
        const badge = new Badge();
        badge.id = 'v02DOrVg8Nh4eGoJFSFe';
        const badgeStatus = await this.gamificationService.checkBadgeStatus(
          badge.id
        );
        if (badgeStatus !== undefined && badgeStatus !== null) {
        } else {
          badge.badgeId = 5;
          badge.badgeStatus = true;
          this.gamificationService
            .updateBadgeStatus(badge.id, badge)
            .then(() => {
              this.feedbackService.showAlert(
                'You Earned A Badge!',
                'Congratulations! You have earned a badge by completing your first lesson.' +
                  'You can check the earned badges at the badge page.'
              );
            })
            .catch((error) => console.log(error));
        }
      }

      // update user log
      if (currentMaterial.type === 0) {
        // type 0 is Video
        this.userLog.videoLog = this.userLog.videoLog + 1;
        this.logService
          .updateUserLog(this.userLog)
          .then(() => {})
          .catch((error) => console.log(error));
      } else if (currentMaterial.type === 1) {
        // type 1 is Reading
        this.userLog.readLog = this.userLog.readLog + 1;
        this.logService
          .updateUserLog(this.userLog)
          .then(() => {})
          .catch((error) => console.log(error));
      }
    }

    console.log(this.currentProgress);
    window.open(material.url, '_system');
  }

  onEnrollCourse() {
    if (this.currentCourse !== null) {
      this.courseService
        .enrolCourse(this.currentCourse.courseId, this.currentCourse.id)
        .then((result) => {
          this.feedbackService.showAlert(
            'Enroll Success',
            'You can now explore more.'
          );
          this.unenrolled = false;
        })
        .catch((error) => {
          this.feedbackService.showAlert(
            'Enroll Failed',
            'Please try again!' + error
          );
        });
    }
  }

  onUpdateProgress() {
    if (this.currentCourse !== null) {
      this.courseService
        .updateCourseProgress(
          this.currentCourse.progress,
          this.currentCourse.id
        )
        .then((result) => {})
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
