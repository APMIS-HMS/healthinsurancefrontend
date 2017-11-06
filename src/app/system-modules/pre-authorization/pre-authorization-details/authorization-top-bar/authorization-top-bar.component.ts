import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-authorization-top-bar',
  templateUrl: './authorization-top-bar.component.html',
  styleUrls: ['./authorization-top-bar.component.scss']
})
export class AuthorizationTopBarComponent implements OnInit {
  @Input() selectedAuthorization: any;

  constructor() { }

  ngOnInit() {
    console.log(this.selectedAuthorization);
  }

}
