import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { FeedbackService } from 'src/app/services/feedback.service';
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
  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private courseService: CourseService,
    private location: Location
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

  onLessonMaterialClick(url) {
    window.open(url, '_system');
  }

  onEnrollCourse() {
    if (this.currentCourse !== null) {
      this.courseService
        .enrolCourse(this.currentCourse.courseId, this.currentCourse.id)
        .then((result) => {
          this.feedbackService.showAlert('Enroll Success', 'You can now explore more.');
          this.unenrolled = false;
        })
        .catch((error) => {
          this.feedbackService.showAlert('Enroll Failed', 'Please try again!' + error);
        });
    }
  }

  ionAlertDidDismiss(){

  }
}
