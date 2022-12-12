import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterContentInit,
} from '@angular/core';
import SwiperCore from 'swiper';
import { IonicSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { getMetadata } from '@angular/fire/storage';
SwiperCore.use([IonicSlides]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, AfterContentInit {
  currentPage;
  courseList = [];
  enrollList = [];
  lecturerList = [];
  recentVisit = [];
  myCourses = [];
  allCourses = [];
  isLoaded = [false, false, false];
  constructor(private router: Router, private courseService: CourseService) {}

  async ngOnInit() {
    this.currentPage = 'Dashboard';
    await this.getData();
  }

  ngAfterContentInit() {}
  async ionViewWillEnter() {
    await this.getData();
  }

  async getData() {
    this.courseList = [];
    this.enrollList = [];
    this.lecturerList = [];

    this.courseList = await this.courseService.getCourseList();
    this.enrollList = await this.courseService.getEnrollList();
    this.lecturerList = await this.courseService.getLecturerList();

    console.log(
      'course',
      this.courseList,
      '\nenroll',
      this.enrollList,
      '\nlecturers',
      this.lecturerList
    );
    this.courseService.setCourseList(this.courseList);
    this.courseService.setLecturerList(this.lecturerList);
    this.courseService.setEnrollList(this.enrollList);
    this.myCourses = this.courseService.formatMyCourses();
    this.isLoaded[1] = true;
    this.recentVisit = this.myCourses.slice(0, 5);
    this.isLoaded[0] = true;
    this.allCourses = this.courseService.formatAllCourses();
    this.isLoaded[2] = true;
    console.log(
      'Recent',
      this.recentVisit,
      'my',
      this.myCourses,
      'all',
      this.allCourses
    );
  }

  onSeeAllClick(section) {
    if (section === 0) {
      this.router.navigateByUrl('main/tabs/dashboard/courses', {
        state: { recent: true },
      });
    } else if (section === 1) {
      this.courseService.setMyCourseList(this.myCourses);
      this.router.navigateByUrl('main/tabs/dashboard/courses', {
        state: { mycourses: true },
      });
    } else if (section === 2) {
      this.courseService.setAllCourseList(this.allCourses);
      this.router.navigateByUrl('main/tabs/dashboard/courses', {
        state: { all: true },
      });
    }
  }

  onCardClick(cardData?) {
    if (cardData !== null && cardData !== undefined) {
      this.courseService.setCurrentCourse(cardData);
      this.router.navigateByUrl('main/tabs/dashboard/courses', {
        state: { course: true },
      });
    }
  }
}
