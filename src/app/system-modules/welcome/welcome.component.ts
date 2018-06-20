import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NavigationEnd, Router} from '@angular/router';

import {environment} from '../../../environments/environment';

import {HeaderEventEmitterService} from './../../services/event-emitters/header-event-emitter.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  title = '';
  platformName: string;
  platformLogo: string;
  secondaryLogo: string;


  constructor(
      private _headerEventEmitter: HeaderEventEmitterService,
      private titleService: Title) {
    this.title = environment.title;
    this.titleService.setTitle(this.title);
    this.platformName = environment.platform;
    this.platformLogo = environment.logo;
    this.secondaryLogo = environment.secondary_logo;
  }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('LASHMA');
    this._headerEventEmitter.setMinorRouteUrl('Welcome Page');
  }
}
