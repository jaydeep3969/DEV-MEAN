import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const endpoint = 'http://localhost:3000/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {

  constructor(private http : HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getCustomers(cust_type:string): Observable<any> {
    return this.http.get(endpoint + cust_type).pipe(
      map(this.extractData));
  }

  getCustomer(cust_type:string, id : string) : Observable<any> {
    return this.http.get(endpoint + cust_type + '/' + id).pipe(
      map(this.extractData)
    );
  }

  addCustomer (cust_type :string, customer): Observable<any> {
    //console.log(item);
    return this.http.post<any>(endpoint + cust_type, JSON.stringify(customer), httpOptions).pipe(
      tap((customer) => console.log(`added customer w/ id=${customer.id}`)),
      catchError(this.handleError<any>('addCustomer'))
    );
  }

  updateCustomer (cust_type :string, id : string, customer): Observable<any> {
    return this.http.put(endpoint + cust_type + '/' + id, JSON.stringify(customer), httpOptions).pipe(
      tap(_ => console.log(`updated bill w/ id=${id}`)),
      catchError(this.handleError<any>('updateCustomer'))
    );
  }

  deleteCustomer (cust_type :string, id : string): Observable<any> {
    return this.http.delete<any>(endpoint + cust_type + '/' + id, httpOptions).pipe(
      tap(_ => console.log(`deleted customer w/ id=${id}`)),
      catchError(this.handleError<any>('deleteCustomer'))
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
