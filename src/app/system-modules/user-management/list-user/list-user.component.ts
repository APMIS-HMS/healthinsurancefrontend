import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderEventEmitterService } from '../../../services/event-emitters/header-event-emitter.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent implements OnInit {
  users: any = <any>[];
  loading: Boolean = true;
  closeResult: String;

  constructor(
    private _toastr: ToastsManager,
    private modalService: NgbModal,
    private _headerEventEmitter: HeaderEventEmitterService,
  ) { }

  ngOnInit() {
    this._headerEventEmitter.setRouteUrl('List Users');
    this._toastr.success('Beneficiary has been created successfully!', 'Success!');
  }

  open(content) {
    // this.modalService.open('Hi tehre!');
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
