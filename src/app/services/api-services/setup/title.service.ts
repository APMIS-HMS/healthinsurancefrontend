import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TitleService {
	public _socket;
	private _rest;
	constructor(
		private _socketService: SocketService,
		private _restService: RestService
	) {
		this._rest = _restService.getService('titles');
		this._socket = _socketService.getService('titles');
		this._socket.on('created', function (title) {
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

	create(title: any) {
		return this._socket.create(title);
	}

	remove(id: string, query: any) {
		return this._socket.remove(id, query);
	}

}