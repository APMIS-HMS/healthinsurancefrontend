import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class OwnershipService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('facilityownerships');
    this._socket = _socketService.getService('facilityownerships');
    this._socket.on('created', function (facilityownerships) {
    });
  }

  find(query: any) {
    return this._socket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(ownership: any) {
    return this._socket.create(ownership);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}