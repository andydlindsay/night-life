import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/filter';

@Injectable()
export class YelpService {

  constructor(
    private http: Http
  ) { }

  public getBars(location, itemsPerPage, currentPage): any {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const queryString = '?itemsperpage=' + itemsPerPage + '&currentpage=' + currentPage;
    return this.http.get('http://localhost:8080/api/yelp/search/' + location + queryString, { headers })
      .map(res => res.json());
  }

  public addBar(businessId) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');



  }

  public setSearchTerm(searchTerm) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');



  }

}
