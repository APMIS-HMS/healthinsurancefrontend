import { Component, OnInit } from '@angular/core';
import { HeaderEventEmitterService } from './../../services/event-emitters/header-event-emitter.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {



  constructor(
    private _headerEventEmitter: HeaderEventEmitterService
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('ASHIA');
    this._headerEventEmitter.setMinorRouteUrl('Welcome Page');
  }

}
