import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Output() showMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

  appsearchControl = new FormControl();  

  constructor() { }

  ngOnInit() {
  }

  menu_show(){
    this.showMenu.emit(true);
  }

}
