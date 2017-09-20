import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-platform',
  templateUrl: './new-platform.component.html',
  styleUrls: ['./new-platform.component.scss']
})
export class NewPlatformComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('New platform');
  }

}
