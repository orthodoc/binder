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
  }

  ngOnInit() {
    this.handleSplashScreen();
  }

  async handleSplashScreen() {
    const splashScreen: HTMLElement = document.getElementById('splash-screen');
    await this.platform.ready();
    if (this.platform.is('capacitor')) {
      SplashScreen.hide();
    }
    setTimeout(() => {
      splashScreen.remove();
    }, 705);
  }
}
