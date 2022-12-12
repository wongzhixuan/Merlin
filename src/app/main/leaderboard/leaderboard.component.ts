import { Component, OnInit } from '@angular/core';
import { CourseData } from 'src/app/modal/course';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  myCourses = [];
  //allCourses = [];
  showFilter = false;
  selectedFilter: CourseData[] = [];
  isLoading = false;
  userList = [];
  constructor() {}

  ngOnInit() {}
  onShowFilter() {}
  onSelectFilter(event) {}

  onReset(){

  }
}
