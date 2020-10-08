import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage  implements OnInit, OnDestroy, AfterViewInit  {

  backButtonSubscription; 
   
  constructor (private platform: Platform) { }

  ngOnInit() { }

  ngAfterViewInit() {

    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ngOnDestroy() {  
    this.backButtonSubscription.unsubscribe();
  }

}
