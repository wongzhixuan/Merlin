import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  isRecent = false;
  isMyCourses = false;
  isAllCourses = false;
  isLoaded = false;

  constructor(private router: Router) {}

  ngOnInit() {
    if(history.state.recent === true){
      this.isRecent = true;
    }
    console.log(history.state);
    console.log(history.state.recent);
  }


}
