import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeaderEventEmitterService } from '../../services/event-emitters/header-event-emitter.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  @Output() showMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  appsearchControl = new FormControl();
  pageInView: String = '';
  minorPageInView: String = '';

  constructor(
    private _headerEventEmitter: HeaderEventEmitterService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
    this._headerEventEmitter.announcedMinorUrl.subscribe(url => {
      this.minorPageInView = url;
    });
  }

  menu_show() {
    this.showMenu.emit(true);
  }
  

}
