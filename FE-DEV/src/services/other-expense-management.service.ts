import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'http://localhost:3000/api/expenses/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class OtherExpenseManagementService {

  constructor(private http : HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getExpenses(): Observable<any> {
    return this.http.get(endpoint).pipe(
      map(this.extractData));
  }

  getExpensesByDate(date : Date): Observable<any> {
    return this.http.get(endpoint + '/' + date).pipe(
      map(this.extractData));
  }

  getExpense(id : string) : Observable<any> {
    return this.http.get(endpoint + id).pipe(
      map(this.extractData)
    );
  }

  addExpense (expense): Observable<any> {
    return this.http.post<any>(endpoint, JSON.stringify(expense), httpOptions).pipe(
      tap((exp) => console.log(`added expense w/ id=${exp.id}`)),
      catchError(this.handleError<any>('addExpense'))
    );
  }

  updateExpense (id : string, expense): Observable<any> {
    return this.http.put(endpoint + id, JSON.stringify(expense), httpOptions).pipe(
      tap(_ => console.log(`updated expense w/ id=${id}`)),
      catchError(this.handleError<any>('updatExpense'))
    );
  }

  deleteExpense (id : string): Observable<any> {
    return this.http.delete<any>(endpoint +  id, httpOptions).pipe(
      tap(_ => console.log(`deleted expense w/ id=${id}`)),
      catchError(this.handleError<any>('deleteExpense'))
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
