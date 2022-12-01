import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {

  }

  ionViewDidEnter(){
    this.menuCtrl.enable(true);
  }
}
