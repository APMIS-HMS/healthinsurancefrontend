import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-referals',
  templateUrl: './list-referals.component.html',
  styleUrls: ['./list-referals.component.scss']
})
export class ListReferalsComponent implements OnInit {

  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
