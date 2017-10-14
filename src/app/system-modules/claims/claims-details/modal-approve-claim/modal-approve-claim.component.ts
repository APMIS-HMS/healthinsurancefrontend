import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-approve-claim',
  templateUrl: './modal-approve-claim.component.html',
  styleUrls: ['./modal-approve-claim.component.scss']
})
export class ModalApproveClaimComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  modalClose_event() {
    this.closeModal.emit(true);
  }

}
