import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
//import * from '../../../rxjs/rxjs.extentions';
import 'rxjs/add/operator/filter';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-list-platform',
  templateUrl: './list-platform.component.html',
  styleUrls: ['./list-platform.component.scss']
})
export class ListPlatformComponent implements OnInit {

  previousUrl: string = "";
  
    constructor(
      private _router: Router,
      private _headerEventEmitter: HeaderEventEmitterService
    ) {
      this._router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe(e => {
          console.log('previous:', e);
          console.log('prev:', this.previousUrl);
          //this.previousUrl = e.url;
        });
     }
  
    ngOnInit() {
      this._headerEventEmitter.setRouteUrl('Platform List');
      this._headerEventEmitter.setMinorRouteUrl('All Platforms');
    }
  
  }
  