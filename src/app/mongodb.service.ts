import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MongodbService {
  
  constructor(private http: HttpClient) { }

  getOneUser(rut: string){
    const url: string = `http://localhost:8080/users/getOne?rut=${rut}`;
    return this.http.get(url);
  }

  insertDestination(tef: object){
    let callbackreturn: any;
    const url: string = `http://localhost:8080/destinations/insertOne`;
    const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
    return this.http.post(url, JSON.stringify(tef), {
        headers: headers
      }).pipe(
        map(() => {
          return callbackreturn = this.http.get(`http://localhost:8080/destinations/getAll`)
          .subscribe({
              error: (e: any) => {},
              next: (val) => {
                sessionStorage.setItem('destinations', JSON.stringify(val));
              }
          })
        })
      )
    }

  insertTef(tef: object){
    let callbackreturn: any;
    const url: string = `http://localhost:8080/tefs/insertOne`;
    const headers = new HttpHeaders()
            .set('Content-Type', 'application/json');
  
    return this.http.post(url, JSON.stringify(tef), {
        headers: headers
      }).pipe(
        map(() => {
          return callbackreturn = this.http.get(`http://localhost:8080/tefs/getAll`)
          .subscribe(
            {
              error: (e: any) => {},
              next: (val) => {
                sessionStorage.setItem('tefs', JSON.stringify(val));
              }
          }
          )
        })
      )
    }

  getAllTefs(){
    const url: string = `http://localhost:8080/tefs/getAll`;
    return this.http.get(url);
  }

  getAllDestinations(){
    const url: string = `http://localhost:8080/destinations/getAll`;
    return this.http.get(url);
  }
}
