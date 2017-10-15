import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-pre-authorization-list',
  templateUrl: './pre-authorization-list.component.html',
  styleUrls: ['./pre-authorization-list.component.scss']
})
export class PreAuthorizationListComponent implements OnInit {

  listsearchControl = new FormControl();
  filterHiaControl = new FormControl('All');
  hospitalControl = new FormControl();
  planControl = new FormControl();
  
  constructor() { }

  ngOnInit() {
  }

}
