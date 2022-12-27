import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit, AfterContentInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SearchableSelectableComponent } from 'src/app/custom-inputs/searchable-selectable/searchable-selectable.component';
import { Assignment, CourseData } from 'src/app/modal/course';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.scss'],
})
export class AssignmentsComponent implements OnInit, AfterContentInit {
  @ViewChild('select') select: SearchableSelectableComponent;
  currentSegment = 'a';
  myCourses = [];
  //allCourses = [];
  showFilter = false;
  selectedFilter: CourseData[] = [];
  allAssignments = [];
  assignmentList = [];
  assignedList = [];
  completedList = [];
  isLoading = false;
  courseDetails = null;
  constructor(private courseService: CourseService, private router: Router) {}

  async ngOnInit() {
    //await this.getData();
  }
  async ionViewDidEnter(){
    if(this.isLoading === false){
    await this.getData();
    }
  }
  ngAfterContentInit(): void {}
  async getData() {
    this.isLoading = true;
    let courseList = [];
    let enrollList = [];
    let lecturerList = [];
    this.completedList = [];
    this.assignedList = [];
    courseList = await this.courseService.getCourseList();
    enrollList = await this.courseService.getEnrollList();
    lecturerList = await this.courseService.getLecturerList();

    this.myCourses = this.courseService.formatMyCourses();
    this.courseService.setMyCourseList(this.myCourses);
    //this.allCourses = this.courseService.formatAllCourses();
    this.allAssignments = await this.courseService.getAllAssignments();
    if (this.myCourses.length > 0) {
      this.myCourses.forEach(async (course) => {
        const currentCourse = await this.courseService.getCourse(
          course.courseId
        );
        const courseDocId = currentCourse[0].id;
        console.log('courseDocId', courseDocId);
        if (courseDocId) {
          const find = this.allAssignments.filter(
            (each) => each.courseId === course.courseId
          );

          find.forEach(async (el) => {
            const completed = await this.courseService.checkAssignmentStatus(
              courseDocId,
              el.assignmentId
            );
            const assignment: Assignment = new Assignment();
            assignment.assignmentId = el.assignmentId;
            assignment.courseName = course.courseName;
            assignment.courseId = el.courseId;
            assignment.title = el.title;
            assignment.description = el.description;
            assignment.order = el.order;
            assignment.points = el.points;
            assignment.references = el.references;
            assignment.startDate = el.startDate;
            assignment.dueDate = el.dueDate;
            assignment.id = el.id;
            assignment.courseDocId = courseDocId;
            if (completed.length > 0) {
              assignment.status = completed[0].status;
              assignment.submission = completed[0].submission;
            } else {
              assignment.status = false;
            }
            const temp = this.assignmentList;
            this.assignmentList = temp.filter(
              (ass) => ass.assignmentId !== assignment.assignmentId
            );
            this.completedList = this.completedList.filter(
              (ass) => ass.assignmentId !== assignment.assignmentId
            );
            this.assignedList = this.assignedList.filter(
              (ass) => ass.assignmentId !== assignment.assignmentId
            );
            this.assignmentList.push(assignment);
            if (assignment.status === true) {
              this.completedList.push(assignment);
            } else {
              this.assignedList.push(assignment);
            }
          });
        }
      });
    }
    this.isLoading = false;
  }
  onChangeSegment(event) {
    this.currentSegment = event.detail.value;
  }

  async onShowFilter() {
    //this.myCourses = this.courseService.getMyCourseList();
    if (this.myCourses.length > 0) {
      this.showFilter = !this.showFilter;
      if(this.showFilter === false){
        this.onReset();
      }
    }
  }

  async onSelectFilter(event) {
    if (event.length > 0) {
      const course = event[0];
      const currentCourse = await this.courseService.getCourse(
        course.courseId
      );
      const courseDocId = currentCourse[0].id;
      console.log('courseDocId', courseDocId);
      this.isLoading = true;
      this.allAssignments = await this.courseService.getAllAssignments();
      this.completedList = [];
      this.assignedList = [];
      const find = this.allAssignments.filter(
        (each) => each.courseId === course.courseId
      );
      find.forEach(async (el) => {
        const completed = await this.courseService.checkAssignmentStatus(
          courseDocId,
          el.assignmentId
        );
        const assignment: Assignment = new Assignment();
        assignment.assignmentId = el.assignmentId;
        assignment.courseName = course.courseName;
        assignment.courseId = el.courseId;
        assignment.title = el.title;
        assignment.description = el.description;
        assignment.order = el.order;
        assignment.points = el.points;
        assignment.references = el.references;
        assignment.startDate = el.startDate;
        assignment.dueDate = el.dueDate;
        assignment.id = el.id;
        assignment.courseDocId = courseDocId;
        if (completed.length > 0) {
          assignment.status = completed[0].status;
          assignment.submission = completed[0].submission;
        } else {
          assignment.status = false;
        }
        const temp = this.assignmentList;
        this.assignmentList = temp.filter(
          (ass) => ass.assignmentId !== assignment.assignmentId
        );
        this.completedList = this.completedList.filter(
          (ass) => ass.assignmentId !== assignment.assignmentId
        );
        this.assignedList = this.assignedList.filter(
          (ass) => ass.assignmentId !== assignment.assignmentId
        );
        this.assignmentList.push(assignment);
        if (assignment.status === true) {
          this.completedList.push(assignment);
        } else {
          this.assignedList.push(assignment);
        }
      });
      this.isLoading = false;
    }
    else{
      this.onReset();
    }
  }

  assignmentDetails(currentAssignment) {
    this.courseService.setCurrentAssignment(currentAssignment);
    this.router.navigateByUrl('main/tabs/assignments/details', {
      state: { details: true },
    });
  }
  onReset() {
    this.selectedFilter = [];
    this.select.selected = [];
    this.getData();
  }
}
