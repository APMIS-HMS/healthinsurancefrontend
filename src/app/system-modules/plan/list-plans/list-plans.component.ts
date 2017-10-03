import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-plans',
  templateUrl: './list-plans.component.html',
  styleUrls: ['./list-plans.component.scss']
})
export class ListPlansComponent implements OnInit {

  listsearchControl = new FormControl();  
  filterTypeControl = new FormControl(); 
  createdByControl = new FormControl();  
  utilizedByControl = new FormControl();  
  statusControl = new FormControl();  

  constructor() { }

  ngOnInit() {
  }

}
