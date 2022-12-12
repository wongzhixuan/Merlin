import { Component, OnInit } from '@angular/core';
import { collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';
import { CourseData } from 'src/app/modal/course';
import { User} from 'src/app/modal/user';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  //myCourses = [];
  //allCourses = [];
  //showFilter = false;
  //selectedFilter: CourseData[] = [];
  isLoading = false;
  userList = [];
  default = 'assets/images/user.png';
  gold = 'assets/icon/gold.png';
  silver = 'assets/icon/silver.png';
  bronze = 'assets/icon/bronze.png';
  constructor(private userDataService: UserDataService, private router: Router, private firestore: Firestore) {}

  async ngOnInit() {
    this.isLoading = true;
    //this.userList = await this.userDataService.getUsersOrderByPoints();
    await this.getUsers();
    //console.log(this.userList);
    this.isLoading = false;
  }
  onShowFilter() {}
  onSelectFilter(event) {}

  onReset() {}
  getUsers(){
    this.userList = [];
    const path = 'users';
    const userRef = collection(this.firestore, path);
    const queryRef = query(userRef, orderBy('points', 'desc'));
    return collectionData(queryRef, { idField: 'id' })
      .subscribe((data)=>this.userList = data);
  }

  onUserClick(user){
    this.userDataService.setSelectedUser(user);
    this.router.navigateByUrl('main/leaderboard/user-details', {
      state: { userdetails: true },
    });
  }

  async onRefresh(){
    this.userList = [];
    this.isLoading = true;
    // this.userList = await this.userDataService.getUsersOrderByPoints();
    // console.log(this.userList);
    this.getUsers();
    this.isLoading = false;
  }
}
