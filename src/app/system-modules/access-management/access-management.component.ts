import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss']
})
export class AccessManagementComponent implements OnInit {

  accessFormGroup: FormGroup;
  listsearchControl = new FormControl();

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.accessFormGroup = this._fb.group({
      module: ['', [<any>Validators.required]],
      accessibility: ['', [<any>Validators.required]]
    });

  }

}
