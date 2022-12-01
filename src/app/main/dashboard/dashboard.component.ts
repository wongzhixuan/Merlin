import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import SwiperCore, {  } from 'swiper';
import { IonicSlides } from '@ionic/angular';
import { Router } from '@angular/router';
SwiperCore.use([ IonicSlides]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  currentPage;
  constructor(private router: Router) { }

  ngOnInit() {
    this.currentPage = 'Dashboard';
  }
  onSeeAllClick(section){
    if(section === 0){
      this.router.navigateByUrl('main/tabs/dashboard/courses', {state: {recent: true}});
    }
  }
}
