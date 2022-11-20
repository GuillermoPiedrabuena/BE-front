import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceBanksService {
  private url = 'https://listadobancos.herokuapp.com/api/listado_banco';

  constructor(private http: HttpClient) { }
  getBanks() {
    return this.http.get(this.url);
  }
}
