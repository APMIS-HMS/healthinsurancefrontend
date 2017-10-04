import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {

  roleFormGroup: FormGroup;
  listsearchControl = new FormControl();

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.roleFormGroup = this._fb.group({
      roleName: ['', [<any>Validators.required]]
    });

  }

}
