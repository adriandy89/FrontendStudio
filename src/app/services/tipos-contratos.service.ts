import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TiposContratosService {

  completeToken: string

  constructor(private httpClient: HttpClient, private _api: ApiService) {
    const token= this._api.getToken()
    this.completeToken = `Bearer ${token}`;
   }

  getContrato(id): Observable<any>{
    return this.httpClient.get<any>(`${this._api.api_url}/tipoContratos/${id}`,{headers:{Authorization:this.completeToken}})
  }

  setContrato(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/tipoContratos/add`, data,{headers:{Authorization:this.completeToken}})
  }

  updateContrato(id, data): Observable<any>{
    return this.httpClient.put<any>(`${this._api.api_url}/tipoContratos/${id}`, data,{headers:{Authorization:this.completeToken}})
  }

  deleteContrato(id): Observable<any>{
    return this.httpClient.delete<any>(`${this._api.api_url}/tipoContratos/${id}`,{headers:{Authorization:this.completeToken}})
  }

}
