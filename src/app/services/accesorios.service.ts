import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccesoriosService {

  completeToken: string

  constructor(private httpClient: HttpClient, private _api: ApiService) {
    const token= this._api.getToken()
    this.completeToken = `Bearer ${token}`;
   }

  getAccesorio(id: string): Observable<any>{
    return this.httpClient.get<any>(`${this._api.api_url}/accesorios/${id}`,{headers:{Authorization:this.completeToken}})
  }
  setAccesorio(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/accesorios/add`, data,{headers:{Authorization:this.completeToken}})
  }

  updateAccesorio(id: string, data): Observable<any>{
    return this.httpClient.put<any>(`${this._api.api_url}/accesorios/${id}`, data,{headers:{Authorization:this.completeToken}})
  }

  deleteAccesorio(id: string): Observable<any>{
    return this.httpClient.delete<any>(`${this._api.api_url}/accesorios/${id}`,{headers:{Authorization:this.completeToken}})
  }

}
