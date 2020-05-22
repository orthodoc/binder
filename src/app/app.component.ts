import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    if (this.platform.is('capacitor')) {
      SplashScreen.hide();
    }
    this.handleSplashScreen();
  }

  ngOnInit() {
    /* const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    } */
  }

  async handleSplashScreen() {
    const splashScreen: HTMLElement = document.getElementById('splash-screen');
    setTimeout(() => {
      splashScreen.remove();
    }, 1503);
  }
}
