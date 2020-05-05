import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators'

const endpoint = 'http://localhost:3000/api/configs/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ConfigManagementServiceService {

  constructor(private http : HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getConfigs(): Observable<any> {
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  getConfig(id : string) : Observable<any> {
    return this.http.get(endpoint + id).pipe(
      map(this.extractData)
    );
  }

  getConfigByName(name : string) : Observable<any> {
    return this.http.get(endpoint + 'name/' + name).pipe(
      map(this.extractData)
    );
  }

  addConfig (new_config): Observable<any> {
    return this.http.post<any>(endpoint, JSON.stringify(new_config), httpOptions).pipe(
      tap((config) => console.log(`added config w/ id=${config.id}`)),
      catchError(this.handleError<any>('addConfig'))
    );
  }

  updateConfig (id : string, config): Observable<any> {
    return this.http.put(endpoint + id, JSON.stringify(config), httpOptions).pipe(
      tap(_ => console.log(`updated config w/ id=${id}`)),
      catchError(this.handleError<any>('updatConfig'))
    );
  }

  deleteConfig (id : string): Observable<any> {
    return this.http.delete<any>(endpoint +  id, httpOptions).pipe(
      tap(_ => console.log(`deleted config w/ id=${id}`)),
      catchError(this.handleError<any>('deleteCondfig'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
