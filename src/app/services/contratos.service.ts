import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {

  contrato_id: string
  completeToken: string

  constructor(private httpClient: HttpClient, private _api: ApiService) {
    const token= this._api.getToken()
    this.completeToken = `Bearer ${token}`;
   }

  getContratos(): Observable<any>{
    return this.httpClient.get<any>(`${this._api.api_url}/contratos`,{headers:{Authorization:this.completeToken}})
  }
  getEstadisticas(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/estadisticas`, data, {headers:{Authorization:this.completeToken}})
  }
  getContratosPendientes(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/contratos/pendientes`, data, {headers:{Authorization:this.completeToken}})
  }
  getContratosPendientesIntervalo(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/contratos/intervalo`, data, {headers:{Authorization:this.completeToken}})
  }
  getContratosIntervalo(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/contratos/periodo`, data, {headers:{Authorization:this.completeToken}})
  }

  getContrato(): Observable<any>{
    return this.httpClient.get<any>(`${this._api.api_url}/contratos/${this.getContratoId()}`,{headers:{Authorization:this.completeToken}})
  }

  setContrato(data): Observable<any>{
    return this.httpClient.post<any>(`${this._api.api_url}/contratos/add`, data,{headers:{Authorization:this.completeToken}})
  }

  updateContrato(data): Observable<any>{
    return this.httpClient.put<any>(`${this._api.api_url}/contratos/${this.getContratoId()}`, data,{headers:{Authorization:this.completeToken}})
  }

  deleteContrato(): Observable<any>{
    return this.httpClient.delete<any>(`${this._api.api_url}/contratos/${this.getContratoId()}`,{headers:{Authorization:this.completeToken}})
  }

  setContratoId(contrato_id: string){
    localStorage.setItem('CONTRATO_ID', contrato_id)
  }

  getContratoId(){
    this.contrato_id = localStorage.getItem('CONTRATO_ID') || null
    return this.contrato_id
  }

  getHoraTipoNombrePorFechaCita(data){
    return this.httpClient.post<any>(`${this._api.api_url}/contratos/fecha`, data,{headers:{Authorization:this.completeToken}})
  }

  getNuevoNumeroContrato(){
    return this.httpClient.get<any>(`${this._api.api_url}/contrato/numero`, {headers:{Authorization:this.completeToken}})
  }

  // TIPO de Contratos
  getTiposContratos(){
    return this.httpClient.get<any>(`${this._api.api_url}/tipoContratos`,{headers:{Authorization:this.completeToken}})
  }
  // Tipo de Fotos
  getTiposFotos(){
    return this.httpClient.get<any>(`${this._api.api_url}/fotos`,{headers:{Authorization:this.completeToken}})
  }
  //Tipo de Accesorios
  getTipoAccesorios(){
    return this.httpClient.get<any>(`${this._api.api_url}/accesorios`,{headers:{Authorization:this.completeToken}})
  }

}
