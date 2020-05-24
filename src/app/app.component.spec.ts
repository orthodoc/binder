import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

import { Plugins } from '@capacitor/core';

describe('AppComponent', () => {
  const platformStub = {
    ready: jasmine.createSpy('ready').and.callThrough(),
    is: jasmine.createSpy('is').and.returnValue('capacitor'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: Platform, useValue: platformStub }],
      imports: [RouterTestingModule.withRoutes([])],
    }).compileComponents();
  }));

  function setup() {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.componentInstance;
    return { fixture, component };
  }

  it('should create the app', async () => {
    const component = setup();
    expect(component).toBeTruthy();
  });

  it('should initialize the app', async () => {
    const { SplashScreen } = Plugins;
    const { component } = setup();
    await component.ngOnInit();
    expect(platformStub.ready).toHaveBeenCalled();
    if (platformStub.is('capacitor')) {
      expect(SplashScreen.hide());
    }
    const splashScreenElement: HTMLElement = document.getElementById(
      'splash-screen'
    );
    expect(splashScreenElement).toBeNull();
  });

  it('should have menu labels', async () => {
    const { fixture } = setup();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-label');
    expect(menuItems.length).toEqual(2);
    expect(menuItems[0].textContent).toContain('Home');
    expect(menuItems[1].textContent).toContain('Cases');
  });

  it('should have urls', async () => {
    const { fixture } = setup();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-item');
    expect(menuItems.length).toEqual(2);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual(
      '/home'
    );
    expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual(
      '/cases'
    );
  });
});
