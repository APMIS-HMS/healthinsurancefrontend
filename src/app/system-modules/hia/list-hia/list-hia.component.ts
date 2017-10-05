import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-hia',
  templateUrl: './list-hia.component.html',
  styleUrls: ['./list-hia.component.scss']
})
export class ListHiaComponent implements OnInit {

  listsearchControl = new FormControl();
  filterTypeControl = new FormControl('All');
  createdByControl = new FormControl();
  utilizedByControl = new FormControl();
  statusControl = new FormControl('All');

  constructor() { }

  ngOnInit() {
  }

}
