import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

  completeToken: string

  constructor(private httpClient: HttpClient, private _api: ApiService) {
    const token= this._api.getToken()
    this.completeToken = `Bearer ${token}`;
   }

  getFoto(id: string): Observable<any>{
    return this.httpClient.get<any>(`${this._api.api_url}/fotos/${id}`,{headers:{Authorization:this.completeToken}})
  }
  setFoto(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/fotos/add`, data,{headers:{Authorization:this.completeToken}})
  }

  updateFoto(id: string, data): Observable<any>{
    return this.httpClient.put<any>(`${this._api.api_url}/fotos/${id}`, data,{headers:{Authorization:this.completeToken}})
  }

  deleteFoto(id: string): Observable<any>{
    return this.httpClient.delete<any>(`${this._api.api_url}/fotos/${id}`,{headers:{Authorization:this.completeToken}})
  }

}
