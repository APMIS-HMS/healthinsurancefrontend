import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'; 



@Component({
  selector: 'app-modal-add-organization-payment',
  templateUrl: './modal-add-organization-payment.component.html',
  styleUrls: ['./modal-add-organization-payment.component.scss']
})
export class ModalAddOrganizationPaymentComponent implements OnInit {
 
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
