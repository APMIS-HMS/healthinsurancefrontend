import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ModuleService } from '../../services/index';

@Component({
  selector: 'app-access-management',
  templateUrl: './access-management.component.html',
  styleUrls: ['./access-management.component.scss']
})
export class AccessManagementComponent implements OnInit {
  accessFormGroup: FormGroup;
  listsearchControl = new FormControl();
  modules: any = <any>[];
  disableAddAccessBtn: Boolean = false;
  addAccessBtnText: String = '<i class="fa fa-plus"></i> ADD';

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastsManager,
    private _moduleService: ModuleService
  ) { }

  ngOnInit() {
    this._getModules();

    this.accessFormGroup = this._fb.group({
      module: ['', [<any>Validators.required]],
      accessibility: ['', [<any>Validators.required]]
    });

  }

  onClickAddAccess(valid: Boolean, value: any) {
    if(valid) {
      console.log(value);
    } else {
      this._toastr.error('Some fields are empty', 'Error!');
    }
  }

  private _getModules() {
    this._moduleService.findAll().then((res: any) => {
      this.modules = res.data;
    }).catch(err => console.log(err));
  }
}
