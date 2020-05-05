import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { User } from 'src/models/user';

const endpoint = 'http://localhost:3000/api/users/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http : HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  verifyUser(user : User) : Observable<any> {
    return this.http.put(endpoint + 'verify', JSON.stringify(user), httpOptions).pipe(
      tap((msg) => console.log(msg)),
      catchError(this.handleError<any>('verifyUser'))
    );
  }

  resetPassword(data) : Observable<any> {
    return this.http.put(endpoint + 'reset', JSON.stringify(data), httpOptions).pipe(
      tap((msg) => console.log(msg)),
      catchError(this.handleError<any>('verifyUser'))
    );
  }

  getUsers() : Observable<any> {
    return this.http.get(endpoint, httpOptions).pipe(
      map(this.extractData)
    );
  }

  getUser(uid : string) : Observable<any> {
    return this.http.get(endpoint + uid, httpOptions).pipe(
      map(this.extractData)
    );
  }

  addUser (user : User): Observable<any> {
    return this.http.post<any>(endpoint, JSON.stringify(user), httpOptions).pipe(
      tap((u) => console.log(`added user w/ id=${u.id}`)),
      catchError(this.handleError<any>('addUser'))
    );
  }

  updateUser (id : string, user): Observable<any> {
    return this.http.put(endpoint + id, JSON.stringify(user), httpOptions).pipe(
      tap(_ => console.log(`updated user w/ id=${id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  deleteUser (id : string): Observable<any> {
    return this.http.delete<any>(endpoint + id, httpOptions).pipe(
      tap(_ => console.log(`deleted user w/ id=${id}`)),
      catchError(this.handleError<any>('deleteUser'))
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
