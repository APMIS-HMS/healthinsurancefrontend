import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class JsonDataService {

  private jsonFileURL: string = "assets/data.json";
  constructor(private http: Http) { }

  getPolicy(): Observable<any[]> {
    return this.http.get(this.jsonFileURL).map((response: any) => {
      return <any[]>response.json()
    }).catch(this.handleError);
  }
  //    
  private handleError(errorResponse: any) {
    console.log(errorResponse.statusText);
    return Observable.throw(errorResponse.json().error || "Server error");
  }
}
