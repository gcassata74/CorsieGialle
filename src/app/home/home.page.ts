import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit  {

  backButtonSubscription; 
   
  constructor ( 
                public navCtrl: NavController,
                private platform: Platform
                ) { }

  ngOnInit() { }

  ionViewDidEnter() {

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
          navigator['app'].exitApp();
    });

  }

  ionViewWillLeave() {   
    this.backButtonSubscription.unsubscribe();
  }

}
