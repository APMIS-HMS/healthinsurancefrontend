import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderEventEmitterService {
	private _urlAnnounceSource = new Subject<string>();
	private _urlAnnounceMinorSource = new Subject<string>();
	announcedUrl = this._urlAnnounceSource.asObservable();
	announcedMinorUrl = this._urlAnnounceMinorSource.asObservable();
	
	constructor() {}

	setRouteUrl(value: string) {
		this._urlAnnounceSource.next(value);
	}

	setMinorRouteUrl(value: string) {
		this._urlAnnounceMinorSource.next(value);
	}
}
