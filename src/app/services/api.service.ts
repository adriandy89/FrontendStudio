import { Injectable } from '@angular/core';
import { LoginResponse, User } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api_url: string;
  private token: string;
  dataUser: LoginResponse;
  dataUsers: LoginResponse[];

  constructor(private httpClient: HttpClient) {
    this.token= ""
    //let arr = document.location.href.split('/',3)
    //this.api_url= `${arr[0]}//${arr[2]}/api`;
    this.api_url= 'http://localhost:3000/api';
  }

  register(user: User): Observable<LoginResponse>{
    this.token= this.getToken()
    const completeToken = `Bearer ${this.token}`;
    return this.httpClient.post<LoginResponse>(`${this.api_url}/register`,
      user,{headers:{Authorization:completeToken}}).pipe(tap(
        (res: LoginResponse) => {
          if (res){
            console.log(res.dataUser)
          }
        }
      ))
  }

  login(user: User): Observable<LoginResponse>{
    return this.httpClient.post<LoginResponse>(`${this.api_url}/login`,
      user).pipe(tap(
        (res: LoginResponse) => {
          if (res){
            this.dataUser= res
            //guardar el token
            console.log(res.dataUser)
            this.saveToken(
              res.dataUser.accessToken,
              res.dataUser.expiresIn,
              res.dataUser.usuario,
              res.dataUser.isAdmin)
          }
        }
      ))
  }

  updateUsuario(id, data): Observable<any>{
    this.token= this.getToken()
    const completeToken = `Bearer ${this.token}`;
    return this.httpClient.put<any>(`${this.api_url}/usuarios/${id}`, data,{headers:{Authorization:completeToken}})
  }

  deleteUsuario(id): Observable<any>{
    this.token= this.getToken()
    const completeToken = `Bearer ${this.token}`;
    return this.httpClient.delete<any>(`${this.api_url}/usuarios/${id}`,{headers:{Authorization:completeToken}})
  }

  getUsuarios(){
    this.token= this.getToken()
    const completeToken = `Bearer ${this.token}`;
    return this.httpClient.get<any>(`${this.api_url}/usuarios`,{headers:{Authorization:completeToken}})
  }
  getUsuarioXId(id){
    this.token= this.getToken()
    const completeToken = `Bearer ${this.token}`;
    return this.httpClient.get<any>(`${this.api_url}/usuarios/${id}`,{headers:{Authorization:completeToken}})
  }

  logout(): void{
    this.token= ''
    this.dataUser = null
    localStorage.clear()
  }

  private saveToken(token: string, expiresIn: string, usuario: string, isAdmin: boolean): void{
    localStorage.setItem('ACCESS_TOKEN', token)
    localStorage.setItem('EXPIRES_IN', expiresIn)
    localStorage.setItem('USER', usuario)
    if (isAdmin) {
      localStorage.setItem('IS_ADMIN', 'true')
    } else {
      localStorage.setItem('IS_ADMIN', 'false')
    }
    this.token = token
  }

  getToken(): string{
    if (!this.token){
      this.token = localStorage.getItem('ACCESS_TOKEN')
    }
    return this.token
  }

  getUsuario(): LoginResponse{
    if (this.dataUser){
      return this.dataUser
    }
    return null
  }

  validarToken(): Observable<any>{
    this.token= this.getToken()
    const completeToken = `Bearer ${this.token}`;
    return this.httpClient.get<any>(`${this.api_url}/protected`,{headers:{Authorization:completeToken}})
  }
  loginRegister(user: User): Observable<LoginResponse>{
    return this.httpClient.post<LoginResponse>(`${this.api_url}/login`, user)
  }
}
