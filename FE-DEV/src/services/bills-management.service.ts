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
export class BillsManagementService {

  constructor(private http : HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getBills(bill_type:string): Observable<any> {
    return this.http.get(endpoint + bill_type).pipe(
      map(this.extractData));
  }

  getBill(bill_type:string, id : string) : Observable<any> {
    return this.http.get(endpoint + bill_type + '/' + id).pipe(
      map(this.extractData)
    );
  }

  addBill (bill_type :string, bill): Observable<any> {
    //console.log(item);
    return this.http.post<any>(endpoint + bill_type, JSON.stringify(bill), httpOptions).pipe(
      tap((bill) => console.log(`added bill w/ id=${bill.id}`)),
      catchError(this.handleError<any>('addBill'))
    );
  }

  updateBill (bill_type :string, id : string, bill): Observable<any> {
    return this.http.put(endpoint + bill_type + '/' + id, JSON.stringify(bill), httpOptions).pipe(
      tap(_ => console.log(`updated bill w/ id=${id}`)),
      catchError(this.handleError<any>('updateBill'))
    );
  }

  updateDueDate(bill_type :string, id : string, date : Date) : Observable<any> {
    return this.http.put(endpoint + bill_type + '/' + id + '/' + date, httpOptions).pipe(
      tap(_ => console.log(`updated due date of bill w/ id=${id}`)),
      catchError(this.handleError<any>('updateDueDate'))
    );
  }

  deleteBill (bill_type :string, id : string): Observable<any> {
    return this.http.delete<any>(endpoint + bill_type + '/' + id, httpOptions).pipe(
      tap(_ => console.log(`deleted bill w/ id=${id}`)),
      catchError(this.handleError<any>('deleteBill'))
    );
  }

  saveDeposite (bill_type : string, billId : string, custId : string,  deposite) : Observable<any> {
    return this.http.put<any>(endpoint + bill_type + '/deposite/' + billId + '/' + custId, JSON.stringify(deposite), httpOptions).pipe(
      tap(_ => console.log(`deposite into bill w/ id=${billId}`)),
      catchError(this.handleError<any>('saveDeposite'))
    );
  }

  deleteDeposite (bill_type : string, billId : string, depositeId : string) : Observable<any> {
    return this.http.delete<any>(endpoint + bill_type + '/deposite/' + billId + '/' + depositeId, httpOptions).pipe(
      tap(_ => console.log(`deposite deleted from bill w/ id=${billId}`)),
      catchError(this.handleError<any>('deleteDeposite'))
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
