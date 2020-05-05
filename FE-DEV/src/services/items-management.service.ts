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
export class ItemsManagementService {

  constructor(private http : HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  getItems(item_type:string): Observable<any> {
    return this.http.get(endpoint + item_type).pipe(
      map(this.extractData));
  }

  getItem(item_type:string, id : string) : Observable<any> {
    return this.http.get(endpoint + item_type + '/id/' + id).pipe(
      map(this.extractData)
    );
  }

  getItemByName(item_type:string, name : string, brand : string) : Observable<any> {
    if(item_type == "automobiles")
      return this.http.get(endpoint + item_type + '/name/' + brand + '/' + name).pipe(
        map(this.extractData)
      );
      
    return this.http.get(endpoint + item_type + '/name/' + name).pipe(
      map(this.extractData)
    );
  }

  addItem (item_type :string, item): Observable<any> {
    //console.log(item);
    return this.http.post<any>(endpoint + item_type, JSON.stringify(item), httpOptions).pipe(
      tap((item) => console.log(`added item w/ id=${item.id}`)),
      catchError(this.handleError<any>('addItem'))
    );
  }

  updateItem (item_type :string, id : string, item): Observable<any> {
    return this.http.put(endpoint + item_type + '/' + id, JSON.stringify(item), httpOptions).pipe(
      tap(_ => console.log(`updated item w/ id=${id}`)),
      catchError(this.handleError<any>('updatItem'))
    );
  }

  deleteItem (item_type :string, id : string): Observable<any> {
    return this.http.delete<any>(endpoint + item_type + '/' + id, httpOptions).pipe(
      tap(_ => console.log(`deleted item w/ id=${id}`)),
      catchError(this.handleError<any>('deleteItem'))
    );
  }

  addModel (brand_id : string, model): Observable<any> {
    //console.log(item);
    return this.http.post<any>(endpoint + 'automobiles/model/' + brand_id , JSON.stringify(model), httpOptions).pipe(
      tap((msg) => console.log(msg.message)),
      catchError(this.handleError<any>('addModel'))
    );
  }

  updateModel (brand_id : string, model): Observable<any> {
    return this.http.put(endpoint + 'automobiles/model/' + brand_id, JSON.stringify(model), httpOptions).pipe(
      tap(_ => console.log(`updated model`)),
      catchError(this.handleError<any>('updatModel'))
    );
  }

  deleteModel (brand_id : string, model_id :string): Observable<any> {
    return this.http.delete<any>(endpoint + 'automobiles/model/' + brand_id + '/' + model_id, httpOptions).pipe(
      tap(_ => console.log(_.message)),
      catchError(this.handleError<any>('deleteModel'))
    );
  }
  //For Automobiles' Model Management
  // addModel(brand_id : string, new_model:Submodels) : Brands {
  //   let new_brand = new Brands();
  //   this.getItem('automobiles', brand_id)
  //     .subscribe(brand => {
  //       brand.submodels.push(new_model);
  //       this.updateItem('automobiles', brand_id, brand)
  //         .subscribe(brand => {
  //           new_brand = brand as Brands;
  //         });
  //     })

  //   return new_brand;
  // }

  // updateModel(brand_id : string, updated_model : Submodels) : Brands {
  //   let updated_brand = new Brands();
  //   this.getItem('automobiles', brand_id)
  //     .subscribe(brand => {
  //       updated_brand = brand as Brands;
  //       updated_brand.submodels.forEach(sm => {
  //         if(sm._id == updated_model._id)
  //         {
  //           sm = updated_model;
  //         }
  //       });
  //     })
  // }
  


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
