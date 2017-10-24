import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-modal-payment-mode',
  templateUrl: './modal-payment-mode.component.html',
  styleUrls: ['./modal-payment-mode.component.scss']
})
export class ModalPaymentModeComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
  }
  modalClose_event() {
    this.closeModal.emit(true);
  }
}
