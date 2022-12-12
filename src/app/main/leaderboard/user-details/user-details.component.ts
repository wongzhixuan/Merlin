import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  title = null;
  currentUser = null;
  default = 'assets/images/user.png';
  isLoaded = false;
  genderIcon = '../../assets/icon/gender.png';
  nationalityIcon = '../../assets/icon/countries.png';
  schoolIcon = '../../assets/icon/school.png';
  constructor(private userDataService: UserDataService) { }

  ngOnInit() {
    if(history.state.userdetails === true){
      this.currentUser = this.userDataService.getSelectedUser();
      this.title = 'Details';
    }
    if(this.currentUser !== null){
      this.isLoaded = true;
    }
  }

}
